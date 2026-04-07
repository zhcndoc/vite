---
title: Vite 8.0 发布
author:
  name: Vite 团队
date: 2026-03-12
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 8.0 发布
  - - meta
    - property: og:image
      content: https://vite.zhcndoc.com/og-image-announcing-vite8.webp
  - - meta
    - property: og:url
      content: https://vite.zhcndoc.com/blog/announcing-vite8
  - - meta
    - property: og:description
      content: Vite 8 发布公告
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 8.0 发布

_2026 年 3 月 12 日_

![Vite 8 公告封面图](/og-image-announcing-vite8.webp)

我们很高兴地宣布 Vite 8 的稳定版发布！当 Vite 首次推出时，我们对两个打包工具做出了务实的选择：开发阶段使用 esbuild 以保证速度，生产构建使用 Rollup 以保证优化。这个选择多年来一直很好地服务于我们。我们非常感谢 Rollup 和 esbuild 的维护者。没有他们，Vite 就不会成功。如今，它合二为一：Vite 8 搭载 [Rolldown](https://rolldown.rs/) 作为其单一的、统一的、基于 Rust 的打包工具，提供高达 10-30 倍更快的构建速度，同时保持完整的插件兼容性。这是自 Vite 2 以来最重大的架构变更。

Vite 现在的周下载量达到 6500 万次，生态系统随着每个版本的发布持续增长。为了帮助开发者驾驭不断扩展的插件领域，我们还推出了 [registry.vite.dev](https://registry.vite.dev)，这是一个可搜索的 Vite、Rolldown 和 Rollup 插件目录，每日从 npm 收集插件数据。

快速链接：

- [文档](/)
- 翻译：[简体中文](https://cn.vite.dev/)，[日本語](https://ja.vite.dev/)，[Español](https://es.vite.dev/)，[Português](https://pt.vite.dev/)，[한국어](https://ko.vite.dev/)，[Deutsch](https://de.vite.dev/)，[فارسی](https://fa.vite.dev/)
- [迁移指南](/guide/migration)
- [GitHub 更新日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

使用 [vite.new](https://vite.new) 在线体验 Vite 8，或运行 `pnpm create vite` 在本地搭建一个你偏好框架的 Vite 应用。查看 [入门指南](/guide/) 获取更多信息。

我们邀请你帮助我们改进 Vite（加入超过 [1.2K 名 Vite Core 贡献者](https://github.com/vitejs/vite/graphs/contributors) 的行列）、我们的依赖项，或生态系统中的插件和项目。在我们的 [贡献指南](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md) 了解更多。一个好的开始方式是 [甄别 issue](https://github.com/vitejs/vite/issues)，[审查 PR](https://github.com/vitejs/vite/pulls)，基于开放 issue 发送测试 PR，以及在 [讨论区](https://github.com/vitejs/vite/discussions) 或 Vite Land 的 [帮助论坛](https://discord.com/channels/804011606160703521/1019670660856942652) 中支持他人。如果你有问题，加入我们的 [Discord 社区](https://chat.vite.dev) 并在 [#contributing 频道](https://discord.com/channels/804011606160703521/804439875226173480) 与我们交谈。

在 [Bluesky](https://bsky.app/profile/vite.dev)、[X](https://twitter.com/vite_js) 或 [Mastodon](https://webtoo.ls/@vite) 上关注我们，以保持更新并与基于 Vite 构建的其他开发者联系。

## 由 Rolldown 驱动的 Vite

### 问题

自最早版本以来，Vite 依赖两个独立的打包工具来服务于不同的需求。[esbuild](https://esbuild.github.io/) 处理开发期间的快速编译（依赖预打包和 TypeScript/JSX 转换），让开发体验感觉瞬间完成。[Rollup](https://rollupjs.org/) 处理生产打包、分块和优化，其丰富的插件 API 支撑了整个 Vite 插件生态系统。

这种双打包工具方法多年来一直很好地服务于 Vite。它使我们能够专注于开发者体验和编排，而不是从头重新发明解析和打包。但它带来了权衡。两个独立的转换管道意味着两个独立的插件系统，以及越来越多的胶水代码需要保持两个管道同步。关于不一致模块处理的边缘情况随时间积累，一个管道中的每次对齐修复都有风险在另一个管道中引入差异。

### 解决方案

[Rolldown](https://rolldown.rs/) 是一个由 [VoidZero](https://voidzero.dev) 团队构建的基于 Rust 的打包工具，旨在直面解决这些挑战。它的设计有三个目标：

- **性能：** 用 Rust 编写，Rolldown 以原生速度运行。在基准测试中，它 [比 Rollup 快 10-30 倍](https://github.com/rolldown/benchmarks)，匹配 esbuild 的性能水平。
- **兼容性：** Rolldown 支持与 Rollup 和 Vite 相同的插件 API。大多数现有的 Vite 插件可以在 Vite 8 中开箱即用。
- **高级特性：** 单一统一的打包工具解锁了在双打包工具设置中困难或不可能的能力，包括完整打包模式、更灵活的分块、模块级持久缓存和模块联邦支持。

### 通往稳定的旅程

迁移到 Rolldown 是深思熟虑且由社区驱动的。首先，一个单独的 [`rolldown-vite`](https://voidzero.dev/posts/announcing-rolldown-vite) 包作为技术预览发布，允许早期采用者测试 Rolldown 的集成，而不影响 Vite 的稳定版本。来自这些早期采用者的反馈是无价的。他们通过各种形状和规模的真实代码库推动集成，暴露了边缘情况和兼容性问题，我们得以在更广泛发布前解决。我们还建立了专用的 CI 套件，针对新打包工具验证关键 Vite 插件和框架，早期捕获回归并建立对迁移路径的信心。

2025 年 12 月，我们发布了 [Vite 8 beta](/blog/announcing-vite8-beta)，Rolldown 完全集成。在 beta 期间，Rolldown 本身从 beta 进展到发布候选版本，由 Vite 社区的测试和反馈驱动持续改进。

### 实际性能

在 `rolldown-vite` 的预览和 beta 阶段，几家公司报告了生产构建时间的可衡量减少：

- **Linear：** 生产构建时间从 46 秒降至 6 秒
- **Ramp：** 构建时间减少 57%
- **Mercedes-Benz.io：** 构建时间减少高达 38%
- **Beehiiv：** 构建时间减少 64%

对于大型项目，影响可能尤其明显，我们预计随着 Rolldown 继续发展，会有进一步的改进。

### 统一的工具链

随着 Vite 8 的发布，Vite 成为端到端工具链的入口点，团队紧密合作：构建工具 (Vite)、打包工具 (Rolldown) 和编译器 ([Oxc](https://oxc.rs/))。这种对齐确保了整个堆栈的一致行为，从解析和解析到转换和压缩。这也意味着我们可以随着 JavaScript 的发展快速采用新的语言规范。通过跨层深度集成，我们可以追求以前无法达到的优化，例如利用 Oxc 的语义分析在 Rolldown 中实现更好的 tree-shaking。

### 感谢社区

没有更广泛的社区，这一切都不可能实现。我们要向框架团队（[SvelteKit](https://svelte.dev/docs/kit/introduction)、[React Router](https://reactrouter.com/)、[Storybook](https://storybook.js.org/)、[Astro](https://astro.build/)、[Nuxt](https://nuxt.com/) 以及许多其他团队）致以深深的感谢，他们早期测试了 `rolldown-vite`，提交了详细的错误报告，并与我们合作解决兼容性问题。我们同样感谢每一位尝试 beta、分享构建时间改进并报告了帮助我们完善此版本的粗糙边缘的开发者。你们在真实项目上测试迁移的意愿帮助使向 Rolldown 的过渡更顺畅和可靠。

## Node.js 支持

Vite 8 需要 Node.js 20.19+、22.12+，与 Vite 7 的要求相同。这些范围确保 Node.js 支持无需标志的 `require(esm)`，允许 Vite 仅作为 ESM 分发。

## 额外特性

除了 Rolldown 集成外，Vite 8 还包括几个值得注意的特性：

- **集成开发工具：** Vite 8 附带 [`devtools`](/config/shared-options#devtools) 选项以启用 [Vite Devtools](https://devtools.vite.dev/)，这是一个用于调试和分析的开发者工具。Vite Devtools 直接从开发服务器提供对你的 Vite 驱动项目的更深入见解。

- **内置 tsconfig `paths` 支持：** 开发者可以通过将 [`resolve.tsconfigPaths`](/config/shared-options.md#resolve-tsconfigpaths) 设置为 `true` 来启用 TypeScript 路径别名解析。这有少量的性能成本，默认不启用。

- **`emitDecoratorMetadata` 支持：** Vite 8 现在内置自动支持 TypeScript 的 `emitDecoratorMetadata` 选项，消除了对外部插件的需求。详见 [特性](/guide/features.md#emitdecoratormetadata) 页面。

- **Wasm SSR 支持：** [`.wasm?init` 导入](/guide/features#webassembly) 现在在 SSR 环境中工作，将 Vite 的 WebAssembly 特性扩展到服务器端渲染。

- **浏览器控制台转发：** Vite 8 可以将浏览器控制台日志和错误转发到开发服务器终端。当与编程代理一起工作时，这尤其有用，因为运行时客户端错误在 CLI 输出中变得可见。使用 [`server.forwardConsole`](/config/server-options.md#server-forwardconsole) 启用它，当检测到编程代理时会自动激活。

## `@vitejs/plugin-react` v6

伴随着 Vite 8，我们正在发布 `@vitejs/plugin-react` v6。该插件使用 Oxc 进行 React Refresh 转换。Babel 不再是依赖项，安装体积更小。

对于需要 [React Compiler](https://react.dev/learn/react-compiler) 的项目，v6 提供一个 `reactCompilerPreset` 辅助函数，与 `@rolldown/plugin-babel` 一起工作，为你提供一个明确的可选路径，而不增加默认设置的负担。

详见 [发布说明](https://github.com/vitejs/vite-plugin-react/releases/tag/plugin-react%406.0.0) 获取更多详情。

注意 v5 仍然适用于 Vite 8，所以你可以在升级 Vite 后升级插件。

## 展望未来

Rolldown 的集成开启了改进和优化的大门。以下是我们接下来的工作重点：

- **全打包模式**（实验性）：此模式在开发期间打包模块，类似于生产构建。初步结果显示开发服务器启动速度加快 3 倍，全量重载速度加快 40%，网络请求减少 10 倍。这对于无打包开发方式遇到扩展限制的大型项目尤其具有影响力。

- [**原始 AST 传输**](https://github.com/oxc-project/oxc/issues/2409)：允许 JavaScript 插件以最小的序列化开销访问 Rust 生成的 AST，弥合了 Rust 内部结构与 JS 插件代码之间的性能差距。

- [**原生 MagicString 转换**](https://rolldown.rs/in-depth/native-magic-string#native-magicstring)：支持自定义转换，其中逻辑位于 JavaScript 中，但字符串操作计算在 Rust 中运行。

- **稳定环境 API**：我们正在努力使环境 API 稳定下来。生态系统已开始定期会议，以便更好地协作。

## 安装大小

我们希望透明地公开 Vite 安装大小的变化。Vite 8 本身比 Vite 7 大约大 15 MB。这主要来自两个方面：

- **来自 lightningcss 的约 10 MB**：lightningcss 以前是可选的 peer 依赖，现在是一个正常依赖，以便开箱即用地提供更好的 CSS 压缩。
- **来自 Rolldown 的约 5 MB**：Rolldown 二进制文件比 esbuild + Rollup 大，主要是由于性能优化优先考虑速度而非二进制大小。

随着 Rolldown 的成熟，我们将继续监控并努力减少安装大小。

## 迁移到 Vite 8

对于大多数项目来说，升级到 Vite 8 应该是一个平滑的过程。我们构建了一个兼容层，可以自动将现有的 `esbuild` 和 `rollupOptions` 配置转换为其 Rolldown 和 Oxc 等效项，因此许多项目无需任何配置更改即可运行。

对于更大或更复杂的项目，我们建议采用渐进式迁移路径：首先在 Vite 7 上从 `vite` 切换到 `rolldown-vite` 包，以隔离任何 Rolldown 特有的问题，然后再升级到 Vite 8。这种两步法使得很容易识别任何问题是由打包器更改引起的还是由其他 Vite 8 更改引起的。

升级前请查阅详细的 [迁移指南](/guide/migration)。完整的更改列表位于 [Vite 8 变更日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md) 中。

## 感谢 Rollup 和 esbuild

随着 Vite 转向 Rolldown，我们想借此机会向使 Vite 成为可能的两个项目表达深深的感激之情。

Rollup 从一开始就是 Vite 的生产环境打包器。其优雅的插件 API 设计证明构思如此精良，以至于 Rolldown 也采用了它，而 Vite 的整个插件生态系统的存在正是因为 Rollup 奠定的基础。Rollup 架构的质量和周到性塑造了 Vite 对可扩展性的思考方式。感谢 [Rich Harris](https://github.com/Rich-Harris) 创建了 Rollup，感谢 [Lukas Taegert-Atkinson](https://github.com/lukastaegert) 和 Rollup 团队维护并将其演变成对 Web 工具生态系统产生如此持久影响的项目。

esbuild 从早期就开始为 Vite 提供惊人的快速开发体验：依赖预打包、TypeScript 和 JSX 转换在几毫秒内完成而不是几百毫秒。esbuild 证明了构建工具可以快几个数量级，它的速度树立了标杆，启发了整整一代基于 Rust 和 Go 的工具。感谢 [Evan Wallace](https://github.com/evanw) 向我们所有人展示了什么是可能的。

没有这两个项目，Vite 就不会像今天这样存在。即使我们随着 Rolldown 向前迈进，Rollup 和 esbuild 的影响也深深嵌入在 Vite 的 DNA 中，我们感激它们为生态系统所做的一切。您可以在我们的 [致谢](/acknowledgements) 页面了解更多关于 Vite 依赖的所有项目和人员的信息。

## 致谢

Vite 8 由 [sapphi-red](https://github.com/sapphi-red) 和 [Vite 团队](/team) 领导，并得到了广大贡献者、下游维护者和插件作者的帮助。我们要感谢 [Rolldown 团队](https://rolldown.rs/team) 的紧密合作，使基于 Rolldown 的 Vite 8 成为可能。我们也特别感谢所有参与 `rolldown-vite` 预览和 Vite 8 beta 阶段的人。你们的测试、错误报告和反馈使 Rolldown 迁移成为可能，并将这个版本塑造成为我们引以为傲的作品。

Vite 由 [VoidZero](https://voidzero.dev) 带给您，并与 [Bolt](https://bolt.new/) 和 [NuxtLabs](https://nuxtlabs.com/) 合作。我们还要感谢我们在 [Vite 的 GitHub 赞助商](https://github.com/sponsors/vitejs) 和 [Vite 的 Open Collective](https://opencollective.com/vite) 上的赞助商。
