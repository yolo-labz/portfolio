variable "function_name" {
  description = "Name of the Lambda function"
  type        = string
}

variable "role_arn" {
  description = "ARN of the IAM role for the Lambda function"
  type        = string
}

variable "source_dir" {
  description = "Path to the Lambda source code directory"
  type        = string
}

variable "table_name" {
  description = "Name of the DynamoDB table"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "demo"
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
