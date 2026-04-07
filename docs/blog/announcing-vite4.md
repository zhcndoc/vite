---
title: Vite 4.0 发布
author:
  name: Vite 团队
date: 2022-12-09
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 4.0 发布
  - - meta
    - property: og:image
      content: https://vite.zhcndoc.com/og-image-announcing-vite4.webp
  - - meta
    - property: og:url
      content: https://vite.zhcndoc.com/blog/announcing-vite4
  - - meta
    - property: og:description
      content: Vite 4 发布通告
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 4.0 发布

_2022 年 12 月 9 日_ - 查看 [Vite 5.0 公告](./announcing-vite5.md)

Vite 3 于五个月前 [发布](./announcing-vite3.md)。从那以后，每周 npm 下载量从 100 万增长到了 250 万。生态系统也日益成熟，并持续增长。在今年的 [Jamstack Conf 调查](https://twitter.com/vite_js/status/1589665610119585793) 中，社区中的使用率从 14% 跃升至 32%，同时保持了 9.7 的高满意度评分。我们看到了 [Astro 1.0](https://astro.build/)、[Nuxt 3](https://v3.nuxtjs.org/) 以及其他由 Vite 驱动的创新与协作框架的稳定发布：[SvelteKit](https://kit.svelte.dev/)、[Solid Start](https://www.solidjs.com/blog/introducing-solidstart)、[Qwik City](https://qwik.builder.io/qwikcity/overview/)。Storybook 宣布将 Vite 的一流支持作为 [Storybook 7.0](https://storybook.js.org/blog/first-class-vite-support-in-storybook/) 的主要功能之一。Deno 现在 [支持 Vite](https://www.youtube.com/watch?v=Zjojo9wdvmY)。[Vitest](https://vitest.dev) 的采用率激增，很快将占 Vite npm 下载量的一半。Nx 也在投资生态系统，并 [官方支持 Vite](https://nx.dev/packages/vite)。

[![Vite 4 生态系统](../images/ecosystem-vite4.webp)](https://viteconf.org/2022/replay)

作为 Vite 及相关项目增长的展示，Vite 生态系统于 10 月 11 日在 [ViteConf 2022](https://viteconf.org/2022/replay) 聚会。我们看到了主要 Web 框架和工具的代表讲述创新与协作的故事。具有象征意义的是，Rollup 团队选择在那一天发布 [Rollup 3](https://rollupjs.org)。

今天，Vite [团队](https://vite.zhcndoc.com/team) 在生态系统合作伙伴的帮助下，很高兴宣布发布 Vite 4，构建时由 Rollup 3 驱动。我们与生态系统合作，确保此次大版本升级路径顺畅。Vite 现在使用 [Rollup 3](https://github.com/vitejs/vite/issues/9870)，这使我们能够简化 Vite 的内部资源处理并带来许多改进。在此查看 [Rollup 3 发布说明](https://github.com/rollup/rollup/releases/tag/v3.0.0)。

![Vite 4 公告封面图](/og-image-announcing-vite4.webp)

快速链接：

- [文档](/)
- [迁移指南](https://v4.vite.dev/guide/migration.html)
- [更新日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#400-2022-12-09)

其他语言的文档：

- [简体中文](https://cn.vite.dev/)
- [日本語](https://ja.vite.dev/)
- [Español](https://es.vite.dev/)

如果你最近开始使用 Vite，我们建议阅读 [为什么选择 Vite 指南](https://vite.zhcndoc.com/guide/why.html) 并查看 [入门指南](https://vite.zhcndoc.com/guide/) 和 [功能指南](https://vite.zhcndoc.com/guide/features)。如果你想参与进来，欢迎在 [GitHub](https://github.com/vitejs/vite) 贡献。几乎 [700 名协作者](https://github.com/vitejs/vite/graphs/contributors) 为 Vite 做出了贡献。在 [Twitter](https://twitter.com/vite_js) 和 [Mastodon](https://webtoo.ls/@vite) 上关注更新，或在我们的 [Discord 社区](https://chat.vite.dev) 与他人协作。

## 开始使用 Vite 4

使用 `pnpm create vite` 搭建一个你首选框架的 Vite 项目，或者在线打开一个启动模板，使用 [vite.new](https://vite.new) 来体验 Vite 4。

你也可以运行 `pnpm create vite-extra` 来获取其他框架和运行时（Solid、Deno、SSR 和库 starter）的模板。当你在 `Others` 选项下运行 `create vite` 时，也可以使用 `create vite-extra` 模板。

请注意，Vite 启动模板旨在用作测试不同框架的 Vite 游乐场。在构建你的下一个项目时，我们建议联系每个框架推荐的启动器。一些框架现在在 `create vite` 中重定向到它们的启动器了（Vue 的 `create-vue` 和 `Nuxt 3`，以及 Svelte 的 `SvelteKit`）。

## 开发期间使用 SWC 的新 React 插件

[SWC](https://swc.rs/) 现在是 [Babel](https://babeljs.io/) 的成熟替代品，特别是在 React 项目上下文中。SWC 的 React Fast Refresh 实现比 Babel 快得多，对于某些项目来说，它现在是一个更好的选择。从 Vite 4 开始，React 项目可以使用两个具有不同权衡的插件。我们认为目前这两种方法都值得支持，我们将继续探索未来对这两个插件的改进。

### @vitejs/plugin-react

[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) 是一个使用 esbuild 和 Babel 的插件，实现了快速的 HMR，包体积小，并且能够使用 Babel 转换管道的灵活性。

### @vitejs/plugin-react-swc (新)

[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) 是一个新插件，在构建时使用 esbuild，但在开发期间用 SWC 替换 Babel。对于不需要非标准 React 扩展的大型项目，冷启动和热模块替换 (HMR) 可以显著更快。

## 浏览器兼容性

现代浏览器构建现在默认目标为 `safari14`，以获得更广泛的 ES2020 兼容性。这意味着现代构建现在可以使用 [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)，并且 [空值合并运算符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) 不再被转译。如果你需要支持更旧的浏览器，可以像往常一样添加 [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)。

## 将 CSS 作为字符串导入

在 Vite 3 中，导入 `.css` 文件的默认导出可能会导致 CSS 重复加载。

```ts
import cssString from './global.css'
```

这种重复加载可能发生，因为 `.css` 文件会被 emit，并且 CSS 字符串也很可能被应用代码使用——例如，由框架运行时注入。从 Vite 4 开始，`.css` 默认导出 [已被弃用](https://github.com/vitejs/vite/issues/11094)。在这种情况下需要使用 `?inline` 查询后缀修饰符，因为它不会 emit 导入的 `.css` 样式。

```ts
import stuff from './global.css?inline'
```

在 [迁移指南](https://v4.vite.dev/guide/migration.html) 中了解更多。

## 环境变量

Vite 现在使用 `dotenv` 16 和 `dotenv-expand` 9（之前是 `dotenv` 14 和 `dotenv-expand` 5）。如果你的值包含 `#` 或 `` ` ``，你需要用引号将它们包裹起来。

```diff
-VITE_APP=ab#cd`ef
+VITE_APP="ab#cd`ef"
```

更多详情，请参阅 [`dotenv`](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md) 和 [`dotenv-expand` 更新日志](https://github.com/motdotla/dotenv-expand/blob/master/CHANGELOG.md)。

## 其他功能

- CLI 快捷键（在开发期间按 `h` 查看全部） ([#11228](https://github.com/vitejs/vite/pull/11228))
- 预打包依赖时支持 patch-package ([#10286](https://github.com/vitejs/vite/issues/10286))
- 更清晰的构建日志输出 ([#10895](https://github.com/vitejs/vite/issues/10895)) 和切换到 `kB` 以与浏览器开发工具保持一致 ([#10982](https://github.com/vitejs/vite/issues/10982))
- 改进 SSR 期间的错误消息 ([#11156](https://github.com/vitejs/vite/issues/11156))

## 减小包大小

Vite 关注其占用空间，以加快安装速度，特别是在文档和复现的游乐场用例中。再一次，这个大版本带来了 Vite 包大小的改进。与 vite 3.2.5 相比，Vite 4 的安装大小减小了 23%（14.1 MB vs 18.3 MB）。

## Vite Core 升级

[Vite Core](https://github.com/vitejs/vite) 和 [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) 继续演进，为维护者和协作者提供更好的体验，并确保 Vite 开发能够扩展以应对生态系统的增长。

### 框架插件移出 core

[`@vitejs/plugin-vue`](https://github.com/vitejs/vite-plugin-vue) 和 [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react) 自 Vite 最初版本以来一直是 Vite core monorepo 的一部分。这帮助我们在进行更改时获得紧密的反馈循环，因为我们可以一起测试和发布 Core 和插件。有了 [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci)，我们可以在这些插件独立仓库开发时获得这种反馈，所以从 Vite 4 开始，[它们已被移出 Vite core monorepo](https://github.com/vitejs/vite/pull/11158)。这对 Vite 的框架无关故事具有重要意义，并将允许我们建立独立的团队来维护每个插件。如果你有 bug 要报告或功能要请求，请在新仓库上创建 issue：[`vitejs/vite-plugin-vue`](https://github.com/vitejs/vite-plugin-vue) 和 [`vitejs/vite-plugin-react`](https://github.com/vitejs/vite-plugin-react)。

### vite-ecosystem-ci 改进

[vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) 通过提供 [大多数主要下游项目](https://github.com/vitejs/vite-ecosystem-ci/tree/main/tests) CI 状态的按需状态报告来扩展 Vite 的 CI。我们每周针对 Vite 的主分支运行三次 vite-ecosystem-ci，并在引入回归之前及时收到报告。Vite 4 将很快与大多数使用 Vite 的项目兼容，这些项目已经准备了带有所需更改的分支，并将在未来几天内发布。我们还能够在 PR 上按需运行 vite-ecosystem-ci，只需在评论中使用 `/ecosystem-ci run`，使我们能够在更改进入主分支之前知道 [更改的影响](https://github.com/vitejs/vite/pull/11269#issuecomment-1343365064)。

## 致谢

如果没有 Vite 贡献者无数小时的工作，Vite 4 将无法实现，他们中许多人也是下游项目和插件的维护者，此外还有 [Vite 团队](/team) 的努力。我们所有人共同努力，再次提升了 Vite 的开发体验（DX），惠及每一个使用它的框架和应用。我们很感激能够为这样一个充满活力的生态系统改进一个共同的基础。

我们也感谢赞助 Vite 团队的个人和公司，以及直接投资 Vite 未来的公司：[@antfu7](https://twitter.com/antfu7) 在 Vite 和生态系统上的工作是他于 [Nuxt Labs](https://nuxtlabs.com/) 任职工作的一部分，[Astro](https://astro.build) 正在资助 [@bluwyoo](https://twitter.com/bluwyoo) 的 Vite 核心工作，而 [StackBlitz](https://stackblitz.com/) 雇佣了 [@patak_dev](https://twitter.com/patak_dev) 全职从事 Vite 工作。

## 下一步计划

我们目前的重点将是分类处理新开放的问题，以避免可能的回归造成的干扰。如果你想参与并帮助我们改进 Vite，我们建议从问题分类开始。加入 [我们的 Discord](https://chat.vite.dev) 并在 `#contributing` 频道联系我们。完善我们的 `#docs` 相关内容，并 `#help` 他人。随着 Vite 的采用率持续增长，我们需要继续为下一波用户构建一个乐于助人且友好的社区。

还有很多开放的领域需要继续努力，以不断提升选择 Vite 为其框架提供动力并开发应用的每个人的开发体验。前进！
