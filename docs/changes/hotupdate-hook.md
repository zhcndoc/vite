# HMR `hotUpdate` 插件钩子

::: tip 反馈
在 [Environment API 反馈讨论](https://github.com/vitejs/vite/discussions/16358) 给我们反馈
:::

我们计划弃用 `handleHotUpdate` 插件钩子，转而使用 [`hotUpdate` 钩子](/guide/api-environment#the-hotupdate-hook)，以便感知 [Environment API](/guide/api-environment.md)，并使用 `create` 和 `delete` 处理额外的监听事件。

影响范围：`Vite 插件作者`

::: warning 未来弃用警告
`hotUpdate` 首次在 `v6.0` 中引入。计划在未来的一个大版本中弃用 `handleHotUpdate`。我们尚不建议迁移离开 `handleHotUpdate`。如果你想实验并给我们反馈，你可以在 vite 配置中将 `future.removePluginHookHandleHotUpdate` 设置为 `"warn"`。
:::

## 动机

[`handleHotUpdate` 钩子](/guide/api-plugin.md#handlehotupdate) 允许执行自定义 HMR 更新处理。待更新的模块列表通过 `HmrContext` 传递。

```ts
interface HmrContext {
  file: string
  timestamp: number
  modules: Array<ModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

此钩子对所有环境只调用一次，传递的模块仅包含来自 Client 和 SSR 环境的混合信息。一旦框架转向自定义环境，就需要一个为每个环境调用的新钩子。

新的 `hotUpdate` 钩子工作方式与 `handleHotUpdate` 相同，但它会为每个环境调用，并接收一个新的 `HotUpdateOptions` 实例：

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

当前开发环境可以像在其他插件钩子中一样通过 `this.environment` 访问。`modules` 列表现在将仅包含当前环境的模块节点。每个环境更新可以定义不同的更新策略。

此钩子现在也会为额外的监听事件调用，而不仅仅是 `'update'`。使用 `type` 来区分它们。

## 迁移指南

过滤并缩小受影响的模块列表，以便 HMR 更准确。

```js
handleHotUpdate({ modules }) {
  return modules.filter(condition)
}

// 迁移至：

hotUpdate({ modules }) {
  return modules.filter(condition)
}
```

返回一个空数组并执行完全重载：

```js
handleHotUpdate({ server, modules, timestamp }) {
  // 手动使模块失效
  const invalidatedModules = new Set()
  for (const mod of modules) {
    server.moduleGraph.invalidateModule(
      mod,
      invalidatedModules,
      timestamp,
      true
    )
  }
  server.ws.send({ type: 'full-reload' })
  return []
}

// 迁移至：

hotUpdate({ modules, timestamp }) {
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

返回一个空数组并通过向客户端发送自定义事件来执行完整的自定义 HMR 处理：

```js
handleHotUpdate({ server }) {
  server.ws.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}

// 迁移至...

hotUpdate() {
  this.environment.hot.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}
```
