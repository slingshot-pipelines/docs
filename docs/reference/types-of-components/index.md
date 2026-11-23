---
sidebar_position: 0
---

# Components

A component is a unit of a repository that the pipelines know how to check and deploy: a Lambda function, a Terragrunt infrastructure root, a library, and so on. A [project](../info-yml.md) can contain any number of components. Each one is described by its own file at `.components/<name>/info.yml`.

For the concepts behind components, see [Projects and components](../../concepts/projects-and-components.md).

## Example

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/slingshot-pipelines/jsonschemas/main/schemas/component/v1/component.schema.json

component: infra
type: terragrunt-infra
path: infra
```

## Common fields

Every component has these fields. Some types accept more, and unknown fields are rejected.

| Field | Required | Description |
|-------|----------|-------------|
| `component` | yes | Name of the component |
| `type` | yes | The kind of component. Determines which checks and deploy workflow apply |
| `path` | yes | Directory in the repository containing the component's files. Changes under this path mark the component as changed |

The `deployments` field, for giving a component its own environments and sequence, is only accepted by `lambda`, `s3-website` and `terragrunt-infra`.

## Types of components

The `type` determines which fields the component accepts and which workflows run for it. Each type has its own page.

| Type | Used for |
|------|----------|
| [`github-action`](./github-action.md) | A GitHub Action |
| [`json-schemas`](./json-schemas.md) | A collection of JSON Schemas |
| [`lambda`](./lambda.md) | An AWS Lambda function |
| [`library`](./library.md) | A Go or Node library released by tagging |
| [`s3-website`](./s3-website.md) | A static website deployed to S3 |
| [`terraform-modules`](./terraform-modules.md) | Reusable Terraform modules |
| [`terragrunt-infra`](./terragrunt-infra.md) | Terragrunt/Terraform infrastructure |

## Workflows

Each type has check workflows, which run on pull requests for components that changed, and deploy or release workflows. Plural workflows (for example `check-lambdas`) take a JSON list in `COMPONENTS` and run the singular workflow for each. The workflows for each type are listed on its page, and their inputs and secrets are documented in the [workflows repository](https://github.com/slingshot-pipelines/workflows).

## Editor validation

The component schema is published in `slingshot-pipelines/jsonschemas` and is the source of truth: [`component.schema.json`](https://github.com/slingshot-pipelines/jsonschemas/blob/main/schemas/component/v1/component.schema.json). Add a modeline to the top of the file, as in the example above, for autocompletion and validation in editors that use `yaml-language-server`.
