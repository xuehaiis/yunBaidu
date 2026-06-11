<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>文字排版工具</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="shell">
    <header class="topbar">
      <div class="topbar-inner">
        <div class="brand">
          <div class="brand-mark">排</div>
          <div>
            <div class="brand-title">文字排版工具</div>
            <div class="brand-sub">txt / docx 导入、公众号排版、Word 导出</div>
          </div>
        </div>
        <div class="stats" id="formatterStats">等待导入文件</div>
      </div>
    </header>

    <main>
      <section class="panel">
        <div class="panel-header">
          <h1 class="panel-title">文档编辑</h1>
        </div>
        <div class="panel-body">
          <div class="formatter-controls">
            <label class="file-picker">
              导入文件
              <input id="documentInput" type="file" accept=".txt,.doc,.docx,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
            </label>
            <label>
              排版模式
              <select id="formatMode">
                <option value="standard">标准文档</option>
                <option value="article">文章段落</option>
                <option value="compact">紧凑排版</option>
                <option value="wechat">微信公众号</option>
              </select>
            </label>
            <button class="btn primary" id="formatBtn" type="button">快速排版</button>
            <button class="btn" id="clearFormatterBtn" type="button">清空</button>
            <button class="btn" id="copyWechatBtn" type="button">复制公众号格式</button>
            <button class="btn warn" id="exportWordBtn" type="button">导出 Word</button>
          </div>

          <div class="format-options">
            <label>
              标题样式
              <select id="titleStyle">
                <option value="center">居中标题</option>
                <option value="left">左对齐标题</option>
                <option value="numbered">编号标题</option>
              </select>
            </label>
            <label>
              段落间距
              <select id="paragraphSpacing">
                <option value="normal">标准间距</option>
                <option value="loose">宽松间距</option>
                <option value="compact">紧凑间距</option>
              </select>
            </label>
            <label class="checkbox-row">
              <input id="firstLineIndent" type="checkbox" checked>
              首行缩进
            </label>
          </div>

          <div class="editor-toolbar" aria-label="文本编辑工具">
            <button class="tool-btn" type="button" data-text-tool="title">标题</button>
            <button class="tool-btn" type="button" data-text-tool="subtitle">小标题</button>
            <button class="tool-btn" type="button" data-text-tool="paragraph">段落</button>
            <button class="tool-btn" type="button" data-text-tool="wechat-title">公众号标题</button>
            <button class="tool-btn" type="button" data-text-tool="indent">缩进</button>
            <button class="tool-btn" type="button" data-text-tool="bullet">列表</button>
            <button class="tool-btn" type="button" data-text-tool="number">编号</button>
            <button class="tool-btn" type="button" data-text-tool="quote">引用</button>
            <button class="tool-btn" type="button" id="insertImageBtn">图片</button>
            <button class="tool-btn" type="button" data-text-tool="separator">分隔</button>
            <button class="tool-btn" type="button" data-text-tool="trim">清理空格</button>
          </div>

          <input id="imageInput" class="hidden-file" type="file" accept="image/png,image/jpeg,image/gif,image/webp">
          <textarea id="formatterEditor" class="formatter-editor" placeholder="导入 txt 或 docx 文件后，内容会显示在这里；也可以直接粘贴文字再快速排版。"></textarea>
        </div>
      </section>
    </main>
  </div>

  <script src="app.js"></script>
</body>
</html>
