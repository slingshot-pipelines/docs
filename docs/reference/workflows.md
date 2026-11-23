---
sidebar_position: 1
---

# Reusable workflows

The source of truth is the [`slingshot-pipelines/workflows`](https://github.com/slingshot-pipelines/workflows) repository. Each workflow's inputs, secrets and outputs are documented in its README, and its definition lives in `.github/workflows/<name>.yml`.

All are referenced as
`slingshot-pipelines/workflows/.github/workflows/<name>.yml@<name>/<version>`.

## Per component type

See [types of components](./types-of-components/terragrunt-infra.md) for which of these apply to each type. Plural workflows (for example `check-lambdas`) take a JSON list in `COMPONENTS` and run the singular workflow for each component.

| Prefix | Workflows |
|--------|-----------|
| Check | `check-github-action(s)`, `check-json-schemas`, `check-lambda(s)`, `check-library`/`check-libraries`, `check-s3-website(s)`, `check-terraform-modules`, `check-terragrunt-infra(s)` |
| Deploy | `deploy-lambda`, `deploy-s3-website`, `deploy-terragrunt-infra` |
| Release | `release-library`/`release-libraries`, `release-terraform-modules` |

## Repository-level

| Workflow | Purpose |
|----------|---------|
| `check-components` | Validate the `.components` manifest: the project defines a name, and every component has `component`, `type` and `path`. No inputs |
| `check-github-workflows` | Check GitHub workflow files |
| `deploy-sequence-start` | Start the deployment sequence for a changed component (`COMPONENT`). Needs `WRITER_APP_CLIENT_ID` and `WRITER_APP_PRIVATE_KEY` secrets |
| `tag-and-release` | Create the next semver tag and a GitHub release for a tag prefix, optionally updating floating major/minor tags. Called by the release workflows |

## Building blocks

Called by the workflows above rather than directly: `terragrunt-plan`, `terragrunt-apply` and `terragrunt-unlock`.
