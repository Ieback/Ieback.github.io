class Header extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="header">
        <div class="inside">
          <h1><a href="/index.html" class="blog-title-link"><img src="/public/favicon.png" alt="logo" class="blog-logo" />beackの逃生舱</a></h1>
          <nav>
            <a href="/index.html">首页</a>
            <a href="/posts.html">文章</a>
          </nav>
          <div class="hamburger" id="hamburger-menu" tabindex="0" aria-label="菜单" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </header>
    `;
    // 汉堡菜单交互
    const hamburger = this.querySelector('#hamburger-menu');
    const nav = this.querySelector('nav');
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', nav.classList.contains('active'));
    });
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        nav.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', nav.classList.contains('active'));
      }
    });
    // 点击导航后自动收起菜单（移动端体验）
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
    // 点击菜单外收起菜单（移动端体验）
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 700 && nav.classList.contains('active')) {
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
          nav.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }
}
customElements.define('blog-header', Header);
