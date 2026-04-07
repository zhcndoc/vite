# 构建期间共享插件

::: tip 反馈
在 [Environment API 反馈讨论](https://github.com/vitejs/vite/discussions/16358) 给我们反馈
:::

参见 [构建期间共享插件](/guide/api-environment-plugins.md#shared-plugins-during-build)。

影响范围：`Vite 插件作者`

::: warning 未来默认值变更
`builder.sharedConfigBuild` 首次在 `v6.0` 中引入。你可以将其设置为 true 来检查你的插件在共享配置下的工作情况。一旦插件生态系统准备就绪，我们正在寻求关于在未来主要版本中更改默认值的反馈。
:::

## 动机

对齐开发和构建插件管道。

## 迁移指南

为了能够在不同环境之间共享插件，插件状态必须以当前环境为键。以下形式的插件将统计所有环境中转换的模块数量。

```js
function CountTransformedModulesPlugin() {
  let transformedModules
  return {
    name: 'count-transformed-modules',
    buildStart() {
      transformedModules = 0
    },
    transform(id) {
      transformedModules++
    },
    buildEnd() {
      console.log(transformedModules)
    },
  }
}
```

如果我们改为想要统计每个环境中转换的模块数量，我们需要维护一个 map：

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = new Map<Environment, { count: number }>()
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state.set(this.environment, { count: 0 })
    }
    transform(id) {
      state.get(this.environment).count++
    },
    buildEnd() {
      console.log(this.environment.name, state.get(this.environment).count)
    }
  }
}
```

为了简化此模式，Vite 导出了一个 `perEnvironmentState` 辅助函数：

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = perEnvironmentState<{ count: number }>(() => ({ count: 0 }))
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state(this).count = 0
    }
    transform(id) {
      state(this).count++
    },
    buildEnd() {
      console.log(this.environment.name, state(this).count)
    }
  }
}
```
