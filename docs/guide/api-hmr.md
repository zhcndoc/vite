# HMR API

:::tip 注意
这是客户端 HMR API。对于在插件中处理 HMR 更新，请参阅 [handleHotUpdate](./api-plugin#handlehotupdate)。

手动 HMR API 主要面向框架和工具作者。作为最终用户，HMR 可能已经在特定框架的启动模板中为你处理好了。
:::

Vite 通过特殊的 `import.meta.hot` 对象暴露其手动 HMR API：

```ts twoslash
import type { ModuleNamespace } from 'vite/types/hot.d.ts'
import type {
  CustomEventName,
  InferCustomEventPayload,
} from 'vite/types/customEvent.d.ts'

// ---cut---
interface ImportMeta {
  readonly hot?: ViteHotContext
}

interface ViteHotContext {
  readonly data: any

  accept(): void
  accept(cb: (mod: ModuleNamespace | undefined) => void): void
  accept(dep: string, cb: (mod: ModuleNamespace | undefined) => void): void
  accept(
    deps: readonly string[],
    cb: (mods: Array<ModuleNamespace | undefined>) => void,
  ): void

  dispose(cb: (data: any) => void): void
  prune(cb: (data: any) => void): void
  invalidate(message?: string): void

  on<T extends CustomEventName>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void
  off<T extends CustomEventName>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void
  send<T extends CustomEventName>(
    event: T,
    data?: InferCustomEventPayload<T>,
  ): void
}
```

## 必需的条件守卫

首先，确保使用条件块守卫所有 HMR API 的使用，以便代码可以在生产环境中被 tree-shaken：

```js
if (import.meta.hot) {
  // HMR 代码
}
```

## TypeScript 的智能感知

Vite 在 [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts) 中为 `import.meta.hot` 提供了类型定义。你可以在 `tsconfig.json` 中添加 "vite/client"，以便 TypeScript 获取类型定义：

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

## `hot.accept(cb)`

要使模块自接受，请使用 `import.meta.hot.accept` 并传入一个回调函数，该回调接收更新后的模块：

```js twoslash
import 'vite/client'
// ---cut---
export const count = 1

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      // 当发生 SyntaxError 时 newModule 为 undefined
      console.log('updated: count is now ', newModule.count)
    }
  })
}
```

“接受”热更新的模块被视为 **HMR 边界**。

```dot
digraph hmr_boundary {
  rankdir=RL
  ranksep=0.3
  node [shape=box style="rounded,filled" fontname="Arial" fontsize=11 margin="0.2,0.1" fontcolor="${#3c3c43|#ffffff}" color="${#c2c2c4|#3c3f44}"]
  edge [color="${#67676c|#98989f}" fontname="Arial" fontsize=10 fontcolor="${#67676c|#98989f}"]
  bgcolor="transparent"

  root [label="main.js" fillcolor="${#f6f6f7|#2e2e32}"]
  parent [label="App.vue" fillcolor="${#f6f6f7|#2e2e32}"]
  boundary [label="Component.vue\n(HMR boundary)\nhot.accept()" fillcolor="${#def5ed|#15312d}" color="${#18794e|#3dd68c}" penwidth=2]
  edited [label="utils.js\n(edited)" fillcolor="${#fcf4dc|#38301a}" color="${#915930|#f9b44e}" penwidth=2]

  boundary -> edited [label="imports" color="${#915930|#f9b44e}" style=bold]
  parent -> boundary [label="imports" style=dashed]
  root -> parent [label="imports" style=dashed]
}
```

Vite 的 HMR 实际上并不交换最初导入的模块：如果 HMR 边界模块重新导出来自依赖的导入，则它负责更新这些重新导出（并且这些导出必须使用 `let`）。此外，边界模块链上的导入者不会收到更改通知。这种简化的 HMR 实现足以满足大多数开发用例，同时允许我们跳过生成代理模块的昂贵工作。

Vite 要求此函数的调用在源代码中显示为 `import.meta.hot.accept(`（对空格敏感），以便模块接受更新。这是 Vite 进行静态分析以启用模块 HMR 支持的要求。

## `hot.accept(deps, cb)`

模块也可以接受来自直接依赖的更新而无需重新加载自身：

```js twoslash
// @filename: /foo.d.ts
export declare const foo: () => void

// @filename: /example.js
import 'vite/client'
// ---cut---
import { foo } from './foo.js'

foo()

if (import.meta.hot) {
  import.meta.hot.accept('./foo.js', (newFoo) => {
    // 回调接收更新后的 './foo.js' 模块
    newFoo?.foo()
  })

  // 也可以接受一个依赖模块数组：
  import.meta.hot.accept(
    ['./foo.js', './bar.js'],
    ([newFooModule, newBarModule]) => {
      // 回调接收一个数组，其中只有更新的模块
      // 非 null。如果更新不成功（例如语法错误），
      // 数组为空
    },
  )
}
```

## `hot.dispose(cb)`

自接受模块或期望被其他模块接受的模块可以使用 `hot.dispose` 清理由其更新副本创建的任何持久副作用：

```js twoslash
import 'vite/client'
// ---cut---
function setupSideEffect() {}

setupSideEffect()

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    // 清理副作用
  })
}
```

## `hot.prune(cb)`

注册一个回调，当模块不再在页面上被导入时将调用该回调。与 `hot.dispose` 相比，如果源代码在更新时自行清理副作用，而你只需要在从页面移除时清理，则可以使用此方法。Vite 目前将此用于 `.css` 导入。

```js twoslash
import 'vite/client'
// ---cut---
function setupOrReuseSideEffect() {}

setupOrReuseSideEffect()

if (import.meta.hot) {
  import.meta.hot.prune((data) => {
    // 清理副作用
  })
}
```

## `hot.data`

`import.meta.hot.data` 对象在同一更新模块的不同实例之间持久存在。它可用于将信息从模块的先前版本传递到下一个版本。

注意，不支持重新赋值 `data` 本身。相反，你应该修改 `data` 对象的属性，以便保留从其他处理程序添加的信息。

```js twoslash
import 'vite/client'
// ---cut---
// 可以
import.meta.hot.data.someValue = 'hello'

// 不支持
import.meta.hot.data = { someValue: 'hello' }
```

## `hot.decline()`

这目前是一个空操作（noop），存在是为了向后兼容。如果未来有新的用途，这可能会改变。要指示模块不可热更新，请使用 `hot.invalidate()`。

## `hot.invalidate(message?: string)`

自接受模块可能在运行时意识到它无法处理 HMR 更新，因此需要将更新强制传播给导入者。通过调用 `import.meta.hot.invalidate()`，HMR 服务器将使调用者的导入者失效，就像调用者不是自接受的一样。这将在浏览器控制台和终端中记录消息。你可以传递一条消息来提供一些关于为何发生失效的上下文。

注意，即使你计划立即调用 `invalidate`，也应该始终调用 `import.meta.hot.accept`，否则 HMR 客户端将不会监听自接受模块的未来更改。为了清楚地传达你的意图，我们建议在 `accept` 回调中调用 `invalidate`，如下所示：

```js twoslash
import 'vite/client'
// ---cut---
import.meta.hot.accept((module) => {
  // 你可以使用新模块实例来决定是否失效。
  if (cannotHandleUpdate(module)) {
    import.meta.hot.invalidate()
  }
})
```

## `hot.on(event, cb)`

监听 HMR 事件。

Vite 自动分发以下 HMR 事件：

- `'vite:beforeUpdate'` 当更新即将应用时（例如模块将被替换）
- `'vite:afterUpdate'` 当更新刚刚应用时（例如模块已被替换）
- `'vite:beforeFullReload'` 当即将发生完整重载时
- `'vite:beforePrune'` 当不再需要的模块即将被修剪时
- `'vite:invalidate'` 当模块被 `import.meta.hot.invalidate()` 失效时
- `'vite:error'` 当发生错误时（例如语法错误）
- `'vite:ws:disconnect'` 当 WebSocket 连接丢失时
- `'vite:ws:connect'` 当 WebSocket 连接（重新）建立时

自定义 HMR 事件也可以从插件发送。请参阅 [handleHotUpdate](./api-plugin#handlehotupdate) 了解更多详情。

## `hot.off(event, cb)`

从事件监听器中移除回调。

## `hot.send(event, data)`

将自定义事件发送回 Vite 的开发服务器。

如果在连接之前调用，数据将被缓冲，并在连接建立后发送。

请参阅 [客户端 - 服务器通信](/guide/api-plugin.html#client-server-communication) 了解更多详情，包括关于 [自定义事件类型化](/guide/api-plugin.html#typescript-for-custom-events) 的部分。

## 进一步阅读

如果你想了解更多关于如何使用 HMR API 以及它在底层如何工作的信息。请查看这些资源：

- [热模块替换很简单](https://bjornlu.com/blog/hot-module-replacement-is-easy)
