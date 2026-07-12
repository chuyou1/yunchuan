# AGENTS.md - 韫川科技开业盛典H5邀请函

## 项目概览
深圳韫川信息科技有限公司开业盛典H5邀请函页面，新中式商务风格，6屏滚动式展示。

## 技术栈
- 原生 HTML5 + CSS3 + Vanilla JavaScript
- Python http.server 静态文件服务
- Google Fonts (Ma Shan Zheng, Noto Serif SC, Noto Sans SC, Playfair Display, Montserrat)

## 目录结构
```
├── index.html          # 主页面（6屏结构）
├── styles/
│   └── main.css        # 全部样式（新中式商务风格）
├── scripts/
│   └── app.js          # 交互与动效逻辑
├── public/
│   └── logo.png        # 韫川科技品牌LOGO
├── DESIGN.md           # 设计规范文件
└── .coze               # 项目配置
```

## 页面结构（6屏）
1. **首屏** (`#hero`) - LOGO + 主标题 + 时间地址 + 印章
2. **企业介绍** (`#about`) - 公司简介 + 金线装饰
3. **韫川文化** (`#culture`) - 命名释义 + 韫/川双栏
4. **诚挚邀请** (`#invite`) - 邀请正文 + 金线边框
5. **开业仪程** (`#schedule`) - 时间轴式议程
6. **尾页** (`#footer`) - 联系方式 + 导航 + LOGO

## 动效说明
- Canvas 粒子背景（金色/朱砂红粒子 + 连线效果）
- IntersectionObserver 滚动触发渐入动画
- 文化屏"韫""川"双栏对向滑入
- LOGO 悬浮动画
- 音乐按钮脉冲动效
- 加载动画（LOGO淡入 + 金线展开）

## 设计规范
- 主色：朱砂红 #C41E3A
- 辅色：帝王金 #D4AF37
- 底色：深墨灰 #2C2C2C / 墨黑 #1a1a1a
- 书法字体：Ma Shan Zheng
- 正文：Noto Serif SC / Noto Sans SC
