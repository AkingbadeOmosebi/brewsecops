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

variable "enable_captcha" {
  description = "Enable CAPTCHA challenges for suspicious requests"
  type        = bool
  default     = false
}

variable "captcha_on_rate_limit" {
  description = "Show CAPTCHA challenge instead of blocking on rate limit (requires enable_captcha)"
  type        = bool
  default     = false
}

variable "ip_whitelist" {
  description = "List of IP addresses to whitelist (CIDR notation). These IPs bypass all WAF rules"
  type        = list(string)
  default     = []
}

variable "enable_geo_blocking" {
  description = "Enable geographic blocking based on country codes"
  type        = bool
  default     = false
}

variable "blocked_countries" {
  description = "List of country codes to block (ISO 3166-1 alpha-2). Example: ['CN', 'RU', 'KP']"
  type        = list(string)
  default     = []
}

variable "log_retention_days" {
  description = "Number of days to retain WAF logs in CloudWatch"
  type        = number
  default     = 30
}

variable "aws_region" {
  description = "AWS region for WAF logging"
  type        = string
}
