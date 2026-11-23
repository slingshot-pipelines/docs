---
sidebar_position: 1
---

# github-action

A GitHub Action maintained in the repository.

## Definition

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/slingshot-pipelines/jsonschemas/main/schemas/component/v1/component.schema.json

component: my-action
type: github-action
path: my-action
source-language: node
```

## Fields

| Field | Required | Description |
|-------|----------|-------------|
| `component` | yes | Name of the component |
| `type` | yes | `github-action` |
| `path` | yes | Directory containing the component |
| `source-language` | yes | `composite`, `node` or `docker` |

No other fields are allowed. The schema is [`github-action.schema.json`](https://github.com/slingshot-pipelines/jsonschemas/blob/main/schemas/component-types/v1/github-action.schema.json).

## Workflows

| Stage | Workflow | Inputs |
|-------|----------|--------|
| Check | [`check-github-action`](https://github.com/slingshot-pipelines/workflows/blob/main/.github/workflows/check-github-action.yml), [`check-github-actions`](https://github.com/slingshot-pipelines/workflows/blob/main/.github/workflows/check-github-actions.yml) | `COMPONENT`, `GENERATE_DOCS` (default `true`) |

The plural workflow (`check-*s`, `release-*ies`) takes a JSON list in `COMPONENTS` and runs the singular workflow for each. Workflow inputs and secrets are documented in the [workflows repository](https://github.com/slingshot-pipelines/workflows); see the [reusable workflows reference](../workflows.md).
