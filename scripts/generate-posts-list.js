const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(rootDir, 'posts');
const OUTPUT_FILE = path.join(rootDir, 'json', 'posts.json');

// 读取所有 posts 目录下的 html 文件
const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.html'));

function extractFirstMatch(str, regex) {
  const match = str.match(regex);
  return match ? match[1].trim() : '';
}

const posts = files.map(filename => {
  const filePath = path.join(POSTS_DIR, filename);
  const html = fs.readFileSync(filePath, 'utf-8');
  // 提取 <h2>...</h2>
  const title = extractFirstMatch(html, /<h2[^>]*>([\s\S]*?)<\/h2>/i);
  // 提取 <div class="post-date">...</div>
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
