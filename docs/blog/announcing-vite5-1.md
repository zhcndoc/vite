---
title: Vite 5.1 发布
author:
  name: Vite 团队
date: 2024-02-08
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 5.1 发布
  - - meta
    - property: og:image
      content: https://vite.zhcndoc.com/og-image-announcing-vite5-1.webp
  - - meta
    - property: og:url
      content: https://vite.zhcndoc.com/blog/announcing-vite5-1
  - - meta
    - property: og:description
      content: Vite 5.1 发布通告
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 5.1 发布

_2024 年 2 月 8 日_

![Vite 5.1 发布封面图](/og-image-announcing-vite5-1.webp)

Vite 5 于去年十一月 [发布](./announcing-vite5.md)，它代表了 Vite 和生态系统的又一次重大飞跃。几周前，我们庆祝了每周 1000 万次 npm 下载量和 Vite 仓库的 900 名贡献者。今天，我们很高兴宣布 Vite 5.1 的发布。

快速链接：[文档](/), [变更日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#510-2024-02-08)

其他语言文档：[简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/)

在 StackBlitz 在线尝试 Vite 5.1：[vanilla](https://vite.new/vanilla-ts), [vue](https://vite.new/vue-ts), [react](https://vite.new/react-ts), [preact](https://vite.new/preact-ts), [lit](https://vite.new/lit-ts), [svelte](https://vite.new/svelte-ts), [solid](https://vite.new/solid-ts), [qwik](https://vite.new/qwik-ts)。

如果你是 Vite 新手，我们建议先阅读 [入门](/guide/) 和 [功能](/guide/features) 指南。

为了保持更新，请在 [X](https://x.com/vite_js) 或 [Mastodon](https://webtoo.ls/@vite) 上关注我们。

## Vite 运行时 API

Vite 5.1 添加了对新的 Vite 运行时 API 的实验性支持。它允许先通过 Vite 插件处理任何代码，然后运行它。它不同于 `server.ssrLoadModule`，因为运行时实现与服务器解耦。这让库和框架作者能够实现他们自己的服务器与运行时之间的通信层。一旦稳定，这个新 API 旨在替换 Vite 当前的 SSR 原语。

新 API 带来许多好处：

- 支持 SSR 期间的 HMR。
- 它与服务器解耦，因此单个服务器可以服务的客户端数量没有限制——每个客户端都有自己的模块缓存（你甚至可以通过任何方式与之通信——使用消息通道/fetch 调用/直接函数调用/websocket）。
- 它不依赖任何 node/bun/deno 内置 API，因此可以在任何环境中运行。
- 它很容易与拥有自己代码运行机制的工具集成（例如你可以提供一个 runner 来使用 `eval` 而不是 `new AsyncFunction`）。

最初的想法由 [Pooya Parsa 提出](https://github.com/nuxt/vite/pull/201)，并由 [Anthony Fu](https://github.com/antfu) 实现为 [vite-node](https://github.com/vitest-dev/vitest/tree/main/packages/vite-node#readme) 包，用于 [驱动 Nuxt 3 Dev SSR](https://antfu.me/posts/dev-ssr-on-nuxt)，后来也用作 [Vitest](https://vitest.dev) 的基础。所以 vite-node 的总体思路已经经过了一段时间的实战测试。这是由 [Vladimir Sheremet](https://github.com/sheremet-va) 进行的 API 新迭代，他已经在 Vitest 中重新实现了 vite-node，并利用这些经验使 API 在添加到 Vite Core 时更加强大和灵活。这个 PR 耗时一年完成，你可以 [在这里](https://github.com/vitejs/vite/issues/12165) 看到与生态系统维护者的演变和讨论。

::: info
Vite 运行时 API 已演变为 Module Runner API，作为 [环境 API](/guide/api-environment) 的一部分在 Vite 6 中发布。
:::

## 功能特性

### 改进对 `.css?url` 的支持

将 CSS 文件作为 URL 导入现在可以可靠且正确地工作。这是 Remix 迁移到 Vite 的最后一个障碍。见 ([#15259](https://github.com/vitejs/vite/issues/15259))。

### `build.assetsInlineLimit` 现在支持回调

用户现在可以 [提供一个回调](/config/build-options.html#build-assetsinlinelimit)，返回布尔值以选择加入或退出特定资源的内联。如果返回 `undefined`，则应用默认逻辑。见 ([#15366](https://github.com/vitejs/vite/issues/15366))。

### 改进循环导入的 HMR

在 Vite 5.0 中，循环导入中被接受的模块总是触发整个页面重载，即使它们可以在客户端很好地处理。现在放宽了限制，允许应用 HMR 而不完全重载页面，但如果 HMR 期间发生任何错误，页面将被重载。见 ([#15118](https://github.com/vitejs/vite/issues/15118))。

### 支持 `ssr.external: true` 以外部化所有 SSR 包

历史上，Vite 外部化所有包，除了链接的包。这个新选项可用于强制外部化所有包，包括链接的包。这在 monorepo 内的测试中很方便，我们想模拟所有包都被外部化的通常情况，或者当使用 `ssrLoadModule` 加载任意文件且我们希望始终外部化包因为我们不关心 HMR 时。见 ([#10939](https://github.com/vitejs/vite/issues/10939))。

### 在预览服务器中暴露 `close` 方法

预览服务器现在暴露了一个 `close` 方法，它将正确拆除服务器，包括所有打开的 socket 连接。见 ([#15630](https://github.com/vitejs/vite/issues/15630))。

## 性能改进

Vite 随着每个版本的发布变得越来越快，Vite 5.1 充满了性能改进。我们使用 [vite-dev-server-perf](https://github.com/yyx990803/vite-dev-server-perf) 测量了从 Vite 4.0 开始所有次要版本加载 10K 模块（25 层深树）的时间。这是衡量 Vite 无打包方法效果的良好基准。每个模块都是一个带有计数器的小 TypeScript 文件，并导入树中的其他文件，因此这主要测量请求各个单独模块所需的时间。在 Vite 4.0 中，在 M1 MAX 上加载 10K 模块需要 8 秒。我们在 [专注于性能的 Vite 4.3](./announcing-vite4-3.md) 取得了突破，能够在 6.35 秒内加载它们。在 Vite 5.1 中，我们实现了又一次性能飞跃。Vite 现在可以在 5.35 秒内服务 10K 模块。

![Vite 10K 模块加载时间进展](../images/vite5-1-10K-modules-loading-time.webp)

此基准测试的结果在 Headless Puppeteer 上运行，是比较版本的好方法。不过，它们并不代表用户体验到的时间。当在 Chrome 的无痕窗口中运行相同的 10K 模块时，我们有：

| 10K 模块         | Vite 5.0 | Vite 5.1 |
| ---------------- | :------: | :------: |
| 加载时间         |  2892ms  |  2765ms  |
| 加载时间（缓存） |  2778ms  |  2477ms  |
| 完全重载         |  2003ms  |  1878ms  |
| 完全重载（缓存） |  1682ms  |  1604ms  |

### 在线程中运行 CSS 预处理器

Vite 现在具有在线程中运行 CSS 预处理器的选择加入支持。你可以使用 [`css.preprocessorMaxWorkers: true`](/config/shared-options.html#css-preprocessormaxworkers) 启用它。对于 Vuetify 2 项目，启用此功能后开发启动时间减少了 40%。[PR 中有其他设置的性能比较](https://github.com/vitejs/vite/pull/13584#issuecomment-1678827918)。见 ([#13584](https://github.com/vitejs/vite/issues/13584))。[提供反馈](https://github.com/vitejs/vite/discussions/15835)。

### 改进服务器冷启动的新选项

你可以设置 `optimizeDeps.holdUntilCrawlEnd: false` 切换到新的依赖优化策略，这可能有助于大型项目。我们正在考虑未来默认切换到此策略。[提供反馈](https://github.com/vitejs/vite/discussions/15834)。([#15244](https://github.com/vitejs/vite/issues/15244))

### 通过缓存检查更快地解析

`fs.cachedChecks` 优化现在默认启用。在 Windows 上，使用它后 `tryFsResolve` 快了约 14 倍，并且在 triangle 基准测试中解析 id 整体快了约 5 倍。([#15704](https://github.com/vitejs/vite/issues/15704))

### 内部性能改进

开发服务器有几个渐进式的性能增益。一个新的中间件用于在 304 上短路 ([#15586](https://github.com/vitejs/vite/issues/15586))。我们在热路径中避免了 `parseRequest` ([#15617](https://github.com/vitejs/vite/issues/15617))。Rollup 现在已正确懒加载 ([#15621](https://github.com/vitejs/vite/issues/15621))

## 弃用

我们继续尽可能减少 Vite 的 API 表面，以使项目长期可维护。

### 弃用 `import.meta.glob` 中的 `as` 选项

标准已转向 [导入属性](https://github.com/tc39/proposal-import-attributes)，但我们目前不打算用新选项替换 `as`。相反，建议用户切换到 `query`。见 ([#14420](https://github.com/vitejs/vite/issues/14420))。

### 移除实验性的构建时预打包

构建时预打包是 Vite 3 中添加的实验性功能，现已移除。随着 Rollup 4 将其解析器切换为原生，以及 Rolldown 正在开发中，此功能的性能和开发与构建不一致的问题不再成立。我们希望继续改进开发/构建一致性，并得出结论，未来使用 Rolldown 进行“开发期间预打包”和“生产构建”是更好的选择。Rolldown 还可能以一种在构建期间比依赖预打包效率高得多的方式实现缓存。见 ([#15184](https://github.com/vitejs/vite/issues/15184))。

## 参与贡献

我们感谢 [Vite Core 的 900 名贡献者](https://github.com/vitejs/vite/graphs/contributors)，以及不断推动生态系统向前发展的插件、集成、工具和翻译的维护者。如果你喜欢 Vite，我们邀请你参与并帮助我们。查看我们的 [贡献指南](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md)，并加入 [分类问题](https://github.com/vitejs/vite/issues)、[审查 PR](https://github.com/vitejs/vite/pulls)、在 [GitHub Discussions](https://github.com/vitejs/vite/discussions) 回答问题以及在 [Vite Land](https://chat.vite.dev) 帮助社区中的其他人。

## 致谢

Vite 5.1 的实现得益于我们的贡献者社区、生态系统中的维护者以及 [Vite 团队](/team)。特别感谢赞助 Vite 开发的个人和公司。感谢 [StackBlitz](https://stackblitz.com/)、[Nuxt Labs](https://nuxtlabs.com/) 和 [Astro](https://astro.build) 雇佣了 Vite 团队成员。同时也感谢 [Vite 的 GitHub Sponsors](https://github.com/sponsors/vitejs)、[Vite 的 Open Collective](https://opencollective.com/vite) 和 [Evan You 的 GitHub Sponsors](https://github.com/sponsors/yyx990803) 上的赞助商。
