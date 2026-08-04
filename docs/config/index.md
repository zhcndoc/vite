---
title: 配置 Vite
---

# 配置 Vite

当从命令行运行 `vite` 时，Vite 会自动尝试解析 [项目根目录](/guide/#index-html-and-project-root) 中名为 `vite.config.js` 的配置文件（也支持其他 JS 和 TS 扩展名）。

最基础的配置文件看起来是这样的：

```js [vite.config.js]
export default {
  // 配置选项
}
```

注意，要在配置文件中使用 ES 模块语法，该文件应被 Node.js 识别为 ESM，例如使用 `.mjs` 扩展名，或在最近的 `package.json` 中将 `"type": "module"`。

你也可以通过 `--config` CLI 选项显式指定要使用的配置文件（相对于 `cwd` 解析）：

```bash
vite --config my-config.js
```

<ScrimbaLink href="https://scrimba.com/intro-to-vite-c03p6pbbdq/~05jg?via=vite" title="配置 Vite">在 Scrimba 上观看互动课程</ScrimbaLink>

::: tip 配置加载
默认情况下，Vite 使用 [Rolldown](https://rolldown.rs/) 将配置打包到临时文件中并加载。如果你使用的环境支持 TypeScript（例如 Node 22.18+），或者你只编写普通 JavaScript，则可以指定 `--configLoader native`，以使用环境的原生运行时加载配置文件。计划在未来的主要版本中将 `configLoader: 'native'` 设为默认值。
:::

## 配置智能提示

由于 Vite 附带了 TypeScript 类型定义，你可以利用 IDE 的智能提示功能配合 jsdoc 类型提示：

```js
/** @type {import('vite').UserConfig} */
export default {
  // ...
}
```

或者，你可以使用 `defineConfig` 辅助函数，它应该无需 jsdoc 注释即可提供智能提示：

```js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

Vite 也支持 TypeScript 配置文件。你可以使用 `vite.config.ts` 配合上面的 `defineConfig` 辅助函数，或者使用 `satisfies` 操作符：

```ts
import type { UserConfig } from 'vite'

export default {
  // ...
} satisfies UserConfig
```

## 条件配置

如果配置需要根据命令（`serve` 或 `build`）、使用的 [模式](/guide/env-and-mode#modes)、是否是 SSR 构建（`isSsrBuild`）或是否正在预览构建（`isPreview`）来有条件地确定选项，它可以导出一个函数：

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return {
      // 开发环境特定配置
    }
  } else {
    // 命令 === 'build'
    return {
      // 构建特定配置
    }
  }
})
```

重要的是要注意，在 Vite 的 API 中，开发期间 `command` 值为 `serve`（在 cli 中 [`vite`](/guide/cli#vite)、`vite dev` 和 `vite serve` 是别名），而为生产构建时值为 `build`（[`vite build`](/guide/cli#vite-build)）。

`isSsrBuild` 和 `isPreview` 是额外的可选标志，用于分别区分 `build` 和 `serve` 命令的种类。一些加载 Vite 配置的工具可能不支持这些标志，而是传递 `undefined`。因此，建议针对 `true` 和 `false` 使用显式比较。

## 异步配置

如果配置需要调用异步函数，它可以导出一个异步函数。并且这个异步函数也可以通过 `defineConfig` 传递以获得更好的智能提示支持：

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // vite 配置
  }
})
```

## 在配置中使用环境变量

在配置本身被评估时可用的环境变量仅是当前进程环境中已存在的那些变量（`process.env`）。Vite 故意推迟加载任何 `.env*` 文件，直到用户配置被解析*之后*，因为要加载的文件集取决于配置选项，如 [`root`](/guide/#index-html-and-project-root) 和 [`envDir`](/config/shared-options.md#envdir)，以及最终的 `mode`。

这意味着：在 `.env`、`.env.local`、`.env.[mode]` 或 `.env.[mode].local` 中定义的变量在你的 `vite.config.*` 运行时**不会**自动注入到 `process.env` 中。它们*会*在稍后自动加载，并通过 `import.meta.env` 暴露给应用代码（带有默认的 `VITE_` 前缀过滤），正如 [环境变量和模式](/guide/env-and-mode.html) 中所记录的那样。因此，如果你只需要将 `.env*` 文件中的值传递给应用，你不需要在配置中调用任何内容。

但是，如果 `.env*` 文件中的值必须影响配置本身（例如设置 `server.port`、有条件地启用插件或计算 `define` 替换），你可以使用导出的 [`loadEnv`](/guide/api-javascript.html#loadenv) 辅助函数手动加载它们。

```js twoslash
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // 基于当前工作目录中的 `mode` 加载 env 文件。
  // 将第三个参数设置为 '' 以加载所有 env，无论
  // `VITE_` 前缀如何。
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      // 提供一个源自环境变量的显式应用级常量。
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    // 示例：使用环境变量有条件地设置开发服务器端口。
    server: {
      port: env.APP_PORT ? Number(env.APP_PORT) : 5173,
    },
  }
})
```

## 在 VS Code 中调试配置文件

为了获得最可靠的调试体验，请在启动 Vite 时使用原生配置加载器：

```bash
vite --configLoader native
```

原生加载器会直接执行原始配置文件，因此配置文件中的断点以及插件钩子（如 `transform`）中的断点都会映射到原始源代码。它要求运行时支持配置文件所使用的语法，例如 TypeScript 文件需要 Node.js 22.18+。

使用 `--configLoader bundle` 时（目前的默认选项，不过计划在未来的主版本中将 `native` 设为默认选项），Vite 会生成内联 source map，并在加载配置之前将打包后的配置写入 `node_modules/.vite-temp`。如果需要使用打包加载器，请在 `.vscode/settings.json` 中为 JavaScript 调试终端添加临时目录：

```json
{
  "debug.javascript.terminalOptions": {
    "resolveSourceMapLocations": [
      "${workspaceFolder}/**",
      "!**/node_modules/**",
      "**/node_modules/.vite-temp/**"
    ]
  }
}
```

此设置仅适用于 JavaScript 调试终端，不会影响从“运行和调试”视图启动的启动配置。若要让“运行和调试”视图支持此功能，请在 `.vscode/launch.json` 中添加临时目录：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Vite",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["exec", "vite", "--configLoader", "bundle"],
      "console": "integratedTerminal",
      "sourceMaps": true,
      "resolveSourceMapLocations": [
        "${workspaceFolder}/**",
        "!**/node_modules/**",
        "**/node_modules/.vite-temp/**"
      ]
    }
  ]
}
```
