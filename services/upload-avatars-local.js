const { fs } = require('fs/promises');
const path = require('path');
const Jimp = require('jimp');
const createFolderIsNotExist = require('../helpers/create-dir');

class Upload {
  constructor(AVATARS_OF_USERS) {
    this.AVATARS_OF_USERS = AVATARS_OF_USERS;
  }

  async transformAvatar(pathFile) {
    const file = await Jimp.read(pathFile);
    await file
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE,
      )
      .writeAsync(pathFile);
  }

  async saveAvatarToStatic({ idUser, pathFile, name, oldFile }) {
    await this.transformAvatar(pathFile);
    const folderUserAvatar = path.join(this.AVATARS_OF_USERS, idUser); // Подготовить папку, где будут вкладываться аватарки
    await createFolderIsNotExist(folderUserAvatar); // если папки нет создаём
    await fs.rename(pathFile, path.join(folderUserAvatar, name)); // переносим из папаки tmp в папку avatars
    await this.deleteOldAvatar(
      path.join(process.cwd(), this.AVATARS_OF_USERS, oldFile), // удаляем если в папке avatars уже есть старые аватарки
    );
    const avatarURL = path.normalize(path.join(idUser, name)); // создаём аватарUrl
    return avatarURL;
  }

  async deleteOldAvatar(pathFile) {
    try {
      await fs.unlink(pathFile);
    } catch (error) {
      console.error(error.message);
    }
  }
}

module.exports = Upload;
/*   try {
      await fs.unlink(path.join('/public', this.AVATARS_OF_USERS, oldFile));
    } catch (e) {
      console.log(e.message);
    } */
