variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "serverless-data-api"
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
