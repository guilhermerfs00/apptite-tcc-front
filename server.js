const express = require('express');
const path = require('path');
const helmet = require('helmet');
const app = express();

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
      "connect-src": ["'self'", "https://apptite-back-6b87ad4804d1.herokuapp.com"], // Libera chamadas ao backend
      "img-src": ["'self'", "data:"],
    },
  })
);

app.use(express.static(path.join(__dirname, 'dist/apptite-front/browser')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/apptite-front/browser/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});