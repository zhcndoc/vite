# 共享选项

除非另有说明，本节中的选项适用于所有开发、构建和预览模式。

## root

- **类型：** `string`
- **默认值：** `process.cwd()`

项目根目录（即 `index.html` 所在的位置）。可以是绝对路径，也可以是相对于当前工作目录的路径。

请参阅 [项目根目录](/guide/#index-html-and-project-root) 了解更多详情。

## base

- **类型：** `string`
- **默认值：** `/`
- **相关：** [`server.origin`](/config/server-options.md#server-origin)

开发或生产环境服务的公共基础路径。有效值包括：

- 绝对 URL 路径名，例如 `/foo/`
- 完整 URL，例如 `https://bar.com/foo/`（开发环境中不会使用源部分，因此值与 `/foo/` 相同）
- 空字符串或 `./`（用于嵌入式部署）

请参阅 [公共基础路径](/guide/build#public-base-path) 了解更多详情。

## mode

- **类型：** `string`
- **默认值：** serve 时为 `'development'`，build 时为 `'production'`

在配置中指定此项将覆盖 **serve 和 build** 的默认模式。此值也可以通过命令行 `--mode` 选项覆盖。

请参阅 [环境变量和模式](/guide/env-and-mode) 了解更多详情。

## define

- **类型：** `Record<string, any>`

定义全局常量替换。条目将在开发期间定义为全局变量，并在构建期间静态替换。

Vite 使用 [Oxc 的 define 功能](https://oxc.rs/docs/guide/usage/transformer/global-variable-replacement#define) 来执行替换，因此值表达式必须是包含 JSON 可序列化值（null、boolean、number、string、array 或 object）的字符串，或者是单个标识符。对于非字符串值，Vite 将自动使用 `JSON.stringify` 将其转换为字符串。

**示例：**

```js
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('v1.0.0'),
    __API_URL__: 'window.__backend_api_url',
  },
})
```

::: tip 注意
对于 TypeScript 用户，请确保在 `vite-env.d.ts` 文件中添加类型声明以获得类型检查和智能感知。

示例：

```ts
// vite-env.d.ts
declare const __APP_VERSION__: string
```

:::

## plugins

- **类型：** `(Plugin | Plugin[] | Promise<Plugin | Plugin[]>)[]`

要使用的插件数组。假值插件将被忽略，插件数组将被扁平化。如果返回的是 promise，它将在运行前被解析。有关 Vite 插件的更多详细信息，请参阅 [插件 API](/guide/api-plugin)。

## publicDir

- **类型：** `string | false`
- **默认值：** `"public"`

用作纯静态资源的目录。此目录中的文件在开发期间服务于 `/`，并在构建期间复制到 `outDir` 的根目录，并且总是原样服务或复制而不进行转换。该值可以是绝对文件系统路径或相对于项目根目录的路径。

将 `publicDir` 定义为 `false` 可禁用此功能。

请参阅 [`public` 目录](/guide/assets#the-public-directory) 了解更多详情。

## cacheDir

- **类型：** `string`
- **默认值：** `"node_modules/.vite"`

保存缓存文件的目录。此目录中的文件是预捆绑的依赖项或由 vite 生成的其他缓存文件，可以提高性能。你可以使用 `--force` 标志或手动删除该目录来重新生成缓存文件。该值可以是绝对文件系统路径或相对于项目根目录的路径。当未检测到 `package.json` 时，默认为 `.vite`。

## resolve.alias

- **类型：**
  `Record<string, string> | Array<{ find: string | RegExp, replacement: string }>`

定义用于替换 `import` 或 `require` 语句中值的别名。这类似于 [`@rollup/plugin-alias`](https://github.com/rollup/plugins/tree/master/packages/alias) 的工作原理。

条目的顺序很重要，首先定义的规则会首先应用。

当别名指向文件系统路径时，始终使用绝对路径。相对别名值将原样使用，不会解析为文件系统路径。

更高级的自定义解析可以通过 [插件](/guide/api-plugin) 实现。

::: warning 与 SSR 一起使用
如果你为 [SSR 外部化的依赖项](/guide/ssr.md#ssr-externals) 配置了别名，你可能想要别名实际的 `node_modules` 包。[Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) 和 [pnpm](https://pnpm.io/aliases/) 都支持通过 `npm:` 前缀进行别名。
:::

### 对象格式 (`Record<string, string>`)

对象格式允许将别名指定为键，将相应的值指定为实际的导入值。例如：

```js
resolve: {
  alias: {
    utils: '../../../utils',
    'batman-1.0.0': './joker-1.5.0'
  }
}
```

### 数组格式 (`Array<{ find: string | RegExp, replacement: string }>`)

数组格式允许将别名指定为对象，这对于复杂的键/值对很有用。

```js
resolve: {
  alias: [
    { find: 'utils', replacement: '../../../utils' },
    { find: 'batman-1.0.0', replacement: './joker-1.5.0' },
  ]
}
```

当 `find` 是正则表达式时，`replacement` 可以使用 [替换模式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_the_replacement)，例如 `$1`。例如，要用另一个扩展名移除扩展名，可以使用如下模式：

```js
{ find:/^(.*)\.js$/, replacement: '$1.alias' }
```

## resolve.dedupe

- **类型：** `string[]`

如果你的应用程序中有相同依赖项的重复副本（可能是由于提升或 monorepo 中的链接包），使用此选项强制 Vite 始终将列出的依赖项解析为同一个副本（从项目根目录）。

:::warning SSR + ESM
对于 SSR 构建，从 `build.rollupOptions.output` 配置的 ESM 构建输出不进行去重。一种解决方法是使用 CJS 构建输出，直到 ESM 具有更好的模块加载插件支持。
:::

## resolve.conditions <NonInheritBadge />

- **类型：** `string[]`
- **默认值：** `['module', 'browser', 'development|production']` (`defaultClientConditions`)

解析包的 [条件导出](https://nodejs.org/api/packages.html#packages_conditional_exports) 时允许的其他条件。

具有条件导出的包在其 `package.json` 中可能具有以下 `exports` 字段：

```json
{
  "exports": {
    ".": {
      "import": "./index.mjs",
      "require": "./index.js"
    }
  }
}
```

这里，`import` 和 `require` 是“条件”。条件可以嵌套，并且应从最具体到最不具体指定。

`development|production` 是一个特殊值，根据 `process.env.NODE_ENV` 的值替换为 `production` 或 `development`。当 `process.env.NODE_ENV === 'production'` 时替换为 `production`，否则替换为 `development`。

注意，如果满足要求，`import`、`require`、`default` 条件始终适用。

此外，在解析样式导入时应用 `style` 条件，例如 `@import 'my-library'`。对于某些 CSS 预处理器，也会应用它们对应的条件，即 Sass 的 `sass` 和 Less 的 `less`。

## resolve.mainFields <NonInheritBadge />

- **类型：** `string[]`
- **默认值：** `['browser', 'module', 'jsnext:main', 'jsnext']` (`defaultClientMainFields`)

解析包的入口点时要尝试的 `package.json` 中的字段列表。注意，这比从 `exports` 字段解析的条件导出优先级低：如果从 `exports` 成功解析了入口点，则将忽略主字段。

## resolve.extensions

- **类型：** `string[]`
- **默认值：** `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']`

尝试导入省略扩展名时的文件扩展名列表。注意，**不**建议为自定义导入类型（例如 `.vue`）省略扩展名，因为它会干扰 IDE 和类型支持。

## resolve.preserveSymlinks

- **类型：** `boolean`
- **默认值：** `false`

启用此设置会导致 vite 通过原始文件路径（即不跟随符号链接的路径）而不是真实文件路径（即跟随符号链接后的路径）来确定文件身份。

- **相关：** [esbuild#preserve-symlinks](https://esbuild.github.io/api/#preserve-symlinks), [webpack#resolve.symlinks
  ](https://webpack.js.org/configuration/resolve/#resolvesymlinks)

## resolve.tsconfigPaths

- **类型：** `boolean`
- **默认值：** `false`

启用 tsconfig 路径解析功能。`tsconfig.json` 中的 `paths` 选项将用于解析导入。有关更多详细信息，请参阅 [功能](/guide/features.md#paths)。

## html.cspNonce

- **类型：** `string`
- **相关：** [内容安全策略 (CSP)](/guide/features#content-security-policy-csp)

生成脚本/样式标签时将使用的 nonce 值占位符。设置此值还将生成一个带有 nonce 值的 meta 标签。

## css.modules

- **类型：**
  ```ts
  interface CSSModulesOptions {
    getJSON?: (
      cssFileName: string,
      json: Record<string, string>,
      outputFileName: string,
    ) => void
    scopeBehaviour?: 'global' | 'local'
    globalModulePaths?: RegExp[]
    exportGlobals?: boolean
    generateScopedName?:
      | string
      | ((name: string, filename: string, css: string) => string)
    hashPrefix?: string
    /**
     * 默认值：undefined
     */
    localsConvention?:
      | 'camelCase'
      | 'camelCaseOnly'
      | 'dashes'
      | 'dashesOnly'
      | ((
          originalClassName: string,
          generatedClassName: string,
          inputFile: string,
        ) => string)
  }
  ```

配置 CSS 模块行为。选项传递给 [postcss-modules](https://github.com/css-modules/postcss-modules)。

使用 [Lightning CSS](../guide/features.md#lightning-css) 时，此选项没有任何效果。如果启用，应改用 [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules.html)。

## css.postcss

- **类型：** `string | (postcss.ProcessOptions & { plugins?: postcss.AcceptedPlugin[] })`

内联 PostCSS 配置或用于搜索 PostCSS 配置的自定义目录（默认为项目根目录）。

对于内联 PostCSS 配置，它期望与 `postcss.config.js` 相同的格式。但对于 `plugins` 属性，只能使用 [数组格式](https://github.com/postcss/postcss-load-config/blob/main/README.md#array)。

搜索是使用 [postcss-load-config](https://github.com/postcss/postcss-load-config) 完成的，并且只加载支持的配置文件名。默认情况下不搜索工作区根目录（如果未找到工作区，则为 [项目根目录](/guide/#index-html-and-project-root)）之外的配置文件。如果需要，你可以指定根目录之外的自定义路径来加载特定的配置文件。

注意，如果提供了内联配置，Vite 将不会搜索其他 PostCSS 配置源。

## css.preprocessorOptions

- **类型：** `Record<string, object>`

指定传递给 CSS 预处理器的选项。文件扩展名用作选项的键。每个预处理器的支持选项可以在其各自的文档中找到：

- `sass`/`scss`:
  - 如果安装了 `sass-embedded` 则使用它，否则使用 `sass`。为了最佳性能，建议安装 `sass-embedded` 包。
  - [选项](https://sass-lang.com/documentation/js-api/interfaces/stringoptions/)
- `less`: [选项](https://lesscss.org/usage/#less-options)。
- `styl`/`stylus`: 仅支持 [`define`](https://stylus-lang.com/docs/js.html#define-name-node)，它可以作为对象传递。

**示例：**

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        math: 'parens-division',
      },
      styl: {
        define: {
          $specialColor: new stylus.nodes.RGBA(51, 197, 255, 1),
        },
      },
      scss: {
        importers: [
          // ...
        ],
      },
    },
  },
})
```

### css.preprocessorOptions[extension].additionalData

- **类型：** `string | ((source: string, filename: string) => (string | { content: string; map?: SourceMap }))`

此选项可用于为每个样式内容注入额外代码。请注意，如果包含实际样式而不仅仅是变量，这些样式将在最终打包结果中重复。

**示例：**

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`,
      },
    },
  },
})
```

::: tip 导入文件
由于相同的代码被添加到不同目录的文件前面，相对路径将无法正确解析。请使用绝对路径或 [别名](#resolve-alias)。
:::

## css.preprocessorMaxWorkers

- **类型：** `number | true`
- **默认值：** `true`

指定 CSS 预处理器可以使用的最大线程数。`true` 表示最多为 CPU 数量减 1。当设置为 `0` 时，Vite 不会创建任何 worker，并在主线程中运行预处理器。

根据预处理器选项，即使此选项未设置为 `0`，Vite 也可能在主线程上运行预处理器。

## css.devSourcemap

- **实验性：** [提供反馈](https://github.com/vitejs/vite/discussions/13845)
- **类型：** `boolean`
- **默认值：** `false`

是否在开发期间启用 sourcemap。

## css.transformer

- **实验性：** [提供反馈](https://github.com/vitejs/vite/discussions/13835)
- **类型：** `'postcss' | 'lightningcss'`
- **默认值：** `'postcss'`

选择用于 CSS 处理的引擎。查看 [Lightning CSS](../guide/features.md#lightning-css) 获取更多信息。

::: info 重复的 `@import`
请注意，postcss (postcss-import) 对于重复 `@import` 的行为与浏览器不同。参见 [postcss/postcss-import#462](https://github.com/postcss/postcss-import/issues/462)。
:::

## css.lightningcss

- **实验性：** [提供反馈](https://github.com/vitejs/vite/discussions/13835)
- **类型：**

```js
import type {
  CSSModulesConfig,
  Drafts,
  Features,
  NonStandard,
  PseudoClasses,
  Targets,
} from 'lightningcss'
```

```js
{
  targets?: Targets
  include?: Features
  exclude?: Features
  drafts?: Drafts
  nonStandard?: NonStandard
  pseudoClasses?: PseudoClasses
  unusedSymbols?: string[]
  cssModules?: CSSModulesConfig,
  // ...
}
```

配置 Lightning CSS。完整的转换选项可以在 [Lightning CSS 仓库](https://github.com/parcel-bundler/lightningcss/blob/master/node/index.d.ts) 中找到。

## json.namedExports

- **类型：** `boolean`
- **默认值：** `true`

是否支持从 `.json` 文件进行命名导入。

## json.stringify

- **类型：** `boolean | 'auto'`
- **默认值：** `'auto'`

如果设置为 `true`，导入的 JSON 将被转换为 `export default JSON.parse("...")`，这比对象字面量性能显著更高，尤其是当 JSON 文件很大时。

如果设置为 `'auto'`，仅当 [数据大于 10kB](https://v8.dev/blog/cost-of-javascript-2019#json:~:text=A%20good%20rule%20of%20thumb%20is%20to%20apply%20this%20technique%20for%20objects%20of%2010%20kB%20or%20larger) 时才会将数据字符串化。

## oxc

- **类型：** `OxcOptions | false`

`OxcOptions` 扩展自 [Oxc Transformer 的选项](https://oxc.rs/docs/guide/usage/transformer)。最常见的用例是自定义 JSX：

```js
export default defineConfig({
  oxc: {
    jsx: {
      runtime: 'classic',
      pragma: 'h',
      pragmaFrag: 'Fragment',
    },
  },
})
```

默认情况下，Oxc 转换应用于 `ts`、`jsx` 和 `tsx` 文件。你可以使用 `oxc.include` 和 `oxc.exclude` 自定义此项，它们可以是正则表达式、[picomatch](https://github.com/micromatch/picomatch#globbing-features) 模式，或两者的数组。

此外，你还可以使用 `oxc.jsxInject` 为每个被 Oxc 转换的文件自动注入 JSX 辅助导入：

```js
export default defineConfig({
  oxc: {
    jsxInject: `import React from 'react'`,
  },
})
```

设置为 `false` 以禁用 Oxc 转换。

## esbuild

- **类型：** `ESBuildOptions | false`
- **已弃用**

此选项在内部转换为 `oxc` 选项。请改用 `oxc` 选项。

## assetsInclude

- **类型：** `string | RegExp | (string | RegExp)[]`
- **相关：** [静态资源处理](/guide/assets)

指定额外的 [picomatch 模式](https://github.com/micromatch/picomatch#globbing-features) 被视为静态资源，以便：

- 当从 HTML 引用或通过 `fetch` 或 XHR 直接请求时，它们将被排除在插件转换管道之外。

- 从 JS 导入它们将返回其解析后的 URL 字符串（如果你有一个 `enforce: 'pre'` 插件以不同方式处理资源类型，则可以覆盖此行为）。

内置资源类型列表可以在 [这里](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts) 找到。

**示例：**

```js
export default defineConfig({
  assetsInclude: ['**/*.gltf'],
})
```

## logLevel

- **类型：** `'info' | 'warn' | 'error' | 'silent'`

调整控制台输出的详细程度。默认值为 `'info'`。

## customLogger

- **类型：**
  ```ts
  interface Logger {
    info(msg: string, options?: LogOptions): void
    warn(msg: string, options?: LogOptions): void
    warnOnce(msg: string, options?: LogOptions): void
    error(msg: string, options?: LogErrorOptions): void
    clearScreen(type: LogType): void
    hasErrorLogged(error: Error | RollupError): boolean
    hasWarned: boolean
  }
  ```

使用自定义记录器来记录消息。你可以使用 Vite 的 `createLogger` API 获取默认记录器并自定义它，例如，更改消息或过滤掉某些警告。

```ts twoslash
import { createLogger, defineConfig } from 'vite'

const logger = createLogger()
const loggerWarn = logger.warn

logger.warn = (msg, options) => {
  // 忽略空 CSS 文件警告
  if (msg.includes('vite:css') && msg.includes(' is empty')) return
  loggerWarn(msg, options)
}

export default defineConfig({
  customLogger: logger,
})
```

## clearScreen

- **类型：** `boolean`
- **默认值：** `true`

设置为 `false` 以防止 Vite 在记录某些消息时清除终端屏幕。通过命令行，使用 `--clearScreen false`。

## envDir

- **类型：** `string | false`
- **默认值：** `root`

加载 `.env` 文件的目录。可以是绝对路径，也可以是相对于项目根目录的路径。`false` 将禁用 `.env` 文件加载。

有关环境文件的更多信息，请参阅 [这里](/guide/env-and-mode#env-files)。

## envPrefix

- **类型：** `string | string[]`
- **默认值：** `VITE_`

以 `envPrefix` 开头的环境变量将通过 `import.meta.env` 暴露给你的客户端源代码。

:::warning 安全说明
`envPrefix` 不应设置为 `''`，这将暴露所有环境变量并导致敏感信息意外泄露。当检测到 `''` 时 Vite 将抛出错误。

如果你想暴露一个无前缀的变量，你可以使用 [define](#define) 来暴露它：

```js
define: {
  'import.meta.env.ENV_VARIABLE': JSON.stringify(process.env.ENV_VARIABLE)
}
```

:::

## appType

- **类型：** `'spa' | 'mpa' | 'custom'`
- **默认值：** `'spa'`

你的应用程序是单页应用程序 (SPA)、[多页应用程序 (MPA)](../guide/build#multi-page-app) 还是自定义应用程序 (SSR 和具有自定义 HTML 处理的框架)：

- `'spa'`: 包含 HTML 中间件并使用 SPA 回退。在 preview 中使用 `single: true` 配置 [sirv](https://github.com/lukeed/sirv)
- `'mpa'`: 包含 HTML 中间件
- `'custom'`: 不包含 HTML 中间件

在 Vite 的 [SSR 指南](/guide/ssr#vite-cli) 中了解更多。相关：[`server.middlewareMode`](./server-options#server-middlewaremode)。

## devtools

- **实验性：** [提供反馈](https://github.com/vitejs/devtools/discussions)
- **类型：** `boolean` | `DevToolsConfig`
- **默认值：** `false`

启用 devtools 集成以可视化内部状态和构建分析。
确保 `@vitejs/devtools` 已作为依赖安装。此功能目前仅在构建模式下支持。

详见 [Vite DevTools](https://github.com/vitejs/devtools)。

## future

- **类型：** `Record<string, 'warn' | undefined>`
- **相关：** [破坏性变更](/changes/)

启用未来的破坏性变更，以便为平滑迁移到 Vite 的下一个主要版本做好准备。随着新功能的开发，列表可能会随时更新、添加或移除。

请参阅 [破坏性变更](/changes/) 页面以了解可能选项的详细信息。
