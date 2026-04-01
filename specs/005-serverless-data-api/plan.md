# Implementation Plan: Serverless Data API with Terraform IaC

**Branch**: `005-serverless-data-api` | **Date**: 2026-04-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-serverless-data-api/spec.md`

## Summary

Build a portfolio showcase of AWS serverless infrastructure provisioned entirely via Terraform: Lambda (Python 3.12 + Powertools) serving a CRUD API behind API Gateway (REST, API key auth, rate limiting), DynamoDB (single-table, on-demand), CloudWatch monitoring dashboard, and GitHub Actions CI/CD. The Terraform code IS the primary deliverable — a live AWS deployment is a bonus.

## Technical Context

**Language/Version**: Python 3.12 (Lambda handlers), HCL (Terraform)
**Primary Dependencies**: AWS Lambda Powertools v2, Pydantic v2 (Lambda); Terraform >= 1.7 (IaC)
**Storage**: DynamoDB (single-table, on-demand, zero idle cost)
**Testing**: `terraform validate`, manual API testing via curl/Swagger
**Target Platform**: AWS (Lambda + API Gateway + DynamoDB)
**Project Type**: Infrastructure-as-Code + serverless API
**Performance Goals**: p95 < 200ms (excluding cold starts)
**Constraints**: Zero cost when idle, no always-on resources, no VPC/NAT
**Scale/Scope**: ~15 Terraform resources, 5 modules, 5 CRUD endpoints

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Sell, Don't Tell | ✅ PASS | terraform plan output is concrete proof. Swagger UI is live demo. Architecture diagram shows infrastructure. |
| II. Static-First | ⚠️ N/A | This project is cloud-native (AWS), not static. It demonstrates a completely different skill set from the other projects. |
| III. Monorepo Discipline | ✅ PASS | Self-contained at `projects/serverless-data-api/`. Own Terraform state, own Lambda source. Does not affect other workspaces. |
| IV. Visual Polish | ✅ PASS | Clean architecture diagram, professional README, Swagger UI for API docs. |
| V. No AI Slop | ✅ PASS | README uses concrete language ("creates 15 resources", "$0/month when idle"). No buzzwords. |
| VI. Mixed-Stack Autonomy | ✅ PASS | Python Lambda + HCL Terraform — own toolchain, own deployment. Not managed by pnpm/Turbo. |

**Gate result**: PASS

## Project Structure

### Documentation

```text
specs/005-serverless-data-api/
├── plan.md
├── spec.md
├── research.md
├── data-model.md
├── quickstart.md
└── checklists/
    └── requirements.md
```

### Source Code

```text
projects/serverless-data-api/
├── infra/
│   ├── main.tf                    # Root module
│   ├── variables.tf               # Project variables
│   ├── outputs.tf                 # API URL, table name, API key
│   ├── providers.tf               # AWS provider
│   ├── backend.tf                 # Local (S3 documented)
│   ├── terraform.tfvars           # Demo defaults
│   └── modules/
│       ├── dynamodb/
│       │   ├── main.tf            # Table + GSI
│       │   ├── variables.tf
│       │   └── outputs.tf
│       ├── iam/
│       │   ├── main.tf            # Lambda role + DynamoDB policy
│       │   ├── variables.tf
│       │   └── outputs.tf
│       ├── lambda/
│       │   ├── main.tf            # Function + zip + Layer
│       │   ├── variables.tf
│       │   └── outputs.tf
│       ├── api_gateway/
│       │   ├── main.tf            # REST API, resources, methods, stage, API key, usage plan
│       │   ├── variables.tf
│       │   └── outputs.tf
│       └── monitoring/
│           ├── main.tf            # CloudWatch dashboard
│           ├── variables.tf
│           └── outputs.tf
├── lambda_src/
│   ├── handler.py                 # Powertools event handler — CRUD routes
│   ├── models.py                  # Pydantic schemas
│   ├── db.py                      # DynamoDB wrapper
│   └── requirements.txt           # pydantic
├── openapi.yaml                   # OpenAPI 3.1 spec
├── .github/
│   └── workflows/
│       └── terraform.yml          # CI/CD pipeline
├── docs/
│   ├── plan-output.txt            # Sample terraform plan
│   └── architecture.md            # Mermaid diagram
├── package.json                   # Thin Turbo wrapper
└── README.md
```

## Implementation Order

### Step 1: Lambda Source Code

1. Create `lambda_src/models.py`: Pydantic ItemCreate, ItemResponse
2. Create `lambda_src/db.py`: DynamoDB table wrapper (get, put, query, delete, update)
3. Create `lambda_src/handler.py`: Powertools APIGatewayRestResolver with CRUD routes + `/docs` Swagger UI endpoint
4. Create `lambda_src/requirements.txt`: pydantic>=2.0
5. Create `openapi.yaml`: OpenAPI 3.1 spec for all endpoints

### Step 2: Terraform Modules (parallel)

1. Create `infra/modules/dynamodb/` — table with PK/SK, GSI1, on-demand, PITR
2. Create `infra/modules/iam/` — Lambda execution role, DynamoDB read/write policy, CloudWatch logs policy
3. Create `infra/modules/lambda/` — function (arm64, 256MB, 29s timeout), zip archive, Powertools Layer
4. Create `infra/modules/api_gateway/` — REST API, {proxy+} resource, ANY method, Lambda integration, deployment, stage, API key, usage plan (1000/day)
5. Create `infra/modules/monitoring/` — CloudWatch dashboard (invocations, duration, errors, DynamoDB capacity)

### Step 3: Root Terraform Config

1. Create `infra/providers.tf`: AWS provider, required_version
2. Create `infra/variables.tf`: project_name, environment, region
3. Create `infra/terraform.tfvars`: demo defaults
4. Create `infra/backend.tf`: local state, S3 backend commented
5. Create `infra/main.tf`: wire all 5 modules together
6. Create `infra/outputs.tf`: api_url, api_key_value, table_name, dashboard_url

### Step 4: CI/CD + Documentation

1. Create `.github/workflows/terraform.yml`: fmt → validate → plan → apply pipeline
2. Create `docs/plan-output.txt`: hand-crafted sample terraform plan output showing ~15 resources
3. Create `docs/architecture.md`: Mermaid diagram
4. Create `README.md`: architecture, modules, plan sample, deploy guide, API docs, cost analysis

### Step 5: Verification + Portfolio

1. Run `terraform validate` on all modules
2. Run `terraform fmt -check` to verify formatting
3. Create `package.json` Turbo wrapper
4. Update portfolio `projects.ts` with source link
5. Commit, push, PR, merge

## Complexity Tracking

| Note | Justification |
|------|--------------|
| No Dokku deployment | This project deploys to AWS, not Dokku. The Terraform code is the deliverable. |
| REST API v1 (not HTTP API v2) | Needed for built-in API key + usage plan features. More expensive but more features to showcase. |
| Single-table DynamoDB | Advanced pattern that demonstrates expertise. Simpler to Terraform (one resource). |
