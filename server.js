const express = require('express');
const path = require('path');

const app = express();

// Caminho para os arquivos da build
app.use(express.static(path.join(__dirname, 'dist/appetite-front')));

// Qualquer rota que não for encontrada, redireciona para index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/appetite-front/index.html'));
});

// Porta do Heroku ou 8080 localmente
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
