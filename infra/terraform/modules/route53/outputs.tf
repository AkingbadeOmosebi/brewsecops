output "zone_id" {
  description = "ID of the Route53 hosted zone"
  value       = data.aws_route53_zone.main.zone_id
}

output "zone_name_servers" {
  description = "Name servers for the hosted zone"
  value       = data.aws_route53_zone.main.name_servers
}

output "fqdn" {
  description = "Fully qualified domain name"
  value       = aws_route53_record.alb.fqdn
}