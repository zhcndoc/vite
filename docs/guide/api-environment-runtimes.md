# 运行时环境 API

:::info 发布候选
Environment API 目前大致处于发布候选阶段。我们将在主要版本之间保持 API 的稳定性，以便生态系统可以进行实验并基于它们进行构建。但是，请注意 [某些特定 API](/changes/#considering) 仍被视为实验性的。

我们计划在未来的一次主要版本中稳定这些新 API（可能会有破坏性变更），一旦下游项目有时间实验新功能并验证它们。

资源：

- [反馈讨论](https://github.com/vitejs/vite/discussions/16358) 我们在此收集关于新 API 的反馈。
- [Environment API PR](https://github.com/vitejs/vite/pull/16471) 新 API 在此实现和审查。

请与我们分享您的反馈。
:::

## 环境工厂

环境工厂旨在由 Cloudflare 等环境提供者实现，而非最终用户。环境工厂返回一个 `EnvironmentOptions`，适用于同时在开发和构建环境中使用目标运行时的大多数情况。也可以设置默认环境选项，这样用户就不需要自行设置。

```ts
function createWorkerdEnvironment(
  userConfig: EnvironmentOptions,
): EnvironmentOptions {
  return mergeConfig(
    {
      resolve: {
        conditions: [
          /*...*/
        ],
      },
      dev: {
        createEnvironment(name, config) {
          return createWorkerdDevEnvironment(name, config, {
            hot: true,
            transport: customHotChannel(),
          })
        },
      },
      build: {
        createEnvironment(name, config) {
          return createWorkerdBuildEnvironment(name, config)
        },
      },
    },
    userConfig,
  )
}
```

然后配置文件可以编写为：

```js
import { createWorkerdEnvironment } from 'vite-environment-workerd'

export default {
  environments: {
    ssr: createWorkerdEnvironment({
      build: {
        outDir: '/dist/ssr',
      },
    }),
    rsc: createWorkerdEnvironment({
      build: {
        outDir: '/dist/rsc',
      },
    }),
  },
}
```

框架可以使用带有 workerd 运行时的环境来执行 SSR，使用方式如下：

```js
const ssrEnvironment = server.environments.ssr
```

## 创建新的环境工厂

Vite 开发服务器默认暴露两个环境：`client` 环境和 `ssr` 环境。客户端环境默认是浏览器环境，模块运行器通过将虚拟模块 `/@vite/client` 导入客户端应用来实现。SSR 环境默认在与 Vite 服务器相同的 Node 运行时中运行，并允许应用服务器在开发期间用于渲染请求，完全支持 HMR。

转换后的源代码称为模块，每个环境中处理的模块之间的关系保存在模块图中。这些模块的转换代码被发送到与每个环境关联的运行时中执行。当模块在运行时中求值时，其导入的模块将被请求，从而触发模块图某一部分的处理。

Vite 模块运行器允许通过先使用 Vite 插件处理来运行任何代码。它与 `server.ssrLoadModule` 不同，因为运行器实现与服务器解耦。这允许库和框架作者实现他们自己的 Vite 服务器与运行器之间的通信层。浏览器使用服务器 WebSocket 并通过 HTTP 请求与其对应的环境通信。Node 模块运行器可以直接进行函数调用来处理模块，因为它运行在同一个进程中。其他环境可以运行模块，连接到像 workerd 这样的 JS 运行时，或者像 Vitest 那样连接到工作线程。

```dot
digraph module_runner {
  rankdir=LR
  node [shape=box style="rounded,filled" fontname="Arial" fontsize=11 margin="0.2,0.1" fontcolor="${#3c3c43|#ffffff}" color="${#c2c2c4|#3c3f44}"]
  edge [color="${#67676c|#98989f}" fontname="Arial" fontsize=10 fontcolor="${#67676c|#98989f}"]
  bgcolor="transparent"
  compound=true

  subgraph cluster_server {
    label="Vite Dev Server (Node.js)" labeljust=l fontname="Arial" fontsize=12
    style="rounded,filled" fillcolor="${#f6f6f7|#1a1a1f}" color="${#c2c2c4|#3c3f44}"
    fontcolor="${#3c3c43|#ffffff}"

    subgraph cluster_env {
      label="DevEnvironment" labeljust=l fontname="Arial" fontsize=11
      style="rounded,filled" fillcolor="${#f2ecfc|#2c273e}" color="${#c2c2c4|#3c3f44}"
      fontcolor="${#3c3c43|#ffffff}"

      plugins [label="Plugin\nPipeline" fillcolor="${#e9eaff|#222541}"]
      mg [label="Module\nGraph" fillcolor="${#e9eaff|#222541}"]
      hot [label="HotChannel" fillcolor="${#fcf4dc|#38301a}"]

      plugins -> mg [dir=both]
      mg -> hot [style=invis]
    }
  }

  subgraph cluster_runtime {
    label="Target Runtime" labeljust=l fontname="Arial" fontsize=12
    style="rounded,filled" fillcolor="${#f0fdf4|#131b15}" color="${#c2c2c4|#3c3f44}"
    fontcolor="${#3c3c43|#ffffff}"

    subgraph cluster_runner {
      label="ModuleRunner" labeljust=l fontname="Arial" fontsize=11
      style="rounded,filled" fillcolor="${#def5ed|#15312d}" color="${#c2c2c4|#3c3f44}"
      fontcolor="${#3c3c43|#ffffff}"

      evaluator [label="Module\nEvaluator" fillcolor="${#def5ed|#15312d}"]
      transport [label="Transport" fillcolor="${#fcf4dc|#38301a}"]
    }
  }

  hot -> transport [label="HMR / Module\nfetch & invoke" dir=both style=bold color="${#6f42c1|#c8abfa}"]
}
```

此功能的目标之一是提供一个可定制的 API 来处理和运行代码。用户可以使用暴露的原语创建新的环境工厂。

```ts
import { DevEnvironment, HotChannel } from 'vite'

function createWorkerdDevEnvironment(
  name: string,
  config: ResolvedConfig,
  context: DevEnvironmentContext
) {
  const connection = /* ... */
  const transport: HotChannel = {
    on: (listener) => { connection.on('message', listener) },
    send: (data) => connection.send(data),
  }

  const workerdDevEnvironment = new DevEnvironment(name, config, {
    options: {
      resolve: { conditions: ['custom'] },
      ...context.options,
    },
    hot: true,
    transport,
  })
  return workerdDevEnvironment
}
```

默认情况下，`HotChannel` 传输应用了 `server.fs` 限制，意味着只能提供允许目录内的文件。如果您的传输未通过网络暴露（例如，它通过工作线程或进程内调用通信），您可以在 `HotChannel` 上设置 `skipFsCheck: true` 以绕过这些限制。

`DevEnvironment` 有 [多个通信级别](/guide/api-environment-frameworks#devenvironment-communication-levels)。为了使框架更容易编写与运行时无关的代码，我们建议实现尽可能灵活的通信级别。

## `ModuleRunner`

模块运行器在目标运行时中实例化。下一节中的所有 API 均从 `vite/module-runner` 导入，除非另有说明。此导出入口点保持尽可能轻量，仅导出创建模块运行器所需的最小内容。

**类型签名：**

```ts
export class ModuleRunner {
  constructor(
    public options: ModuleRunnerOptions,
    public evaluator: ModuleEvaluator = new ESModulesEvaluator(),
    private debug?: ModuleRunnerDebugger,
  ) {}
  /**
   * 要执行的 URL。
   * 接受文件路径、服务器路径或相对于根目录的 id。
   */
  public async import<T = any>(url: string): Promise<T>
  /**
   * 清除所有缓存，包括 HMR 监听器。
   */
  public clearCache(): void
  /**
   * 清除所有缓存，移除所有 HMR 监听器，重置源映射支持。
   * 此方法不会停止 HMR 连接。
   */
  public async close(): Promise<void>
  /**
   * 如果运行器已通过调用 `close()` 关闭，则返回 `true`。
   */
  public isClosed(): boolean
}
```

`ModuleRunner` 中的模块求值器负责执行代码。Vite 开箱即用地导出 `ESModulesEvaluator`，它使用 `new AsyncFunction` 来求值代码。如果您的 JavaScript 运行时不支持不安全求值，您可以提供自己的实现。

模块运行器暴露 `import` 方法。当 Vite 服务器触发 `full-reload` HMR 事件时，所有受影响的模块将被重新执行。请注意，模块运行器在这种情况下不会更新 `exports` 对象（它会覆盖它），如果您依赖拥有最新的 `exports` 对象，则需要再次运行 `import` 或从 `evaluatedModules` 获取模块。

**示例用法：**

```js
import {
  ModuleRunner,
  ESModulesEvaluator,
  createNodeImportMeta,
} from 'vite/module-runner'
import { transport } from './rpc-implementation.js'

const moduleRunner = new ModuleRunner(
  {
    transport,
    createImportMeta: createNodeImportMeta, // 如果模块运行器运行在 Node.js 中
  },
  new ESModulesEvaluator(),
)

await moduleRunner.import('/src/entry-point.js')
```

## `ModuleRunnerOptions`

```ts twoslash
import type {
  InterceptorOptions as InterceptorOptionsRaw,
  ModuleRunnerHmr as ModuleRunnerHmrRaw,
  EvaluatedModules,
} from 'vite/module-runner'
import type { Debug } from '@type-challenges/utils'

type InterceptorOptions = Debug<InterceptorOptionsRaw>
type ModuleRunnerHmr = Debug<ModuleRunnerHmrRaw>
/** 见下文 */
type ModuleRunnerTransport = unknown

// ---cut---
interface ModuleRunnerOptions {
  /**
   * 一组用于与服务器通信的方法。
   */
  transport: ModuleRunnerTransport
  /**
   * 配置如何解析源映射。
   * 如果 `process.setSourceMapsEnabled` 可用，则首选 `node`。
   * 否则默认使用 `prepareStackTrace`，它会覆盖
   * `Error.prepareStackTrace` 方法。
   * 您可以提供一个对象来配置未由 Vite 处理的文件的文件内容和源映射如何解析。
   */
  sourcemapInterceptor?:
    | false
    | 'node'
    | 'prepareStackTrace'
    | InterceptorOptions
  /**
   * 禁用 HMR 或配置 HMR 选项。
   *
   * @default true
   */
  hmr?: boolean | ModuleRunnerHmr
  /**
   * 自定义模块缓存。如果未提供，它为每个模块运行器实例创建一个单独的模块缓存。
   */
  evaluatedModules?: EvaluatedModules
}
```

## `ModuleEvaluator`

**类型签名：**

```ts twoslash
import type { ModuleRunnerContext as ModuleRunnerContextRaw } from 'vite/module-runner'
import type { Debug } from '@type-challenges/utils'

type ModuleRunnerContext = Debug<ModuleRunnerContextRaw>

// ---cut---
export interface ModuleEvaluator {
  /**
   * 转换后的代码中前缀行的数量。
   */
  startOffset?: number
  /**
   * 评估由 Vite 转换后的代码。
   * @param context 函数上下文
   * @param code 转换后的代码
   * @param id 用于获取模块的 ID
   */
  runInlinedModule(
    context: ModuleRunnerContext,
    code: string,
    id: string,
  ): Promise<any>
  /**
   * 评估外部化的模块。
   * @param file 外部模块的文件 URL
   */
  runExternalModule(file: string): Promise<any>
}
```

Vite 默认导出实现了此接口的 `ESModulesEvaluator`。它使用 `new AsyncFunction` 来评估代码，所以如果代码包含内联源映射，它应该包含 [2 行的偏移量](https://tc39.es/ecma262/#sec-createdynamicfunction) 以容纳新增的行。这由 `ESModulesEvaluator` 自动完成。自定义评估器不会添加额外的行。

## `ModuleRunnerTransport`

**类型签名：**

```ts twoslash
import type { ModuleRunnerTransportHandlers } from 'vite/module-runner'
/** 一个对象 */
type HotPayload = unknown
// ---cut---
interface ModuleRunnerTransport {
  connect?(handlers: ModuleRunnerTransportHandlers): Promise<void> | void
  disconnect?(): Promise<void> | void
  send?(data: HotPayload): Promise<void> | void
  invoke?(data: HotPayload): Promise<{ result: any } | { error: any }>
  timeout?: number
}
```

通过 RPC 或直接调用函数与环境通信的传输对象。当未实现 `invoke` 方法时，必须实现 `send` 方法和 `connect` 方法。Vite 将在内部构造 `invoke`。

你需要将其与服务器上的 `HotChannel` 实例配对，如下例所示，其中模块运行器是在工作线程中创建的：

::: code-group

```js [worker.js]
import { parentPort } from 'node:worker_threads'
import { fileURLToPath } from 'node:url'
import {
  ESModulesEvaluator,
  ModuleRunner,
  createNodeImportMeta,
} from 'vite/module-runner'

/** @type {import('vite/module-runner').ModuleRunnerTransport} */
const transport = {
  connect({ onMessage, onDisconnection }) {
    parentPort.on('message', onMessage)
    parentPort.on('close', onDisconnection)
  },
  send(data) {
    parentPort.postMessage(data)
  },
}

const runner = new ModuleRunner(
  {
    transport,
    createImportMeta: createNodeImportMeta,
  },
  new ESModulesEvaluator(),
)
```

```js [server.js]
import { BroadcastChannel } from 'node:worker_threads'
import { createServer, RemoteEnvironmentTransport, DevEnvironment } from 'vite'

function createWorkerEnvironment(name, config, context) {
  const worker = new Worker('./worker.js')
  const handlerToWorkerListener = new WeakMap()
  const client = {
    send(payload: HotPayload) {
      worker.postMessage(payload)
    },
  }

  const workerHotChannel = {
    // 工作线程 post 消息不通过网络暴露，跳过 server.fs 检查
    skipFsCheck: true,
    send: (data) => worker.postMessage(data),
    on: (event, handler) => {
      // 客户端已连接
      if (event === 'vite:client:connect') return
      if (event === 'vite:client:disconnect') {
        const listener = () => {
          handler(undefined, client)
        }
        handlerToWorkerListener.set(handler, listener)
        worker.on('exit', listener)
        return
      }

      const listener = (value) => {
        if (value.type === 'custom' && value.event === event) {
          handler(value.data, client)
        }
      }
      handlerToWorkerListener.set(handler, listener)
      worker.on('message', listener)
    },
    off: (event, handler) => {
      if (event === 'vite:client:connect') return
      if (event === 'vite:client:disconnect') {
        const listener = handlerToWorkerListener.get(handler)
        if (listener) {
          worker.off('exit', listener)
          handlerToWorkerListener.delete(handler)
        }
        return
      }

      const listener = handlerToWorkerListener.get(handler)
      if (listener) {
        worker.off('message', listener)
        handlerToWorkerListener.delete(handler)
      }
    },
  }

  return new DevEnvironment(name, config, {
    transport: workerHotChannel,
  })
}

await createServer({
  environments: {
    worker: {
      dev: {
        createEnvironment: createWorkerEnvironment,
      },
    },
  },
})
```

:::

确保在 `on` / `off` 方法中实现 `vite:client:connect` / `vite:client:disconnect` 事件（如果存在这些方法）。`vite:client:connect` 事件应在连接建立时发出，`vite:client:disconnect` 事件应在连接关闭时发出。传递给事件处理程序的 `HotChannelClient` 对象对于同一连接必须具有相同的引用。

另一个使用 HTTP 请求在运行器和服务器之间通信的示例：

```ts
import { ESModulesEvaluator, ModuleRunner } from 'vite/module-runner'

export const runner = new ModuleRunner(
  {
    transport: {
      async invoke(data) {
        const response = await fetch(`http://my-vite-server/invoke`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
        return response.json()
      },
    },
    hmr: false, // 禁用 HMR，因为 HMR 需要 transport.connect
  },
  new ESModulesEvaluator(),
)

await runner.import('/entry.js')
```

在这种情况下，可以使用 `NormalizedHotChannel` 中的 `handleInvoke` 方法：

```ts
const customEnvironment = new DevEnvironment(name, config, context)

server.onRequest((request: Request) => {
  const url = new URL(request.url)
  if (url.pathname === '/invoke') {
    const payload = (await request.json()) as HotPayload
    const result = customEnvironment.hot.handleInvoke(payload)
    return new Response(JSON.stringify(result))
  }
  return Response.error()
})
```

但请注意，为了支持 HMR，需要 `send` 和 `connect` 方法。`send` 方法通常在触发自定义事件时调用（例如，`import.meta.hot.send("my-event")`）。

Vite 从主入口点导出 `createServerHotChannel` 以支持 Vite SSR 期间的 HMR。
