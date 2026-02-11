#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
// Simple spinner replacement
function ora(text) {
  return {
    start: function() { console.log(chalk.cyan('⏳', text)); return this; },
    succeed: function(msg) { console.log(chalk.green('✓', msg)); },
    fail: function(msg) { console.log(chalk.red('✗', msg)); }
  };
}

const TEMPLATES = {
  basic: '基础模板 - 最小结构',
  npm: 'NPM 模块模板 - 包含 package.json',
  typescript: 'TypeScript 模板 - 类型安全'
};

// 替换模板变量
function replaceTemplateVars(template, vars) {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return result;
}

// 驼峰转 kebab-case
function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

// 复制模板目录
function copyTemplate(srcDir, destDir, vars) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const files = fs.readdirSync(srcDir);

  files.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyTemplate(srcPath, destPath, vars);
    } else {
      const content = fs.readFileSync(srcPath, 'utf-8');
      const processed = replaceTemplateVars(content, vars);
      fs.writeFileSync(destPath, processed);
    }
  });
}

// 生成项目
async function generateProject(options) {
  const spinner = ora('正在创建技能...').start();

  try {
    const templateDir = path.join(__dirname, '../templates', options.template);
    const vars = {
      skillName: options.name,
      skillNameKebab: toKebabCase(options.name),
      description: options.description || '一个新的 OpenClaw 技能',
      emoji: options.emoji || '🤖',
      author: options.author || '',
      usage: options.usage || '待添加',
      configuration: '待添加',
      notes: '待添加'
    };

    const destDir = path.join(process.cwd(), options.name);

    if (fs.existsSync(destDir)) {
      spinner.fail(`目录 ${options.name} 已存在`);
      process.exit(1);
    }

    copyTemplate(templateDir, destDir, vars);

    spinner.succeed(chalk.green('技能创建成功！\n'));

    console.log(chalk.cyan('📁 下一步：\n'));
    console.log(`  cd ${options.name}`);
    console.log('  # 编辑 SKILL.md 配置你的技能\n');

    if (options.template !== 'basic') {
      console.log('  npm install');
      console.log('  npm start\n');
    }

    console.log(chalk.yellow('📚 文档：'));
    console.log('  https://docs.openclaw.ai/skills\n');
  } catch (error) {
    spinner.fail(chalk.red('创建失败：' + error.message));
    process.exit(1);
  }
}

// 交互式创建
async function interactiveCreate() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '技能名称：',
      validate: input => input.trim().length > 0 || '请输入技能名称'
    },
    {
      type: 'list',
      name: 'template',
      message: '选择模板：',
      choices: [
        { name: TEMPLATES.basic, value: 'basic' },
        { name: TEMPLATES.npm, value: 'npm' },
        { name: TEMPLATES.typescript, value: 'typescript' }
      ]
    },
    {
      type: 'input',
      name: 'description',
      message: '技能描述：',
      default: '一个新的 OpenClaw 技能'
    },
    {
      type: 'input',
      name: 'emoji',
      message: '技能表情符号：',
      default: '🤖'
    },
    {
      type: 'input',
      name: 'author',
      message: '作者：',
      default: ''
    }
  ]);

  await generateProject(answers);
}

// 命令行配置
program
  .name('claw-starter')
  .description('OpenClaw 技能快速启动器')
  .version('1.0.0');

program
  .command('create [name]')
  .description('创建新技能')
  .option('-t, --template <type>', '模板类型 (basic|npm|typescript)', 'basic')
  .option('-d, --description <desc>', '技能描述')
  .option('-e, --emoji <emoji>', '技能表情')
  .option('-a, --author <author>', '作者')
  .action((name, options) => {
    if (name) {
      generateProject({
        name,
        template: options.template,
        description: options.description,
        emoji: options.emoji,
        author: options.author
      });
    } else {
      interactiveCreate();
    }
  });

program
  .command('list')
  .description('列出可用模板')
  .action(() => {
    console.log(chalk.cyan('\n📦 可用模板：\n'));
    for (const [key, desc] of Object.entries(TEMPLATES)) {
      console.log(`  ${chalk.yellow(key.padEnd(12))} - ${desc}`);
    }
    console.log();
  });

// 解析参数
program.parse();
