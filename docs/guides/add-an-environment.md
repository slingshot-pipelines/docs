---
sidebar_position: 2
---

# Add an environment

1. Declare the environment on the project and place it in the sequence in `.components/info.yml`:

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

2. Add the environment to the deploy workflow's `repository_dispatch` types, e.g. `deploy-terragrunt-infra-stg`.
3. Add the environment-specific configuration for your component (for Terragrunt infra, a new stack alongside `dev` and `prd`).
