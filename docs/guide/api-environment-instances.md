# 使用 `Environment` 实例

:::info 发布候选
Environment API 通常处于发布候选阶段。我们将在主要版本之间保持 API 的稳定性，以便生态系统可以进行实验并在此基础上构建。但是，请注意 [一些特定的 API](/changes/#considering) 仍被视为实验性的。

我们计划在未来的主要版本中稳定这些新 API（可能会有破坏性变更），一旦下游项目有时间实验新功能并验证它们。

资源：

- [反馈讨论](https://github.com/vitejs/vite/discussions/16358) 我们在此收集关于新 API 的反馈。
- [Environment API PR](https://github.com/vitejs/vite/pull/16471) 新 API 在此实现和审查。

请与我们分享您的反馈。
:::

## 访问环境

在开发期间，开发服务器中可用的环境可以使用 `server.environments` 访问：

```js
// 创建服务器，或从 configureServer 钩子获取它
const server = await createServer(/* options */)

const clientEnvironment = server.environments.client
clientEnvironment.transformRequest(url)
console.log(server.environments.ssr.moduleGraph)
```

您也可以从插件中访问当前环境。有关更多详细信息，请参阅 [插件的环境 API](./api-environment-plugins.md#accessing-the-current-environment-in-hooks)。

## `DevEnvironment` 类

在开发期间，每个环境都是 `DevEnvironment` 类的一个实例：

```ts
class DevEnvironment {
  /**
   * Vite 服务器中环境的唯一标识符。
   * 默认情况下，Vite 暴露 'client' 和 'ssr' 环境。
   */
  name: string
  /**
   * 用于与目标运行时中关联的模块运行器
   * 发送和接收消息的通信通道。
   */
  hot: NormalizedHotChannel
  /**
   * 模块节点图，包含已处理模块之间的导入关系
   * 以及已处理代码的缓存结果。
   */
  moduleGraph: EnvironmentModuleGraph
  /**
   * 此环境解析的插件，包括使用
   * 每个环境的 `create` 钩子创建的插件
   */
  plugins: Plugin[]
  /**
   * 允许通过环境插件管道
   * 解析、加载和转换代码
   */
  pluginContainer: EnvironmentPluginContainer
  /**
   * 此环境解析的配置选项。服务器
   * 全局范围的选项作为所有环境的默认值，并且可以
   * 被覆盖（解析条件、external、optimizedDeps）
   */
  config: ResolvedConfig & ResolvedDevEnvironmentOptions

  constructor(
    name: string,
    config: ResolvedConfig,
    context: DevEnvironmentContext,
  )

  /**
   * 将 URL 解析为 id，加载它，并使用
   * 插件管道处理代码。模块图也会被更新。
   */
  async transformRequest(url: string): Promise<TransformResult | null>

  /**
   * 注册一个低优先级处理的请求。这有助于
   * 避免级联请求。Vite 服务器拥有关于
   * 其他请求导入的模块的信息，因此它可以预热模块图，
   * 以便在请求模块时它们已经被处理。
   */
  async warmupRequest(url: string): Promise<void>

  /**
   * 由模块运行器调用以检索有关指定
   * 模块的信息。内部调用 `transformRequest` 并将结果包装为
   * 模块运行器理解的格式。
   * 此方法不应手动调用。
   */
  async fetchModule(
    id: string,
    importer?: string,
    options?: FetchFunctionOptions,
  ): Promise<FetchResult>
}
```

`DevEnvironmentContext` 为：

```ts
interface DevEnvironmentContext {
  hot: boolean
  transport?: HotChannel | WebSocketServer
  options?: EnvironmentOptions
  remoteRunner?: {
    inlineSourceMap?: boolean
  }
  depsOptimizer?: DepsOptimizer
}
```

`TransformResult` 为：

```ts
interface TransformResult {
  code: string
  map: SourceMap | { mappings: '' } | null
  etag?: string
  deps?: string[]
  dynamicDeps?: string[]
}
```

Vite 服务器中的环境实例允许您使用 `environment.transformRequest(url)` 方法处理 URL。此函数将使用插件管道将 `url` 解析为模块 `id`，加载它（从文件系统读取文件或通过实现虚拟模块的插件），然后转换代码。在转换模块时，导入和其他元数据将通过创建或更新相应的模块节点记录在环境模块图中。处理完成后，转换结果也存储在模块中。

:::info transformRequest 命名
我们在当前版本的提案中使用 `transformRequest(url)` 和 `warmupRequest(url)`，以便习惯于 Vite 当前 API 的用户更容易讨论和理解。在发布之前，我们也可以借此机会审查这些名称。例如，可以命名为 `environment.processModule(url)` 或 `environment.loadModule(url)`，借鉴 Rollup 插件钩子中的 `context.load(id)`。目前，我们认为保留当前名称并推迟此讨论更好。
:::

## 独立的模块图

每个环境都有一个隔离的模块图。所有模块图都有相同的签名，因此可以实现通用算法来遍历或查询图，而不依赖于环境。`hotUpdate` 就是一个很好的例子。当文件被修改时，将使用每个环境的模块图来发现受影响的模块，并为每个环境独立执行 HMR。

::: info
Vite v5 拥有混合的客户端和 SSR 模块图。给定一个未处理或失效的节点，不可能知道它对应于客户端、SSR 还是两者环境。模块节点有一些加前缀的属性，如 `clientImportedModules` 和 `ssrImportedModules`（以及 `importedModules` 返回两者的联合）。`importers` 包含每个模块节点来自客户端和 SSR 环境的所有导入者。模块节点还有 `transformResult` 和 `ssrTransformResult`。向后兼容层允许生态系统从已弃用的 `server.moduleGraph` 迁移。
:::

每个模块都由一个 `EnvironmentModuleNode` 实例表示。模块可以在图中注册而尚未被处理（在这种情况下 `transformResult` 将为 `null`）。`importers` 和 `importedModules` 也会在模块处理后更新。

```ts
class EnvironmentModuleNode {
  environment: string

  url: string
  id: string | null = null
  file: string | null = null

  type: 'js' | 'css'

  importers = new Set<EnvironmentModuleNode>()
  importedModules = new Set<EnvironmentModuleNode>()
  importedBindings: Map<string, Set<string>> | null = null

  info?: ModuleInfo
  meta?: Record<string, any>
  transformResult: TransformResult | null = null

  acceptedHmrDeps = new Set<EnvironmentModuleNode>()
  acceptedHmrExports: Set<string> | null = null
  isSelfAccepting?: boolean
  lastHMRTimestamp = 0
  lastInvalidationTimestamp = 0
}
```

`environment.moduleGraph` 是 `EnvironmentModuleGraph` 的一个实例：

```ts
export class EnvironmentModuleGraph {
  environment: string

  urlToModuleMap = new Map<string, EnvironmentModuleNode>()
  idToModuleMap = new Map<string, EnvironmentModuleNode>()
  etagToModuleMap = new Map<string, EnvironmentModuleNode>()
  fileToModulesMap = new Map<string, Set<EnvironmentModuleNode>>()

  constructor(
    environment: string,
    resolveId: (url: string) => Promise<PartialResolvedId | null>,
  )

  async getModuleByUrl(
    rawUrl: string,
  ): Promise<EnvironmentModuleNode | undefined>

  getModuleById(id: string): EnvironmentModuleNode | undefined

  getModulesByFile(file: string): Set<EnvironmentModuleNode> | undefined

  onFileChange(file: string): void

  onFileDelete(file: string): void

  invalidateModule(
    mod: EnvironmentModuleNode,
    seen: Set<EnvironmentModuleNode> = new Set(),
    timestamp: number = monotonicDateNow(),
    isHmr: boolean = false,
  ): void

  invalidateAll(): void

  async ensureEntryFromUrl(
    rawUrl: string,
    setIsSelfAccepting = true,
  ): Promise<EnvironmentModuleNode>

  createFileOnlyEntry(file: string): EnvironmentModuleNode

  async resolveUrl(url: string): Promise<ResolvedUrl>

  updateModuleTransformResult(
    mod: EnvironmentModuleNode,
    result: TransformResult | null,
  ): void

  getModuleByEtag(etag: string): EnvironmentModuleNode | undefined
}
```

## `FetchResult`

`environment.fetchModule` 方法返回一个 `FetchResult`，旨在由模块运行器使用。`FetchResult` 是 `CachedFetchResult`、`ExternalFetchResult` 和 `ViteFetchResult` 的联合。

`CachedFetchResult` 类似于 `304` (未修改) HTTP 状态码。

```ts
export interface CachedFetchResult {
  /**
   * 如果模块已缓存于运行器中，这确认
   * 它未在服务器端失效。
   */
  cache: true
}
```

`ExternalFetchResult` 指示模块运行器使用 [`ModuleEvaluator`](/guide/api-environment-runtimes#moduleevaluator) 上的 `runExternalModule` 方法导入模块。在这种情况下，默认模块评估器将使用运行时的原生 `import` 而不是通过 Vite 处理文件。

```ts
export interface ExternalFetchResult {
  /**
   * 外部化模块的路径，以 file:// 开头。
   * 默认情况下，这将通过动态 "import" 导入，
   * 而不是由 Vite 转换并通过 Vite 运行器加载。
   */
  externalize: string
  /**
   * 模块类型。用于确定导入语句是否正确。
   * 例如，如果变量实际上未导出，Vite 需要抛出错误。
   */
  type: 'module' | 'commonjs' | 'builtin' | 'network'
}
```

`ViteFetchResult` 返回有关当前模块的信息，包括要执行的 `code` 以及模块的 `id`、`file` 和 `url`。

`invalidate` 字段指示模块运行器在再次执行之前使模块失效，而不是从缓存提供。这通常在触发 HMR 更新时为 `true`。

```ts
export interface ViteFetchResult {
  /**
   * 将由 Vite 运行器评估的代码。
   * 默认情况下，这将包装在异步函数中。
   */
  code: string
  /**
   * 磁盘上模块的文件路径。
   * 这将解析为 import.meta.url/filename。
   * 对于虚拟模块将为 `null`。
   */
  file: string | null
  /**
   * 服务器模块图中的模块 ID。
   */
  id: string
  /**
   * 导入中使用的模块 URL。
   */
  url: string
  /**
   * 使客户端上的模块失效。
   */
  invalidate: boolean
}
```
