variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where ALB will be created"
  type        = string
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs for ALB"
  type        = list(string)
}

variable "security_group_id" {
  description = "Security group ID for ALB"
  type        = string
}

variable "frontend_port" {
  description = "Port for frontend target group"
  type        = number
  default     = 80
}

variable "backend_port" {
  description = "Port for backend target group"
  type        = number
  default     = 3001
}

variable "frontend_health_check_path" {
  description = "Health check path for frontend"
  type        = string
  default     = "/"
}

variable "backend_health_check_path" {
  description = "Health check path for backend"
  type        = string
  default     = "/api/health"
}

variable "deletion_protection" {
  description = "Enable deletion protection for ALB"
  type        = bool
  default     = false
}

variable "certificate_arn" {
  description = "ARN of the ACM certificate for HTTPS"
  type        = string
}

variable "domain_name" {
  description = "The domain name for the ALB"
  type        = string
}