<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>云资料分享站 - 演示版</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="shell">
    <header class="topbar">
      <div class="topbar-inner">
        <div class="brand">
          <div class="brand-mark">云</div>
          <div>
            <div class="brand-title">云资料分享站</div>
            <div class="brand-sub">百度网盘资料分类管理演示版</div>
          </div>
        </div>
        <nav class="nav" aria-label="页面切换">
          <button class="active" type="button" data-view-btn="home">资料首页</button>
          <button type="button" data-view-btn="admin">后台管理</button>
          <button type="button" data-view-btn="formatter">排版工具</button>
        </nav>
      </div>
    </header>

    <main>
      <section id="homeView">
        <div class="toolbar">
          <div class="searchbox">
            <input id="searchInput" type="search" placeholder="搜索资料名称、类型或说明">
          </div>
          <div class="stats" id="resourceStats"></div>
        </div>
        <div class="category-strip" id="categoryStrip"></div>
        <div class="resource-grid" id="resourceGrid"></div>
        <div class="empty hidden" id="emptyState">没有找到匹配的资料</div>
      </section>

      <section id="adminView" class="hidden">
        <div class="admin-layout">
          <div class="panel">
            <div class="panel-header">
              <h2 class="panel-title" id="formTitle">新增资料</h2>
            </div>
            <div class="panel-body">
              <form id="resourceForm" class="form-grid">
                <input id="resourceId" type="hidden">
                <label>
                  资料名称
                  <input id="nameInput" required maxlength="80" placeholder="例如：2026前端学习路线">
                </label>
                <label>
                  资料类型
                  <select id="typeInput" required>
                    <option value="课程资料">课程资料</option>
                    <option value="软件工具">软件工具</option>
                    <option value="电子书">电子书</option>
                    <option value="设计素材">设计素材</option>
                    <option value="办公模板">办公模板</option>
                    <option value="其他资料">其他资料</option>
                  </select>
                </label>
                <label>
                  网盘链接
                  <input id="linkInput" required type="url" placeholder="https://pan.baidu.com/s/...">
                </label>
                <label>
                  提取码
                  <input id="codeInput" maxlength="12" placeholder="例如：abcd">
                </label>
                <label>
                  说明
                  <textarea id="descInput" required maxlength="260" placeholder="写清楚资料内容、适合人群或版本信息"></textarea>
                </label>
                <div class="form-actions">
                  <button class="btn primary" type="submit">保存资料</button>
                  <button class="btn" id="resetBtn" type="button">清空表单</button>
                </div>
              </form>
            </div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h2 class="panel-title">资料列表</h2>
              <button class="btn warn" id="restoreBtn" type="button">恢复示例数据</button>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>名称</th>
                    <th>类型</th>
                    <th>说明</th>
                    <th>提取码</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody id="adminTable"></tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="formatterView" class="hidden">
        <div class="formatter-layout">
          <div class="panel">
            <div class="panel-header">
              <h2 class="panel-title">文字排版工具</h2>
              <div class="stats" id="formatterStats">等待导入文件</div>
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
          </div>
        </div>
      </section>
    </main>
  </div>
  <script src="app.js"></script>
</body>
</html>
