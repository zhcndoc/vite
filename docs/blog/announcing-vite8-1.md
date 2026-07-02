---
title: Vite 8.1 发布了！
author:
  name: The Vite Team
date: 2026-06-23
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: 宣布发布 Vite 8.1
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite8-1.webp
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite8-1
  - - meta
    - property: og:description
      content: Vite 8.1 版本发布公告

  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 8.1 发布了！

_2026年6月23日_

![Vite 8 Announcement Cover Image](/og-image-announcing-vite8-1.webp)

Vite 8 [已发布](./announcing-vite8.md)，并于 3 月推出了一个由 [Rolldown](https://rolldown.rs/) 驱动的单一统一打包器，为后续改进打开了大门。如今它的每周下载量已达到 4160 万次，几乎追平了 Vite 7 的总下载量。除了修复升级回归问题之外，我们一直在开发新功能，很高兴宣布 Vite 8.1 正式发布。

快速链接：

- [文档](/)
- 翻译：[简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/), [فارسی](https://fa.vite.dev/)
- [GitHub 更新日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

使用 [vite.new](https://vite.new) 在线体验 Vite 8.1，或者使用你偏好的框架在本地通过 `pnpm create vite` 搭建一个 Vite 应用。更多信息请查看[入门指南](/guide/)。

我们邀请你帮助我们改进 Vite（加入超过 [1.2K 位 Vite Core 贡献者](https://github.com/vitejs/vite/graphs/contributors) 的行列）、我们的依赖，或生态系统中的插件与项目。更多信息请参阅我们的[贡献指南](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md)。一个很好的入门方式是 [整理问题](https://github.com/vitejs/vite/issues)、[审查 PR](https://github.com/vitejs/vite/pulls)、基于公开问题提交测试 PR，以及在 [Discussions](https://github.com/vitejs/vite/discussions) 或 Vite Land 的 [帮助论坛](https://discord.com/channels/804011606160703521/1019670660856942652) 中支持他人。如果你有疑问，欢迎加入我们的 [Discord 社区](https://chat.vite.dev)，并在 [#contributing 频道](https://discord.com/channels/804011606160703521/804439875226173480) 与我们交流。

通过关注我们的 [Bluesky](https://bsky.app/profile/vite.dev)、[X](https://twitter.com/vite_js) 或 [Mastodon](https://webtoo.ls/@vite)，保持更新并与其他在 Vite 上构建的人建立联系。

## 功能

### 实验性打包开发模式

现已提供对打包开发模式的实验性支持。此前它被称为“全量打包模式”。此模式旨在提升大型应用的性能，尤其是那些受模块数量影响较大的应用。

在我们对一个加载 10,000 个 React 组件的应用进行的初步测试中，打包开发模式相比未打包的开发服务器，启动速度提升约 15 倍，整页刷新速度提升约 10 倍，同时无论应用大小如何，HMR 都能保持即时。对真实世界应用的早期测试也显示出类似收益：Linear 团队看到冷启动渲染最高快 3 倍，整页刷新快约 40%，网络请求减少 10 倍。

::: details 为什么需要打包开发模式？

Vite 以其未打包的开发服务器方案而闻名，这也是 Vite 最初推出时速度快、受欢迎的主要原因之一。这种方式最初是一项实验，旨在不依赖传统打包的情况下，看看我们能将开发服务器性能的边界推进到什么程度。

然而，随着项目规模和复杂度的增长，Vite 的未打包开发方式在开发过程中会逐渐暴露出性能下降的问题。由于每个模块都要单独获取，浏览器必须处理大量请求，这会增加启动和刷新开销。这种影响在大型应用中尤其明显；当开发者位于网络代理之后时，这个问题会更加严重，导致刷新更慢、开发体验更差。

打包开发模式允许不仅在生产环境中，而且在开发过程中也提供打包后的文件，从而结合两者优点：

- 即使是大型应用也能获得快速启动时间
- 页面刷新时减少网络开销
- 在 ESM 输出之上仍保持高效的 HMR

:::

目前它主要关注浏览器端以及基础插件和主要功能。如果你在使用第三方插件，它可能无法在此模式下正常工作。如果你在使用某些次要功能，它的表现也可能不如预期。我们正在扩展支持范围，并准备一份文档来说明插件侧可能需要的变更。关于路线图的更多细节，请参见[设计文档](https://github.com/vitejs/vite/discussions/22746)。

要启用此模式，你可以传入 `--experimental-bundle`，或者在你的 `vite.config.js` 中添加 `experimental.bundledDev: true`：

```ts [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  experimental: {
    bundledDev: true,
  },
})
```

欢迎在[讨论区](https://github.com/vitejs/vite/discussions/22747)分享你的反馈。

### 实验性 Chunk 导入映射

在输出 bundle 中，一个 chunk 的 import 语句会包含该 chunk 的哈希。这是为了确保当 chunk 内容发生变化时，能够加载新的 chunk。然而，这也会导致导入了该变更 chunk 的那个 chunk 的哈希发生变化，并进一步级联到所有以传递方式导入了该变更 chunk 的 chunk。

```dot
digraph chunk_hash_cascade {
  rankdir=TB
  node [shape=box style="rounded,filled" fontname="Arial" fontsize=11 margin="0.25,0.12" fontcolor="${#3c3c43|#ffffff}" color="${#c2c2c4|#3c3f44}"]
  edge [color="${#67676c|#98989f}" fontname="Arial" fontsize=10 fontcolor="${#67676c|#98989f}"]
  bgcolor="transparent"

  utils [label="utils.[e5f6 → 88xx].js\ncontent edited" fillcolor="${#fcf4dc|#38301a}" color="${#e0a800|#d4a72c}"]
  page  [label="page.[c3d4 → 77yy].js\nre-hashed by cascade" fillcolor="${#fde8e8|#3a1f22}" color="${#d5393e|#f66f81}"]
  entry [label="entry.[a1b2 → 99zz].js\nre-hashed by cascade" fillcolor="${#fde8e8|#3a1f22}" color="${#d5393e|#f66f81}"]

  entry -> page  [label="  imports (embeds hash)\l" color="${#d5393e|#f66f81}" fontcolor="${#d5393e|#f66f81}"]
  page  -> utils [label="  imports (embeds hash)\l" color="${#d5393e|#f66f81}" fontcolor="${#d5393e|#f66f81}"]
}
```

实验性的 chunk 导入映射功能利用 import maps 解决了这个问题，并提升了缓存效率。此功能建立在 [Rolldown 的功能](https://rolldown.rs/reference/InputOptions.experimental#chunkimportmap)之上，同时加入了对 Vite 特有功能的支持。非常感谢 [Taisei Mima](https://github.com/bhbs) 对这一功能的研究和最初实现！

请注意，`experimental.renderBuiltUrl` 目前不适用于此选项。

更多细节请参见[指南](/guide/features#chunk-import-map-optimization)和[选项文档](/config/build-options#build-chunkimportmap)。欢迎在[讨论区](https://github.com/vitejs/vite/discussions/22703)分享你的反馈。

### Wasm ESM 集成支持

[Wasm ESM 集成提案](https://github.com/WebAssembly/esm-integration/blob/main/proposals/esm-integration/README.md)现已在 Vite 中得到支持。你现在可以直接导入 wasm 文件并使用导出的函数：

```ts
import { add } from './add.wasm'

console.log(add(1, 2)) // 3
```

非常感谢 [Menci](https://github.com/Menci) 在该提案尚处于早期阶段时创建并维护了 vite-plugin-wasm，同时也感谢其将实现上游到 Vite 核心！

更多细节请参见[指南](/guide/features#esm-integration)。

### 更进一步：默认使用 Lightning CSS

我们与 Lightning CSS 团队合作，补充了此前 PostCSS 支持但 Lightning CSS 尚缺少的功能。Vite 8.1 现在具备这两个特性：

- 允许在 CSS 文件中导入外部 CSS 文件 ([lightningcss#479](https://github.com/parcel-bundler/lightningcss/issues/479))
- 由插件注册文件依赖 ([lightningcss#877](https://github.com/parcel-bundler/lightningcss/issues/877))

我们正在考虑在下一个主要版本中将默认 CSS 预处理器改为 Lightning CSS。请通过设置 [`css.transformer: 'lightningcss'`](/config/shared-options#css-transformer) 进行试用，并在[讨论区](https://github.com/vitejs/vite/discussions/13835)分享你的反馈。

### `import.meta.glob` 的大小写不敏感匹配

`import.meta.glob` 现在支持 `caseSensitive` 选项，可按大小写不敏感方式匹配文件。

```ts
// 匹配 ./dir/Module1.js
const modules = import.meta.glob('./dir/module*.js', {
  caseSensitive: false,
})
```

### 自定义 HTML 元素和属性的资源发现

此前，Vite 只能发现预定义元素和属性的资源。现在，你可以使用 [`html.additionalAssetSources`](/config/shared-options#html-additionalassetsources) 选项来添加更多元素和属性。

```html
<html-import src="./some/other/file.html"></html-import>
<img
  src="/layout-default.png"
  data-src-dark="/layout-dark.png"
  data-src-light="/layout-light.png"
/>
```

```ts [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  html: {
    additionalAssetSources: {
      'html-import': {
        srcAttributes: 'src',
      },
      img: {
        srcAttributes: ['data-src-dark', 'data-src-light'],
      },
    },
  },
})
```

## 其他更改

请查看 [更新日志](https://github.com/vitejs/vite/blob/v8.1.0/packages/vite/CHANGELOG.md) 了解其他功能和 bug 修复。

## 致谢

Vite 8.1 的诞生离不开我们的贡献者社区、生态中的维护者，以及 [Vite 团队](/team)。Vite 由 [VoidZero](https://voidzero.dev) 提供支持，并与 [Bolt](https://bolt.new/) 和 [Nuxt Labs](https://nuxtlabs.com/) 合作推出。我们还要感谢在 [Vite 的 GitHub Sponsors](https://github.com/sponsors/vitejs) 和 [Vite 的 Open Collective](https://opencollective.com/vite) 上支持我们的赞助者。
