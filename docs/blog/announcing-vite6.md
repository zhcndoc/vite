---
title: Vite 6.0 发布
author:
  name: Vite 团队
date: 2024-11-26
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 6.0 发布
  - - meta
    - property: og:image
      content: https://vite.zhcndoc.com/og-image-announcing-vite6.webp
  - - meta
    - property: og:url
      content: https://vite.zhcndoc.com/blog/announcing-vite6
  - - meta
    - property: og:description
      content: Vite 6 发布公告
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 6.0 发布

_2024 年 11 月 26 日_

![Vite 6 公告封面图片](/og-image-announcing-vite6.webp)

今天，我们在 Vite 的发展历程中又迈出了一大步。Vite [团队](/team)、[贡献者](https://github.com/vitejs/vite/graphs/contributors) 和生态系统合作伙伴很高兴地宣布 Vite 6 发布。

这是充满事件的一年。Vite 的采用率持续增长，自一年前 Vite 5 发布以来，每周 npm 下载量从 750 万跃升至 1700 万。[Vitest](https://vitest.dev) 不仅更受用户青睐，也开始形成自己的生态系统。例如，[Storybook](https://storybook.js.org) 拥有了由 Vitest 提供支持的新测试功能。

新的框架也加入了 Vite 生态系统，包括 [TanStack Start](https://tanstack.com/start)、[One](https://onestack.dev/)、[Ember](https://emberjs.com/) 等。Web 框架的创新速度越来越快。你可以查看 [Astro](https://astro.build/)、[Nuxt](https://nuxt.com/)、[SvelteKit](https://kit.svelte.dev/)、[Solid Start](https://www.solidjs.com/blog/introducing-solidstart)、[Qwik City](https://qwik.builder.io/qwikcity/overview/)、[RedwoodJS](https://redwoodjs.com/)、[React Router](https://reactrouter.com/) 等项目的改进，名单还在不断延长。

OpenAI、Google、Apple、Microsoft、NASA、Shopify、Cloudflare、GitLab、Reddit、Linear 等许多公司都在使用 Vite。两个月前，我们开始整理一份 [使用 Vite 的公司](https://github.com/vitejs/companies-using-vite) 名单。我们很高兴看到许多开发者提交 PR 将他们的公司添加到名单中。自从 Vite 迈出第一步以来，我们共同建立的生态系统增长了多少，这令人难以置信。

![Vite 每周 npm 下载量](../images/vite6-npm-weekly-downloads.webp)

## 加速 Vite 生态系统

上个月，社区聚集在一起参加了第三届 [ViteConf](https://viteconf.org/24/replay)，再次由 [StackBlitz](https://stackblitz.com) 主办。这是规模最大的一次 Vite 会议，代表了生态系统中的广大构建者。除了其他公告外，Evan You 宣布了 [VoidZero](https://staging.voidzero.dev/posts/announcing-voidzero-inc)，这是一家致力于为 JavaScript 生态系统构建开源、高性能和统一开发工具链的公司。VoidZero 是 [Rolldown](https://rolldown.rs) 和 [Oxc](https://oxc.rs) 背后的团队，他们的团队正在取得重大进展，使其迅速准备好被 Vite 采用。观看 Evan 的主题演讲，了解更多关于 Vite 基于 Rust 的未来的下一步计划。

<YouTubeVideo videoId="EKvvptbTx6k?si=EZ-rFJn4pDW3tUvp" />

[Stackblitz](https://stackblitz.com) 推出了 [bolt.new](https://bolt.new)，这是一个结合了 Claude 和 WebContainers 的 Remix 应用，让你可以通过提示、编辑、运行和部署全栈应用。Nate Weiner 宣布了 [One](https://onestack.dev/)，这是一个新的基于 Vite 的 Web 和原生 React 框架。Storybook 展示了他们最新的基于 Vitest 的 [测试功能](https://youtu.be/8t5wxrFpCQY?si=PYZoWKf-45goQYDt)。还有更多。我们鼓励你观看 [全部 43 场演讲](https://www.youtube.com/playlist?list=PLqGQbXn_GDmnObDzgjUF4Krsfl6OUKxtp)。演讲者付出了巨大的努力，与我们分享每个项目的进展。

Vite 也拥有了焕然一新的落地页和简洁的域名。今后你应该更新你的 URL 指向新的 [vite.dev](https://vite.dev) 域名。新的设计和实现由 VoidZero 完成，正是制作他们网站的那些人。感谢 [Vicente Rodriguez](https://bento.me/rmoon) 和 [Simon Le Marchant](https://marchantweb.com/)。

## 下一个 Vite 大版本来了

Vite 6 是自 Vite 2 以来最重要的大版本发布。我们渴望与生态系统合作，通过新的 API 继续扩展我们的共享基础，并且像往常一样，提供一个更完善的基础供构建使用。

快速链接：

- [文档](/)
- 翻译：[简体中文](https://cn.vite.dev/)、[日本語](https://ja.vite.dev/)、[Español](https://es.vite.dev/)、[Português](https://pt.vite.dev/)、[한국어](https://ko.vite.dev/)、[Deutsch](https://de.vite.dev/)
- [迁移指南](/guide/migration)
- [GitHub 更新日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#600-2024-11-26)

如果你是 Vite 新手，我们建议先阅读 [入门指南](/guide/) 和 [功能](/guide/features) 指南。

我们要感谢超过 [1000 名 Vite Core 贡献者](https://github.com/vitejs/vite/graphs/contributors) 以及 Vite 插件、集成、工具和翻译的维护者和贡献者，他们帮助我们打造了这一新的大版本。我们邀请你参与进来，帮助我们为整个生态系统改进 Vite。了解更多请访问我们的 [贡献指南](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md)。

为了开始参与，我们建议帮助 [分类 issue](https://github.com/vitejs/vite/issues)、[审查 PR](https://github.com/vitejs/vite/pulls)、基于未解决的 issue 发送失败测试的 PR，并在 [讨论区](https://github.com/vitejs/vite/discussions) 和 Vite Land 的 [帮助论坛](https://discord.com/channels/804011606160703521/1019670660856942652) 中支持他人。如果你想与我们交谈，加入我们的 [Discord 社区](https://chat.vite.dev) 并在 [#contributing 频道](https://discord.com/channels/804011606160703521/804439875226173480) 打招呼。

获取关于 Vite 生态系统和 Vite core 的最新消息，请在 [Bluesky](https://bsky.app/profile/vite.dev)、[X](https://twitter.com/vite_js) 或 [Mastodon](https://webtoo.ls/@vite) 上关注我们。

## 开始使用 Vite 6

你可以使用 `pnpm create vite` 快速搭建一个你偏好框架的 Vite 应用，或者使用 [vite.new](https://vite.new) 在线体验 Vite 6。你也可以运行 `pnpm create vite-extra` 来获取其他框架和运行时（Solid、Deno、SSR 和库启动器）的模板。当你运行 `create vite` 时，在 `Others` 选项下也可以使用 `create vite-extra` 模板。

Vite starter 模板旨在作为使用不同框架测试 Vite 的游乐场。在构建你的下一个项目时，你应该使用每个框架推荐的 starter。`create vite` 还提供了一些框架的快捷方式来设置合适的 starters，例如 `create-vue`、`Nuxt 3`、`SvelteKit`、`Remix`、`Analog` 和 `Angular`。

## Node.js 支持

Vite 6 支持 Node.js 18、20 和 22+，与 Vite 5 类似。已放弃对 Node.js 21 的支持。Vite 会在旧版本 [EOL](https://endoflife.date/nodejs) 后放弃对其支持。Node.js 18 的 EOL 是在 2025 年 4 月底，之后我们可能会发布一个新的大版本来提升所需的 Node.js 版本。

## 实验性环境 API

Vite 正变得更加灵活，推出了新的环境 API。这些新 API 将允许框架作者提供更接近生产环境的开发体验，并让生态系统共享新的构建模块。如果你正在构建 SPA，没有任何变化；当你使用单个客户端环境使用 Vite 时，一切照常工作。即使是自定义 SSR 应用，Vite 6 也是向后兼容的。环境 API 的主要目标受众是框架作者。

对于好奇的最终用户，[Sapphi](https://github.com/sapphi-red) 写了一篇很好的 [环境 API 介绍](https://green.sapphi.red/blog/increasing-vites-potential-with-the-environment-api) 指南。这是一个开始并理解我们为何试图让 Vite 更加灵活的好地方。

如果你是框架作者或 Vite 插件维护者，并希望利用新 API，你可以在 [环境 API 指南](https://main.vite.dev/guide/api-environment) 了解更多。

我们要感谢所有参与定义和实现新 API 的人。故事始于 Vite 2 采用了由 [Rich Harris](https://github.com/Rich-Harris) 和 [SvelteKit](https://svelte.dev/docs/kit) 团队开创的无捆绑 SSR 开发方案。Vite 的 SSR 转换随后让 [Anthony Fu](https://github.com/antfu/) 和 [Pooya Parsa](https://github.com/pi0) 创建了 vite-node 并改进了 [Nuxt 的 Dev SSR 体验](https://antfu.me/posts/dev-ssr-on-nuxt)。Anthony 使用 vite-node 为 [Vitest](https://vitest.dev) 提供支持，[Vladimir Sheremet](https://github.com/sheremet-va) 在维护 Vitest 的工作中继续改进它。2023 年初，Vladimir 开始致力于将 vite-node 上游合并到 Vite Core，一年后我们在 Vite 5.1 中将其作为 Runtime API 发布。生态系统合作伙伴的反馈（特别感谢 Cloudflare 团队）促使我们对 Vite 的环境进行更雄心勃勃的重构。你可以在 [Patak 的 ViteConf 24 演讲](https://www.youtube.com/watch?v=WImor3HDyqU?si=EZ-rFJn4pDW3tUvp) 中了解更多关于这个故事的信息。

Vite 团队中的每个人都参与了新 API 的定义，这是与生态系统中许多项目的反馈共同设计的。感谢所有参与的人！如果你正在基于 Vite 构建框架、插件或工具，我们鼓励你参与进来。新 API 是实验性的。我们将与生态系统合作，审查新 API 的使用方式，并在下一个大版本中稳定它们。如果你想提问或提供反馈，[在此处打开 GitHub 讨论](https://github.com/vitejs/vite/discussions/16358)。

## 主要变更

- [`resolve.conditions` 的默认值](/guide/migration#default-value-for-resolve-conditions)
- [JSON stringify](/guide/migration#json-stringify)
- [扩展支持 HTML 元素中的资源引用](/guide/migration#extended-support-of-asset-references-in-html-elements)
- [postcss-load-config](/guide/migration#postcss-load-config)
- [Sass 现在默认使用现代 API](/guide/migration#sass-now-uses-modern-api-by-default)
- [自定义库模式下的 CSS 输出文件名](/guide/migration#customize-css-output-file-name-in-library-mode)
- [以及更多只影响少数用户的变更](/guide/migration#advanced)

还有一个新的 [破坏性变更](/changes/) 页面，列出了 Vite 中所有计划中、考虑中和过去的变更。

## 迁移到 Vite 6

对于大多数项目来说，升级到 Vite 6 应该是直接的，但我们建议在升级前查阅 [详细的迁移指南](/guide/migration)。

完整的变更列表位于 [Vite 6 变更日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2024-11-26)。

## 致谢

Vite 6 是我们社区贡献者、下游维护者、插件作者以及 [Vite 团队](/team) 辛勤工作的成果。我们感谢赞助 Vite 开发的个人和公司。Vite 由 [VoidZero](https://voidzero.dev) 带给您，并与 [StackBlitz](https://stackblitz.com/)、[Nuxt Labs](https://nuxtlabs.com/) 和 [Astro](https://astro.build) 合作。特别感谢 [Vite 的 GitHub Sponsors](https://github.com/sponsors/vitejs) 和 [Vite 的 Open Collective](https://opencollective.com/vite) 上的赞助商。
