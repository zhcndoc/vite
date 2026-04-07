# 命令行界面

## 开发服务器

### `vite`

在当前目录启动 Vite 开发服务器。`vite dev` 和 `vite serve` 是 `vite` 的别名。

#### 用法

```bash
vite [root]
```

#### 选项

| 选项                      |                                                                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `--host [host]`           | 指定主机名 (`string`)                                                                                                                      |
| `--port <port>`           | 指定端口 (`number`)                                                                                                                        |
| `--open [path]`           | 启动时打开浏览器 (`boolean \| string`)                                                                                                     |
| `--cors`                  | 启用 CORS (`boolean`)                                                                                                                      |
| `--strictPort`            | 如果指定端口已被使用则退出 (`boolean`)                                                                                                     |
| `--force`                 | 强制优化器忽略缓存并重新打包 (`boolean`)                                                                                                   |
| `-c, --config <file>`     | 使用指定的配置文件 (`string`)                                                                                                              |
| `--base <path>`           | 公共基础路径（默认：`/`）(`string`)                                                                                                        |
| `-l, --logLevel <level>`  | info \| warn \| error \| silent (`string`)                                                                                                 |
| `--clearScreen`           | 允许/禁止日志记录时清屏 (`boolean`)                                                                                                        |
| `--configLoader <loader>` | 使用 `bundle` 通过 Rolldown 打包配置文件，或使用 `runner`（实验性）即时处理，或使用 `native`（实验性）通过原生运行时加载（默认：`bundle`） |
| `--profile`               | 启动内置 Node.js 检查器（查看 [性能瓶颈](/guide/troubleshooting#performance-bottlenecks)）                                                 |
| `-d, --debug [feat]`      | 显示调试日志 (`string \| boolean`)                                                                                                         |
| `-f, --filter <filter>`   | 过滤调试日志 (`string`)                                                                                                                    |
| `-m, --mode <mode>`       | 设置环境变量模式 (`string`)                                                                                                                |
| `-h, --help`              | 显示可用的 CLI 选项                                                                                                                        |
| `-v, --version`           | 显示版本号                                                                                                                                 |

## 构建

### `vite build`

生产环境构建。

#### 用法

```bash
vite build [root]
```

#### 选项

| 选项                           |                                                                                               |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
| `--target <target>`            | 转译目标（默认：`"modules"`）(`string`)                                                       |
| `--outDir <dir>`               | 输出目录（默认：`dist`）(`string`)                                                            |
| `--assetsDir <dir>`            | 输出目录下放置静态资源的目录（默认：`"assets"`）(`string`)                                    |
| `--assetsInlineLimit <number>` | 静态资源 base64 内联阈值（字节）（默认：`4096`）(`number`)                                    |
| `--ssr [entry]`                | 构建指定的服务端渲染入口 (`string`)                                                           |
| `--sourcemap [output]`         | 输出构建的源码映射（默认：`false`）(`boolean \| "inline" \| "hidden"`)                        |
| `--minify [minifier]`          | 启用/禁用压缩，或指定使用的压缩器（默认：`"esbuild"`）(`boolean \| "terser" \| "esbuild"`)    |
| `--manifest [name]`            | 生成构建清单 json (`boolean \| string`)                                                       |
| `--ssrManifest [name]`         | 生成 ssr 清单 json (`boolean \| string`)                                                      |
| `--emptyOutDir`                | 当 outDir 在 root 之外时强制清空 outDir (`boolean`)                                           |
| `-w, --watch`                  | 当磁盘上的模块发生更改时重新构建 (`boolean`)                                                  |
| `-c, --config <file>`          | 使用指定的配置文件 (`string`)                                                                 |
| `--base <path>`                | 公共基础路径（默认：`/`）(`string`)                                                           |
| `-l, --logLevel <level>`       | Info \| warn \| error \| silent (`string`)                                                    |
| `--clearScreen`                | 允许/禁止日志记录时清屏 (`boolean`)                                                           |
| `--configLoader <loader>`      | 使用 `bundle` 通过 Rolldown 打包配置文件，或使用 `runner`（实验性）即时处理（默认：`bundle`） |
| `--profile`                    | 启动内置 Node.js 检查器（查看 [性能瓶颈](/guide/troubleshooting#performance-bottlenecks)）    |
| `-d, --debug [feat]`           | 显示调试日志 (`string \| boolean`)                                                            |
| `-f, --filter <filter>`        | 过滤调试日志 (`string`)                                                                       |
| `-m, --mode <mode>`            | 设置环境变量模式 (`string`)                                                                   |
| `-h, --help`                   | 显示可用的 CLI 选项                                                                           |
| `--app`                        | 构建所有环境，等同于 `builder: {}` (`boolean`，实验性)                                        |

## 其他

### `vite optimize`

预打包依赖。

**已弃用**：预打包过程会自动运行，无需调用。

#### 用法

```bash
vite optimize [root]
```

#### 选项

| 选项                      |                                                                                               |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| `--force`                 | 强制优化器忽略缓存并重新打包 (`boolean`)                                                      |
| `-c, --config <file>`     | 使用指定的配置文件 (`string`)                                                                 |
| `--base <path>`           | 公共基础路径（默认：`/`）(`string`)                                                           |
| `-l, --logLevel <level>`  | Info \| warn \| error \| silent (`string`)                                                    |
| `--clearScreen`           | 允许/禁止日志记录时清屏 (`boolean`)                                                           |
| `--configLoader <loader>` | 使用 `bundle` 通过 Rolldown 打包配置文件，或使用 `runner`（实验性）即时处理（默认：`bundle`） |
| `-d, --debug [feat]`      | 显示调试日志 (`string \| boolean`)                                                            |
| `-f, --filter <filter>`   | 过滤调试日志 (`string`)                                                                       |
| `-m, --mode <mode>`       | 设置环境变量模式 (`string`)                                                                   |
| `-h, --help`              | 显示可用的 CLI 选项                                                                           |

### `vite preview`

本地预览生产构建。不要将其用作生产服务器，因为它不是为此设计的。

此命令在构建目录（默认为 `dist`）中启动服务器。事先运行 `vite build` 以确保构建目录是最新的。根据项目配置的 [`appType`](/config/shared-options.html#apptype)，它会使用某些中间件。

#### 用法

```bash
vite preview [root]
```

#### 选项

| 选项                      |                                                                                               |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| `--host [host]`           | 指定主机名 (`string`)                                                                         |
| `--port <port>`           | 指定端口 (`number`)                                                                           |
| `--strictPort`            | 如果指定端口已被使用则退出 (`boolean`)                                                        |
| `--open [path]`           | 启动时打开浏览器 (`boolean \| string`)                                                        |
| `--outDir <dir>`          | 输出目录（默认：`dist`）(`string`)                                                            |
| `-c, --config <file>`     | 使用指定的配置文件 (`string`)                                                                 |
| `--base <path>`           | 公共基础路径（默认：`/`）(`string`)                                                           |
| `-l, --logLevel <level>`  | Info \| warn \| error \| silent (`string`)                                                    |
| `--clearScreen`           | 允许/禁止日志记录时清屏 (`boolean`)                                                           |
| `--configLoader <loader>` | 使用 `bundle` 通过 Rolldown 打包配置文件，或使用 `runner`（实验性）即时处理（默认：`bundle`） |
| `-d, --debug [feat]`      | 显示调试日志 (`string \| boolean`)                                                            |
| `-f, --filter <filter>`   | 过滤调试日志 (`string`)                                                                       |
| `-m, --mode <mode>`       | 设置环境变量模式 (`string`)                                                                   |
| `-h, --help`              | 显示可用的 CLI 选项                                                                           |
