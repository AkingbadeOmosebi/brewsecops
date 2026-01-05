variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where security groups will be created"
  type        = string
}

variable "frontend_port" {
  description = "Port for frontend application"
  type        = number
  default     = 80
}

variable "backend_port" {
  description = "Port for backend application"
  type        = number
  default     = 3001
}