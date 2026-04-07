# 迁移至每环境 API

::: tip 反馈
在 [环境 API 反馈讨论](https://github.com/vitejs/vite/discussions/16358) 给我们反馈
:::

来自 `ViteDevServer` 的多个与模块图和模块转换相关的 API 已移至 `DevEnvironment` 实例。

影响范围：`Vite 插件作者`

::: warning 未来弃用
`Environment` 实例首次在 `v6.0` 中引入。`server.moduleGraph` 和其他现在位于环境中的方法的弃用计划在未来的主版本中进行。我们尚不建议迁移离开服务器方法。为了识别你的使用情况，请在 vite 配置中设置这些。

```ts
future: {
  removeServerModuleGraph: 'warn',
  removeServerReloadModule: 'warn',
  removeServerPluginContainer: 'warn',
  removeServerHot: 'warn',
  removeServerTransformRequest: 'warn',
  removeServerWarmupRequest: 'warn',
}
```

:::

## 动机

在 Vite v5 及之前，单个 Vite 开发服务器始终有两个环境（`client` 和 `ssr`）。`server.moduleGraph` 混合了来自这两个环境的模块。节点通过 `clientImportedModules` 和 `ssrImportedModules` 列表连接（但每个节点维护一个单独的 `importers` 列表）。转换后的模块由一个 `id` 和一个 `ssr` 布尔值表示。这个布尔值需要传递给 API，例如 `server.moduleGraph.getModuleByUrl(url, ssr)` 和 `server.transformRequest(url, { ssr })`。

在 Vite v6 中，现在可以创建任意数量的自定义环境（`client`、`ssr`、`edge` 等）。单个 `ssr` 布尔值已不再足够。我们没有将 API 更改为 `server.transformRequest(url, { environment })` 的形式，而是将这些方法移至环境实例，允许它们在无需 Vite 开发服务器的情况下被调用。

## 迁移指南

- `server.moduleGraph` -> [`environment.moduleGraph`](/guide/api-environment-instances#separate-module-graphs)
- `server.reloadModule(module)` -> `environment.reloadModule(module)`
- `server.pluginContainer` -> `environment.pluginContainer`
- `server.transformRequest(url, ssr)` -> `environment.transformRequest(url)`
- `server.warmupRequest(url, ssr)` -> `environment.warmupRequest(url)`
- `server.hot` -> `server.client.environment.hot`
