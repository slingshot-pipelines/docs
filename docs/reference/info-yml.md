---
sidebar_position: 3
---

# Projects

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
| `project` | yes | Project name. Typically matches the repository name |
| `description` | no | Description of the project |
| `deployments.environments` | no | Map of environment name to settings (`{}` for defaults) |
| `deployments.sequence` | no | Ordered list of `{environment: <name>, manual?: boolean}`. `manual: true` stops deployment to the next environment being triggered automatically |

## Component (`.components/<name>/info.yml`)

| Field | Required | Description |
|-------|----------|-------------|
| `component` | yes | Component name |
| `type` | yes | One of `github-action`, `json-schemas`, `lambda`, `library`, `s3-website`, `terraform-modules`, `terragrunt-infra` |
| `path` | yes | Directory containing the component |

Some types add fields (and the `deployments` field is only accepted by `lambda`, `s3-website` and `terragrunt-infra`). Unknown fields are rejected. See [types of components](./types-of-components/terragrunt-infra.md) for each type.
