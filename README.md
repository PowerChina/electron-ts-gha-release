# World Time Board

已实现功能：

## 基础功能

- 同时显示 4 个预设时区（中国/美国纽约/墨西哥城/意大利罗马）
- 时区时间每秒实时更新（秒级）
- 美国时区通过 IANA 时区库自动处理夏令时/冬令时
- 支持添加/删除自定义时区
- 深色/浅色主题切换
- 24 小时制，显示日期与星期

## 亮点功能

- 系统托盘（关闭窗口不退出，双击托盘恢复）
- 窗口置顶开关
- 一键复制所有时区时间
- 卡片拖拽排序
- 悬停显示详细时区偏移信息

## 打包发布

### 本地开发

```bash
npm ci
npm start
```

### 本地构建 Windows EXE

```bash
npm run dist:win
```

产物在 `release/` 目录。

### GitHub 自动发布

- Push `v*.*.*` tag 后，GitHub Actions 自动构建
- 自动上传 Windows EXE 到 GitHub Release
