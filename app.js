const API_URL = "api/resources.php";
const IMPORT_URL = "api/import-document.php";

let resources = [];
let activeCategory = "全部";

const viewButtons = document.querySelectorAll("[data-view-btn]");
const homeView = document.querySelector("#homeView");
const adminView = document.querySelector("#adminView");
const formatterView = document.querySelector("#formatterView");
const searchInput = document.querySelector("#searchInput");
const categoryStrip = document.querySelector("#categoryStrip");
const resourceGrid = document.querySelector("#resourceGrid");
const emptyState = document.querySelector("#emptyState");
const resourceStats = document.querySelector("#resourceStats");
const adminTable = document.querySelector("#adminTable");
const resourceForm = document.querySelector("#resourceForm");
const formTitle = document.querySelector("#formTitle");
const resourceId = document.querySelector("#resourceId");
const nameInput = document.querySelector("#nameInput");
const typeInput = document.querySelector("#typeInput");
const linkInput = document.querySelector("#linkInput");
const codeInput = document.querySelector("#codeInput");
const descInput = document.querySelector("#descInput");
const resetBtn = document.querySelector("#resetBtn");
const restoreBtn = document.querySelector("#restoreBtn");
const documentInput = document.querySelector("#documentInput");
const formatMode = document.querySelector("#formatMode");
const formatBtn = document.querySelector("#formatBtn");
const clearFormatterBtn = document.querySelector("#clearFormatterBtn");
const copyWechatBtn = document.querySelector("#copyWechatBtn");
const exportWordBtn = document.querySelector("#exportWordBtn");
const formatterEditor = document.querySelector("#formatterEditor");
const formatterStats = document.querySelector("#formatterStats");
const editorToolbar = document.querySelector(".editor-toolbar");
const insertImageBtn = document.querySelector("#insertImageBtn");
const imageInput = document.querySelector("#imageInput");
const titleStyle = document.querySelector("#titleStyle");
const paragraphSpacing = document.querySelector("#paragraphSpacing");
const firstLineIndent = document.querySelector("#firstLineIndent");

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...options.headers
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "请求失败，请稍后重试");
  }

  return data;
}

async function loadResources() {
  try {
    const result = await requestJson(API_URL);
    resources = result.data || [];
    renderAll();
  } catch (error) {
    showError(error.message);
  }
}

