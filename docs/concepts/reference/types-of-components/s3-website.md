---
sidebar_position: 5
---

# s3-website

A static website deployed to S3 and served through CloudFront. A single component can hold the website source, its build output and the infrastructure that hosts it.

## Definition

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/slingshot-pipelines/jsonschemas/main/schemas/component/v1/component.schema.json

component: site
type: s3-website
path: site
subpaths:
  src: src
  build: dist
  infra: infra
```

`subpaths` is optional. A component with only `component`, `type` and `path` is still valid and keeps the [original behavior](#without-subpaths).

## Fields

| Field | Required | Description |
|-------|----------|-------------|
| `component` | yes | Name of the component |
| `type` | yes | `s3-website` |
| `path` | yes | Directory containing the component |
| `subpaths.src` | with `subpaths` | Path to the website source code (relative to `path`) |
| `subpaths.build` | with `subpaths` | Path for the built website files that are uploaded (relative to `path`) |
| `subpaths.infra` | with `subpaths` | Path to the website infrastructure (relative to `path`), containing Terragrunt `units` and `stacks` |
| `deployments` | no | Per-component [environments and sequence](../../deployments-and-environments.md) |

`subpaths` is all or nothing: when present, `src`, `build` and `infra` are all required. No other fields are allowed. The schema is [`s3-website.schema.json`](https://github.com/slingshot-pipelines/jsonschemas/blob/main/schemas/component-types/v1/s3-website.schema.json).

## Workflows

| Stage | Workflow | Inputs |
|-------|----------|--------|
| Check | [`check-s3-website`](https://github.com/slingshot-pipelines/workflows/blob/main/.github/workflows/check-s3-website.yml), [`check-s3-websites`](https://github.com/slingshot-pipelines/workflows/blob/main/.github/workflows/check-s3-websites.yml) | `COMPONENT`, `TERRAFORM_VERSION` and `TERRAGRUNT_VERSION` (required with `subpaths`) |
| Deploy | [`deploy-s3-website`](https://github.com/slingshot-pipelines/workflows/blob/main/.github/workflows/deploy-s3-website.yml) | `COMPONENT`, `ENVIRONMENT`, `TAG`, `TERRAFORM_VERSION` and `TERRAGRUNT_VERSION` (required with `subpaths`), `SLACK_CHANNEL` (optional) |

The plural workflow (`check-*s`, `release-*ies`) takes a JSON list in `COMPONENTS` and runs the singular workflow for each. Workflow inputs and secrets are documented in the [workflows repository](https://github.com/slingshot-pipelines/workflows).

## How it works

**Check.** The workflow installs dependencies in the source directory and runs `make lint` and `make unit-test` when the component's Makefile defines those targets, then builds the site. With `subpaths`, the build output is cached and the Terragrunt infrastructure in `subpaths.infra` is linted and planned with that output available.

**Deploy.** The workflow checks out the tag, builds the site with `make build` and caches the build output. With `subpaths`, it then applies the Terragrunt stacks in `subpaths.infra/stacks` for the environment. Finally it syncs the build output to the S3 bucket and invalidates the CloudFront cache. Static assets are uploaded with a long-lived cache header. HTML files and `manifest.json` are uploaded with `max-age=0, must-revalidate`.

The upload target and build variables for each environment come from `deployments/<environment>/deployment.yml` in the component directory:

```yaml
assume-role-arn: arn:aws:iam::123456789012:role/deploy-site
s3-bucket: my-site-bucket
cf-distribution: E1234567890ABC
env:            # optional; exported as environment variables for `make build`
  API_URL: https://api.example.com
```

`assume-role-arn`, `s3-bucket` and `cf-distribution` are required.

### Without subpaths

When `subpaths` is omitted, the source is the component `path`, the build output is `dist` inside it, and no infrastructure is checked or applied. The bucket and distribution must already exist and be named in `deployment.yml`.
