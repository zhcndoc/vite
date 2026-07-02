# 依赖预构建

当你第一次运行 `vite` 时，Vite 会在本地加载你的站点之前预构建你的项目依赖。默认情况下，这是自动且透明地完成的。

## 原因

这是 Vite 在执行我们所谓的“依赖预构建”。此过程有两个目的：

1. **CommonJS 和 UMD 兼容性：** 在开发期间，Vite 将所有代码作为原生 ESM 提供服务。因此，Vite 必须先将作为 CommonJS 或 UMD 发布的依赖转换为 ESM。

   转换 CommonJS 依赖时，Vite 会执行智能导入分析，以便即使导出是动态分配的（例如 React），对 CommonJS 模块的命名导入也能按预期工作：

   ```js
   // 符合预期
   import React, { useState } from 'react'
   ```

2. **性能：** Vite 将具有许多内部模块的 ESM 依赖转换为单个模块，以提高后续页面加载性能。

   一些包会将其 ES 模块构建产物作为许多相互导入的独立文件发布。例如，[`lodash-es` 有超过 600 个内部模块](https://unpkg.com/browse/lodash-es/)! 当我们执行 `import { debounce } from 'lodash-es'` 时，浏览器会同时发起 600 多个 HTTP 请求！尽管服务器处理这些请求没有问题，但大量请求会在浏览器端造成网络拥塞，导致页面加载明显变慢。

   通过将 `lodash-es` 预构建为单个模块，我们现在只需要一个 HTTP 请求！

::: tip 注意
依赖预构建仅适用于开发模式。
:::

## 自动依赖发现

如果未找到现有缓存，Vite 将遍历你的源代码并自动发现依赖导入（即期望从 `node_modules` 中解析的“裸导入”），并将这些找到的导入作为预打包的入口点。预打包由 [Rolldown](https://rolldown.rs/) 执行，因此通常非常快。

服务器启动后，如果遇到缓存中尚未存在的新依赖导入，Vite 将重新运行依赖构建过程，并在需要时重新加载页面。

## Monorepo 和链接依赖

在 monorepo 设置中，依赖可能是来自同一仓库的链接包。Vite 会自动检测未从 `node_modules` 解析的依赖，并将链接依赖视为源代码。它不会尝试构建链接依赖，而是分析链接依赖的依赖列表。

但是，这要求链接依赖导出为 ESM。如果不是，你可以在配置中将依赖添加到 [`optimizeDeps.include`](/config/dep-optimization-options.md#optimizedeps-include)。

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig({
  optimizeDeps: {
    include: ['linked-dep'],
  },
})
```

当更改链接依赖时，使用 `--force` 命令行选项重启开发服务器以使更改生效。

## Custom Behavior

The default dependency discovery heuristics may not always be ideal. In cases where you want to explicitly include/exclude dependencies in the dependency list, use the [`optimizeDeps` configuration option](/config/dep-optimization-options.md).

A typical use case for `optimizeDeps.include` or `optimizeDeps.exclude` is when you have an import that cannot be directly discovered in source code. For example, the import may be the result of a plugin transform. This means Vite cannot discover that import during the initial scan — it can only discover it after the file is requested and transformed by the browser. This will cause the server to rebuild immediately after startup.

Both `include` and `exclude` can be used to handle this situation. If the dependency is large (with many internal modules) or is CommonJS, you should include it; if the dependency is small and already valid ESM, you can exclude it and let the browser load it directly.

You can also use the [`optimizeDeps.rolldownOptions` option](/config/dep-optimization-options.md#optimizedeps-rolldownoptions) to further customize Rolldown. For example, add a Rolldown plugin to handle special files in dependencies or change the [build `target`](https://rolldown.rs/reference/InputOptions.transform#target).

## 缓存

### 文件系统缓存

Vite 将预构建的依赖缓存到 `node_modules/.vite` 中。它根据以下几个来源确定是否需要重新运行预构建步骤：

- 包管理器锁文件内容，例如 `package-lock.json`、`yarn.lock`、`pnpm-lock.yaml` 或 `bun.lock`。
- Patches 文件夹修改时间。
- `vite.config.js` 中的相关字段（如果存在）。
- `NODE_ENV` 值。

只有当上述之一发生变化时，才需要重新运行预构建步骤。

如果出于某种原因你想强制 Vite 重新构建依赖，你可以使用 `--force` 命令行选项启动开发服务器，或者手动删除 `node_modules/.vite` 缓存目录。

### 浏览器缓存

解析后的依赖请求使用 HTTP 头 `max-age=31536000,immutable` 进行强缓存，以提高开发期间的页面重载性能。一旦缓存，这些请求将不再命中开发服务器。如果安装了不同版本（如包管理器锁文件中反映的那样），它们会通过附加的版本查询自动失效。如果你想通过本地编辑来调试你的依赖，你可以：

1. 通过浏览器开发者工具的网络标签页临时禁用缓存。
2. 使用 `--force` 标志重启 Vite 开发服务器以重新构建依赖。
3. 重新加载页面。
