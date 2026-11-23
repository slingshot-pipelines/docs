---
sidebar_position: 2
---

# Quick start

Adopting slingshot-pipelines in a repository takes three steps: describe what the repository contains, add the GitHub workflows that run the pipelines, then add content.

:::note[Prerequisites]
This page does not cover creating the GitHub App or configuring cloud authentication.
:::

## 1. Set up the `.components` folder

Create a `.components` folder at the root of the repository. It holds one project file and one folder per component.

`.components/info.yml` describes the project, the environments it deploys to and the order they are deployed in. A `sequence` lists the environments in the order they are deployed. It also works with a single environment.

```yaml
project: my-project

deployments:
  environments:
    dev: {}
    prd: {}

  sequence:
    - environment: dev
    - environment: prd
```

Each component gets its own `.components/<name>/info.yml`. For example, `.components/infra/info.yml`:

```yaml
component: infra
type: terragrunt-infra

path: infra
```

The `type` decides which check and deploy workflows apply to the component. See [Types of components](./reference/types-of-components/index.md) for every type and the fields it accepts, and the [info.yml reference](./reference/info-yml.md) for the project and component files.

## 2. Create the GitHub workflows

Add workflows to `.github/workflows/` that check pull requests and deploy when changes are merged. The pull request and merge workflows start with a `detect-changes` job, so only the components that changed are checked or deployed. See [Change detection](./concepts/change-detection.md).

### Pull request checks

`.github/workflows/pr.yml`:

```yaml
name: pr

on:
  pull_request:

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      changed-component-types: ${{ steps.components-changed.outputs.changed-component-types }}
      changed-components-by-type: ${{ steps.components-changed.outputs.changed-components-by-type }}
    steps:
      - uses: actions/checkout@v6
      - id: components-changed
        uses: slingshot-pipelines/action-components-changed@v1

  # These two checks are examples. Which checks you need depends on the
  # component types in your project.
  check-infra:
    needs: [detect-changes]
    if: ${{ contains(needs.detect-changes.outputs.changed-component-types, '"terragrunt-infra"') }}
    uses: slingshot-pipelines/workflows/.github/workflows/check-terragrunt-infra.yml@check-terragrunt-infra/v0
    strategy:
      matrix:
        COMPONENT: ${{ fromJSON(needs.detect-changes.outputs.changed-components-by-type).terragrunt-infra }}
    with:
      COMPONENT: ${{ matrix.COMPONENT }}
      TERRAFORM_VERSION: ${{ vars.TERRAFORM_VERSION }}
      TERRAGRUNT_VERSION: ${{ vars.TERRAGRUNT_VERSION }}
    secrets: inherit

  check-lambdas:
    needs: [detect-changes]
    if: ${{ contains(needs.detect-changes.outputs.changed-component-types, '"lambda"') }}
    uses: slingshot-pipelines/workflows/.github/workflows/check-lambda.yml@check-lambda/v0
    strategy:
      matrix:
        COMPONENT: ${{ fromJSON(needs.detect-changes.outputs.changed-components-by-type).lambda }}
    with:
      COMPONENT: ${{ matrix.COMPONENT }}
      TERRAFORM_VERSION: ${{ vars.TERRAFORM_VERSION }}
      TERRAGRUNT_VERSION: ${{ vars.TERRAGRUNT_VERSION }}
    secrets: inherit

  # A single job to require in branch protection
  pr-ready:
    runs-on: ubuntu-latest
    if: ${{ always() }}
    needs: [detect-changes, check-infra, check-lambdas]
    steps:
      - uses: slingshot-pipelines/action-pr-ready@v0
        with:
          NEEDS: ${{ toJSON(needs) }}
```

### Start deployments on merge

`.github/workflows/on-push.yml` runs when changes land on `main`. For each changed component it tags a prerelease and starts the deployment sequence from `.components/info.yml`, by dispatching a deploy event for the first environment.

