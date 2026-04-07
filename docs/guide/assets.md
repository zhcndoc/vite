# 静态资源处理

- 相关：[公共基础路径](./build#public-base-path)
- 相关：[`assetsInclude` 配置选项](/config/shared-options.md#assetsinclude)

## 将资源导入为 URL

导入静态资源将在服务时返回解析后的公共 URL：

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

例如，`imgUrl` 在开发期间将是 `/src/img.png`，在生产构建中会变成 `/assets/img.2d8efhg.png`。

行为类似于 webpack 的 `file-loader`。区别在于导入可以使用绝对公共路径（基于开发期间的项目根目录）或相对路径。

- CSS 中的 `url()` 引用以相同方式处理。

- 如果使用 Vue 插件，Vue SFC 模板中的资源引用会自动转换为导入。

- 常见的图片、媒体和字体文件类型会自动检测为资源。你可以使用 [`assetsInclude` 选项](/config/shared-options.md#assetsinclude) 扩展内部列表。

- 被引用的资产会作为构建资产图的一部分包含在内，将获得哈希文件名，并且可以由插件进行处理以优化。

- 字节大小小于 [`assetsInlineLimit` 选项](/config/build-options.md#build-assetsinlinelimit) 的资源将作为 base64 data URLs 内联。

- Git LFS 占位符会自动排除在内联之外，因为它们不包含所代表文件的内容。要进行内联，请确保在构建之前通过 Git LFS 下载文件内容。

- TypeScript 默认不识别静态资源导入为有效模块。要解决此问题，请包含 [`vite/client`](./features#client-types)。

::: tip 通过 `url()` 内联 SVG
当通过 JS 手动构造的 `url()` 传递 SVG 的 URL 时，变量应该用双引号包裹。

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl from './img.svg'
document.getElementById('hero-img').style.background = `url("${imgUrl}")`
```

:::

### 显式 URL 导入

未包含在内部列表或 `assetsInclude` 中的资源可以使用 `?url` 后缀显式导入为 URL。例如，这对于导入 [Houdini Paint Worklets](https://developer.mozilla.org/en-US/docs/Web/API/CSS/paintWorklet_static) 很有用。

```js twoslash
import 'vite/client'
// ---cut---
import workletURL from 'extra-scalloped-border/worklet.js?url'
CSS.paintWorklet.addModule(workletURL)
```

### 显式内联处理

可以使用 `?inline` 或 `?no-inline` 后缀分别显式导入带有内联或不内联的资源。

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl1 from './img.svg?no-inline'
import imgUrl2 from './img.png?inline'
```

### 将资源导入为字符串

可以使用 `?raw` 后缀将资源导入为字符串。

```js twoslash
import 'vite/client'
// ---cut---
import shaderString from './shader.glsl?raw'
```

### 将脚本导入为 Worker

可以使用 `?worker` 或 `?sharedworker` 后缀将脚本导入为 web workers。

```js twoslash
import 'vite/client'
// ---cut---
// 在生产构建中单独的 chunk
import Worker from './shader.js?worker'
const worker = new Worker()
```

```js twoslash
import 'vite/client'
// ---cut---
// 共享 worker
import SharedWorker from './shader.js?sharedworker'
const sharedWorker = new SharedWorker()
```

```js twoslash
import 'vite/client'
// ---cut---
// 内联为 base64 字符串
import InlineWorker from './shader.js?worker&inline'
```

查看 [Web Worker 部分](./features.md#web-workers) 了解更多详情。

## `public` 目录

如果你有如下资源：

- 从未在源代码中引用（例如 `robots.txt`）
- 必须保留完全相同的文件名（不带哈希）
- ...或者你仅仅是不想为了获取其 URL 而必须先导入资源

那么你可以将资源放在项目根目录下的特殊 `public` 目录中。此目录中的资源在开发期间将在根路径 `/` 下服务，并按原样复制到 dist 目录的根目录。

该目录默认为 `<root>/public`，但可以通过 [`publicDir` 选项](/config/shared-options.md#publicdir) 进行配置。

请注意，你应该始终使用根绝对路径引用 `public` 资产 - 例如，`public/icon.png` 在源代码中应引用为 `/icon.png`。

::: tip 在导入和 `public` 目录之间选择

通常情况下，优先**导入资产**，除非你特别需要 `public` 目录提供的保证。

:::

## new URL(url, import.meta.url)

[import.meta.url](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta) 是一个原生 ESM 功能，它暴露当前模块的 URL。将其与原生的 [URL 构造函数](https://developer.mozilla.org/en-US/docs/Web/API/URL) 结合，我们可以使用 JavaScript 模块中的相对路径获取静态资源的完整解析 URL：

```js
const imgUrl = new URL('./img.png', import.meta.url).href

document.getElementById('hero-img').src = imgUrl
```

这在现代浏览器中原生有效 - 事实上，Vite 在开发期间根本不需要处理这段代码！

此模式还支持通过模板字面量实现动态 URL：

```js
function getImageUrl(name) {
  // 注意，这不包括子目录中的文件
  return new URL(`./dir/${name}.png`, import.meta.url).href
}
```

在生产构建期间，Vite 将执行必要的转换，以便即使在捆绑和资产哈希之后，URL 仍然指向正确的位置。但是，URL 字符串必须是静态的以便进行分析，否则代码将保持原样，如果 `build.target` 不支持 `import.meta.url`，这可能会导致运行时错误。

```js
// Vite 不会转换这个
const imgUrl = new URL(imagePath, import.meta.url).href
```

::: details 工作原理

Vite 会将 `getImageUrl` 函数转换为：

```js
import __img0png from './dir/img0.png'
import __img1png from './dir/img1.png'

function getImageUrl(name) {
  const modules = {
    './dir/img0.png': __img0png,
    './dir/img1.png': __img1png,
  }
  return new URL(modules[`./dir/${name}.png`], import.meta.url).href
}
```

:::

::: warning 不适用于 SSR
如果你使用 Vite 进行服务器端渲染，此模式不起作用，因为 `import.meta.url` 在浏览器和 Node.js 中具有不同的语义。服务器捆绑包也无法提前确定客户端主机 URL。
:::
