---
sidebar_position: 1
---

# Adopt slingshot-pipelines in a repo

This walks through the minimum setup for a repository with one Terragrunt infrastructure component and two environments.

:::note[Inferred]
These steps are assembled from a working repository, [`rx-refill-reminders/platform`](https://github.com/rx-refill-reminders/platform). Prerequisites such as the GitHub App and cloud authentication are not covered here.
:::

## 1. Describe the project

Create `.components/info.yml`:

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

## 2. Describe each component

Create `.components/infra/info.yml`:

```yaml
component: infra
type: terragrunt-infra

path: infra
```

## 3. Add the pull request workflow

Create `.github/workflows/pr.yml`. It detects changes, runs the relevant checks, and exposes a single `pr-ready` job to use as a required status check. See the [full example](../examples/rx-refill-reminders.md#pull-requests).

## 4. Add the push and deploy workflows

- `on-push.yml` runs on `main`, detects changed components and starts a deploy sequence.
- `deploy-terragrunt-infra.yml` runs per environment and dispatches the next one.

See the [full examples](../examples/rx-refill-reminders.md#merging-and-deploying).

## 5. Configure the repository

- Repository **variables**: `TERRAFORM_VERSION`, `TERRAGRUNT_VERSION`
- Repository **secrets**: `WRITER_APP_CLIENT_ID`, `WRITER_APP_PRIVATE_KEY`
- Branch protection: require the `pr-ready` check on `main`

## Starting from a template

If your organization keeps a template repository with these files already in place, generating new repositories from it is the fastest path. rx-refill-reminders does exactly this; see [the example](../examples/rx-refill-reminders.md#new-repositories-from-a-template).