function showError(message) {
  resourceStats.textContent = message;
  resourceGrid.innerHTML = "";
  adminTable.innerHTML = "";
  emptyState.classList.remove("hidden");
  emptyState.textContent = message;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getCategories() {
  return ["全部", ...Array.from(new Set(resources.map(item => item.type)))];
}

function getFilteredResources() {
  const keyword = searchInput.value.trim().toLowerCase();

  return resources.filter(item => {
    const inCategory = activeCategory === "全部" || item.type === activeCategory;
    const haystack = `${item.name} ${item.type} ${item.desc} ${item.code}`.toLowerCase();
    return inCategory && (!keyword || haystack.includes(keyword));
  });
}

function renderCategories() {
  const categories = getCategories();

  if (!categories.includes(activeCategory)) {
    activeCategory = "全部";
  }

  categoryStrip.innerHTML = categories.map(category => `
    <button class="chip ${category === activeCategory ? "active" : ""}" type="button" data-category="${escapeHtml(category)}">
      ${escapeHtml(category)}
    </button>
  `).join("");
}

function renderHome() {
  renderCategories();
  const list = getFilteredResources();

  resourceStats.textContent = `共 ${resources.length} 份资料，当前显示 ${list.length} 份`;
  resourceGrid.innerHTML = list.map(item => `
    <article class="resource-card">
      <div class="resource-head">
        <div class="resource-title">${escapeHtml(item.name)}</div>
        <span class="tag" title="${escapeHtml(item.type)}">${escapeHtml(item.type)}</span>
      </div>
      <p class="desc">${escapeHtml(item.desc)}</p>
      <div class="meta">
        <span>百度网盘</span>
        <span>提取码：${escapeHtml(item.code || "无")}</span>
      </div>
      <a class="download" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">打开网盘链接</a>
    </article>
  `).join("");

  emptyState.textContent = "没有找到匹配的资料";
  emptyState.classList.toggle("hidden", list.length > 0);
  resourceGrid.classList.toggle("hidden", list.length === 0);
}

function renderAdmin() {
  adminTable.innerHTML = resources.map(item => `
    <tr>
      <td class="table-title">${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.type)}</td>
      <td class="table-desc">${escapeHtml(item.desc)}</td>
      <td>${escapeHtml(item.code || "无")}</td>
      <td>
        <div class="row-actions">
          <button class="btn" type="button" data-edit="${escapeHtml(item.id)}">编辑</button>
          <button class="btn danger" type="button" data-delete="${escapeHtml(item.id)}">删除</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function renderAll() {
  renderHome();
  renderAdmin();
}

function resetForm() {
  resourceForm.reset();
  resourceId.value = "";
  formTitle.textContent = "新增资料";
  typeInput.value = "课程资料";
  nameInput.focus();
}

viewButtons.forEach(button => {
  button.addEventListener("click", () => {
    const view = button.dataset.viewBtn;
    viewButtons.forEach(item => item.classList.toggle("active", item === button));
    homeView.classList.toggle("hidden", view !== "home");
    adminView.classList.toggle("hidden", view !== "admin");
    formatterView.classList.toggle("hidden", view !== "formatter");
  });
});

categoryStrip.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderHome();
});

searchInput.addEventListener("input", renderHome);

resourceForm.addEventListener("submit", async event => {
  event.preventDefault();

  const payload = {
    id: resourceId.value,
    name: nameInput.value.trim(),
    type: typeInput.value,
    link: linkInput.value.trim(),
    code: codeInput.value.trim(),
    desc: descInput.value.trim()
  };

  const method = resourceId.value ? "PUT" : "POST";

  try {
    await requestJson(API_URL, {
      method,
      body: JSON.stringify(payload)
    });
    await loadResources();
    resetForm();
  } catch (error) {
    alert(error.message);
  }
});

adminTable.addEventListener("click", async event => {
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");

  if (editButton) {
    const item = resources.find(resource => String(resource.id) === editButton.dataset.edit);
    if (!item) return;

    resourceId.value = item.id;
    nameInput.value = item.name;
    typeInput.value = item.type;
    linkInput.value = item.link;
    codeInput.value = item.code || "";
    descInput.value = item.desc;
    formTitle.textContent = "编辑资料";
    nameInput.focus();
  }

  if (deleteButton) {
    const item = resources.find(resource => String(resource.id) === deleteButton.dataset.delete);
    if (!item) return;

    const ok = confirm(`确定删除“${item.name}”吗？`);
    if (!ok) return;

    try {
      await requestJson(API_URL, {
        method: "DELETE",
        body: JSON.stringify({ id: item.id })
      });
      await loadResources();
      if (String(resourceId.value) === String(item.id)) {
        resetForm();
      }
    } catch (error) {
      alert(error.message);
    }
  }
});

resetBtn.addEventListener("click", resetForm);

restoreBtn.addEventListener("click", async () => {
  const ok = confirm("恢复示例数据会覆盖数据库里的资料，确定继续吗？");
  if (!ok) return;

  try {
    const result = await requestJson(`${API_URL}?action=restore`, {
      method: "POST",
      body: JSON.stringify({})
    });
    resources = result.data || [];
    activeCategory = "全部";
    searchInput.value = "";
    renderAll();
    resetForm();
  } catch (error) {
    alert(error.message);
  }
});

documentInput.addEventListener("change", async () => {
  const file = documentInput.files[0];
  if (!file) return;

  formatterStats.textContent = "正在导入文件...";

  try {
    const extension = getFileExtension(file.name);
    let text = "";

    if (extension === "txt") {
      text = await readTxtFile(file);
    } else if (extension === "docx" || extension === "doc") {
      text = await importWordFile(file);
    } else {
      throw new Error("仅支持 txt、docx 文件");
    }

    formatterEditor.value = autoFormatText(text, getFormatOptions());
    updateFormatterStats();
  } catch (error) {
    formatterStats.textContent = error.message;
    alert(error.message);
  } finally {
    documentInput.value = "";
  }
});

formatterEditor.addEventListener("input", updateFormatterStats);

formatBtn.addEventListener("click", () => {
  formatterEditor.value = autoFormatText(formatterEditor.value, getFormatOptions());
  updateFormatterStats();
});

clearFormatterBtn.addEventListener("click", () => {
  formatterEditor.value = "";
  updateFormatterStats();
  formatterEditor.focus();
});

editorToolbar.addEventListener("click", event => {
  const button = event.target.closest("[data-text-tool]");
  if (!button) return;

  applyTextTool(button.dataset.textTool);
});

insertImageBtn.addEventListener("click", () => {
  imageInput.click();
});

imageInput.addEventListener("change", async () => {
  const file = imageInput.files[0];
  if (!file) return;

  try {
    const imageMarkdown = await readImageAsMarkdown(file);
    insertAtCursor(formatterEditor, `\n\n${imageMarkdown}\n\n`);
    updateFormatterStats();
  } catch (error) {
    alert(error.message);
  } finally {
    imageInput.value = "";
  }
});

exportWordBtn.addEventListener("click", () => {
  const text = formatterEditor.value.trim();
  if (!text) {
    alert("请先导入或输入要导出的内容");
    return;
  }

  exportAsWord(text);
});

copyWechatBtn.addEventListener("click", async () => {
  const text = formatterEditor.value.trim();
  if (!text) {
    alert("请先导入或输入要复制的内容");
    return;
  }

  try {
    await copyWechatHtml(text);
    formatterStats.textContent = "公众号格式已复制，可以粘贴到微信编辑器";
  } catch (error) {
    alert(error.message);
  }
});

function getFormatOptions() {
  return {
    mode: formatMode.value,
    titleStyle: titleStyle.value,
    paragraphSpacing: paragraphSpacing.value,
    firstLineIndent: firstLineIndent.checked
  };
}

function getFileExtension(name) {
  return name.split(".").pop().toLowerCase();
}

function readTxtFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("txt 文件读取失败"));
    reader.readAsText(file, "utf-8");
  });
}

function readImageAsMarkdown(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("请选择图片文件"));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      reject(new Error("图片不能超过 2MB"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const name = file.name.replace(/[()[\]]/g, "").trim() || "插入图片";
      resolve(`![${name}](${reader.result})`);
    };
    reader.onerror = () => reject(new Error("图片读取失败"));
    reader.readAsDataURL(file);
  });
}

function insertAtCursor(editor, text) {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const before = editor.value.slice(0, start);
  const after = editor.value.slice(end);

  editor.value = `${before}${text}${after}`;
  editor.focus();
  editor.setSelectionRange(start + text.length, start + text.length);
}

async function importWordFile(file) {
  const formData = new FormData();
  formData.append("document", file);

  const response = await fetch(IMPORT_URL, {
    method: "POST",
    body: formData
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Word 文件导入失败");
  }

  return data.text || "";
}

function autoFormatText(text, options) {
  const settings = typeof options === "string" ? { mode: options } : options;
  const mode = settings.mode || "standard";
  const normalized = String(text || "")
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u3000/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .trim();

  if (!normalized) return "";

  const lines = normalized
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  const paragraphs = mergeWrappedLines(lines);
  const spacing = getTextSpacing(settings);

  const formatted = paragraphs
    .map(line => formatLine(line, mode))
    .join(spacing)
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return mode === "wechat" ? formatWechatPlainText(formatted, settings) : formatted;
}

function getTextSpacing(settings) {
  if (settings.mode === "compact" || settings.paragraphSpacing === "compact") {
    return "\n";
  }

  if (settings.paragraphSpacing === "loose" || settings.mode === "wechat") {
    return "\n\n";
  }

  return "\n\n";
}

function formatWechatPlainText(text, settings) {
  let sectionNumber = 1;

  return text
    .split(/\n{2,}|\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const cleaned = stripManualFormat(line);

      if (isWechatTitle(line, index)) {
        if (settings.titleStyle === "numbered") {
          return `# ${sectionNumber++}. ${cleaned}`;
        }

        return `# ${cleaned}`;
      }

      if (isSubheading(line)) {
        return `## ${cleaned}`;
      }

      if (/^[-*]\s+/.test(line)) {
        return `- ${cleaned}`;
      }

      if (/^\d+[.．、]\s*/.test(line)) {
        return line;
      }

      return settings.firstLineIndent ? `    ${cleaned}` : cleaned;
    })
    .join("\n\n");
}

