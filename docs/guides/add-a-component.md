---
sidebar_position: 1
---

# Add a component

1. Create the files for the component in a directory, e.g. `infra/`.
2. Add `.components/<name>/info.yml`:

   ```yaml
   component: <name>
   type: terragrunt-infra
   path: <directory>
   ```

3. Open a pull request. The `check-components` workflow validates the definition, and change detection will pick up the component as soon as files under its `path` change.

The component is deployed the next time it changes on `main`, or when you run a [manual deploy](./manual-deploy.md) or a full release with `TRIGGER_ALL`.
