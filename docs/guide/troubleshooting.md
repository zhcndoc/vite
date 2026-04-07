# 故障排除

另请参阅 [Rollup 的故障排除指南](https://rollupjs.org/troubleshooting/) 以获取更多信息。

如果这里的建议不起作用，请尝试在 [GitHub Discussions](https://github.com/vitejs/vite/discussions) 上发帖提问，或加入 [Vite Land Discord](https://chat.vite.dev) 的 `#help` 频道。

## CLI

### `Error: Cannot find module 'C:\foo\bar&baz\vite\bin\vite.js'`

你的项目文件夹路径可能包含 `&`，这在 Windows 上与 `npm` 不兼容 ([npm/cmd-shim#45](https://github.com/npm/cmd-shim/issues/45))。

你需要：

- 切换到另一个包管理器（例如 `pnpm`、`yarn`）
- 从项目路径中移除 `&`

## 配置

### 此包仅支持 ESM

当通过 `require` 导入仅支持 ESM 的包时，会发生以下错误。

> Failed to resolve "foo". This package is ESM only but it was tried to load by `require`.

> Error [ERR_REQUIRE_ESM]: require() of ES Module /path/to/dependency.js from /path/to/vite.config.js not supported.
> Instead change the require of index.js in /path/to/vite.config.js to a dynamic import() which is available in all CommonJS modules.

在 Node.js <=22 中，默认情况下无法通过 [`require`](https://nodejs.org/docs/latest-v22.x/api/esm.html#require) 加载 ESM 文件。

虽然使用 [`--experimental-require-module`](https://nodejs.org/docs/latest-v22.x/api/modules.html#loading-ecmascript-modules-using-require)、Node.js >22 或在其他运行时中可能可行，但我们仍然建议通过以下方式将配置转换为 ESM：

- 在最近的 `package.json` 中添加 `"type": "module"`
- 将 `vite.config.js`/`vite.config.ts` 重命名为 `vite.config.mjs`/`vite.config.mts`

## 开发服务器

### 请求一直停滞

如果你使用的是 Linux，文件描述符限制和 inotify 限制可能会导致此问题。由于 Vite 不对大多数文件进行打包，浏览器可能会请求许多文件，这需要许多文件描述符，从而超出限制。

要解决此问题：

- 通过 `ulimit` 增加文件描述符限制

  ```shell
  # 检查当前限制
  $ ulimit -Sn
  # 更改限制（临时）
  $ ulimit -Sn 10000 # 你可能也需要更改硬限制
  # 重启浏览器
  ```

- 通过 `sysctl` 增加以下 inotify 相关限制

  ```shell
  # 检查当前限制
  $ sysctl fs.inotify
  # 更改限制（临时）
  $ sudo sysctl fs.inotify.max_queued_events=16384
  $ sudo sysctl fs.inotify.max_user_instances=8192
  $ sudo sysctl fs.inotify.max_user_watches=524288
  ```

如果上述步骤不起作用，你可以尝试将 `DefaultLimitNOFILE=65536` 作为取消注释的配置添加到以下文件中：

- /etc/systemd/system.conf
- /etc/systemd/user.conf

对于 Ubuntu Linux，你可能需要将行 `* - nofile 65536` 添加到文件 `/etc/security/limits.conf` 中，而不是更新 systemd 配置文件。

请注意，这些设置会持久存在，但**需要重启**。

或者，如果服务器在 VS Code devcontainer 内部运行，请求可能看起来停滞了。要解决此问题，请参阅 [Dev Containers / VS Code 端口转发](#dev-containers-vs-code-port-forwarding)。

### Vite 因 ENOSPC 错误崩溃

如果你在 Linux 上看到如下错误：

> Error: ENOSPC: System limit for number of file watchers reached

当你的项目目录中有太多文件（例如，许多图片或资源）并超出系统的文件监视器限制时，会发生这种情况。Linux 的默认限制约为 8,192-10,000 个文件监视器。

要解决此问题，你可以：

- 增加系统文件监视器限制：

  ```shell
  # 检查当前限制
  $ cat /proc/sys/fs/inotify/max_user_watches
  # 增加限制（临时）
  $ sudo sysctl fs.inotify.max_user_watches=524288
  # 使其永久 - 添加到 /etc/sysctl.conf（如果已存在则编辑）
  $ echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
  $ sudo sysctl -p
  ```

- 使用 [`server.watch.ignored`](/config/server-options#server-watch) 将包含许多文件的目录排除在文件监视之外
- 使用 [`server.watch.usePolling`](/config/server-options#server-watch) 使用轮询代替文件系统事件。请注意，轮询会使用更多的 CPU 资源

### 网络请求停止加载

使用自签名 SSL 证书时，Chrome 会忽略所有缓存指令并重新加载内容。Vite 依赖于这些缓存指令。

要解决此问题，请使用受信任的 SSL 证书。

请参阅：[缓存问题](https://helpx.adobe.com/mt/experience-manager/kb/cache-problems-on-chrome-with-SSL-certificate-errors.html)、[Chrome 问题](https://bugs.chromium.org/p/chromium/issues/detail?id=110649#c8)

#### macOS

你可以通过 CLI 使用此命令安装受信任的证书：

```
security add-trusted-cert -d -r trustRoot -k ~/Library/Keychains/login.keychain-db your-cert.cer
```

或者，将其导入“钥匙串访问”应用并将证书的信任度更新为“始终信任”。

### 431 请求头字段过大

当服务器 / WebSocket 服务器收到较大的 HTTP 头时，请求将被丢弃，并显示以下警告。

> Server responded with status code 431. See https://vite.zhcndoc.com/guide/troubleshooting.html#_431-request-header-fields-too-large.

这是因为 Node.js 限制了请求头大小以减轻 [CVE-2018-12121](https://www.cve.org/CVERecord?id=CVE-2018-12121)。

要避免这种情况，请尝试减小请求头大小。例如，如果 cookie 很长，请删除它。或者你可以使用 [`--max-http-header-size`](https://nodejs.org/api/cli.html#--max-http-header-sizesize) 来更改最大头大小。

### Dev Containers / VS Code 端口转发

如果你在 VS Code 中使用 Dev Container 或端口转发功能，可能需要在配置中将 [`server.host`](/config/server-options.md#server-host) 选项设置为 `127.0.0.1` 才能使其工作。

这是因为 [VS Code 中的端口转发功能不支持 IPv6](https://github.com/microsoft/vscode-remote-release/issues/7029)。

详见 [#16522](https://github.com/vitejs/vite/issues/16522)。

## HMR

### Vite 检测到文件更改但 HMR 不起作用

你可能导入了一个大小写不同的文件。例如，`src/foo.js` 存在，而 `src/bar.js` 包含：

```js
import './Foo.js' // 应该是 './foo.js'
```

相关问题：[#964](https://github.com/vitejs/vite/issues/964)

### Vite 未检测到文件更改

如果你在使用 WSL2 运行 Vite，Vite 在某些情况下无法监视文件更改。请参阅 [`server.watch` 选项](/config/server-options.md#server-watch)。

### 发生完全重载而不是 HMR

如果 HMR 未被 Vite 或插件处理，则将发生完全重载，因为这是刷新状态的唯一方法。

如果 HMR 被处理但处于循环依赖中，也将发生完全重载以恢复执行顺序。要解决此问题，请尝试打破循环。如果文件更改触发了它，你可以运行 `vite --debug hmr` 来记录循环依赖路径。

## 构建

### 构建的文件因 CORS 错误而无法工作

如果 HTML 文件输出是使用 `file` 协议打开的，脚本将无法运行，并出现以下错误。

> Access to script at 'file:///foo/bar.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, isolated-app, chrome-extension, chrome, https, chrome-untrusted.

> Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at file:///foo/bar.js. (Reason: CORS request not http).

有关发生此原因的更多信息，请参阅 [原因：CORS 请求不是 HTTP - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp)。

你需要使用 `http` 协议访问文件。实现此目的的最简单方法是运行 `npx vite preview`。

### 由于大小写敏感导致的“无此文件或目录”错误

如果你遇到 `ENOENT: no such file or directory` 或 `Module not found` 等错误，这通常发生在你的项目在不区分大小写的文件系统（Windows / macOS）上开发，但在区分大小写的文件系统（Linux）上构建时。请确保导入具有正确的大小写。

### `Failed to fetch dynamically imported module` 错误

> TypeError: Failed to fetch dynamically imported module

此错误发生在以下几种情况：

- 版本偏差
- 网络条件差
- 浏览器扩展阻止请求

#### 版本偏差

当你部署新版本的应用程序时，HTML 文件和 JS 文件仍然引用在新部署中已删除的旧 chunk 名称。这发生在以下情况：

1. 用户的浏览器中缓存了旧版本的应用
2. 你部署了一个具有不同 chunk 名称的新版本（由于代码更改）
3. 缓存的 HTML 尝试加载不再存在的 chunk

如果你使用的是框架，请先参考其文档，因为它可能有针对此问题的内置解决方案。

要解决此问题，你可以：

- **暂时保留旧 chunk**：考虑保留之前部署的 chunk 一段时间，以允许缓存的用户平滑过渡。
- **使用 service worker**：实现一个 service worker 来预取所有资源并缓存它们。
- **预取动态 chunk**：请注意，如果你的 HTML 文件因 `Cache-Control` 头而被浏览器缓存，则此方法无效。
- **实现优雅的回退**：为动态导入实现错误处理，以便在 chunk 缺失时重新加载页面。详见 [加载错误处理](./build.md#load-error-handling)。

#### 网络条件差

此错误可能发生在不稳定的网络环境中。例如，当请求因网络错误或服务器停机而失败时。

请注意，由于浏览器限制，你无法重试动态导入 ([whatwg/html#6768](https://github.com/whatwg/html/issues/6768))。

#### 浏览器扩展阻止请求

如果浏览器扩展（如广告拦截器）阻止了该请求，也可能发生此错误。

可以通过 [`build.rolldownOptions.output.chunkFileNames`](../config/build-options.md#build-rolldownoptions) 选择不同的 chunk 名称来绕过此问题，因为这些扩展通常基于文件名阻止请求（例如，包含 `ad`、`track` 的名称）。

## 优化的依赖

### 链接到本地包时预捆绑的依赖项过时

用于使优化的依赖项失效的 hash 键取决于包锁定文件的内容、应用于依赖项的补丁以及影响 node 模块捆绑的 Vite 配置文件中的选项。这意味着当使用诸如 [npm overrides](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides) 之类的功能覆盖依赖项时，Vite 会检测到，并在下次服务器启动时重新捆绑你的依赖项。当你使用诸如 [npm link](https://docs.npmjs.com/cli/v9/commands/npm-link) 之类的功能时，Vite 不会使依赖项失效。如果你链接或取消链接了一个依赖项，你需要通过使用 `vite --force` 在下一次服务器启动时强制重新优化。我们建议改用 overrides，现在每个包管理器都支持它（另见 [pnpm overrides](https://pnpm.io/9.x/package_json#pnpmoverrides) 和 [yarn resolutions](https://yarnpkg.com/configuration/manifest/#resolutions)）。

## 性能瓶颈

如果你遇到任何导致加载时间缓慢的应用程序性能瓶颈，你可以随 Vite 开发服务器一起启动内置的 Node.js inspector，或在构建应用程序时启动它以创建 CPU 配置文件：

::: code-group

```bash [开发服务器]
vite --profile --open
```

```bash [构建]
vite build --profile
```

:::

::: tip Vite 开发服务器
一旦你的应用程序在浏览器中打开，只需等待加载完成，然后回到终端并按 `p` 键（将停止 Node.js inspector），然后按 `q` 键停止开发服务器。
:::

Node.js inspector 将在根文件夹中生成 `vite-profile-0.cpuprofile`，前往 https://www.speedscope.app/，并使用 `BROWSE` 按钮上传 CPU 配置文件以检查结果。

你可以安装 [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect)，它允许你检查 Vite 插件的中间状态，也可以帮助你识别哪些插件或中间件是应用程序中的瓶颈。该插件可在开发和构建模式下使用。查看 readme 文件了解更多详情。

## 其他

### 为了浏览器兼容性而外部化的模块

当你在浏览器中使用 Node.js 模块时，Vite 将输出以下警告。

> 模块 "fs" 已为了浏览器兼容性而被外部化。无法在客户端代码中访问 "fs.readFile"。

这是因为 Vite 不会自动 polyfill Node.js 模块。

我们建议避免在浏览器代码中使用 Node.js 模块以减少捆绑包大小，尽管你可以手动添加 polyfills。如果模块是从第三方库（意为在浏览器中使用）导入的，建议向相应的库报告此问题。

### 发生语法错误 / 类型错误

Vite 无法处理也不支持仅在非严格模式（松散模式）下运行的代码。这是因为 Vite 使用 ESM，并且在 ESM 内部始终是 [严格模式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)。

例如，你可能会看到这些错误。

> [错误] 由于严格模式，不能在使用 "esm" 输出格式时使用 With 语句

> TypeError: 无法在布尔值 'false' 上创建属性 'foo'

如果这些代码在依赖项内部使用，你可以使用 [`patch-package`](https://github.com/ds300/patch-package)（或 [`yarn patch`](https://yarnpkg.com/cli/patch) 或 [`pnpm patch`](https://pnpm.io/cli/patch)）作为权宜之计。

### 浏览器扩展

某些浏览器扩展（如广告拦截器）可能会阻止 Vite 客户端向 Vite 开发服务器发送请求。在这种情况下，你可能会看到白屏而没有记录错误。你也可能会看到以下错误：

> TypeError: 获取动态导入的模块失败

如果你有这个问题，尝试禁用扩展。

### Windows 上的跨驱动器链接

如果你的项目在 Windows 上存在跨驱动器链接，Vite 可能无法工作。

跨驱动器链接的示例包括：

- 通过 `subst` 命令链接到文件夹的虚拟驱动器
- 通过 `mklink` 命令链接到不同驱动器的符号链接/联结（例如 Yarn 全局缓存）

相关问题：[#10802](https://github.com/vitejs/vite/issues/10802)

<script setup lang="ts">
// 将带有 hash 的旧链接重定向到旧版文档
if (typeof window !== "undefined") {
  const hashForOldVersion = {
    'vite-cjs-node-api-deprecated': 6
  }

  const version = hashForOldVersion[location.hash.slice(1)]
  if (version) {
    // 同时更新协议和端口，以便在本地预览中工作（本地是 http 和 4173）
    location.href = `https://v${version}.vite.dev` + location.pathname + location.search + location.hash
  }
}
</script>
