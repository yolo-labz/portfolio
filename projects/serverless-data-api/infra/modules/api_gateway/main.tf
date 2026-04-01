resource "aws_api_gateway_rest_api" "api" {
  name        = var.api_name
  description = "Serverless CRUD API"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = var.tags
}

# ── Proxy resource {proxy+} ──────────────────────────────────────────

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy_any" {
  rest_api_id      = aws_api_gateway_rest_api.api.id
  resource_id      = aws_api_gateway_resource.proxy.id
  http_method      = "ANY"
  authorization    = "NONE"
  api_key_required = true
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.proxy.id
  http_method             = aws_api_gateway_method.proxy_any.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = var.lambda_invoke_arn
}

# ── Root resource (/) ────────────────────────────────────────────────

resource "aws_api_gateway_method" "root_any" {
  rest_api_id      = aws_api_gateway_rest_api.api.id
  resource_id      = aws_api_gateway_rest_api.api.root_resource_id
  http_method      = "ANY"
  authorization    = "NONE"
  api_key_required = true
}

resource "aws_api_gateway_integration" "lambda_root" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_rest_api.api.root_resource_id
  http_method             = aws_api_gateway_method.root_any.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = var.lambda_invoke_arn
}

# ── CORS OPTIONS on proxy resource ───────────────────────────────────

resource "aws_api_gateway_method" "proxy_options" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_method.proxy_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "options_200" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_method.proxy_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "options" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_method.proxy_options.http_method
  status_code = aws_api_gateway_method_response.options_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}

# ── Deployment & Stage ───────────────────────────────────────────────

resource "aws_api_gateway_deployment" "demo" {
  rest_api_id = aws_api_gateway_rest_api.api.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.proxy.id,
      aws_api_gateway_method.proxy_any.id,
      aws_api_gateway_integration.lambda.id,
      aws_api_gateway_method.root_any.id,
      aws_api_gateway_integration.lambda_root.id,
      aws_api_gateway_method.proxy_options.id,
      aws_api_gateway_integration.options.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    aws_api_gateway_method.proxy_any,
    aws_api_gateway_integration.lambda,
    aws_api_gateway_method.root_any,
    aws_api_gateway_integration.lambda_root,
    aws_api_gateway_method.proxy_options,
    aws_api_gateway_integration.options,
  ]
}

resource "aws_api_gateway_stage" "demo" {
  deployment_id = aws_api_gateway_deployment.demo.id
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = "demo"

  tags = var.tags
}

# ── API Key & Usage Plan ─────────────────────────────────────────────

resource "aws_api_gateway_api_key" "demo" {
  name    = "${var.api_name}-demo-key"
  enabled = true

  tags = var.tags
}

resource "aws_api_gateway_usage_plan" "demo" {
  name = "${var.api_name}-demo-plan"

  api_stages {
    api_id = aws_api_gateway_rest_api.api.id
    stage  = aws_api_gateway_stage.demo.stage_name
  }

  throttle_settings {
    burst_limit = 10
    rate_limit  = 5
  }

  quota_settings {
    limit  = 1000
    period = "DAY"
  }

  tags = var.tags
}

resource "aws_api_gateway_usage_plan_key" "demo" {
  key_id        = aws_api_gateway_api_key.demo.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.demo.id
}

# ── Lambda Permission ────────────────────────────────────────────────

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}
