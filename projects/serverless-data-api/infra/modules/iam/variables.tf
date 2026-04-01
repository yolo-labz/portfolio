variable "table_arn" {
  description = "ARN of the DynamoDB table"
  type        = string
}

variable "project" {
  description = "Project name for resource naming"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
