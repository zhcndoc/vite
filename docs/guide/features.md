# 特性

在最基本的层面上，使用 Vite 进行开发与使用静态文件服务器并没有太大不同。然而，Vite 在原生 ESM 导入之上提供了许多增强功能，以支持通常在基于打包器的设置中看到的各种特性。

## npm 依赖解析和预构建

原生 ES 导入不支持如下所示的裸模块导入：

```js
import { someMethod } from 'my-dep'
```

上述导入会在浏览器中抛出错误。Vite 会在所有提供的源文件中检测此类裸模块导入，并执行以下操作：

1. [预构建](./dep-pre-bundling) 它们以提高页面加载速度，并将 CommonJS / UMD 模块转换为 ESM。预构建步骤使用 [Rolldown](https://rolldown.rs/) 执行，使得 Vite 的冷启动时间比任何基于 JavaScript 的打包器都快得多。

2. 将导入重写为有效的 URL，如 `/node_modules/.vite/deps/my-dep.js?v=f3sf2ebd`，以便浏览器可以正确导入它们。

**依赖项被强缓存**

Vite 通过 HTTP 头缓存依赖请求，因此如果你希望在本地编辑/调试依赖项，请按照 [这里](./dep-pre-bundling#browser-cache) 的步骤操作。

## 热模块替换

Vite 在原生 ESM 之上提供了 [HMR API](./api-hmr)。具有 HMR 能力的框架可以利用该 API 提供即时、精确的更新，而无需重新加载页面或清除应用状态。Vite 为 [Vue 单文件组件](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue) 和 [React 快速刷新](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react) 提供了官方 HMR 集成。还有通过 [@prefresh/vite](https://github.com/JoviDeCroock/prefresh/tree/main/packages/vite) 提供的 Preact 官方集成。

请注意，你不需要手动设置这些——当你 [通过 `create-vite` 创建应用](./) 时，所选的模板已经为你预配置好了这些。

## TypeScript

Vite 支持开箱即用地导入 `.ts` 文件。

### 仅转译

请注意，Vite 仅对 `.ts` 文件执行转译，**不**执行类型检查。它假设类型检查由你的 IDE 和构建过程负责。

Vite 不在转换过程中执行类型检查的原因是，这两项工作从根本上说是不同的。转译可以基于每个文件进行，并与 Vite 的按需编译模型完美契合。相比之下，类型检查需要了解整个模块图。强行将类型检查塞入 Vite 的转换管道将不可避免地损害 Vite 的速度优势。

Vite 的工作是尽快将你的源模块转换为可以在浏览器中运行的形式。为此，我们建议将静态分析检查与 Vite 的转换管道分开。这一原则也适用于其他静态分析检查，例如 ESLint。

- 对于生产构建，你可以在 Vite 的构建命令之外运行 `tsc --noEmit`。

- 在开发期间，如果你需要比 IDE 提示更多的功能，我们建议在单独的进程中运行 `tsc --noEmit --watch`，或者如果你更喜欢直接在浏览器中报告类型错误，可以使用 [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker)。

Vite 使用 [Oxc Transformer](https://oxc.rs/docs/guide/usage/transformer.html) 将 TypeScript 转译为 JavaScript，这比原生 `tsc` 更快，HMR 更新可以在 50 毫秒内在浏览器中反映出来。

使用 [仅类型导入和导出](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export) 语法以避免潜在问题，例如仅类型导入被错误地打包，例如：

```ts
import type { T } from 'only/types'
export type { T }
```

### TypeScript 编译器选项

Vite 尊重 `tsconfig.json` 中的一些选项，并设置相应的 Oxc Transformer 选项。对于每个文件，Vite 使用最近父目录中的 `tsconfig.json`。如果该 `tsconfig.json` 包含 [`references`](https://www.typescriptlang.org/tsconfig/#references) 字段，Vite 将使用满足 [`include`](https://www.typescriptlang.org/tsconfig/#include) 和 [`exclude`](https://www.typescriptlang.org/tsconfig/#exclude) 字段的引用配置文件。

当选项同时在 Vite 配置和 `tsconfig.json` 中设置时，Vite 配置中的值优先。

`tsconfig.json` 中 `compilerOptions` 下的一些配置字段需要特别注意。

#### `isolatedModules`

- [TypeScript 文档](https://www.typescriptlang.org/tsconfig#isolatedModules)

应设置为 `true`。

这是因为 Oxc transformer 仅执行转译而不包含类型信息，它不支持某些功能，如 const enum 和隐式仅类型导入。

你必须在 `tsconfig.json` 的 `compilerOptions` 下设置 `"isolatedModules": true`，这样 TS 会针对不与隔离转译一起工作的功能向你发出警告。

如果某个依赖项与 `"isolatedModules": true` 配合不佳，你可以使用 `"skipLibCheck": true` 暂时抑制错误，直到上游修复。

#### `useDefineForClassFields`

- [TypeScript 文档](https://www.typescriptlang.org/tsconfig#useDefineForClassFields)

如果 TypeScript 目标是 `ES2022` 或更新版本（包括 `ESNext`），默认值将为 `true`。这与 [TypeScript 4.3.2+ 的行为](https://github.com/microsoft/TypeScript/pull/42663) 一致。
其他 TypeScript 目标默认为 `false`。

`true` 是标准的 ECMAScript 运行时行为。

如果你使用的库严重依赖类字段，请注意该库的预期用法。
虽然大多数库期望 `"useDefineForClassFields": true`，但如果你的库不支持它，你可以显式地将 `useDefineForClassFields` 设置为 `false`。

#### `target`

- [TypeScript 文档](https://www.typescriptlang.org/tsconfig#target)

Vite 忽略 `tsconfig.json` 中的 `target` 值，遵循与 [esbuild](https://esbuild.github.io/) 相同的行为。

要在开发中指定目标，可以使用 [`oxc.target`](/config/shared-options.html#oxc) 选项，该选项默认为 `esnext` 以实现最小化转译。在构建中，[`build.target`](/config/build-options.html#build-target) 选项优先于 `oxc.target`，如果需要也可以设置。

#### `emitDecoratorMetadata`

- [TypeScript 文档](https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata)

此选项仅部分支持。完全支持需要 TypeScript 编译器进行类型推断，目前不支持。详见 [Oxc Transformer 文档](https://oxc.rs/docs/guide/usage/transformer/typescript#decorators)。

#### `paths`

- [TypeScript 文档](https://www.typescriptlang.org/tsconfig/#paths)

可以指定 `resolve.tsconfigPaths: true` 来告诉 Vite 使用 `tsconfig.json` 中的 `paths` 选项来解析导入。

请注意，此功能有性能开销，并且 [TypeScript 团队不推荐使用此选项来更改外部工具的行为](https://www.typescriptlang.org/tsconfig/#paths:~:text=Note%20that%20this%20feature%20does%20not%20change%20how%20import%20paths%20are%20emitted%20by%20tsc%2C%20so%20paths%20should%20only%20be%20used%20to%20inform%20TypeScript%20that%20another%20tool%20has%20this%20mapping%20and%20will%20use%20it%20at%20runtime%20or%20when%20bundling.)。

#### 其他影响构建结果的编译器选项

- [`extends`](https://www.typescriptlang.org/tsconfig#extends)
- [`importsNotUsedAsValues`](https://www.typescriptlang.org/tsconfig#importsNotUsedAsValues)
- [`preserveValueImports`](https://www.typescriptlang.org/tsconfig#preserveValueImports)
- [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax)
- [`jsx`](https://www.typescriptlang.org/tsconfig#jsx)
- [`jsxFactory`](https://www.typescriptlang.org/tsconfig#jsxFactory)
- [`jsxFragmentFactory`](https://www.typescriptlang.org/tsconfig#jsxFragmentFactory)
- [`jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource)
- [`experimentalDecorators`](https://www.typescriptlang.org/tsconfig#experimentalDecorators)

::: tip `skipLibCheck`
Vite starter 模板默认具有 `"skipLibCheck": "true"`，以避免对依赖项进行类型检查，因为它们可能选择仅支持特定版本和配置的 TypeScript。你可以在 [vuejs/vue-cli#5688](https://github.com/vuejs/vue-cli/pull/5688) 了解更多。
:::

### 客户端类型

Vite 的默认类型是针对其 Node.js API 的。为了补充 Vite 应用中客户端代码的环境，你可以在 `tsconfig.json` 内的 `compilerOptions.types` 中添加 `vite/client`：

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["vite/client", "some-other-global-lib"]
  }
}
```

请注意，如果指定了 [`compilerOptions.types`](https://www.typescriptlang.org/tsconfig#types)，则只有这些包将包含在全局作用域中（而不是所有可见的 "@types" 包）。自 TS 5.9 以来推荐这样做。

::: details 使用三斜杠指令

或者，你可以添加一个 `d.ts` 声明文件：

```typescript [vite-env.d.ts]
/// <reference types="vite/client" />
```

:::

`vite/client` 提供以下类型补充：

- 资源导入（例如导入 `.svg` 文件）
- `import.meta.env` 上 Vite 注入的 [常量](./env-and-mode#env-variables) 的类型
- `import.meta.hot` 上 [HMR API](./api-hmr) 的类型

::: tip
要覆盖默认类型，添加一个包含你的类型定义的类型定义文件。然后，在 `vite/client` 之前添加类型引用。

例如，要使 `*.svg` 的默认导入成为 React 组件：

- `vite-env-override.d.ts`（包含你的类型定义的文件）：
  ```ts
  declare module '*.svg' {
    const content: React.FC<React.SVGProps<SVGElement>>
    export default content
  }
  ```
- 如果你使用 `compilerOptions.types`，确保文件包含在 `tsconfig.json` 中：
  ```json [tsconfig.json]
  {
    "include": ["src", "./vite-env-override.d.ts"]
  }
  ```
- 如果你使用三斜杠指令，更新包含对 `vite/client` 引用的文件（通常是 `vite-env.d.ts`）：
  ```ts
  /// <reference types="./vite-env-override.d.ts" />
  /// <reference types="vite/client" />
  ```

:::

## HTML

HTML 文件在 Vite 项目中占据 [核心位置](/guide/#index-html-and-project-root)，作为应用的入口点，使得构建单页和 [多页应用](/guide/build.html#multi-page-app) 变得简单。

项目根目录中的任何 HTML 文件都可以通过其各自的目录路径直接访问：

- `<root>/index.html` -> `http://localhost:5173/`
- `<root>/about.html` -> `http://localhost:5173/about.html`
- `<root>/blog/index.html` -> `http://localhost:5173/blog/index.html`

HTML 元素（如 `<script type="module" src>` 和 `<link href>`）引用的资源会作为应用的一部分被处理和打包。支持的元素完整列表如下：

- `<audio src>`
- `<embed src>`
- `<img src>` 和 `<img srcset>`
- `<image href>` 和 `<image xlink:href>`
- `<input src>`
- `<link href>` 和 `<link imagesrcset>`
- `<object data>`
- `<script type="module" src>`
- `<source src>` 和 `<source srcset>`
- `<track src>`
- `<use href>` 和 `<use xlink:href>`
- `<video src>` 和 `<video poster>`
- `<meta content>`
  - 仅当 `name` 属性匹配 `msapplication-tileimage`、`msapplication-square70x70logo`、`msapplication-square150x150logo`、`msapplication-wide310x150logo`、`msapplication-square310x310logo`、`msapplication-config` 或 `twitter:image`
  - 或仅当 `property` 属性匹配 `og:image`、`og:image:url`、`og:image:secure_url`、`og:audio`、`og:audio:secure_url`、`og:video` 或 `og:video:secure_url`

```html {4-5,8-9}
<!doctype html>
<html>
  <head>
    <link rel="icon" href="/favicon.ico" />
    <link rel="stylesheet" href="/src/styles.css" />
  </head>
  <body>
    <img src="/src/images/logo.svg" alt="logo" />
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

要禁用某些元素的 HTML 处理，你可以在元素上添加 `vite-ignore` 属性，这在引用外部资源或 CDN 时很有用。

## 框架

所有现代框架都维护着与 Vite 的集成。大多数框架插件由各个框架团队维护，除了由 vite 组织维护的官方 Vue 和 React Vite 插件：

- 通过 [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue) 支持 Vue
- 通过 [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx) 支持 Vue JSX
- 通过 [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react) 支持 React
- 通过 [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react-swc) 支持使用 SWC 的 React
- 通过 [@vitejs/plugin-rsc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-rsc) 支持 [React Server Components (RSC)](https://react.dev/reference/rsc/server-components)

查看 [插件指南](/plugins/) 以获取更多信息。

## JSX

`.jsx` 和 `.tsx` 文件也开箱即用支持。JSX 转译也通过 [Oxc Transformer](https://oxc.rs/docs/guide/usage/transformer/) 处理。

你选择的框架已经开箱即用地配置了 JSX（例如，Vue 用户应该使用官方的 [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx) 插件，它提供了 Vue 3 特定功能，包括 HMR、全局组件解析、指令和插槽）。

如果在自己的框架中使用 JSX，可以使用 [`oxc` 选项](/config/shared-options.md#oxc) 配置自定义 `jsxFactory` 和 `jsxFragment`。例如，Preact 插件将使用：

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  oxc: {
    jsx: {
      importSource: 'preact',
    },
  },
})
```

更多详情见 [Oxc Transformer 文档](https://oxc.rs/docs/guide/usage/transformer/jsx.html)。

你可以使用 `jsxInject`（这是 Vite 独有的选项）注入 JSX 辅助函数，以避免手动导入：

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  oxc: {
    jsxInject: `import React from 'react'`,
  },
})
```

## CSS

导入 `.css` 文件会通过 `<style>` 标签将其内容注入到页面，并支持 HMR。

### `@import` 内联和重基

Vite 预配置为通过 `postcss-import` 支持 CSS `@import` 内联。CSS `@import` 也遵循 Vite 别名。此外，所有 CSS `url()` 引用，即使导入的文件位于不同的目录，也会自动重基以确保正确性。

Sass 和 Less 文件也支持 `@import` 别名和 URL 重基（见 [CSS 预处理器](#css-pre-processors)）。

### PostCSS

如果项目包含有效的 PostCSS 配置（[postcss-load-config](https://github.com/postcss/postcss-load-config) 支持的任何格式，例如 `postcss.config.js`），它将自动应用于所有导入的 CSS。

注意 CSS 最小化将在 PostCSS 之后运行，并将使用 [`build.cssTarget`](/config/build-options.md#build-csstarget) 选项。

### CSS Modules

任何以 `.module.css` 结尾的 CSS 文件都被视为 [CSS modules 文件](https://github.com/css-modules/css-modules)。导入此类文件将返回相应的模块对象：

```css [example.module.css]
.red {
  color: red;
}
```

```js twoslash
import 'vite/client'
// ---cut---
import classes from './example.module.css'
document.getElementById('foo').className = classes.red
```

CSS modules 行为可以通过 [`css.modules` 选项](/config/shared-options.md#css-modules) 配置。

如果设置了 `css.modules.localsConvention` 以启用 camelCase 本地类名（例如 `localsConvention: 'camelCaseOnly'`），你也可以使用命名导入：

```js twoslash
import 'vite/client'
// ---cut---
// .apply-color 转换为 applyColor
import { applyColor } from './example.module.css'
document.getElementById('foo').className = applyColor
```

### CSS 预处理器

因为 Vite 仅针对现代浏览器，建议使用原生 CSS 变量配合实现 CSSWG 草案的 PostCSS 插件（例如 [postcss-nesting](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting)），并编写简单、符合未来标准的 CSS。

也就是说，Vite 确实提供了对 `.scss`、`.sass`、`.less`、`.styl` 和 `.stylus` 文件的内置支持。无需为它们安装 Vite 特定的插件，但必须安装相应的预处理器本身：

```bash
# .scss 和 .sass
npm add -D sass-embedded # 或 sass

# .less
npm add -D less

# .styl 和 .stylus
npm add -D stylus
```

如果使用 Vue 单文件组件，这也自动启用了 `<style lang="sass">` 等。

Vite 改进了 Sass 和 Less 的 `@import` 解析，因此也遵循 Vite 别名。此外，导入的 Sass/Less 文件内部相对于根文件位于不同目录的相对 `url()` 引用也会自动重基以确保正确性。由于 API 限制，不支持重基以变量或插值开头的 `url()` 引用。

由于 API 限制，Stylus 不支持 `@import` 别名和 URL 重基。

你也可以通过在文件扩展名前添加 `.module` 来结合预处理器使用 CSS modules，例如 `style.module.scss`。

### 禁用 CSS 注入到页面

可以通过 `?inline` 查询参数关闭 CSS 内容的自动注入。在这种情况下，处理后的 CSS 字符串照常作为模块的默认导出返回，但样式不会注入到页面。

```js twoslash
import 'vite/client'
// ---cut---
import './foo.css' // 将被注入到页面
import otherStyles from './bar.css?inline' // 将不会被注入
```

::: tip 注意
自 Vite 5 起，移除了来自 CSS 文件的默认和命名导入（例如 `import style from './foo.css'`）。请改用 `?inline` 查询参数。
:::

### Lightning CSS

Vite 默认使用 [Lightning CSS](https://lightningcss.dev/) 在生产构建中最小化 CSS。但是，PostCSS 仍用于其他 CSS 处理。

实验性支持完全使用 Lightning CSS 进行 CSS 处理。你可以通过添加 [`css.transformer: 'lightningcss'`](../config/shared-options.md#css-transformer) 来选择加入。

要配置它，你可以将 Lightning CSS 选项传递给 [`css.lightningcss`](../config/shared-options.md#css-lightningcss) 配置选项。要配置 CSS Modules，你应该使用 [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules.html) 而不是 [`css.modules`](../config/shared-options.md#css-modules)（后者配置 PostCSS 处理 CSS modules 的方式）。

## 静态资源

<ScrimbaLink href="https://scrimba.com/intro-to-vite-c03p6pbbdq/~05pq?via=vite" title="Vite 中的静态资源">观看 Scrimba 上的互动课程</ScrimbaLink>

导入静态资源将在服务时返回解析后的公共 URL：

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

特殊查询可以修改资源的加载方式：

```js twoslash
import 'vite/client'
// ---cut---
// 显式地将资源加载为 URL（根据文件大小自动内联）
import assetAsURL from './asset.js?url'
```

```js twoslash
import 'vite/client'
// ---cut---
// 将资源加载为字符串
import assetAsString from './shader.glsl?raw'
```

```js twoslash
import 'vite/client'
// ---cut---
// 加载 Web Workers
import Worker from './worker.js?worker'
```

```js twoslash
import 'vite/client'
// ---cut---
// 构建时将 Web Workers 内联为 base64 字符串
import InlineWorker from './worker.js?worker&inline'
```

更多详情见 [静态资源处理](./assets)。

## JSON

JSON 文件可以直接导入 - 也支持命名导入：

```js twoslash
import 'vite/client'
// ---cut---
// 导入整个对象
import json from './example.json'
// 将根字段作为命名导出导入 - 有助于树摇！
import { field } from './example.json'
```

## Glob 导入

Vite 支持通过特殊的 `import.meta.glob` 函数从文件系统导入多个模块：

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js')
```

上述代码将被转换为以下内容：

```js
// vite 生成的代码
const modules = {
  './dir/bar.js': () => import('./dir/bar.js'),
  './dir/foo.js': () => import('./dir/foo.js'),
}
```

然后你可以遍历 `modules` 对象的键来访问相应的模块：

```js
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```

默认情况下，匹配的文件会通过动态导入进行懒加载，并在构建期间被分割成单独的代码块。如果你更想直接导入所有模块（例如，依赖这些模块中的副作用优先生效），你可以将 `{ eager: true }` 作为第二个参数传递：

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', { eager: true })
```

上述代码将被转换为以下内容：

```js
// vite 生成的代码
import * as __vite_glob_0_0 from './dir/bar.js'
import * as __vite_glob_0_1 from './dir/foo.js'
const modules = {
  './dir/bar.js': __vite_glob_0_0,
  './dir/foo.js': __vite_glob_0_1,
}
```

### 多个模式

第一个参数可以是 glob 数组，例如

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob(['./dir/*.js', './another/*.js'])
```

### 否定模式

也支持否定 glob 模式（以 `!` 为前缀）。要从结果中忽略某些文件，你可以将排除的 glob 模式添加到第一个参数中：

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob(['./dir/*.js', '!**/bar.js'])
```

```js
// vite 生成的代码
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
}
```

#### 命名导入

可以通过 `import` 选项只导入模块的一部分。

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', { import: 'setup' })
```

```ts
// vite 生成的代码
const modules = {
  './dir/bar.js': () => import('./dir/bar.js').then((m) => m.setup),
  './dir/foo.js': () => import('./dir/foo.js').then((m) => m.setup),
}
```

当与 `eager` 结合使用时，甚至可以为这些模块启用 tree-shaking。

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  import: 'setup',
  eager: true,
})
```

```ts
// vite 生成的代码：
import { setup as __vite_glob_0_0 } from './dir/bar.js'
import { setup as __vite_glob_0_1 } from './dir/foo.js'
const modules = {
  './dir/bar.js': __vite_glob_0_0,
  './dir/foo.js': __vite_glob_0_1,
}
```

将 `import` 设置为 `default` 以导入默认导出。

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  import: 'default',
  eager: true,
})
```

```ts
// vite 生成的代码：
import { default as __vite_glob_0_0 } from './dir/bar.js'
import { default as __vite_glob_0_1 } from './dir/foo.js'
const modules = {
  './dir/bar.js': __vite_glob_0_0,
  './dir/foo.js': __vite_glob_0_1,
}
```

#### 自定义查询

你也可以使用 `query` 选项为导入提供查询参数，例如，将资源导入 [作为字符串](/guide/assets.html#importing-asset-as-string) 或 [作为 URL](/guide/assets.html#importing-asset-as-url)：

```ts twoslash
import 'vite/client'
// ---cut---
const moduleStrings = import.meta.glob('./dir/*.svg', {
  query: '?raw',
  import: 'default',
})
const moduleUrls = import.meta.glob('./dir/*.svg', {
  query: '?url',
  import: 'default',
})
```

```ts
// vite 生成的代码：
const moduleStrings = {
  './dir/bar.svg': () => import('./dir/bar.svg?raw').then((m) => m['default']),
  './dir/foo.svg': () => import('./dir/foo.svg?raw').then((m) => m['default']),
}
const moduleUrls = {
  './dir/bar.svg': () => import('./dir/bar.svg?url').then((m) => m['default']),
  './dir/foo.svg': () => import('./dir/foo.svg?url').then((m) => m['default']),
}
```

你也可以提供自定义查询供其他插件使用：

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  query: { foo: 'bar', bar: true },
})
```

#### 基础路径

你也可以使用 `base` 选项为导入提供基础路径：

```ts twoslash
import 'vite/client'
// ---cut---
const modulesWithBase = import.meta.glob('./**/*.js', {
  base: './base',
})
```

```ts
// vite 生成的代码：
const modulesWithBase = {
  './dir/foo.js': () => import('./base/dir/foo.js'),
  './dir/bar.js': () => import('./base/dir/bar.js'),
}
```

`base` 选项只能是相对于导入器文件的目录路径，或者是相对于项目根目录的绝对路径。不支持别名和虚拟模块。

只有相对路径的 globs 会被解释为相对于解析后的 base。

如果提供了 base，所有生成的模块键都会被修改为相对于 base。

### Glob 导入注意事项

注意：

- 这是 Vite 特有的功能，不是 Web 或 ES 标准。
- glob 模式被视为导入说明符：它们必须是相对的（以 `./` 开头）或绝对的（以 `/` 开头，相对于项目根目录解析）或别名路径（参见 [`resolve.alias` 选项](/config/shared-options.md#resolve-alias)）。
- glob 匹配是通过 [`tinyglobby`](https://github.com/SuperchupuDev/tinyglobby) 完成的 - 查看其文档了解 [支持的 glob 模式](https://superchupu.dev/tinyglobby/comparison)。
- 你还应该知道，`import.meta.glob` 中的所有参数必须**作为字面量传递**。你不能在其中使用变量或表达式。

## 动态导入

与 [glob 导入](#glob-import) 类似，Vite 也支持带变量的动态导入。

```ts
const module = await import(`./dir/${file}.js`)
```

注意，变量仅代表一层深度的文件名。如果 `file` 是 `'foo/bar'`，导入将会失败。对于更高级的用法，你可以使用 [glob 导入](#glob-import) 功能。

还要注意，动态导入必须符合以下规则才能被打包：

- 导入必须以 `./` 或 `../` 开头：``import(`./dir/${foo}.js`)`` 是有效的，但 ``import(`${foo}.js`)`` 无效。
- 导入必须以文件扩展名结尾：``import(`./dir/${foo}.js`)`` 是有效的，但 ``import(`./dir/${foo}`)`` 无效。
- 导入到自身目录必须指定文件名模式：``import(`./prefix-${foo}.js`)`` 是有效的，但 ``import(`./${foo}.js`)`` 无效。

强制执行这些规则是为了防止意外导入不应打包的文件。例如，如果没有这些规则，`import(foo)` 将会打包文件系统中的所有内容。

## WebAssembly

预编译的 `.wasm` 文件可以通过 `?init` 导入。
默认导出将是一个初始化函数，返回一个 [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Instance) 的 Promise：

```js twoslash
import 'vite/client'
// ---cut---
import init from './example.wasm?init'

init().then((instance) => {
  instance.exports.test()
})
```

init 函数还可以接受一个 importObject，它将作为第二个参数传递给 [`WebAssembly.instantiate`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/instantiate)：

```js twoslash
import 'vite/client'
import init from './example.wasm?init'
// ---cut---
init({
  imports: {
    someFunc: () => {
      /* ... */
    },
  },
}).then(() => {
  /* ... */
})
```

在生产构建中，小于 `assetInlineLimit` 的 `.wasm` 文件将被内联为 base64 字符串。否则，它们将被视为 [静态资源](./assets) 并按需获取。

::: tip 注意
目前不支持 [WebAssembly 的 ES 模块集成提案](https://github.com/WebAssembly/esm-integration)。
使用 [`vite-plugin-wasm`](https://github.com/Menci/vite-plugin-wasm) 或其他社区插件来处理这个问题。
:::

::: warning 对于 SSR 构建，仅支持兼容 Node.js 的运行时

由于缺乏加载文件的通用方式，`.wasm?init` 的内部实现依赖于 `node:fs` 模块。这意味着该功能仅适用于 SSR 构建中兼容 Node.js 的运行时。

:::

### 访问 WebAssembly 模块

如果你需要访问 `Module` 对象，例如多次实例化它，请使用 [显式 URL 导入](./assets#explicit-url-imports) 来解析资源，然后执行实例化：

```js twoslash
import 'vite/client'
// ---cut---
import wasmUrl from 'foo.wasm?url'

const main = async () => {
  const responsePromise = fetch(wasmUrl)
  const { module, instance } =
    await WebAssembly.instantiateStreaming(responsePromise)
  /* ... */
}

main()
```

## Web Workers

### 使用构造函数导入

可以使用 [`new Worker()`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) 和 [`new SharedWorker()`](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker/SharedWorker) 导入 web worker 脚本。与 worker 后缀相比，这种语法更接近标准，是创建 worker 的**推荐**方式。

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url))
```

worker 构造函数也接受选项，可用于创建 "module" worker：

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
})
```

只有当 `new URL()` 构造函数直接在 `new Worker()` 声明中使用时，worker 检测才会生效。此外，所有选项参数必须是静态值（即字符串字面量）。

### 使用查询后缀导入

可以通过在导入请求后附加 `?worker` 或 `?sharedworker` 来直接导入 web worker 脚本。默认导出将是一个自定义 worker 构造函数：

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker'

const worker = new MyWorker()
```

worker 脚本也可以使用 ESM `import` 语句而不是 `importScripts()`。**注意**：在开发期间，这依赖于 [浏览器原生支持](https://caniuse.com/?search=module%20worker)，但在生产构建中它会被编译掉。

默认情况下，worker 脚本将在生产构建中作为单独的代码块发出。如果你希望将 worker 内联为 base64 字符串，请添加 `inline` 查询：

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker&inline'
```

如果你希望将 worker 作为 URL 获取，请添加 `url` 查询：

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker&url'
```

请参阅 [Worker 选项](/config/worker-options.md) 了解配置所有 worker 打包的详细信息。

## 内容安全策略 (CSP)

由于 Vite 的内部机制，部署 CSP 时必须设置某些指令或配置。

### [`'nonce-{RANDOM}'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#nonce-base64-value)

当设置 [`html.cspNonce`](/config/shared-options#html-cspnonce) 时，Vite 会将具有指定值的 nonce 属性添加到任何 `<script>` 和 `<style>` 标签，以及用于样式表和模块预加载的 `<link>` 标签。此外，当设置此选项时，Vite 将注入一个 meta 标签（`<meta property="csp-nonce" nonce="PLACEHOLDER" />`）。

具有 `property="csp-nonce"` 的 meta 标签的 nonce 值将在开发和构建后必要时由 Vite 使用。

:::warning
确保你为每个请求将占位符替换为唯一值。这对于防止绕过资源的策略很重要，否则很容易做到。
:::

### [`data:`](<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#scheme-source:~:text=schemes%20(not%20recommended).-,data%3A,-Allows%20data%3A>)

默认情况下，在构建期间，Vite 会将小资源内联为 data URIs。允许相关指令使用 `data:`（例如 [`img-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/img-src)、[`font-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/font-src)），或者通过设置 [`build.assetsInlineLimit: 0`](/config/build-options#build-assetsinlinelimit) 禁用它是必要的。

:::warning
不要允许 [`script-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) 使用 `data:`。这将允许注入任意脚本。
:::

## 许可证

Vite 可以使用 [`build.license`](/config/build-options.md#build-license) 选项生成一个包含构建中使用的所有依赖项许可证的文件。它可以被托管以显示和确认应用程序使用的依赖项。

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    license: true,
  },
})
```

这将生成一个 `.vite/license.md` 文件，输出可能如下所示：

```md
# Licenses

The app bundles dependencies which contain the following licenses:

## dep-1 - 1.2.3 (CC0-1.0)

CC0 1.0 Universal

...

## dep-2 - 4.5.6 (MIT)

MIT License

...
```

要在不同路径提供该文件，例如你可以传递 `{ fileName: 'license.md' }`，以便在 `https://example.com/license.md` 提供。请参阅 [`build.license`](/config/build-options.md#build-license) 文档以获取更多信息。

## 构建优化

> 下面列出的功能作为构建过程的一部分自动应用，除非你想禁用它们，否则无需显式配置。

### CSS 代码分割

Vite 自动提取异步块中模块使用的 CSS 并为其生成一个单独的文件。当关联的异步块加载时，CSS 文件会通过 `<link>` 标签自动加载，并且保证异步块仅在 CSS 加载后才进行评估，以避免 [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content#:~:text=A%20flash%20of%20unstyled%20content,before%20all%20information%20is%20retrieved.)。

如果你更愿意将所有 CSS 提取到一个文件中，可以通过将 [`build.cssCodeSplit`](/config/build-options.md#build-csscodesplit) 设置为 `false` 来禁用 CSS 代码分割。

### 预加载指令生成

Vite 自动为入口块及其在构建后的 HTML 中的直接导入生成 `<link rel="modulepreload">` 指令。

### 异步块加载优化

在实际应用程序中，Rollup 经常生成“公共”块——两个或多个其他块之间共享的代码。结合动态导入，以下场景非常常见：

<script setup>
import graphSvg from '../images/graph.svg?raw'
</script>
<svg-image :svg="graphSvg" />

在未优化的场景中，当导入异步块 `A` 时，浏览器必须先请求并解析 `A`，然后才能确定它也需要公共块 `C`。这会导致额外的网络往返：

```
Entry ---> A ---> C
```

Vite 自动重写代码分割的动态导入调用，添加预加载步骤，以便当请求 `A` 时，`C` 被 **并行** 获取：

```
Entry ---> (A + C)
```

`C` 可能有进一步的导入，这在未优化的场景中会导致更多的往返。Vite 的优化将追踪所有直接导入，无论导入深度如何，完全消除往返。
