# 依赖优化选项

- **相关：** [依赖预构建](/guide/dep-pre-bundling)

除非另有说明，本节中的选项仅应用于依赖优化器，该优化器仅在开发模式下使用。

## optimizeDeps.entries <NonInheritBadge />

- **类型：** `string | string[]`

默认情况下，Vite 会爬取所有 `.html` 文件以检测需要预构建的依赖（忽略 `node_modules`、`build.outDir`、`__tests__` 和 `coverage`）。如果指定了 `build.rollupOptions.input`，Vite 将改为爬取那些入口点。

如果这些都不符合你的需求，你可以使用此选项指定自定义入口——值应该是相对于 Vite 项目根目录的 [`tinyglobby` 模式](https://superchupu.dev/tinyglobby/comparison) 或模式数组。这将覆盖默认的入口推断。当显式定义 `optimizeDeps.entries` 时，默认情况下只有 `node_modules` 和 `build.outDir` 文件夹会被忽略。如果需要忽略其他文件夹，你可以使用忽略模式作为入口列表的一部分，以初始 `!` 标记。对于显式包含字符串 `node_modules` 的模式，`node_modules` 不会被忽略。

## optimizeDeps.exclude <NonInheritBadge />

- **类型：** `string[]`

要从预构建中排除的依赖。

:::warning CommonJS
CommonJS 依赖不应被排除在优化之外。如果一个 ESM 依赖被排除在优化之外，但有一个嵌套的 CommonJS 依赖，则该 CommonJS 依赖应添加到 `optimizeDeps.include` 中。示例：

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig({
  optimizeDeps: {
    include: ['esm-dep > cjs-dep'],
  },
})
```

:::

## optimizeDeps.include <NonInheritBadge />

- **类型：** `string[]`

默认情况下，不在 `node_modules` 内的链接包不会被预构建。使用此选项强制预构建链接包。

**实验性：** 如果你使用的库有很多深层导入，你还可以指定一个尾部 glob 模式来一次性预构建所有深层导入。这将避免每当使用新的深层导入时不断进行预构建。[提供反馈](https://github.com/vitejs/vite/discussions/15833)。例如：

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig({
  optimizeDeps: {
    include: ['my-lib/components/**/*.vue'],
  },
})
```

## optimizeDeps.rolldownOptions <NonInheritBadge />

- **类型：** <code>Omit<<a href="https://rolldown.rs/reference/Interface.RolldownOptions">RolldownOptions</a>, 'input' | 'logLevel' | 'output'> & { output?: Omit<<a href="https://rolldown.rs/reference/#:~:text=Output%20Options">RolldownOutputOptions</a>, 'format' | 'sourcemap' | 'dir' | 'banner'> }</code>

在依赖扫描和优化期间传递给 Rolldown 的选项。

某些选项被省略，因为更改它们将与 Vite 的依赖优化不兼容。

- `plugins` 与 Vite 的依赖插件合并

## optimizeDeps.esbuildOptions <NonInheritBadge />

- **类型：** <code>Omit<<a href="https://esbuild.github.io/api/#general-options">EsbuildBuildOptions</a>, 'bundle' | 'entryPoints' | 'external' | 'write' | 'watch' | 'outdir' | 'outfile' | 'outbase' | 'outExtension' | 'metafile'></code>
- **已弃用**

此选项在内部转换为 `optimizeDeps.rolldownOptions`。请改用 `optimizeDeps.rolldownOptions`。

## optimizeDeps.force <NonInheritBadge />

- **类型：** `boolean`

设置为 `true` 以强制依赖预构建，忽略之前缓存的优化依赖。

## optimizeDeps.noDiscovery <NonInheritBadge />

- **类型：** `boolean`
- **默认值：** `false`

当设置为 `true` 时，将禁用自动依赖发现，只有 `optimizeDeps.include` 中列出的依赖会被优化。仅 CJS 的依赖在开发期间必须存在于 `optimizeDeps.include` 中。

## optimizeDeps.holdUntilCrawlEnd <NonInheritBadge />

- **实验性：** [提供反馈](https://github.com/vitejs/vite/discussions/15834)
- **类型：** `boolean`
- **默认值：** `true`

启用时，它将保留第一次优化的依赖结果，直到冷启动期间所有静态导入都被爬取完毕。这避免了当发现新依赖并触发生成新的公共块时需要全页刷新。如果扫描器找到了所有依赖以及 `include` 中显式定义的依赖，最好禁用此选项以让浏览器并行处理更多请求。

## optimizeDeps.disabled <NonInheritBadge />

- **已弃用**
- **实验性：** [提供反馈](https://github.com/vitejs/vite/discussions/13839)
- **类型：** `boolean | 'build' | 'dev'`
- **默认值：** `'build'`

此选项已弃用。从 Vite 5.1 开始，构建期间的依赖预构建已被移除。将 `optimizeDeps.disabled` 设置为 `true` 或 `'dev'` 会禁用优化器，配置为 `false` 或 `'build'` 则保持开发期间优化器启用。

要完全禁用优化器，请使用 `optimizeDeps.noDiscovery: true` 以不允许自动发现依赖，并将 `optimizeDeps.include` 留为 undefined 或空。

:::warning
构建期间优化依赖是一个**实验性**功能。尝试此策略的项目还使用 `build.commonjsOptions: { include: [] }` 移除了 `@rollup/plugin-commonjs`。如果你这样做了，警告将指导你重新启用它以在打包时支持仅 CJS 的包。
:::

## optimizeDeps.needsInterop <NonInheritBadge />

- **实验性**
- **类型：** `string[]`

导入这些依赖时强制 ESM 互操作。Vite 能够正确检测何时依赖需要互操作，因此通常不需要此选项。但是，不同的依赖组合可能导致其中一些被不同地预构建。将这些包添加到 `needsInterop` 可以通过避免全页刷新来加快冷启动速度。如果你的某个依赖属于这种情况，你将收到警告，建议在配置中将包名添加到此数组中。
