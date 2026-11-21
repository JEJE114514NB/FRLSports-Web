# FRLSports 官方网站

FRLSports 官网现在是多页面 + 静态内容文件结构：首页保留 **横向 4:3 官方海报轮播 + FRLSports [NAR] 简介 + 其他海报墙**；新闻、车队、赛事、关于是独立页面；所有公开页面底部固定显示 **只有彩色 Logo 的赞助商栏**。

内容写入 `assets/js/site-data.js`，前端加载后动态渲染，不需要后端 API 或数据库。

## 页面结构

| 页面 | 文件 | 内容 |
| --- | --- | --- |
| 首页 | `index.html` | 4:3 海报轮播、FRLSports [NAR] 简介、其他海报墙 |
| 赛事 | `events.html` | 导入赛事存档；列表只显示名称与 Logo，点击查看详情 |
| 新闻 | `news.html` | 新闻列表页 |
| 海报 | `posters.html` | 首页海报墙的独立完整页面 |
| 车队 | `teams.html` | 车队 Logo、名称、中文名、简介、QQ 群 |
| 关于 | `about.html` | FRLSports [NAR] 关于页面 |

顶部导航和移动端菜单均跳转到独立页面。首页“海报”导航会定位到简介下方的海报墙。

## 首页

- 顶部横向 **4:3** 海报轮播，4 张内置品牌海报，源图 1200 × 900。
- 自动播放、左右箭头、分页指示线、暂停按钮、键盘切换、鼠标拖动、手机滑动。
- 轮播正下方为 **FRLSports [NAR]**：
  - FRLSports是为赛车游戏比赛管理者及车手们提供平台及便利的地方。
  - News And Racing 缩写视觉。
  - 所有者：牢吉爆炸了！！！
- 简介下方为 **其他海报墙**：
  - 开发者上传任意比例图片。
  - 保留原始比例，不裁切。
  - 使用 CSS 多列瀑布流自动排版。
  - 可点击“独立页面 ↗”进入 `posters.html`。
  - 首页主海报和每张其他海报都可点击放大查看。

## 海报放大

- 点击首页当前主海报进入大图查看。
- 点击其他海报墙中的任意图片进入大图查看。
- 大图支持关闭按钮、点击背景关闭和 `Esc` 关闭。

## 捐赠按钮

顶部导航右侧新增 **捐赠** 按钮，所有公开页面可用。

- 使用与 FRLS Race Manager 赞助界面相同的二维码和说明。
- 已移除“感谢购买本产品”文案。
- 支持关闭按钮、点击背景关闭和 `Esc` 关闭。

![捐赠窗口](docs/preview-donation.png)

## 新闻页面

`news.html` 是独立页面，读取静态内容文件中的新闻，每条包含标题、正文、图片（16:9 裁切）、署名和日期。点击新闻卡片可以打开完整详情。

## 赛事页面

`events.html` 是独立页面。

- 赛事列表在查看详情前**只显示名称和 Logo**，不显示简介、分站、排名或积分。
- 点击赛事卡片打开详情，包含：赛事资料、分组、车手、分站、排名、积分和累计积分可视化曲线。
- 赛事数据来自 FRLS Race Manager 导出的 `.frls-event.json` 存档，由开发者页面导入。

## 车队页面

`teams.html` 是独立页面，开发者可添加：

- 车队 Logo（必填，保留比例）
- 名称
- 中文名称
- 简介
- QQ 群（选填）

车队卡片会展示 Logo、名称、中文名、简介和 QQ 群。点击车队卡片可以打开完整详情。

## 赞助商底栏

所有公开页面底部固定显示赞助商栏：

- **只显示彩色 Logo**，不显示名称或“感谢支持”等文字。
- Logo 不使用灰度滤镜，没有边框、没有卡片背景。
- 固定于浏览器视口底部，滚动时始终可见。
- Logo 较多时在栏内横向滚动。
- 没有 Logo 时栏保持为空，不显示文字占位。
- 开发者添加赞助商时必须上传 Logo。

## 开发者页面

在官网首页按：

```text
Alt + Shift + C
```

进入独立全屏开发者页面，输入密码：

```text
zxcvbnm
```

控制台包含六个模块：

1. **首页海报**：替换、添加、删除、排序、恢复默认 4:3 轮播海报。
2. **新闻管理**：标题、正文、署名、图片。
3. **赛事导入**：导入 FRLS Race Manager 导出的 `.frls-event.json` 存档，发布到赛事页面。
4. **其他海报**：任意比例图片，保留原始比例。
5. **车队管理**：Logo、名称、中文名称、简介、QQ 群。
6. **赞助商**：名称（后台备注）、Logo、链接；只有带 Logo 的赞助商显示在底栏。

## 静态内容文件与更新方式

公开页面都加载：

```text
assets/js/site-data.js
```

文件结构：

```js
window.FRL_SITE_DATA = {
  version: 1,
  updatedAt: "...",
  posters: [...],
  news: [...],
  gallery: [...],
  events: [...],
  teams: [...],
  sponsors: [...]
};
```

开发者修改内容后，点击开发者页面右上角 **“写入网页文件”**：

1. 浏览器会要求选择一个目录。
2. 选择包含 `index.html` 的网站根目录。
3. 浏览器直接写入 `assets/js/site-data.js`。
4. 连接成功后，之后新增、删除、上传内容会自动写入该文件。
5. 图片会以 Data URL 内嵌在 `site-data.js` 中，不需要单独上传图片文件。

如果浏览器不支持 File System Access API：

