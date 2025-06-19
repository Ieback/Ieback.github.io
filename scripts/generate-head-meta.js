const fs = require('fs');
const path = require('path');
const { HTML_HEAD } = require('../templates/meta.js');

const rootDir = path.resolve(__dirname, '..');
const postsDir = path.join(rootDir, 'posts');

function extractTitleFromH2(html) {
  const match = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  return match ? match[1].trim() : '无标题';
}

function injectHeadToFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf-8');
  const title = extractTitleFromH2(html);
  let head = HTML_HEAD({ title }).trim();
  // 如果是 posts.html，注入分页脚本
  if (path.basename(filePath) === 'posts.html') {
    // 在 </head> 前插入分页脚本
    head = head.replace('</head>', '  <script src="/scripts/generate-pagination.js"></script>\n</head>');
  }
  // 统一换行符为 \n
  const newHtml = html.replace(/<head>[\s\S]*?<\/head>/i, head).replace(/\r\n?/g, '\n');
  // 精确字节比对
  const oldBuffer = Buffer.from(html.replace(/\r\n?/g, '\n'));
  const newBuffer = Buffer.from(newHtml);
  if (!oldBuffer.equals(newBuffer)) {
    fs.writeFileSync(filePath, newHtml, 'utf-8');
  }
}

// 处理 posts 目录下所有 html
fs.readdirSync(postsDir).forEach(file => {
  if (file.endsWith('.html')) {
    injectHeadToFile(path.join(postsDir, file));
  }
});

// 处理根目录下所有 html
fs.readdirSync(rootDir).forEach(file => {
  if (file.endsWith('.html')) {
    injectHeadToFile(path.join(rootDir, file));
  }
});

console.log('所有 post HTML 文件的 <head> 已统一注入。');
