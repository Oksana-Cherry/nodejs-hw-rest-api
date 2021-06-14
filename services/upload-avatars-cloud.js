const fs = require('fs/promises');

class Upload {
  constructor(uploadCloud) {
    this.uploadCloud = uploadCloud;
  }

  // secure_url
  // public_id называем iserIdImg

  async saveAvatarToCloud(pathFile, userIdImg) {
    const { public_id: publicId, secure_url: secureUrl } =
      await this.uploadCloud(pathFile, {
        public_id: userIdImg?.replace('Photo/', ''),
        folder: 'Photo',
        transformation: { width: 250, crop: 'pad' },
      });
    await this.deleteTemporyFile(pathFile);
    return { userIdImg: publicId, avatarURL: secureUrl };
  }

  async deleteTemporyFile(pathFile) {
    try {
      await fs.unlink(pathFile);
    } catch (error) {
      console.error(error.message);
    }
  }
}

module.exports = Upload;
