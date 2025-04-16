const express = require('express');
const path = require('path');

const app = express();

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com"
  );
  next();
});

// 🚨 Ajuste aqui: use 'apptite-front' (sem o "e")
app.use(express.static(path.join(__dirname, 'dist/apptite-front')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/apptite-front/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
