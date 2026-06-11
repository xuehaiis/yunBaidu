# 文字排版工具

独立版文字排版工具，支持导入 `txt`、`docx`，在网页中手动编辑，复制微信公众号富文本格式，并导出 Word 可打开的 `.doc` 文件。

## 功能

- 导入 `txt`
- 导入 `docx`
- 快速排版
- 标题、小标题、段落、列表、编号、引用、分隔线
- 插入本地图片
- 微信公众号排版和富文本复制
- 导出 Word

## 运行

在当前目录运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\start-local.ps1
```

访问：

```text
http://127.0.0.1:8010/index.php
```

## 注意

`.docx` 导入需要 PHP 启用 `zip` 扩展。旧版 `.doc` 文件请先用 Word 另存为 `.docx`。
