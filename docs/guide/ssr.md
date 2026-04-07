# 服务端渲染 (SSR)

:::tip 注意
SSR 特指支持在 Node.js 中运行相同应用的前端框架（例如 React、Preact、Vue 和 Svelte），将其预渲染为 HTML，最后在客户端进行水合（hydrate）。如果您希望与传统服务端框架集成，请查看 [后端集成指南](./backend-integration)。

以下指南还假设您已有使用所选框架进行 SSR 的经验，并将仅关注 Vite 特定的集成细节。
:::

:::warning 底层 API
这是一个面向库和框架作者的底层 API。如果您的目标是创建应用程序，请确保先查看 [Awesome Vite SSR 部分](https://github.com/vitejs/awesome-vite#ssr) 中更高级别的 SSR 插件和工具。话虽如此，许多应用程序都是直接在 Vite 原生的底层 API 之上成功构建的。

目前，Vite 正在通过 [Environment API](https://github.com/vitejs/vite/discussions/16358) 改进 SSR API。查看更多细节请点击链接。
:::

## 示例项目

Vite 提供对服务端渲染 (SSR) 的内置支持。[`create-vite-extra`](https://github.com/bluwy/create-vite-extra) 包含示例 SSR 设置，您可以用作本指南的参考：

- [Vanilla](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vanilla)
- [Vue](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vue)
- [React](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-react)
- [Preact](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-preact)
- [Svelte](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-svelte)
- [Solid](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-solid)

您也可以通过 [运行 `create-vite`](./index.md#scaffolding-your-first-vite-project) 在本地搭建这些项目，并在框架选项下选择 `Others > create-vite-extra`。

## 源码结构

典型的 SSR 应用将拥有以下源文件结构：

```
- index.html
- server.js # 主应用服务器
- src/
  - main.js          # 导出与环境无关（通用）的应用代码
  - entry-client.js  # 将应用挂载到 DOM 元素
  - entry-server.js  # 使用框架的 SSR API 渲染应用
```

`index.html` 需要引用 `entry-client.js` 并包含一个占位符，用于注入服务端渲染的标记：

```html [index.html]
<div id="app"><!--ssr-outlet--></div>
<script type="module" src="/src/entry-client.js"></script>
```

您可以使用任何喜欢的占位符代替 `<!--ssr-outlet-->`，只要它能被精确替换即可。

## 条件逻辑

如果您需要根据 SSR 与客户端执行条件逻辑，可以使用

```js twoslash
import 'vite/client'
// ---cut---
if (import.meta.env.SSR) {
  // ... 仅服务端逻辑
}
```

这在构建期间会被静态替换，因此它将允许对未使用的分支进行 tree-shaking。

## 设置开发服务器

在构建 SSR 应用时，您可能希望完全控制主服务器并将 Vite 与生产环境解耦。因此建议使用中间件模式使用 Vite。以下是使用 [express](https://expressjs.com/) 的示例：

```js{15-18} twoslash [server.js]
import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import { createServer as createViteServer } from 'vite'

async function createServer() {
  const app = express()

  // 以中间件模式创建 Vite 服务器，并将应用类型配置为
  // 'custom'，禁用 Vite 自身的 HTML 服务逻辑，以便父服务器
  // 可以接管控制
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // 使用 vite 的 connect 实例作为中间件。如果您使用自己的
  // express 路由 (express.Router())，应该使用 router.use
  // 当服务器重启时（例如用户修改了
  // vite.config.js 后），`vite.middlewares` 仍然是相同的
  // 引用（具有新的 Vite 内部栈和插件注入的
  // 中间件）。即使在重启后，以下内容也是有效的。
  app.use(vite.middlewares)

  app.use('*all', async (req, res) => {
    // 服务 index.html - 我们接下来处理这个
  })

  app.listen(5173)
}

createServer()
```

这里 `vite` 是 [ViteDevServer](./api-javascript#vitedevserver) 的实例。`vite.middlewares` 是一个 [Connect](https://github.com/senchalabs/connect) 实例，可用作任何兼容 connect 的 Node.js 框架中的中间件。

下一步是实现 `*` 处理程序以提供服务端渲染的 HTML：

```js twoslash [server.js]
// @noErrors
import fs from 'node:fs'
import path from 'node:path'

/** @type {import('express').Express} */
var app
/** @type {import('vite').ViteDevServer}  */
var vite

// ---cut---
app.use('*all', async (req, res, next) => {
  const url = req.originalUrl

  try {
    // 1. 读取 index.html
    let template = fs.readFileSync(
      path.resolve(import.meta.dirname, 'index.html'),
      'utf-8',
    )

    // 2. 应用 Vite HTML 转换。这会注入 Vite HMR 客户端，
    //    并应用来自 Vite 插件的 HTML 转换，例如来自
    //    @vitejs/plugin-react 的全局 preamble
    template = await vite.transformIndexHtml(url, template)

    // 3. 加载服务器入口。ssrLoadModule 自动转换
    //    ESM 源代码以便在 Node.js 中使用！不需要打包，
    //    并提供类似于 HMR 的高效失效机制。
    const { render } = await vite.ssrLoadModule('/src/entry-server.js')

    // 4. 渲染应用 HTML。这假设 entry-server.js 导出的
    //     `render` 函数调用适当的框架 SSR API，
    //    例如 ReactDOMServer.renderToString()
    const appHtml = await render(url)

    // 5. 将应用渲染的 HTML 注入到模板中。
    const html = template.replace(`<!--ssr-outlet-->`, () => appHtml)

    // 6. 发送渲染后的 HTML 回去。
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    // 如果捕获到错误，让 Vite 修复堆栈跟踪，以便它映射回
    // 您的实际源代码。
    vite.ssrFixStacktrace(e)
    next(e)
  }
})
```

`package.json` 中的 `dev` 脚本也应更改为使用服务器脚本：

```diff [package.json]
  "scripts": {
-   "dev": "vite"
+   "dev": "node server"
  }
```

## 生产构建

要发布 SSR 项目到生产环境，我们需要：

1. 正常生成客户端构建；
2. 生成 SSR 构建，可以通过 `import()` 直接加载，这样我们就不必经过 Vite 的 `ssrLoadModule`；

我们在 `package.json` 中的脚本将如下所示：

```json [package.json]
{
  "scripts": {
    "dev": "node server",
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --outDir dist/server --ssr src/entry-server.js"
  }
}
```

注意 `--ssr` 标志，它表示这是一个 SSR 构建。它还应该指定 SSR 入口。

然后，在 `server.js` 中我们需要通过检查 `process.env.NODE_ENV` 添加一些生产环境特定的逻辑：

- 不要读取根目录的 `index.html`，使用 `dist/client/index.html` 作为模板，因为它包含指向客户端构建的正确资源链接。

- 不要使用 `await vite.ssrLoadModule('/src/entry-server.js')`，使用 `import('./dist/server/entry-server.js')`（此文件是 SSR 构建的结果）。

- 将 `vite` 开发服务器的创建和所有使用移到仅开发的条件分支后面，然后添加静态文件服务中间件来服务 `dist/client` 中的文件。

参考 [示例项目](#example-projects) 获取可行的设置。

## 生成 Preload 指令

`vite build` 支持 `--ssrManifest` 标志，它将在构建输出目录中生成 `.vite/ssr-manifest.json`：

```diff
- "build:client": "vite build --outDir dist/client",
+ "build:client": "vite build --outDir dist/client --ssrManifest",
```

上述脚本现在将为客户端构建生成 `dist/client/.vite/ssr-manifest.json`（是的，SSR manifest 是从客户端构建生成的，因为我们希望将模块 ID 映射到客户端文件）。manifest 包含模块 ID 到其关联的 chunk 和资源文件的映射。

为了利用 manifest，框架需要提供一种方法来收集服务器渲染调用期间使用的组件的模块 ID。

`@vitejs/plugin-vue` 开箱即用地支持此功能，并自动将使用的组件模块 ID 注册到关联的 Vue SSR 上下文：

```js [src/entry-server.js]
const ctx = {}
const html = await vueServerRenderer.renderToString(app, ctx)
// ctx.modules 现在是一个在渲染期间使用的模块 ID 的 Set
```

在 `server.js` 的生产分支中，我们需要读取 manifest 并将其传递给 `src/entry-server.js` 导出的 `render` 函数。这将为我们提供足够的信息来渲染异步路由使用的文件的 preload 指令！参见 [演示源码](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/src/entry-server.js) 获取完整示例。您也可以将此信息用于 [103 Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103)。

## 预渲染 / SSG

如果路由和某些路由所需的数据是预先知道的，我们可以使用与生产 SSR 相同的逻辑将这些路由预渲染为静态 HTML。这也可以被视为一种静态站点生成 (SSG) 形式。参见 [演示预渲染脚本](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/prerender.js) 获取工作示例。

## SSR 外部化

默认情况下，在运行 SSR 时，依赖项会从 Vite 的 SSR 转换模块系统中“外部化”。这加快了开发和构建速度。

如果依赖项需要由 Vite 的管道转换，例如，因为其中使用了未转译的 Vite 功能，可以将它们添加到 [`ssr.noExternal`](../config/ssr-options.md#ssr-noexternal)。

对于链接的依赖项，默认情况下不会外部化，以利用 Vite 的 HMR。如果这不是想要的，例如，为了测试依赖项就好像它们没有链接一样，您可以将其添加到 [`ssr.external`](../config/ssr-options.md#ssr-external)。

:::warning 使用别名
如果您配置了将一个包重定向到另一个包的别名，您可能希望别名实际的 `node_modules` 包，以便使其适用于 SSR 外部化的依赖项。[Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) 和 [pnpm](https://pnpm.io/aliases/) 都支持通过 `npm:` 前缀进行别名。
:::

## 特定于 SSR 的插件逻辑

某些框架（如 Vue 或 Svelte）会根据客户端与 SSR 将组件编译为不同的格式。为了支持条件转换，Vite 会在以下插件钩子的 `options` 对象中传递一个额外的 `ssr` 属性：

- `resolveId`
- `load`
- `transform`

**示例：**

```js twoslash
/** @type {() => import('vite').Plugin} */
// ---cut---
export function mySSRPlugin() {
  return {
    name: 'my-ssr',
    transform(code, id, options) {
      if (options?.ssr) {
        // 执行特定于 SSR 的转换...
      }
    },
  }
}
```

`load` 和 `transform` 中的 `options` 对象是可选的，Rollup 目前尚未使用该对象，但将来可能会使用额外的元数据扩展这些钩子。

:::tip 注意
在 Vite 2.7 之前，这是通过位置 `ssr` 参数而不是使用 `options` 对象传递给插件钩子的。所有主要框架和插件都已更新，但你可能会找到使用旧 API 的过时文章。
:::

## SSR 目标

SSR 构建的默认目标是 node 环境，但你也可以在 Web Worker 中运行服务器。每个平台的包入口解析方式不同。你可以使用 `ssr.target` 设置为 `'webworker'` 将目标配置为 Web Worker。

## SSR 打包

在某些情况下（如 `webworker` 运行时），你可能希望将 SSR 构建打包成单个 JavaScript 文件。你可以通过将 `ssr.noExternal` 设置为 `true` 来启用此行为。这将执行以下两项操作：

- 将所有依赖项视为 `noExternal`
- 如果导入了任何 Node.js 内置模块则抛出错误

## SSR 解析条件

默认情况下，包入口解析将使用 [`resolve.conditions`](../config/shared-options.md#resolve-conditions) 中设置的条件进行 SSR 构建。你可以使用 [`ssr.resolve.conditions`](../config/ssr-options.md#ssr-resolve-conditions) 和 [`ssr.resolve.externalConditions`](../config/ssr-options.md#ssr-resolve-externalconditions) 来自定义此行为。

## Vite CLI

CLI 命令 `$ vite dev` 和 `$ vite preview` 也可用于 SSR 应用。你可以使用 [`configureServer`](/guide/api-plugin#configureserver) 将 SSR 中间件添加到开发服务器，并使用 [`configurePreviewServer`](/guide/api-plugin#configurepreviewserver) 添加到预览服务器。

:::tip 注意
使用 post 钩子，以便你的 SSR 中间件在 Vite 的中间件*之后*运行。
:::