function isWechatTitle(line, index = 0) {
  const text = line.trim();
  return /^#\s+/.test(text)
    || /^第[一二三四五六七八九十百千万\d]+[章节篇]/.test(text)
    || (index === 0 && text.length <= 28 && !/[。！？.!?]$/.test(text));
}

function applyTextTool(tool) {
  const editor = formatterEditor;
  const value = editor.value;
  const selectionStart = editor.selectionStart;
  const selectionEnd = editor.selectionEnd;
  const lineStart = value.lastIndexOf("\n", Math.max(0, selectionStart - 1)) + 1;
  let lineEnd = value.indexOf("\n", selectionEnd);

  if (lineEnd === -1) {
    lineEnd = value.length;
  }

  const before = value.slice(0, lineStart);
  const selected = value.slice(lineStart, lineEnd);
  const after = value.slice(lineEnd);
  const changed = transformSelectedLines(selected, tool);

  editor.value = `${before}${changed}${after}`;
  editor.focus();
  editor.setSelectionRange(lineStart, lineStart + changed.length);
  updateFormatterStats();
}

function transformSelectedLines(text, tool) {
  const lines = text.split("\n");
  let number = 1;

  return lines.map(line => {
    const cleaned = stripManualFormat(line);

    if (tool === "title") {
      return cleaned ? `# ${cleaned}` : "";
    }

    if (tool === "subtitle") {
      return cleaned ? `## ${cleaned}` : "";
    }

    if (tool === "wechat-title") {
      return cleaned ? `# ${cleaned}` : "";
    }

    if (tool === "paragraph") {
      return cleaned ? cleaned : "";
    }

    if (tool === "indent") {
      return cleaned ? `    ${cleaned}` : "";
    }

    if (tool === "bullet") {
      return cleaned ? `- ${cleaned}` : "";
    }

    if (tool === "number") {
      return cleaned ? `${number++}. ${cleaned}` : "";
    }

    if (tool === "quote") {
      return cleaned ? `> ${cleaned}` : "";
    }

    if (tool === "separator") {
      return line.trim() ? line : "---";
    }

    if (tool === "trim") {
      return line.replace(/[ \t]+/g, " ").trim();
    }

    return line;
  }).join("\n");
}

