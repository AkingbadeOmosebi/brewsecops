variable "aws_region" {
  description = "AWS region for infrastructure"
  type        = string
  default     = "eu-central-1"
}

variable "state_bucket_name" {
  description = "S3 bucket name for Terraform state"
  type        = string
  default     = "brewsecops-terraform-state-194722436853"
}

variable "lock_table_name" {
  description = "DynamoDB table name for state locking"
  type        = string
  default     = "brewsecops-terraform-locks"
}