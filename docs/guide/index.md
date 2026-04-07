# 入门指南

<audio id="vite-audio">
  <source src="/vite.mp3" type="audio/mpeg">
</audio>

## 概述

Vite（法语单词，意为“快速”，发音为 `/viːt/`<button style="border:none;padding:3px;border-radius:4px;vertical-align:bottom" id="play-vite-audio" aria-label="发音" onclick="document.getElementById('vite-audio').play();"><svg style="height:2em;width:2em"><use href="../images/voice.svg?no-inline#voice" /></svg></button>，类似 "veet"）是一个构建工具，旨在为现代 Web 项目提供更快、更轻量的开发体验。它由两个主要部分组成：

- 一个开发服务器，在 [原生 ES 模块](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 之上提供 [丰富的功能增强](./features)，例如极快的 [热模块替换 (HMR)](./features#hot-module-replacement)。

- 一个构建命令，使用 [Rolldown](https://rolldown.rs) 打包你的代码，预配置为输出高度优化的生产静态资源。

Vite 采用约定式风格，开箱即用。在 [功能指南](./features) 中阅读相关内容。通过 [插件](./using-plugins) 可以支持框架或与其他工具集成。[配置部分](../config/) 解释了如何根据需要将 Vite 适配到你的项目。

Vite 还可通过其 [插件 API](./api-plugin) 和 [JavaScript API](./api-javascript) 高度扩展，并支持完整类型。

你可以在 [为什么选择 Vite](./why) 部分了解更多关于项目背后的理由。

<ScrimbaLink href="https://scrimba.com/intro-to-vite-c03p6pbbdq?via=vite" title="Scrimba 上的免费 Vite 课程">通过 Scrimba 上的互动教程学习 Vite</ScrimbaLink>

## 浏览器支持

在开发期间，Vite 假设使用现代浏览器。这意味着浏览器支持大多数最新的 JavaScript 和 CSS 特性。因此，Vite 将 [`esnext` 设置为转换目标](https://oxc.rs/docs/guide/usage/transformer/lowering.html#target)。这防止了语法降级，让 Vite 提供的模块尽可能接近原始源代码。Vite 注入一些运行时代码以使开发服务器工作。此代码使用了每次主要版本发布时 [Baseline](https://web-platform-dx.github.io/web-features/) 新可用的特性（本次主要版本为 2026-01-01）。

对于生产构建，Vite 默认目标为 [Baseline](https://web-platform-dx.github.io/web-features/) 广泛可用的浏览器。这些是至少 2.5 年前发布的浏览器。可以通过配置降低目标。此外，可以通过官方的 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 支持旧版浏览器。查看 [生产构建](./build) 部分了解更多详情。

## 在线尝试 Vite

你可以在 [StackBlitz](https://vite.new/) 上在线尝试 Vite。它直接在浏览器中运行基于 Vite 的构建设置，因此几乎与本地设置相同，但不需要在你的机器上安装任何东西。你可以导航到 `vite.new/{template}` 来选择要使用的框架。

支持的模板预设如下：

|             JavaScript              |                TypeScript                 |
| :---------------------------------: | :---------------------------------------: |
| [vanilla](https://vite.new/vanilla) | [vanilla-ts](https://vite.new/vanilla-ts) |
|     [vue](https://vite.new/vue)     |     [vue-ts](https://vite.new/vue-ts)     |
|   [react](https://vite.new/react)   |   [react-ts](https://vite.new/react-ts)   |
|  [preact](https://vite.new/preact)  |  [preact-ts](https://vite.new/preact-ts)  |
|     [lit](https://vite.new/lit)     |     [lit-ts](https://vite.new/lit-ts)     |
|  [svelte](https://vite.new/svelte)  |  [svelte-ts](https://vite.new/svelte-ts)  |
|   [solid](https://vite.new/solid)   |   [solid-ts](https://vite.new/solid-ts)   |
|    [qwik](https://vite.new/qwik)    |    [qwik-ts](https://vite.new/qwik-ts)    |

## 搭建你的第一个 Vite 项目

::: code-group

```bash [npm]
$ npm create vite@latest
```

```bash [Yarn]
$ yarn create vite
```

```bash [pnpm]
$ pnpm create vite
```

```bash [Bun]
$ bun create vite
```

```bash [Deno]
$ deno init --npm vite
```

:::

然后按照提示操作！

<ScrimbaLink href="https://scrimba.com/intro-to-vite-c03p6pbbdq/~0yhj?via=vite" title="搭建你的第一个 Vite 项目">在 Scrimba 上观看互动课程</ScrimbaLink>

::: tip 兼容性说明
Vite 需要 [Node.js](https://nodejs.org/en/) 版本 20.19+ 或 22.12+。但是，某些模板需要更高的 Node.js 版本才能工作，如果你的包管理器发出警告，请升级。
:::

:::: details 使用命令行选项运行 create vite

你也可以通过额外的命令行选项直接指定项目名称和想要使用的模板。例如，要搭建一个 Vite + Vue 项目，运行：

::: code-group

```bash [npm]
# npm 7+，需要额外的双破折号：
$ npm create vite@latest my-vue-app -- --template vue
```

```bash [Yarn]
$ yarn create vite my-vue-app --template vue
```

```bash [pnpm]
$ pnpm create vite my-vue-app --template vue
```

```bash [Bun]
$ bun create vite my-vue-app --template vue
```

```bash [Deno]
$ deno init --npm vite my-vue-app --template vue
```

:::

查看 [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) 了解更多关于每个支持模板的详情：`vanilla`、`vanilla-ts`、`vue`、`vue-ts`、`react`、`react-ts`、`react-swc`、`react-swc-ts`、`preact`、`preact-ts`、`lit`、`lit-ts`、`svelte`、`svelte-ts`、`solid`、`solid-ts`、`qwik`、`qwik-ts`。

你可以使用 `.` 作为项目名称，在当前目录中搭建。

要创建没有交互提示的项目，可以使用 `--no-interactive` 标志。

::::

## 社区模板

create-vite 是一个工具，用于从流行框架的基础模板快速启动项目。查看 Awesome Vite 获取 [社区维护的模板](https://github.com/vitejs/awesome-vite#templates)，其中包含其他工具或针对不同的框架。

对于位于 `https://github.com/user/project` 的模板，你可以使用 `https://github.stackblitz.com/user/project` 在线尝试（在项目的 URL 中 `github` 后添加 `.stackblitz`）。

你也可以使用像 [tiged](https://github.com/tiged/tiged) 这样的工具，使用其中一个模板搭建你的项目。假设项目在 GitHub 上并使用 `main` 作为默认分支，你可以使用以下命令创建本地副本：

```bash
npx tiged user/project my-project
cd my-project

npm install
npm run dev
```

## 手动安装

在你的项目中，你可以使用以下命令安装 `vite` CLI：

::: code-group

```bash [npm]
$ npm install -D vite
```

```bash [Yarn]
$ yarn add -D vite
```

```bash [pnpm]
$ pnpm add -D vite
```

```bash [Bun]
$ bun add -D vite
```

```bash [Deno]
$ deno add -D npm:vite
```

:::

并创建一个如下所示的 `index.html` 文件：

```html
<p>Hello Vite!</p>
```

然后在终端中运行相应的 CLI 命令：

::: code-group

```bash [npm]
$ npx vite
```

```bash [Yarn]
$ yarn vite
```

```bash [pnpm]
$ pnpm vite
```

```bash [Bun]
$ bunx vite
```

```bash [Deno]
$ deno run -A npm:vite
```

:::

`index.html` 将在 `http://localhost:5173` 上提供服务。

## `index.html` 和项目根目录

你可能注意到的一件事是，在 Vite 项目中，`index.html` 位于中心位置，而不是藏在 `public` 里面。这是有意的：在开发期间，Vite 是一个服务器，`index.html` 是你应用程序的入口点。

Vite 将 `index.html` 视为源代码和模块图的一部分。它解析引用你 JavaScript 源代码的 `<script type="module" src="...">`。即使是内联的 `<script type="module">` 和通过 `<link href>` 引用的 CSS 也能享受 Vite 特有的功能。此外，`index.html` 内部的 URL 会自动重新基准化，因此不需要特殊的 `%PUBLIC_URL%` 占位符。

类似于静态 HTTP 服务器，Vite 有一个“根目录”的概念，你的文件从这里提供服务。在文档的其余部分，你将看到它被引用为 `<root>`。源代码中的绝对 URL 将使用项目根目录作为基础进行解析，因此你可以像使用普通静态文件服务器一样编写代码（除了功能更强大！）。Vite 还能够处理解析到根目录外文件系统位置的依赖项，这使得它甚至可以在基于 monorepo 的设置中使用。

Vite 还支持具有多个 `.html` 入口点的 [多页应用](./build#multi-page-app)。

#### 指定替代根目录

运行 `vite` 会使用当前工作目录作为根目录启动开发服务器。你可以使用 `vite serve some/sub/dir` 指定替代根目录。
请注意，Vite 还会在项目根目录内解析 [其配置文件（即 `vite.config.js`）](/config/#configuring-vite)，所以如果根目录更改，你需要移动它。

## 命令行界面

在安装了 Vite 的项目中，你可以在 npm 脚本中使用 `vite` 二进制文件，或者直接使用 `npx vite` 运行它。以下是 scaffolded Vite 项目中的默认 npm 脚本：

<!-- prettier-ignore -->
```json [package.json]
{
  "scripts": {
    "dev": "vite", // 启动开发服务器，别名：`vite dev`, `vite serve`
    "build": "vite build", // 生产构建
    "preview": "vite preview" // 本地预览生产构建
  }
}
```

你可以指定额外的 CLI 选项，如 `--port` 或 `--open`。如需完整的 CLI 选项列表，请在你的项目中运行 `npx vite --help`。

了解更多关于 [命令行界面](./cli.md) 的信息

## 使用未发布的提交

如果你迫不及待想测试最新功能而等待新版本发布，你可以使用 https://pkg.pr.new 安装 Vite 的特定提交：

::: code-group

```bash [npm]
$ npm install -D https://pkg.pr.new/vite@SHA
```

```bash [Yarn]
$ yarn add -D https://pkg.pr.new/vite@SHA
```

```bash [pnpm]
$ pnpm add -D https://pkg.pr.new/vite@SHA
```

```bash [Bun]
$ bun add -D https://pkg.pr.new/vite@SHA
```

:::

将 `SHA` 替换为 [Vite 的提交 SHA](https://github.com/vitejs/vite/commits/main/) 中的任意一个。请注意，只有最近一个月内的提交才有效，因为旧的提交发布会被清除。

或者，你也可以将 [vite 仓库](https://github.com/vitejs/vite) 克隆到本地机器，然后自行构建和链接它（需要 [pnpm](https://pnpm.io/)）：

```bash
git clone https://github.com/vitejs/vite.git
cd vite
pnpm install
cd packages/vite
pnpm run build
pnpm link # use your preferred package manager for this step
```

然后进入你的基于 Vite 的项目并运行 `pnpm link vite`（或使用你用来全局链接 `vite` 的包管理器）。现在重启开发服务器以体验最新前沿功能！

要了解有关 Vite 如何以及何时发布的更多信息，请查看 [发布](../releases.md) 文档。

::: tip 使用 Vite 的依赖
要替换依赖传递使用的 Vite 版本，你应该使用 [npm overrides](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#overrides) 或 [pnpm overrides](https://pnpm.io/9.x/package_json#pnpmoverrides)。
:::

## 社区

如果您有问题或需要帮助，请在 [Discord](https://chat.vite.dev) 和 [GitHub Discussions](https://github.com/vitejs/vite/discussions) 上联系社区。
