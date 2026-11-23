---
sidebar_position: 4
---

# Reusable workflows and versioning

Pipelines are published as reusable workflows in `slingshot-pipelines/workflows`. Your repository's workflow files stay short and delegate to them:

```yaml
check-infra:
  uses: slingshot-pipelines/workflows/.github/workflows/check-terragrunt-infra.yml@check-terragrunt-infra/v0
  with:
    COMPONENT: ${{ matrix.COMPONENT }}
  secrets: inherit
```

## Version tags

Each reusable workflow is versioned independently with a tag of the form `<workflow-name>/v<major>`, for example `check-terragrunt-infra/v0` or `deploy-terragrunt-infra/v1`. Actions use plain major tags such as `@v0` and `@v1`.

Pin to the major tag; compatible updates arrive automatically, and breaking changes require you to opt in by changing the tag.

## Secrets and variables

Workflows are typically called with `secrets: inherit`. Common configuration seen in practice:

| Name | Kind | Used by |
|------|------|---------|
| `TERRAFORM_VERSION`, `TERRAGRUNT_VERSION` | Repository variable | Terragrunt check and deploy workflows |
| `WRITER_APP_CLIENT_ID`, `WRITER_APP_PRIVATE_KEY` | Secret (GitHub App) | `deploy-sequence-start`, to create tags/releases |
