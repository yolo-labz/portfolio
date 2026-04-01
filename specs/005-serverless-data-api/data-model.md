# Data Model: Serverless Data API

**Branch**: `005-serverless-data-api`
**Date**: 2026-04-01

## DynamoDB Table Schema

**Table name**: `serverless-data-api-{environment}`
**Billing**: PAY_PER_REQUEST (on-demand)

| Attribute | Type | Key | Description |
|-----------|------|-----|-------------|
| PK | String | Partition Key | `ITEM#<uuid>` for items, `ITEMS` for collection |
| SK | String | Sort Key | `METADATA` for item detail, `ITEM#<uuid>` for collection entries |
| GSI1PK | String | GSI1 Partition | `CAT#<category>` for category queries |
| GSI1SK | String | GSI1 Sort | `ITEM#<created_at>#<id>` for date-sorted category queries |
| id | String | — | UUID v4 |
| name | String | — | Required, 1-255 chars |
| description | String | — | Optional, max 1000 chars |
| category | String | — | Required, lowercase snake_case |
| price | Number | — | Required, > 0 |
| tags | List[String] | — | Optional |
| created_at | String | — | ISO 8601 UTC |
| updated_at | String | — | ISO 8601 UTC |

### Access Patterns

| Pattern | Key Condition | Index |
|---------|--------------|-------|
| Get item by ID | PK = `ITEM#<id>`, SK = `METADATA` | Table |
| List all items | PK = `ITEMS`, SK begins_with `ITEM#` | Table |
| List by category | GSI1PK = `CAT#<category>` | GSI1 |
| Delete item | PK = `ITEM#<id>`, SK = `METADATA` | Table |

### Pydantic Models (Lambda)

```python
class ItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = Field(None, max_length=1000)
    category: str = Field(..., pattern=r"^[a-z_]+$")
    price: float = Field(..., gt=0, le=999999.99)
    tags: list[str] = Field(default_factory=list)

class ItemResponse(ItemCreate):
    id: str
    created_at: str
    updated_at: str
```

## File Inventory

### Terraform (`projects/serverless-data-api/infra/`)

| File | Purpose |
|------|---------|
| `main.tf` | Root module — wires child modules |
| `variables.tf` | Project-wide variables (project_name, environment, region) |
| `outputs.tf` | API URL, table name, API key ID |
| `providers.tf` | AWS provider, required_version |
| `backend.tf` | Local state default, S3 backend commented |
| `terraform.tfvars` | Default values for demo |
| `modules/dynamodb/main.tf` | DynamoDB table + GSI |
| `modules/dynamodb/variables.tf` | table_name, tags |
| `modules/dynamodb/outputs.tf` | table_name, table_arn |
| `modules/iam/main.tf` | Lambda execution role + DynamoDB policy |
| `modules/iam/variables.tf` | table_arn, project |
| `modules/iam/outputs.tf` | lambda_role_arn |
| `modules/lambda/main.tf` | Lambda function + zip archive |
| `modules/lambda/variables.tf` | function_name, role_arn, source_dir, table_name |
| `modules/lambda/outputs.tf` | invoke_arn, function_name |
| `modules/api_gateway/main.tf` | REST API, resources, methods, deployment, stage, API key, usage plan |
| `modules/api_gateway/variables.tf` | api_name, lambda_invoke_arn, lambda_function_name |
| `modules/api_gateway/outputs.tf` | api_url, api_key_value |
| `modules/monitoring/main.tf` | CloudWatch dashboard + alarms |
| `modules/monitoring/variables.tf` | function_name, api_name |
| `modules/monitoring/outputs.tf` | dashboard_url |

### Lambda Source (`projects/serverless-data-api/lambda_src/`)

| File | Purpose |
|------|---------|
| `handler.py` | Lambda handler with Powertools APIGatewayRestResolver — CRUD routes |
| `models.py` | Pydantic ItemCreate, ItemResponse |
| `db.py` | DynamoDB table wrapper (get, put, query, delete) |
| `openapi.json` | OpenAPI 3.1 spec |
| `requirements.txt` | pydantic (Powertools via Layer) |

### Root

| File | Purpose |
|------|---------|
| `.github/workflows/terraform.yml` | CI/CD: fmt → validate → plan → apply |
| `README.md` | Architecture diagram, module docs, plan sample, deploy guide |
| `package.json` | Thin Turbo wrapper |
| `docs/plan-output.txt` | Sample terraform plan output |
| `docs/architecture.md` | Mermaid diagram source |
