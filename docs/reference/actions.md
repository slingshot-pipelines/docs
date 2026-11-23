---
sidebar_position: 2
---

# Actions

:::note[Inferred]
Inputs and outputs are those observed in real callers.
:::

| Action | Version | Inputs | Outputs | Purpose |
|--------|---------|--------|---------|---------|
| `slingshot-pipelines/action-components-changed` | `v1` | `all` (optional) | `changed-component-types`, `changed-components-by-type` | Detect which components changed |
| `slingshot-pipelines/action-pr-ready` | `v0` | `NEEDS` (JSON of the job's `needs`) | n/a | Single pass/fail gate summarising the PR checks |
| `slingshot-pipelines/action-promote-prerelease` | `v0` | `TAG` | n/a | Promote a prerelease to a release |
| `slingshot-pipelines/action-deployment-sequence/parse-dispatch-event` | `v0` | `CLIENT_PAYLOAD` | `COMPONENT`, `ENVIRONMENT`, `TAG` | Read a deploy `repository_dispatch` payload |
| `slingshot-pipelines/action-deployment-sequence/parse-sequence` | `v0` | `COMPONENT`, `PREVIOUS_ENVIRONMENT` | `DONE`, `NEXT_ENVIRONMENT` | Work out whether the sequence is finished and what comes next |
| `slingshot-pipelines/action-deployment-sequence/dispatch-next` | `v0` | `COMPONENT`, `TAG`, `NEXT_ENVIRONMENT` | n/a | Dispatch the next environment's deploy |
