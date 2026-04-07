# 插件的环境 API

:::info 候选发布版本
环境 API 通常处于候选发布版本阶段。我们将在主要版本之间保持 API 的稳定性，以便生态系统可以进行实验并在此基础上构建。但是，请注意 [某些特定 API](/changes/#considering) 仍被视为实验性的。

我们计划在未来的主要版本中稳定这些新 API（可能会有破坏性变更），一旦下游项目有时间实验新功能并验证它们。

资源：

- [反馈讨论](https://github.com/vitejs/vite/discussions/16358) 我们在此收集关于新 API 的反馈。
- [环境 API PR](https://github.com/vitejs/vite/pull/16471) 新 API 在此实现和审查。

请与我们分享你的反馈。
:::

## 在 Hook 中访问当前环境

鉴于直到 Vite 6 只有两个环境（`client` 和 `ssr`），一个 `ssr` 布尔值足以在 Vite API 中识别当前环境。插件 Hook 在最后一个选项参数中接收一个 `ssr` 布尔值，并且几个 API 期望一个可选的最后 `ssr` 参数以正确地将模块关联到正确的环境（例如 `server.moduleGraph.getModuleByUrl(url, { ssr })`）。

随着可配置环境的出现，我们现在有一种统一的方式来在插件中访问它们的选项和实例。插件 Hook 现在在其上下文中暴露 `this.environment`，并且以前期望 `ssr` 布尔值的 API 现在被限定到适当的环境（例如 `environment.moduleGraph.getModuleByUrl(url)`）。

Vite 服务器有一个共享的插件管道，但当处理模块时，它总是在给定环境的上下文中完成。`environment` 实例在插件上下文中可用。

插件可以使用 `environment` 实例来根据环境的配置（可以使用 `environment.config` 访问）改变模块的处理方式。

```ts
  transform(code, id) {
    console.log(this.environment.config.resolve.conditions)
  }
```

## 使用 Hook 注册新环境

插件可以在 `config` Hook 中添加新环境。例如，[RSC 支持](/plugins/#vitejs-plugin-rsc) 使用一个额外的环境来拥有一个带有 `react-server` 条件的独立模块图：

```ts
  config(config: UserConfig) {
    return {
      environments: {
        rsc: {
          resolve: {
            conditions: ['react-server', ...defaultServerConditions],
          },
        },
      },
    }
  }
```

一个空对象足以注册环境，使用根级别环境配置的默认值。

## 使用 Hook 配置环境

虽然 `config` Hook 正在运行，但完整的环境列表尚未知，并且环境可能受到根级别环境配置的默认值或通过 `config.environments` 记录显式影响。
插件应该使用 `config` Hook 设置默认值。要配置每个环境，他们可以使用新的 `configEnvironment` Hook。此 Hook 为每个环境调用，包含其部分解析的配置，包括最终默认值的解析。

```ts
  configEnvironment(name: string, options: EnvironmentOptions) {
    // 向 rsc 环境添加 "workerd" 条件
    if (name === 'rsc') {
      return {
        resolve: {
          conditions: ['workerd'],
        },
      }
    }
  }
```

## `hotUpdate` Hook

- **类型：** `(this: { environment: DevEnvironment }, options: HotUpdateOptions) => Array<EnvironmentModuleNode> | void | Promise<Array<EnvironmentModuleNode> | void>`
- **种类：** `async`, `sequential`
- **另见：** [HMR API](./api-hmr)

`hotUpdate` Hook 允许插件为给定环境执行自定义 HMR 更新处理。当文件更改时，HMR 算法根据 `server.environments` 中的顺序依次为每个环境运行，因此 `hotUpdate` Hook 将被调用多次。该 Hook 接收一个具有以下签名的上下文对象：

```ts
interface HotUpdateOptions {
  type: 'create' | 'update' | 'delete'
  file: string
  timestamp: number
  modules: Array<EnvironmentModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

- `this.environment` 是当前正在处理文件更新的模块执行环境。

- `modules` 是此环境中受更改文件影响的模块数组。它是一个数组，因为单个文件可能映射到多个服务模块（例如 Vue SFC）。

- `read` 是一个异步读取函数，返回文件的内容。提供此函数是因为，在某些系统上，文件更改回调可能在编辑器完成更新文件之前触发得太快，直接的 `fs.readFile` 将返回空内容。传入的读取函数标准化了此行为。

该钩子可以选择：

- 过滤和缩小受影响的模块列表，以便 HMR 更准确。

- 返回一个空数组并执行完全重载：

  ```js
  hotUpdate({ modules, timestamp }) {
    if (this.environment.name !== 'client')
      return

    // 手动使模块失效
    const invalidatedModules = new Set()
    for (const mod of modules) {
      this.environment.moduleGraph.invalidateModule(
        mod,
        invalidatedModules,
        timestamp,
        true
      )
    }
    this.environment.hot.send({ type: 'full-reload' })
    return []
  }
  ```

- 返回一个空数组并通过向客户端发送自定义事件来执行完整的自定义 HMR 处理：

  ```js
  hotUpdate() {
    if (this.environment.name !== 'client')
      return

    this.environment.hot.send({
      type: 'custom',
      event: 'special-update',
      data: {}
    })
    return []
  }
  ```

  客户端代码应使用 [HMR API](./api-hmr) 注册相应的处理程序（这可以由同一插件的 `transform` Hook 注入）：

  ```js
  if (import.meta.hot) {
    import.meta.hot.on('special-update', (data) => {
      // 执行自定义更新
    })
  }
  ```

## 插件中的每环境状态

鉴于相同的插件实例用于不同的环境，插件状态需要使用 `this.environment` 作为键。这是生态系统已经使用的相同模式，使用 `ssr` 布尔值作为键来保持关于模块的状态，以避免混合客户端和 ssr 模块状态。可以使用 `Map<Environment, State>` 来分别保持每个环境的状态。请注意，为了向后兼容，`buildStart` 和 `buildEnd` 仅在没有 `perEnvironmentStartEndDuringDev: true` 标志的情况下为客户端环境调用。`watchChange` 和 `perEnvironmentWatchChangeDuringDev: true` 标志也是如此。

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = new Map<Environment, { count: number }>()
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state.set(this.environment, { count: 0 })
    },
    transform(id) {
      state.get(this.environment).count++
    },
    buildEnd() {
      console.log(this.environment.name, state.get(this.environment).count)
    }
  }
}
```

## 每环境插件

插件可以使用 `applyToEnvironment` 函数定义它应该应用于哪些环境。

```js
const UnoCssPlugin = () => {
  // 共享的全局状态
  return {
    buildStart() {
      // 使用 WeakMap<Environment,Data> 初始化每环境状态
      // 使用 this.environment
    },
    configureServer() {
      // 正常使用全局 Hook
    },
    applyToEnvironment(environment) {
      // 如果此插件应在此环境中激活，则返回 true，
      // 或者返回一个新插件来替换它。
      // 如果未使用此 Hook，插件将在所有环境中激活
    },
    resolveId(id, importer) {
      // 仅针对此插件应用的环境调用
    },
  }
}
```

如果插件不了解环境并且具有未基于当前环境键控的状态，`applyToEnvironment` Hook 允许轻松地使其成为每环境的。

```js
import { nonShareablePlugin } from 'non-shareable-plugin'

export default defineConfig({
  plugins: [
    {
      name: 'per-environment-plugin',
      applyToEnvironment(environment) {
        return nonShareablePlugin({ outputName: environment.name })
      },
    },
  ],
})
```

Vite 导出一个 `perEnvironmentPlugin` 辅助函数来简化这些不需要其他 Hook 的情况：

```js
import { nonShareablePlugin } from 'non-shareable-plugin'

export default defineConfig({
  plugins: [
    perEnvironmentPlugin('per-environment-plugin', (environment) =>
      nonShareablePlugin({ outputName: environment.name }),
    ),
  ],
})
```

`applyToEnvironment` Hook 在配置时调用，目前在 `configResolved` 之后，因为生态系统中的项目在其中修改插件。环境插件解析可能会在未来移到 `configResolved` 之前。

## 应用 - 插件通信

`environment.hot` 允许插件与给定环境的应用端代码进行通信。这相当于 [客户端 - 服务器通信功能](/guide/api-plugin#client-server-communication)，但支持客户端环境以外的环境。

:::warning 注意

请注意，此功能仅适用于支持 HMR 的环境。

:::

### 管理应用实例

请注意，同一环境中可能运行多个应用实例。例如，如果你在浏览器中打开多个标签页，每个标签页都是一个独立的应用实例，并且与服务器有独立的连接。

当建立新连接时，环境的 `hot` 实例上会发出 `vite:client:connect` 事件。当连接关闭时，会发出 `vite:client:disconnect` 事件。

每个事件处理程序接收 `NormalizedHotChannelClient` 作为第二个参数。客户端是一个具有 `send` 方法的对象，可用于向该特定应用实例发送消息。对于同一连接，客户端引用始终相同，因此你可以保留它以跟踪连接。

### 示例用法

插件端：

```js
configureServer(server) {
  server.environments.ssr.hot.on('my:greetings', (data, client) => {
    // 对数据做一些处理，
    // 并可选择向该应用实例发送响应
    client.send('my:foo:reply', `Hello from server! You said: ${data}`)
  })

  // 向所有应用实例广播消息
  server.environments.ssr.hot.send('my:foo', 'Hello from server!')
}
```

应用端与客户端 - 服务器通信功能相同。你可以使用 `import.meta.hot` 对象向插件发送消息。

## 构建钩子中的环境

与开发期间一样，插件钩子在构建期间也会接收环境实例，取代了 `ssr` 布尔值。
这也适用于 `renderChunk`、`generateBundle` 和其他仅构建钩子。

## 构建期间共享插件

在 Vite 6 之前，插件流水线在开发和构建期间的工作方式不同：

- **开发期间：** 插件是共享的
- **构建期间：** 插件针对每个环境是隔离的（在不同的进程中：`vite build` 然后 `vite build --ssr`）。

这迫使框架通过写入文件系统的 manifest 文件在 `client` 构建和 `ssr` 构建之间共享状态。在 Vite 6 中，我们现在在单个进程中构建所有环境，因此插件流水线和环境间通信的方式可以与开发保持一致。

在未来的主要版本中，我们可以实现完全一致：

- **开发和构建期间：** 插件是共享的，带有 [按环境过滤](#per-environment-plugins)

构建期间还将共享一个 `ResolvedConfig` 实例，允许在整个应用构建过程级别进行缓存，就像我们在开发期间使用 `WeakMap<ResolvedConfig, CachedData>` 所做的那样。

对于 Vite 6，我们需要采取较小的步骤以保持向后兼容性。生态系统插件目前使用 `config.build` 而不是 `environment.config.build` 来访问配置，因此我们默认需要为每个环境创建一个新的 `ResolvedConfig`。项目可以通过将 `builder.sharedConfigBuild` 设置为 `true` 来选择加入共享完整配置和插件流水线。

此选项最初仅适用于一小部分项目，因此插件作者可以通过将 `sharedDuringBuild` 标志设置为 `true` 来选择加入特定插件的共享。这使得常规插件可以轻松共享状态：

```js
function myPlugin() {
  // 在开发和构建期间在所有环境之间共享状态
  const sharedState = ...
  return {
    name: 'shared-plugin',
    transform(code, id) { ... },

    // 选择加入所有环境的单个实例
    sharedDuringBuild: true,
  }
}
```
