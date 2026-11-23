---
sidebar_position: 3
---

# info.yml reference

JSON Schemas are published in `slingshot-pipelines/jsonschemas` and are the source of truth:

- Project: `schemas/project/v1/project.schema.json`
- Component: `schemas/component/v1/component.schema.json`

Reference one with a modeline for editor validation:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/slingshot-pipelines/jsonschemas/main/schemas/component/v1/component.schema.json
```

## Project (`.components/info.yml`)

| Field | Required | Description |
|-------|----------|-------------|
| `project` | yes | Project name |
| `deployments.environments` | no | Map of environment name to settings (`{}` for defaults) |
| `deployments.sequence` | no | Ordered list of `{environment: <name>}` |

## Component (`.components/<name>/info.yml`)

| Field | Required | Description |
|-------|----------|-------------|
| `component` | yes | Component name |
| `type` | yes | Component type, e.g. `terragrunt-infra` |
| `path` | yes | Directory containing the component |

:::note[Inferred]
Required/optional status is inferred from examples; check the schema.
:::
