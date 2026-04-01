# Tasks: Serverless Data API with Terraform IaC

**Input**: Design documents from `/specs/005-serverless-data-api/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks grouped by user story. File paths relative to `projects/serverless-data-api/`.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Create directory structure, package.json wrapper

- [ ] T001 Create `projects/serverless-data-api/package.json` — Turbo wrapper with scripts: `"validate": "cd infra && terraform validate"`, `"plan": "cd infra && terraform plan"`, `"fmt": "cd infra && terraform fmt -recursive"`, `"build": "echo 'Deploy via terraform apply'"`
- [ ] T002 [P] Create directory structure: `infra/modules/dynamodb/`, `infra/modules/iam/`, `infra/modules/lambda/`, `infra/modules/api_gateway/`, `infra/modules/monitoring/`, `lambda_src/`, `docs/`
- [ ] T003 [P] Create `lambda_src/requirements.txt` — `pydantic>=2.0`

**Checkpoint**: Project skeleton ready.

---

## Phase 2: Foundational (Lambda Source Code)

**Purpose**: Python handlers that all Terraform modules depend on (Lambda module zips this code)

- [ ] T004 Create `lambda_src/models.py` — Pydantic v2 models: `ItemCreate` (name required str 1-255, description optional str max 1000, category required str lowercase, price required float >0, tags optional list[str]), `ItemUpdate` (all fields optional), `ItemResponse` (extends ItemCreate with id str UUID, created_at str ISO8601, updated_at str ISO8601)
- [ ] T005 [P] Create `lambda_src/db.py` — DynamoDB wrapper class `ItemsTable`:
  - `__init__(table_name)` — creates boto3 DynamoDB resource, gets table
  - `put_item(item: dict)` — writes item with PK=`ITEM#<id>`, SK=`METADATA`, plus collection entry PK=`ITEMS`, SK=`ITEM#<id>` (batch_write)
  - `get_item(item_id: str) -> dict | None` — gets by PK/SK
  - `list_items(limit=50, last_key=None) -> tuple[list[dict], dict|None]` — queries PK=`ITEMS` with pagination
  - `update_item(item_id: str, updates: dict)` — update expression on PK/SK
  - `delete_item(item_id: str)` — deletes both item entry and collection entry (batch_write)
- [ ] T006 Create `lambda_src/handler.py` — AWS Lambda Powertools `APIGatewayRestResolver`:
  - Import Logger, Tracer, Metrics from aws_lambda_powertools
  - Routes: `POST /items` (validate with ItemCreate, generate UUID, put, return 201), `GET /items` (list with pagination), `GET /items/<item_id>` (get, 404 if not found), `PUT /items/<item_id>` (validate with ItemUpdate, update, 404 if not found), `DELETE /items/<item_id>` (delete, return 204)
  - `GET /docs` — return HTML page loading Swagger UI from CDN pointing at `/openapi.json`
  - `GET /openapi.json` — return the OpenAPI spec as JSON
  - Handler function with `@logger.inject_lambda_context`, `@tracer.capture_lambda_handler`, `@metrics.log_metrics`
  - All responses include CORS headers
  - Validation errors return 422 with field-level error details
- [ ] T007 [P] Create `openapi.yaml` at project root — OpenAPI 3.1 spec documenting all 5 CRUD endpoints + /docs, with request/response schemas, API key security scheme (`x-api-key` header), error responses (422, 403, 404)

**Checkpoint**: Lambda code is complete and self-contained. Can be tested locally with `python -c "from handler import handler"`.

---

## Phase 3: User Story 1 + 3 — Terraform Modules (Priority: P1+P2)

**Goal**: All 5 Terraform modules with clean variables/outputs interfaces

**Independent Test**: `cd infra && terraform validate` passes

### Implementation (all modules parallelizable)

