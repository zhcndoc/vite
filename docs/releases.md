<script setup>
import SupportedVersions from './.vitepress/theme/components/SupportedVersions.vue';
</script>

# 发布

Vite 的发布遵循 [语义化版本](https://semver.org/)。你可以在 [Vite npm 包页面](https://www.npmjs.com/package/vite) 查看 Vite 的最新稳定版本。

过往发布的完整变更日志 [可在 GitHub 上查看](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)。

## 发布周期

Vite 没有固定的发布周期。

- **补丁** 版本按需发布（通常每周一次）。
- **次要** 版本始终包含新功能并按需发布。次要版本始终有一个 beta 预发布阶段（通常每两个月一次）。
- **主要** 版本通常与 [Node.js EOL 计划](https://endoflife.date/nodejs) 保持一致，并将提前宣布。这些版本将与生态系统进行长期讨论，并有 alpha 和 beta 预发布阶段（通常每年一次）。

## 支持的版本

总之，当前支持的 Vite 版本是：

<SupportedVersions />

<br>

支持的版本范围由以下规则自动确定：

- **当前次要版本** 获得常规修复。
- **上一个主要版本**（仅针对其最新的次要版本）和 **上一个次要版本** 获得重要修复和安全补丁。
- **倒数第二个主要版本**（仅针对其最新的次要版本）和 **倒数第二个次要版本** 获得安全补丁。
- 所有这些之前的版本不再受支持。

我们建议定期更新 Vite。当你升级到每个主要版本时，请查看 [迁移指南](https://vite.dev/guide/migration.html)。Vite 团队与生态系统中的主要项目紧密合作，以确保新版本的质量。我们在发布新的 Vite 版本之前会通过 [vite-ecosystem-ci 项目](https://github.com/vitejs/vite-ecosystem-ci) 进行测试。大多数使用 Vite 的项目应该能够在新版本发布后快速提供支持或迁移到新版本。

## 语义化版本边界情况

### TypeScript 定义

我们可能会在次要版本之间发布不兼容的 TypeScript 定义变更。这是因为：

- 有时 TypeScript 本身会在次要版本之间发布不兼容的变更，我们可能必须调整类型以支持更新版本的 TypeScript。
- 偶尔我们可能需要采用仅在更新版本 TypeScript 中可用的功能，从而提高 TypeScript 的最低要求版本。
- 如果你正在使用 TypeScript，可以使用锁定当前次要版本的 semver 范围，并在发布新的 Vite 次要版本时手动升级。

### Node.js 非 LTS 版本

非 LTS Node.js 版本（奇数版本）不会作为 Vite CI 的一部分进行测试，但在它们 [生命周期结束](https://endoflife.date/nodejs) 之前应该仍然可以工作。

## 预发布

次要版本通常会经过数量不固定的 beta 发布。主要版本将经过 alpha 阶段和 beta 阶段。

预发布允许生态系统中的早期采用者和维护者进行集成和稳定性测试，并提供反馈。不要在生产环境中使用预发布版本。所有预发布版本都被视为不稳定版本，其间可能会发布破坏性变更。使用预发布版本时，始终固定到确切版本。

## 弃用

我们定期弃用在次要版本中已被更好替代方案取代的功能。弃用的功能将继续工作，但会带有类型或日志警告。它们将在进入弃用状态后的下一个主要版本中被移除。每个主要版本的 [迁移指南](https://vite.dev/guide/migration.html) 将列出这些移除内容并记录相应的升级路径。

## 实验性功能

某些功能在 Vite 稳定版本中发布时被标记为实验性功能。实验性功能允许我们收集真实世界的经验以影响其最终设计。目标是让用户通过在生产环境中测试它们来提供反馈。实验性功能本身被视为不稳定，应仅以受控方式使用。这些功能可能会在次要版本之间发生变化，因此用户在依赖它们时必须固定其 Vite 版本。我们将为每个实验性功能创建 [一个 GitHub 讨论区](https://github.com/vitejs/vite/discussions/categories/feedback?discussions_q=is%3Aopen+label%3Aexperimental+category%3AFeedback)。
