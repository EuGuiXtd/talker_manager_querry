const express = require('express');
const readTalker = require('./readTalker');
const validaEmail = require('./middlewares/validaEmail');
const validaSenha = require('./middlewares/validaSenha');
const validaToken = require('./middlewares/validaToken');
const validaNome = require('./middlewares/validaNome');
const validaIdade = require('./middlewares/validaIdade');
const validaTalk = require('./middlewares/validaTalk');
const validawatchedAt = require('./middlewares/validawatchedAt');
const validaRate = require('./middlewares/validaRate');

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

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker/search',
validaToken,  
async (req, res) => {
  const { q } = req.query;
  const talker = await readTalker.findTalkerByName(q);
  if (q === undefined) {
    return res.status(200);
  }
  return res.status(talker.length === 0 ? 200 : 200).json(talker);
});

app.post('/talker', 
validaToken, 
validaNome,
validaIdade,
validaTalk,
validawatchedAt,
validaRate,
 async (req, res) => { 
  const talker = await readTalker.getAllTalkers(); 
  const newTalker = { id: talker.length + 1, ...req.body }; 
  talker.push(newTalker);
  await readTalker.writeTalkerFile(talker); 
  return res.status(201).json(newTalker);
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

app.post('/login', validaEmail, validaSenha, async (req, res) => { 
  const newTalker = { ...req.body };
  const talker = await readTalker.getAllTalkers(); talker.push(newTalker);
  return res.status(200).json({ token: geraStringAleatoria(16) });
});

app.put('/talker/:id',
validaToken,
validaNome,
validaIdade,
validaTalk,
validawatchedAt,
validaRate, 
async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const { watchedAt, rate } = talk;

  const talker = await readTalker.getAllTalkers();
  const updateTalker = talker.find((x) => x.id === Number(id));

  updateTalker.name = name;
  updateTalker.age = age;
  updateTalker.talk.watchedAt = watchedAt;
  updateTalker.talk.rate = rate;
  await readTalker.writeTalkerFile(talker); 
  return res.status(200).json(updateTalker);
});

app.delete('/talker/:id',
validaToken, 
async (req, res) => {
  const { id } = req.params;
  const talker = await readTalker.getAllTalkers();
  const arrayPosition = talker.findIndex((x) => x.id === Number(id));
  talker.splice(arrayPosition, 1);

  await readTalker.writeTalkerFile(talker);
  return res.status(204).json(talker);
});
