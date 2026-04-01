output "api_url" {
  description = "API Gateway invoke URL"
  value       = module.api_gateway.api_url
}

output "api_key_value" {
  description = "API key for authentication"
  value       = data.aws_api_gateway_api_key.demo.value
  sensitive   = true
}

output "table_name" {
  description = "DynamoDB table name"
  value       = module.dynamodb.table_name
}

output "dashboard_url" {
  description = "CloudWatch dashboard URL"
  value       = "https://${var.region}.console.aws.amazon.com/cloudwatch/home?region=${var.region}#dashboards:name=${module.monitoring.dashboard_name}"
}
