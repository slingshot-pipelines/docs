---
sidebar_position: 3
---

# lambda

An AWS Lambda function with its source, build output and infrastructure.

## Definition

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/slingshot-pipelines/jsonschemas/main/schemas/component/v1/component.schema.json

component: my-lambda
type: lambda
path: my-lambda
source-language: go
subpaths:
  src: src
  build: build
  infra: infra
```

## Fields

| Field | Required | Description |
|-------|----------|-------------|
| `component` | yes | Name of the component |
| `type` | yes | `lambda` |
| `path` | yes | Directory containing the component |
| `source-language` | yes | `go` or `node` |
| `subpaths.src` | yes | Path to the Lambda source code |
| `subpaths.build` | yes | Path for the compiled executable |
| `subpaths.infra` | yes | Path to the Lambda infrastructure |
| `deployments` | no | Per-component [environments and sequence](../../deployments-and-environments.md) |

No other fields are allowed. The schema is [`lambda.schema.json`](https://github.com/slingshot-pipelines/jsonschemas/blob/main/schemas/component-types/v1/lambda.schema.json).

## Workflows

| Stage | Workflow | Inputs |
|-------|----------|--------|
| Check | [`check-lambda`](https://github.com/slingshot-pipelines/workflows/blob/main/.github/workflows/check-lambda.yml), [`check-lambdas`](https://github.com/slingshot-pipelines/workflows/blob/main/.github/workflows/check-lambdas.yml) | `COMPONENT`, `TERRAFORM_VERSION`, `TERRAGRUNT_VERSION` |
| Deploy | [`deploy-lambda`](https://github.com/slingshot-pipelines/workflows/blob/main/.github/workflows/deploy-lambda.yml) | `COMPONENT`, `ENVIRONMENT`, `TAG`, `TERRAFORM_VERSION`, `TERRAGRUNT_VERSION`, `SLACK_CHANNEL` (optional) |

The plural workflow (`check-*s`, `release-*ies`) takes a JSON list in `COMPONENTS` and runs the singular workflow for each. Workflow inputs and secrets are documented in the [workflows repository](https://github.com/slingshot-pipelines/workflows).
