---
title: Vite 2.0 发布
author:
  - name: Vite 团队
sidebar: false
date: 2021-02-16
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 2.0 发布
  - - meta
    - property: og:url
      content: https://vite.zhcndoc.com/blog/announcing-vite2
  - - meta
    - property: og:description
      content: Vite 2.0 发布，一个新型的前端 Web 开发构建工具，利用浏览器的原生 ES 模块支持和用编译为原生代码的语言编写的工具来提供敏捷且现代的开发体验。
---

# Vite 2.0 发布

_2021 年 2 月 16 日_ - 查看 [Vite 3.0 公告](./announcing-vite3.md)

<p style="text-align:center">
  <img src="/logo.svg" style="height:200px">
</p>

今天我们很高兴宣布 Vite 2.0 正式发布！

Vite（法语单词，意为“快速”，发音为 `/vit/`）是一种新型的前端 Web 开发构建工具。可以将其视为预配置的开发服务器 + 打包器组合，但更轻量、更快速。它利用浏览器的 [原生 ES 模块](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 支持和用编译为原生代码的语言编写的工具（如 [esbuild](https://esbuild.github.io/)）来提供敏捷且现代的开发体验。

要了解 Vite 有多快，请查看 [此视频对比](https://twitter.com/amasad/status/1355379680275128321)，这是在 Repl.it 上使用 Vite 与 `create-react-app` (CRA) 启动 React 应用程序的对比。

如果你以前从未听说过 Vite 并且想了解更多，请查看 [项目背后的理念](https://vite.zhcndoc.com/guide/why.html)。如果你感兴趣 Vite 与其他类似工具有何不同，请查看 [对比](https://v5.vite.dev/guide/comparisons.html)。

## 2.0 的新功能

由于我们决定在 1.0 退出 RC 之前完全重构内部结构，这实际上是 Vite 的第一个稳定版本。也就是说，Vite 2.0 与其前身相比带来了许多重大改进：

### 框架无关的核心

Vite 最初的想法始于一个 [通过原生 ESM 提供 Vue 单文件组件的黑客式原型](https://github.com/vuejs/vue-dev-server)。Vite 1 是该想法的延续，并在其上实现了 HMR。

Vite 2.0 汲取了我们一路走来的经验，从头开始重新设计，拥有更稳健的内部架构。它现在完全与框架无关，所有特定于框架的支持都委托给插件。现在有了 [Vue、React、Preact、Lit Element 的官方模板](https://github.com/vitejs/vite/tree/main/packages/create-vite)，社区也在努力集成 Svelte。

### 新插件格式和 API

受 [WMR](https://github.com/preactjs/wmr) 启发，新插件系统扩展了 Rollup 的插件接口，并且 [兼容许多 Rollup 插件](https://vite-rollup-plugins.patak.dev/)，开箱即用。插件可以使用兼容 Rollup 的钩子，以及额外的 Vite 特定钩子和属性来调整仅针对 Vite 的行为（例如区分开发与构建或自定义处理 HMR）。

[编程 API](https://vite.zhcndoc.com/guide/api-javascript.html) 也得到了极大改进，以促进基于 Vite 构建的高级工具/框架。

### 由 esbuild 驱动的依赖预构建

由于 Vite 是一个原生 ESM 开发服务器，它预构建依赖以减少浏览器请求数量并处理 CommonJS 到 ESM 的转换。以前 Vite 使用 Rollup 这样做，而在 2.0 中它现在使用 `esbuild`，这使得依赖预构建速度提高了 10-100 倍。作为参考，在 M1 芯片的 MacBook Pro 上，冷启动一个具有大量依赖（如 React Material UI）的测试应用程序，以前需要 28 秒，现在只需约 1.5 秒。如果你从传统的基于打包器的设置切换过来，预计会有类似的改进。

### 一流的 CSS 支持

Vite 将 CSS 视为模块图的一等公民，并开箱即用支持以下内容：

- **解析器增强**：CSS 中的 `@import` 和 `url()` 路径通过 Vite 的解析器进行增强，以尊重别名和 npm 依赖。
- **URL 重基**：无论文件从哪里导入，`url()` 路径都会自动重新基址。
- **CSS 代码分割**：代码分割的 JS 块也会发出相应的 CSS 文件，当请求时会自动与 JS 块并行加载。

### 服务器端渲染 (SSR) 支持

Vite 2.0 附带 [实验性 SSR 支持](https://vite.zhcndoc.com/guide/ssr.html)。Vite 提供 API 以便在开发期间高效地在 Node.js 中加载和更新基于 ESM 的源代码（几乎类似于服务器端 HMR），并自动外部化兼容 CommonJS 的依赖以提高开发和 SSR 构建速度。生产服务器可以完全与 Vite 解耦，相同的设置可以轻松适配以执行预渲染/SSG。

Vite SSR 作为底层功能提供，我们期待看到高级框架在底层利用它。

### 可选的旧版浏览器支持

Vite 默认针对具有原生 ESM 支持的现代浏览器，但你也可以通过官方 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 选择支持旧版浏览器。该插件自动生成双重现代/旧版捆绑包，并根据浏览器功能检测交付正确的捆绑包，确保在支持它们的现代浏览器中代码更高效。

## 试一试！

功能很多，但开始使用 Vite 很简单！你确实可以在一分钟内启动一个 Vite 驱动的应用，从以下命令开始（确保你拥有 Node.js >=12）：

```bash
npm init @vitejs/app
```

然后，查看 [指南](https://vite.zhcndoc.com/guide/) 了解 Vite 开箱即用提供了什么。你也可以在 [GitHub](https://github.com/vitejs/vite) 上查看源代码，在 [Twitter](https://twitter.com/vite_js) 上关注更新，或加入我们的 [Discord 聊天服务器](https://chat.vite.dev) 与其他 Vite 用户讨论。
