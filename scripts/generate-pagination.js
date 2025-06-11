const PAGE_SIZE = 10;
let posts = [];
let currentPage = 1;
async function fetchPosts() {
  const res = await fetch('/json/posts.json');
  posts = await res.json();
  renderPage(1);
}
function renderPage(page) {
  currentPage = page;
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pagePosts = posts.slice(start, end);
  const list = document.getElementById('post-list');
  list.innerHTML = pagePosts.map(post =>
    `<li><a class="post-title" href="${post.link}">${post.title}</a><div class="post-date">${post.date}</div></li>`
  ).join('');
  renderPagination();
}
function renderPagination() {
  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  let html = '';
  if (totalPages > 1) {
    html = '<div class="pagination">';
    for (let i = 1; i <= totalPages; i++) {
      if (i === currentPage) {
        html += `<span class="current">${i}</span>`;
      } else {
        html += `<a href="#" onclick="renderPage(${i});return false;">${i}</a>`;
      }
    }
    html += '</div>';
  }
  document.querySelector('.pagination')?.remove();
  document.querySelector('main').insertAdjacentHTML('beforeend', html);
}
fetchPosts();