# AGENTS.md

This repository is the documentation site for slingshot-pipelines (Docusaurus, content in `docs/`). The behaviour it documents is defined in two other repositories. Read them before writing or changing docs, rather than inferring behaviour from examples.

## Sources of truth

### `slingshot-pipelines/jsonschemas` — the `.components` file formats

- `schemas/project/v1/project.schema.json`: the project file (`.components/info.yml`)
- `schemas/component/v1/component.schema.json`: a component file. Its `type` enum is the list of valid component types, and it dispatches to one schema per type
- `schemas/component-types/v1/<type>.schema.json`: the fields each type accepts or requires
- `schemas/fields/v1/`: shared fields such as `deployments`

Schemas use `additionalProperties: false`, so a field that is not in the schema is not valid.

### `slingshot-pipelines/workflows` — the reusable workflows

- `.github/workflows/<name>.yml`: the workflow definition. The `workflow_call` block lists its inputs, secrets and outputs
- `docs/<name>/README.md`: a description of each workflow with input, secret and output tables

Workflows are versioned per workflow with `<name>/v<major>` tags. Plural workflows (for example `check-lambdas`) fan out over a `COMPONENTS` list and call the singular workflow.

## Guidelines

- When a component type or workflow is added or changed upstream, update `docs/concepts/reference/types-of-components/`, `docs/concepts/reference/info-yml.md` and `docs/concepts/reference/workflows.md` to match.
- Keep one page per component type in `docs/concepts/reference/types-of-components/`.
- Do not mark content as "Inferred" if it can be checked against the two repositories above. Check it instead.

## Commands

```bash
npm ci
npm start      # dev server
npm run build  # production build, also catches broken links
```
