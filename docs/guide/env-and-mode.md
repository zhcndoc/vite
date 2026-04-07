# 环境变量和模式

Vite 在特殊的 `import.meta.env` 对象下暴露了一些常量。这些常量在开发期间被定义为全局变量，并在构建时被静态替换，以使 tree-shaking 生效。

:::details 示例

```js
if (import.meta.env.DEV) {
  // 这里的代码将在生产构建中被 tree-shaken
  console.log('Dev mode')
}
```

:::

<ScrimbaLink href="https://scrimba.com/intro-to-vite-c03p6pbbdq/~05an?via=vite" title="Vite 中的环境变量">在 Scrimba 上观看互动课程</ScrimbaLink>

## 内置常量

某些内置常量在所有情况下都可用：

- **`import.meta.env.MODE`**: {string} 应用运行的 [模式](#modes)。

- **`import.meta.env.BASE_URL`**: {string} 应用提供服务的基础 url。这由 [`base` 配置选项](/config/shared-options.md#base) 决定。

- **`import.meta.env.PROD`**: {boolean} 应用是否在生产环境中运行（使用 `NODE_ENV='production'` 运行开发服务器，或运行使用 `NODE_ENV='production'` 构建的应用）。

- **`import.meta.env.DEV`**: {boolean} 应用是否在开发环境中运行（始终与 `import.meta.env.PROD` 相反）

- **`import.meta.env.SSR`**: {boolean} 应用是否在 [服务器](./ssr.md#conditional-logic) 上运行。

## 环境变量

Vite 会自动将 `import.meta.env` 对象下的环境变量作为字符串暴露。

以 `VITE_` 为前缀的变量将在 Vite 打包后暴露在客户端源代码中。为了防止意外将环境变量泄露给客户端，请避免使用此前缀。例如，考虑以下情况：

```[.env]
VITE_SOME_KEY=123
DB_PASSWORD=foobar
```

`VITE_SOME_KEY` 的解析值 —— `"123"` —— 将暴露在客户端，但 `DB_PASSWORD` 的值不会。你可以通过在代码中添加以下内容来测试：

```js
console.log(import.meta.env.VITE_SOME_KEY) // "123"
console.log(import.meta.env.DB_PASSWORD) // undefined
```

如果你想自定义环境变量前缀，请参阅 [envPrefix](/config/shared-options.html#envprefix) 选项。

:::tip 环境变量解析
如上所示，`VITE_SOME_KEY` 是一个数字，但解析后返回字符串。布尔环境变量也会发生同样的情况。确保在代码中使用时将其转换为所需的类型。
:::

:::warning 保护机密信息

`VITE_*` 变量 _不应_ 包含敏感信息，例如 API 密钥。这些变量的值会在构建时打包到你的源代码中。对于生产部署，考虑使用后端服务器或 serverless/edge 函数来妥善保护机密信息。

:::

### `.env` 文件

Vite 使用 [dotenv](https://github.com/motdotla/dotenv) 从你的 [环境目录](/config/shared-options.md#envdir) 中的以下文件加载额外的环境变量：

```
.env                # 在所有情况下加载
.env.local          # 在所有情况下加载，被 git 忽略
.env.[mode]         # 仅在指定模式下加载
.env.[mode].local   # 仅在指定模式下加载，被 git 忽略
```

:::tip 环境变量加载优先级

特定模式的环境文件（例如 `.env.production`）将比通用文件（例如 `.env`）具有更高的优先级。

Vite 将始终加载 `.env` 和 `.env.local` 以及特定模式的 `.env.[mode]` 文件。在特定模式文件中声明的变量将优先于通用文件中的变量，但仅在 `.env` 或 `.env.local` 中定义的变量仍然可在环境中使用。

此外，当 Vite 执行时已经存在的环境变量具有最高优先级，不会被 `.env` 文件覆盖。例如，当运行 `VITE_SOME_KEY=123 vite build` 时。

`.env` 文件在 Vite 启动时加载。更改后请重启服务器。

:::

:::warning Bun 用户

当使用 [Bun](https://bun.sh) 时，请注意 Bun 会在脚本运行之前自动加载 `.env` 文件。这种内置行为将环境变量直接加载到 `process.env` 中，并可能会干扰 Vite 的功能，因为它会尊重现有的 `process.env` 值。请参阅 [oven-sh/bun#5515](https://github.com/oven-sh/bun/issues/5515) 了解变通方法。

:::

此外，Vite 使用 [dotenv-expand](https://github.com/motdotla/dotenv-expand) 来开箱即用地展开写在 env 文件中的变量。要了解有关语法的更多信息，请查看 [他们的文档](https://github.com/motdotla/dotenv-expand#what-rules-does-the-expansion-engine-follow)。

请注意，如果你想在环境值中使用 `$`，必须用 `\` 转义它。

```[.env]
KEY=123
NEW_KEY1=test$foo   # 测试
NEW_KEY2=test\$foo  # test$foo
NEW_KEY3=test$KEY   # test123
```

::: details 逆序展开变量

Vite 支持逆序展开变量。
例如，下面的 `.env` 将被评估为 `VITE_FOO=foobar`，`VITE_BAR=bar`。

```[.env]
VITE_FOO=foo${VITE_BAR}
VITE_BAR=bar
```

这在 shell 脚本和其他工具（如 `docker compose`）中不起作用。
也就是说，Vite 支持这种行为，因为 `dotenv-expand` 长期以来一直支持这种行为，并且 JavaScript 生态系统中的其他工具使用支持这种行为的旧版本。

为了避免互操作性问题，建议避免依赖这种行为。Vite 未来可能会开始针对这种行为发出警告。

:::

:::warning 忽略本地 `.env` 文件

`.env.*.local` 文件仅限本地使用，可能包含敏感变量。你应该将 `*.local` 添加到你的 `.gitignore` 中，以避免它们被提交到 git。

:::

## TypeScript 的智能感知

默认情况下，Vite 在 [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts) 中为 `import.meta.env` 提供类型定义。虽然你可以在 `.env.[mode]` 文件中定义更多自定义环境变量，但你可能希望为以 `VITE_` 为前缀的用户定义环境变量获得 TypeScript 智能感知。

为了实现这一点，你可以在 `src` 目录中创建一个 `vite-env.d.ts`，然后像这样增强 `ImportMetaEnv`：

```typescript [vite-env.d.ts]
interface ViteTypeOptions {
  // 通过添加此行，你可以使 ImportMetaEnv 的类型严格化
  // 以不允许未知的键。
  // strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

如果你的代码依赖于来自浏览器环境的类型，例如 [DOM](https://github.com/microsoft/TypeScript/blob/main/src/lib/dom.generated.d.ts) 和 [WebWorker](https://github.com/microsoft/TypeScript/blob/main/src/lib/webworker.generated.d.ts)，你可以更新 `tsconfig.json` 中的 [lib](https://www.typescriptlang.org/tsconfig#lib) 字段。

```json [tsconfig.json]
{
  "lib": ["WebWorker"]
}
```

:::warning 导入将破坏类型增强

如果 `ImportMetaEnv` 增强不起作用，请确保你在 `vite-env.d.ts` 中没有任何 `import` 语句。有关更多信息，请参阅 [TypeScript 文档](https://www.typescriptlang.org/docs/handbook/2/modules.html#how-javascript-modules-are-defined)。

:::

## HTML 常量替换

Vite 还支持替换 HTML 文件中的常量。`import.meta.env` 中的任何属性都可以在 HTML 文件中使用特殊的 `%CONST_NAME%` 语法：

```html
<h1>Vite 运行在 %MODE%</h1>
<p>使用来自 %VITE_API_URL% 的数据</p>
```

如果环境变量不存在于 `import.meta.env` 中，例如 `%NON_EXISTENT%`，它将被忽略且不被替换，这与 JS 中的 `import.meta.env.NON_EXISTENT` 不同，后者被替换为 `undefined`。

鉴于 Vite 被许多框架使用，它故意不对复杂的替换（如条件语句）持意见。Vite 可以使用 [现有的用户端插件](https://github.com/vitejs/awesome-vite#transformers) 或实现 [`transformIndexHtml` 钩子](./api-plugin#transformindexhtml) 的自定义插件进行扩展。

## 模式

默认情况下，开发服务器（`dev` 命令）在 `development` 模式下运行，`build` 命令在 `production` 模式下运行。

这意味着当运行 `vite build` 时，如果有 `.env.production`，它将加载其中的环境变量：

```[.env.production]
VITE_APP_TITLE=My App
```

在你的应用中，你可以使用 `import.meta.env.VITE_APP_TITLE` 渲染标题。

在某些情况下，你可能希望使用不同的模式运行 `vite build` 以渲染不同的标题。你可以通过传递 `--mode` 选项标志来覆盖命令使用的默认模式。例如，如果你想为 staging 模式构建应用：

```bash
vite build --mode staging
```

并创建一个 `.env.staging` 文件：

```[.env.staging]
VITE_APP_TITLE=My App (staging)
```

由于 `vite build` 默认运行生产构建，你也可以更改此项，通过使用不同的模式和 `.env` 文件配置来运行开发构建：

```[.env.testing]
NODE_ENV=development
```

### NODE_ENV 和模式

重要的是要注意 `NODE_ENV` (`process.env.NODE_ENV`) 和模式是两个不同的概念。以下是不同命令如何影响 `NODE_ENV` 和模式：

| 命令                                                 | NODE_ENV        | 模式            |
| ---------------------------------------------------- | --------------- | --------------- |
| `vite build`                                         | `"production"`  | `"production"`  |
| `vite build --mode development`                      | `"production"`  | `"development"` |
| `NODE_ENV=development vite build`                    | `"development"` | `"production"`  |
| `NODE_ENV=development vite build --mode development` | `"development"` | `"development"` |

`NODE_ENV` 和模式的不同值也反映在其对应的 `import.meta.env` 属性上：

| 命令                   | `import.meta.env.PROD` | `import.meta.env.DEV` |
| ---------------------- | ---------------------- | --------------------- |
| `NODE_ENV=production`  | `true`                 | `false`               |
| `NODE_ENV=development` | `false`                | `true`                |
| `NODE_ENV=other`       | `false`                | `true`                |

| 命令                 | `import.meta.env.MODE` |
| -------------------- | ---------------------- |
| `--mode production`  | `"production"`         |
| `--mode development` | `"development"`        |
| `--mode staging`     | `"staging"`            |

:::tip `.env` 文件中的 `NODE_ENV`

`NODE_ENV=...` 可以在命令中设置，也可以在你的 `.env` 文件中设置。如果在 `.env.[mode]` 文件中指定了 `NODE_ENV`，则模式可用于控制其值。但是，`NODE_ENV` 和模式仍然是两个不同的概念。

在命令中使用 `NODE_ENV=...` 的主要好处是它允许 Vite 早期检测该值。它还允许你在 Vite 配置中读取 `process.env.NODE_ENV`，因为 Vite 只能在配置评估后加载 env 文件。
:::
