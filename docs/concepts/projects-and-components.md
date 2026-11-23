---
sidebar_position: 1
---

# Projects and components

slingshot-pipelines models a repository with two levels, both described in a `.components/` directory at the repository root.

## Project

The project describes the repository as a whole. It lives in `.components/info.yml`:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/slingshot-pipelines/jsonschemas/main/schemas/project/v1/project.schema.json

project: platform

deployments:
  environments:
    dev: {}
    prd: {}

  sequence:
    - environment: dev
    - environment: prd
```

| Field | Meaning |
|-------|---------|
| `project` | Name of the project (typically the repository name) |
| `deployments.environments` | The environments components can be deployed to |
| `deployments.sequence` | The order in which environments are deployed |

A repository that only needs checks and no deployments can use a minimal project file:

```yaml
project: github-management
```

## Component

A component is a unit of the repository that the pipelines know how to check and deploy. Each lives in its own directory under `.components/`:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/slingshot-pipelines/jsonschemas/main/schemas/component/v1/component.schema.json

component: infra
type: terragrunt-infra

path: infra
```

| Field | Meaning |
|-------|---------|
| `component` | Name of the component |
| `type` | The kind of component. Determines which checks and deploy workflow apply |
| `path` | Directory in the repository containing the component's files. Changes under this path mark the component as changed |

:::tip
The `$schema` comment gives you autocompletion and validation in editors that use `yaml-language-server`.
:::

## Component types

Types seen in current usage:

| Type | Used for | Check workflow | Deploy workflow |
|------|----------|----------------|-----------------|
| `terragrunt-infra` | Terragrunt/Terraform infrastructure | `check-terragrunt-infra` | `deploy-terragrunt-infra` |
| `components` | The `.components/` definitions themselves | `check-components` | n/a |
| `github-workflows` | Workflow files under `.github/workflows` | `check-github-workflows` | n/a |

Each type has its own page in the [types of components reference](../reference/types-of-components/terragrunt-infra.md). See also the [workflows reference](../reference/workflows.md).
