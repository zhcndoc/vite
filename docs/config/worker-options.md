# Worker 选项

除非另有说明，本节中的选项适用于所有开发、构建和预览模式。

## worker.format

- **类型：** `'es' | 'iife'`
- **默认值：** `'iife'`

Worker 打包的输出格式。

## worker.plugins

- **类型：** [`() => (Plugin | Plugin[])[]`](./shared-options#plugins)

应用于 worker 打包的 Vite 插件。注意，[config.plugins](./shared-options#plugins) 仅适用于开发环境下的 worker，构建时应该在此处配置。

该函数应返回新的插件实例，因为它们在并行 rolldown worker 构建中使用。因此，在 `config` 钩子中修改 `config.worker` 选项将被忽略。

## worker.rolldownOptions

- **类型：** [`RolldownOptions`](https://rolldown.rs/reference/)

用于构建 worker 打包的 Rolldown 选项。

## worker.rollupOptions

- **类型：** `RolldownOptions`
- **已弃用**

此选项是 `worker.rolldownOptions` 选项的别名。请改用 `worker.rolldownOptions` 选项。
