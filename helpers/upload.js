const multer = require('multer');
const path = require('path');
require('dotenv').config();

const UPLOAD_DIR = path.join(process.cwd(), process.env.UPLOAD_DIR);
// const UPLOAD_DIR = process.env.UPLOAD_DIR;

const storage = multer.diskStorage({
  // память создаём для диска
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR); // указали в какую папку положить
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now().toString()}-${file.originalname}`); // указали как назвать, изменили
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.includes('image')) {
      const error = new Error('Bla bla');
      error.status = 400;
      cb(error);
      return;
    }

    // Чтобы принять файл, используется как аргумент `true` таким образом:
    cb(null, true);

    // Вы можете всегда вернуть ошибку, если что-то пошло не так:
    // cb(new Error("I don't have a clue!"));
  },
});

module.exports = upload;
