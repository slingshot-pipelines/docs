---
sidebar_position: 1
---

# terragrunt-infra

Terragrunt/Terraform infrastructure. This is the only type that is both checked on pull requests and deployed through an [environment sequence](../../concepts/environments-and-sequences.md).

:::note[Inferred]
Details here are taken from real callers and examples, not from the workflow source.
:::

## Definition

```yaml
# .components/infra/info.yml
component: infra
type: terragrunt-infra

path: infra
```

## Workflows

| Stage | Workflow | Version | Inputs (observed) |
|-------|----------|---------|-------------------|
| Check (pull request) | `check-terragrunt-infra` | `v0` | `COMPONENT`, `TERRAFORM_VERSION`, `TERRAGRUNT_VERSION` |
| Deploy (per environment) | `deploy-terragrunt-infra` | `v1` | `COMPONENT`, `ENVIRONMENT`, `TAG`, `TERRAFORM_VERSION`, `TERRAGRUNT_VERSION` |

The deployment sequence is started by `deploy-sequence-start`. Each environment is then deployed by a `repository_dispatch` event named `deploy-terragrunt-infra-<environment>`, for example `deploy-terragrunt-infra-dev`.

## Gating a job on this type

```yaml
if: ${{ contains(needs.detect-changes.outputs.changed-component-types, '"terragrunt-infra"') }}
# ...
with:
  COMPONENT: ${{ fromJSON(needs.detect-changes.outputs.changed-components-by-type).terragrunt-infra }}
```

See [change detection](../../concepts/change-detection.md) and the [rx-refill-reminders example](../../examples/rx-refill-reminders.md) for a full caller.
