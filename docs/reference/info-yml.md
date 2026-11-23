---
sidebar_position: 3
---

# Projects

A project describes a repository as a whole: its name and, optionally, the environments it deploys to and the order they are deployed in. Each repository has one project, defined in `.components/info.yml`. The things inside the repository that are checked and deployed are its [components](./types-of-components/index.md).

For the concepts behind this file, see [Projects and components](../concepts/projects-and-components.md).

## Example

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/slingshot-pipelines/jsonschemas/main/schemas/project/v1/project.schema.json

project: platform
description: Shared platform infrastructure

deployments:
  environments:
    dev: {}
    prd: {}

  sequence:
    - environment: dev
    - environment: prd
      manual: true
```

A repository that only needs checks and no deployments can use a minimal file:

```yaml
project: jsonschemas
```

## Fields

| Field | Required | Description |
|-------|----------|-------------|
| `project` | yes | Project name. Typically matches the repository name |
| `description` | no | Description of the project |
| `deployments` | no | The environments the project deploys to and the order they are deployed in. See [below](#deployments) |

## Deployments

When `deployments` is present, both `environments` and `sequence` are required.

| Field | Required | Description |
|-------|----------|-------------|
| `deployments.environments` | yes | Map of environment name to settings. No settings are currently supported, so use `{}` |
| `deployments.sequence` | yes | Ordered list of deployment steps. Each step triggers the next |
| `deployments.sequence[].environment` | yes | The environment deployed to in this step |
| `deployments.sequence[].manual` | no | If `true`, deployment to the next environment is not triggered automatically |

Components of some types can also declare their own `deployments`. See [environments and sequences](../concepts/environments-and-sequences.md).

## Editor validation

The project schema is published in `slingshot-pipelines/jsonschemas` and is the source of truth: [`project.schema.json`](https://github.com/slingshot-pipelines/jsonschemas/blob/main/schemas/project/v1/project.schema.json). Add a modeline to the top of the file, as in the example above, for autocompletion and validation in editors that use `yaml-language-server`.
