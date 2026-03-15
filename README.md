# Electron + TypeScript + GitHub Actions (Windows EXE)

这是一套可直接发布到 GitHub 的模板，重点解决 **Windows 执行打包后没有 `.exe`** 的问题。

## 技术栈

- Electron
- TypeScript
- electron-builder（Windows 目标固定 NSIS）
- GitHub Actions（自动构建并上传 Release 附件）

## 本地开发

```bash
npm ci
npm start
```

## 本地打包 Windows EXE

> 在 Windows 机器上执行（或 GitHub Actions 的 windows-latest）

```bash
npm run dist:win
```

产物目录：`release/`

你会看到：

- `*.exe`（安装包）
- `latest.yml`
- `*.blockmap`

Windows 下也可直接双击：`build-win.bat`

## 发布到 GitHub

1. 初始化仓库并推送：

```bash
git init
git add .
git commit -m "feat: electron + ts + gha release template"
git branch -M main
git remote add origin <你的仓库地址>
git push -u origin main
```

2. 打 tag 触发 release workflow：

```bash
git tag v0.1.0
git push origin v0.1.0
```

3. GitHub Actions 会执行：

- `npm ci`
- `npm run dist -- --win nsis`
- 上传 `release/*.exe` 等产物
- 自动创建/更新 GitHub Release 并附加安装包

## 为什么上一版可能没有 EXE

常见原因：

- 没有用 `electron-builder` 的 `nsis` 目标
- 在非 Windows 环境构建 Windows 安装包失败
- 工作流只上传了目录，未匹配 `release/*.exe`
- 构建输出目录与 workflow 读取路径不一致

本模板已把这些点都固定好（`release.yml` + `build.win.target=nsis`）。
