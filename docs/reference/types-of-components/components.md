---
sidebar_position: 2
---

# components

The `.components/` definitions themselves. Use this type for a component whose `path` covers the directory holding your component definitions, so that changes to them are validated.

:::note[Inferred]
Details here are taken from real callers and examples, not from the workflow source.
:::

## Workflows

| Stage | Workflow | Version | Inputs (observed) |
|-------|----------|---------|-------------------|
| Check (pull request) | `check-components` | `v0` | none |
| Deploy | n/a | | |

`check-components` validates the `.components` definitions, so a malformed `info.yml` fails the pull request before anything else runs.

## Related

- [info.yml reference](../info-yml.md)
- [Add a component](../../guides/add-a-component.md)
