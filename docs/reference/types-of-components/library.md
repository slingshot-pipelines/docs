---
sidebar_position: 4
---

# library

A Go or Node library that is released by tagging.

## Definition

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/slingshot-pipelines/jsonschemas/main/schemas/component/v1/component.schema.json

component: my-lib
type: library
path: my-lib
source-language: go
tag-prefix: v
```

## Fields

| Field | Required | Description |
|-------|----------|-------------|
| `component` | yes | Name of the component |
| `type` | yes | `library` |
| `path` | yes | Directory containing the component |
| `source-language` | yes | `go` or `node` |
| `tag-prefix` | yes | Prefix for semver tags. With `v`, version `0.0.0` is tagged `v0.0.0` |

No other fields are allowed. The schema is [`library.schema.json`](https://github.com/slingshot-pipelines/jsonschemas/blob/main/schemas/component-types/v1/library.schema.json).

## Workflows

| Stage | Workflow | Inputs |
|-------|----------|--------|
| Check | [`check-library`](https://github.com/slingshot-pipelines/workflows/blob/main/.github/workflows/check-library.yml), [`check-libraries`](https://github.com/slingshot-pipelines/workflows/blob/main/.github/workflows/check-libraries.yml) | `COMPONENT` |
| Release | [`release-library`](https://github.com/slingshot-pipelines/workflows/blob/main/.github/workflows/release-library.yml), [`release-libraries`](https://github.com/slingshot-pipelines/workflows/blob/main/.github/workflows/release-libraries.yml) | `COMPONENT` |

The plural workflow (`check-*s`, `release-*ies`) takes a JSON list in `COMPONENTS` and runs the singular workflow for each. Workflow inputs and secrets are documented in the [workflows repository](https://github.com/slingshot-pipelines/workflows); see the [reusable workflows reference](../workflows.md).
