const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(rootDir, 'posts');
const OUTPUT_FILE = path.join(rootDir, 'json', 'posts.json');
const POSTS_HTML = path.join(rootDir, 'posts.html');
const SITEMAP_XML = path.join(rootDir, 'sitemap.xml');

// 生成 hash（仅用标题和日期，保证同一文章 hash 不变）
function getHash(title, date) {
  return crypto.createHash('md5').update(title + '|' + date).digest('hex').slice(0, 12);
}

// 读取所有 posts 目录下的 html 文件
let files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.html'));

// 记录旧文件名与新 hash 文件名的映射
const renameMap = {};

function extractFirstMatch(str, regex) {
  const match = str.match(regex);
  return match ? match[1].trim() : '';
}

// 先重命名为 hash 文件名
for (const file of files) {
  const filePath = path.join(POSTS_DIR, file);
  const html = fs.readFileSync(filePath, 'utf-8');
  // 提取 <h2>...</h2> 作为标题
  const title = extractFirstMatch(html, /<h2[^>]*>([\s\S]*?)<\/h2>/i) || file;
  // 提取 <div class="post-date">...</div> 作为日期
  const date = extractFirstMatch(html, /<div[^>]*class=["']post-date["'][^>]*>([\s\S]*?)<\/div>/i) || '';
  const hash = getHash(title, date);
  const newFile = hash + '.html';
  if (file !== newFile && !fs.existsSync(path.join(POSTS_DIR, newFile))) {
    fs.renameSync(filePath, path.join(POSTS_DIR, newFile));
    renameMap[file] = newFile;
    console.log(`${file} -> ${newFile}`);
  } else if (file !== newFile) {
    // hash 冲突，保留原文件名
    renameMap[file] = file;
  } else {
    renameMap[file] = file;
  }
}

// 重新获取 hash 后的文件名
files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.html'));

const posts = files.map(filename => {
  const filePath = path.join(POSTS_DIR, filename);
  const html = fs.readFileSync(filePath, 'utf-8');
  const title = extractFirstMatch(html, /<h2[^>]*>([\s\S]*?)<\/h2>/i);
  const date = extractFirstMatch(html, /<div[^>]*class=["']post-date["'][^>]*>([\s\S]*?)<\/div>/i);
  return {
    title,
    date,
    link: `posts/${filename}`,
    dateObj: new Date(date)
  };
});

// 按日期降序排序
posts.sort((a, b) => b.dateObj - a.dateObj);

// 移除 dateObj 字段，仅保留 title, date, link
const postsForJson = posts.map(({ title, date, link }) => ({ title, date, link }));

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(postsForJson, null, 2), 'utf-8');
console.log('posts.json 已生成，文章数：', postsForJson.length);

// 更新 posts.html 和 sitemap.xml 的链接
function batchReplaceLinks(filePath, renameMap) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  Object.entries(renameMap).forEach(([oldName, newName]) => {
    // 替换 posts/oldName 为 posts/newName
    content = content.replace(new RegExp('posts/' + oldName, 'g'), 'posts/' + newName);
  });
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`${path.basename(filePath)} 已同步所有文章链接`);
}
batchReplaceLinks(POSTS_HTML, renameMap);
batchReplaceLinks(SITEMAP_XML, renameMap);

// 生成 sitemap.xml
function generateSitemap(posts) {
  const domain = 'https://your-domain.com'; // 请替换为你的实际域名
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <url>\n    <loc>${domain}/</loc>\n    <priority>1.0</priority>\n  </url>\n`;
  xml += `  <url>\n    <loc>${domain}/posts.html</loc>\n    <priority>0.8</priority>\n  </url>\n`;
  posts.forEach(post => {
    xml += `  <url>\n    <loc>${domain}/${post.link}</loc>\n    <priority>0.7</priority>\n  </url>\n`;
  });
  xml += `</urlset>\n`;
  fs.writeFileSync(SITEMAP_XML, xml, 'utf-8');
  console.log('sitemap.xml 已自动生成');
}
generateSitemap(postsForJson);
