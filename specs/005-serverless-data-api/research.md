# Research: Serverless Data API with Terraform IaC

**Branch**: `005-serverless-data-api`
**Date**: 2026-04-01

## R1: API Gateway Type

**Decision**: REST API (v1), not HTTP API (v2).

**Rationale**: REST API has built-in API key authentication, usage plans, and rate limiting — these are portfolio features worth demonstrating. HTTP API is cheaper but lacks these built-in management features.

## R2: Lambda Handler Framework

**Decision**: AWS Lambda Powertools `APIGatewayRestResolver` (not Mangum+FastAPI).

**Rationale**: Lighter deployment package (faster cold starts), native Lambda integration (context, event), built-in structured logging/tracing/metrics. Powertools v2 has an event handler that routes requests like a micro-framework. Using the AWS Powertools Lambda Layer avoids packaging dependencies entirely.

## R3: DynamoDB Design

**Decision**: Single-table design with PK/SK pattern, on-demand billing.

**Rationale**: Demonstrates advanced DynamoDB knowledge. Single table = one Terraform resource. On-demand = zero cost when idle. PK: `ITEM#<id>`, SK: `METADATA`. Collection key: PK: `ITEMS`, SK: `ITEM#<id>` for list queries.

## R4: Terraform Module Structure

**Decision**: 5 modules — `lambda`, `api_gateway`, `dynamodb`, `iam`, `monitoring`. Root module wires them together.

**Rationale**: Shows modular IaC design. Each module has `variables.tf`, `main.tf`, `outputs.tf`. Modules communicate via outputs (e.g., iam exports role_arn → lambda consumes it).

## R5: State Management

**Decision**: Local state by default, S3+DynamoDB backend documented but commented out.

**Rationale**: Self-contained demo — `terraform apply` works without any pre-existing AWS resources. The commented S3 backend shows the reviewer you know production patterns without forcing them to set it up.

## R6: Python Runtime

**Decision**: Python 3.12 on arm64 (Graviton2).

**Rationale**: arm64 is 20% cheaper and generally faster. Python 3.12 has improved startup time. Powertools Lambda Layer available for arm64.

## R7: API Documentation

**Decision**: Hand-written OpenAPI 3.1 YAML spec + Swagger UI served from a Lambda endpoint (`/docs`).

**Rationale**: Full control over the spec. Swagger UI via CDN (swagger-ui-dist) loaded in an HTML response from the Lambda. No external hosting needed.

## R8: CI/CD Pipeline

**Decision**: GitHub Actions with `terraform fmt -check` → `validate` → `plan` → `apply`. AWS auth via OIDC federation (no static keys).

**Rationale**: OIDC is the modern best practice. Plan output posted to PR comments. Apply only on merge to main. Shows production governance.

**Portfolio note**: The CI workflow file is the deliverable — it doesn't need to actually run (requires AWS OIDC setup). The workflow code demonstrates the pattern.

## R9: Monitoring

**Decision**: CloudWatch dashboard provisioned via Terraform with widgets for: Lambda invocations, p50/p99 duration, API Gateway 4xx/5xx, DynamoDB consumed capacity.

**Rationale**: Dashboard is defined in HCL — shows observability as code. Screenshot in README serves as the demo artifact.

## R10: Deployment Approach

**Decision**: This project does NOT deploy to Dokku. It deploys to AWS via `terraform apply`. For the portfolio, the Terraform code + README + sample plan output are the primary deliverables. A live AWS deployment is a bonus that requires AWS credentials.

**Rationale**: Unlike the other projects (which deploy to Dokku), this one demonstrates cloud-native deployment. Forcing it into Dokku would defeat the purpose.
