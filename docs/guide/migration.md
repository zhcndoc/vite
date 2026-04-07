# 从 v7 迁移

如果你是从 `rolldown-vite` 迁移，这是为 v6 和 v7 集成 Rolldown 的 Rolldown 技术预览版，只有标题中带 <Badge text="NRV" type="warning" /> 的章节适用。

## 默认浏览器目标变更 [<Badge text="NRV" type="warning" />](#migration-from-v7)

`build.target` 的默认浏览器值以及 `'baseline-widely-available'` 已更新为更新的浏览器版本：

- Chrome 107 → 111
- Edge 107 → 111
- Firefox 104 → 114
- Safari 16.0 → 16.4

这些浏览器版本与截至 2026-01-01 的 [Baseline Widely Available](https://web-platform-dx.github.io/web-features/) 功能集保持一致。换句话说，它们都是在大约两年前发布的。

## Rolldown

Vite 8 使用基于 [Rolldown](https://rolldown.rs/) 和 [Oxc](https://oxc.rs/) 的工具，而不是 [esbuild](https://esbuild.github.io/) 和 [Rollup](https://rollupjs.org/)。

### 渐进式迁移

`rolldown-vite` 包实现了带有 Rolldown 的 Vite 7，没有其他 Vite 8 的变更。这可以作为迁移到 Vite 8 的中间步骤。请参阅 Vite 7 文档中的 [Rolldown 集成指南](https://v7.vite.dev/guide/rolldown) 以从 Vite 7 切换到 `rolldown-vite`。

对于从 `rolldown-vite` 迁移到 Vite 8 的用户，你可以撤销 `package.json` 中的依赖变更并更新到 Vite 8：

```json
{
  "devDependencies": {
    "vite": "npm:rolldown-vite@7.2.2" // [!code --]
    "vite": "^8.0.0" // [!code ++]
  }
}
```

### 依赖优化器现在使用 Rolldown

Rolldown 现在用于依赖优化，而不是 esbuild。Vite 仍然支持 [`optimizeDeps.esbuildOptions`](/config/dep-optimization-options#optimizedeps-esbuildoptions) 以保持向后兼容，方法是将其自动转换为 [`optimizeDeps.rolldownOptions`](/config/dep-optimization-options#optimizedeps-rolldownoptions)。`optimizeDeps.esbuildOptions` 现已弃用，将在未来移除，我们鼓励你迁移到 `optimizeDeps.rolldownOptions`。

以下选项会自动转换：

- [`esbuildOptions.minify`](https://esbuild.github.io/api/#minify) -> [`rolldownOptions.output.minify`](https://rolldown.rs/reference/OutputOptions.minify)
- [`esbuildOptions.treeShaking`](https://esbuild.github.io/api/#tree-shaking) -> [`rolldownOptions.treeshake`](https://rolldown.rs/reference/InputOptions.treeshake)
- [`esbuildOptions.define`](https://esbuild.github.io/api/#define) -> [`rolldownOptions.transform.define`](https://rolldown.rs/reference/InputOptions.transform#define)
- [`esbuildOptions.loader`](https://esbuild.github.io/api/#loader) -> [`rolldownOptions.moduleTypes`](https://rolldown.rs/reference/InputOptions.moduleTypes)
- [`esbuildOptions.preserveSymlinks`](https://esbuild.github.io/api/#preserve-symlinks) -> [`!rolldownOptions.resolve.symlinks`](https://rolldown.rs/reference/InputOptions.resolve#symlinks)
- [`esbuildOptions.resolveExtensions`](https://esbuild.github.io/api/#resolve-extensions) -> [`rolldownOptions.resolve.extensions`](https://rolldown.rs/reference/InputOptions.resolve#extensions)
- [`esbuildOptions.mainFields`](https://esbuild.github.io/api/#main-fields) -> [`rolldownOptions.resolve.mainFields`](https://rolldown.rs/reference/InputOptions.resolve#mainfields)
- [`esbuildOptions.conditions`](https://esbuild.github.io/api/#conditions) -> [`rolldownOptions.resolve.conditionNames`](https://rolldown.rs/reference/InputOptions.resolve#conditionnames)
- [`esbuildOptions.keepNames`](https://esbuild.github.io/api/#keep-names) -> [`rolldownOptions.output.keepNames`](https://rolldown.rs/reference/OutputOptions.keepNames)
- [`esbuildOptions.platform`](https://esbuild.github.io/api/#platform) -> [`rolldownOptions.platform`](https://rolldown.rs/reference/InputOptions.platform)
- [`esbuildOptions.plugins`](https://esbuild.github.io/plugins/) -> [`rolldownOptions.plugins`](https://rolldown.rs/reference/InputOptions.plugins) (部分支持)

你可以从 `configResolved` 钩子中获取兼容性层设置的选项：

```js
const plugin = {
  name: 'log-config',
  configResolved(config) {
    console.log('options', config.optimizeDeps.rolldownOptions)
  },
},
```

### 通过 Oxc 进行 JavaScript 转换

Oxc 现在用于 JavaScript 转换，而不是 esbuild。Vite 仍然支持 [`esbuild`](/config/shared-options#esbuild) 选项以保持向后兼容，方法是将其自动转换为 [`oxc`](/config/shared-options#oxc)。`esbuild` 现已弃用，将在未来移除，我们鼓励你迁移到 `oxc`。

以下选项会自动转换：

- `esbuild.jsxInject` -> `oxc.jsxInject`
- `esbuild.include` -> `oxc.include`
- `esbuild.exclude` -> `oxc.exclude`
- [`esbuild.jsx`](https://esbuild.github.io/api/#jsx) -> [`oxc.jsx`](https://oxc.rs/docs/guide/usage/transformer/jsx)
  - `esbuild.jsx: 'preserve'` -> `oxc.jsx: 'preserve'`
  - `esbuild.jsx: 'automatic'` -> `oxc.jsx: { runtime: 'automatic' }`
    - [`esbuild.jsxImportSource`](https://esbuild.github.io/api/#jsx-import-source) -> `oxc.jsx.importSource`
  - `esbuild.jsx: 'transform'` -> `oxc.jsx: { runtime: 'classic' }`
    - [`esbuild.jsxFactory`](https://esbuild.github.io/api/#jsx-factory) -> `oxc.jsx.pragma`
    - [`esbuild.jsxFragment`](https://esbuild.github.io/api/#jsx-fragment) -> `oxc.jsx.pragmaFrag`
  - [`esbuild.jsxDev`](https://esbuild.github.io/api/#jsx-dev) -> `oxc.jsx.development`
  - [`esbuild.jsxSideEffects`](https://esbuild.github.io/api/#jsx-side-effects) -> `oxc.jsx.pure`
- [`esbuild.define`](https://esbuild.github.io/api/#define) -> [`oxc.define`](https://oxc.rs/docs/guide/usage/transformer/global-variable-replacement#define)
- [`esbuild.banner`](https://esbuild.github.io/api/#banner) -> 使用 transform 钩子的自定义插件
- [`esbuild.footer`](https://esbuild.github.io/api/#footer) -> 使用 transform 钩子的自定义插件

[`esbuild.supported`](https://esbuild.github.io/api/#supported) 选项不受 Oxc 支持。如果你需要此选项，请参阅 [oxc-project/oxc#15373](https://github.com/oxc-project/oxc/issues/15373)。

你可以从 `configResolved` 钩子中获取兼容性层设置的选项：

```js
const plugin = {
  name: 'log-config',
  configResolved(config) {
    console.log('options', config.oxc)
  },
},
```

目前，Oxc 转换器不支持降级原生装饰器，因为我们正在等待规范进展，请参阅 ([oxc-project/oxc#9170](https://github.com/oxc-project/oxc/issues/9170))。

:::: details 降级原生装饰器的变通方案

你可以暂时使用 [Babel](https://babeljs.io/) 或 [SWC](https://swc.rs/) 来降级原生装饰器。

**使用 Babel：**

::: code-group

```bash [npm]
$ npm install -D @rolldown/plugin-babel @babel/plugin-proposal-decorators
```

```bash [Yarn]
$ yarn add -D @rolldown/plugin-babel @babel/plugin-proposal-decorators
```

```bash [pnpm]
$ pnpm add -D @rolldown/plugin-babel @babel/plugin-proposal-decorators
```

```bash [Bun]
$ bun add -D @rolldown/plugin-babel @babel/plugin-proposal-decorators
```

```bash [Deno]
$ deno add -D npm:@rolldown/plugin-babel npm:@babel/plugin-proposal-decorators
```

:::

```ts [vite.config.ts]
import { defineConfig } from 'vite'
import babel from '@rolldown/plugin-babel'

function decoratorPreset(options: Record<string, unknown>) {
  return {
    preset: () => ({
      plugins: [['@babel/plugin-proposal-decorators', options]],
    }),
    rolldown: {
      // 仅当文件包含装饰器时才运行此转换。
      filter: {
        code: '@',
      },
    },
  }
}

export default defineConfig({
  plugins: [babel({ presets: [decoratorPreset({ version: '2023-11' })] })],
})
```

**使用 SWC：**

::: code-group

```bash [npm]
$ npm install -D @rollup/plugin-swc @swc/core
```

```bash [Yarn]
$ yarn add -D @rollup/plugin-swc @swc/core
```

```bash [pnpm]
$ pnpm add -D @rollup/plugin-swc @swc/core
```

```bash [Bun]
$ bun add -D @rollup/plugin-swc @swc/core
```

```bash [Deno]
$ deno add -D npm:@rollup/plugin-swc npm:@swc/core
```

:::

```js
import { defineConfig, withFilter } from 'vite'

export default defineConfig({
  // ...
  plugins: [
    withFilter(
      swc({
        swc: {
          jsc: {
            parser: { decorators: true, decoratorsBeforeExport: true },
            transform: { decoratorVersion: '2023-11' },
          },
        },
      }),
      // 仅当文件包含装饰器时才运行此转换。
      { transform: { code: '@' } },
    ),
  ],
})
```

::::

#### esbuild 回退方案

`esbuild` 不再被 Vite 直接使用，现在是可选依赖。如果你使用的插件使用了 `transformWithEsbuild` 函数，你需要将 `esbuild` 安装为 `devDependency`。`transformWithEsbuild` 函数已弃用，将在未来移除。我们建议迁移到新的 `transformWithOxc` 函数。

### 通过 Oxc 进行 JavaScript 压缩

Oxc Minifier 现在用于 JavaScript 压缩，而不是 esbuild。你可以使用已弃用的 [`build.minify: 'esbuild'`](/config/build-options#build-minify) 选项切换回 esbuild。此配置选项将在未来移除，并且你需要将 `esbuild` 安装为 `devDependency`，因为 Vite 不再直接依赖 esbuild。

如果你之前使用 `esbuild.minify*` 选项来控制压缩行为，现在可以使用 `build.rolldownOptions.output.minify`。如果你之前使用 `esbuild.drop` 选项，现在可以使用 [`build.rolldownOptions.output.minify.compress.drop*` 选项](https://oxc.rs/docs/guide/usage/minifier/dead-code-elimination)。

Oxc 不支持属性混淆及其相关选项 ([`mangleProps`, `reserveProps`, `mangleQuoted`, `mangleCache`](https://esbuild.github.io/api/#mangle-props))。如果你需要这些选项，请参阅 [oxc-project/oxc#15375](https://github.com/oxc-project/oxc/issues/15375)。

esbuild 和 Oxc Minifier 对源代码的假设略有不同。如果你怀疑压缩器导致代码损坏，可以在此处比较这些假设：

- [esbuild 压缩假设](https://esbuild.github.io/api/#minify-considerations)
- [Oxc Minifier 假设](https://oxc.rs/docs/guide/usage/minifier.html#assumptions)

请报告你在 JavaScript 应用中发现的任何与压缩相关的问题。

### 通过 Lightning CSS 进行 CSS 压缩

[Lightning CSS](https://lightningcss.dev/) 现在默认用于 CSS 压缩。你可以使用 [`build.cssMinify: 'esbuild'`](/config/build-options#build-cssminify) 选项切换回 esbuild。注意你需要将 `esbuild` 安装为 `devDependency`。

Lightning CSS 支持更好的语法降级，你的 CSS 打包大小可能会略微增加。

### 一致的 CommonJS 互操作

来自 CommonJS (CJS) 模块的 `default` 导入现在以一致的方式处理。

如果满足以下条件之一，`default` 导入是被导入者 CJS 模块的 `module.exports` 值。否则，`default` 导入是被导入者 CJS 模块的 `module.exports.default` 值：

- 导入者是 `.mjs` 或 `.mts`。
- 导入者最近的 `package.json` 的 `type` 字段设置为 `module`。
- 被导入者 CJS 模块的 `module.exports.__esModule` 值未设置为 true。

::: details 之前的行为

在开发环境中，如果满足以下条件之一，`default` 导入是被导入者 CJS 模块的 `module.exports` 值。否则，`default` 导入是被导入者 CJS 模块的 `module.exports.default` 值：

- _导入者包含在依赖优化中_ 且为 `.mjs` 或 `.mts`。
- _导入者包含在依赖优化中_ 且导入者最近的 `package.json` 的 `type` 字段设置为 `module`。
- 被导入者 CJS 模块的 `module.exports.__esModule` 值未设置为 true。

在生产构建中，条件是：

- 被导入者 CJS 模块的 `module.exports.__esModule` 值未设置为 true。
- _`module.exports` 的 `default` 属性不存在_。

（假设 [`build.commonjsOptions.defaultIsModuleExports`](https://github.com/rollup/plugins/tree/master/packages/commonjs#defaultismoduleexports) 未从默认值 `'auto'` 更改）

:::

有关此问题的更多详细信息，请参阅 Rolldown 的文档：[来自 CJS 模块的模糊 `default` 导入 - 打包 CJS | Rolldown](https://rolldown.rs/in-depth/bundling-cjs#ambiguous-default-import-from-cjs-modules)。

此变更可能会破坏一些现有的导入 CJS 模块的代码。你可以使用已弃用的 `legacy.inconsistentCjsInterop: true` 选项暂时恢复之前的行为。如果你发现受此变更影响的包，请向包作者报告或向他们发送拉取请求。确保链接到上面的 Rolldown 文档，以便作者了解上下文。

### 移除了使用格式嗅探的模块解析

当 `package.json` 中同时存在 `browser` 和 `module` 字段时，Vite 过去会根据文件内容解析字段，并且会为浏览器选择 ESM 文件。引入这是因为有些包使用 `module` 字段指向 Node.js 的 ESM 文件，而有些其他包使用 `browser` 字段指向浏览器的 UMD 文件。鉴于现代 `exports` 字段解决了这个问题并且现在被许多包采用，Vite 不再使用这种启发式方法，而是始终尊重 [`resolve.mainFields`](/config/shared-options#resolve-mainfields) 选项的顺序。如果你依赖此行为，可以使用 [`resolve.alias`](/config/shared-options#resolve-alias) 选项将字段映射到所需的文件，或使用包管理器应用补丁（例如 `patch-package`、`pnpm patch`）。

### 外部化模块的 Require 调用

外部化模块的 `require` 调用现在保留为 `require` 调用，而不转换为 `import` 语句。这是为了保留 `require` 调用的语义。如果你想将它们转换为 `import` 语句，可以使用 [Rolldown 内置的 `esmExternalRequirePlugin`](https://rolldown.rs/builtin-plugins/esm-external-require)，它从 `vite` 重新导出。

```js
import { defineConfig, esmExternalRequirePlugin } from 'vite'

export default defineConfig({
  // ...
  plugins: [
    esmExternalRequirePlugin({
      external: ['react', 'vue', /^node:/],
    }),
  ],
})
```

有关更多详细信息，请参阅 Rolldown 的文档：[`require` 外部模块 - 打包 CJS | Rolldown](https://rolldown.rs/in-depth/bundling-cjs#require-external-modules)。

### UMD / IIFE 中的 `import.meta.url`

`import.meta.url` 不再在 UMD / IIFE 输出格式中进行 polyfill。默认情况下它将替换为 `undefined`。如果你更喜欢之前的行为，可以使用 [`define`](/config/shared-options#define) 选项配合 [`build.rolldownOptions.output.intro`](https://rolldown.rs/reference/OutputOptions.intro) 选项。有关更多详细信息，请参阅 Rolldown 的文档：[众所周知的 `import.meta` 属性 - 非 ESM 输出格式 | Rolldown](https://rolldown.rs/in-depth/non-esm-output-formats#well-known-import-meta-properties)。

### 移除了 `build.rollupOptions.watch.chokidar` 选项

`build.rollupOptions.watch.chokidar` 选项已被移除。请迁移到 [`build.rolldownOptions.watch.watcher`](https://rolldown.rs/reference/InputOptions.watch#watcher) 选项。

### 移除了对象形式的 `build.rollupOptions.output.manualChunks` 并弃用函数形式

对象形式的 `output.manualChunks` 选项不再支持。函数形式的 `output.manualChunks` 已弃用。Rolldown 拥有更灵活的 [`codeSplitting`](https://rolldown.rs/reference/OutputOptions.codeSplitting) 选项。有关 `codeSplitting` 的更多详细信息，请参阅 Rolldown 的文档：[手动代码分割 - Rolldown](https://rolldown.rs/in-depth/manual-code-splitting)。

### `build()` 抛出 `BundleError`

_此变更仅影响 JS API 用户。_

`build()` 现在抛出 [`BundleError`](https://rolldown.rs/reference/TypeAlias.BundleError) 而不是插件中抛出的原始错误。`BundleError` 的类型为 `Error & { errors?: RolldownError[] }`，它将单个错误包装在 `errors` 数组中。如果你需要单个错误，需要访问 `.errors`：

```js
try {
  await build()
} catch (e) {
  if (e.errors) {
    for (const error of e.errors) {
      console.log(error.code) // 错误代码
    }
  }
}
```

### 模块类型支持和自动检测

_此变更仅影响插件作者。_

Rolldown 实验性支持 [模块类型](https://rolldown.rs/guide/notable-features#module-types)，类似于 [esbuild 的 `loader` 选项](https://esbuild.github.io/api/#loader)。因此，Rolldown 会根据解析后的 id 的扩展名自动设置模块类型。如果你在 `load` 或 `transform` 钩子中将其他模块类型的内容转换为 JavaScript，可能需要在返回值中添加 `moduleType: 'js'`：

```js
const plugin = {
  name: 'txt-loader',
  load(id) {
    if (id.endsWith('.txt')) {
      const content = fs.readFile(id, 'utf-8')
      return {
        code: `export default ${JSON.stringify(content)}`,
        moduleType: 'js', // [!code ++]
      }
    }
  },
}
```

### 其他相关的弃用项

以下选项已弃用，将在未来移除：

- `build.rollupOptions`：重命名为 `build.rolldownOptions`
- `worker.rollupOptions`：重命名为 `worker.rolldownOptions`
- `build.commonjsOptions`：现在是无操作
- `build.dynamicImportVarsOptions.warnOnError`：现在是无操作
- `resolve.alias[].customResolver`：改用带有 `resolveId` 钩子和 `enforce: 'pre'` 的自定义插件

## 已移除的废弃功能 [<Badge text="NRV" type="warning" />](#migration-from-v7)

- 不再支持将 URL 传递给 `import.meta.hot.accept`。请改为传递一个 id。 ([#21382](https://github.com/vitejs/vite/pull/21382))

## 高级

这些破坏性变更预计只会影响少数用例：

- [Extglobs](https://github.com/micromatch/picomatch/blob/master/README.md#extglobs) 尚不支持 ([rolldown-vite#365](https://github.com/vitejs/rolldown-vite/issues/365))
- TypeScript legacy namespace 仅部分支持。请参阅 [Oxc Transformer 的相关文档](https://oxc.rs/docs/guide/usage/transformer/typescript.html#partial-namespace-support) 以获取更多详情。
- `define` 不为对象共享引用：当你将一个对象作为值传递给 `define` 时，每个变量都将拥有该对象的一个独立副本。请参阅 [Oxc Transformer 的相关文档](https://oxc.rs/docs/guide/usage/transformer/global-variable-replacement#define) 以获取更多详情。
- `bundle` 对象变更（`bundle` 是在 `generateBundle` / `writeBundle` 钩子中传递的对象，由 `build` 函数返回）：
  - 不支持赋值给 `bundle[foo]`。Rollup 也不鼓励这样做。请改用 `this.emitFile()`。
  - 引用在各钩子之间不共享 ([rolldown-vite#410](https://github.com/vitejs/rolldown-vite/issues/410))
  - `structuredClone(bundle)` 会报错 `DataCloneError: #<Object> could not be cloned`。不再支持此操作。请使用 `structuredClone({ ...bundle })` 进行克隆。 ([rolldown-vite#128](https://github.com/vitejs/rolldown-vite/issues/128))
- Rollup 中的所有并行钩子现在作为顺序钩子工作。请参阅 [Rolldown 的文档](https://rolldown.rs/apis/plugin-api#sequential-hook-execution) 以获取更多详情。
- `"use strict";` 有时不会被注入。请参阅 [Rolldown 的文档](https://rolldown.rs/in-depth/directives) 以获取更多详情。
- 不支持使用 plugin-legacy 转换到 ES5 及以下版本 ([rolldown-vite#452](https://github.com/vitejs/rolldown-vite/issues/452))
- 将同一浏览器的多个版本传递给 `build.target` 选项现在会报错：esbuild 会选择该浏览器的最新版本，这可能不是你的本意。
- Rolldown 缺少支持：以下功能不受 Rolldown 支持，Vite 也不再支持。
  - `build.rollupOptions.output.format: 'system'` ([rolldown#2387](https://github.com/rolldown/rolldown/issues/2387))
  - `build.rollupOptions.output.format: 'amd'` ([rolldown#2387](https://github.com/rolldown/rolldown/issues/2528))
  - `shouldTransformCachedModule` 钩子 ([rolldown#4389](https://github.com/rolldown/rolldown/issues/4389))
  - `resolveImportMeta` 钩子 ([rolldown#1010](https://github.com/rolldown/rolldown/issues/1010))
  - `renderDynamicImport` 钩子 ([rolldown#4532](https://github.com/rolldown/rolldown/issues/4532))
  - `resolveFileUrl` 钩子
- `parseAst` / `parseAstAsync` 函数现已废弃，推荐使用功能更多的 `parseSync` / `parse` 函数。

## 从 v6 迁移

请先查看 Vite v7 文档中的 [从 v6 迁移指南](https://v7.vite.dev/guide/migration)，了解将应用移植到 Vite 7 所需的更改，然后再继续本页面上的更改。
