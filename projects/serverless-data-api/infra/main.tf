locals {
  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

module "dynamodb" {
  source     = "./modules/dynamodb"
  table_name = "${var.project_name}-${var.environment}"
  tags       = local.tags
}

module "iam" {
  source    = "./modules/iam"
  table_arn = module.dynamodb.table_arn
  project   = var.project_name
  tags      = local.tags
}

module "lambda" {
  source        = "./modules/lambda"
  function_name = "${var.project_name}-handler"
  role_arn      = module.iam.lambda_role_arn
  source_dir    = "${path.root}/../lambda_src"
  table_name    = module.dynamodb.table_name
  environment   = var.environment
  region        = var.region
  tags          = local.tags
}

module "api_gateway" {
  source               = "./modules/api_gateway"
  api_name             = var.project_name
  lambda_invoke_arn    = module.lambda.invoke_arn
  lambda_function_name = module.lambda.function_name
  tags                 = local.tags
}

module "monitoring" {
  source        = "./modules/monitoring"
  function_name = module.lambda.function_name
  api_name      = var.project_name
  table_name    = module.dynamodb.table_name
  region        = var.region
}

data "aws_api_gateway_api_key" "demo" {
  id = module.api_gateway.api_key_id
}
