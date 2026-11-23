# Conventions

## GitHub Actions workflows

When authoring a new workflow, write each step with the `-` on its own line and the step's details indented below it:

```yaml
steps:
  -
    uses: actions/checkout@v7
  -
    uses: actions/setup-go@v6
```

This applies to new workflows only; don't restyle existing ones unless asked.
