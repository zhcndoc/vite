# Hooks 中的 `this.environment`

::: tip 反馈
请在 [Environment API 反馈讨论](https://github.com/vitejs/vite/discussions/16358) 给我们反馈
:::

在 Vite 6 之前，只有两个可用的环境：`client` 和 `ssr`。在 `resolveId`、`load` 和 `transform` 中的单个 `options.ssr` 插件钩子参数，允许插件作者在插件钩子中处理模块时区分这两个环境。在 Vite 6 中，Vite 应用程序可以根据需要定义任意数量的命名环境。我们在插件上下文中引入了 `this.environment`，以便在钩子中与当前模块的环境进行交互。

影响范围：`Vite 插件作者`

::: warning 未来弃用
`this.environment` 是在 `v6.0` 中引入的。`options.ssr` 的弃用计划在未来的主版本中进行。届时我们将开始建议迁移你的插件以使用新的 API。为了识别你的使用情况，请在你的 vite 配置中将 `future.removePluginHookSsrArgument` 设置为 `"warn"`。
:::

## 动机

`this.environment` 不仅允许插件钩子实现知道当前环境名称，它还提供了访问环境配置选项、模块图信息和转换管道（`environment.config`、`environment.moduleGraph`、`environment.transformRequest()`）的途径。在上下文中提供环境实例允许插件作者避免对整个开发服务器的依赖（通常通过 `configureServer` 钩子在启动时缓存）。

## 迁移指南

对于现有插件进行快速迁移，请在 `resolveId`、`load` 和 `transform` 钩子中将 `options.ssr` 参数替换为 `this.environment.config.consumer === 'server'`：

```ts
import { Plugin } from 'vite'

export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    resolveId(id, importer, options) {
      const isSSR = options.ssr // [!code --]
      const isSSR = this.environment.config.consumer === 'server' // [!code ++]

      if (isSSR) {
        // SSR 特定逻辑
      } else {
        // 客户端特定逻辑
      }
    },
  }
}
```

为了更稳健的长期实现，插件钩子应该使用细粒度的环境选项来处理 [多个环境](/guide/api-environment-plugins.html#accessing-the-current-environment-in-hooks)，而不是依赖于环境名称。
