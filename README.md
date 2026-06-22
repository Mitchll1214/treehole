# 🌳 24小时匿名树洞

一个轻量级的匿名留言板应用，所有内容将在 **24 小时后自动消失**。就像在树上刻下一句话，第二天它就会被大自然抹去。

## ✨ 功能特点

- **完全匿名** — 无需注册、无需登录，不追踪任何用户信息
- **24 小时自动清除** — 每一条留言都有生命周期，到期后自动删除
- **频率限制** — 每个用户每小时最多发布 5 条，防止滥用
- **敏感词过滤** — 内置基础敏感词检测
- **响应式设计** — 适配桌面端和移动端
- **深色模式** — 自动跟随系统深色/浅色主题

## 🛠 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 构建工具 | Vite 7 |
| 后端运行时 | Cloudflare Workers |
| 数据库 | Cloudflare D1（SQLite） |
| 部署平台 | Cloudflare |
| 包管理器 | pnpm |

## 📁 项目结构

```
treehole/
├── src/                     # 前端源码
│   ├── components/          # React 组件
│   │   ├── MessageForm.tsx   # 消息发布表单
│   │   ├── PostList.tsx      # 消息列表（含无限滚动）
│   │   └── Toast.tsx         # 提示消息组件
│   ├── hooks/
│   │   └── useApi.ts         # API 请求封装
│   ├── utils/
│   │   └── helpers.ts        # 时间格式化等工具函数
│   ├── App.tsx               # 应用主入口
│   ├── App.css               # Vite 模板样式
│   ├── index.css             # 全局样式
│   └── main.tsx              # React 挂载入口
├── worker/                   # Cloudflare Worker 后端
│   └── index.ts              # API 路由 + 业务逻辑
├── schema.sql                # D1 数据库建表语句
├── wrangler.jsonc            # Wrangler 部署配置
└── vite.config.ts            # Vite 构建配置
```

## 🚀 快速开始

### 前置条件

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/installation) >= 10
- [Cloudflare 账号](https://dash.cloudflare.com/)（用于部署）

### 本地开发

```bash
# 1. 克隆项目
git clone <你的仓库地址>
cd treehole

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev
```

### 配置 Cloudflare

1. 登录 Cloudflare 控制台，创建一个 **D1 数据库**
2. 执行 `schema.sql` 中的建表语句：

```bash
wrangler d1 execute <数据库名称> --file=./schema.sql
```

3. 在 `wrangler.jsonc` 中配置你的 D1 数据库绑定：

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "<你的数据库名称>",
      "database_id": "<你的数据库 ID>"
    }
  ]
}
```

### 部署

```bash
pnpm deploy
```

## 📡 API 接口

### 发布消息

```
POST /api/post
Content-Type: application/json

{
  "content": "在这里写下你想说的话（最多 500 字）"
}
```

### 获取消息列表

```
GET /api/posts?page=0&limit=3
```

| 参数 | 类型 | 说明 |
|------|------|------|
| page | number | 页码，从 0 开始 |
| limit | number | 每页条数，默认 3 |

响应：

```json
{
  "posts": [
    {
      "id": 1,
      "content": "消息内容",
      "created_at": "2025-01-01T12:00:00Z"
    }
  ],
  "hasMore": true
}
```

## 📝 数据库表结构

### posts（消息表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| content | TEXT | 消息内容（最多 500 字符） |
| created_at | DATETIME | 创建时间 |
| expire_at | DATETIME | 过期时间（创建时间 + 1 天） |

### ip_logs（频率限制表）

| 字段 | 类型 | 说明 |
|------|------|------|
| ip_hash | TEXT | IP 地址的 SHA-256 哈希（主键） |
| last_post_time | DATETIME | 上次发布时间 |
| post_count_last_hour | INTEGER | 过去一小时发布次数 |

## ⚠️ 注意事项

- 消息一经发布**无法删除或修改**
- 超过 1 小时未发布新内容，频率计数将自动重置
- IP 地址仅用于频率限制，经过 SHA-256 哈希处理后存储，不会记录原始 IP
- 请遵守当地法律法规，不要发布违法或不当内容

## 📄 许可证

[MIT](./LICENSE)
