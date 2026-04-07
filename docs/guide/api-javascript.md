# JavaScript API

Vite 的 JavaScript API 是完全类型化的，建议使用 TypeScript 或在 VS Code 中启用 JS 类型检查以利用智能感知和验证。

## `createServer`

**类型签名：**

```ts
async function createServer(inlineConfig?: InlineConfig): Promise<ViteDevServer>
```

**示例用法：**

```ts twoslash
import { createServer } from 'vite'

const server = await createServer({
  // 任何有效的用户配置选项，加上 `mode` 和 `configFile`
  configFile: false,
  root: import.meta.dirname,
  server: {
    port: 1337,
  },
})
await server.listen()

server.printUrls()
server.bindCLIShortcuts({ print: true })
```

::: tip 注意
当在同一个 Node.js 进程中使用 `createServer` 和 `build` 时，这两个函数都依赖 `process.env.NODE_ENV` 来正常工作，这也取决于 `mode` 配置选项。为了防止行为冲突，将 `process.env.NODE_ENV` 或这两个 API 的 `mode` 设置为 `development`。否则，你可以生成一个子进程来分别运行这些 API。
:::

::: tip 注意
当使用 [中间件模式](/config/server-options.html#server-middlewaremode) 结合 [用于 WebSocket 的代理配置](/config/server-options.html#server-proxy) 时，应在 `middlewareMode` 中提供父级 http 服务器以正确绑定代理。

<details>
<summary>示例</summary>

```ts twoslash
import http from 'http'
import { createServer } from 'vite'

const parentServer = http.createServer() // 或者 express, koa 等

const vite = await createServer({
  server: {
    // 启用中间件模式
    middlewareMode: {
      // 为代理 WebSocket 提供父级 http 服务器
      server: parentServer,
    },
    proxy: {
      '/ws': {
        target: 'ws://localhost:3000',
        // 代理 WebSocket
        ws: true,
      },
    },
  },
})

// @noErrors: 2339
parentServer.use(vite.middlewares)
```

</details>
:::

## `InlineConfig`

`InlineConfig` 接口扩展了 `UserConfig` 并带有额外的属性：

- `configFile`: 指定要使用的配置文件。如果未设置，Vite 将尝试从项目根目录自动解析一个。设置为 `false` 以禁用自动解析。

## `ResolvedConfig`

`ResolvedConfig` 接口拥有与 `UserConfig` 所有相同的属性，除了大多数属性已解析且非 undefined。它还包含实用工具，如：

- `config.assetsInclude`: 一个用于检查 `id` 是否被视为资源的函数。
- `config.logger`: Vite 的内部日志对象。

## `ViteDevServer`

```ts
interface ViteDevServer {
  /**
   * 解析后的 Vite 配置对象。
   */
  config: ResolvedConfig
  /**
   * 一个 connect 应用实例
   * - 可用于将自定义中间件附加到开发服务器。
   * - 也可用作自定义 http 服务器的处理函数
   *   或任何 connect 风格 Node.js 框架中的中间件。
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * 原生 Node http 服务器实例。
   * 在中间件模式下将为 null。
   */
  httpServer: http.Server | null
  /**
   * Chokidar watcher 实例。如果 `config.server.watch` 设置为 `null`，
   * 它将不会监视任何文件，调用 `add` 或 `unwatch` 将无效。
   * https://github.com/paulmillr/chokidar/tree/3.6.0#api
   */
  watcher: FSWatcher
  /**
   * 带有 `send(payload)` 方法的 WebSocket 服务器。
   */
  ws: WebSocketServer
  /**
   * Rollup 插件容器，可以在给定文件上运行插件钩子。
   */
  pluginContainer: PluginContainer
  /**
   * 模块图，跟踪导入关系、url 到文件的映射
   * 和 hmr 状态。
   */
  moduleGraph: ModuleGraph
  /**
   * Vite 在 CLI 上打印的解析后的 urls（URL-encoded）。在中间件模式下
   * 或如果服务器未监听任何端口则返回 `null`。
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * 以编程方式解析、加载和转换 URL 并获得结果，
   * 无需经过 http 请求管道。
   */
  transformRequest(
    url: string,
    options?: TransformOptions,
  ): Promise<TransformResult | null>
  /**
   * 应用 Vite 内置的 HTML 转换和任何插件 HTML 转换。
   */
  transformIndexHtml(
    url: string,
    html: string,
    originalUrl?: string,
  ): Promise<string>
  /**
   * 将给定 URL 作为实例化模块加载用于 SSR。
   */
  ssrLoadModule(
    url: string,
    options?: { fixStacktrace?: boolean },
  ): Promise<Record<string, any>>
  /**
   * 修复 ssr 错误堆栈跟踪。
   */
  ssrFixStacktrace(e: Error): void
  /**
   * 触发模块图中模块的 HMR。你可以使用 `server.moduleGraph`
   * API 检索要重新加载的模块。如果 `hmr` 为 false，则此操作无效。
   */
  reloadModule(module: ModuleNode): Promise<void>
  /**
   * 启动服务器。
   */
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>
  /**
   * 重启服务器。
   *
   * @param forceOptimize - 强制优化器重新打包，与 --force cli 标志相同
   */
  restart(forceOptimize?: boolean): Promise<void>
  /**
   * 停止服务器。
   */
  close(): Promise<void>
  /**
   * 绑定 CLI 快捷键
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<ViteDevServer>): void
  /**
   * 调用 `await server.waitForRequestsIdle(id)` 将等待直到所有静态导入
   * 处理完毕。如果从 load 或 transform 插件钩子调用，id 需要作为
   * 参数传递以避免死锁。在模块图的第一个静态导入部分处理完毕后
   * 调用此函数将立即解析。
   * @experimental
   */
  waitForRequestsIdle: (ignoredId?: string) => Promise<void>
}
```

:::info
`waitForRequestsIdle` 旨在用作一种逃生舱，以改善无法遵循 Vite 开发服务器按需性质的功能的开发体验 (DX)。它可以在启动期间被 Tailwind 等工具使用，以延迟生成应用 CSS 类，直到看到应用代码，避免样式变化的闪烁。当此函数在 load 或 transform 钩子中使用时，并且使用默认 HTTP1 服务器时，六个 http 通道之一将被阻塞，直到服务器处理完所有静态导入。Vite 的依赖优化器目前使用此函数，通过延迟加载预打包依赖直到从静态导入源收集所有导入的依赖，以避免缺少依赖时的全页重载。Vite 可能会在未来的主要版本中切换到不同的策略，默认设置 `optimizeDeps.crawlUntilStaticImports: false` 以避免大型应用在冷启动期间的性能打击。
:::

## `build`

**类型签名：**

```ts
async function build(
  inlineConfig?: InlineConfig,
): Promise<RollupOutput | RollupOutput[]>
```

**示例用法：**

```ts twoslash [vite.config.js]
import path from 'node:path'
import { build } from 'vite'

await build({
  root: path.resolve(import.meta.dirname, './project'),
  base: '/foo/',
  build: {
    rollupOptions: {
      // ...
    },
  },
})
```

## `preview`

**类型签名：**

```ts
async function preview(inlineConfig?: InlineConfig): Promise<PreviewServer>
```

**示例用法：**

```ts twoslash
import { preview } from 'vite'

const previewServer = await preview({
  // 任何有效的用户配置选项，加上 `mode` 和 `configFile`
  preview: {
    port: 8080,
    open: true,
  },
})

previewServer.printUrls()
previewServer.bindCLIShortcuts({ print: true })
```

## `PreviewServer`

```ts
interface PreviewServer {
  /**
   * 解析后的 vite 配置对象
   */
  config: ResolvedConfig
  /**
   * 一个 connect 应用实例。
   * - 可用于将自定义中间件附加到预览服务器。
   * - 也可用作自定义 http 服务器的处理函数
   *   或任何 connect 风格 Node.js 框架中的中间件
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * 原生 Node http 服务器实例
   */
  httpServer: http.Server
  /**
   * Vite 在 CLI 上打印的解析后的 urls（URL-encoded）。如果
   * 服务器未监听任何端口则返回 `null`。
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * 打印服务器 urls
   */
  printUrls(): void
  /**
   * 绑定 CLI 快捷键
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<PreviewServer>): void
}
```

## `resolveConfig`

**类型签名：**

```ts
async function resolveConfig(
  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
  defaultMode = 'development',
  defaultNodeEnv = 'development',
  isPreview = false,
): Promise<ResolvedConfig>
```

`command` 值在 dev 和 preview 中为 `serve`，在 build 中为 `build`。

## `mergeConfig`

**类型签名：**

```ts
function mergeConfig(
  defaults: Record<string, any>,
  overrides: Record<string, any>,
  isRoot = true,
): Record<string, any>
```

深度合并两个 Vite 配置。`isRoot` 表示正在合并的 Vite 配置中的级别。例如，如果你正在合并两个 `build` 选项，则设置为 `false`。

::: tip 注意
`mergeConfig` 仅接受对象形式的配置。如果你有回调形式的配置，你应该在传入 `mergeConfig` 之前调用它。

你可以使用 `defineConfig` 辅助函数将回调形式的配置与另一个配置合并：

```ts twoslash
import {
  defineConfig,
  mergeConfig,
  type UserConfigFnObject,
  type UserConfig,
} from 'vite'
declare const configAsCallback: UserConfigFnObject
declare const configAsObject: UserConfig

// ---cut---
export default defineConfig((configEnv) =>
  mergeConfig(configAsCallback(configEnv), configAsObject),
)
```

:::

## `searchForWorkspaceRoot`

**类型签名：**

```ts
function searchForWorkspaceRoot(
  current: string,
  root = searchForPackageRoot(current),
): string
```

**相关：** [server.fs.allow](/config/server-options.md#server-fs-allow)

搜索潜在工作空间的根目录，如果满足以下条件，否则将回退到 `root`：

- 在 `package.json` 中包含 `workspaces` 字段
- 包含以下文件之一
  - `lerna.json`
  - `pnpm-workspace.yaml`

## `loadEnv`

**类型签名：**

```ts
function loadEnv(
  mode: string,
  envDir: string,
  prefixes: string | string[] = 'VITE_',
): Record<string, string>
```

**相关：** [`.env` 文件](./env-and-mode.md#env-files)

加载 `envDir` 内的 `.env` 文件。默认情况下，只加载前缀为 `VITE_` 的环境变量，除非更改了 `prefixes`。

## `normalizePath`

**类型签名：**

```ts
function normalizePath(id: string): string
```

**相关：** [路径规范化](./api-plugin.md#path-normalization)

规范化路径以便在 Vite 插件之间互操作。

## `transformWithOxc`

**类型签名：**

```ts
async function transformWithOxc(
  code: string,
  filename: string,
  options?: OxcTransformOptions,
  inMap?: object,
): Promise<Omit<OxcTransformResult, 'errors'> & { warnings: string[] }>
```

使用 [Oxc Transformer](https://oxc.rs/docs/guide/usage/transformer) 转换 JavaScript 或 TypeScript。适用于希望匹配 Vite 内部 Oxc Transformer 转换的插件。

## `transformWithEsbuild`

**类型签名：**

```ts
async function transformWithEsbuild(
  code: string,
  filename: string,
  options?: EsbuildTransformOptions,
  inMap?: object,
): Promise<ESBuildTransformResult>
```

**已弃用：** 请改用 `transformWithOxc`。

使用 esbuild 转换 JavaScript 或 TypeScript。适用于希望匹配 Vite 内部 esbuild 转换的插件。

## `loadConfigFromFile`

**类型签名：**

```ts
async function loadConfigFromFile(
  configEnv: ConfigEnv,
  configFile?: string,
  configRoot: string = process.cwd(),
  logLevel?: LogLevel,
  customLogger?: Logger,
): Promise<{
  path: string
  config: UserConfig
  dependencies: string[]
} | null>
```

使用 esbuild 手动加载 Vite 配置文件。

## `preprocessCSS`

- **实验性：** [提供反馈](https://github.com/vitejs/vite/discussions/13815)

**类型签名：**

```ts
async function preprocessCSS(
  code: string,
  filename: string,
  config: ResolvedConfig,
): Promise<PreprocessCSSResult>

interface PreprocessCSSResult {
  code: string
  map?: SourceMapInput
  modules?: Record<string, string>
  deps?: Set<string>
}
```

预处理 `.css`、`.scss`、`.sass`、`.less`、`.styl` 和 `.stylus` 文件为纯 CSS，以便在浏览器中使用或被其他工具解析。与 [内置 CSS 预处理支持](/guide/features#css-pre-processors) 类似，如果使用了相应的预处理器，则必须安装它。

使用的预处理器是从 `filename` 扩展名推断出来的。如果 `filename` 以 `.module.{ext}` 结尾，则被推断为 [CSS module](https://github.com/css-modules/css-modules)，返回的结果将包含一个 `modules` 对象，将原始类名映射到转换后的类名。

注意，预处理不会解析 `url()` 或 `image-set()` 中的 URL。

## `version`

**类型：** `string`

当前 Vite 版本的字符串表示（例如 `"8.0.0"`）。

## `rolldownVersion`

**类型：** `string`

Vite 使用的 Rolldown 版本的字符串表示（例如 `"1.0.0"`）。来自 `rolldown` 的 [`VERSION`](https://rolldown.rs/reference/Variable.VERSION) 的重新导出。

## `esbuildVersion`

**类型：** `string`

仅为了向后兼容而保留。

## `rollupVersion`

**类型：** `string`

仅为了向后兼容而保留。
