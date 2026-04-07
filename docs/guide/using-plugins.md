# 使用插件

Vite 可以通过插件进行扩展，这些插件基于 Rollup 设计良好的插件接口，并添加了一些 Vite 特定的选项。这意味着 Vite 用户可以依赖成熟的 Rollup 插件生态系统，同时也可以根据需要扩展开发服务器和 SSR 功能。

<ScrimbaLink href="https://scrimba.com/intro-to-vite-c03p6pbbdq/~0y4g?via=vite" title="在 Vite 中使用插件">在 Scrimba 上观看互动课程</ScrimbaLink>

## 添加插件

要使用插件，需要将其添加到项目的 `devDependencies` 中，并包含在 `vite.config.js` 配置文件的 `plugins` 数组中。例如，为了提供对旧版浏览器的支持，可以使用官方的 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)：

```
$ npm add -D @vitejs/plugin-legacy
```

```js twoslash [vite.config.js]
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```

`plugins` 也接受预设，即将多个插件作为单个元素包含在内。这对于使用多个插件实现的复杂功能（如框架集成）很有用。数组将在内部被扁平化。

假值插件将被忽略，这可以用于轻松地激活或停用插件。

## 寻找插件

:::tip 注意
Vite 旨在为常见的 Web 开发模式提供开箱即用的支持。在搜索 Vite 或兼容的 Rollup 插件之前，请查看 [功能指南](../guide/features.md)。许多在 Rollup 项目中需要插件的情况在 Vite 中已经涵盖了。
:::

查看 [插件部分](../plugins/) 以了解官方插件的信息。发布到 npm 的社区插件列在 [Vite 插件注册表](https://registry.vite.dev/plugins) 中。

## 强制插件顺序

为了与某些 Rollup 插件兼容，可能需要强制插件的顺序或仅在构建时应用。这对于 Vite 插件来说应该是一个实现细节。你可以使用 `enforce` 修饰符来强制插件的位置：

- `pre`：在 Vite 核心插件之前调用插件
- default：在 Vite 核心插件之后调用插件
- `post`：在 Vite 构建插件之后调用插件

```js twoslash [vite.config.js]
import image from '@rollup/plugin-image'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...image(),
      enforce: 'pre',
    },
  ],
})
```

查看 [插件 API 指南](./api-plugin.md#plugin-ordering) 以获取详细信息。

## 条件应用

默认情况下，插件会在 serve 和 build 过程中都被调用。如果插件需要条件性地仅在 serve 或 build 期间应用，请使用 `apply` 属性以仅在 `'build'` 或 `'serve'` 期间调用它们：

```js twoslash [vite.config.js]
import typescript2 from 'rollup-plugin-typescript2'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...typescript2(),
      apply: 'build',
    },
  ],
})
```

## 构建插件

查看 [插件 API 指南](./api-plugin.md) 以了解创建插件的文档。
