# Dev Environment - Main Configuration
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}

# VPC Module
module "vpc" {
  source = "../../modules/vpc"

  project_name = var.project_name
  environment  = var.environment
  vpc_cidr     = var.vpc_cidr
  az_count     = var.az_count
}

# Security Groups Module
module "security_groups" {
  source = "../../modules/security-groups"

  project_name  = var.project_name
  environment   = var.environment
  vpc_id        = module.vpc.vpc_id
  frontend_port = 80
  backend_port  = 3001
}

# RDS Module
module "rds" {
  source                  = "../../modules/rds"
  project_name            = var.project_name
  environment             = var.environment
  postgres_version        = "15"
  instance_class          = "db.t3.micro"
  allocated_storage       = 20
  database_name           = "brewsecops"
  master_username         = "postgres"
  master_password         = var.db_master_password
  security_group_id       = module.security_groups.rds_security_group_id
  db_subnet_group_name    = module.vpc.db_subnet_group_name
  multi_az                = true
  deletion_protection     = false
  skip_final_snapshot     = true
  backup_retention_period = 7
}

# ECS Cluster Module
module "ecs_cluster" {
  source = "../../modules/ecs-cluster"

  project_name               = var.project_name
  environment                = var.environment
  container_insights_enabled = true
}

# ALB Module
module "alb" {
  source = "../../modules/alb"

  project_name               = var.project_name
  environment                = var.environment
  vpc_id                     = module.vpc.vpc_id
  public_subnet_ids          = module.vpc.public_subnet_ids
  security_group_id          = module.security_groups.alb_security_group_id
  domain_name                = var.domain_name
  frontend_port              = 80
  backend_port               = 3001
  frontend_health_check_path = "/"
  backend_health_check_path  = "/api/health"
  deletion_protection        = false
  certificate_arn            = module.acm.certificate_arn
}

# Route53 Module
module "route53" {
  source = "../../modules/route53"

  project_name = var.project_name
  environment  = var.environment
  domain_name  = var.domain_name
  subdomain    = var.environment # Creates dev.brewsecops.online, as a prefix
  alb_dns_name = module.alb.alb_dns_name
  alb_zone_id  = module.alb.alb_zone_id
  # REMOVED: create_hosted_zone (no longer exists in module)
}

# ACM Module
module "acm" {
  source = "../../modules/ACM"

  project_name = var.project_name
  environment  = var.environment
  domain_name  = "${var.environment}.${var.domain_name}"
  zone_id      = module.route53.zone_id
}

# WAF Module
module "waf" {
  source = "../../modules/WAF"

  project_name        = var.project_name
  environment         = var.environment
  alb_arn             = module.alb.alb_arn
  aws_region          = var.aws_region
  rate_limit          = var.waf_rate_limit
  ip_whitelist        = var.waf_ip_whitelist
  blocked_countries   = var.blocked_countries
  enable_geo_blocking = var.enable_geo_blocking
  log_retention_days  = 30
}



# ECS Service - Frontend
module "ecs_service_frontend" {
  source = "../../modules/ecs-service"

  project_name       = var.project_name
  environment        = var.environment
  service_name       = "frontend"
  cluster_id         = module.ecs_cluster.cluster_id
  cluster_name       = module.ecs_cluster.cluster_name
  container_image    = "194722436853.dkr.ecr.eu-central-1.amazonaws.com/brewsecops-frontend:${var.frontend_image_tag}"
  container_port     = 80
  cpu                = 512
  memory             = 1024
  desired_count      = 2
  private_subnet_ids = module.vpc.private_subnet_ids
  security_group_id  = module.security_groups.ecs_security_group_id
  target_group_arn   = module.alb.frontend_target_group_arn
  aws_region         = var.aws_region

  environment_variables = []

  health_check_grace_period = 300
  enable_execute_command    = true
  log_retention_days        = 7

  enable_autoscaling        = true
  autoscaling_min_capacity  = 2
  autoscaling_max_capacity  = 4
  autoscaling_cpu_target    = 70
  autoscaling_memory_target = 80
}

# ECS Service - Backend
module "ecs_service_backend" {
  source = "../../modules/ecs-service"

  project_name       = var.project_name
  environment        = var.environment
  service_name       = "backend"
  cluster_id         = module.ecs_cluster.cluster_id
  cluster_name       = module.ecs_cluster.cluster_name
  container_image    = "194722436853.dkr.ecr.eu-central-1.amazonaws.com/brewsecops-backend:${var.backend_image_tag}"
  container_port     = 3001
  cpu                = 512
  memory             = 1024
  desired_count      = 2
  private_subnet_ids = module.vpc.private_subnet_ids
  security_group_id  = module.security_groups.ecs_security_group_id
  target_group_arn   = module.alb.backend_target_group_arn
  aws_region         = var.aws_region

  environment_variables = [
    {
      name  = "DB_HOST"
      value = module.rds.db_instance_address
    },
    {
      name  = "DB_PORT"
      value = tostring(module.rds.db_instance_port)
    },
    {
      name  = "DB_NAME"
      value = module.rds.db_name
    },
    {
      name  = "DB_USER"
      value = module.rds.db_username
    },
    {
      name  = "DB_PASSWORD"
      value = var.db_master_password
    },
    {
      name  = "PORT"
      value = "3001"
    }
  ]


  # Database password as secret (I'll need to create this in Secrets Manager)
  secrets = []

  health_check_grace_period = 300
  enable_execute_command    = true
  log_retention_days        = 7

  enable_autoscaling        = true
  autoscaling_min_capacity  = 2
  autoscaling_max_capacity  = 6
  autoscaling_cpu_target    = 70
  autoscaling_memory_target = 80
}


# OIDC Module for GitHub Actions
module "oidc" {
  source       = "../../modules/oidc"
  project_name = var.project_name
  environment  = var.environment
  aws_region   = var.aws_region
  github_org   = "AkingbadeOmosebi"
  github_repo  = "brewsecops"
}