- [ ] T008 [P] [US1] Create `infra/modules/dynamodb/` — `main.tf`: DynamoDB table with PK (String), SK (String), GSI1PK (String), GSI1SK (String), billing_mode PAY_PER_REQUEST, point_in_time_recovery enabled, tags. `variables.tf`: table_name, tags. `outputs.tf`: table_name, table_arn.
- [ ] T009 [P] [US1] Create `infra/modules/iam/` — `main.tf`: IAM role for Lambda with assume_role_policy for lambda.amazonaws.com, inline policy for DynamoDB (GetItem, PutItem, Query, DeleteItem, UpdateItem, BatchWriteItem on table + GSI ARN), CloudWatch Logs policy (CreateLogGroup, CreateLogStream, PutLogEvents). `variables.tf`: table_arn, project. `outputs.tf`: lambda_role_arn.
- [ ] T010 [P] [US1] Create `infra/modules/lambda/` — `main.tf`: `data.archive_file` to zip lambda_src/, `aws_lambda_function` (python3.12, arm64, 256MB, 29s timeout, handler=handler.handler, Powertools Layer ARN for arm64, env vars: TABLE_NAME, POWERTOOLS_SERVICE_NAME, LOG_LEVEL). `variables.tf`: function_name, role_arn, source_dir, table_name, environment, region. `outputs.tf`: invoke_arn, function_name, function_arn.
- [ ] T011 [P] [US1] Create `infra/modules/api_gateway/` — `main.tf`: REST API, `{proxy+}` resource, ANY method with api_key_required=true, Lambda integration (AWS_PROXY), OPTIONS mock for CORS, deployment, stage ("demo"), API key, usage plan (1000/day, burst 10, rate 5/s), usage plan key link, Lambda permission for API Gateway invoke. `variables.tf`: api_name, lambda_invoke_arn, lambda_function_name, region, account_id. `outputs.tf`: api_url (stage invoke URL), api_key_id.
- [ ] T012 [P] [US1] Create `infra/modules/monitoring/` — `main.tf`: CloudWatch dashboard with JSON body containing widgets: Lambda invocations (stat Sum), Lambda duration p50/p99, Lambda errors, API Gateway 4xx count, API Gateway 5xx count, API Gateway latency, DynamoDB ConsumedReadCapacityUnits, DynamoDB ConsumedWriteCapacityUnits. `variables.tf`: function_name, api_name, table_name, region. `outputs.tf`: dashboard_name.

**Checkpoint**: All modules pass `terraform validate` individually.

---

## Phase 4: User Story 3 — Root Config + One-Command Deploy (Priority: P2)

**Goal**: `terraform init && terraform apply` provisions everything

**Independent Test**: `terraform validate` passes at root level. `terraform plan` shows ~15 resources.

### Implementation

- [ ] T013 [US3] Create `infra/providers.tf` — `required_version >= 1.7`, AWS provider with `var.region`, `required_providers` block for aws (~> 5.0). Data sources: `aws_caller_identity.current`, `aws_region.current`.
- [ ] T014 [P] [US3] Create `infra/variables.tf` — `project_name` (default "serverless-data-api"), `environment` (default "demo"), `region` (default "us-east-1"). All with descriptions.
- [ ] T015 [P] [US3] Create `infra/terraform.tfvars` — set defaults: project_name="serverless-data-api", environment="demo", region="us-east-1"
- [ ] T016 [P] [US3] Create `infra/backend.tf` — empty (local state). Include commented S3 backend block with placeholder bucket/key/region/dynamodb_table and instructions.
- [ ] T017 [US3] Create `infra/main.tf` — wire all 5 modules: dynamodb (table_name from vars), iam (table_arn from dynamodb output), lambda (role_arn from iam, source_dir, table_name), api_gateway (lambda invoke_arn + function_name, account_id + region from data sources), monitoring (function_name, api_name, table_name). Local `tags` map with Project, Environment, ManagedBy="terraform".
- [ ] T018 [US3] Create `infra/outputs.tf` — `api_url` (from api_gateway module), `api_key_value` (sensitive, from aws_api_gateway_api_key data source), `table_name` (from dynamodb module), `dashboard_url` (constructed from region + dashboard name).

**Checkpoint**: `terraform validate` passes. `terraform plan` shows clean resource creation plan.

---

## Phase 5: User Story 2 — Live API Verification (Priority: P1)

**Goal**: API responds to CRUD requests with correct status codes

**Note**: This user story is verified by deploying to AWS (optional). The Lambda code from Phase 2 + Terraform from Phase 3-4 together deliver this. No additional code is needed — just verification.

- [ ] T019 [US2] Generate `docs/plan-output.txt` — run `terraform plan` (or hand-craft realistic output showing ~15 resources: 1 DynamoDB table, 1 Lambda function, 1 API Gateway REST API, ~5 API Gateway resources/methods, 1 IAM role, 2 IAM policies, 1 API key, 1 usage plan, 1 CloudWatch dashboard, 1 Lambda permission, 1 deployment, 1 stage). Format cleanly for README embedding.

**Checkpoint**: Plan output demonstrates the infrastructure scope.

---

## Phase 6: User Story 4 — CI/CD Pipeline (Priority: P2)

**Goal**: GitHub Actions workflow for Terraform governance

- [ ] T020 [US4] Create `.github/workflows/terraform.yml` at **monorepo root** — triggered on push/PR to main when `projects/serverless-data-api/infra/**` changes. Jobs: `terraform` (ubuntu-latest, working-directory projects/serverless-data-api/infra). Steps: checkout, setup-terraform (v1.7), fmt -check -recursive, init (with `-backend=false` for validation-only in CI without AWS), validate. Add commented `plan` and `apply` steps requiring AWS credentials (OIDC). Include comments explaining how to enable full CI/CD with AWS OIDC.

