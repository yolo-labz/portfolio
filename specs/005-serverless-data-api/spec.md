# Feature Specification: Serverless Data API with Terraform IaC

**Feature Branch**: `005-serverless-data-api`
**Created**: 2026-04-01
**Status**: Draft
**Input**: User description: "Build the serverless-data-api project under projects/serverless-data-api — AWS Lambda + API Gateway + DynamoDB, fully provisioned via Terraform. Python handlers with validation, API key auth, rate limiting, auto-generated OpenAPI docs, GitHub Actions CI/CD, CloudWatch monitoring. Showcases AWS + Terraform + DevOps skills, aligns with Pedro's AWS Solutions Architect Professional cert."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Upwork client reviews the infrastructure code (Priority: P1)

An Upwork client opens the GitHub repo and sees a clean Terraform codebase with modular structure, a README with an architecture diagram, and a sample `terraform plan` output. They understand the infrastructure in 2 minutes without needing an AWS account.

**Why this priority**: For a DevOps/IaC portfolio piece, the code IS the demo. Clients hiring for Terraform work want to see module organization, variable conventions, and clean HCL — not just a running app.

**Independent Test**: Open the README on GitHub. Verify it has: architecture diagram, module descriptions, terraform plan sample output, and deployment instructions.

**Acceptance Scenarios**:

1. **Given** a visitor opens the repository, **When** they read the README, **Then** they see: a Mermaid architecture diagram showing Lambda → API Gateway → DynamoDB, a table of Terraform modules, sample `terraform plan` output, and a "Deploy" section with `terraform apply` instructions.
2. **Given** a visitor explores the `infrastructure/` directory, **When** they review the module structure, **Then** they find: separate modules for Lambda, API Gateway, DynamoDB, IAM, and CloudWatch, each with `variables.tf`, `main.tf`, and `outputs.tf`.
3. **Given** a visitor runs `terraform validate`, **When** the check completes, **Then** all configuration files pass validation with zero errors.

---

### User Story 2 — Upwork client tests the live API (Priority: P1)

An Upwork client uses the Swagger UI or curl to interact with a live API endpoint. They can create, read, update, and delete data items. The API responds fast, validates input, and returns clear error messages.

**Why this priority**: A live, working API proves the Terraform actually provisions real infrastructure. Swagger UI lets non-technical clients explore the API without writing code.

**Independent Test**: Open the Swagger UI URL. Create an item via POST, retrieve it via GET, update it via PUT, delete it via DELETE. All operations succeed with proper HTTP status codes.

**Acceptance Scenarios**:

1. **Given** a client opens the API docs URL, **When** the page loads, **Then** they see a Swagger UI listing all endpoints with request/response schemas.
2. **Given** a client sends a POST request with a valid item, **When** the API processes it, **Then** the item is stored and returned with a generated ID and HTTP 201.
3. **Given** a client sends a GET request for an existing item, **When** the API responds, **Then** the full item data is returned with HTTP 200.
4. **Given** a client sends a POST with invalid data (missing required fields), **When** the API validates, **Then** it returns HTTP 422 with a clear error message listing the missing fields.
5. **Given** a client sends a request without an API key, **When** the API checks auth, **Then** it returns HTTP 403 Forbidden.

---

### User Story 3 — One-command infrastructure deployment (Priority: P2)

A developer clones the repo and provisions the entire infrastructure with a single `terraform apply` command. All resources — Lambda, API Gateway, DynamoDB, IAM roles, CloudWatch dashboards — are created automatically.

**Why this priority**: "One command to deploy" is the IaC value proposition. Demonstrating it is more important than the API's business logic.

**Independent Test**: From a fresh clone with valid AWS credentials, run `terraform init && terraform apply`. Verify all resources are created and the API endpoint is returned as output.

**Acceptance Scenarios**:

1. **Given** a developer has AWS credentials configured, **When** they run `terraform init && terraform apply`, **Then** all infrastructure is provisioned and the API endpoint URL is printed as a Terraform output.
2. **Given** the infrastructure is provisioned, **When** the developer runs `terraform destroy`, **Then** all resources are cleanly removed with no orphaned resources.
3. **Given** the developer modifies a variable (e.g., changes the API name), **When** they run `terraform plan`, **Then** it shows a clean diff of what will change.

---

### User Story 4 — CI/CD validates infrastructure changes (Priority: P2)

A GitHub Actions pipeline runs `terraform fmt`, `validate`, and `plan` on every PR. Apply runs on merge to main. This demonstrates production-grade infrastructure governance.

**Why this priority**: CI/CD for Terraform is what separates a hobbyist from a professional. Enterprise clients look for this.

**Independent Test**: Open a PR that modifies a Terraform variable. Verify the CI pipeline runs fmt → validate → plan and posts the plan output as a PR comment.

**Acceptance Scenarios**:

1. **Given** a PR is opened with Terraform changes, **When** the CI pipeline runs, **Then** it executes `terraform fmt -check`, `terraform validate`, and `terraform plan` in sequence.
2. **Given** the pipeline completes, **When** the plan output is generated, **Then** it is visible in the GitHub Actions logs (or posted as a PR comment).
3. **Given** a PR is merged to main, **When** the deploy pipeline triggers, **Then** `terraform apply -auto-approve` provisions the changes.

---

### User Story 5 — Monitoring and observability (Priority: P3)

