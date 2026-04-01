output "api_url" {
  description = "API Gateway invoke URL"
  value       = aws_api_gateway_stage.demo.invoke_url
}

output "api_key_id" {
  description = "ID of the API key"
  value       = aws_api_gateway_api_key.demo.id
}
