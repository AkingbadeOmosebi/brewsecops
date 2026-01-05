output "repository_urls" {
  description = "URLs of ECR repositories"
  value = {
    for k, v in aws_ecr_repository.main : k => v.repository_url
  }
}

output "repository_arns" {
  description = "ARNs of ECR repositories"
  value = {
    for k, v in aws_ecr_repository.main : k => v.arn
  }
}

output "repository_names" {
  description = "Names of ECR repositories"
  value = {
    for k, v in aws_ecr_repository.main : k => v.name
  }
}

output "registry_id" {
  description = "Registry ID where repositories are created"
  value       = values(aws_ecr_repository.main)[0].registry_id
}