A CloudWatch dashboard shows API metrics: request count, latency percentiles, error rates, and DynamoDB consumed capacity. This demonstrates awareness of production operations.

**Why this priority**: Monitoring is a nice-to-have for a portfolio piece. The dashboard screenshot in the README is more impactful than the actual dashboard being live.

**Independent Test**: Open the CloudWatch dashboard URL. Verify it shows widgets for API latency, request count, 4xx/5xx error rates, and DynamoDB read/write capacity.

**Acceptance Scenarios**:

1. **Given** the infrastructure is deployed, **When** a visitor opens the CloudWatch dashboard, **Then** they see metrics for: API request count, p50/p99 latency, 4xx/5xx error rates, Lambda invocation count, and DynamoDB consumed capacity.

---

### Edge Cases

- What happens when DynamoDB throughput is exceeded? On-demand capacity auto-scales, so this shouldn't occur. If it does, the API returns HTTP 503 with a "Service temporarily unavailable" message.
- What happens when a Lambda function times out? The API Gateway returns HTTP 504 and the timeout is logged in CloudWatch.
- What happens when `terraform apply` fails mid-provisioning? Terraform's state file tracks created resources. A subsequent `terraform apply` resumes from where it left off.
- What happens when the API key is leaked? The key can be rotated via Terraform by modifying the API key resource and running `terraform apply`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The infrastructure MUST be defined entirely in Terraform (no ClickOps, no CloudFormation). Running `terraform apply` from a fresh state MUST provision all resources.
- **FR-002**: The Terraform code MUST be organized into reusable modules: `lambda`, `api_gateway`, `dynamodb`, `iam`, `monitoring`.
- **FR-003**: The API MUST support CRUD operations on a "data items" resource: `POST /items` (create), `GET /items` (list), `GET /items/{id}` (read), `PUT /items/{id}` (update), `DELETE /items/{id}` (delete).
- **FR-004**: Request validation MUST reject payloads with missing required fields, returning HTTP 422 with a structured error response listing the invalid fields.
- **FR-005**: The API MUST require an API key in the `x-api-key` header for all endpoints. Requests without a valid key MUST return HTTP 403.
- **FR-006**: The API MUST enforce rate limiting (1000 requests per day per API key via API Gateway usage plan).
- **FR-007**: The API MUST return responses in under 200ms for p95 latency (excluding cold starts).
- **FR-008**: The API MUST auto-generate an OpenAPI specification accessible at a documentation URL.
- **FR-009**: A GitHub Actions workflow MUST run `terraform fmt -check`, `terraform validate`, and `terraform plan` on PRs. Apply MUST run on merge to main.
- **FR-010**: A CloudWatch dashboard MUST display: API request count, p50/p99 latency, 4xx/5xx error rates, Lambda invocations, DynamoDB consumed capacity.
- **FR-011**: Running `terraform destroy` MUST cleanly remove all provisioned resources.
- **FR-012**: The project MUST include a README with: architecture diagram, module descriptions, terraform plan sample output, deployment instructions, API documentation link, and CloudWatch dashboard screenshot.
- **FR-013**: All infrastructure costs MUST be zero when idle (on-demand DynamoDB, Lambda free tier, no NAT gateways or always-on resources).
- **FR-014**: Terraform state MUST be configured for remote storage (S3 backend with DynamoDB locking) with instructions for local state as a fallback for demo purposes.

### Key Entities

- **Data Item**: A generic data record stored in DynamoDB — id (UUID, partition key), name (string, required), description (string, optional), tags (list of strings), created_at (ISO 8601), updated_at (ISO 8601).
- **API Key**: An API Gateway API key associated with a usage plan for rate limiting.
- **Terraform Module**: A self-contained directory with `variables.tf`, `main.tf`, `outputs.tf` defining a single infrastructure concern.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `terraform validate` passes with zero errors on all modules.
- **SC-002**: `terraform apply` provisions all resources in under 5 minutes.
- **SC-003**: CRUD operations on `/items` return correct HTTP status codes (201, 200, 204, 404, 422, 403).
- **SC-004**: API response time is under 200ms at p95 (excluding cold starts).
- **SC-005**: The README allows a developer with AWS credentials to deploy the full stack in under 10 minutes.
- **SC-006**: The project is referenceable as an Upwork portfolio piece with architecture diagram and terraform plan sample.

## Assumptions

- The developer deploying has AWS credentials configured (`aws configure` or environment variables) with sufficient IAM permissions (admin or scoped policy).
- The project uses **Terraform's local backend by default** for easy portfolio demos. Instructions for S3 remote backend are provided but not required.
- The API serves a **generic "data items" resource** — the schema is intentionally simple to focus attention on the infrastructure, not the business logic.
- Lambda functions use **Python 3.12 runtime**.
- The API Gateway uses **HTTP API (v2)** — cheaper, faster, simpler than REST API (v1) for this use case.
- DynamoDB uses **on-demand capacity** to avoid idle costs.
- No custom domain is configured for the API Gateway endpoint — the default `*.execute-api.*.amazonaws.com` URL is used. Custom domain setup instructions are documented but not provisioned.
- The project does NOT require a live AWS deployment to be portfolio-worthy. The Terraform code, README, and sample plan output are sufficient. A live deployment is a bonus.
- CloudWatch dashboard is provisioned by Terraform — no manual setup.
