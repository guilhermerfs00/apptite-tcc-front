const express = require('express');
const path = require('path');

const app = express();

// Middleware para configurar CSP corretamente
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src https://fonts.gstatic.com; " +
    "connect-src 'self' https://apptite-back-6b87ad4804d1.herokuapp.com;"
  );
  next();
});

// Serve os arquivos estáticos do Angular
app.use(express.static(path.join(__dirname, 'dist/apptite-front/browser')));

// Rota fallback para SPA
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/apptite-front/browser/index.html'));
});

// Inicializa o servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
