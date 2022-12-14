const express = require('express');
const readTalker = require('./readTalker');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

function geraStringAleatoria(tamanho) {
  let stringAleatoria = '';
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < tamanho; i += 1) {
      stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return stringAleatoria;
}

function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (req, res) => {
  const talkers = await readTalker.getAllTalkers();
  return res.status(200).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = await readTalker.getTalkerById(Number(id));
  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  return res.status(200).json(talker);
});

app.post('/login', async (req, res) => { 
  const newTalker = { ...req.body };
  const talker = await readTalker.getAllTalkers(); talker.push(newTalker);
  if (!newTalker.email) { 
    return res.status(400)
  .json({ message: 'O campo "email" é obrigatório' }); 
} if (validateEmail(newTalker.email) === false) {
  return res.status(400)
   .json({ message: 'O "email" deve ter o formato "email@email.com"' }); 
 } if (!newTalker.password) {
  return res.status(400)
   .json({ message: 'O campo "password" é obrigatório' }); 
 } if (newTalker.password.length < 6) {
  return res.status(400)
   .json({ message: 'O "password" deve ter pelo menos 6 caracteres' }); 
 } return res.status(200).json({ token: geraStringAleatoria(16) });
});