**Checkpoint**: CI workflow validates Terraform formatting and syntax on every PR.

---

## Phase 7: User Story 5 — Monitoring (Priority: P3)

**Note**: Already implemented in T012 (monitoring module). This phase just verifies.

- [ ] T021 [US5] Verify `infra/modules/monitoring/main.tf` CloudWatch dashboard JSON includes all required widgets (Lambda invocations, p50/p99 duration, errors, API Gateway 4xx/5xx, DynamoDB capacity). No additional code needed.

**Checkpoint**: Monitoring module is complete.

---

## Phase 8: Documentation + README

**Purpose**: Professional README that sells the project

- [ ] T022 Create `docs/architecture.md` — Mermaid diagram showing: GitHub Actions CI/CD → AWS Cloud containing API Gateway (REST, API key) → Lambda (Python 3.12, Powertools) → DynamoDB (single-table, on-demand), plus CloudWatch and S3 State.
- [ ] T023 Create `README.md` — sections:
  - Title + one-line description + badges (Terraform, Python, AWS)
  - "What This Demonstrates" — 5 bullets: full IaC (terraform apply creates everything), modular Terraform (5 reusable modules), serverless CRUD API (Lambda + API Gateway), zero-cost-when-idle architecture, CI/CD governance
  - "Architecture" — embed Mermaid from docs/architecture.md
  - "Terraform Modules" — table (module name, resources, purpose)
  - "What Gets Created" — embed plan output from docs/plan-output.txt (or formatted summary)
  - "Quick Start" — terraform init, plan, apply, test with curl
  - "API Endpoints" — table (method, path, description, auth)
  - "Cost" — "$0/month when idle" with breakdown
  - "CI/CD" — describe the GitHub Actions pipeline
  - "Cleanup" — terraform destroy
  - No "innovative", "cutting-edge", "passionate" language

**Checkpoint**: README is clear, professional, and demonstrates expertise.

---

## Phase 9: Polish & Cross-Cutting

- [ ] T024 Run `terraform fmt -recursive` on all .tf files
- [ ] T025 Run `terraform validate` on the root module — must pass
- [ ] T026 Verify all module interfaces are consistent (variables consumed match outputs produced)
- [ ] T027 Update `apps/web/src/data/projects.ts` — update source link for serverless-data-api project card on portfolio site
- [ ] T028 Commit all changes, push, create PR, merge, clean up branch

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies
- **Phase 2 (Lambda)**: No dependencies (parallel with setup)
- **Phase 3 (TF Modules)**: Depends on Phase 2 (Lambda source must exist for archive_file in lambda module)
- **Phase 4 (Root Config)**: Depends on Phase 3 (all modules must exist)
- **Phase 5 (Plan Output)**: Depends on Phase 4 (need valid root config)
- **Phase 6 (CI/CD)**: Can start after Phase 4
- **Phase 7 (Monitoring)**: Already done in Phase 3
- **Phase 8 (README)**: Depends on Phase 5 (plan output) + Phase 3 (architecture to document)
- **Phase 9 (Polish)**: Depends on all

### Parallel Opportunities

**Phase 2**: T004, T005, T007 all parallel (different files); T006 depends on T004+T005
**Phase 3**: ALL 5 modules (T008-T012) are parallel — different directories
**Phase 4**: T014, T015, T016 parallel; T013 and T017 sequential

### Recommended Single-Agent Order

T001 → T002+T003 → T004+T005+T007 → T006 → T008+T009+T010+T011+T012 → T013 → T014+T015+T016 → T017 → T018 → T019 → T020 → T021 → T022 → T023 → T024 → T025 → T026 → T027 → T028

---

## Implementation Strategy

### MVP First

1. Phase 1-2: Lambda source (T001-T007) — the application code
2. Phase 3: Terraform modules (T008-T012) — infrastructure as code
3. Phase 4: Root config (T013-T018) — wires everything together
4. **STOP**: `terraform validate` passes — the IaC is complete

### Full Build

5. Phase 5-7: Plan output + CI/CD + monitoring verification
6. Phase 8: README with architecture diagram
7. Phase 9: Polish + merge

---

## Notes

- This project does NOT deploy to Dokku — it deploys to AWS via `terraform apply`
- The Lambda code uses Powertools' built-in API resolver, not FastAPI/Mangum
- Powertools is provided via an AWS Lambda Layer (not bundled in the zip)
- The `archive_file` data source auto-zips `lambda_src/` on every plan/apply
- `terraform validate` can run without AWS credentials (validates syntax only)
- `terraform plan` requires AWS credentials to check resource state
- The CI workflow runs validate only (no AWS credentials needed in CI for a portfolio demo)
- All .tf files must pass `terraform fmt -check` — use 2-space indentation (Terraform convention, not tabs)
