variable "project_name" {
  description = "Project name"
  type        = string
  default     = "brewsecops"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-central-1"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "az_count" {
  description = "Number of availability zones"
  type        = number
  default     = 2
}

# Domain Configuration (UPDATE WITH MY DOMAIN)
variable "domain_name" {
  description = "Domain name from Namecheap"
  type        = string
  # TODO: Replace with your actual domain
  default = "brewsecops.online"
}

# Database Configuration
variable "db_master_password" {
  description = "Master password for RDS"
  type        = string
  sensitive   = true
  # Set via environment variable: TF_VAR_db_master_password
}

# Container Image Configuration
variable "frontend_image_tag" {
  description = "Frontend container image tag"
  type        = string
  default     = "latest"
}

variable "backend_image_tag" {
  description = "Backend container image tag"
  type        = string
  default     = "latest"
}

# WAF Configuration
variable "waf_rate_limit" {
  description = "WAF rate limit per 5 minutes"
  type        = number
  default     = 2000
}

variable "waf_ip_whitelist" {
  description = "IP addresses to whitelist in WAF"
  type        = list(string)
  default     = []
}

