variable "function_name" {
  description = "Name of the Lambda function"
  type        = string
}

variable "api_name" {
  description = "Name of the API Gateway REST API"
  type        = string
}

variable "table_name" {
  description = "Name of the DynamoDB table"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}
