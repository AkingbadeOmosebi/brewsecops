# VPC Outputs
output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}



# RDS Outputs
output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = module.rds.db_instance_endpoint
}

# ECS Outputs
output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = module.ecs_cluster.cluster_name
}

# ALB Outputs
output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = module.alb.alb_dns_name
}

# Route53 Outputs
output "domain_fqdn" {
  description = "Fully qualified domain name"
  value       = module.route53.fqdn
}

output "route53_nameservers" {
  description = "Name servers for Route53 (add these to Namecheap)"
  value       = module.route53.zone_name_servers
}

# ACM Output
output "certificate_arn" {
  description = "ARN of the SSL certificate"
  value       = module.acm.certificate_arn
}

# WAF Output
output "waf_web_acl_arn" {
  description = "ARN of the WAF Web ACL"
  value       = module.waf.web_acl_arn
}



# Frontend Service
output "frontend_service_name" {
  description = "Name of the frontend ECS service"
  value       = module.ecs_service_frontend.service_name
}

# Backend Service
output "backend_service_name" {
  description = "Name of the backend ECS service"
  value       = module.ecs_service_backend.service_name
}



# Application URL
output "application_url" {
  description = "URL to access the application"
  value       = "http://${module.alb.alb_dns_name}"
}

output "application_domain_url" {
  description = "URL with custom domain (after DNS propagation)"
  value       = "https://${module.route53.fqdn}"
}