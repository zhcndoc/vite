# 破坏性变更

Vite 中的破坏性变更列表，包括 API 弃用、移除和变更。下面的大多数变更可以通过 Vite 配置中的 [`future` 选项](/config/shared-options.html#future) 来选择性启用。

## 计划中

这些变更计划用于 Vite 的下一个主要版本。弃用或使用警告将在可能的情况下为你提供指导，我们也在联系框架、插件作者和用户以应用这些变更。

- [钩子中的 `this.environment`](/changes/this-environment-in-hooks)
- [HMR `hotUpdate` 插件钩子](/changes/hotupdate-hook)
- [SSR 使用 `ModuleRunner` API](/changes/ssr-using-modulerunner)

## 考虑中

这些变更正在考虑中，通常是旨在改进当前使用模式的实验性 API。由于并非所有变更都列在这里，请查看 [Vite GitHub Discussions 中的实验性标签](https://github.com/vitejs/vite/discussions/categories/feedback?discussions_q=label%3Aexperimental+category%3AFeedback) 以获取完整列表。

我们尚不建议切换到这些 API。它们包含在 Vite 中是为了帮助我们收集反馈。请查看这些提案，并在每个提案链接的 GitHub Discussions 中告诉我们它们在你的用例中效果如何。

- [迁移到每环境 API](/changes/per-environment-apis)
- [构建期间共享插件](/changes/shared-plugins-during-build)

## 过去

下面的变更已完成或已撤销。它们在当前主要版本中不再相关。

- _暂无过去的变更_
