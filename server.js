const express = require('express');
const path = require('path');

const app = express();

// Middleware CSP com ajustes para permitir imagens, scripts inline, e conexões externas
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " + // permite imagens base64 e externas
    "script-src 'self' 'unsafe-inline'; " + // permite execução de eventos inline (como onclick)
    "connect-src 'self' https://apptite-back-6b87ad4804d1.herokuapp.com;"
  );
  next();
});

app.use(express.static(path.join(__dirname, 'dist/apptite-front/browser')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/apptite-front/browser/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});