- 点击按钮会下载 `site-data.js`。
- 手动用它替换 `assets/js/site-data.js`。

> **重要限制：** 浏览器不能直接写入已部署的远程服务器文件。  
> “写入网页文件”写入的是你本机选择的网站目录；要让线上所有访客看到更新，仍需把新的 `site-data.js` 上传或重新部署到网站服务器。  
> 这仍然不需要后端 API 或数据库。

## 预览

预览中的新闻、赛事、海报、车队和赞助商 Logo 为演示数据；实际站点初始为空，由开发者页面添加。

### 桌面端首页

![FRLSports 桌面端首页](docs/preview-home-desktop.png)

### 简介下方的其他海报墙

![FRLSports 首页其他海报墙](docs/preview-home-wall.png)

### 海报大图查看

![FRLSports 海报大图](docs/preview-poster-lightbox.png)

### 固定赞助商 Logo 栏

![固定赞助商 Logo 栏](docs/preview-sponsor-bar.png)

### 赛事列表页面

![FRLSports 赛事列表](docs/preview-events-page.png)

### 赛事详情

![FRLSports 赛事详情](docs/preview-event-detail.png)

### 新闻独立页面

![FRLSports 新闻页面](docs/preview-news-page.png)

### 其他海报独立页面

![FRLSports 其他海报页面](docs/preview-posters-page.png)

### 车队页面

![FRLSports 车队页面](docs/preview-teams-page.png)

### 关于 FRLSports [NAR]

![FRLSports NAR 简介](docs/preview-about.png)

### 移动端首页

<img src="docs/preview-home-mobile.png" alt="FRLSports 移动端首页" width="390">

### 移动端菜单

<img src="docs/preview-home-menu.png" alt="FRLSports 移动端菜单" width="390">

### 开发者页面：访问

<img src="docs/preview-dev-access.png" alt="FRLSports 开发者页面访问入口" width="720">

### 开发者页面：首页海报

<img src="docs/preview-dev-console.png" alt="FRLSports 开发者首页海报" width="720">

### 开发者页面：新闻管理

<img src="docs/preview-dev-news.png" alt="FRLSports 新闻管理" width="720">

### 开发者页面：赛事导入

<img src="docs/preview-dev-events.png" alt="FRLSports 赛事导入" width="720">

### 开发者页面：其他海报

<img src="docs/preview-dev-gallery.png" alt="FRLSports 其他海报管理" width="720">

### 开发者页面：车队管理

<img src="docs/preview-dev-teams.png" alt="FRLSports 车队管理" width="720">

### 开发者页面：赞助商

<img src="docs/preview-dev-sponsors.png" alt="FRLSports 赞助商管理" width="720">

### 开发者页面：批量拖入

<img src="docs/preview-dev-dropzone.png" alt="FRLSports 批量拖入海报" width="720">

## 本地运行

直接双击 `index.html` 即可。

更推荐通过本地静态服务器打开，保证浏览器文件访问和存储行为稳定：

```powershell
cd frlsports_website
python -m http.server 8000
```

然后访问 <code>http://127.0.0.1:8000/</code>。

## 项目结构

```text
frlsports_website/
├─ index.html
├─ events.html
├─ news.html
├─ posters.html
├─ teams.html
├─ about.html
├─ assets/
│  ├─ css/
│  │  └─ main.css
│  ├─ js/
│  │  ├─ main.js
│  │  └─ site-data.js
│  └─ images/
│     ├─ favicon.svg
│     ├─ favicon.png
│     ├─ favicon-192.png
│     ├─ favicon-32.png
│     ├─ favicon.ico
│     ├─ apple-touch-icon.png
│     ├─ frlsports-logo-1400.png
│     ├─ frlsports-logo-1400.webp
│     ├─ frls_app_icon.png
│     ├─ sponsor_qr.jpg
│     └─ posters/
│        ├─ poster-01.webp
│        ├─ poster-02.webp
│        ├─ poster-03.webp
│        └─ poster-04.webp
├─ docs/
│  ├─ preview-home-desktop.png
│  ├─ preview-home-wall.png
│  ├─ preview-poster-lightbox.png
│  ├─ preview-donation.png
│  ├─ preview-sponsor-bar.png
│  ├─ preview-events-page.png
│  ├─ preview-event-detail.png
│  ├─ preview-news-page.png
│  ├─ preview-posters-page.png
│  ├─ preview-teams-page.png
│  ├─ preview-about.png
│  ├─ preview-home-mobile.png
│  ├─ preview-home-menu.png
│  ├─ preview-dev-access.png
│  ├─ preview-dev-console.png
│  ├─ preview-dev-news.png
│  ├─ preview-dev-events.png
│  ├─ preview-dev-gallery.png
│  ├─ preview-dev-teams.png
│  ├─ preview-dev-sponsors.png
│  └─ preview-dev-dropzone.png
├─ README.md
└─ .gitignore
```

## 说明

- 赛事页显示开发者导入的赛事存档；列表只显示名称和 Logo。
- 首页海报、新闻、赛事、其他海报、车队和赞助商都读取同一个静态内容文件。
- 主海报和其他海报均支持点击放大；顶栏捐赠按钮在所有公开页面显示。
- 新闻、赛事、其他海报、车队和赞助商初始为空，通过开发者页面添加或导入。
- 赞助商底栏只显示带 Logo 的条目。
- 赞助商底栏固定于视口底部，页面底部预留安全距离，页脚不会被永久遮挡。
- 浏览器本地仍保留草稿副本，用于开发时立即预览；线上访客读取 `site-data.js`。
- 开发者入口只在首页提供。
