# 服务器选项

除非另有说明，本节中的选项仅适用于开发环境。

## server.host

- **类型：** `string | boolean`
- **默认值：** `'localhost'`

指定服务器应该监听哪些 IP 地址。
将其设置为 `0.0.0.0` 或 `true` 以监听所有地址，包括局域网和公共地址。

可以通过 CLI 使用 `--host 0.0.0.0` 或 `--host` 来设置。

::: tip 注意

在某些情况下，其他服务器可能会响应而不是 Vite。

第一种情况是使用了 `localhost`。Node.js 的 [`dns.setDefaultResultOrder`](https://nodejs.org/docs/latest-v24.x/api/dns.html#dnssetdefaultresultorderorder) 改变了 DNS 解析地址的排序方式，浏览器使用的解析地址可能与 Vite 监听的地址不同。当解析地址不同时，Vite 会打印出来。

第二种情况是使用了通配符主机（例如 `0.0.0.0`）。这是因为监听非通配符主机的服务器优先于监听通配符主机的服务器。

:::

::: tip 从局域网访问 WSL2 上的服务器

在 WSL2 上运行 Vite 时，仅设置 `host: true` 不足以从局域网访问服务器。
请参阅 [WSL 文档](https://learn.microsoft.com/en-us/windows/wsl/networking#accessing-a-wsl-2-distribution-from-your-local-area-network-lan) 了解更多详情。

:::

## server.allowedHosts

- **类型：** `string[] | true`
- **默认值：** `[]`

Vite 允许响应的主机名。
默认允许 `localhost`、`.localhost` 下的域名以及所有 IP 地址。
使用 HTTPS 时，会跳过此检查。

如果字符串以 `.` 开头，它将允许该主机名（不带 `.`）以及该主机名下的所有子域名。例如，`.example.com` 将允许 `example.com`、`foo.example.com` 和 `foo.bar.example.com`。如果设置为 `true`，服务器将允许响应任何主机的请求。

::: details 哪些主机可以安全地添加？

你可以控制其解析到的 IP 地址的主机可以安全地添加到允许主机列表中。

例如，如果你拥有域名 `vite.dev`，你可以将 `vite.dev` 和 `.vite.dev` 添加到列表中。如果你不拥有该域名且无法信任该域名的所有者，则不应添加它。

特别是，你永远不应该将顶级域名（如 `.com`）添加到列表中。这是因为任何人都可以购买像 `example.com` 这样的域名并控制其解析到的 IP 地址。

:::

::: danger

将 `server.allowedHosts` 设置为 `true` 允许任何网站通过 DNS 重绑定攻击向你的开发服务器发送请求，从而下载你的源代码和内容。我们建议始终使用明确的允许主机列表。请参阅 [GHSA-vg6x-rcgg-rjx6](https://github.com/vitejs/vite/security/advisories/GHSA-vg6x-rcgg-rjx6) 了解更多详情。

:::

::: details 通过环境变量配置
你可以设置环境变量 `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` 来添加额外的允许主机。
:::

## server.port

- **类型：** `number`
- **默认值：** `5173`

指定服务器端口。注意，如果端口已被占用，Vite 将自动尝试下一个可用端口，因此这可能不是服务器最终监听的实际端口。

## server.strictPort

- **类型：** `boolean`

设置为 `true` 时，如果端口已被占用则退出，而不是自动尝试下一个可用端口。

## server.https

- **类型：** `https.ServerOptions`

启用 TLS + HTTP/2。该值是一个传递给 `https.createServer()` 的 [选项对象](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener)。

需要有效的证书。对于基本设置，你可以将 [@vitejs/plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl) 添加到项目插件中，它将自动创建并缓存自签名证书。但我们建议创建你自己的证书。

## server.open

- **类型：** `boolean | string`

服务器启动时自动在浏览器中打开应用。当值为字符串时，它将用作 URL 的路径名。如果你想在特定的浏览器中打开服务器，你可以设置环境变量 `process.env.BROWSER`（例如 `firefox`）。你也可以设置 `process.env.BROWSER_ARGS` 来传递额外参数（例如 `--incognito`）。

`BROWSER` 和 `BROWSER_ARGS` 也是你可以在 `.env` 文件中设置的特殊环境变量来进行配置。请参阅 [`open` 包](https://github.com/sindresorhus/open#app) 了解更多详情。

**示例：**

```js
export default defineConfig({
  server: {
    open: '/docs/index.html',
  },
})
```

## server.proxy

- **类型：** `Record<string, string | ProxyOptions>`

为开发服务器配置自定义代理规则。期望一个 `{ key: options }` 键值对对象。任何请求路径以该键开头的请求都将被代理到指定的目标。如果键以 `^` 开头，它将被解释为 `RegExp`。可以使用 `configure` 选项来访问代理实例。如果请求匹配任何配置的代理规则，该请求将不会被 Vite 转换。

注意，如果你使用的是非相对 [`base`](/config/shared-options.md#base)，你必须在每个键前加上该 `base` 前缀。

扩展自 [`http-proxy-3`](https://github.com/sagemathinc/http-proxy-3#options)。其他选项见 [这里](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/middlewares/proxy.ts#L13)。

在某些情况下，你可能还想配置底层开发服务器（例如向内部的 [connect](https://github.com/senchalabs/connect) 应用添加自定义中间件）。为此，你需要编写自己的 [插件](/guide/using-plugins.html) 并使用 [configureServer](/guide/api-plugin.html#configureserver) 函数。

**示例：**

```js
export default defineConfig({
  server: {
    proxy: {
      // 字符串简写：
      // http://localhost:5173/foo
      //   -> http://localhost:4567/foo
      '/foo': 'http://localhost:4567',
      // 带选项：
      // http://localhost:5173/api/bar
      //   -> http://jsonplaceholder.typicode.com/bar
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // 带正则表达式：
      // http://localhost:5173/fallback/
      //   -> http://jsonplaceholder.typicode.com/
      '^/fallback/.*': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fallback/, ''),
      },
      // 使用代理实例
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy 将是 'http-proxy' 的一个实例
        },
      },
      // 代理 websockets 或 socket.io：
      // ws://localhost:5173/socket.io
      //   -> ws://localhost:5174/socket.io
      // 使用 `rewriteWsOrigin` 时要小心，因为它可能使
      // 代理易受 CSRF 攻击。
      '/socket.io': {
        target: 'ws://localhost:5174',
        ws: true,
        rewriteWsOrigin: true,
      },
    },
  },
})
```

## server.cors

- **类型：** `boolean | CorsOptions`
- **默认值：** `{ origin: /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/ }`（允许 localhost、`127.0.0.1` 和 `::1`）

为开发服务器配置 CORS。传递一个 [选项对象](https://github.com/expressjs/cors#configuration-options) 来微调行为，或传递 `true` 以允许任何源。

::: danger

将 `server.cors` 设置为 `true` 允许任何网站向你的开发服务器发送请求并下载你的源代码和内容。我们建议始终使用明确的允许源列表。

:::

## server.headers

- **类型：** `OutgoingHttpHeaders`

指定服务器响应头。

## server.hmr

- **类型：** `boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean, clientPort?: number, server?: Server }`

禁用或配置 HMR 连接（在 HMR websocket 必须使用与 http 服务器不同地址的情况下）。

将 `server.hmr.overlay` 设置为 `false` 以禁用服务器错误覆盖层。

`protocol` 设置用于 HMR 连接的 WebSocket 协议：`ws` (WebSocket) 或 `wss` (WebSocket Secure)。

`clientPort` 是一个高级选项，仅覆盖客户端的端口，允许你在与客户端代码查找端口不同的端口上提供 websocket。

当定义了 `server.hmr.server` 时，Vite 将通过提供的服务器处理 HMR 连接请求。如果不在中间件模式下，Vite 将尝试通过现有服务器处理 HMR 连接请求。当你使用自签名证书或希望在单个端口上通过网络暴露 Vite 时，这很有用。

查看 [`vite-setup-catalogue`](https://github.com/sapphi-red/vite-setup-catalogue) 获取一些示例。

::: tip 注意

使用默认配置时，Vite 前面的反向代理应该支持代理 WebSocket。如果 Vite HMR 客户端连接 WebSocket 失败，客户端将回退到直接连接 Vite HMR 服务器，绕过反向代理：

```
Direct websocket connection fallback. Check out https://vite.zhcndoc.com/config/server-options.html#server-hmr to remove the previous connection error.
```

当发生回退时，浏览器中出现的错误可以忽略。要通过直接绕过反向代理来避免错误，你可以：

- 配置反向代理也代理 WebSocket
- 设置 [`server.strictPort = true`](#server-strictport) 并将 `server.hmr.clientPort` 设置为与 `server.port` 相同的值
- 将 `server.hmr.port` 设置为与 [`server.port`](#server-port) 不同的值

:::

## server.forwardConsole

- **类型：** `boolean | { unhandledErrors?: boolean, logLevels?: ('error' | 'warn' | 'info' | 'log' | 'debug')[] }`
- **默认值：** 自动（当基于 [`@vercel/detect-agent`](https://www.npmjs.com/package/@vercel/detect-agent) 检测到 AI 编码代理时为 `true`，否则为 `false`）

在开发期间将浏览器运行时事件转发到 Vite 服务器控制台。

- `true` 启用转发未处理的错误和 `console.error` / `console.warn` 日志。
- `unhandledErrors` 控制转发未捕获的异常和未处理的 promise 拒绝。
- `logLevels` 控制转发哪些 `console.*` 调用。

例如：

```js
export default defineConfig({
  server: {
    forwardConsole: {
      unhandledErrors: true,
      logLevels: ['warn', 'error'],
    },
  },
})
```

当转发未处理的错误时，它们会以增强的格式记录在服务器终端中，例如：

```log
1:18:38 AM [vite] (client) [Unhandled error] Error: this is test error
 > testError src/main.ts:20:8
     18|
     19| function testError() {
     20|   throw new Error('this is test error')
       |        ^
     21| }
     22|
 > HTMLButtonElement.<anonymous> src/main.ts:6:2
```

## server.warmup

- **类型：** `{ clientFiles?: string[], ssrFiles?: string[] }`
- **相关：** [预热常用文件](/guide/performance.html#warm-up-frequently-used-files)

预热文件以提前转换并缓存结果。这改善了服务器启动期间的初始页面加载，并防止转换瀑布流。

`clientFiles` 是仅在客户端使用的文件，而 `ssrFiles` 是仅在 SSR 中使用的文件。它们接受相对于 `root` 的文件路径数组或 [`tinyglobby` 模式](https://superchupu.dev/tinyglobby/comparison)。

确保只添加经常使用的文件，以免在启动时使 Vite 开发服务器过载。

```js
export default defineConfig({
  server: {
    warmup: {
      clientFiles: ['./src/components/*.vue', './src/utils/big-utils.js'],
      ssrFiles: ['./src/server/modules/*.js'],
    },
  },
})
```

## server.watch

- **类型：** `object | null`

传递给 [chokidar](https://github.com/paulmillr/chokidar/tree/3.6.0#api) 的文件系统监听器选项。

Vite 服务器监听器默认监听 `root` 并跳过 `.git/`、`node_modules/`、`test-results/` 以及 Vite 的 `cacheDir` 和 `build.outDir` 目录。当更新被监听的文件时，Vite 将应用 HMR 并仅在需要时更新页面。

如果设置为 `null`，将不会监听任何文件。[`server.watcher`](/guide/api-javascript.html#vitedevserver) 将提供一个兼容的事件发射器，但调用 `add` 或 `unwatch` 将无效。

::: warning 监听 `node_modules` 中的文件

目前无法监听 `node_modules` 中的文件和包。如需进一步了解进展和变通方法，你可以关注 [issue #8619](https://github.com/vitejs/vite/issues/8619)。

:::

::: warning 在 Windows Subsystem for Linux (WSL) 2 上使用 Vite

在 WSL2 上运行 Vite 时，当文件被 Windows 应用程序（非 WSL2 进程）编辑时，文件系统监听不起作用。这是由于 [WSL2 的限制](https://github.com/microsoft/WSL/issues/4739)。这也适用于在具有 WSL2 后端的 Docker 上运行。

要修复它，你可以：

- **推荐**：使用 WSL2 应用程序编辑你的文件。
  - 还建议将项目文件夹移出 Windows 文件系统。从 WSL2 访问 Windows 文件系统很慢。消除该开销将提高性能。
- 设置 `{ usePolling: true }`。
  - 注意 [`usePolling` 会导致高 CPU 利用率](https://github.com/paulmillr/chokidar/tree/3.6.0#performance)。

:::

## server.middlewareMode

- **类型：** `boolean`
- **默认值：** `false`

以中间件模式创建 Vite 服务器。

- **相关：** [appType](./shared-options#apptype), [SSR - 设置开发服务器](/guide/ssr#setting-up-the-dev-server)

- **示例：**

```js twoslash
import express from 'express'
import { createServer as createViteServer } from 'vite'

async function createServer() {
  const app = express()

  // 以中间件模式创建 Vite 服务器
  const vite = await createViteServer({
    server: { middlewareMode: true },
    // 不包含 Vite 默认的 HTML 处理中间件
    appType: 'custom',
  })
  // 使用 vite 的 connect 实例作为中间件
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // 由于 `appType` 是 `'custom'`，应该在此处提供响应。
    // 注意：如果 `appType` 是 `'spa'` 或 `'mpa'`，Vite 包含中间件
    // 来处理 HTML 请求和 404，因此用户中间件应该添加
    // 在 Vite 的中间件之前才能生效
  })
}

createServer()
```

## server.fs.strict

- **类型：** `boolean`
- **默认值：** `true`（自 Vite 2.7 起默认启用）

限制提供工作区根目录之外的文件。

## server.fs.allow

- **类型：** `string[]`

限制可以通过 `/@fs/` 提供的文件。当 `server.fs.strict` 设置为 `true` 时，访问此目录列表之外且未从允许的文件导入的文件将导致 403。

可以提供目录和文件。

Vite 将搜索潜在工作区的根目录并将其用作默认值。有效的工作区满足以下条件，否则将回退到 [项目根目录](/guide/#index-html-and-project-root)。

- 在 `package.json` 中包含 `workspaces` 字段
- 包含以下文件之一
  - `lerna.json`
  - `pnpm-workspace.yaml`

接受一个路径来指定自定义工作区根目录。可以是绝对路径或相对于 [项目根目录](/guide/#index-html-and-project-root) 的路径。例如：

```js
export default defineConfig({
  server: {
    fs: {
      // 允许提供项目根目录上一级的文件
      allow: ['..'],
    },
  },
})
```

当指定 `server.fs.allow` 时，自动工作区根目录检测将被禁用。要扩展原始行为，暴露了一个工具函数 `searchForWorkspaceRoot`：

```js
import { defineConfig, searchForWorkspaceRoot } from 'vite'

export default defineConfig({
  server: {
    fs: {
      allow: [
        // 向上搜索工作区根目录
        searchForWorkspaceRoot(process.cwd()),
        // 你的自定义规则
        '/path/to/custom/allow_directory',
        '/path/to/custom/allow_file.demo',
      ],
    },
  },
})
```

## server.fs.deny

- **类型：** `string[]`
- **默认值：** `['.env', '.env.*', '*.{crt,pem}', '**/.git/**']`

限制由 Vite 开发服务器提供的敏感文件的阻止列表。这将比 [`server.fs.allow`](#server-fs-allow) 具有更高的优先级。支持 [picomatch 模式](https://github.com/micromatch/picomatch#globbing-features)。

::: tip 注意

此阻止列表不适用于 [公共目录](/guide/assets.md#the-public-directory)。公共目录中的所有文件都无需任何过滤即可提供，因为它们在构建期间直接复制到输出目录。

:::

## server.origin

- **类型：** `string`

定义开发期间生成的资源 URL 的源。

```js
export default defineConfig({
  server: {
    origin: 'http://127.0.0.1:8080',
  },
})
```

## server.sourcemapIgnoreList

- **类型：** `false | (sourcePath: string, sourcemapPath: string) => boolean`
- **默认值：** `(sourcePath) => sourcePath.includes('node_modules')`

是否忽略服务器 sourcemap 中的源文件，用于填充 [`x_google_ignoreList` 源映射扩展](https://developer.chrome.com/articles/x-google-ignore-list/)。

`server.sourcemapIgnoreList` 等同于开发服务器的 [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist)。这两个配置选项之间的区别在于，rollup 函数使用 `sourcePath` 的相对路径调用，而 `server.sourcemapIgnoreList` 使用绝对路径调用。在开发期间，大多数模块的 map 和源文件在同一文件夹中，因此 `sourcePath` 的相对路径就是文件名本身。在这些情况下，使用绝对路径更方便。

默认情况下，它排除所有包含 `node_modules` 的路径。你可以传递 `false` 来禁用此行为，或者为了完全控制，传递一个接受源路径和 sourcemap 路径并返回是否忽略源路径的函数。

```js
export default defineConfig({
  server: {
    // 这是默认值，会将所有路径中包含 node_modules
    // 的文件添加到忽略列表中。
    sourcemapIgnoreList(sourcePath, sourcemapPath) {
      return sourcePath.includes('node_modules')
    },
  },
})
```

::: tip 注意
[`server.sourcemapIgnoreList`](#server-sourcemapignorelist) 和 [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist) 需要独立设置。`server.sourcemapIgnoreList` 是仅服务器的配置，不会从定义的 rollup 选项获取其默认值。
:::
