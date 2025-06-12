class Footer extends HTMLElement {
  connectedCallback() {
    const year = new Date().getFullYear();
    this.innerHTML = `<footer class="footer">© <span id="year">${year}</span> Leback的逃生舱</footer>`;
  }
}
customElements.define('blog-footer', Footer);
