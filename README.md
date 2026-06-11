# 云资料分享站 PHP + MySQL 版

## 运行步骤

1. 创建 MySQL 数据库和表：导入 `database.sql`。
2. 复制 `config.example.php` 为 `config.php`，并修改数据库连接信息：
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASS`
3. 把项目放到 PHP 站点目录，通过浏览器访问 `index.php`。

## 本地便携环境

当前项目已带有本地 PHP 和 MySQL：

- 启动：右键 PowerShell 运行 `start-local.ps1`
- 停止：右键 PowerShell 运行 `stop-local.ps1`
- 访问地址：`http://127.0.0.1:8000/index.php`

## 文件说明

- `index.php`：页面入口
- `styles.css`：页面样式
- `app.js`：前台交互和后台管理请求
- `api/resources.php`：资料增删改查接口
- `api/import-document.php`：txt、docx 文件导入接口
- `config.php`：MySQL 连接配置
- `database.sql`：建库、建表和示例数据

## 功能

- 资料首页分类展示
- 后台新增、编辑、删除网盘资料
- 文字排版工具：导入 txt、docx，自动整理段落，可手动修改并导出 Word
- 微信公众号排版：提供公众号模式、标题样式、段落间距、首行缩进和富文本复制

## 注意

Word 导入支持 `.docx`。旧版 `.doc` 是二进制格式，建议先用 Word 另存为 `.docx` 后再导入。
服务器需要启用 PHP `zip` 扩展才能解析 `.docx` 文件。
