# 性能

虽然 Vite 默认情况下很快，但随着项目需求的增长，性能问题可能会出现。本指南旨在帮助你识别和修复常见的性能问题，例如：

- 服务器启动缓慢
- 页面加载缓慢
- 构建缓慢

## 检查你的浏览器设置

某些浏览器扩展可能会干扰请求并减慢大型应用的启动和重载时间，尤其是在使用浏览器开发工具时。我们建议在这些情况下使用 Vite 的开发服务器时，创建一个不含扩展的仅开发配置文件，或切换到无痕模式。无痕模式通常也比不含扩展的常规配置文件更快。

Vite 开发服务器会对预捆绑的依赖项进行硬缓存，并为源代码实现快速的 304 响应。在打开浏览器开发工具时禁用缓存会对启动和全页面重载时间产生很大影响。请确保在使用 Vite 服务器时未启用“禁用缓存”。

## 审查配置的 Vite 插件

Vite 的内部和官方插件经过优化，旨在提供与更广泛生态系统兼容性的同时执行最少的工作。例如，代码转换在开发模式下使用正则表达式，但在构建模式下进行完整解析以确保正确性。

然而，社区插件的性能不在 Vite 的控制范围内，这可能会影响开发体验。以下是使用额外 Vite 插件时可以注意的一些事项：

1. 仅在某些情况下使用的大型依赖项应动态导入，以减少 Node.js 启动时间。重构示例：[vite-plugin-react#212](https://github.com/vitejs/vite-plugin-react/pull/212) 和 [vite-plugin-pwa#224](https://github.com/vite-pwa/vite-plugin-pwa/pull/244)。

2. `buildStart`、`config` 和 `configResolved` 钩子不应运行长时间且广泛的操作。这些钩子在开发服务器启动期间会被等待，这会延迟你在浏览器中访问网站的时间。

3. `resolveId`、`load` 和 `transform` 钩子可能导致某些文件加载比其他文件慢。虽然有时不可避免，但仍然值得检查可能的优化区域。例如，在进行完整转换之前，检查 `code` 是否包含特定关键字，或 `id` 是否匹配特定扩展名。

   转换文件所需的时间越长，在浏览器中加载网站时的请求瀑布流就越显著。

   你可以使用 `vite --debug plugin-transform` 或 [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) 检查转换文件所需的时间。请注意，由于异步操作往往提供不准确的时间，你应该将这些数字视为粗略估计，但它仍然应该揭示更昂贵的操作。

::: tip 性能分析
你可以运行 `vite --profile`，访问网站，然后在终端中按 `p + enter` 来记录 `.cpuprofile`。然后可以使用像 [speedscope](https://www.speedscope.app) 这样的工具来检查配置文件并识别瓶颈。你也可以 [与 Vite 团队分享配置文件](https://chat.vite.dev) 以帮助我们识别性能问题。
:::

## 减少解析操作

解析导入路径在最坏情况下经常发生时可能是一项昂贵的操作。例如，Vite 支持通过 [`resolve.extensions`](/config/shared-options.md#resolve-extensions) 选项“猜测”导入路径，默认为 `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']`。

当你尝试通过 `import './Component'` 导入 `./Component.jsx` 时，Vite 将运行以下步骤来解析它：

1. 检查 `./Component` 是否存在，否。
2. 检查 `./Component.mjs` 是否存在，否。
3. 检查 `./Component.js` 是否存在，否。
4. 检查 `./Component.mts` 是否存在，否。
5. 检查 `./Component.ts` 是否存在，否。
6. 检查 `./Component.jsx` 是否存在，是！

如图所示，解析导入路径总共需要 6 次文件系统检查。你拥有的隐式导入越多，解析路径所花费的时间就越多。

因此，通常最好明确指定导入路径，例如 `import './Component.jsx'`。你也可以缩小 `resolve.extensions` 的列表以减少常规文件系统检查，但你必须确保它也适用于 `node_modules` 中的文件。

如果你是插件作者，请确保仅在需要时调用 [`this.resolve`](https://rollupjs.org/plugin-development/#this-resolve) 以减少上述检查次数。

::: tip TypeScript
如果你使用的是 TypeScript，请在 `tsconfig.json` 的 `compilerOptions` 中启用 `"moduleResolution": "bundler"` 和 `"allowImportingTsExtensions": true`，以便直接在代码中使用 `.ts` 和 `.tsx` 扩展名。
:::

## 避免 Barrel 文件

Barrel 文件是重新导出同一目录中其他文件 API 的文件。例如：

```js [src/utils/index.js]
export * from './color.js'
export * from './dom.js'
export * from './slash.js'
```

当你只导入单个 API 时，例如 `import { slash } from './utils'`，该 barrel 文件中的所有文件都需要被获取和转换，因为它们可能包含 `slash` API，也可能包含在初始化时运行的副作用。这意味着你在初始页面加载时加载了比所需更多的文件，导致页面加载变慢。

如果可能，你应该避免使用 barrel 文件并直接导入单个 API，例如 `import { slash } from './utils/slash.js'`。你可以阅读 [issue #8237](https://github.com/vitejs/vite/issues/8237) 获取更多信息。

## 预热常用文件

Vite 开发服务器仅转换浏览器请求的文件，这使其能够快速启动并仅对已用文件应用转换。如果它预计某些文件很快会被请求，它也可以预转换文件。然而，如果某些文件的转换时间比其他文件长，仍然可能发生请求瀑布流。例如：

给定一个导入图，其中左侧文件导入右侧文件：

```
main.js -> BigComponent.vue -> big-utils.js -> large-data.json
```

导入关系只能在文件转换后才知道。如果 `BigComponent.vue` 需要一些时间来转换，`big-utils.js` 必须等待轮到它，依此类推。即使有内置的预转换，这也会导致内部瀑布流。

Vite 允许你预热你知道经常使用的文件，例如 `big-utils.js`，使用 [`server.warmup`](/config/server-options.md#server-warmup) 选项。这样 `big-utils.js` 将准备好并缓存，以便在请求时立即提供服务。

你可以通过运行 `vite --debug transform` 并检查日志来找到经常使用的文件：

```bash
vite:transform 28.72ms /@vite/client +1ms
vite:transform 62.95ms /src/components/BigComponent.vue +1ms
vite:transform 102.54ms /src/utils/big-utils.js +1ms
```

```js [vite.config.js]
export default defineConfig({
  server: {
    warmup: {
      clientFiles: [
        './src/components/BigComponent.vue',
        './src/utils/big-utils.js',
      ],
    },
  },
})
```

请注意，你应该只预热经常使用的文件，以免在启动时过载 Vite 开发服务器。查看 [`server.warmup`](/config/server-options.md#server-warmup) 选项获取更多信息。

使用 [`--open` 或 `server.open`](/config/server-options.html#server-open) 也能提供性能提升，因为 Vite 会自动预热你的应用入口点或提供的要打开的 URL。

## 使用更少或原生工具

随着代码库的增长保持 Vite 的快速性在于减少源文件（JS/TS/CSS）的工作量。

减少工作的示例：

- 尽可能使用 CSS 而不是 Sass/Less/Stylus（嵌套可以由 PostCSS / Lightning CSS 处理）
- 不要将 SVG 转换为 UI 框架组件（React、Vue 等）。而是将它们作为字符串或 URL 导入。

使用原生工具的示例：

虽然 Vite 核心基于原生工具，但某些功能默认仍使用非原生工具以提供更好的兼容性和功能集。但对于大型应用程序来说，这可能值得付出代价。

- 尝试实验性支持 [LightningCSS](https://github.com/vitejs/vite/discussions/13835)
