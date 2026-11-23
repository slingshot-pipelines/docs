---
sidebar_position: 6
---

# terraform-modules

A directory of reusable Terraform modules.

## Definition

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/slingshot-pipelines/jsonschemas/main/schemas/component/v1/component.schema.json

component: modules
type: terraform-modules
path: modules
```

## Fields

| Field | Required | Description |
|-------|----------|-------------|
| `component` | yes | Name of the component |
| `type` | yes | `terraform-modules` |
| `path` | yes | Directory containing the component |

No other fields are allowed. The schema is [`terraform-modules.schema.json`](https://github.com/slingshot-pipelines/jsonschemas/blob/main/schemas/component-types/v1/terraform-modules.schema.json).

## Workflows

| Stage | Workflow | Inputs |
|-------|----------|--------|
| Check | [`check-terraform-modules`](https://github.com/slingshot-pipelines/workflows/blob/main/.github/workflows/check-terraform-modules.yml) | `COMPONENT`, `TERRAFORM_VERSION`, `TERRAGRUNT_VERSION` |
| Release | [`release-terraform-modules`](https://github.com/slingshot-pipelines/workflows/blob/main/.github/workflows/release-terraform-modules.yml) | `COMPONENT`, `ALL` (default `false`) |

Workflow inputs and secrets are documented in the [workflows repository](https://github.com/slingshot-pipelines/workflows).
