output "certificate_domain_name" {
  description = "Domain name of the certificate"
  value       = aws_acm_certificate.main.domain_name
}

output "certificate_status" {
  description = "Status of the certificate"
  value       = aws_acm_certificate.main.status
}

output "certificate_arn" {
  description = "The ARN of the certificate. Use this to attach to ALB listeners."
  value       = aws_acm_certificate_validation.main.certificate_arn 
}