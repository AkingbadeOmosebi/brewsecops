# Backend configuration for dev environment
terraform {
  backend "s3" {
    bucket         = "brewsecops-terraform-state-194722436853"
    key            = "dev/terraform.tfstate"
    region         = "eu-central-1"
    dynamodb_table = "brewsecops-terraform-locks"
    encrypt        = true
  }
}