```yaml
name: on-push

on:
  push:
    branches: [main]

permissions:
  contents: write
  pull-requests: write
  id-token: write

concurrency:
  group: ${{ github.workflow }}
  cancel-in-progress: false

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      changed-component-types: ${{ steps.components-changed.outputs.changed-component-types }}
      changed-components-by-type: ${{ steps.components-changed.outputs.changed-components-by-type }}
    steps:
      - uses: actions/checkout@v6
      - id: components-changed
        uses: slingshot-pipelines/action-components-changed@v1

  # These two jobs are examples. Which ones you need depends on the
  # component types in your project.
  start-infra:
    needs: [detect-changes]
    if: ${{ contains(needs.detect-changes.outputs.changed-component-types, '"terragrunt-infra"') }}
    uses: slingshot-pipelines/workflows/.github/workflows/deploy-sequence-start.yml@deploy-sequence-start/v0
    strategy:
      matrix:
        COMPONENT: ${{ fromJSON(needs.detect-changes.outputs.changed-components-by-type).terragrunt-infra }}
    with:
      COMPONENT: ${{ matrix.COMPONENT }}
    secrets:
      WRITER_APP_CLIENT_ID: ${{ secrets.WRITER_APP_CLIENT_ID }}
      WRITER_APP_PRIVATE_KEY: ${{ secrets.WRITER_APP_PRIVATE_KEY }}

  start-lambdas:
    needs: [detect-changes]
    if: ${{ contains(needs.detect-changes.outputs.changed-component-types, '"lambda"') }}
    uses: slingshot-pipelines/workflows/.github/workflows/deploy-sequence-start.yml@deploy-sequence-start/v0
    strategy:
      matrix:
        COMPONENT: ${{ fromJSON(needs.detect-changes.outputs.changed-components-by-type).lambda }}
    with:
      COMPONENT: ${{ matrix.COMPONENT }}
    secrets:
      WRITER_APP_CLIENT_ID: ${{ secrets.WRITER_APP_CLIENT_ID }}
      WRITER_APP_PRIVATE_KEY: ${{ secrets.WRITER_APP_PRIVATE_KEY }}
```

### Deploy a component type

Deploy workflows are specific to a component type. Add one for each type you use, such as `deploy-terragrunt-infra.yml` and `deploy-lambda.yml`. Each one listens for that type's events, `deploy-<type>-<environment>`, with one event per environment, and calls that type's reusable deploy workflow. Each is triggered by the event that `on-push.yml` dispatches, or by hand with `workflow_dispatch`, and deploys the release tag to one environment. After a successful deploy it dispatches the next environment's event, or, after the last environment, promotes the prerelease to a release. This example is `.github/workflows/deploy-terragrunt-infra.yml`:

