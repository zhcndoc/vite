# 生产环境构建

当需要部署你的应用以用于生产环境时，只需运行 `vite build` 命令。默认情况下，它使用 `<root>/index.html` 作为构建入口点，并生成一个适合通过静态托管服务提供的应用包。查看 [部署静态站点](./static-deploy) 以获取关于流行服务的指南。

<ScrimbaLink href="https://scrimba.com/intro-to-vite-c03p6pbbdq/~037q?via=vite" title="生产环境构建">在 Scrimba 上观看互动课程</ScrimbaLink>

## 浏览器兼容性

默认情况下，生产环境包假设使用的是包含在 [Baseline](https://web-platform-dx.github.io/web-features/) 广泛可用目标中的现代浏览器。默认的浏览器支持范围是：

<!-- 搜索 `ESBUILD_BASELINE_WIDELY_AVAILABLE_TARGET` 常量以获取更多信息 -->

- Chrome >=111
- Edge >=111
- Firefox >=114
- Safari >=16.4

你可以通过 [`build.target` 配置选项](/config/build-options.md#build-target) 指定自定义目标，其中最低目标是 `es2015`。如果设置了更低的目标，Vite 仍然需要这些最低浏览器支持范围，因为它依赖于 [原生 ESM 动态导入](https://caniuse.com/es6-module-dynamic-import) 和 [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta)：

<!-- 搜索 `defaultEsbuildSupported` 常量以获取更多信息 -->

- Chrome >=64
- Firefox >=67
- Safari >=11.1
- Edge >=79

请注意，默认情况下，Vite 仅处理语法转换，**不包含 polyfill**。你可以查看 https://cdnjs.cloudflare.com/polyfill/，它会根据用户的浏览器 UserAgent 字符串自动生成 polyfill 包。

旧版浏览器可以通过 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 支持，它将自动生成旧版块和相应的 ES 语言功能 polyfill。旧版块仅在不支持原生 ESM 的浏览器中条件加载。

## 公共基础路径

- 相关：[资源处理](./assets)

如果你将项目部署在嵌套的公共路径下，只需指定 [`base` 配置选项](/config/shared-options.md#base)，所有资源路径都将相应地重写。此选项也可以作为命令行标志指定，例如 `vite build --base=/my/public/path/`。

JS 导入的资源 URL、CSS `url()` 引用以及 `.html` 文件中的资源引用都会在构建期间自动调整以尊重此选项。

例外情况是你需要动态拼接 URL 时。在这种情况下，你可以使用全局注入的 `import.meta.env.BASE_URL` 变量，它将是公共基础路径。请注意，此变量在构建期间会被静态替换，因此它必须原样出现（即 `import.meta.env['BASE_URL']` 不起作用）。

对于高级基础路径控制，请查看 [高级基础选项](#advanced-base-options)。

### 相对基础路径

如果你事先不知道基础路径，可以将相对基础路径设置为 `"base": "./"` 或 `"base": ""`。这将使所有生成的 URL 相对于每个文件。

:::warning 使用相对基础路径时对旧浏览器的支持

相对基础路径需要 `import.meta` 支持。如果你需要支持 [不支持 `import.meta` 的浏览器](https://caniuse.com/mdn-javascript_operators_import_meta)，你可以使用 [`legacy` 插件](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)。

:::

## 自定义构建

构建可以通过各种 [构建配置选项](/config/build-options.md) 进行自定义。具体来说，你可以通过 `build.rolldownOptions` 直接调整底层的 [Rolldown 选项](https://rolldown.rs/reference/)：

```js [vite.config.js]
export default defineConfig({
  build: {
    rolldownOptions: {
      // https://rolldown.rs/reference/
    },
  },
})
```

例如，你可以指定多个仅在构建期间应用的插件的 Rolldown 输出。

## 分块策略

你可以使用 [`build.rolldownOptions.output.codeSplitting`](https://rolldown.rs/reference/OutputOptions.codeSplitting) 配置如何拆分块（参见 [Rolldown 文档](https://rolldown.rs/in-depth/manual-code-splitting)）。如果你使用框架，请参考其文档以配置如何拆分块。

## 加载错误处理

当动态导入加载失败时，Vite 会发出 `vite:preloadError` 事件。`event.payload` 包含原始导入错误。如果你调用 `event.preventDefault()`，错误将不会被抛出。

```js twoslash
window.addEventListener('vite:preloadError', (event) => {
  window.location.reload() // 例如，刷新页面
})
```

当发生新部署时，托管服务可能会删除以前部署的资源。因此，在新部署之前访问过你站点的用户可能会遇到导入错误。发生此错误是因为在该用户设备上运行的资源已过时，它尝试导入相应的旧块，而该块已被删除。此事件有助于解决这种情况。在这种情况下，请确保在 HTML 文件上设置 `Cache-Control: no-cache`，否则仍将引用旧资源。

## 文件变更时重新构建

你可以使用 `vite build --watch` 启用 rollup 监视器。或者，你可以通过 `build.watch` 直接调整底层的 [`WatcherOptions`](https://rolldown.rs/reference/InputOptions.watch)：

```js [vite.config.js]
export default defineConfig({
  build: {
    watch: {
      // https://rolldown.rs/reference/InputOptions.watch
    },
  },
})
```

启用 `--watch` 标志后，要打包的文件的变更将触发重新构建。请注意，配置及其依赖项的变更需要重新启动构建命令。

## 多页应用

假设你有以下源代码结构：

```
├── package.json
├── vite.config.js
├── index.html
├── main.js
└── nested
    ├── index.html
    └── nested.js
```

在开发期间，只需导航或链接到 `/nested/` - 它按预期工作，就像普通的静态文件服务器一样。

在构建期间，你只需指定多个 `.html` 文件作为入口点：

```js twoslash [vite.config.js]
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        nested: resolve(import.meta.dirname, 'nested/index.html'),
      },
    },
  },
})
```

如果你指定了不同的 root，请记住在解析输入路径时，`import.meta.dirname` 仍然是你的 `vite.config.js` 文件所在的文件夹。因此，你需要将你的 `root` 条目添加到 `resolve` 的参数中。

请注意，对于 HTML 文件，Vite 会忽略 `rolldownOptions.input` 对象中给入口指定的名称，而是在 dist 文件夹中生成 HTML 资源时尊重文件的解析 id。这确保了与开发服务器工作方式一致的结构。

## 库模式

当你开发面向浏览器的库时，你可能大部分时间都在导入实际库的测试/演示页面上。使用 Vite，你可以为此目的使用你的 `index.html` 以获得流畅的开发体验。

当需要打包库以进行分发时，使用 [`build.lib` 配置选项](/config/build-options.md#build-lib)。确保还要外部化任何你不想打包到库中的依赖项，例如 `vue` 或 `react`：

::: code-group

```js twoslash [vite.config.js (单入口)]
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'lib/main.js'),
      name: 'MyLib',
      // 将会添加适当的扩展名
      fileName: 'my-lib',
    },
    rolldownOptions: {
      // 确保外部化那些不应该被打包
      // 到你的库中的依赖
      external: ['vue'],
      output: {
        // 提供全局变量以便在 UMD 构建中使用
        // 用于外部化的依赖
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
```

```js twoslash [vite.config.js (多入口)]
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: {
        'my-lib': resolve(import.meta.dirname, 'lib/main.js'),
        secondary: resolve(import.meta.dirname, 'lib/secondary.js'),
      },
      name: 'MyLib',
    },
    rolldownOptions: {
      // 确保外部化那些不应该被打包
      // 到你的库中的依赖
      external: ['vue'],
      output: {
        // 提供全局变量以便在 UMD 构建中使用
        // 用于外部化的依赖
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
```

:::

入口文件将包含可由你的包用户导入的导出：

```js [lib/main.js]
import Foo from './Foo.vue'
import Bar from './Bar.vue'
export { Foo, Bar }
```

使用此配置运行 `vite build` 会使用面向库发布的 Rollup 预设，并生成两种包格式：

- `es` 和 `umd`（用于单入口）
- `es` 和 `cjs`（用于多入口）

格式可以通过 [`build.lib.formats`](/config/build-options.md#build-lib) 选项进行配置。

```
$ vite build
building for production...
dist/my-lib.js      0.08 kB / gzip: 0.07 kB
dist/my-lib.umd.cjs 0.30 kB / gzip: 0.16 kB
```

recommended 的库 `package.json`：

::: code-group

```json [package.json (单入口)]
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.umd.cjs"
    }
  }
}
```

```json [package.json (多入口)]
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.cjs"
    },
    "./secondary": {
      "import": "./dist/secondary.js",
      "require": "./dist/secondary.cjs"
    }
  }
}
```

:::

### CSS 支持

如果你的库导入了任何 CSS，它将被打包为构建的 JS 文件旁边的单个 CSS 文件，例如 `dist/my-lib.css`。名称默认为 `build.lib.fileName`，但也可以通过 [`build.lib.cssFileName`](/config/build-options.md#build-lib) 更改。

你可以在 `package.json` 中导出 CSS 文件以供用户导入：

```json {12}
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.umd.cjs"
    },
    "./style.css": "./dist/my-lib.css"
  }
}
```

::: tip 文件扩展名
如果 `package.json` 不包含 `"type": "module"`，Vite 将为 Node.js 兼容性生成不同的文件扩展名。`.js` 将变为 `.mjs`，`.cjs` 将变为 `.js`。
:::

::: tip 环境变量
在库模式下，所有 [`import.meta.env.*`](./env-and-mode.md) 用法在生产环境构建时都会被静态替换。但是，`process.env.*` 用法不会被替换，以便你的库的消费者可以动态更改它。如果这不希望如此，你可以使用 `define: { 'process.env.NODE_ENV': '"production"' }` 例如来静态替换它们，或者使用 [`esm-env`](https://github.com/benmccann/esm-env) 以获得与打包器和运行时更好的兼容性。
:::

::: warning 高级用法
库模式包括一个针对面向浏览器和 JS 框架库的简单且固执己见的配置。如果你正在构建非浏览器库，或需要高级构建流程，你可以直接使用 [tsdown](https://tsdown.dev/) 或 [Rolldown](https://rolldown.rs/)。
:::

## 高级 Base 选项

::: warning
此功能处于实验阶段。[提供反馈](https://github.com/vitejs/vite/discussions/13834)。
:::

对于高级用例，部署的资源和公共文件可能位于不同的路径，例如为了使用不同的缓存策略。
用户可以选择部署到三种不同的路径：

- 生成的入口 HTML 文件（可能在 SSR 期间被处理）
- 生成的哈希资源（JS、CSS 和其他文件类型，如图片）
- 复制的 [公共文件](assets.md#the-public-directory)

在这些场景下，单个静态 [base](#public-base-path) 是不够的。Vite 在构建期间提供了实验性的高级基础路径选项支持，使用 `experimental.renderBuiltUrl`。

```ts twoslash
import type { UserConfig } from 'vite'
// prettier-ignore
const config: UserConfig = {
// ---cut-before---
experimental: {
  renderBuiltUrl(filename, { hostType }) {
    if (hostType === 'js') {
      return { runtime: `window.__toCdnUrl(${JSON.stringify(filename)})` }
    } else {
      return { relative: true }
    }
  },
},
// ---cut-after---
}
```

如果哈希资源和公共文件没有部署在一起，可以使用传递给函数的第二个 `context` 参数中包含的资源 `type` 来独立定义每个组的选项。

```ts twoslash
import type { UserConfig } from 'vite'
import path from 'node:path'
// prettier-ignore
const config: UserConfig = {
// ---cut-before---
experimental: {
  renderBuiltUrl(filename, { hostId, hostType, type }) {
    if (type === 'public') {
      return 'https://www.domain.com/' + filename
    } else if (path.extname(hostId) === '.js') {
      return {
        runtime: `window.__assetsPath(${JSON.stringify(filename)})`
      }
    } else {
      return 'https://cdn.domain.com/assets/' + filename
    }
  },
},
// ---cut-after---
}
```

注意，传递的 `filename` 是一个已解码的 URL，如果函数返回一个 URL 字符串，它也应该是已解码的。Vite 会在渲染 URL 时自动处理编码。如果返回的是一个带有 `runtime` 的对象，则需要在必要时自行处理编码，因为运行时代码将原样渲染。
