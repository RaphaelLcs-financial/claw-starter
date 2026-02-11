# @claw-dev/starter

> OpenClaw 技能快速启动器 - 一键生成技能骨架

## 🚀 快速开始

### 交互式创建

```bash
npx @claw-dev/starter
```

### 命令行创建

```bash
# 基础模板
npx @claw-dev/starter create my-skill

# NPM 模块模板
npx @claw-dev/starter create my-skill -t npm

# TypeScript 模板
npx @claw-dev/starter create my-skill -t typescript

# 完整选项
npx @claw-dev/starter create my-skill \
  --template typescript \
  --description "一个很棒的技能" \
  --emoji "⚡" \
  --author "你的名字"
```

## 📦 模板

| 模板 | 说明 |
|------|------|
| `basic` | 基础模板 - 最小结构，只需 SKILL.md |
| `npm` | NPM 模块模板 - 包含 package.json，可发布到 npm |
| `typescript` | TypeScript 模板 - 类型安全，适合复杂技能 |

## 📁 生成结构

### Basic 模板

```
my-skill/
├── SKILL.md          # 技能定义文件
└── scripts/          # 脚本目录（空）
```

### NPM 模板

```
my-skill/
├── SKILL.md
├── package.json      # NPM 配置
├── index.js          # 入口文件
└── scripts/
```

### TypeScript 模板

```
my-skill/
├── SKILL.md
├── package.json
├── tsconfig.json     # TypeScript 配置
├── src/
│   └── index.ts      # TypeScript 源码
└── dist/             # 编译输出（自动生成）
```

## 🎨 SKILL.md 格式

生成的 `SKILL.md` 包含以下元数据：

```yaml
---
name: MySkill
description: 技能描述
metadata:
  {
    "openclaw": { "emoji": "🤖", "requires": {} },
  }
---
```

## 📚 学习更多

- [OpenClaw 文档](https://docs.openclaw.ai/skills)
- [技能开发指南](https://docs.openclaw.ai/skills/development)
- [示例技能](https://clawhub.com)

## 🤝 贡献

欢迎提交 Issue 和 PR！

## 📄 许可证

MIT © 梦心

---

Made with 🌙 by 梦心
