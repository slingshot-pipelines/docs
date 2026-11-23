---
sidebar_position: 7
---

# terragrunt-infra

Terragrunt/Terraform infrastructure, checked on pull requests and deployed through the environment sequence.

## Definition

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/slingshot-pipelines/jsonschemas/main/schemas/component/v1/component.schema.json

component: infra
type: terragrunt-infra
path: infra
```

## Fields

| Field | Required | Description |
|-------|----------|-------------|
| `component` | yes | Name of the component |
| `type` | yes | `terragrunt-infra` |
| `path` | yes | Directory containing the component |
| `deployments` | no | Per-component [environments and sequence](../../concepts/environments-and-sequences.md) |

No other fields are allowed. The schema is [`terragrunt-infra.schema.json`](https://github.com/slingshot-pipelines/jsonschemas/blob/main/schemas/component-types/v1/terragrunt-infra.schema.json).

## Workflows

| Stage | Workflow | Inputs |
|-------|----------|--------|
| Check | [`check-terragrunt-infra`](https://github.com/slingshot-pipelines/workflows/blob/main/.github/workflows/check-terragrunt-infra.yml), [`check-terragrunt-infras`](https://github.com/slingshot-pipelines/workflows/blob/main/.github/workflows/check-terragrunt-infras.yml) | `COMPONENT`, `TERRAFORM_VERSION`, `TERRAGRUNT_VERSION`, `ALL`, `BUILD_CACHE_KEY`, `BUILD_CACHE_PATH` |
| Deploy | [`deploy-terragrunt-infra`](https://github.com/slingshot-pipelines/workflows/blob/main/.github/workflows/deploy-terragrunt-infra.yml) | `COMPONENT`, `ENVIRONMENT`, `TAG`, `TERRAFORM_VERSION`, `TERRAGRUNT_VERSION`, `SLACK_CHANNEL` (optional) |

The plural workflow (`check-*s`, `release-*ies`) takes a JSON list in `COMPONENTS` and runs the singular workflow for each. Workflow inputs and secrets are documented in the [workflows repository](https://github.com/slingshot-pipelines/workflows).
