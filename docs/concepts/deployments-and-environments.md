---
sidebar_position: 2
---

# Deployments & Environments

An **environment** is a named place a component is deployed to, such as `dev`, `stg` or `prd`. A **deployment sequence** puts environments in order, so that a change is deployed to each one in turn. This page explains what environments are, how to configure the sequence, and what your deploy workflows need to do to make it run.

## Environments

Environments are declared in the `deployments` block of `.components/info.yml`. Each one is a name mapped to a settings object. No settings are supported yet, so the value is always `{}`.

```yaml
deployments:
  environments:
    dev: {}
    stg: {}
    prd: {}
```

An environment has no behaviour of its own. It is a name that is passed through the pipeline as the `ENVIRONMENT` input of a deploy workflow, and it is up to the component type to map that name to something real. For example, `deploy-terragrunt-infra` passes it to Terragrunt as the stack to apply (`STACK`), so a Terragrunt component needs a stack named after each environment.

Components of type `lambda`, `s3-website` and `terragrunt-infra` can also declare their own `deployments` block. Other types are not deployed, so they do not accept one.

## Configuring the deployment sequence

The `sequence` lists environment names in the order they are deployed. Each step triggers the next one when it succeeds. Both `environments` and `sequence` are required whenever `deployments` is present.

```yaml
deployments:
  environments:
    dev: {}
    stg: {}
    prd: {}

  sequence:
    - environment: dev
    - environment: stg
    - environment: prd
```

| Field | Required | Description |
|-------|----------|-------------|
| `sequence[].environment` | yes | The environment deployed to in this step |
| `sequence[].manual` | no | If `true`, deployment to the next environment is not triggered automatically |

A few things to know:

- An environment can be declared without being in the sequence. It is then never deployed automatically, but can still be deployed with a [manual deploy](#manual-deploys).
- An empty sequence means there is nothing to deploy to. The release is created straight away as a full release rather than a prerelease.
- The `manual` flag is accepted by the schema, but the `parse-sequence` action in `action-deployment-sequence` does not read it. Honouring it is up to your deploy workflow, which would need to skip `dispatch-next` for a step marked `manual`.

See [`info.yml`](./reference/info-yml.md#deployments) for the field reference.

### Adding an environment

1. Declare it under `deployments.environments` and place it in `deployments.sequence`.
2. Add its event to the deploy workflow's `repository_dispatch` types, for example `deploy-terragrunt-infra-stg`.
3. Add the environment-specific configuration for the component. For Terragrunt infra, that is a new stack named after the environment, alongside the existing ones.

## How a sequence runs

1. A merge to `main` runs `on-push.yml`, which calls the `deploy-sequence-start` workflow for each changed component.
2. `deploy-sequence-start` reads the sequence, tags the commit with the next version (`<component>/v<version>`) as a **prerelease**, and dispatches a deploy event for the **first** environment.
3. The component's deploy workflow receives that event, deploys the tag to that environment, and asks the sequence what comes next.
4. If there is a next environment, the `dispatch-next` action sends a `repository_dispatch` event for it, and steps 3 and 4 repeat.
5. When there is no next environment (`DONE` is `true`), the prerelease is promoted to a release.

If any deployment fails, the sequence stops there: no event is dispatched for the next environment and the prerelease is not promoted.

## What deploy workflows should look like

`deploy-sequence-start` is a reusable workflow, but the per-environment deploy workflow is **yours**: one file per component type in `.github/workflows/`, for example `deploy-terragrunt-infra.yml` or `deploy-lambda.yml`. It is the glue between the events the sequence dispatches and the reusable `deploy-<type>` workflow. A deploy workflow should:

### 1. Listen for one event per environment

The `dispatch-next` action names events `deploy-<component-type>-<environment>`, so the workflow's `repository_dispatch` types must list every environment that component type is deployed to. Adding an environment to the sequence without adding its event here means the sequence stops before it.

```yaml
on:
  repository_dispatch:
    types:
      - deploy-terragrunt-infra-dev
      - deploy-terragrunt-infra-stg
      - deploy-terragrunt-infra-prd
  workflow_dispatch:
    inputs:
      COMPONENT: { required: true, type: string }
      ENVIRONMENT: { required: true, type: string }
      TAG: { required: true, type: string }
      DISPATCH_NEXT: { required: true, type: boolean, default: false }
```

### 2. Read the payload

The event's `client_payload` carries four fields: `component`, `component-type`, `environment` and `tag`. The `parse-dispatch-event` action turns them into the outputs `COMPONENT`, `COMPONENT_TYPE`, `ENVIRONMENT` and `TAG`. Fall back to the `workflow_dispatch` inputs when the run was started by hand.

### 3. Work out where the sequence is

The `parse-sequence` action takes the component and the `PREVIOUS_ENVIRONMENT` (the environment about to be deployed) and outputs:

| Output | Meaning |
|--------|---------|
| `NEXT_ENVIRONMENT` | The environment after this one, if any |
| `DONE` | `true` when there is no environment after this one |
| `ALL_ENVIRONMENTS` | JSON array of every declared environment |

### 4. Deploy the tag

Call the reusable `deploy-<type>` workflow with `COMPONENT`, `ENVIRONMENT` and `TAG`, plus the inputs that type needs (for Terragrunt types, `TERRAFORM_VERSION` and `TERRAGRUNT_VERSION`). Each type's page under [component types](./reference/types-of-components/index.md) lists its inputs.

### 5. Continue or finish

After a successful deploy:

- If `DONE` is `false`, call `dispatch-next` with the `COMPONENT`, `TAG` and `NEXT_ENVIRONMENT`.
- If `DONE` is `true`, promote the prerelease with `action-promote-prerelease`.

On a manual run, only continue the sequence when `DISPATCH_NEXT` is `true`.

The [Quick start](../quick-start.md) has a complete, working `deploy-terragrunt-infra.yml` that does all of this. To support another component type, copy it and change the type in the file name, the event names and the reusable workflow it calls.

### Practical notes

- Set `concurrency` on the workflow with `cancel-in-progress: false`, so that two deployments of the same component queue rather than overlap or cancel each other.
- `dispatch-next` accepts an optional `GITHUB_TOKEN` input, which `deploy-sequence-start` fills with a writer app token when the `WRITER_APP_CLIENT_ID` and `WRITER_APP_PRIVATE_KEY` secrets are set, falling back to the default token.
- Deploy workflows run against the release tag, not the branch head, so every environment gets exactly the same revision.

## Manual deploys

Deploy workflows also support `workflow_dispatch`, so you can deploy a specific tag to a specific environment,.

| Input | Meaning |
|-------|---------|
| `COMPONENT` | Component to deploy |
| `ENVIRONMENT` | Target environment |
| `TAG` | Release tag to deploy |
| `DISPATCH_NEXT` | Continue to the next environment in the sequence on success? |

## A worked example

The [rx-refill-reminders example](../examples/rx-refill-reminders.md) shows a project with `dev` and `prd`, its `on-push.yml` that starts the sequence, and its `deploy-terragrunt-infra.yml` that runs it.
