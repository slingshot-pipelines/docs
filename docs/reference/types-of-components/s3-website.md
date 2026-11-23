---
sidebar_position: 5
---

# s3-website

A static website deployed to S3.

## Definition

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/slingshot-pipelines/jsonschemas/main/schemas/component/v1/component.schema.json

component: site
type: s3-website
path: site
```

## Fields

| Field | Required | Description |
|-------|----------|-------------|
| `component` | yes | Name of the component |
| `type` | yes | `s3-website` |
| `path` | yes | Directory containing the component |
| `deployments` | no | Per-component [environments and sequence](../../concepts/environments-and-sequences.md) |

No other fields are allowed. The schema is [`s3-website.schema.json`](https://github.com/slingshot-pipelines/jsonschemas/blob/main/schemas/component-types/v1/s3-website.schema.json).

## Workflows

| Stage | Workflow | Inputs |
|-------|----------|--------|
| Check | [`check-s3-website`](https://github.com/slingshot-pipelines/workflows/blob/main/.github/workflows/check-s3-website.yml), [`check-s3-websites`](https://github.com/slingshot-pipelines/workflows/blob/main/.github/workflows/check-s3-websites.yml) | `COMPONENT` |
| Deploy | [`deploy-s3-website`](https://github.com/slingshot-pipelines/workflows/blob/main/.github/workflows/deploy-s3-website.yml) | `COMPONENT`, `ENVIRONMENT`, `TAG` |

The plural workflow (`check-*s`, `release-*ies`) takes a JSON list in `COMPONENTS` and runs the singular workflow for each. Workflow inputs and secrets are documented in the [workflows repository](https://github.com/slingshot-pipelines/workflows).
