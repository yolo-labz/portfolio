# Local state (default for portfolio demo)
# To use S3 remote backend, uncomment below and run: terraform init -migrate-state
#
# terraform {
#   backend "s3" {
#     bucket         = "terraform-state-ACCOUNT_ID"
#     key            = "serverless-data-api/terraform.tfstate"
#     region         = "us-east-1"
#     dynamodb_table = "terraform-locks"
#     encrypt        = true
#   }
# }
