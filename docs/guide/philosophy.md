# 项目理念

## 精简可扩展的核心

Vite 旨在开箱即用地支持构建 Web 应用的最常见模式，同时长期保持 [Vite 核心](https://github.com/vitejs/vite) 的精简和可维护性。我们相信支持多样化用例的最佳方式是提供强大的原语和 API 供插件构建，并且我们积极扩展核心以使 Vite 更具可扩展性。[Vite 的插件系统](./api-plugin.md) 基于 Rollup 插件 API 的超集，它使得像 [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) 这样的插件以及许多 [维护良好的插件](https://registry.vite.dev/plugins) 能够满足您的需求。Vite 的打包器 [Rolldown](https://rolldown.rs/) 保持与 Rollup 插件接口的兼容性，因此插件通常可以在 Vite 和纯 Rollup 项目之间通用。

## 推动现代 Web 发展

Vite 提供了主张鲜明的功能，以推动编写现代代码。例如：

- 源代码只能使用 ESM 编写，非 ESM 依赖需要 [预打包为 ESM](./dep-pre-bundling) 才能工作。
- 鼓励使用 [`new Worker` 语法](./features#web-workers) 编写 Web workers 以遵循现代标准。
- Node.js 模块不能在浏览器中使用。

在添加新功能时，遵循这些模式以创建面向未来的 API，这可能并不总是与其他构建工具兼容。

## 务实的性能方法

Vite 自 [起源](./why.md) 以来就一直专注于性能。其开发服务器架构允许 HMR 在项目规模扩大时保持快速。Vite 基于原生工具（包括 [Oxc 工具链](https://oxc.rs/) 和 [Rolldown](https://rolldown.rs/)）来实现密集型任务，但将其余代码保留在 JS 中以平衡速度与灵活性。必要时，框架插件将利用 [Babel](https://babeljs.io/) 来编译用户代码。得益于 Rolldown 的 Rollup 插件兼容性，Vite 可以访问广泛的插件生态系统。

## 基于 Vite 构建框架

虽然用户可以直接使用 Vite，但它作为创建框架的工具更为出色。Vite 核心与框架无关，但每个 UI 框架都有完善的插件。其 [JS API](./api-javascript.md) 允许应用框架作者使用 Vite 功能为其用户创建定制化的体验。Vite 包括对 [SSR 原语](./ssr.md) 的支持，这些原语通常出现在更高级的工具中，但对于构建现代 Web 框架至关重要。Vite 插件通过提供框架间共享的方式完善了这一图景。当与 [后端框架](./backend-integration.md) 如 [Ruby](https://vite-ruby.netlify.app/) 和 [Laravel](https://laravel.com/docs/vite) 配对时，Vite 也非常合适。

## 活跃的生态系统

Vite 的演进是框架和插件维护者、用户以及 Vite 团队之间的合作。我们鼓励一旦项目采用 Vite 后就积极参与 Vite 核心的开发。我们与生态系统中的主要项目密切合作，以最小化每个版本的回归，并借助 [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) 等工具提供帮助。它允许我们在选定的 PR 上运行使用 Vite 的主要项目的 CI，并让我们清楚地了解生态系统对发布的反应状态。我们致力于在回归影响用户之前修复它们，并允许项目在发布后尽快更新到下一个版本。如果您正在使用 Vite，我们邀请您加入 [Vite 的 Discord](https://chat.vite.dev) 并参与到项目中来。
