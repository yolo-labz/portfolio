resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.function_name}-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Invocations", "FunctionName", var.function_name, { stat = "Sum" }]
          ]
          period = 300
          region = var.region
          title  = "Lambda Invocations"
        }
      },
      {
        type   = "metric"
        x      = 6
        y      = 0
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Duration", "FunctionName", var.function_name, { stat = "p50", label = "p50" }],
            ["AWS/Lambda", "Duration", "FunctionName", var.function_name, { stat = "p99", label = "p99" }]
          ]
          period = 300
          region = var.region
          title  = "Lambda Duration (p50/p99)"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Errors", "FunctionName", var.function_name, { stat = "Sum" }]
          ]
          period = 300
          region = var.region
          title  = "Lambda Errors"
        }
      },
      {
        type   = "metric"
        x      = 6
        y      = 6
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/ApiGateway", "4XXError", "ApiName", var.api_name, { stat = "Sum" }]
          ]
          period = 300
          region = var.region
          title  = "API Gateway 4xx Errors"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 12
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/ApiGateway", "5XXError", "ApiName", var.api_name, { stat = "Sum" }]
          ]
          period = 300
          region = var.region
          title  = "API Gateway 5xx Errors"
        }
      },
      {
        type   = "metric"
        x      = 6
        y      = 12
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/ApiGateway", "Latency", "ApiName", var.api_name, { stat = "p99" }]
          ]
          period = 300
          region = var.region
          title  = "API Gateway Latency (p99)"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 18
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/DynamoDB", "ConsumedReadCapacityUnits", "TableName", var.table_name, { stat = "Sum" }]
          ]
          period = 300
          region = var.region
          title  = "DynamoDB Read Capacity"
        }
      },
      {
        type   = "metric"
        x      = 6
        y      = 18
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/DynamoDB", "ConsumedWriteCapacityUnits", "TableName", var.table_name, { stat = "Sum" }]
          ]
          period = 300
          region = var.region
          title  = "DynamoDB Write Capacity"
        }
      }
    ]
  })
}
