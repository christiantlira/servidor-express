const express = require('express');
const crypto = require('crypto'); // Módulo nativo para aleatoriedade
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Gerador de dados fictícios melhorado
function gerarUsuarioFicticio() {
  const nomes = [
    'João Silva', 'Maria Oliveira', 'Carlos Souza', 
    'Ana Santos', 'Pedro Rocha', 'Juliana Lima',
    'Fernando Costa', 'Camila Almeida', 'Ricardo Teixeira'
  ];
  
  const dominios = [
    'gmail.com', 'hotmail.com', 'outlook.com',
    'yahoo.com', 'protonmail.com', 'empresa.com.br'
  ];

  // Gera 4 bytes aleatórios (mais eficiente que Math.random())
  const randBuffer = crypto.randomBytes(4);
  const randNumber = randBuffer.readUInt32BE(0);

  // Seleciona nome e domínio baseado nos bytes aleatórios
  const nome = nomes[randNumber % nomes.length];
  const dominio = dominios[(randNumber >> 8) % dominios.length];
  
  // Formata e-mail (substitui espaços por pontos)
  const email = `${nome.toLowerCase().replace(/\s+/g, '.')}@${dominio}`;
  
  // Idade entre 18 e 67 anos
  const idade = (randNumber >> 16) % 50 + 18;

  return { nome, email, idade };
}

// Rota GET para /usuario
app.get('/usuario', (req, res) => {
  res.json(gerarUsuarioFicticio());
});

// Rota raiz com instruções
app.get('/', (req, res) => {
  res.json({
    mensagem: 'Bem-vindo à API de usuários fictícios!',
    rotas: {
      usuario: '/usuario - Retorna um usuário aleatório'
    }
  });
});

// Rota para caso de 404 (não encontrado)
app.use((req, res) => {
  res.status(404).json({ 
    mensagem: 'Rota não encontrada',
    sugestao: 'Acesse /usuario para obter dados fictícios'
  });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    mensagem: 'Erro interno do servidor',
    detalhes: process.env.NODE_ENV === 'development' ? err.message : 'Ocorreu um erro inesperado'
  });
});

app.listen(PORT, () => {
  console.log(`\nServidor rodando em http://localhost:${PORT}`);
  console.log(`Teste a rota: http://localhost:${PORT}/usuario\n`);
});