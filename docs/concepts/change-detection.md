---
sidebar_position: 3
---

# Change detection

Pipelines avoid running everything on every change. The `action-components-changed` action inspects the change and reports which components are affected.

```yaml
- name: Detect changed components
  id: components-changed
  uses: slingshot-pipelines/action-components-changed@v1
```

Outputs:

| Output | Contents |
|--------|----------|
| `changed-component-types` | JSON list of component types with changes, e.g. `["terragrunt-infra"]` |
| `changed-components-by-type` | JSON object mapping each type to the names of changed components |

Downstream jobs use these to run only what's needed, and fan out with a matrix:

```yaml
check-infra:
  needs: [detect-changes]
  if: ${{ contains(needs.detect-changes.outputs.changed-component-types, '"terragrunt-infra"') }}
  strategy:
    matrix:
      COMPONENT: ${{ fromJSON(needs.detect-changes.outputs.changed-components-by-type).terragrunt-infra }}
```

On a manual run you can force everything with the `all` input:

```yaml
with:
  all: ${{ github.event_name == 'workflow_dispatch' && inputs.TRIGGER_ALL }}
```
