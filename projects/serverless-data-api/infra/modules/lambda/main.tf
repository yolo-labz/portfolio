data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = var.source_dir
  output_path = "${path.module}/lambda.zip"
}

resource "aws_lambda_function" "api_handler" {
  function_name    = var.function_name
  runtime          = "python3.12"
  handler          = "handler.handler"
  architectures    = ["arm64"]
  memory_size      = 256
  timeout          = 29
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  role             = var.role_arn

  environment {
    variables = {
      TABLE_NAME               = var.table_name
      POWERTOOLS_SERVICE_NAME  = var.function_name
      POWERTOOLS_LOG_LEVEL     = var.environment == "prod" ? "INFO" : "DEBUG"
      ENVIRONMENT              = var.environment
    }
  }

  layers = [
    "arn:aws:lambda:${var.region}:017000801446:layer:AWSLambdaPowertoolsPythonV2-Arm64:79"
  ]

  tags = var.tags
}
