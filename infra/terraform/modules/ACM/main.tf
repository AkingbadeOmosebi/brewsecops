# ACM Module: Creates SSL/TLS certificate with DNS validation
# Reference: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/acm_certificate

resource "aws_acm_certificate" "main" {
  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = var.subject_alternative_names

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "${var.project_name}-cert-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# DNS validation records: This creates the "handshake" CNAME record in Route 53.
# Since your Namecheap NS records point here, ACM will see this and validate the cert.
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.main.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = var.zone_id # This MUST be the Zone ID for brewsecops.online
}

# Certificate validation: This is a "wait" resource. 
# It doesn't create infra; it tells Terraform to stay on this step until AWS confirms validation.
resource "aws_acm_certificate_validation" "main" {
  certificate_arn         = aws_acm_certificate.main.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}