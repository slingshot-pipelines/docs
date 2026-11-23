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

`.components/info.yml` describes the project and, optionally, its environments and the order they are deployed in:

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

The `type` decides which check and deploy workflows apply to the component. See [Types of components](/category/types-of-components) for every type and the fields it accepts, and the [info.yml reference](./reference/info-yml.md) for the project and component files.

## 2. Create the GitHub workflows

Add two workflows to `.github/workflows/`: one that checks pull requests and one that deploys when changes are merged. Both start with a `detect-changes` job, so only the components that changed are checked or deployed. See [Change detection](./concepts/change-detection.md).

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

### Deployments

`.github/workflows/on-push.yml` runs when changes land on `main`. For each changed component it starts the deployment sequence from `.components/info.yml`:

```yaml
name: on-push

on:
  push:
    branches: [main]

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

  # These two deployments are examples. Which ones you need depends on the
  # component types in your project.
  deploy-infra:
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

  deploy-lambdas:
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

`deploy-sequence-start` tags the component and triggers the first environment with a `repository_dispatch` event. A separate workflow per component type, such as `deploy-terragrunt-infra.yml`, receives that event, deploys the environment and dispatches the next one. See the [full example](./examples/rx-refill-reminders.md#merging-and-deploying), and the [reusable workflows](./reference/workflows.md) for the other component types.

### Configure the repository

- Repository **variables**: `TERRAFORM_VERSION`, `TERRAGRUNT_VERSION`
- Repository **secrets**: `WRITER_APP_CLIENT_ID`, `WRITER_APP_PRIVATE_KEY`
- Branch protection: require the `pr-ready` check on `main`

If your organization keeps a template repository with these files in place, generating new repositories from it skips steps 1 and 2. See [the example](./examples/rx-refill-reminders.md#new-repositories-from-a-template).

## 3. Add content

Add the component's files under the `path` you declared, and open a pull request. The workflows detect the change and run the checks for that component. See [Add a component](./guides/add-a-component.md) for adding further components.

A step-by-step tutorial is planned for this section.
