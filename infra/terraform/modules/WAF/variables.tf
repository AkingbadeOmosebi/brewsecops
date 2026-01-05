variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "alb_arn" {
  description = "ARN of the Application Load Balancer to protect"
  type        = string
}

variable "rate_limit" {
  description = "Rate limit for requests per 5 minutes from single IP"
  type        = number
  default     = 2000
}

variable "ip_whitelist" {
  description = "List of IP addresses to whitelist (CIDR notation)"
  type        = list(string)
  default     = []
}

variable "blocked_countries" {
  description = "List of country codes to block (e.g., ['CN', 'RU'])"
  type        = list(string)
  default     = []
}

variable "log_retention_days" {
  description = "Number of days to retain WAF logs"
  type        = number
  default     = 30
}

variable "aws_region" {
  description = "AWS region for WAF logging"
  type        = string
}