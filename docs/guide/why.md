# 为什么选择 Vite

随着 Web 应用程序的规模和复杂性不断增长，用于构建它们的工具也难以跟上步伐。在大型项目上工作的开发者经历了痛苦缓慢的开发服务器启动、迟钝的热更新以及漫长的生产构建时间。每一代构建工具都比上一代有所改进，但这些问题依然存在。

Vite 的创建正是为了解决这个问题。它不是渐进式地改进现有方法，而是重新思考了在开发期间应该如何提供代码。从那以后，Vite 经历了多个主要版本的演进，每次都适应生态系统中的新能力：从利用浏览器中的原生 ES 模块，到采用完全基于 Rust 的工具链。

如今，Vite 为许多框架和工具提供动力。它的架构旨在随着 Web 平台演进，而不是锁定在任何单一方法上，使其成为您可以长期构建的基础。

## 起源

当 Vite 最初被创建时，浏览器刚刚广泛支持 [ES 模块](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)（ESM），这是一种直接加载 JavaScript 文件的方式，无需先使用工具将它们打包成单个文件。传统的构建工具（通常称为*打包工具*）会在浏览器中显示任何内容之前预先处理整个应用程序。应用程序越大，等待时间越长。

Vite 采取了不同的方法。它将工作分为两部分：

- **依赖**（很少变化的库）使用快速的原生工具进行一次 [预打包](./dep-pre-bundling.md)，以便它们可以立即可用。
- **源代码**（经常变化的应用程序代码）通过原生 ESM 按需服务。浏览器只加载当前页面所需的内容，Vite 会在请求时转换每个文件。

这意味着无论应用程序大小如何，开发服务器启动几乎是瞬间完成的。当您编辑文件时，Vite 使用原生 ESM 上的 [热模块替换](./features.md#hot-module-replacement)（HMR）仅更新浏览器中的该模块，无需完整页面重新加载或等待重新构建。

<script setup>
import bundlerSvg from '../images/bundler.svg?raw'
import esmSvg from '../images/esm.svg?raw'
</script>
<svg-image :svg="bundlerSvg" />

_在基于打包的开发服务器中，整个应用程序在提供服务之前会被打包。_

<svg-image :svg="esmSvg" />

_在基于 ESM 的开发服务器中，模块会在浏览器请求时按需服务。_

Vite 并不是第一个探索这种方法的工具。[Snowpack](https://www.snowpack.dev/) 开创了无打包开发并启发了 Vite 的依赖预打包。Preact 团队的 [WMR](https://github.com/preactjs/wmr) 启发了在开发和构建中都能工作的通用插件 API。[@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) 影响了 Vite 1.0 的服务器架构。Vite 在这些想法的基础上建立并将其发扬光大。

尽管无打包的 ESM 在开发期间效果很好，但由于嵌套导入带来的额外网络往返，在生产环境中交付它仍然效率低下。这就是为什么 [打包仍然是必要的](https://rolldown.rs/in-depth/why-bundlers) 用于优化的生产构建。

## 与生态系统共同成长

随着 Vite 的成熟，框架开始采用它作为构建层。它的 [插件 API](./api-plugin.md) 基于 Rollup 的约定，使得集成变得自然，无需框架绕过 Vite 的内部结构。[Nuxt](https://nuxt.com/)、[SvelteKit](https://svelte.dev/docs/kit)、[Astro](https://astro.build/)、[React Router](https://reactrouter.com/)、[Analog](https://analogjs.org/)、[SolidStart](https://start.solidjs.com/) 等选择 Vite 作为它们的基础。像 [Vitest](https://vitest.dev/) 和 [Storybook](https://storybook.js.org/) 这样的工具也基于它构建，将 Vite 的影响扩展到应用程序打包之外。像 [Laravel](https://laravel.com/docs/vite) 和 [Ruby on Rails](https://vite-ruby.netlify.app/) 这样的后端框架也将 Vite 集成到它们的前端资源管道中。

这种增长不是单向的。生态系统塑造了 Vite，正如 Vite 塑造了生态系统一样。Vite 团队运行 [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci)，它针对每个 Vite 更改测试主要的生态系统项目。生态系统健康不是事后想法。它是发布过程的一部分。

## 统一的工具链

Vite 最初依赖于两个独立的底层工具：[esbuild](https://esbuild.github.io/) 用于开发期间的快速编译，[Rollup](https://rollupjs.org/) 用于生产构建中的彻底优化。这可行，但维护两个管道引入了不一致：不同的转换行为、独立的插件系统，以及越来越多的用于保持它们一致的胶水代码。

[Rolldown](https://rolldown.rs/) 被构建用来将两者统一为一个打包工具：用 Rust 编写以获得原生速度，并与生态系统已经依赖的相同插件 API 兼容。它使用 [Oxc](https://oxc.rs/) 进行解析、转换和压缩。这为 Vite 提供了一个端到端的工具链，其中构建工具、打包工具和编译器一起维护并作为一个单元演进。

结果是从开发到 [生产](./build.md) 的一致管道。迁移是谨慎完成的：首先发布 [技术预览](https://voidzero.dev/posts/announcing-rolldown-vite)，以便早期采用者可以验证更改，生态系统 CI 尽早发现兼容性问题，并且兼容层保留了现有配置。

## Vite 的未来方向

Vite 的架构仍在不断发展。几项工作正在塑造它的未来：

- **全量打包模式**：当 Vite 被创建时，无打包的 ESM 是正确的权衡，因为没有工具既足够快又拥有在开发期间打包所需的 HMR 和插件能力。Rolldown 改变了这一点。由于异常庞大的代码库可能会因为大量未打包的网络请求而导致页面加载缓慢，团队正在探索一种模式，其中开发服务器像生产环境一样打包代码，以减少网络开销。

- **环境 API**：[环境 API](./api-environment-instances.md) 不让“客户端”和"SSR"作为仅有的两个构建目标，而是让框架定义自定义环境（边缘运行时、服务工作者和其他部署目标），每个环境都有各自的模块解析和执行规则。随着代码运行位置和方式的持续多样化，Vite 的模型也随之扩展。

- **随 JavaScript 演进**：随着 Oxc 和 Rolldown 与 Vite 紧密合作，新的语言功能和标准可以在整个工具链中快速采用，无需等待上游依赖。

Vite 的目标不是成为最终的工具，而是成为一个能够随着 Web 平台以及在其上构建的开发者共同演进的工具。
