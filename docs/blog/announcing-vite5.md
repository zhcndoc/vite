---
title: Vite 5.0 发布
author:
  name: Vite 团队
date: 2023-11-16
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 5.0 发布
  - - meta
    - property: og:image
      content: https://vite.zhcndoc.com/og-image-announcing-vite5.webp
  - - meta
    - property: og:url
      content: https://vite.zhcndoc.com/blog/announcing-vite5
  - - meta
    - property: og:description
      content: Vite 5 发布公告
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 5.0 发布

_2023 年 11 月 16 日_

![Vite 5 公告封面图片](/og-image-announcing-vite5.webp)

Vite 4 [已于近一年前发布](./announcing-vite4.md)，它作为生态系统的坚实基础发挥了作用。每周 npm 下载量从 250 万跃升至 750 万，因为项目继续建立在共享基础设施之上。框架持续创新，除了 [Astro](https://astro.build/)、[Nuxt](https://nuxt.com/)、[SvelteKit](https://kit.svelte.dev/)、[Solid Start](https://www.solidjs.com/blog/introducing-solidstart)、[Qwik City](https://qwik.builder.io/qwikcity/overview/) 等之外，我们还看到新框架加入并使生态系统更加强大。[RedwoodJS](https://redwoodjs.com/) 和 [Remix](https://remix.run/) 切换到 Vite 为 React 生态系统的进一步采用铺平了道路。[Vitest](https://vitest.dev) 的增长速度甚至比 Vite 还要快。其团队一直在努力工作，很快将 [发布 Vitest 1.0](https://github.com/vitest-dev/vitest/issues/3596)。Vite 与其他工具（如 [Storybook](https://storybook.js.org)、[Nx](https://nx.dev) 和 [Playwright](https://playwright.dev)）配合使用的故事不断改进，环境也是如此，Vite 开发服务器既可在 [Deno](https://deno.com) 中工作，也可在 [Bun](https://bun.sh) 中工作。

一个月前，我们举办了第二届 [ViteConf](https://viteconf.org/23/replay)，由 [StackBlitz](https://stackblitz.com) 主办。和去年一样，生态系统中的大多数项目聚集在一起分享想法并建立联系，以继续扩展公共领域。我们还看到新的组件补充了元框架工具带，如 [Volar](https://volarjs.dev/) 和 [Nitro](https://nitro.build/)。Rollup 团队在同一天发布了 [Rollup 4](https://rollupjs.org)，这是 Lukas 去年开始的传统。

六个月前，Vite 4.3 [已发布](./announcing-vite4.md)。此版本显著提高了开发服务器性能。然而，仍有很大的改进空间。在 ViteConf 上，[Evan You 揭示了 Vite 致力于 Rolldown 的长期计划](https://www.youtube.com/watch?v=hrdwQHoAp0M)，这是一个具有兼容 API 的 Rollup Rust 移植版本。一旦准备就绪，我们打算在 Vite Core 中使用它来承担 Rollup 和 esbuild 的任务。这将意味着构建性能的提升（随后随着我们将 Vite 本身对性能敏感的部分移至 Rust，开发性能也会提升），以及开发和构建之间不一致性的大幅减少。Rolldown 目前处于早期阶段，团队正准备在年底前开源代码库。敬请期待！

今天，我们标志着 Vite 道路上的另一个重要里程碑。Vite [团队](/team)、[贡献者](https://github.com/vitejs/vite/graphs/contributors) 和生态系统合作伙伴很高兴宣布发布 Vite 5。Vite 现在使用 [Rollup 4](https://github.com/vitejs/vite/pull/14508)，这已经代表了构建性能的大幅提升。此外，还有新的选项可以改善您的开发服务器性能配置。

Vite 5 专注于清理 API（移除已弃用的功能）并简化若干功能以解决长期存在的问题，例如切换 `define` 以使用适当的 AST 替换而不是正则表达式。我们还继续采取措施使 Vite 面向未来（现在需要 Node.js 18+，并且 [CJS Node API 已弃用](/guide/migration#deprecate-cjs-node-api)）。

快速链接：

- [文档](/)
- [迁移指南](/guide/migration)
- [更新日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2023-11-16)

其他语言的文档：

- [简体中文](https://cn.vite.dev/)
- [日本語](https://ja.vite.dev/)
- [西班牙语](https://es.vite.dev/)
- [葡萄牙语](https://pt.vite.dev/)
- [韩语](https://ko.vite.dev/)
- [德语](https://de.vite.dev/) (新翻译！)

如果您是 Vite 新手，我们建议先阅读 [入门指南](/guide/) 和 [功能](/guide/features) 指南。

我们感谢 [850 多位 Vite Core 贡献者](https://github.com/vitejs/vite/graphs/contributors)，以及帮助我们达到这里的 Vite 插件、集成、工具和翻译的维护者和贡献者。我们鼓励您参与其中，与我们一起继续改进 Vite。您可以在我们的 [贡献指南](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md) 中了解更多信息。为了开始，我们建议 [分类问题](https://github.com/vitejs/vite/issues)、[审查 PR](https://github.com/vitejs/vite/pulls)、基于未决问题发送失败测试的 PR，以及在 [讨论区](https://github.com/vitejs/vite/discussions) 和 Vite Land 的 [帮助论坛](https://discord.com/channels/804011606160703521/1019670660856942652) 中帮助他人。一路上您将学到很多，并为项目进一步贡献铺平道路。如果您有疑问，请加入我们的 [Discord 社区](https://chat.vite.dev) 并在 [#contributing 频道](https://discord.com/channels/804011606160703521/804439875226173480) 中打招呼。

要保持最新关注，请在 [X](https://twitter.com/vite_js) 或 [Mastodon](https://webtoo.ls/@vite) 上关注我们。

## Vite 5 快速开始

使用 `pnpm create vite` 搭建您首选框架的 Vite 项目，或在线打开一个启动模板，使用 [vite.new](https://vite.new) 体验 Vite 5。您也可以运行 `pnpm create vite-extra` 以访问其他框架和运行时（Solid、Deno、SSR 和库 starter）的模板。当您在 `Others` 选项下运行 `create vite` 时，也可以使用 `create vite-extra` 模板。

请注意，Vite starter 模板旨在用作演练场，以测试不同框架下的 Vite。在构建您的下一个项目时，我们建议联系每个框架推荐的 starter。一些框架现在也在 `create vite` 中重定向到它们的 starter（Vue 的 `create-vue` 和 `Nuxt 3`，以及 Svelte 的 `SvelteKit`）。

## Node.js 支持

Vite 不再支持已达到其生命周期终点 (EOL) 的 Node.js 14 / 16 / 17 / 19。现在需要 Node.js 18 / 20+。

## 性能

除了 Rollup 4 的构建性能改进之外，还有一个新指南可帮助您识别和修复常见的性能问题，地址为 [https://vite.zhcndoc.com/guide/performance](/guide/performance)。

Vite 5 还引入了 [server.warmup](/guide/performance.html#warm-up-frequently-used-files)，这是一个改善启动时间的新功能。它允许您定义一个模块列表，这些模块应在服务器启动后立即预转换。当使用 [`--open` 或 `server.open`](/config/server-options.html#server-open) 时，Vite 还将自动预热您的应用程序入口点或提供的要打开的 URL。

## 主要变更

- [Vite 现在由 Rollup 4 驱动](/guide/migration#rollup-4)
- [CJS Node API 已弃用](/guide/migration#deprecate-cjs-node-api)
- [重构 define 和 import.meta.env.\* 替换策略](/guide/migration#rework-define-and-import-meta-env-replacement-strategy)
- [SSR 外部化模块的值现在与生产环境匹配](/guide/migration#ssr-externalized-modules-value-now-matches-production)
- [`worker.plugins` 现在是一个函数](/guide/migration#worker-plugins-is-now-a-function)
- [允许包含 `.` 的路径回退到 index.html](/guide/migration#allow-path-containing-to-fallback-to-index-html)
- [对齐开发和预览的 HTML 服务行为](/guide/migration#align-dev-and-preview-html-serving-behaviour)
- [清单文件现在默认生成在 `.vite` 目录中](/guide/migration#manifest-files-are-now-generated-in-vite-directory-by-default)
- [CLI 快捷键需要额外按一次 Enter](/guide/migration#cli-shortcuts-require-an-additional-enter-press)
- [更新 `experimentalDecorators` 和 `useDefineForClassFields` 的 TypeScript 行为](/guide/migration#update-experimentaldecorators-and-usedefineforclassfields-typescript-behaviour)
- [移除 `--https` 标志和 `https: true`](/guide/migration#remove-https-flag-and-https-true)
- [移除 `resolvePackageEntry` 和 `resolvePackageData` API](/guide/migration#remove-resolvepackageentry-and-resolvepackagedata-apis)
- [移除之前已弃用的 API](/guide/migration#removed-deprecated-apis)
- [阅读更多关于影响插件和工具作者的高级变更](/guide/migration#advanced)

## 迁移到 Vite 5

我们与生态系统合作伙伴合作，确保顺利迁移到这个新主要版本。再次，[vite-ecosystem-ci](https://www.youtube.com/watch?v=7L4I4lDzO48) 对于帮助我们在避免回归的同时进行更大胆的变更至关重要。我们很高兴看到其他生态系统采用类似的方案来改善其项目与下游维护者之间的协作。

对于大多数项目，更新到 Vite 5 应该是直接的。但我们建议在升级前审查 [详细的迁移指南](/guide/migration)。

可以在 [Vite 5 更新日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2023-11-16) 中找到 Vite core 变更完整列表的底层细分。

## 致谢

Vite 5 是我们贡献者社区、下游维护者、插件作者和 [Vite 团队](/team) 长时间工作的结果。特别感谢 [Bjorn Lu](https://twitter.com/bluwyoo) 领导此次主要版本的发布流程。

我们也感谢赞助 Vite 开发的个人和公司。[StackBlitz](https://stackblitz.com/)、[Nuxt Labs](https://nuxtlabs.com/) 和 [Astro](https://astro.build) 继续通过雇佣 Vite 团队成员来投资 Vite。特别感谢 [Vite 的 GitHub 赞助商](https://github.com/sponsors/vitejs)、[Vite 的 Open Collective](https://opencollective.com/vite) 和 [Evan You 的 GitHub 赞助商](https://github.com/sponsors/yyx990803) 上的赞助商。特别提及 [Remix](https://remix.run/) 成为金牌赞助商并在切换到 Vite 后回馈社区。
