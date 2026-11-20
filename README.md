# GitHub Downloads Tab

> 在 GitHub 仓库导航栏的 **Code** 与 **Issues** 之间添加 **Downloads** 入口，一键直达该仓库的 Releases 页面。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**简体中文** | [English](./README.en.md)

## 简介

GitHub 的 Releases 页面集中提供版本说明、源码压缩包（zip / tar.gz）以及作者上传的二进制资产，但入口藏在右侧边栏或导航中，路径较深。本脚本在仓库首页导航栏的 **Code** 与 **Issues** 之间插入一个 **Downloads** 标签，点击即可跳转到 `https://github.com/<用户名>/<仓库名>/releases`，省去查找步骤。

## 功能

- 在仓库首页导航栏 **Code** 与 **Issues** 之间自动插入 **Downloads** 入口。
- 点击 **Downloads** 跳转到该仓库的 Releases 页面。
- 仓库关闭 Issues 时，入口自动退到 **Code** 之后。
- 在仓库之间切换（GitHub 软导航）时，链接自动更新为当前仓库地址，无需刷新页面。
- 不修改 GitHub 任何原始内容，只新增一个入口。

## 为什么叫 Downloads 而不是 Releases？

Releases 页面除了版本说明，还集中提供源码压缩包和作者上传的发布资产。对多数只想“下载点东西”的用户来说，**Downloads** 更直观。入口名称是 Downloads，跳转目标仍是官方的 Releases 页面。

## 安装

### 前置要求

- 浏览器已安装 [Tampermonkey](https://www.tampermonkey.net/)、[Violentmonkey](https://violentmonkey.github.io/) 或 Greasemonkey 4+ 等用户脚本管理器。

### 安装步骤

1. 打开本仓库中的 `github-downloads-tab.user.js`。
2. 点击页面上的 **Raw** 按钮，用户脚本管理器会弹出安装界面。
3. 确认安装，刷新任意 GitHub 仓库首页即可看到效果。

### Chrome 用户注意

- **Chrome 138 及以上**：在 `chrome://extensions` 中开启 Tampermonkey 的“允许用户脚本”开关。
- **Chrome 137 及以下**：在 `chrome://extensions` 页面右上角开启“开发者模式”。

## 使用

1. 打开任意仓库首页，例如 `https://github.com/torvalds/linux`。
2. 导航栏依次出现 **Code · Downloads · Issues · Pull requests · …**。
3. 点击 **Downloads** 进入该仓库的 Releases 页面。
4. 在仓库之间跳转时，入口随当前仓库自动更新。

> 脚本仅作用于仓库首页导航栏。进入 Issues、Pull Request、文件浏览等子页面后，GitHub 导航栏布局不同，入口可能不显示，属预期行为。

## 兼容性

- **浏览器**：核心 API 中兼容性要求最高的是 `Element.closest()`，最低支持 **Chrome 41**。Chrome、Edge、Firefox、Safari 等现代浏览器均可运行。
- **用户脚本管理器**：Tampermonkey、Violentmonkey、Greasemonkey 4+。
- **页面范围**：`https://github.com/*`，仅在仓库首页生效。

## 已知限制

- 入口依赖 GitHub 导航栏的 DOM 结构。若 GitHub 大幅改版（例如更换导航栏容器的 `aria-label` 或类名），脚本可能失效，需要更新选择器。
- 不适用于 GitHub Enterprise 私有域名。如有需要，可在本地脚本中把 `@match` 改为对应域名。

## 隐私

- 不收集任何用户数据。
- 不发起额外网络请求。
- 不读取、不上传页面内容或账号信息。
- 全部逻辑在本地浏览器内完成。

## 贡献

欢迎提交 Issue 或 Pull Request。报告问题时请尽量附上：

- 浏览器版本与用户脚本管理器版本；
- 出问题的仓库地址（公开仓库即可）；
- 浏览器控制台（F12 → Console）中的报错信息。

## 许可证

[MIT License](./LICENSE)