---
sidebar_position: 1
---

# Reusable workflows

:::note[Inferred]
Inputs listed here are those observed in real callers, not an exhaustive list from the workflow source.
:::

All live in `slingshot-pipelines/workflows`, referenced as
`slingshot-pipelines/workflows/.github/workflows/<name>.yml@<name>/<version>`.

| Workflow | Version | Inputs (observed) | Purpose |
|----------|---------|-------------------|---------|
| `check-components` | `v0` | none | Validate `.components` definitions |
| `check-github-workflows` | `v0` | `COMPONENT` | Check GitHub workflow files |
| `check-terragrunt-infra` | `v0` | `COMPONENT`, `TERRAFORM_VERSION`, `TERRAGRUNT_VERSION` | Check Terragrunt infrastructure on a PR |
| `deploy-sequence-start` | `v0` | `COMPONENT` | Start the deployment sequence for a changed component. Needs `WRITER_APP_CLIENT_ID` and `WRITER_APP_PRIVATE_KEY` secrets |
| `deploy-terragrunt-infra` | `v1` | `COMPONENT`, `ENVIRONMENT`, `TAG`, `TERRAFORM_VERSION`, `TERRAGRUNT_VERSION` | Deploy Terragrunt infrastructure to one environment |
