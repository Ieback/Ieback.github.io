const HTML_HEAD = ({ title } = {}) => `
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title + ' - Leback的逃生舱'}</title>
  <link rel="apple-touch-icon" sizes="180x180" href="/public/apple-touch-icon.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/public/apple-touch-icon-180x180.png">
  <link rel="icon" href="/public/favicon.png" type="image/x-icon" />
  <link rel="stylesheet" href="/style.css" />
  <script src="/templates/header.js"></script>
  <script src="/templates/footer.js"></script>
</head>`;


module.exports = { HTML_HEAD };