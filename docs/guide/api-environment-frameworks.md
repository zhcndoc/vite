# 框架的环境 API

:::info 发布候选
Environment API 通常处于发布候选阶段。我们将在主要版本之间保持 API 的稳定性，以便生态系统可以进行实验并在此基础上构建。但是，请注意 [某些特定 API](/changes/#considering) 仍被视为实验性的。

我们计划在下一次主要版本中稳定这些新 API（可能会有破坏性更改），一旦下游项目有时间实验新功能并验证它们。

资源：

- [反馈讨论](https://github.com/vitejs/vite/discussions/16358) 我们正在收集关于新 API 的反馈。
- [Environment API PR](https://github.com/vitejs/vite/pull/16471) 新 API 在此处实现和审查。

请与我们分享您的反馈。
:::

## DevEnvironment 通信级别

由于环境可能运行在不同的运行时中，针对环境的通信可能会受到运行时的限制。为了允许框架轻松编写运行时无关的代码，Environment API 提供了三种通信级别。

### `RunnableDevEnvironment`

`RunnableDevEnvironment` 是一种可以与你的应用代码交换任意 JavaScript 值的环境。导入模块会返回其真实、活动的导出（函数、类实例以及任何其他值），因此框架可以直接运行其服务器入口。隐式的 `ssr` 环境和其他非客户端环境在开发时默认使用 `RunnableDevEnvironment`。你可以使用 `isRunnableDevEnvironment` 函数来保护对 runner 的访问。

它的 `runner` 是一个 `ModuleRunner`。你可以通过 `runner.import(url)` 导入模块，它会从 Vite 模块图中获取、转换并执行一个模块（`url` 接受相对于根目录的文件路径、服务器路径或 id），并返回带有完整 HMR 支持的已实例化模块。它是 `server.ssrLoadModule` 的现代替代品，因此框架可以迁移到它，以便为其 SSR 开发流程启用 HMR。

:::info 为什么它可以通信任意值
`RunnableDevEnvironment` 会在与 Vite 服务器相同的运行时中执行模块，因此值是以内存进程内的方式跨越边界，而不是被序列化。这就是它与 [`FetchableDevEnvironment`](#fetchabledevenvironment) 的区别，后者只能通过 Fetch API 上序列化的 `Request`/`Response` 对象进行通信。因此，使用 `RunnableDevEnvironment` 要求 runner 的运行时必须与 Vite 服务器所运行的运行时相同。
:::

```ts
export class RunnableDevEnvironment extends DevEnvironment {
  public readonly runner: ModuleRunner
}

class ModuleRunner {
  /**
   * 要执行的 URL。
   * 接受文件路径、服务器路径或相对于根目录的 id。
   * 返回一个实例化的模块（与 ssrLoadModule 中相同）
   */
  public async import(url: string): Promise<Record<string, any>>
  /**
   * 其他 ModuleRunner 方法...
   */
}

if (isRunnableDevEnvironment(server.environments.ssr)) {
  await server.environments.ssr.runner.import('/entry-point.js')
}
```

:::warning
只有在第一次访问时才会惰性评估 `runner`。请注意，当创建 `runner` 时，Vite 会通过调用 `process.setSourceMapsEnabled` 或在不可用时覆盖 `Error.prepareStackTrace` 来启用源映射支持。
:::

给定一个配置为中间件模式的 Vite 服务器，如 [SSR 设置指南](/guide/ssr#setting-up-the-dev-server) 所述，让我们使用环境 API 实现 SSR 中间件。请记住，它不一定非要叫 `ssr`，所以在本例中我们将它命名为 `server`。错误处理已省略。

```js
import fs from 'node:fs'
import path from 'node:path'
import { createServer } from 'vite'

const viteServer = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    server: {
      // 默认情况下，模块在与 vite 服务器相同的进程中运行
    },
  },
})

// 在 TypeScript 中你可能需要将其强制转换为 RunnableDevEnvironment 或者
// 使用 isRunnableDevEnvironment 来保护对 runner 的访问
const serverEnvironment = viteServer.environments.server

app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  // 1. 读取 index.html
  const indexHtmlPath = path.resolve(import.meta.dirname, 'index.html')
  let template = fs.readFileSync(indexHtmlPath, 'utf-8')

  // 2. 应用 Vite HTML 转换。这会注入 Vite HMR 客户端，
  //    并应用来自 Vite 插件的 HTML 转换，例如 global
  //    来自 @vitejs/plugin-react 的前导代码
  template = await viteServer.transformIndexHtml(url, template)

  // 3. 加载服务器入口。import(url) 自动转换
  //    ESM 源代码以便在 Node.js 中使用！不需要打包
  //    ，并提供完整的 HMR 支持。
  const { render } = await serverEnvironment.runner.import(
    '/src/entry-server.js',
  )

  // 4. 渲染应用 HTML。这假设 entry-server.js 导出的
  //     `render` 函数调用适当的框架 SSR API，
  //    例如 ReactDOMServer.renderToString()
  const appHtml = await render(url)

  // 5. 将应用渲染的 HTML 注入到模板中。
  const html = template.replace(`<!--ssr-outlet-->`, appHtml)

  // 6. 发送渲染后的 HTML 回去。
  res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
})
```

当使用支持 HMR 的环境（例如 `RunnableDevEnvironment`）时，你应该在服务器入口文件中添加 `import.meta.hot.accept()` 以获得最佳行为。如果没有这个，服务器文件更改将使整个服务器模块图失效：

```js
// src/entry-server.js
export function render(...) { ... }

if (import.meta.hot) {
  import.meta.hot.accept()
}
```

### `FetchableDevEnvironment`

:::info

我们正在寻求关于 [`FetchableDevEnvironment` 提案](https://github.com/vitejs/vite/discussions/18191) 的反馈。

:::

`FetchableDevEnvironment` 是一个可以通过 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch) 接口与其运行时通信的环境。由于 `RunnableDevEnvironment` 只能在有限的运行时集中实现，我们建议使用 `FetchableDevEnvironment` 而不是 `RunnableDevEnvironment`。

选择它的一个常见原因是：某个框架想要支持一个无法直接运行 Vite 的运行时（例如 Cloudflare Workers）。在那里就不能使用 `RunnableDevEnvironment`，因为它要求 runner 与 Vite 服务器共享相同的运行时，以便值可以以内存进程内的方式跨越边界。围绕 Fetch API 进行标准化，可以让框架在所有目标运行时中保持一条统一的请求处理路径：其开发中间件会把每个进入的浏览器请求作为 `Request` 转发出去，并把返回的 `Response` 发送回浏览器，这与应用在生产环境中处理请求的方式一致。

这个环境通过 `handleRequest` 方法提供了一种标准化的请求处理方式：

```ts
import {
  createServer,
  createFetchableDevEnvironment,
  isFetchableDevEnvironment,
} from 'vite'

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    custom: {
      dev: {
        createEnvironment(name, config) {
          return createFetchableDevEnvironment(name, config, {
            handleRequest(request: Request): Promise<Response> | Response {
              // 处理 Request 并返回一个 Response
            },
          })
        },
      },
    },
  },
})

// 环境 API 的任何消费者现在都可以调用 `dispatchFetch`
if (isFetchableDevEnvironment(server.environments.custom)) {
  const response: Response = await server.environments.custom.dispatchFetch(
    new Request('http://example.com/request-to-handle'),
  )
}
```

:::warning
Vite 验证 `dispatchFetch` 方法的输入和输出：请求必须是全局 `Request` 类的实例，响应必须是全局 `Response` 类的实例。如果不是这种情况，Vite 将抛出 `TypeError`。

请注意，虽然 `FetchableDevEnvironment` 是作为类实现的，但它被 Vite 团队视为实现细节，可能会随时更改。
:::

### 原始 `DevEnvironment`

如果环境没有实现 `RunnableDevEnvironment` 或 `FetchableDevEnvironment` 接口，你需要手动设置通信。

如果你的代码可以与用户模块在相同的运行时中运行（即，它不依赖于 Node.js 特定的 API），你可以使用虚拟模块。这种方法消除了使用 Vite 的 API 从代码中访问值的需求。

```ts
// 使用 Vite API 的代码
import { createServer } from 'vite'

const server = createServer({
  plugins: [
    // 一个处理 `virtual:entrypoint` 的插件
    {
      name: 'virtual-module',
      /* 插件实现 */
    },
  ],
})
const ssrEnvironment = server.environment.ssr
const input = {}

// 使用运行代码的每个环境工厂暴露的函数
// 检查每个环境工厂提供什么
if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(`Unsupported runtime for ${ssrEnvironment.name}`)
}

// -------------------------------------
// virtual:entrypoint
const { createHandler } = await import('./entrypoint.js')
const handler = createHandler(input)
const response = handler(new Request('http://example.com/'))

// -------------------------------------
// ./entrypoint.js
export function createHandler(input) {
  return function handler(req) {
    return new Response('hello')
  }
}
```

例如，要在用户模块上调用 `transformIndexHtml`，可以使用以下插件：

```ts {13-21}
function vitePluginVirtualIndexHtml(): Plugin {
  let server: ViteDevServer | undefined
  return {
    name: vitePluginVirtualIndexHtml.name,
    configureServer(server_) {
      server = server_
    },
    resolveId(source) {
      return source === 'virtual:index-html' ? '\0' + source : undefined
    },
    async load(id) {
      if (id === '\0' + 'virtual:index-html') {
        let html: string
        if (server) {
          this.addWatchFile('index.html')
          html = fs.readFileSync('index.html', 'utf-8')
          html = await server.transformIndexHtml('/', html)
        } else {
          html = fs.readFileSync('dist/client/index.html', 'utf-8')
        }
        return `export default ${JSON.stringify(html)}`
      }
      return
    },
  }
}
```

如果你的代码需要 Node.js API，你可以使用 `hot.send` 与使用 Vite API 的用户模块代码通信。但是，请注意，这种方法在构建过程之后可能无法以相同的方式工作。

```ts
// 使用 Vite API 的代码
import { createServer } from 'vite'

const server = createServer({
  plugins: [
    // 一个处理 `virtual:entrypoint` 的插件
    {
      name: 'virtual-module',
      /* 插件实现 */
    },
  ],
})
const ssrEnvironment = server.environment.ssr
const input = {}

// 使用运行代码的每个环境工厂暴露的函数
// 检查每个环境工厂提供什么
if (ssrEnvironment instanceof RunnableDevEnvironment) {
  ssrEnvironment.runner.import('virtual:entrypoint')
} else if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(`Unsupported runtime for ${ssrEnvironment.name}`)
}

const req = new Request('http://example.com/')

const uniqueId = 'a-unique-id'
ssrEnvironment.send('request', serialize({ req, uniqueId }))
const response = await new Promise((resolve) => {
  ssrEnvironment.on('response', (data) => {
    data = deserialize(data)
    if (data.uniqueId === uniqueId) {
      resolve(data.res)
    }
  })
})

// -------------------------------------
// virtual:entrypoint
const { createHandler } = await import('./entrypoint.js')
const handler = createHandler(input)

import.meta.hot.on('request', (data) => {
  const { req, uniqueId } = deserialize(data)
  const res = handler(req)
  import.meta.hot.send('response', serialize({ res: res, uniqueId }))
})

const response = handler(new Request('http://example.com/'))

// -------------------------------------
// ./entrypoint.js
export function createHandler(input) {
  return function handler(req) {
    return new Response('hello')
  }
}
```

## 构建期间的环境

在 CLI 中，为了向后兼容，调用 `vite build` 和 `vite build --ssr` 仍然将只构建仅客户端和仅 SSR 环境。

当 `builder` 选项被设置时（即使是空对象 `{}`，这也是 `vite build --app` 所做的），`vite build` 会改为构建整个应用。这将在未来的主版本中成为默认行为。在这种模式下，Vite 会创建一个 `ViteBuilder` 实例（构建时相当于 `ViteDevServer`），并使用它来为生产环境构建所有已配置的环境。默认情况下，环境会按顺序构建，遵循 `environments` 记录中的顺序。

### 使用 `builder.buildApp` 配置应用构建

框架或用户可以通过 `builder.buildApp` 选项控制环境的构建方式。它接收 `ViteBuilder` 实例（在下面示例中命名为 `builder`），并负责构建每个环境；例如，可以并行构建其中的一些：

```js [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  builder: {
    buildApp: async (builder) => {
      const environments = Object.values(builder.environments)
      await Promise.all(
        environments.map((environment) => builder.build(environment)),
      )
    },
  },
})
```

### `buildApp` 插件钩子

除了 `builder.buildApp` 配置项之外，插件还可以定义 `buildApp` 钩子来参与应用构建。配置项和插件钩子按照既定顺序运行：顺序为 `'pre'` 或 `null` 的钩子最先运行，然后是配置的 `builder.buildApp`，最后是顺序为 `'post'` 的钩子。在钩子内部，`environment.isBuilt` 会告诉你某个环境是否已经构建过，这样插件就可以避免重复构建。

### 使用 `createBuilder` 以编程方式构建

要从你自己的代码触发应用构建，请使用 `createBuilder`，而不是独立的 `build` 函数。`createBuilder` 是 `createServer` 在构建时的对应物：它会解析配置并返回一个 `ViteBuilder`，其 `buildApp` 方法会构建每个已配置的环境。你也可以使用 `builder.build(environment)` 构建单个环境。

```js [build.js]
import { createBuilder } from 'vite'

const builder = await createBuilder()
await builder.buildApp()
```

对于支持环境感知构建的场景，`createBuilder` 已取代独立的 `build` 函数。`build` 仍然可以作为上面所述的传统仅客户端和仅 SSR 构建的简单入口，但它不能构建任意环境。运行 `builder.buildApp()` 是 `vite build --app` 的编程等价形式。

## 与环境无关的代码

大多数时候，当前的 `environment` 实例会作为运行代码上下文的一部分可用，因此很少需要通过 `server.environments` 来访问它们。例如，在插件钩子内部，环境会作为 `PluginContext` 的一部分暴露出来，因此可以使用 `this.environment` 访问它。请参阅 [插件的环境 API](./api-environment-plugins.md) 以了解如何构建感知环境的插件。
