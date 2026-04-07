# 环境 API

:::info 候选发布版
环境 API 目前处于候选发布版阶段。我们将在主要版本之间保持 API 的稳定性，以便生态系统可以进行实验并在此基础上构建。但是，请注意 [某些特定 API](/changes/#considering) 仍被视为实验性的。

我们计划在未来的一次主要版本发布中稳定这些新 API（可能会有破坏性变更），一旦下游项目有时间实验新功能并验证它们。

资源：

- [反馈讨论](https://github.com/vitejs/vite/discussions/16358)，我们在此收集关于新 API 的反馈。
- [环境 API PR](https://github.com/vitejs/vite/pull/16471)，新 API 在此实现和审查。

请与我们分享您的反馈。
:::

## 环境的正式化

Vite 6 正式确立了环境的概念。直到 Vite 5，还存在两个隐式环境（`client`，以及可选的 `ssr`）。新的环境 API 允许用户和框架作者创建任意数量的环境，以映射其应用在生产环境中的工作方式。这一新功能需要大量的内部重构，但已努力确保向后兼容性。Vite 6 的初始目标是尽可能平滑地将生态系统迁移到新的主版本，推迟 API 的采用，直到足够的用户迁移以及框架和插件作者验证了新设计。

## 缩小构建与开发之间的差距

对于简单的 SPA/MPA，配置中不会暴露与环境相关的新 API。在内部，Vite 会将选项应用于 `client` 环境，但在配置 Vite 时无需了解此概念。来自 Vite 5 的配置和行为在此应该无缝工作。

当我们转向典型的服务器端渲染 (SSR) 应用时，我们将拥有两个环境：

- `client`：在浏览器中运行应用。
- `ssr`：在 Node（或其他服务器运行时）中运行应用，在发送给浏览器之前渲染页面。

在开发模式下，Vite 在与 Vite 开发服务器相同的 Node 进程中执行服务器代码，从而提供与生产环境非常接近的近似环境。然而，服务器也可能在其他 JS 运行时中运行，例如 [Cloudflare 的 workerd](https://github.com/cloudflare/workerd)，它们具有不同的约束。现代应用也可能在两个以上的环境中运行，例如浏览器、Node 服务器和边缘服务器。Vite 5 无法正确表示这些环境。

Vite 6 允许用户在构建和开发期间配置其应用，以映射其所有环境。在开发模式下，现在可以使用单个 Vite 开发服务器并发地在多个不同环境中运行代码。应用源代码仍然由 Vite 开发服务器转换。在共享的 HTTP 服务器、中间件、解析后的配置和插件流水线之上，Vite 开发服务器现在拥有一组独立的开发环境。每个环境都配置为尽可能匹配生产环境，并连接到执行代码的开发运行时（对于 workerd，服务器代码现在可以在本地 miniflare 中运行）。在客户端，浏览器导入并执行代码。在其他环境中，模块运行器获取并评估转换后的代码。

![Vite 环境](../images/vite-environments.svg)

## 环境配置

对于 SPA/MPA，配置看起来将与 Vite 5 类似。在内部，这些选项用于配置 `client` 环境。

```js
export default defineConfig({
  build: {
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['lib'],
  },
})
```

这一点很重要，因为我们希望保持 Vite 的易用性，并避免在不需要时暴露新概念。

如果应用由多个环境组成，则可以使用 `environments` 配置选项显式配置这些环境。

```js
export default {
  build: {
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['lib'],
  },
  environments: {
    server: {},
    edge: {
      resolve: {
        noExternal: true,
      },
    },
  },
}
```

当未明确文档说明时，环境会继承配置的顶层选项（例如，新的 `server` 和 `edge` 环境将继承 `build.sourcemap: false` 选项）。少数顶层选项（如 `optimizeDeps`）仅适用于 `client` 环境，因为它们作为默认值应用于服务器环境时效果不佳。这些选项在 [参考文档](/config/) 中带有 <NonInheritBadge /> 徽章。`client` 环境也可以通过 `environments.client` 显式配置，但我们建议使用顶层选项进行配置，以便在添加新环境时客户端配置保持不变。

`EnvironmentOptions` 接口公开了所有每个环境的选项。有些环境选项同时适用于 `build` 和 `dev`，例如 `resolve`。还有 `DevEnvironmentOptions` 和 `BuildEnvironmentOptions` 用于开发和构建特定选项（如 `dev.warmup` 或 `build.outDir`）。某些选项（如 `optimizeDeps`）仅适用于开发模式，但为了向后兼容，它们保持为顶层而不是嵌套在 `dev` 中。

```ts
interface EnvironmentOptions {
  define?: Record<string, any>
  resolve?: EnvironmentResolveOptions
  optimizeDeps: DepOptimizationOptions
  consumer?: 'client' | 'server'
  dev: DevOptions
  build: BuildOptions
}
```

`UserConfig` 接口扩展自 `EnvironmentOptions` 接口，允许配置客户端和其他环境的默认值，通过 `environments` 选项进行配置。在开发模式下，`client` 和名为 `ssr` 的服务器环境始终存在。这允许与 `server.ssrLoadModule(url)` 和 `server.moduleGraph` 向后兼容。在构建期间，`client` 环境始终存在，而 `ssr` 环境仅在显式配置时才存在（使用 `environments.ssr` 或为了向后兼容使用 `build.ssr`）。应用不需要为其 SSR 环境使用 `ssr` 名称，例如可以将其命名为 `server`。

```ts
interface UserConfig extends EnvironmentOptions {
  environments: Record<string, EnvironmentOptions>
  // other options
}
```

请注意，一旦环境 API 稳定，`ssr` 顶层属性将被弃用。此选项的作用与 `environments` 相同，但仅针对默认 `ssr` 环境，且仅允许配置少数选项。

## 自定义环境实例

底层配置 API 可用，以便运行时提供商可以为其运行时提供具有适当默认值的环境。这些环境还可以生成其他进程或线程，以便在开发期间在与生产环境更接近的运行时中运行模块。

例如，[Cloudflare Vite 插件](https://developers.cloudflare.com/workers/vite-plugin/) 使用环境 API 在开发期间于 Cloudflare Workers 运行时 (`workerd`) 中运行代码。

```js
import { customEnvironment } from 'vite-environment-provider'

export default {
  build: {
    outDir: '/dist/client',
  },
  environments: {
    ssr: customEnvironment({
      build: {
        outDir: '/dist/ssr',
      },
    }),
  },
}
```

## 向后兼容性

当前的 Vite 服务器 API 尚未弃用，并且与 Vite 5 向后兼容。

`server.moduleGraph` 返回 client 和 ssr 模块图的混合视图。其所有方法都将返回向后兼容的混合模块节点。传递给 `handleHotUpdate` 的模块节点也使用相同的方案。

我们尚不建议切换到环境 API。我们的目标是让大部分用户群先采用 Vite 6，这样插件就不需要维护两个版本。查看未来的破坏性变更部分，以获取有关未来弃用和升级路径的信息：

- [Hooks 中的 `this.environment`](/changes/this-environment-in-hooks)
- [HMR `hotUpdate` 插件 Hook](/changes/hotupdate-hook)
- [迁移到每个环境的 API](/changes/per-environment-apis)
- [使用 `ModuleRunner` API 进行 SSR](/changes/ssr-using-modulerunner)
- [构建期间共享插件](/changes/shared-plugins-during-build)

## 目标用户

本指南为最终用户提供有关环境的基本概念。

插件作者可以使用更一致的 API 与当前环境配置进行交互。如果您基于 Vite 进行构建，[环境 API 插件指南](./api-environment-plugins.md) 描述了可用的扩展插件 API 以支持多个自定义环境的方式。

框架可以决定在不同层级暴露环境。如果您是框架作者，请继续阅读 [环境 API 框架指南](./api-environment-frameworks) 以了解环境 API 的编程方面。

对于运行时提供商，[环境 API 运行时指南](./api-environment-runtimes.md) 解释了如何提供自定义环境供框架和用户使用。
