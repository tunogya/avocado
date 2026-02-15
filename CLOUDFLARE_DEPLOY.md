# Cloudflare Pages 部署指南

本项目配置为通过 Cloudflare Pages 自动部署 Next.js 16 应用。

## 部署步骤

### 1. 推送代码到 Git 仓库
确保你的代码已推送到 GitHub、GitLab 或 Bitbucket。

### 2. 登录 Cloudflare Dashboard
访问 [Cloudflare Dashboard](https://dash.cloudflare.com/) 并登录你的账户。

### 3. 创建 Pages 项目

1. 在左侧菜单中选择 **Workers & Pages**
2. 点击 **Create application**
3. 选择 **Pages** 标签页
4. 点击 **Connect to Git**
5. 授权 Cloudflare 访问你的 Git 仓库
6. 选择 `tunogya/avocado` 仓库

### 4. 配置构建设置

在构建配置页面，输入以下设置：

**Framework preset:** `Next.js`

**Build command:**
```bash
npm run build
```

**Build output directory:**
```
.next
```

**Root directory:** `/` (保持默认)

**Environment variables:**
- `NODE_VERSION`: `20`
- 如果需要，可以添加其他环境变量

### 5. 部署

点击 **Save and Deploy**，Cloudflare Pages 将会：
- 自动克隆你的仓库
- 安装依赖 (`npm install`)
- 运行构建命令 (`npm run build`)
- 部署应用到全球 CDN

### 6. 自动部署

配置完成后，每次推送到主分支时，Cloudflare Pages 会自动触发新的部署。

## 项目配置文件

- [.node-version](.node-version) - 指定 Node.js 版本为 20
- [next.config.ts](next.config.ts) - Next.js 配置（已包含 next-intl 插件）

## 注意事项

### Next.js 16 兼容性
- Cloudflare Pages 支持 Next.js 的静态导出和服务端渲染
- 本项目使用 Next.js 16.1.6，Cloudflare 会自动处理构建
- 如果遇到兼容性问题，可能需要：
  - 使用 `output: 'export'` 进行静态导出
  - 或考虑降级到 Next.js 15.5.2

### Edge Runtime 限制
Cloudflare Pages 使用 Edge Runtime，有以下限制：
- 不支持所有 Node.js API
- 某些第三方包可能不兼容
- 如需完整 Node.js 支持，考虑使用 Cloudflare Workers

### 自定义域名
部署成功后，可在 Cloudflare Pages 项目设置中添加自定义域名。

## 故障排查

如果部署失败：

1. **检查构建日志** - 在 Cloudflare Dashboard 的部署详情中查看
2. **验证依赖** - 确保 `package.json` 中的依赖正确
3. **检查 Node 版本** - 确认使用 Node.js 20
4. **环境变量** - 如果需要环境变量，在 Pages 设置中添加

## 有用的链接

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Edge Runtime API](https://nextjs.org/docs/app/api-reference/edge)
