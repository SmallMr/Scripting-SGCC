# SGCC 网上国网

网上国网小组件：电费余额、上期 / 年度电费电量、阶梯进度，以及按日或按月的用电柱状图。

## 使用

直接导入仓库根目录的 `Scripting-SGCC.scripting`，或在 Scripting 中新建脚本后放入本仓库文件。

1. 打开脚本设置，填写网上国网**手机号**和**密码**（密码只存在本机钥匙串）。
2. 首次登录（新设备）国网会要求短信验证：点「发送短信验证码」，把收到的 6 位验证码填入「短信验证码」，再点「立即刷新」或预览小组件。
3. 添加小组件。支持小号、中号，以及锁屏的矩形、圆形、行内样式。

### 多户号

长按小组件 → 编辑小组件 → 参数，填从 0 开始的整数：`0` 为第一户（默认），`1` 为第二户，以此类推。最多读取 6 个户号。

### 设置项

- **网上国网账号**：手机号、密码、短信验证码
- **数据**：立即刷新、清除数据缓存
- **阶梯**：第一阶梯上限（默认 2760 度）、第二阶梯上限（默认 4800 度），按年累计
- **小号组件**：三项 / 四项列表 / 四项模块
- **数据更新**：4 / 6 / 8 / 12 / 24 小时

> 小号组件的三种模式会保存到偏好设置，组件渲染在后续版本接入。

## 数据与刷新

- 直连网上国网 App 接口，缓存时长由设置里的「数据更新」决定（默认 4 小时）；请求失败时回退到缓存（中号组件右下角时间旁会显示 ⚠︎）。
- 「清除数据缓存」后下次刷新会重新请求。

## 目录

```text
.
├── index.tsx              设置页入口
├── widget.tsx             小组件入口
├── app/
│   └── preferences.tsx    设置界面
├── core/
│   ├── gateway.ts         请求、缓存与短信验证
│   ├── protocol.ts        设备令牌与加解密
│   ├── settings.ts        偏好设置与钥匙串
│   └── usage.ts           用量整理与阶梯计算
├── ui/
│   ├── canvas.tsx         按尺寸分发
│   ├── compact.tsx        小号
│   ├── medium.tsx         中号
│   ├── accessory.tsx      锁屏与错误页
│   ├── atoms.tsx          公共图形
│   ├── model.ts           视图数据类型
│   └── theme.ts           尺寸、颜色与格式化
└── assets/
    └── logo.png
```

## 说明与致谢

- 小组件思路与早期版本参考了
  [Honye/scripting-scripts · SGCC](https://github.com/Honye/scripting-scripts/tree/main/scripts/SGCC)。
- 协议（SM2 / SM3 / SM4 加密与 Turing 设备令牌）来自
  [stevenjoezhang/hass-state-grid](https://github.com/stevenjoezhang/hass-state-grid)，
  MIT License, Copyright (c) 2026 stevenjoezhang，见 `core/protocol.ts`。
