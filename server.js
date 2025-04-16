const express = require('express');
const path = require('path');

const app = express();

// ✅ Adiciona cabeçalho CSP para liberar Google Fonts
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com"
  );
  next();
});

// ✅ Corrigido: caminho certo da build Angular
app.use(express.static(path.join(__dirname, 'dist/apptite-front')));

// ✅ Corrigido: rota fallback para SPA Angular
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/apptite-front/index.html'));
});

// Porta dinâmica para Heroku
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
