# Security Groups Module
# Creates security groups for ALB, ECS, and RDS

# ALB Security Group
resource "aws_security_group" "alb" {
  name        = "${var.project_name}-alb-sg-${var.environment}"
  description = "Security group for Application Load Balancer"
  vpc_id      = var.vpc_id

  tags = {
    Name        = "${var.project_name}-alb-sg-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# ALB Ingress Rules
resource "aws_vpc_security_group_ingress_rule" "alb_http" {
  security_group_id = aws_security_group.alb.id
  description       = "Allow HTTP from internet"
  
  cidr_ipv4   = "0.0.0.0/0"
  from_port   = 80
  to_port     = 80
  ip_protocol = "tcp"

  tags = {
    Name = "alb-http-ingress"
  }
}

resource "aws_vpc_security_group_ingress_rule" "alb_https" {
  security_group_id = aws_security_group.alb.id
  description       = "Allow HTTPS from internet"
  
  cidr_ipv4   = "0.0.0.0/0"
  from_port   = 443
  to_port     = 443
  ip_protocol = "tcp"

  tags = {
    Name = "alb-https-ingress"
  }
}

# ALB Egress Rule
resource "aws_vpc_security_group_egress_rule" "alb_all" {
  security_group_id = aws_security_group.alb.id
  description       = "Allow all outbound traffic"
  
  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "-1"

  tags = {
    Name = "alb-all-egress"
  }
}

# ECS Security Group
resource "aws_security_group" "ecs" {
  name        = "${var.project_name}-ecs-sg-${var.environment}"
  description = "Security group for ECS tasks"
  vpc_id      = var.vpc_id

  tags = {
    Name        = "${var.project_name}-ecs-sg-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# ECS Ingress Rules - Allow traffic from ALB
resource "aws_vpc_security_group_ingress_rule" "ecs_from_alb_frontend" {
  security_group_id = aws_security_group.ecs.id
  description       = "Allow frontend traffic from ALB"
  
  referenced_security_group_id = aws_security_group.alb.id
  from_port                    = var.frontend_port
  to_port                      = var.frontend_port
  ip_protocol                  = "tcp"

  tags = {
    Name = "ecs-frontend-from-alb"
  }
}

resource "aws_vpc_security_group_ingress_rule" "ecs_from_alb_backend" {
  security_group_id = aws_security_group.ecs.id
  description       = "Allow backend traffic from ALB"
  
  referenced_security_group_id = aws_security_group.alb.id
  from_port                    = var.backend_port
  to_port                      = var.backend_port
  ip_protocol                  = "tcp"

  tags = {
    Name = "ecs-backend-from-alb"
  }
}

# ECS Egress Rule
resource "aws_vpc_security_group_egress_rule" "ecs_all" {
  security_group_id = aws_security_group.ecs.id
  description       = "Allow all outbound traffic"
  
  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "-1"

  tags = {
    Name = "ecs-all-egress"
  }
}

# RDS Security Group
resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg-${var.environment}"
  description = "Security group for RDS database"
  vpc_id      = var.vpc_id

  tags = {
    Name        = "${var.project_name}-rds-sg-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# RDS Ingress Rule - Allow PostgreSQL from ECS only
resource "aws_vpc_security_group_ingress_rule" "rds_from_ecs" {
  security_group_id = aws_security_group.rds.id
  description       = "Allow PostgreSQL from ECS tasks"
  
  referenced_security_group_id = aws_security_group.ecs.id
  from_port                    = 5432
  to_port                      = 5432
  ip_protocol                  = "tcp"

  tags = {
    Name = "rds-postgresql-from-ecs"
  }
}

# RDS Egress Rule (RDS doesn't need outbound, but AWS requires at least one rule)
resource "aws_vpc_security_group_egress_rule" "rds_none" {
  security_group_id = aws_security_group.rds.id
  description       = "No outbound traffic needed"
  
  cidr_ipv4   = "127.0.0.1/32"
  ip_protocol = "-1"

  tags = {
    Name = "rds-no-egress"
  }
}