function stripManualFormat(line) {
  return line
    .trim()
    .replace(/^#{1,2}\s+/, "")
    .replace(/^>\s+/, "")
    .replace(/^[-*]\s+/, "")
    .replace(/^\d+[.．、]\s*/, "")
    .trim();
}

function parseImageLine(line) {
  const match = line.trim().match(/^!\[(.*?)\]\((data:image\/(?:png|jpe?g|gif|webp);base64,[^)]+)\)$/i);
  if (!match) {
    return null;
  }

  return {
    alt: match[1] || "图片",
    src: match[2]
  };
}

function mergeWrappedLines(lines) {
  const result = [];

  lines.forEach(line => {
    const previous = result[result.length - 1];
    if (!previous || isHeading(line) || isHeading(previous) || endsWithSentenceMark(previous) || line.length < 18) {
      result.push(line);
      return;
    }

    result[result.length - 1] = `${previous}${line}`;
  });

  return result;
}

function formatLine(line, mode) {
  const cleaned = line
    .replace(/\s*([，。！？；：、,.!?;:])\s*/g, "$1")
    .replace(/([。！？；])(?=\S)/g, "$1 ")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (isHeading(cleaned)) {
    return cleaned.replace(/^#{1,2}\s+/, "").replace(/[：:。.]$/, "");
  }

  if (mode === "article") {
    return `    ${cleaned}`;
  }

  return cleaned;
}

function isHeading(line) {
  const text = line.trim();
  return /^#{1,2}\s+/.test(text)
    || /^第[一二三四五六七八九十百千万\d]+[章节篇]/.test(text)
    || /^[一二三四五六七八九十]+[、.．]/.test(text)
    || /^\d+([.．、]\d+)*[.．、]\s*/.test(text)
    || (text.length <= 18 && !/[。！？.!?]$/.test(text));
}

function isSubheading(line) {
  return /^##\s+/.test(line.trim());
}

function isTitle(line) {
  const text = line.trim();
  return /^#\s+/.test(text) || (
    isHeading(text)
    && !isSubheading(text)
    && !/^[-*]\s+/.test(text)
    && !/^\d+[.．、]\s*/.test(text)
    && !/^[一二三四五六七八九十]+[、.．]/.test(text)
  );
}

function endsWithSentenceMark(line) {
  return /[。！？；.!?;：:]$/.test(line.trim());
}

function updateFormatterStats() {
  const text = formatterEditor.value.trim();
  const textWithoutImages = text.replace(/!\[[^\]]*]\(data:image\/[^)]+\)/gi, "[图片]");
  const words = textWithoutImages.replace(/\s/g, "").length;
  const paragraphs = text ? text.split(/\n{2,}|\n/).filter(item => item.trim()).length : 0;
  const modeLabel = formatMode.value === "wechat" ? "公众号" : "普通";
  formatterStats.textContent = `${modeLabel}排版，共 ${words} 字，${paragraphs} 段`;
}

