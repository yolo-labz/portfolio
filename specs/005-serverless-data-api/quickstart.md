# Quickstart: Serverless Data API

**Branch**: `005-serverless-data-api`

## Prerequisites

- AWS CLI configured (`aws configure`)
- Terraform >= 1.7 installed
- Python 3.12 (for local Lambda testing)

## Deploy

```bash
cd projects/serverless-data-api/infra

# Initialize
terraform init

# Preview changes
terraform plan

# Deploy (creates ~15 resources)
terraform apply

# Get API URL and key
terraform output api_url
terraform output -raw api_key_value
```

## Test the API

```bash
API_URL=$(terraform output -raw api_url)
API_KEY=$(terraform output -raw api_key_value)

# Create item
curl -X POST "$API_URL/items" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Item", "category": "demo", "price": 29.99}'

# List items
curl "$API_URL/items" -H "x-api-key: $API_KEY"

# Get by ID
curl "$API_URL/items/<id>" -H "x-api-key: $API_KEY"

# Swagger UI
open "$API_URL/docs"
```

## Destroy

```bash
terraform destroy
```

## Verification

- [ ] `terraform validate` passes
- [ ] `terraform plan` shows ~15 resources to create
- [ ] `terraform apply` completes in under 5 minutes
- [ ] POST /items creates an item (HTTP 201)
- [ ] GET /items returns the item list
- [ ] GET /items/{id} returns a single item
- [ ] PUT /items/{id} updates an item
- [ ] DELETE /items/{id} removes an item (HTTP 204)
- [ ] Request without API key returns HTTP 403
- [ ] Invalid POST body returns HTTP 422
- [ ] GET /docs shows Swagger UI
- [ ] `terraform destroy` cleans up all resources
- [ ] README has architecture diagram + plan sample
