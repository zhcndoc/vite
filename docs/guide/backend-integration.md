# 后端集成

:::tip 注意
如果您想使用传统后端（例如 Rails、Laravel）来提供 HTML，但使用 Vite 来提供资源，请查看 [Awesome Vite](https://github.com/vitejs/awesome-vite#integrations-with-backends) 中列出的现有集成。

如果您需要自定义集成，可以按照本指南中的步骤手动配置。
:::

1. 在您的 Vite 配置中，配置入口并启用构建清单：

   ```js twoslash [vite.config.js]
   import { defineConfig } from 'vite'
   // ---cut---
   export default defineConfig({
     server: {
       cors: {
         // 您将通过浏览器访问的源
         origin: 'http://my-backend.example.com',
       },
     },
     build: {
       // 在 outDir 中生成 .vite/manifest.json
       manifest: true,
       rollupOptions: {
         // 覆盖默认的 .html 入口
         input: '/path/to/main.js',
       },
     },
   })
   ```

   如果您没有禁用 [模块预加载 polyfill](/config/build-options.md#build-polyfillmodulepreload)，您还需要在入口文件中导入 polyfill

   ```js
   // 添加到您的应用入口开头
   import 'vite/modulepreload-polyfill'
   ```

2. 对于开发环境，在服务器的 HTML 模板中注入以下内容（将 `http://localhost:5173` 替换为 Vite 运行的本地 URL）：

   ```html
   <!-- 如果是开发环境 -->
   <script type="module" src="http://localhost:5173/@vite/client"></script>
   <script type="module" src="http://localhost:5173/main.js"></script>
   ```

   为了正确提供资源，您有两个选项：
   - 确保服务器配置为将静态资源请求代理到 Vite 服务器
   - 设置 [`server.origin`](/config/server-options.md#server-origin)，以便生成的资源 URL 将使用后端服务器 URL 解析，而不是相对路径

   这对于图像等资源正确加载是必需的。

   注意，如果您将 React 与 `@vitejs/plugin-react` 一起使用，您还需要在上述脚本之前添加此内容，因为该插件无法修改您提供的 HTML（将 `http://localhost:5173` 替换为 Vite 运行的本地 URL）：

   ```html
   <script type="module">
     import RefreshRuntime from 'http://localhost:5173/@react-refresh'
     RefreshRuntime.injectIntoGlobalHook(window)
     window.$RefreshReg$ = () => {}
     window.$RefreshSig$ = () => (type) => type
     window.__vite_plugin_react_preamble_installed__ = true
   </script>
   ```

3. 对于生产环境，运行 `vite build` 后，`.vite/manifest.json` 文件将与其他资源文件一起生成。清单文件示例如下：

   ```json [.vite/manifest.json] style:max-height:400px
   {
     "_shared-B7PI925R.js": {
       "file": "assets/shared-B7PI925R.js",
       "name": "shared",
       "css": ["assets/shared-ChJ_j-JJ.css"]
     },
     "_shared-ChJ_j-JJ.css": {
       "file": "assets/shared-ChJ_j-JJ.css",
       "src": "_shared-ChJ_j-JJ.css"
     },
     "logo.svg": {
       "file": "assets/logo-BuPIv-2h.svg",
       "src": "logo.svg"
     },
     "baz.js": {
       "file": "assets/baz-B2H3sXNv.js",
       "name": "baz",
       "src": "baz.js",
       "isDynamicEntry": true
     },
     "views/bar.js": {
       "file": "assets/bar-gkvgaI9m.js",
       "name": "bar",
       "src": "views/bar.js",
       "isEntry": true,
       "imports": ["_shared-B7PI925R.js"],
       "dynamicImports": ["baz.js"]
     },
     "views/foo.js": {
       "file": "assets/foo-BRBmoGS9.js",
       "name": "foo",
       "src": "views/foo.js",
       "isEntry": true,
       "imports": ["_shared-B7PI925R.js"],
       "css": ["assets/foo-5UjPuW-k.css"]
     }
   }
   ```

   清单将源文件映射到它们的构建输出和依赖项：

   ```dot
   digraph manifest {
     rankdir=TB
     node [shape=box style="rounded,filled" fontname="Arial" fontsize=10 margin="0.2,0.1" fontcolor="${#3c3c43|#ffffff}" color="${#c2c2c4|#3c3f44}"]
     edge [color="${#67676c|#98989f}" fontname="Arial" fontsize=9 fontcolor="${#67676c|#98989f}"]
     bgcolor="transparent"

     foo [label="views/foo.js\n(entry)" fillcolor="${#e9eaff|#222541}"]
     bar [label="views/bar.js\n(entry)" fillcolor="${#e9eaff|#222541}"]
     shared [label="_shared-B7PI925R.js\n(common chunk)" fillcolor="${#f2ecfc|#2c273e}"]
     baz [label="baz.js\n(dynamic import)" fillcolor="${#fcf4dc|#38301a}"]
     foocss [label="foo.css" shape=ellipse fillcolor="${#fde4e8|#3a1d27}"]
     sharedcss [label="shared.css" shape=ellipse fillcolor="${#fde4e8|#3a1d27}"]
     logo [label="logo.svg\n(asset)" shape=ellipse fillcolor="${#def5ed|#15312d}"]

     foo -> shared [label="imports"]
     bar -> shared [label="imports"]
     bar -> baz [label="dynamicImports" style=dashed]
     foo -> foocss [label="css"]
     shared -> sharedcss [label="css"]
   }
   ```

   清单具有 `Record<name, chunk>` 结构，其中每个块遵循 `ManifestChunk` 接口：

   ```ts style:max-height:400px
   interface ManifestChunk {
     /**
      * 此块/资源的输入文件名（如果已知）
      */
     src?: string
     /**
      * 此块/资源的输出文件名
      */
     file: string
     /**
      * 此块导入的 CSS 文件列表
      */
     css?: string[]
     /**
      * 此块导入的资源文件列表，不包括 CSS 文件
      */
     assets?: string[]
     /**
      * 此块或资源是否为入口点
      */
     isEntry?: boolean
     /**
      * 此块/资源的名称（如果已知）
      */
     name?: string
     /**
      * 此块是否为动态入口点
      *
      * 此字段仅存在于 JS 块中。
      */
     isDynamicEntry?: boolean
     /**
      * 此块静态导入的块列表
      *
      * 值是清单的键。此字段仅存在于 JS 块中。
      */
     imports?: string[]
     /**
      * 此块动态导入的块列表
      *
      * 值是清单的键。此字段仅存在于 JS 块中。
      */
     dynamicImports?: string[]
   }
   ```

   清单中的每个条目代表以下内容之一：
   - **入口块**：由 [`build.rollupOptions.input`](https://rollupjs.org/configuration-options/#input) 中指定的文件生成。这些块具有 `isEntry: true`，其键是从项目根目录开始的相对 src 路径。
   - **动态入口块**：由动态导入生成。这些块具有 `isDynamicEntry: true`，其键是从项目根目录开始的相对 src 路径。
   - **非入口块**：其键是生成文件的基本名称，前缀为 `_`。
   - **资源块**：由导入的资源（如图像、字体）生成。其键是从项目根目录开始的相对 src 路径。
   - **CSS 文件**：当 [`build.cssCodeSplit`](/config/build-options.md#build-csscodesplit) 为 `false` 时，生成单个 CSS 文件，键为 `style.css`。当 `build.cssCodeSplit` 不为 `false` 时，键的生成方式类似于 JS 块（即入口块不会有 `_` 前缀，非入口块会有 `_` 前缀）。

   JS 块（除资源或 CSS 之外的块）将包含有关其静态和动态导入的信息（两者都是映射到清单中相应块的键）。块还列出它们对应的 CSS 和资源文件（如果有的话）。

4. 您可以使用此文件来渲染带有哈希文件名的链接或预加载指令。

   这是一个渲染适当链接的 HTML 模板示例。这里的语法仅用于
   说明，请替换为您的服务器模板语言。`importedChunks`
   函数仅用于说明，不由 Vite 提供。

   ```html
   <!-- 如果是生产环境 -->

   <!-- 对于 manifest[name].css 中的 cssFile -->
   <link rel="stylesheet" href="/{{ cssFile }}" />

   <!-- 对于 importedChunks(manifest, name) 中的 chunk -->
   <!-- 对于 chunk.css 中的 cssFile -->
   <link rel="stylesheet" href="/{{ cssFile }}" />

   <script type="module" src="/{{ manifest[name].file }}"></script>

   <!-- 对于 importedChunks(manifest, name) 中的 chunk -->
   <link rel="modulepreload" href="/{{ chunk.file }}" />
   ```

   具体来说，给定清单文件和入口点，生成 HTML 的后端应包含以下标签。注意，遵循此顺序是为了获得最佳性能：
   1. 为入口点块的 `css` 列表中的每个文件（如果存在）添加一个 `<link rel="stylesheet">` 标签
   2. 递归跟踪入口点 `imports` 列表中的所有块，并为每个导入块的 `css` 列表中的每个 CSS 文件（如果存在）包含一个
      `<link rel="stylesheet">` 标签。
   3. 为入口点块的 `file` 键添加一个标签。对于 JavaScript 可以是 `<script type="module">`，对于 CSS 可以是 `<link rel="stylesheet">`。
   4. 可选地，为每个导入的 JavaScript 块的 `file` 添加 `<link rel="modulepreload">` 标签，同样从入口点块开始递归跟踪导入。

   遵循上面的示例清单，对于入口点 `views/foo.js`，生产环境中应包含以下标签：

   ```html
   <link rel="stylesheet" href="assets/foo-5UjPuW-k.css" />
   <link rel="stylesheet" href="assets/shared-ChJ_j-JJ.css" />
   <script type="module" src="assets/foo-BRBmoGS9.js"></script>
   <!-- 可选 -->
   <link rel="modulepreload" href="assets/shared-B7PI925R.js" />
   ```

   而对于入口点 `views/bar.js` 应包含以下内容：

   ```html
   <link rel="stylesheet" href="assets/shared-ChJ_j-JJ.css" />
   <script type="module" src="assets/bar-gkvgaI9m.js"></script>
   <!-- 可选 -->
   <link rel="modulepreload" href="assets/shared-B7PI925R.js" />
   ```

   ::: details `importedChunks` 的伪实现
   TypeScript 中 `importedChunks` 的示例伪实现（这需要
   针对您的编程语言和模板语言进行调整）：

   ```ts
   import type { Manifest, ManifestChunk } from 'vite'

   export default function importedChunks(
     manifest: Manifest,
     name: string,
   ): ManifestChunk[] {
     const seen = new Set<string>()

     function getImportedChunks(chunk: ManifestChunk): ManifestChunk[] {
       const chunks: ManifestChunk[] = []
       for (const file of chunk.imports ?? []) {
         const importee = manifest[file]
         if (seen.has(file)) {
           continue
         }
         seen.add(file)

         chunks.push(...getImportedChunks(importee))
         chunks.push(importee)
       }

       return chunks
     }

     return getImportedChunks(manifest[name])
   }
   ```

   :::
