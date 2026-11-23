---
sidebar_position: 2
---

# Environments and deployment sequences

Environments are declared on the project, and a **sequence** puts them in order:

```yaml
deployments:
  environments:
    dev: {}
    prd: {}

  sequence:
    - environment: dev
    - environment: prd
```

## How a sequence runs

1. A merge to `main` starts the sequence for each changed component, deploying to the **first** environment.
2. The deploy workflow runs the component type's deploy pipeline for that environment and the release tag.
3. On success, the `dispatch-next` step sends a `repository_dispatch` event for the **next** environment in the sequence.
4. When there is no next environment (`SEQUENCE_DONE` is `true`), the prerelease is promoted to a release.

Deploy workflows are triggered by `repository_dispatch` events named after the component type and environment, for example `deploy-terragrunt-infra-dev` and `deploy-terragrunt-infra-prd`.

:::note[Inferred]
The event naming and the `COMPONENT` / `ENVIRONMENT` / `TAG` payload are inferred from the deploy workflow in the [rx-refill-reminders example](../examples/rx-refill-reminders.md).
:::

## Manual deploys

Deploy workflows also support `workflow_dispatch`, so you can deploy a specific tag to a specific environment, and choose whether the rest of the sequence should continue (`DISPATCH_NEXT`).
