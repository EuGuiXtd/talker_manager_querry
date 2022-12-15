const fs = require('fs').promises;
const { join } = require('path');

const readTalkerFile = async () => {
  const path = './talker.json';
  try {
    const contentFile = await fs.readFile(join(__dirname, path), 'utf-8');
    return JSON.parse(contentFile);
  } catch (error) {
    return null;
  }
};

const getAllTalkers = async () => {
  const talkers = await readTalkerFile();
  return talkers;
};

const getTalkerById = async (id) => {
    const talkers = await readTalkerFile();
    return talkers.find((talker) => talker.id === id);
};

const writeTalkerFile = async (content) => {
    const path = './talker.json';
    await fs.writeFile(join(__dirname, path), JSON.stringify(content, null, 2));
  };

  const findTalkerByName = async (query) => {
    const talkers = await readTalkerFile();
    return talkers
      .filter((talker) => talker.name.toLowerCase().includes(query.toLowerCase()));
  };

module.exports = {
    getAllTalkers,
    getTalkerById,
    writeTalkerFile,
    findTalkerByName,
};