function exportAsWord(text) {
  const body = text
    .split(/\n{2,}|\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const image = parseImageLine(line);
      if (image) {
        return `<p class="image"><img src="${image.src}" alt="${escapeHtml(image.alt)}"></p>`;
      }

      if (line === "---") {
        return "<hr>";
      }

      const cleaned = stripManualFormat(line);
      const safe = escapeHtml(cleaned);

      if (/^[-*]\s+/.test(line.trim())) {
        return `<p class="list">${safe}</p>`;
      }

      if (/^\d+[.．、]\s*/.test(line.trim())) {
        return `<p class="list">${escapeHtml(line.trim())}</p>`;
      }

      if (/^>\s+/.test(line.trim())) {
        return `<p class="quote">${safe}</p>`;
      }

      if (isTitle(line)) {
        return `<h1>${safe}</h1>`;
      }

      if (isSubheading(line)) {
        return `<h2>${safe}</h2>`;
      }

      return `<p>${safe}</p>`;
    })
    .join("");

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>排版文档</title>
  <style>
    body { font-family: SimSun, "Microsoft YaHei", serif; font-size: 14pt; line-height: 1.8; }
    h1 { font-size: 22pt; text-align: center; margin: 22pt 0 16pt; }
    h2 { font-size: 18pt; margin: 18pt 0 12pt; }
    p { text-indent: 2em; margin: 0 0 10pt; }
    img { max-width: 100%; height: auto; }
    .image { text-indent: 0; text-align: center; margin: 14pt 0; }
    .list { text-indent: 0; margin-left: 24pt; }
    .quote { text-indent: 0; margin-left: 24pt; color: #555; border-left: 3pt solid #999; padding-left: 10pt; }
    hr { border: 0; border-top: 1pt solid #999; margin: 16pt 0; }
  </style>
</head>
<body>${body}</body>
</html>`;

  const blob = new Blob(["\ufeff", html], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `排版文档-${stamp}.doc`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function copyWechatHtml(text) {
  const html = buildWechatHtml(text, getFormatOptions());
  const plainText = text.replace(/^#{1,2}\s+/gm, "").replace(/^>\s+/gm, "");

  if (navigator.clipboard && window.ClipboardItem) {
    const item = new ClipboardItem({
      "text/html": new Blob([html], { type: "text/html" }),
      "text/plain": new Blob([plainText], { type: "text/plain" })
    });
    await navigator.clipboard.write([item]);
    return;
  }

  if (navigator.clipboard) {
    await navigator.clipboard.writeText(plainText);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = plainText;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function buildWechatHtml(text, settings) {
  const blocks = text
    .split(/\n{2,}|\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map((line, index) => renderWechatBlock(line, settings, index))
    .join("");

  return `<section style="font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue','PingFang SC','Microsoft YaHei',sans-serif;color:#1f2937;line-height:1.9;font-size:16px;">${blocks}</section>`;
}

function renderWechatBlock(line, settings, index) {
  const image = parseImageLine(line);
  if (image) {
    return `<section style="text-align:center;margin:18px 0;"><img src="${image.src}" alt="${escapeHtml(image.alt)}" style="max-width:100%;height:auto;border-radius:4px;"></section>`;
  }

  if (line === "---") {
    return '<section style="height:1px;background:#d9e1ec;margin:24px 0;"></section>';
  }

  const raw = line.trim();
  const cleaned = stripManualFormat(raw);
  const safe = escapeHtml(cleaned);
  const paragraphMargin = settings.paragraphSpacing === "loose" ? "18px" : settings.paragraphSpacing === "compact" ? "8px" : "12px";
  const textIndent = settings.firstLineIndent ? "2em" : "0";

  if (isWechatTitle(raw, index)) {
    const align = settings.titleStyle === "left" ? "left" : "center";
    return `<section style="text-align:${align};font-size:22px;font-weight:700;color:#1d4f9b;margin:28px 0 18px;">${safe}</section>`;
  }

  if (isSubheading(raw)) {
    return `<section style="font-size:18px;font-weight:700;color:#0f8f72;border-left:4px solid #0f8f72;padding-left:10px;margin:22px 0 12px;">${safe}</section>`;
  }

  if (/^[-*]\s+/.test(raw)) {
    return `<p style="margin:0 0 ${paragraphMargin};padding-left:1.2em;text-indent:-1.2em;">• ${safe}</p>`;
  }

  if (/^\d+[.．、]\s*/.test(raw)) {
    return `<p style="margin:0 0 ${paragraphMargin};padding-left:1.4em;text-indent:-1.4em;">${escapeHtml(raw)}</p>`;
  }

  if (/^>\s+/.test(raw)) {
    return `<section style="margin:16px 0;padding:12px 14px;border-left:4px solid #d9e1ec;background:#f8fafc;color:#4b5563;">${safe}</section>`;
  }

  return `<p style="margin:0 0 ${paragraphMargin};text-indent:${textIndent};">${safe}</p>`;
}

updateFormatterStats();
loadResources();
