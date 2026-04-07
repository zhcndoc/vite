---
title: Vite 3.0 发布
author:
  name: Vite 团队
date: 2022-07-23
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 3.0 发布
  - - meta
    - property: og:image
      content: https://vite.zhcndoc.com/og-image-announcing-vite3.webp
  - - meta
    - property: og:url
      content: https://vite.zhcndoc.com/blog/announcing-vite3
  - - meta
    - property: og:description
      content: Vite 3 发布公告
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 3.0 发布

_2022 年 7 月 23 日_ - 查看 [Vite 4.0 公告](./announcing-vite4.md)

去年二月，[Evan You](https://twitter.com/youyuxi) 发布了 Vite 2。从那以后，它的采用率一直在不断增长，每周 npm 下载量超过 100 万。发布后迅速形成了一个庞大的生态系统。Vite 正在推动 Web 框架的创新竞赛。[Nuxt 3](https://v3.nuxtjs.org/) 默认使用 Vite。[SvelteKit](https://kit.svelte.dev/)、[Astro](https://astro.build/)、[Hydrogen](https://hydrogen.shopify.dev/) 和 [SolidStart](https://docs.solidjs.com/quick-start) 都是基于 Vite 构建的。[Laravel 现在也决定默认使用 Vite](https://laravel.com/docs/9.x/vite)。[Vite Ruby](https://vite-ruby.netlify.app/) 展示了 Vite 如何改善 Rails 开发体验。[Vitest](https://vitest.dev) 正在成为 Vite 原生的 Jest 替代品。Vite 支持 [Cypress](https://docs.cypress.io/guides/component-testing/writing-your-first-component-test) 和 [Playwright](https://playwright.dev/docs/test-components) 的新组件测试功能，Storybook 有 [Vite 作为官方构建器](https://github.com/storybookjs/builder-vite)。而且 [列表还在继续](https://patak.dev/vite/ecosystem.html)。这些项目的大多数维护者都参与了 Vite 核心本身的改进，与 Vite [团队](https://vite.zhcndoc.com/team) 和其他贡献者紧密合作。

![Vite 3 公告封面图](/og-image-announcing-vite3.webp)

今天，距离 v2 发布 16 个月后，我们很高兴宣布 Vite 3 发布。我们决定至少每年发布一个新的 Vite 主版本，以与 [Node.js 的 EOL](https://nodejs.org/en/about/releases/) 保持一致，并借此机会定期审查 Vite 的 API，为生态系统中的项目提供简短的迁移路径。

快速链接：

- [文档](/)
- [迁移指南](https://v3.vite.dev/guide/migration.html)
- [更新日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#300-2022-07-13)

如果你是 Vite 新手，我们推荐阅读 [为什么选择 Vite 指南](https://vite.zhcndoc.com/guide/why.html)。然后查看 [入门指南](https://vite.zhcndoc.com/guide/) 和 [功能指南](https://vite.zhcndoc.com/guide/features) 看看 Vite 开箱即用提供了什么。和往常一样，欢迎在 [GitHub](https://github.com/vitejs/vite) 贡献。到目前为止，已有超过 [600 位协作者](https://github.com/vitejs/vite/graphs/contributors) 帮助改进了 Vite。关注 [Twitter](https://twitter.com/vite_js) 上的更新，或加入我们的 [Discord 聊天服务器](https://chat.vite.dev) 与其他 Vite 用户讨论。

## 新文档

前往 [vite.dev](https://vite.dev) 享受全新的 v3 文档。Vite 现在使用新的 [VitePress](https://vitepress.vuejs.org) 默认主题，具有惊艳的暗色模式以及其他功能。

[![Vite 文档首页](../images/v3-docs.webp)](https://vite.dev)

生态系统中的几个项目已经迁移到此（参见 [Vitest](https://vitest.dev)、[vite-plugin-pwa](https://vite-plugin-pwa.netlify.app/) 和 [VitePress](https://vitepress.vuejs.org/) 本身）。

如果你需要访问 Vite 2 文档，它们将继续在线位于 [v2.vite.dev](https://v2.vite.dev)。还有一个新的 [main.vite.dev](https://main.vite.dev) 子域名，Vite 主分支的每次提交都会自动部署到这里。这在测试测试版本或为核心开发做贡献时很有用。

现在还有官方西班牙语翻译，已添加到之前的中文和日文翻译中：

- [简体中文](https://cn.vite.dev/)
- [日本語](https://ja.vite.dev/)
- [西班牙语](https://es.vite.dev/)

## Create Vite 启动模板

[create-vite](/guide/#trying-vite-online) 模板一直是一个很好的工具，可以快速测试你喜欢的框架与 Vite。在 Vite 3 中，所有模板都获得了与新文档一致的新主题。在线打开它们，现在开始体验 Vite 3：

<div class="stackblitz-links">
<a target="_blank" href="https://vite.new"><img width="75" height="75" src="../images/vite.svg" alt="Vite 标志"></a>
<a target="_blank" href="https://vite.new/vue"><img width="75" height="75" src="../images/vue.svg" alt="Vue 标志"></a>
<a target="_blank" href="https://vite.new/svelte"><img width="60" height="60" src="../images/svelte.svg" alt="Svelte 标志"></a>
<a target="_blank" href="https://vite.new/react"><img width="75" height="75" src="../images/react.svg" alt="React 标志"></a>
<a target="_blank" href="https://vite.new/preact"><img width="65" height="65" src="../images/preact.svg" alt="Preact 标志"></a>
<a target="_blank" href="https://vite.new/lit"><img width="60" height="60" src="../images/lit.svg" alt="Lit 标志"></a>
</div>

<style>
.stackblitz-links {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
}
@media screen and (max-width: 550px) {
  .stackblitz-links {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
    gap: 2rem;
    padding-left: 3rem;
    padding-right: 3rem;
  }
}
.stackblitz-links > a {
  width: 70px;
  height: 70px;
  display: grid;
  align-items: center;
  justify-items: center;
}
.stackblitz-links > a:hover {
  filter: drop-shadow(0 0 0.5em #646cffaa);
}
</style>

该主题现在由所有模板共享。这应该有助于更好地传达这些启动器作为开始使用 Vite 的最小化模板的范围。对于包括 linting、测试设置和其他功能的更完整解决方案，有一些框架的官方 Vite 支持模板，如 [create-vue](https://github.com/vuejs/create-vue) 和 [create-svelte](https://github.com/sveltejs/kit)。在 [Awesome Vite](https://github.com/vitejs/awesome-vite#templates) 有一个社区维护的模板列表。

## 开发改进

### Vite CLI

<pre style="background-color: var(--vp-code-block-bg);padding:2em;border-radius:8px;max-width:100%;overflow-x:auto;">
  <span style="color:lightgreen"><b>VITE</b></span> <span style="color:lightgreen">v3.0.0</span>  <span style="color:gray">已在 <b>320</b> ms 内就绪</span>

  <span style="color:lightgreen"><b>➜</b></span>  <span style="color:white"><b>本地</b>:</span>   <span style="color:cyan">http://127.0.0.1:5173/</span>
  <span style="color:green"><b>➜</b></span>  <span style="color:gray"><b>网络</b>: 使用 --host 暴露</span>
</pre>

除了 CLI 的外观改进外，你会注意到默认开发服务器端口现在是 5173，预览服务器监听 4173。此更改确保 Vite 将避免与其他工具冲突。

### 改进的 WebSocket 连接策略

Vite 2 的痛点之一是在代理后面运行时配置服务器。Vite 3 更改了默认连接方案，使其在大多数场景下开箱即用。所有这些设置现在都作为 Vite 生态系统 CI 的一部分通过 [`vite-setup-catalogue`](https://github.com/sapphi-red/vite-setup-catalogue) 进行测试。

### 冷启动改进

当插件在抓取初始静态导入的模块时注入导入，Vite 现在避免在冷启动期间完全重载 ([#8869](https://github.com/vitejs/vite/issues/8869))。

<details>
  <summary><b>点击了解更多</b></summary>

在 Vite 2.9 中，扫描器和优化器都在后台运行。在最佳场景下，扫描器会找到所有依赖，冷启动时不需要重载。但如果扫描器漏掉了一个依赖，则需要新的优化阶段然后重载。Vite 能够在 v2.9 中避免其中一些重载，因为我们检测新的优化块是否与浏览器拥有的块兼容。但如果有一个公共依赖，子块可能会改变，需要重载以避免重复状态。在 Vite 3 中，优化后的依赖直到静态导入的抓取完成才会交给浏览器。如果缺少依赖（例如，由插件注入），则会发出快速优化阶段，然后才发送打包的依赖。因此，对于这些情况，不再需要页面重载。

</details>

<img style="background-color: var(--vp-code-block-bg);padding:4%;border-radius:8px;" width="100%" height="auto" src="../images/vite-3-cold-start.svg" alt="两个比较 Vite 2.9 和 Vite 3 优化策略的图表">

### import.meta.glob

`import.meta.glob` 支持被重写。在 [Glob 导入指南](/guide/features.html#glob-import) 中阅读新功能：

[多个模式](/guide/features.html#multiple-patterns) 可以作为数组传递

```js
import.meta.glob(['./dir/*.js', './another/*.js'])
```

[否定模式](/guide/features.html#negative-patterns) 现在支持（前缀为 `!`）以忽略某些特定文件

```js
import.meta.glob(['./dir/*.js', '!**/bar.js'])
```

[命名导入](/guide/features.html#named-imports) 可以指定以改进 tree-shaking

```js
import.meta.glob('./dir/*.js', { import: 'setup' })
```

[自定义查询](/guide/features.html#custom-queries) 可以传递以附加元数据

```js
import.meta.glob('./dir/*.js', { query: { custom: 'data' } })
```

[急切导入](/guide/features.html#glob-import) 现在作为标志传递

```js
import.meta.glob('./dir/*.js', { eager: true })
```

### 使 WASM 导入与未来标准保持一致

WebAssembly 导入 API 已修订，以避免与未来标准冲突并使其更灵活：

```js
import init from './example.wasm?init'

init().then((instance) => {
  instance.exports.test()
})
```

在 [WebAssembly 指南](/guide/features.html#webassembly) 中了解更多

## 构建改进

### 默认使用 ESM SSR 构建

生态系统中的大多数 SSR 框架已经在使用 ESM 构建。因此，Vite 3 将 ESM 作为 SSR 构建的默认格式。这使我们能够简化之前的 [SSR 外部化启发式规则](https://vite.zhcndoc.com/guide/ssr.html#ssr-externals)，默认外部化依赖项。

### 改进的相对 Base 支持

Vite 3 现在正确支持相对 base（使用 `base: ''`），允许构建的资源部署到不同的 base 而无需重新构建。当构建时不知道 base 时这很有用，例如部署到像 [IPFS](https://ipfs.io/) 这样的内容寻址网络时。

## 实验性功能

### 构建资源路径的细粒度控制（实验性）

还有其他部署场景这还不够。例如，如果生成的哈希资源需要部署到与公共文件不同的 CDN，则需要在构建时对路径生成进行更细粒度的控制。Vite 3 提供了一个实验性 API 来修改构建文件路径。查看 [构建高级 Base 选项](/guide/build.html#advanced-base-options) 以获取更多信息。

### 构建时的 Esbuild 依赖优化（实验性）

开发和构建时间之间的主要区别之一是 Vite 如何处理依赖项。在构建期间，使用 [`@rollup/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs) 来允许导入仅 CJS 的依赖项（如 React）。使用开发服务器时，改用 esbuild 来预捆绑和优化依赖项，并且在转换导入 CJS 依赖项的用户代码时应用内联互操作方案。在 Vite 3 的开发过程中，我们引入了必要的更改，以允许 [在构建时使用 esbuild 优化依赖项](https://v3.vite.dev/guide/migration.html#using-esbuild-deps-optimization-at-build-time)。这样就可以避免使用 [`@rollup/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs)，使开发和构建时间的工作方式相同。

鉴于 Rollup v3 将在未来几个月内发布，并且我们将随之推出另一个 Vite 主要版本，我们决定将此模式设为可选，以减少 v3 的范围，并为 Vite 和生态系统提供更多时间来解决构建时新 CJS 互操作方法可能出现的问题。框架可以在 Vite 4 之前按照自己的节奏默认切换到在构建时使用 esbuild 依赖优化。

### HMR 部分接受（实验性）

支持可选的 [HMR 部分接受](https://github.com/vitejs/vite/pull/7324)。此功能可以为在同一模块中导出多个绑定的框架组件解锁更细粒度的 HMR。你可以在 [此提案的讨论](https://github.com/vitejs/vite/discussions/7309) 中了解更多。

## 包体积减小

Vite 关心其发布和安装占用空间；快速安装新应用是一项功能。Vite 捆绑了大多数依赖项，并尽可能尝试使用现代的轻量级替代方案。继续这一持续目标，Vite 3 的发布大小比 v2 小 30%。

|             | 发布大小 | 安装大小 |
| ----------- | :------: | :------: |
| Vite 2.9.14 |  4.38MB  |  19.1MB  |
| Vite 3.0.0  |  3.05MB  |  17.8MB  |
| 减少量      |   -30%   |   -7%    |

部分来说，这种减少是通过将大多数用户不需要的某些依赖项设为可选来实现的。首先，[Terser](https://github.com/terser/terser) 不再默认安装。自从我们在 Vite 2 中已经将 esbuild 作为 JS 和 CSS 的默认压缩器以来，就不再需要此依赖项。如果你使用 `build.minify: 'terser'`，则需要安装它（`npm add -D terser`）。我们还将 [node-forge](https://github.com/digitalbazaar/forge) 移出了 monorepo，将自动生成 https 证书的支持实现为一个新插件：[`@vitejs/plugin-basic-ssl`](https://v3.vite.dev/guide/migration.html#automatic-https-certificate-generation)。由于此功能仅创建未添加到本地存储的不可信证书，因此不值得增加大小。

## 错误修复

由最近加入 Vite 团队的 [@bluwyoo](https://twitter.com/bluwyoo)、[@sapphi_red](https://twitter.com/sapphi_red) 带头进行了一场分类马拉松。在过去的三个月里，Vite 的开放问题从 770 个减少到 400 个。并且这一下降是在新开放的 PR 达到历史最高水平的同时实现的。同时，[@haoqunjiang](https://twitter.com/haoqunjiang) 还策划了一份全面的 [Vite 问题概述](https://github.com/vitejs/vite/discussions/8232)。

[![Vite 中开放问题和拉取请求的图表](../images/v3-open-issues-and-PRs.webp)](https://www.repotrends.com/vitejs/vite)

[![Vite 中新问题和拉取请求的图表](../images/v3-new-open-issues-and-PRs.webp)](https://www.repotrends.com/vitejs/vite)

## 兼容性说明

- Vite 不再支持已达到 EOL 的 Node.js 12 / 13 / 15。现在需要 Node.js 14.18+ / 16+。
- Vite 现在作为 ESM 发布，带有指向 ESM 入口的 CJS 代理以保持兼容性。
- 现代浏览器基线现在针对支持 [原生 ES 模块](https://caniuse.com/es6-module)、[原生 ESM 动态导入](https://caniuse.com/es6-module-dynamic-import) 和 [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta) 功能的浏览器。
- SSR 和库模式中的 JS 文件扩展名现在根据其格式和包类型，为输出 JS 入口和块使用有效的扩展名（`js`、`mjs` 或 `cjs`）。

在 [迁移指南](https://v3.vite.dev/guide/migration.html) 中了解更多。

## Vite 核心升级

在致力于 Vite 3 的同时，我们也改善了协作者对 [Vite 核心](https://github.com/vitejs/vite) 的贡献体验。

- 单元和 E2E 测试已迁移到 [Vitest](https://vitest.dev)，提供了更快更稳定的 DX。此举也作为生态系统中重要基础设施项目的 dog fooding。
- VitePress 构建现在作为 CI 的一部分进行测试。
- Vite 升级到 [pnpm 7](https://pnpm.io/)，跟随生态系统的其余部分。
- Playgrounds 已从 packages 目录移动到 [`/playgrounds`](https://github.com/vitejs/vite/tree/main/playground)。
- 包和 playgrounds 现在是 `"type": "module"`。
- 插件现在使用 [unbuild](https://github.com/unjs/unbuild) 捆绑，[plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx) 和 [plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 已迁移到 TypeScript。

## 生态系统已为 v3 做好准备

我们与生态系统中的项目密切合作，以确保由 Vite 驱动的框架已为 Vite 3 做好准备。[vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) 允许我们在引入回归之前，针对 Vite 的主分支运行生态系统中领先玩家的 CI 并接收及时报告。今天的发布应该很快与大多数使用 Vite 的项目兼容。

## 致谢

Vite 3 是 [Vite 团队](/team) 成员与生态系统项目维护者和其他 Vite 核心协作者共同努力的结果。

我们要感谢所有实施功能、修复、提供反馈并参与 Vite 3 的人：

- Vite 团队成员 [@youyuxi](https://twitter.com/youyuxi)、[@patak_dev](https://twitter.com/patak_dev)、[@antfu7](https://twitter.com/antfu7)、[@bluwyoo](https://twitter.com/bluwyoo)、[@sapphi_red](https://twitter.com/sapphi_red)、[@haoqunjiang](https://twitter.com/haoqunjiang)、[@poyoho](https://github.com/poyoho)、[@Shini_92](https://twitter.com/Shini_92) 和 [@retropragma](https://twitter.com/retropragma)。
- [@benmccann](https://github.com/benmccann)、[@danielcroe](https://twitter.com/danielcroe)、[@brillout](https://twitter.com/brillout)、[@sheremet_va](https://twitter.com/sheremet_va)、[@userquin](https://twitter.com/userquin)、[@enzoinnocenzi](https://twitter.com/enzoinnocenzi)、[@maximomussini](https://twitter.com/maximomussini)、[@IanVanSchooten](https://twitter.com/IanVanSchooten)、[Astro 团队](https://astro.build/)，以及生态系统中帮助塑造 v3 的所有其他框架和插件维护者。
- [@dominikg](https://github.com/dominikg) 因其在 vite-ecosystem-ci 上的工作。
- [@ZoltanKochan](https://twitter.com/ZoltanKochan) 因其在 [pnpm](https://pnpm.io/) 上的工作，以及当我们需要支持时的响应速度。
- [@rixo](https://github.com/rixo) 提供 HMR 部分接受支持。
- [@KiaKing85](https://twitter.com/KiaKing85) 为 Vite 3 发布准备主题，以及 [@\_brc_dd](https://twitter.com/_brc_dd) 致力于 VitePress 内部工作。
- [@CodingWithCego](https://twitter.com/CodingWithCego) 提供新的西班牙语翻译，以及 [@ShenQingchuan](https://twitter.com/ShenQingchuan)、[@hiro-lapis](https://github.com/hiro-lapis) 和其他中文和日文翻译团队成员保持翻译文档最新。

我们还要感谢赞助 Vite 团队的个人和公司，以及投资 Vite 开发的公司：[@antfu7](https://twitter.com/antfu7) 在 Vite 和生态系统上的一些工作是他在 [Nuxt Labs](https://nuxtlabs.com/) 工作的一部分，[StackBlitz](https://stackblitz.com/) 雇佣了 [@patak_dev](https://twitter.com/patak_dev) 全职从事 Vite 工作。

## 下一步

我们将利用接下来的几个月确保所有基于 Vite 构建的项目平稳过渡。因此，第一个次要版本将专注于继续我们的分类工作，重点是新开放的问题。

Rollup 团队正在 [致力于其下一个主要版本](https://twitter.com/lukastaegert/status/1544186847399743488)，将在未来几个月内发布。一旦 Rollup 插件生态系统有时间更新，我们将随之推出新的 Vite 主要版本。这将为我们提供另一次在今年引入更多重大更改的机会，我们可以利用这个机会稳定此版本中引入的一些实验性功能。

如果你有兴趣帮助改进 Vite，最好的加入方式是帮助分类问题。加入 [我们的 Discord](https://chat.vite.dev) 并查找 `#contributing` 频道。或参与我们的 `#docs`，`#help` 他人，或创建插件。我们才刚刚开始。有很多开放的想法可以继续改进 Vite 的 DX。