```yaml
name: deploy (terragrunt-infra)

run-name: Deploy ${{ github.event.client_payload.tag || inputs.TAG }} to ${{ github.event.client_payload.environment || inputs.ENVIRONMENT }}

on:
  repository_dispatch:
    types:
      - deploy-terragrunt-infra-dev
      - deploy-terragrunt-infra-prd

  workflow_dispatch:
    inputs:
      COMPONENT:
        description: component
        required: true
        type: string
      ENVIRONMENT:
        description: environment
        required: true
        type: string
      TAG:
        description: tag
        required: true
        type: string
      DISPATCH_NEXT:
        description: dispatch next on success?
        required: true
        type: boolean
        default: false

permissions:
  contents: write
  pull-requests: write
  id-token: write

concurrency:
  group: ${{ github.workflow }}
  cancel-in-progress: false

jobs:
  parse-deployment-info:
    runs-on: ubuntu-latest
    outputs:
      COMPONENT: ${{ steps.deployment-info.outputs.COMPONENT }}
      ENVIRONMENT: ${{ steps.deployment-info.outputs.ENVIRONMENT }}
      TAG: ${{ steps.deployment-info.outputs.TAG }}
      SEQUENCE_DONE: ${{ steps.parse-deployment-sequence.outputs.DONE }}
      NEXT_ENVIRONMENT: ${{ steps.parse-deployment-sequence.outputs.NEXT_ENVIRONMENT }}
    steps:
      - uses: actions/checkout@v6
      - name: Parse repository_dispatch payload
        id: parse-dispatch-event
        if: github.event_name == 'repository_dispatch'
        uses: slingshot-pipelines/action-deployment-sequence/parse-dispatch-event@v0
        with:
          CLIENT_PAYLOAD: ${{ toJSON(github.event.client_payload) }}
      - name: Consolidate deployment info
        id: deployment-info
        env:
          COMPONENT: ${{ steps.parse-dispatch-event.outputs.COMPONENT || inputs.COMPONENT }}
          ENVIRONMENT: ${{ steps.parse-dispatch-event.outputs.ENVIRONMENT || inputs.ENVIRONMENT }}
          TAG: ${{ steps.parse-dispatch-event.outputs.TAG || inputs.TAG }}
        run: |
          {
            echo "COMPONENT=$COMPONENT"
            echo "ENVIRONMENT=$ENVIRONMENT"
            echo "TAG=$TAG"
          } | tee -a "$GITHUB_OUTPUT"
      - name: Parse deployment sequence
        id: parse-deployment-sequence
        uses: slingshot-pipelines/action-deployment-sequence/parse-sequence@v0
        with:
          COMPONENT: ${{ steps.deployment-info.outputs.COMPONENT }}
          PREVIOUS_ENVIRONMENT: ${{ steps.deployment-info.outputs.ENVIRONMENT }}

  deploy:
    needs: [parse-deployment-info]
    uses: slingshot-pipelines/workflows/.github/workflows/deploy-terragrunt-infra.yml@deploy-terragrunt-infra/v1
    with:
      COMPONENT: ${{ needs.parse-deployment-info.outputs.COMPONENT }}
      ENVIRONMENT: ${{ needs.parse-deployment-info.outputs.ENVIRONMENT }}
      TAG: ${{ needs.parse-deployment-info.outputs.TAG }}
      TERRAFORM_VERSION: ${{ vars.TERRAFORM_VERSION }}
      TERRAGRUNT_VERSION: ${{ vars.TERRAGRUNT_VERSION }}
    secrets: inherit

  # After the last environment, promote the prerelease to a release
  release:
    needs: [parse-deployment-info, deploy]
    if: ${{ needs.parse-deployment-info.outputs.SEQUENCE_DONE == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: slingshot-pipelines/action-promote-prerelease@v0
        with:
          TAG: ${{ needs.parse-deployment-info.outputs.TAG }}

  # Otherwise, deploy the next environment. A manual run only continues
  # the sequence when DISPATCH_NEXT is true.
  dispatch-next:
    needs: [parse-deployment-info, deploy]
    if: ${{ needs.parse-deployment-info.outputs.SEQUENCE_DONE == 'false' && !(github.event_name == 'workflow_dispatch' && inputs.DISPATCH_NEXT == false) }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
        with:
          ref: ${{ needs.parse-deployment-info.outputs.TAG }}
      - uses: slingshot-pipelines/action-deployment-sequence/dispatch-next@v0
        with:
          COMPONENT: ${{ needs.parse-deployment-info.outputs.COMPONENT }}
          TAG: ${{ needs.parse-deployment-info.outputs.TAG }}
          NEXT_ENVIRONMENT: ${{ needs.parse-deployment-info.outputs.NEXT_ENVIRONMENT }}
```


For another component type, copy this workflow and change the `<type>` in the file name, the `name`, the event names and the reusable workflow, for example `deploy-lambda.yml@deploy-lambda/v1`. The inputs differ by type, so see each [component type](./reference/types-of-components/index.md) for the workflows it uses and their inputs. See [Environments and deployment sequences](./concepts/environments-and-sequences.md) for how a sequence runs.

### Configure the repository

- Repository **variables**: `TERRAFORM_VERSION`, `TERRAGRUNT_VERSION`
- Repository **secrets**: `WRITER_APP_CLIENT_ID`, `WRITER_APP_PRIVATE_KEY`
- Branch protection: require the `pr-ready` check on `main`

If your organization keeps a template repository with these files in place, generating new repositories from it skips steps 1 and 2. See [the example](./examples/rx-refill-reminders.md#new-repositories-from-a-template).

## 3. Add content

Add the component's files under the `path` you declared, and open a pull request. The workflows detect the change and run the checks for that component.

A step-by-step tutorial is planned for this section.
