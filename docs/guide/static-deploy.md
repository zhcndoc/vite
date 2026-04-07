<!--
  如果你想添加一个新的部署平台，请阅读此内容。

  欢迎提交 PR 添加一个新的章节，并链接到你平台的部署指南，
  只要它符合以下标准：

  1. 用户应该能够免费部署他们的站点。
  2. 免费套餐应无限期托管站点，不受时间限制。
     作为交换，提供有限数量的计算资源或站点数量是可以的。
  3. 链接的指南不应包含任何恶意内容。

  新章节应添加在文件的最后。请参考本文件底部的现有章节，
  以了解如何格式化新章节的示例。

  Vite 团队可能会不时更改标准并审计当前列表。
  如果某个部分被移除，我们会在操作之前通知原始的 PR 作者。
-->

# 部署静态站点

以下指南基于一些共同的假设：

- 你使用的是默认构建输出位置（`dist`）。该位置 [可以使用 `build.outDir` 更改](/config/build-options.md#build-outdir)，在这种情况下，你可以从这些指南中推断出说明。
- 你使用的是 npm。如果你使用的是 Yarn 或其他包管理器，可以使用等效命令来运行脚本。
- Vite 作为本地开发依赖项安装在你的项目中，并且你已设置以下 npm 脚本：

```json [package.json]
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

需要注意的是，`vite preview` 旨在本地预览构建，而不是用作生产服务器。

::: tip 注意
这些指南提供了执行 Vite 站点静态部署的说明。Vite 还支持服务端渲染（SSR）。SSR 指的是支持在 Node.js 中运行相同应用、预渲染为 HTML 并最终在客户端激活的前端框架。查看 [SSR 指南](./ssr) 了解此功能。另一方面，如果你正在寻找与传统服务端框架的集成，请查看 [后端集成指南](./backend-integration)。
:::

## 构建应用

你可以运行 `npm run build` 命令来构建应用。

```bash
$ npm run build
```

默认情况下，构建输出将放置在 `dist`。你可以将此 `dist` 文件夹部署到任何你喜欢的平台。

### 本地测试应用

构建应用后，你可以通过运行 `npm run preview` 命令在本地测试它。

```bash
$ npm run preview
```

`vite preview` 命令将启动一个本地静态 Web 服务器，在 `http://localhost:4173` 提供来自 `dist` 的文件。这是一种检查生产构建在本地环境中看起来是否正常的简单方法。

你可以通过传递 `--port` 标志作为参数来配置服务器的端口。

```json [package.json]
{
  "scripts": {
    "preview": "vite preview --port 8080"
  }
}
```

现在 `preview` 命令将在 `http://localhost:8080` 启动服务器。

## GitHub Pages

1. **更新 Vite 配置**

   在 `vite.config.js` 中设置正确的 `base`。

   如果你要部署到 `https://<USERNAME>.github.io/`，或通过 GitHub Pages 部署到自定义域名（例如 `www.example.com`），请将 `base` 设置为 `'/'`。或者，你可以从配置中移除 `base`，因为它默认为 `'/'`。

   如果你要部署到 `https://<USERNAME>.github.io/<REPO>/`（例如，你的仓库位于 `https://github.com/<USERNAME>/<REPO>`），则将 `base` 设置为 `'/<REPO>/'`。

2. **启用 GitHub Pages**

   在你的仓库中，转到 **设置 → Pages**。在 **构建和部署** 下，打开 **源** 下拉菜单，并选择 **GitHub Actions**。

   GitHub 现在将使用 GitHub Actions [工作流](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows) 部署你的站点，这是必要的，因为 Vite 需要构建步骤才能部署。

3. **创建工作流**

   在你的仓库中创建一个新文件 `.github/workflows/deploy.yml`。你也可以从上一步点击 **“创建你自己的”**，这将为你生成一个起始工作流文件。

   这是一个示例工作流，它使用 npm 安装依赖，构建站点，并在你推送更改到 `main` 分支时部署它：

   <<< ./static-deploy-github-pages.yaml#content [.github/workflows/deploy.yml]

## GitLab Pages 和 GitLab CI

1. 在 `vite.config.js` 中设置正确的 `base`。

   如果你要部署到 `https://<USERNAME or GROUP>.gitlab.io/`，你可以省略 `base`，因为它默认为 `'/'`。

   如果你要部署到 `https://<USERNAME or GROUP>.gitlab.io/<REPO>/`，例如你的仓库位于 `https://gitlab.com/<USERNAME>/<REPO>`，则将 `base` 设置为 `'/<REPO>/'`。

2. 在项目根目录下创建一个名为 `.gitlab-ci.yml` 的文件，内容如下。这将在你更改内容时构建并部署你的站点：

   ```yaml [.gitlab-ci.yml]
   image: node:lts
   pages:
     stage: deploy
     cache:
       key:
         files:
           - package-lock.json
         prefix: npm
       paths:
         - node_modules/
     script:
       - npm install
       - npm run build
       - cp -a dist/. public/
     artifacts:
       paths:
         - public
     rules:
       - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
   ```

## Netlify

### Netlify CLI

1. 通过 `npm install -g netlify-cli` 安装 [Netlify CLI](https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/)。
2. 使用 `netlify init` 创建一个新站点。
3. 使用 `netlify deploy` 进行部署。

Netlify CLI 会与你分享一个预览 URL 以供检查。当你准备好进入生产环境时，使用 `prod` 标志：`netlify deploy --prod`。

### 使用 Git 部署 Netlify

1. 将代码推送到 git 仓库（GitHub、GitLab、BitBucket、Azure DevOps）。
2. [导入项目](https://app.netlify.com/start) 到 Netlify。
3. 选择分支、输出目录，并设置环境变量（如果适用）。
4. 点击 **部署**。
5. 你的 Vite 应用已部署！

导入并部署项目后，所有后续推送到非生产分支的操作以及拉取请求都将生成 [预览部署](https://docs.netlify.com/deploy/deploy-types/deploy-previews/)，而对生产分支（通常是"main"）所做的所有更改都将导致 [生产部署](https://docs.netlify.com/deploy/deploy-overview/#definitions)。

## Vercel

### Vercel CLI

1. 通过 `npm i -g vercel` 安装 [Vercel CLI](https://vercel.com/cli) 并运行 `vercel` 进行部署。
2. Vercel 将检测到你正在使用 Vite，并为你的部署启用正确的设置。
3. 你的应用已部署！（例如 [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/)）

### 使用 Git 部署 Vercel

1. 将代码推送到你的 git 仓库（GitHub、GitLab、Bitbucket）。
2. [导入你的 Vite 项目](https://vercel.com/new) 到 Vercel。
3. Vercel 将检测到你正在使用 Vite，并为你的部署启用正确的设置。
4. 你的应用已部署！（例如 [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/)）

导入并部署项目后，所有后续推送到分支的操作都将生成 [预览部署](https://vercel.com/docs/concepts/deployments/environments#preview)，而对生产分支（通常是"main"）所做的所有更改都将导致 [生产部署](https://vercel.com/docs/concepts/deployments/environments#production)。

了解更多关于 Vercel 的 [Git 集成](https://vercel.com/docs/concepts/git)。

## Cloudflare

### Cloudflare Workers

[Cloudflare Vite 插件](https://developers.cloudflare.com/workers/vite-plugin/) 提供了与 Cloudflare Workers 的集成，并使用 Vite 的环境 API 在开发期间在 Cloudflare Workers 运行时中运行你的服务端代码。

要将 Cloudflare Workers 添加到现有的 Vite 项目，安装插件并将其添加到你的配置中：

```bash
$ npm install --save-dev @cloudflare/vite-plugin
```

```js [vite.config.js]
import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig({
  plugins: [cloudflare()],
})
```

```jsonc [wrangler.jsonc]
{
  "name": "my-vite-app",
}
```

运行 `npm run build` 后，你的应用现在可以使用 `npx wrangler deploy` 进行部署。

你还可以轻松地将后端 API 添加到你的 Vite 应用，以便与 Cloudflare 资源安全通信。这在开发期间运行在 Workers 运行时中，并与你的前端一起部署。查看 [Cloudflare Vite 插件教程](https://developers.cloudflare.com/workers/vite-plugin/tutorial/) 了解完整的演练。

### Cloudflare Pages

#### 使用 Git 部署 Cloudflare Pages

Cloudflare Pages 提供了一种直接部署到 Cloudflare 而无需管理 Wrangler 文件的方法。

1. 将代码推送到你的 git 仓库（GitHub、GitLab）。
2. 登录 Cloudflare 控制台并在 **账户主页** > **Workers & Pages** 中选择你的账户。
3. 选择 **创建新项目** 和 **Pages** 选项，然后选择 Git。
4. 选择你要部署的 git 项目并点击 **开始设置**
5. 根据你选择的 Vite 框架，在构建设置中选择相应的框架预设。否则，输入项目的构建命令和预期的输出目录。
6. 然后保存并部署！
7. 你的应用已部署！（例如 `https://<PROJECTNAME>.pages.dev/`）

导入并部署项目后，所有后续推送到分支的操作都将生成 [预览部署](https://developers.cloudflare.com/pages/platform/preview-deployments/)，除非在 [分支构建控制](https://developers.cloudflare.com/pages/platform/branch-build-controls/) 中指定不生成。对生产分支（通常是"main"）的所有更改都将导致生产部署。

你还可以在 Pages 上添加自定义域名和处理自定义构建设置。了解更多关于 [Cloudflare Pages Git 集成](https://developers.cloudflare.com/pages/get-started/#manage-your-site)。

## Google Firebase

1. 通过 `npm i -g firebase-tools` 安装 [firebase-tools](https://www.npmjs.com/package/firebase-tools)。

2. 在项目的根目录创建以下文件：

   ::: code-group

   ```json [firebase.json]
   {
     "hosting": {
       "public": "dist",
       "ignore": [],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

   ```js [.firebaserc]
   {
     "projects": {
       "default": "<YOUR_FIREBASE_ID>"
     }
   }
   ```

   :::

3. 运行 `npm run build` 后，使用命令 `firebase deploy` 进行部署。

## Surge

1. 通过 `npm i -g surge` 安装 [surge](https://www.npmjs.com/package/surge)。
2. 运行 `npm run build`。
3. 输入 `surge dist` 部署到 surge。

你也可以通过添加 `surge dist yourdomain.com` 部署到 [自定义域名](https://surge.sh/help/adding-a-custom-domain)。

## Azure Static Web Apps

你可以使用 Microsoft Azure [Static Web Apps](https://aka.ms/staticwebapps) 服务快速部署你的 Vite 应用。你需要：

- 一个 Azure 账户和订阅密钥。你可以在此处创建 [免费 Azure 账户](https://azure.microsoft.com/free)。
- 你的应用代码已推送到 [GitHub](https://github.com)。
- [Visual Studio Code](https://code.visualstudio.com) 中的 [SWA 扩展](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps)。

在 VS Code 中安装扩展并导航到你的应用根目录。打开 Static Web Apps 扩展，登录 Azure，然后点击 '+' 符号创建一个新的 Static Web App。系统将提示你指定使用哪个订阅密钥。

跟随扩展启动的向导为你的应用命名，选择框架预设，并指定应用根目录（通常为 `/`）和构建文件位置 `/dist`。向导将运行并在你的仓库的 `.github` 文件夹中创建一个 GitHub action。

该 action 将部署你的应用（在仓库的 Actions 标签页中查看进度），当成功完成后，你可以通过点击 GitHub action 运行后出现的 'Browse Website' 按钮，在扩展进度窗口中提供的地址查看你的应用。

## Render

你可以在 [Render](https://render.com/) 上将你的 Vite 应用部署为静态站点。

1. 创建一个 [Render 账户](https://dashboard.render.com/register)。

2. 在 [Dashboard](https://dashboard.render.com/) 中，点击 **New** 按钮并选择 **Static Site**。

3. 连接你的 GitHub/GitLab 账户或使用公共仓库。

4. 指定项目名称和分支。
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

5. 点击 **Create Static Site**。你的应用应该部署在 `https://<PROJECTNAME>.onrender.com/`。

默认情况下，任何推送到指定分支的新提交都会自动触发新的部署。[自动部署](https://render.com/docs/deploys#toggling-auto-deploy-for-a-service) 可以在项目设置中配置。

你也可以为你的项目添加 [自定义域名](https://render.com/docs/custom-domains)。

## Flightcontrol

通过遵循这些 [说明](https://www.flightcontrol.dev/docs/reference/examples/vite?ref=docs-vite)，使用 [Flightcontrol](https://www.flightcontrol.dev/?ref=docs-vite) 部署你的静态站点。

## Kinsta Static Site Hosting

通过遵循这些 [说明](https://kinsta.com/docs/static-site-hosting/static-site-quick-start/react-static-site-examples/#react-with-vite)，使用 [Kinsta](https://kinsta.com/static-site-hosting/) 部署你的静态站点。

## xmit Static Site Hosting

通过遵循此 [指南](https://xmit.dev/posts/vite-quickstart/)，使用 [xmit](https://xmit.co) 部署你的静态站点。

## Zephyr Cloud

[Zephyr Cloud](https://zephyr-cloud.io) 是一个部署平台，它直接集成到你的构建过程中，并为模块联邦和其他类型的应用提供全球边缘分发。

Zephyr 遵循与其他云提供商不同的方法。它直接与 Vite 构建过程集成，因此每次你构建或运行应用的开发服务器时，它都将自动与 Zephyr Cloud 一起部署。

按照 [Vite 部署指南](https://docs.zephyr-cloud.io/bundlers/vite) 中的步骤开始使用。

## EdgeOne Pages

通过遵循这些 [说明](https://pages.edgeone.ai/document/vite)，使用 [EdgeOne Pages](https://edgeone.ai/products/pages) 部署你的静态站点。
