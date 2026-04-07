---
title: Vite 4.3 发布
author:
  name: Vite 团队
date: 2023-04-20
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 4.3 发布
  - - meta
    - property: og:image
      content: https://vite.zhcndoc.com/og-image-announcing-vite4-3.webp
  - - meta
    - property: og:url
      content: https://vite.zhcndoc.com/blog/announcing-vite4-3
  - - meta
    - property: og:description
      content: Vite 4.3 发布公告
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 4.3 发布

_2023 年 4 月 20 日_

![Vite 4.3 公告封面图](/og-image-announcing-vite4-3.webp)

快速链接：

- 文档：[英文](/), [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [西班牙语](https://es.vite.dev/), [葡萄牙语](https://pt.vite.dev/)
- [Vite 4.3 更新日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#430-2023-04-20)

## 性能改进

在这个小版本中，我们专注于改进开发服务器的性能。解析逻辑得到了简化，改进了热路径，并为查找 `package.json`、TS 配置文件和一般解析后的 URL 实现了更智能的缓存。

你可以阅读 Vite 贡献者之一在这篇博客文章中关于性能工作的详细详解：[我们如何让 Vite 4.3 变得更快 🚀](https://sun0day.github.io/blog/vite/why-vite4_3-is-faster.html)。

这次冲刺使得与 Vite 4.2 相比，各方面都有了速度提升。

以下是由 [sapphi-red/performance-compare](https://github.com/sapphi-red/performance-compare) 测量的性能改进，它测试了一个具有 1000 个 React 组件的应用的冷启动和热启动开发服务器启动时间，以及根组件和叶子组件的 HMR 时间：

| **Vite (babel)** |  Vite 4.2 | Vite 4.3 |   改进 |
| :--------------- | --------: | -------: | -----: |
| **开发冷启动**   | 17249.0ms | 5132.4ms | -70.2% |
| **开发热启动**   |  6027.8ms | 4536.1ms | -24.7% |
| **根 HMR**       |    46.8ms |   26.7ms | -42.9% |
| **叶子 HMR**     |    27.0ms |   12.9ms | -52.2% |

| **Vite (swc)** |  Vite 4.2 | Vite 4.3 |   改进 |
| :------------- | --------: | -------: | -----: |
| **开发冷启动** | 13552.5ms | 3201.0ms | -76.4% |
| **开发热启动** |  4625.5ms | 2834.4ms | -38.7% |
| **根 HMR**     |    30.5ms |   24.0ms | -21.3% |
| **叶子 HMR**   |    16.9ms |   10.0ms | -40.8% |

![Vite 4.3 与 4.2 启动时间对比](../images/vite4-3-startup-time.webp)

![Vite 4.3 与 4.2 HMR 时间对比](../images/vite4-3-hmr-time.webp)

你可以在此处阅读有关基准测试的更多信息。此次性能运行的规格和版本：

- CPU: Ryzen 9 5900X, Memory: DDR4-3600 32GB, SSD: WD Blue SN550 NVME SSD
- Windows 10 Pro 21H2 19044.2846
- Node.js 18.16.0
- Vite 和 React 插件版本
  - Vite 4.2 (babel): Vite 4.2.1 + plugin-react 3.1.0
  - Vite 4.3 (babel): Vite 4.3.0 + plugin-react 4.0.0-beta.1
  - Vite 4.2 (swc): Vite 4.2.1 + plugin-react-swc 3.2.0
  - Vite 4.3 (swc): Vite 4.3.0 + plugin-react-swc 3.3.0

早期采用者在测试 Vite 4.3 beta 时，还报告说在实际应用中看到了 1.5 倍到 2 倍的开发启动时间改进。我们很想知道你的应用的结果。

## 性能分析

我们将继续致力于 Vite 的性能。我们正在为 Vite 开发一个官方的 [基准测试工具](https://github.com/vitejs/vite-benchmark)，让我们能够获取每个 Pull Request 的性能指标。

并且 [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) 现在拥有了更多性能相关功能，帮助你识别哪些插件或中间件是应用的瓶颈。

使用 `vite --profile`（然后在页面加载后按 `p`）将保存开发服务器启动的 CPU 配置文件。你可以在 [speedscope](https://www.speedscope.app/) 这样的应用中打开它们以识别性能问题。你可以在 [讨论区](https://github.com/vitejs/vite/discussions) 或 [Vite 的 Discord](https://chat.vite.dev) 中与 Vite 团队分享你的发现。

## 下一步计划

我们决定今年只进行一次 Vite 大版本更新，与 9 月 [Node.js 16 的生命周期结束（EOL）](https://endoflife.date/nodejs) 保持一致，在其中放弃对 Node.js 14 和 16 的支持。如果你想参与，我们启动了一个 [Vite 5 讨论](https://github.com/vitejs/vite/discussions/12466) 来收集早期反馈。
