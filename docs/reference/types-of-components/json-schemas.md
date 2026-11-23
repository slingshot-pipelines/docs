---
sidebar_position: 2
---

# json-schemas

A collection of JSON Schemas, such as the `jsonschemas` repository itself.

## Definition

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/slingshot-pipelines/jsonschemas/main/schemas/component/v1/component.schema.json

component: schemas
type: json-schemas
path: schemas
```

## Fields

| Field | Required | Description |
|-------|----------|-------------|
| `component` | yes | Name of the component |
| `type` | yes | `json-schemas` |
| `path` | yes | Directory containing the component |

No other fields are allowed. The schema is [`json-schemas.schema.json`](https://github.com/slingshot-pipelines/jsonschemas/blob/main/schemas/component-types/v1/json-schemas.schema.json).

## Workflows

| Stage | Workflow | Inputs |
|-------|----------|--------|
| Check | [`check-json-schemas`](https://github.com/slingshot-pipelines/workflows/blob/main/.github/workflows/check-json-schemas.yml) | `COMPONENTS` |

The plural workflow (`check-*s`, `release-*ies`) takes a JSON list in `COMPONENTS` and runs the singular workflow for each. Workflow inputs and secrets are documented in the [workflows repository](https://github.com/slingshot-pipelines/workflows).
