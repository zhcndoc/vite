# 使用 `ModuleRunner` API 进行 SSR

::: tip 反馈
在 [Environment API 反馈讨论](https://github.com/vitejs/vite/discussions/16358) 给我们反馈
:::

`server.ssrLoadModule` 已被从 [模块运行器](/guide/api-environment#modulerunner) 导入所取代。

影响范围：`Vite 插件作者`

::: warning 未来弃用
`ModuleRunner` 首次在 `v6.0` 中引入。`server.ssrLoadModule` 的弃用计划在未来的主版本中进行。要识别你的使用情况，请在 vite 配置中将 `future.removeSsrLoadModule` 设置为 `"warn"`。
:::

## 动机

`server.ssrLoadModule(url)` 仅允许在 `ssr` 环境中导入模块，并且只能在与 Vite 开发服务器相同的进程中执行模块。对于具有自定义环境的应用，每个环境都关联一个 `ModuleRunner`，它可能在单独的线程或进程中运行。要导入模块，我们现在有 `moduleRunner.import(url)`。

## 迁移指南

查看 [框架的环境 API 指南](../guide/api-environment-frameworks.md)。

使用模块运行器 API 时，不必调用 `server.ssrFixStacktrace` 和 `server.ssrRewriteStacktrace`。除非 `sourcemapInterceptor` 设置为 `false`，否则堆栈跟踪将会被更新。
