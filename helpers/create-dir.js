const fs = require('fs').promises;

const isAccessible = path => {
  // проверяем: существуе, не существует
  return fs
    .access(path)
    .then(() => true) // существуе
    .catch(() => false); // произошла ошибка не существует
};

const createFolderIsNotExist = async folder => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder);
  }
};

module.exports = createFolderIsNotExist;
