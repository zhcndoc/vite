# 插件

:::tip 注意
Vite 旨在为常见的 Web 开发模式提供开箱即用的支持。在搜索 Vite 或兼容的 Rollup 插件之前，请查看 [功能指南](../guide/features.md)。许多在 Rollup 项目中需要插件的情况，在 Vite 中已经涵盖了。
:::

查看 [使用插件](../guide/using-plugins) 以了解如何使用插件的信息。

## 官方插件

### [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)

提供 Vue 3 单文件组件支持。

### [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)

提供 Vue 3 JSX 支持（通过 [专用的 Babel 转换](https://github.com/vuejs/babel-plugin-jsx)）。

### [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)

通过 [Oxc Transformer](https://oxc.rs/docs/guide/usage/transformer) 提供 React 快速刷新支持。

### [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react-swc)

在开发期间用 [SWC](https://swc.rs/) 替换 Oxc 以便使用 SWC 插件。在生产构建期间，使用插件时会使用 SWC+Oxc Transformer。对于需要自定义插件的大型项目，如果插件也适用于 SWC，冷启动和热模块替换 (HMR) 可能会显著更快。

### [@vitejs/plugin-rsc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-rsc)

Vite 通过该插件支持 [React Server Components (RSC)](https://react.dev/reference/rsc/server-components)。它利用 [环境 API](/guide/api-environment) 提供底层原语，React 框架可以使用这些原语来集成 RSC 功能。你可以使用以下命令尝试一个最小化的独立 RSC 应用：

```bash
npm create vite@latest -- --template rsc
```

阅读 [插件文档](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-rsc) 以了解更多。

### [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)

为生产构建提供旧版浏览器支持。

## 社区插件

查看 [Vite 插件注册表](https://registry.vite.dev/plugins) 以获取发布到 npm 的插件列表。

## Rolldown 内置插件

Vite 在底层使用 [Rolldown](https://rolldown.rs/)，它为常见用例提供了一些内置插件。

阅读 [Rolldown 内置插件部分](https://rolldown.rs/builtin-plugins/) 以获取更多信息。

## Rolldown / Rollup 插件

[Vite 插件](../guide/api-plugin) 是 Rollup 插件接口的扩展。查看 [Rollup 插件兼容性部分](../guide/api-plugin#rolldown-plugin-compatibility) 以获取更多信息。
