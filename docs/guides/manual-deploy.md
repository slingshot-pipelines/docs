---
sidebar_position: 3
---

# Run a manual deploy

Deploy workflows expose `workflow_dispatch`, so you can deploy from the **Actions** tab.

| Input | Meaning |
|-------|---------|
| `COMPONENT` | Component to deploy |
| `ENVIRONMENT` | Target environment |
| `TAG` | Release tag to deploy |
| `DISPATCH_NEXT` | Continue to the next environment in the sequence on success? |

To rebuild and release every component rather than only the changed ones, run the `on-push` workflow manually with `TRIGGER_ALL` set to `true`.

## Unlocking Terragrunt state

If a run is interrupted and leaves a state lock behind, use the `terragrunt-unlock` workflow, giving the `STACK` (e.g. `dev`) and `UNIT` to unlock.
