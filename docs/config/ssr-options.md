# SSR 选项

除非另有说明，本节中的选项同时适用于开发环境和构建环境。

## ssr.external

- **类型：** `string[] | true`
- **相关：** [SSR 外部化依赖](/guide/ssr#ssr-externals)

将指定的依赖及其传递依赖外部化以用于 SSR。默认情况下，除了链接依赖（用于 HMR）外，所有依赖都会被外部化。如果你希望外部化链接依赖，可以将它们的名称传递给此选项。

如果为 `true`，包括链接依赖在内的所有依赖都会被外部化。

请注意，如果显式列出的依赖（使用 `string[]` 类型）也在 `ssr.noExternal` 中列出（使用任何类型），它们将始终优先。

## ssr.noExternal

- **类型：** `string | RegExp | (string | RegExp)[] | true`
- **相关：** [SSR 外部化依赖](/guide/ssr#ssr-externals)

防止列出的依赖在 SSR 中被外部化，它们将在构建时被打包。默认情况下，只有链接依赖不会被外部化（用于 HMR）。如果你希望外部化链接依赖，可以将它们的名称传递给 `ssr.external` 选项。

如果为 `true`，没有依赖会被外部化。但是，显式列在 `ssr.external` 中的依赖（使用 `string[]` 类型）可以优先并仍然被外部化。如果设置了 `ssr.target: 'node'`，Node.js 内置模块默认也会被外部化。

请注意，如果同时配置了 `ssr.noExternal: true` 和 `ssr.external: true`，`ssr.noExternal` 优先，没有依赖会被外部化。

## ssr.target

- **类型：** `'node' | 'webworker'`
- **默认值：** `node`

SSR 服务器的构建目标。

## ssr.resolve.conditions

- **类型：** `string[]`
- **默认值：** `['module', 'node', 'development|production']` (`defaultServerConditions`)（当 `ssr.target === 'webworker'` 时为 `['module', 'browser', 'development|production']` (`defaultClientConditions`)）
- **相关：** [解析条件](./shared-options.md#resolve-conditions)

这些条件用于插件管道中，仅影响 SSR 构建期间非外部化的依赖。使用 `ssr.resolve.externalConditions` 来影响外部化的导入。

## ssr.resolve.externalConditions

- **类型：** `string[]`
- **默认值：** `['node']`

在外部化直接依赖（由 Vite 导入的外部依赖）的 ssr 导入（包括 `ssrLoadModule`）期间使用的条件。

:::tip

使用此选项时，请确保在开发环境和构建环境中都使用相同的值通过 [`--conditions` 标志](https://nodejs.org/docs/latest/api/cli.html#-c-condition---conditionscondition) 运行 Node，以获得一致的行为。

例如，当设置为 `['node', 'custom']` 时，你应该在开发环境中运行 `NODE_OPTIONS='--conditions custom' vite`，并在构建后运行 `NODE_OPTIONS="--conditions custom" node ./dist/server.js`。

:::

## ssr.resolve.mainFields

- **类型：** `string[]`
- **默认值：** `['module', 'jsnext:main', 'jsnext']`

解析包的入口点时要尝试的 `package.json` 中的字段列表。请注意，此设置的优先级低于从 `exports` 字段解析的条件导出：如果从 `exports` 成功解析了入口点，则将忽略 main 字段。此设置仅影响非外部化的依赖。
