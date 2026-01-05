variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "container_insights_enabled" {
  description = "Enable Container Insights for monitoring"
  type        = bool
  default     = true
}