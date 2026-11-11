---
title: Flutter 构建突然变慢，先清缓存
date: 2026-11-03
tags: ['Flutter']
---

改了几次 SDK 版本之后构建时间从 40 秒涨到 4 分钟，`flutter clean` 也没用。

真正有效的是连 pub 缓存和 gradle 缓存一起清：

```bash
flutter clean
flutter pub cache repair
cd android && ./gradlew clean
```

代价是下一次构建要重新下载依赖，但之后恢复正常。结论：**换 SDK 或依赖大版本之后，别指望 `flutter clean` 一次就够。**
