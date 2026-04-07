# 构建选项

除非另有说明，本节中的选项仅应用于构建。

## build.target

- **类型：** `string | string[]`
- **默认值：** `'baseline-widely-available'`
- **相关：** [浏览器兼容性](/guide/build#browser-compatibility)

最终 bundle 的浏览器兼容性目标。默认值是一个 Vite 特殊值，`'baseline-widely-available'`，它针对的是包含在 2026-01-01 的 [Baseline](https://web-platform-dx.github.io/web-features/) 广泛可用版本中的浏览器。具体来说，它是 `['chrome111', 'edge111', 'firefox114', 'safari16.4']`。

另一个特殊值是 `'esnext'` —— 它假设支持原生动态导入，并且只会执行最小化的转译。

转换是通过 Oxc Transformer 执行的，该值应该是一个有效的 [Oxc Transformer target 选项](https://oxc.rs/docs/guide/usage/transformer/lowering#target)。自定义目标可以是 ES 版本（例如 `es2015`）、带版本的浏览器（例如 `chrome58`），或多个目标字符串的数组。

注意，如果代码包含无法被 Oxc 安全转译的功能，构建将输出警告。查看更多详情请参阅 [Oxc 文档](https://oxc.rs/docs/guide/usage/transformer/lowering#warnings)。

## build.modulePreload

- **类型：** `boolean | { polyfill?: boolean, resolveDependencies?: ResolveModulePreloadDependenciesFn }`
- **默认值：** `{ polyfill: true }`

默认情况下，会自动注入一个 [module preload polyfill](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill)。该 polyfill 会自动注入到每个 `index.html` 入口的代理模块中。如果构建配置为通过 `build.rollupOptions.input` 使用非 HTML 自定义入口，则有必要在你的自定义入口中手动导入 polyfill：

```js
import 'vite/modulepreload-polyfill'
```

注意：该 polyfill **不**适用于 [库模式](/guide/build#library-mode)。如果你需要支持没有原生动态导入的浏览器，你应该避免在库中使用它。

可以使用 `{ polyfill: false }` 禁用 polyfill。

每个动态导入要预加载的 chunk 列表由 Vite 计算。默认情况下，加载这些依赖时将使用包含 `base` 的绝对路径。如果 `base` 是相对的（`''` 或 `'./'`），则在运行时使用 `import.meta.url` 以避免依赖于最终部署 base 的绝对路径。

使用 `resolveDependencies` 函数可以对依赖列表及其路径进行细粒度控制的实验性支持。[提供反馈](https://github.com/vitejs/vite/discussions/13841)。它需要一个类型为 `ResolveModulePreloadDependenciesFn` 的函数：

```ts
type ResolveModulePreloadDependenciesFn = (
  url: string,
  deps: string[],
  context: {
    hostId: string
    hostType: 'html' | 'js'
  },
) => string[]
```

`resolveDependencies` 函数将为每个动态导入调用，并传入它所依赖的 chunk 列表，它也会为入口 HTML 文件中导入的每个 chunk 调用。可以返回一个新的依赖数组，其中过滤了这些依赖或注入了更多依赖，并修改了它们的路径。`deps` 路径是相对于 `build.outDir` 的。返回值应该是相对于 `build.outDir` 的相对路径。

```js twoslash
/** @type {import('vite').UserConfig} */
const config = {
  // prettier-ignore
  build: {
// ---cut-before---
modulePreload: {
  resolveDependencies: (filename, deps, { hostId, hostType }) => {
    return deps.filter(condition)
  },
},
// ---cut-after---
  },
}
```

解析后的依赖路径可以使用 [`experimental.renderBuiltUrl`](../guide/build.md#advanced-base-options) 进一步修改。

## build.polyfillModulePreload

- **类型：** `boolean`
- **默认值：** `true`
- **已弃用** 请改用 `build.modulePreload.polyfill`

是否自动注入 [module preload polyfill](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill)。

## build.outDir

- **类型：** `string`
- **默认值：** `dist`

指定输出目录（相对于 [项目根目录](/guide/#index-html-and-project-root)）。

## build.assetsDir

- **类型：** `string`
- **默认值：** `assets`

指定嵌套生成资产的目录（相对于 `build.outDir`。这在 [库模式](/guide/build#library-mode) 中不使用）。

## build.assetsInlineLimit

- **类型：** `number` | `((filePath: string, content: Buffer) => boolean | undefined)`
- **默认值：** `4096` (4 KiB)

小于此阈值的导入或引用资产将内联为 base64 URL，以避免额外的 http 请求。设置为 `0` 可完全禁用内联。

如果传入回调，可以返回布尔值以选择加入或退出。如果没有返回内容，则应用默认逻辑。

Git LFS 占位符会自动排除在内联之外，因为它们不包含所代表文件的内容。

::: tip 注意
如果你指定了 `build.lib`，`build.assetsInlineLimit` 将被忽略，并且资产将始终被内联，无论文件大小或是否为 Git LFS 占位符。
:::

## build.cssCodeSplit

- **类型：** `boolean`
- **默认值：** `true`

启用/禁用 CSS 代码分割。启用时，异步 JS chunk 中导入的 CSS 将保留为 chunk，并在获取该 chunk 时一起获取。

如果禁用，整个项目中的所有 CSS 将被提取到单个 CSS 文件中。

::: tip 注意
如果你指定了 `build.lib`，`build.cssCodeSplit` 默认为 `false`。
:::

## build.cssTarget

- **类型：** `string | string[]`
- **默认值：** 与 [`build.target`](#build-target) 相同

此选项允许用户为 CSS 压缩设置与 JavaScript 转译所使用的不同的浏览器目标。

仅当你针对非主流浏览器时才应使用它。
一个例子是 Android 微信 WebView，它支持大多数现代 JavaScript 功能，但不支持 [CSS 中的 `#RGBA` 十六进制颜色表示法](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb_colors)。
在这种情况下，你需要将 `build.cssTarget` 设置为 `chrome61`，以防止 vite 将 `rgba()` 颜色转换为 `#RGBA` 十六进制表示法。

## build.cssMinify

- **类型：** `boolean | 'lightningcss' | 'esbuild'`
- **默认值：** `'lightningcss'`，但如果客户端构建禁用了 [`build.minify`](#build-minify) 则为 `false`

此选项允许用户专门覆盖 CSS 压缩，而不是默认使用 `build.minify`，因此你可以分别为 JS 和 CSS 配置压缩。Vite 默认使用 [Lightning CSS](https://lightningcss.dev/minification.html) 来压缩 CSS。它可以使用 [`css.lightningcss`](./shared-options.md#css-lightningcss) 配置。将选项设置为 `'esbuild'` 以改用 esbuild。

当设置为 `'esbuild'` 时必须安装 esbuild。

```sh
npm add -D esbuild
```

## build.sourcemap

- **类型：** `boolean | 'inline' | 'hidden'`
- **默认值：** `false`

生成生产环境的 source map。如果为 `true`，将创建单独的 sourcemap 文件。如果为 `'inline'`，sourcemap 将作为 data URI 附加到结果输出文件中。`'hidden'` 的工作方式类似于 `true`，只是打包文件中的相应 sourcemap 注释被抑制。

## build.rolldownOptions

- **类型：** [`RolldownOptions`](https://rolldown.rs/reference/)

直接自定义底层的 Rolldown bundle。这与可以从 Rolldown 配置文件导出的选项相同，并将与 Vite 内部的 Rolldown 选项合并。查看更多详情请参阅 [Rolldown 选项文档](https://rolldown.rs/reference/)。

## build.rollupOptions

- **类型：** `RolldownOptions`
- **已弃用**

此选项是 `build.rolldownOptions` 选项的别名。请改用 `build.rolldownOptions` 选项。

## build.dynamicImportVarsOptions

- **类型：** `{ include?: string | RegExp | (string | RegExp)[], exclude?: string | RegExp | (string | RegExp)[] }`
- **相关：** [动态导入](/guide/features#dynamic-import)

是否转换带变量的动态导入。

## build.lib

- **类型：** `{ entry: string | string[] | { [entryAlias: string]: string }, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string | ((format: ModuleFormat, entryName: string) => string), cssFileName?: string }`
- **相关：** [库模式](/guide/build#library-mode)

作为库构建。由于库不能使用 HTML 作为入口，因此 `entry` 是必需的。`name` 是暴露的全局变量，当 `formats` 包含 `'umd'` 或 `'iife'` 时是必需的。默认 `formats` 是 `['es', 'umd']`，如果使用了多个入口，则为 `['es', 'cjs']`。

`fileName` 是包文件输出的名称，默认为 `package.json` 中的 `"name"`。它也可以定义为接受 `format` 和 `entryName` 作为参数并返回文件名的函数。

如果你的包导入 CSS，`cssFileName` 可用于指定 CSS 文件输出的名称。如果设置为字符串，它默认为与 `fileName` 相同的值，否则它也回退到 `package.json` 中的 `"name"`。

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: ['src/main.js'],
      fileName: (format, entryName) => `my-lib-${entryName}.${format}.js`,
      cssFileName: 'my-lib-style',
    },
  },
})
```

## build.license

- **类型：** `boolean | { fileName?: string }`
- **默认值：** `false`
- **相关：** [许可证](/guide/features#license)

当设置为 `true` 时，构建将生成一个 `.vite/license.md` 文件，其中包含所有打包依赖的许可证。

如果传入了 `fileName`，它将用作相对于 `outDir` 的许可证文件名。如果它以 `.json` 结尾，则将生成原始 JSON 元数据，可用于进一步处理。例如：

```json
[
  {
    "name": "dep-1",
    "version": "1.2.3",
    "identifier": "CC0-1.0",
    "text": "CC0 1.0 Universal\n\n..."
  },
  {
    "name": "dep-2",
    "version": "4.5.6",
    "identifier": "MIT",
    "text": "MIT License\n\n..."
  }
]
```

::: tip

如果你想在构建后的代码中引用许可证文件，可以使用 [`build.rolldownOptions.output.postBanner`](https://rolldown.rs/reference/OutputOptions.postBanner#postbanner) 在文件顶部注入注释。例如：

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    license: true,
    rolldownOptions: {
      output: {
        postBanner:
          '/* 查看 bundled dependencies 的许可证于 https://example.com/license.md */',
      },
    },
  },
})
```

:::

## build.manifest

- **类型：** `boolean | string`
- **默认值：** `false`
- **相关：** [后端集成](/guide/backend-integration)

是否生成一个 manifest 文件，其中包含未哈希的资源文件名到其哈希版本的映射，服务器框架可以使用它来渲染正确的资源链接。

当值为字符串时，它将用作相对于 `build.outDir` 的 manifest 文件路径。当设置为 `true` 时，路径为 `.vite/manifest.json`。

如果你正在编写插件，并且需要在构建期间检查每个输出 chunk 或资产相关的 CSS 和静态资源，你也可以使用 [`viteMetadata` 输出 bundle 元数据 API](/guide/api-plugin#output-bundle-metadata)。

## build.ssrManifest

- **类型：** `boolean | string`
- **默认值：** `false`
- **相关：** [服务端渲染](/guide/ssr)

是否生成 SSR manifest 文件，用于在生产环境中确定样式链接和资源预加载指令。

当值为字符串时，它将用作相对于 `build.outDir` 的 manifest 文件路径。当设置为 `true` 时，路径为 `.vite/ssr-manifest.json`。

## build.ssr

- **类型：** `boolean | string`
- **默认值：** `false`
- **相关：** [服务端渲染](/guide/ssr)

生成面向 SSR 的构建。值可以是字符串以直接指定 SSR 入口，或者是 `true`，这需要通过 `rollupOptions.input` 指定 SSR 入口。

## build.emitAssets

- **类型：** `boolean`
- **默认值：** `false`

在非客户端构建期间，不会发出静态资源，因为假设它们会作为客户端构建的一部分发出。此选项允许框架强制在其他环境构建中发出它们。框架有责任在后构建步骤中合并资源。

## build.ssrEmitAssets

- **类型：** `boolean`
- **默认值：** `false`

在 SSR 构建期间，不会发出静态资源，因为假设它们会作为客户端构建的一部分发出。此选项允许框架强制在客户端和 SSR 构建中都发出它们。框架有责任在后构建步骤中合并资源。一旦 Environment API 稳定，此选项将被 `build.emitAssets` 取代。

## build.minify

- **类型：** `boolean | 'oxc' | 'terser' | 'esbuild'`
- **默认值：** 客户端构建为 `'oxc'`，SSR 构建为 `false`

设置为 `false` 以禁用压缩，或指定要使用的压缩器。默认是 [Oxc Minifier](https://oxc.rs/docs/guide/usage/minifier)，比 terser 快 30 ~ 90 倍，压缩率仅差 0.5 ~ 2%。[基准测试](https://github.com/privatenumber/minification-benchmarks)

`build.minify: 'esbuild'` 已弃用，将在未来移除。

注意，当在 lib 模式下使用 `'es'` 格式时，`build.minify` 选项不会压缩空白字符，因为它会移除纯注释并破坏树摇。

当分别设置为 `'esbuild'` 或 `'terser'` 时，必须安装 esbuild 或 Terser。

```sh
npm add -D esbuild
npm add -D terser
```

## build.terserOptions

- **类型：** `TerserOptions`

传递给 Terser 的其他 [压缩选项](https://terser.org/docs/api-reference#minify-options)。

此外，你还可以传递 `maxWorkers: number` 选项来指定要生成的最大工作线程数。默认为 CPU 数量减 1。

## build.write

- **类型：** `boolean`
- **默认值：** `true`

设置为 `false` 以禁用将 bundle 写入磁盘。这主要用于 [编程式 `build()` 调用](/guide/api-javascript#build)，在写入磁盘之前需要对 bundle 进行进一步的后处理。

## build.emptyOutDir

- **类型：** `boolean`
- **默认值：** 如果 `outDir` 在 `root` 内部则为 `true`

默认情况下，如果 `outDir` 在项目根目录内，Vite 将在构建时清空 `outDir`。如果 `outDir` 在根目录外，它将发出警告以避免意外删除重要文件。你可以显式设置此选项来抑制警告。这也可通过命令行作为 `--emptyOutDir` 使用。

## build.copyPublicDir

- **类型：** `boolean`
- **默认值：** `true`

默认情况下，Vite 将在构建时将文件从 `publicDir` 复制到 `outDir`。设置为 `false` 以禁用此功能。

## build.reportCompressedSize

- **类型：** `boolean`
- **默认值：** `true`

启用/禁用 gzip 压缩大小报告。压缩大输出文件可能很慢，因此禁用此功能可能会提高大型项目的构建性能。

## build.chunkSizeWarningLimit

- **类型：** `number`
- **默认值：** `500`

chunk 大小警告的限制（以 kB 为单位）。它与未压缩的 chunk 大小进行比较，因为 [JavaScript 大小本身与执行时间相关](https://v8.dev/blog/cost-of-javascript-2019)。

## build.watch

- **类型：** [`WatcherOptions`](https://rolldown.rs/reference/InputOptions.watch)`| null`
- **默认值：** `null`

设置为 `{}` 以启用 rollup watcher。这主要用于涉及仅构建插件或集成流程的情况。

::: warning 在 Windows Subsystem for Linux (WSL) 2 上使用 Vite

在某些情况下，文件系统监视在 WSL2 上不起作用。
有关更多详细信息，请参阅 [`server.watch`](./server-options.md#server-watch)。

:::
