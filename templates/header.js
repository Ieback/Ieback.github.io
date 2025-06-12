class Header extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="header">
        <div class="inside">
          <h1><a href="/index.html" class="blog-title-link">　Leback的逃生舱</a></h1>
          <nav>
            <a href="/index.html">首页</a>
            <a href="/posts.html">文章</a>
            <span id="mode-switch" aria-label="切换日夜模式" class="mode-switch-btn" style="font-size:1.3em;">
              <img id="mode-icon" src="/public/moon.png" alt="夜间模式" style="width:1.5em;height:1.5em;vertical-align:middle;" />
            </span>
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
    nav.querySelectorAll('a,span').forEach(a => {
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
    // 日夜模式切换
    const modeSwitch = this.querySelector('#mode-switch');
    const modeIcon = this.querySelector('#mode-icon');
    function setMode(night) {
      if (night) {
        document.body.classList.add('night-mode');
        modeIcon.src = '/public/sun.png';
        modeIcon.alt = '日间模式';
      } else {
        document.body.classList.remove('night-mode');
        modeIcon.src = '/public/moon.png';
        modeIcon.alt = '夜间模式';
      }
    }
    // 读取本地存储，默认白天模式
    let night = false;
    if (localStorage.getItem('night-mode') === '1') {
      night = true;
    } else if (localStorage.getItem('night-mode') === '0') {
      night = false;
    } else {
      // 首次访问，默认白天
      localStorage.setItem('night-mode', '0');
    }
    setMode(night);
    modeSwitch.addEventListener('click', () => {
      night = !night;
      setMode(night);
      localStorage.setItem('night-mode', night ? '1' : '0');
    });
  }
}
customElements.define('blog-header', Header);
