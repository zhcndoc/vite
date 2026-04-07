---
title: Vite 7.0 发布
author:
  name: Vite 团队
date: 2025-06-24
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 7.0 发布
  - - meta
    - property: og:image
      content: https://vite.zhcndoc.com/og-image-announcing-vite7.webp
  - - meta
    - property: og:url
      content: https://vite.zhcndoc.com/blog/announcing-vite7
  - - meta
    - property: og:description
      content: Vite 7 发布公告
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 7.0 发布

_2025 年 6 月 24 日_

![Vite 7 公告封面图](/og-image-announcing-vite7.webp)

我们很高兴分享 Vite 7 的发布！距离 Evan You 向 Vite 仓库提交第一个 commit 已经过去了 5 年，没有人能预测到前端生态系统自此会发生多大的变化。大多数现代前端框架和工具现在都在协同工作，建立在 Vite 共享的基础设施之上。并且它们可以通过在更高层次上共享，以更快的速度进行创新。Vite 现在的周下载量已达 3100 万次，自上次大版本发布以来的过去七个月中增加了 1400 万次。

今年，我们迈出了几大步。首先，[ViteConf](https://viteconf.org) 将改为线下举行！Vite 生态系统将于 10 月 9-10 日在阿姆斯特丹聚会！由 [JSWorld](https://jsworldconference.com/) 与 [Bolt](https://bolt.new)、[VoidZero](https://voidzero.dev) 和 Vite 核心团队合作组织！我们已经举办了三届精彩的 [ViteConf 在线版](https://www.youtube.com/@viteconf/playlists)，我们迫不及待地想在现实生活中见面。请在 [ViteConf 网站](https://viteconf.org) 查看演讲者名单并获取门票！

[VoidZero](https://voidzero.dev/posts/announcing-voidzero-inc) 继续在其为 JavaScript 生态系统构建开源统一开发工具链的使命上取得重大进展。在过去的一年里，VoidZero 团队一直在开发 [Rolldown](https://rolldown.rs/)，这是一个基于 Rust 的下一代打包工具，作为现代化 Vite 核心的更广泛努力的一部分。你今天可以通过使用 `rolldown-vite` 包而不是默认的 `vite` 包来尝试基于 Rolldown 的 Vite。它是一个无缝替换，因为 Rolldown 将成为 Vite 未来的默认打包工具。切换应该可以减少你的构建时间，尤其是对于大型项目。请在 [Rolldown-vite 公告博客文章](https://voidzero.dev/posts/announcing-rolldown-vite) 和我们的 [迁移指南](https://vite.zhcndoc.com/rolldown) 中阅读更多内容。

通过 VoidZero 和 [NuxtLabs](https://nuxtlabs.com/) 之间的合作，Anthony Fu 正在致力于创建 Vite DevTools。它们将为所有基于 Vite 的项目和框架提供更深层次、更有洞察力的调试和分析。你可以在 [VoidZero 和 NuxtLabs 联手打造 Vite Devtools 的博客文章](https://voidzero.dev/posts/voidzero-nuxtlabs-vite-devtools) 中阅读更多内容。

快速链接：

- [文档](/)
- 新翻译：[فارسی](https://fa.vite.dev/)
- 其他翻译：[简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/)
- [迁移指南](/guide/migration)
- [GitHub 更新日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

使用 [vite.new](https://vite.new) 在线体验 Vite 7，或者运行 `pnpm create vite` 在本地 scaffold 一个你首选框架的 Vite 应用。查看 [入门指南](/guide/) 获取更多信息。

我们邀请你帮助我们改进 Vite（加入超过 [1.1K 位 Vite Core 贡献者](https://github.com/vitejs/vite/graphs/contributors) 的行列）、我们的依赖项或生态系统中的插件和项目。在我们的 [贡献指南](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md) 中了解更多。一个好的开始方式是 [分类处理 issue](https://github.com/vitejs/vite/issues)、[审查 PR](https://github.com/vitejs/vite/pulls)、基于开放 issue 发送测试 PR，以及在 [Discussions](https://github.com/vitejs/vite/discussions) 或 Vite Land 的 [帮助论坛](https://discord.com/channels/804011606160703521/1019670660856942652) 中支持他人。如果你有问题，加入我们的 [Discord 社区](https://chat.vite.dev) 并在 [#contributing 频道](https://discord.com/channels/804011606160703521/804439875226173480) 与我们交谈。

通过在 [Bluesky](https://bsky.app/profile/vite.dev)、[X](https://twitter.com/vite_js) 或 [Mastodon](https://webtoo.ls/@vite) 上关注我们，保持更新并与建立在 Vite 之上的其他人联系。

## Node.js 支持

Vite 现在需要 Node.js 20.19+、22.12+。我们已经弃用了 Node.js 18，因为它已在 2025 年 4 月底达到 [EOL](https://endoflife.date/nodejs)。

我们需要这些新版本范围，以便 Node.js 无需标志即可支持 `require(esm)`。这允许我们仅将 Vite 7.0 分发为 ESM，而不会阻止 Vite JavaScript API 被 CJS 模块 require。查看 Anthony Fu 的 [Move on to ESM-only](https://antfu.me/posts/move-on-to-esm-only) 以详细了解生态系统中 ESM 的现状。

## 默认浏览器目标更改为 Baseline Widely Available

[Baseline](https://web-platform-dx.github.io/web-features/) 为我们提供了关于哪些 Web 平台功能可以在其核心浏览器集合中工作的清晰信息。Baseline Widely Available 表示该功能已成熟，并在许多设备和浏览器版本中工作，在浏览器中可用至少 30 个月。

在 Vite 7 中，默认浏览器目标将从 `'modules'` 更改为新的默认值：`'baseline-widely-available'`。浏览器集合将在每个大版本中更新，以匹配与 Baseline Widely available 功能兼容的最小浏览器版本列表。`build.target` 的默认浏览器值在 Vite 7.0 中正在更改：

- Chrome 87 → 107
- Edge 88 → 107
- Firefox 78 → 104
- Safari 14.0 → 16.0

此更改为未来版本的默认浏览器目标增加了可预测性。

## Vitest

对于 Vitest 用户，Vite 7.0 从 Vitest 3.2 开始支持。你可以在 [Vitest 3.2 发布博客文章](https://vitest.dev/blog/vitest-3-2.html) 中阅读更多关于 Vitest 团队如何不断改进 Vite 测试故事的内容。

## Environment API

Vite 6 是自 Vite 2 以来最重要的大版本更新，增加了 [新的实验性 Environment API](https://vite.zhcndoc.com/blog/announcing-vite6.html#experimental-environment-api) 的新功能。我们将保留新 API 为实验性，同时生态系统审查新 API 如何适应他们的项目并提供反馈。如果你建立在 Vite 之上，我们鼓励你测试新 API 并在 [这里的开放反馈讨论](https://github.com/vitejs/vite/discussions/16358) 中联系我们。

在 Vite 7 中，我们添加了一个新的 `buildApp` hook，让插件协调环境的构建。请在 [框架的 Environment API 指南](/guide/api-environment-frameworks.html#environments-during-build) 中阅读更多内容。

我们要感谢一直测试新 API 并帮助我们稳定新功能的团队。例如，Cloudflare 团队宣布了他们的 Cloudflare Vite 插件的 1.0 版本，以及对 React Router v7 的官方支持。他们的插件展示了 Environment API 对于运行时提供商的潜力。在 ["Just use Vite"… with the Workers runtime](https://blog.cloudflare.com/introducing-the-cloudflare-vite-plugin/) 中了解更多关于他们的方法和未来步骤。

## 迁移到 Vite 7

Vite 7 应该是从 Vite 6 平滑升级。我们正在移除已经弃用的功能，比如 Sass 遗留 API 支持和 `splitVendorChunkPlugin`，这不应该影响你的项目。我们仍然建议你在升级前查看 [详细的迁移指南](/guide/migration)。

完整的更改列表在 [Vite 7 更新日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)。

## 致谢

Vite 7 由 [Vite 团队](/team) 在广泛的贡献者社区、下游维护者、插件作者的帮助下打造。特别感谢 [sapphi-red](https://github.com/sapphi-red) 在 `rolldown-vite` 和此版本上的杰出工作。Vite 由 [VoidZero](https://voidzero.dev) 为您带来，与 [Bolt](https://bolt.new/) 和 [Nuxt Labs](https://nuxtlabs.com/) 合作。我们还要感谢我们在 [Vite 的 GitHub Sponsors](https://github.com/sponsors/vitejs) 和 [Vite 的 Open Collective](https://opencollective.com/vite) 上的赞助商。
