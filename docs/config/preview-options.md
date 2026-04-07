# 预览选项

除非另有说明，本节中的选项仅适用于预览。

## preview.host

- **类型：** `string | boolean`
- **默认值：** [`server.host`](./server-options#server-host)

指定服务器应该监听哪些 IP 地址。
将其设置为 `0.0.0.0` 或 `true` 以监听所有地址，包括局域网和公网地址。

可以通过 CLI 使用 `--host 0.0.0.0` 或 `--host` 来设置。

::: tip 注意

在某些情况下，可能是其他服务器响应而不是 Vite。
详见 [`server.host`](./server-options#server-host)。

:::

## preview.allowedHosts

- **类型：** `string[] | true`
- **默认值：** [`server.allowedHosts`](./server-options#server-allowedhosts)

Vite 允许响应的主机名。

详见 [`server.allowedHosts`](./server-options#server-allowedhosts)。

## preview.port

- **类型：** `number`
- **默认值：** `4173`

指定服务器端口。请注意，如果该端口已被占用，Vite 将自动尝试下一个可用端口，因此这可能不是服务器最终监听的实际端口。

**示例：**

```js
export default defineConfig({
  server: {
    port: 3030,
  },
  preview: {
    port: 8080,
  },
})
```

## preview.strictPort

- **类型：** `boolean`
- **默认值：** [`server.strictPort`](./server-options#server-strictport)

设置为 `true` 时，如果端口已被占用则退出，而不是自动尝试下一个可用端口。

## preview.https

- **类型：** `https.ServerOptions`
- **默认值：** [`server.https`](./server-options#server-https)

启用 TLS + HTTP/2。

详见 [`server.https`](./server-options#server-https)。

## preview.open

- **类型：** `boolean | string`
- **默认值：** [`server.open`](./server-options#server-open)

服务器启动时自动在浏览器中打开应用。当值为字符串时，它将用作 URL 的路径名。如果你想在特定的浏览器中打开服务器，可以设置环境变量 `process.env.BROWSER`（例如 `firefox`）。你也可以设置 `process.env.BROWSER_ARGS` 来传递额外参数（例如 `--incognito`）。

`BROWSER` 和 `BROWSER_ARGS` 也是你可以在 `.env` 文件中设置的特殊环境变量来进行配置。详见 [`open` 包](https://github.com/sindresorhus/open#app)。

## preview.proxy

- **类型：** `Record<string, string | ProxyOptions>`
- **默认值：** [`server.proxy`](./server-options#server-proxy)

为预览服务器配置自定义代理规则。期望是一个 `{ key: options }` 键值对的对象。如果键以 `^` 开头，它将被解释为 `RegExp`。可以使用 `configure` 选项来访问代理实例。

使用 [`http-proxy-3`](https://github.com/sagemathinc/http-proxy-3)。完整选项见 [这里](https://github.com/sagemathinc/http-proxy-3#options)。

## preview.cors

- **类型：** `boolean | CorsOptions`
- **默认值：** [`server.cors`](./server-options#server-cors)

为预览服务器配置 CORS。

详见 [`server.cors`](./server-options#server-cors)。

## preview.headers

- **类型：** `OutgoingHttpHeaders`

指定服务器响应头。
