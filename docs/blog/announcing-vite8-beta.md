---
title: 'Vite 8 Beta：由 Rolldown 驱动的 Vite'
author:
  name: Vite 团队
date: 2025-12-03
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 8 Beta：由 Rolldown 驱动的 Vite
  - - meta
    - property: og:image
      content: https://vite.zhcndoc.com/og-image-announcing-vite8-beta.webp
  - - meta
    - property: og:url
      content: https://vite.zhcndoc.com/blog/announcing-vite8-beta
  - - meta
    - property: og:description
      content: Vite 8 Beta 发布通告
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 8 Beta：由 Rolldown 驱动的 Vite

_2025 年 12 月 3 日_

![Vite 8 Beta 公告封面图片](/og-image-announcing-vite8-beta.webp)

太长不看：首个由 [Rolldown](https://rolldown.rs/) 驱动的 Vite 8 Beta 版本现已可用。Vite 8 带来了显著更快的生产构建速度，并解锁了未来改进的可能性。你可以通过将 `vite` 升级到版本 `8.0.0-beta.0` 并阅读 [迁移指南](/guide/migration) 来尝试新版本。

---

我们很高兴发布 Vite 8 的第一个 Beta 版本。此版本统一了底层工具链，带来了更好的一致性行为，以及显著的生产构建性能提升。Vite 现在使用 [Rolldown](https://rolldown.rs/) 作为其打包工具，取代了之前 esbuild 和 Rollup 的组合。

## 面向 Web 的新打包工具

Vite 之前依赖两个打包工具来满足开发和生产构建的不同需求：

1. esbuild 用于开发期间的快速编译
2. Rollup 用于生产构建的打包、分块和优化

这种方法让 Vite 能够专注于开发者体验和编排，而不是重新发明解析和打包。然而，维护两个独立的打包管道引入了一些不一致性：独立的转换管道、不同的插件系统，以及越来越多的胶水代码以保持开发和生产之间的打包行为一致。

为了解决这个问题，[VoidZero 团队](https://voidzero.dev) 构建了 **Rolldown**，这是下一代打包工具，目标是用于 Vite。它的设计旨在提供：

- **性能**：Rolldown 使用 Rust 编写，以原生速度运行。它匹配 esbuild 的性能水平，并且 [**比 Rollup 快 10–30 倍**](https://github.com/rolldown/benchmarks)。
- **兼容性**：Rolldown 支持与 Rollup 和 Vite 相同的插件 API。大多数 Vite 插件可以在 Vite 8 中开箱即用。
- **更多特性**：Rolldown 为 Vite 解锁了更多高级功能，包括全量打包模式、更灵活的分块控制、模块级持久缓存、模块联邦等等。

## 统一工具链

Vite 打包工具交换的影响超出了性能范围。打包工具利用解析器、解析器、转换器和压缩器。Rolldown 使用 Oxc（另一个由 VoidZero 领导的项目）来实现这些目的。

**这使得 Vite 成为由同一团队维护的端到端工具链的入口点：构建工具 (Vite)、打包工具 (Rolldown) 和编译器 (Oxc)。**

这种对齐确保了整个堆栈的行为一致性，并允许我们随着 JavaScript 的不断发展快速采用和对齐新的语言规范。它还解锁了大量以前仅靠 Vite 无法完成的改进。例如，我们可以利用 Oxc 的语义分析在 Rolldown 中执行更好的 tree-shaking。

## Vite 如何迁移到 Rolldown

迁移到由 Rolldown 驱动的 Vite 是一个基础性的变化。因此，我们的团队采取了慎重的步骤来实施它，而不牺牲稳定性或生态系统兼容性。

首先，一个独立的 `rolldown-vite` 包 [作为技术预览版发布](https://voidzero.dev/posts/announcing-rolldown-vite)。这使我们能够与早期采用者合作，而不影响稳定版的 Vite。早期采用者受益于 Rolldown 的性能提升，同时提供了宝贵的反馈。亮点包括：

- Linear 的生产构建时间从 46 秒减少到 6 秒
- Ramp 将构建时间减少了 57%
- Mercedes-Benz.io 将构建时间削减了高达 38%
- Beehiiv 将构建时间减少了 64%

接下来，我们建立了一个测试套件，用于针对 `rolldown-vite` 验证关键的 Vite 插件。这个 CI 任务帮助我们尽早发现回归问题和兼容性问题，特别是对于 SvelteKit、react-router 和 Storybook 等框架和元框架。

最后，我们构建了一个兼容层，帮助开发者从 Rollup 和 esbuild 选项迁移到相应的 Rolldown 选项。

因此，每个人都有一条平滑的迁移路径通往 Vite 8。

## 迁移到 Vite 8 Beta

由于 Vite 8 触及核心构建行为，我们专注于保持配置 API 和插件钩子不变。我们创建了一个 [迁移指南](/guide/migration) 来帮助你升级。

有两种可用的升级路径：

1. **直接升级：** 更新 `package.json` 中的 `vite` 并运行常规的开发和构建命令。
2. **渐进式迁移：** 从 Vite 7 迁移到 `rolldown-vite` 包，然后再迁移到 Vite 8。这允许你识别仅与 Rolldown 相关的不兼容性或问题，而无需对 Vite 进行其他更改。（推荐用于大型或复杂项目）

> [!IMPORTANT]
> 如果你依赖特定的 Rollup 或 esbuild 选项，可能需要对 Vite 配置进行一些调整。请参阅 [迁移指南](/guide/migration) 获取详细说明和示例。
> 与所有非稳定的主要版本一样，建议在升级后进行彻底测试以确保一切按预期工作。请务必报告任何 [问题](https://github.com/vitejs/rolldown-vite/issues)。

如果你使用的框架或工具将 Vite 作为依赖项，例如 Astro、Nuxt 或 Vitest，你必须在 `package.json` 中覆盖 `vite` 依赖项，具体操作取决于你的包管理器：

:::code-group

```json [npm]
{
  "overrides": {
    "vite": "8.0.0-beta.0"
  }
}
```

```json [Yarn]
{
  "resolutions": {
    "vite": "8.0.0-beta.0"
  }
}
```

```json [pnpm]
{
  "pnpm": {
    "overrides": {
      "vite": "8.0.0-beta.0"
    }
  }
}
```

```json [Bun]
{
  "overrides": {
    "vite": "8.0.0-beta.0"
  }
}
```

:::

添加这些覆盖后，重新安装依赖项，然后像往常一样启动开发服务器或构建项目。

## Vite 8 中的额外特性

除了搭载 Rolldown 外，Vite 8 还带来了：

- **内置 tsconfig `paths` 支持：** 开发者可以通过将 [`resolve.tsconfigPaths`](/config/shared-options.md#resolve-tsconfigpaths) 设置为 `true` 来启用它。此功能具有较小的性能成本，默认情况下未启用。
- **`emitDecoratorMetadata` 支持：** Vite 8 现在内置自动支持 TypeScript 的 [`emitDecoratorMetadata` 选项](https://www.typescriptlang.org/tsconfig/#emitDecoratorMetadata)。有关更多详细信息，请参阅 [特性](/guide/features.md#emitdecoratormetadata) 页面。

## 展望未来

速度一直是 Vite 的定义性特征。与 Rolldown 以及延伸的 Oxc 集成意味着 JavaScript 开发者将受益于 Rust 的速度。升级到 Vite 8 应该仅仅通过使用 Rust 就能带来性能提升。

我们也很高兴很快推出 Vite 的全量打包模式 (Full Bundle Mode)，这将极大地提高大型项目的 Vite 开发服务器速度。初步结果显示开发服务器启动速度加快 3 倍，全量重载速度加快 40%，网络请求减少 10 倍。

另一个定义性的 Vite 特性是插件生态系统。我们希望 JavaScript 开发者继续使用他们熟悉的语言 JavaScript 来扩展和定制 Vite，同时受益于 Rust 的性能提升。我们的团队正在与 VoidZero 团队合作，加速在这些基于 Rust 的系统中使用 JavaScript 插件。

目前处于实验阶段的即将进行的优化：

- [**原始 AST 传输**](https://github.com/oxc-project/oxc/issues/2409)。允许 JavaScript 插件以最小的开销访问 Rust 生成的 AST。
- [**原生 MagicString 转换**](https://rolldown.rs/in-depth/native-magic-string#native-magicstring)。简单的自定义转换，逻辑在 JavaScript 中，计算在 Rust 中。

## **联系我们**

如果你尝试了 Vite 8 beta，我们很乐意听取你的反馈！请报告任何问题或分享你的经验：

- **Discord**：加入我们的 [社区服务器](https://chat.vite.dev/) 进行实时讨论
- **GitHub**：在 [GitHub 讨论区](https://github.com/vitejs/vite/discussions) 分享反馈
- **问题**：在 [rolldown-vite 仓库](https://github.com/vitejs/rolldown-vite/issues) 报告错误和回归问题
- **性能提升**：在 [rolldown-vite-perf-wins 仓库](https://github.com/vitejs/rolldown-vite-perf-wins) 分享你改进的构建时间

我们感谢所有的报告和复现案例。它们帮助我们朝着稳定版 8.0.0 的发布迈进。
