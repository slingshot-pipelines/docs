---
sidebar_position: 1
---

# Example: rx-refill-reminders

The [rx-refill-reminders](https://github.com/rx-refill-reminders) organization uses slingshot-pipelines across its repositories. Snippets below are trimmed from the real files.

| Repository | What it shows |
|------------|---------------|
| [`platform`](https://github.com/rx-refill-reminders/platform) | A full project: one Terragrunt component, `dev` then `prd` |
| [`template`](https://github.com/rx-refill-reminders/template) | A template repository pre-wired with the pipelines |
| [`github-management`](https://github.com/rx-refill-reminders/github-management) | A minimal project with no deployments |

## Project and component

In `platform`, `.components/info.yml` declares two environments deployed in order:

```yaml
project: platform

deployments:
  environments:
    dev: {}
    prd: {}

  sequence:
    - environment: dev
    - environment: prd
```

and `.components/infra/info.yml` declares the single component:

```yaml
component: infra
type: terragrunt-infra

path: infra
```

## Pull requests

`pr.yml` detects changed components, runs only the checks that apply, and ends with a `pr-ready` gate:

```yaml
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

  pr-ready:
    runs-on: ubuntu-latest
    if: ${{ always() }}
    needs: [detect-changes, check-components, check-github-workflows, check-infra]
    steps:
      - uses: slingshot-pipelines/action-pr-ready@v0
        with:
          NEEDS: ${{ toJSON(needs) }}
```

The full file also has `check-components` and `check-github-workflows` jobs, gated the same way.

## Merging and deploying

On merge to `main`, `on-push.yml` starts a deployment sequence for each changed component:

```yaml
release-terragrunt-infra:
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
```

`deploy-terragrunt-infra.yml` is triggered per environment by `repository_dispatch`. It parses the event, deploys, then either promotes the prerelease (last environment) or dispatches the next one:

```yaml
on:
  repository_dispatch:
    types:
      - deploy-terragrunt-infra-dev
      - deploy-terragrunt-infra-prd

jobs:
  # parse-deployment-info: parse-dispatch-event + parse-sequence
  deploy:
    needs: [parse-deployment-info]
    uses: slingshot-pipelines/workflows/.github/workflows/deploy-terragrunt-infra.yml@deploy-terragrunt-infra/v1
    with:
      COMPONENT: ${{ needs.parse-deployment-info.outputs.COMPONENT }}
      ENVIRONMENT: ${{ needs.parse-deployment-info.outputs.ENVIRONMENT }}
      TAG: ${{ needs.parse-deployment-info.outputs.TAG }}
    secrets: inherit

  dispatch-next:
    needs: [parse-deployment-info, deploy]
    if: ${{ needs.parse-deployment-info.outputs.SEQUENCE_DONE == 'false' }}
    steps:
      - uses: slingshot-pipelines/action-deployment-sequence/dispatch-next@v0
```

## New repositories from a template

`template` contains a pre-wired `.components/` and workflows so every new repository starts with the pipelines. In `github-management`, a manually-run workflow creates a repository from that template through the GitHub API (`POST /repos/{owner}/template/generate`).
