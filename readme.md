## GoIT Node.js Course Template Homework

- npm init -y
- npm i
- npm i express -DE
- npm i nodemon -DE (Он позволяет выполнять live reload сервера при разработке.)
- npm i uuid (генерация уникального id )
- npm i morgan (для протоколирования запросов)
- npm install lowdb (создаёт базу данных в json файле (как lodash))
- npm install dotenv ( локальные переменные из файла .env (защита секретных
  ключей))
- npm install cors (Механизм CORS делает безопасные перекрестные запросы и
  передачи данных между web-браузерами и web-серверами)
- npm i got dotenv -E ()
- npm i eslint-config-prettier ( дружба lintrc+prittierrc)
- npm i eslint-plugin-json
- npm install joi (валидация)
- npm install mongoose -S ( служит удобным средством для применения
  структурированной схемы к коллекции в MongoDB. )
- npm install passport (библиотека предоставляет 500 механизмов аутентификация)

* npm install passport-jwt (валидирует jwt токены)
* npm i jsonwebtoken (создаёт токены)
* npm i bcryptjs (шифровать пороль(хеш))
* npm install mongoose-paginate-v2
* npm i express-query-boolean
* npm i helmet ()
* npm install --save multer
* npm i jimp
* npm install --save-dev jest ( unit-тесты)
* npm install supertest --save-dev (для тестирования HTTP, позволяет запускать и
  проверять)

* npm install nodemailer @sendgrid
* npm i nanoid
* npm install mailgen --save (генерация писем) ---cloudflare защита от dos-отак,
  когда много обращений(1-сайт)

- в файле .eslintrc.js: extends: ['standard', 'plugin:json/recommended',
  'prettier']
- в файле package.json: "lint": "eslint **/\*.{js,json}", "lint:fix":
  "eslint--fix **/\*.{js,json}"
- файл .prettierrc.json Выполните форк этого репозитория для выполнения домашних
  заданий (2-6) Форк создаст репозиторий на вашем http://github.com

Добавьте ментора в коллаборацию

Для каждой домашней работы создавайте свою ветку.

- hw02
- hw03
- hw04
- hw05
- hw06

Каждая новая ветка для дз должна делаться с master

После того как вы закончили выполнять домашнее задание в своей ветке, необходимо
сделать пулл-реквест (PR). Потом добавить ментора для ревью кода. Только после
того как ментор заапрувит PR, вы можете выполнить мердж ветки с домашним
заданием в мастер.

Внимательно читайте комментарии ментора. Исправьте замечания и сделайте коммит в
ветке с домашним заданием. Изменения подтянуться в PR автоматически после того
как вы отправите коммит с исправлениями на github После исправления снова
добавьте ментора на ревью кода.

- При сдаче домашней работы есть ссылка на PR
- JS-код чистый и понятный, для форматирования используется Prettier

### Команды:

- `npm start` &mdash; старт сервера в режиме production
- `npm run start:dev` &mdash; старт сервера в режиме разработки (development)
- `npm run lint` &mdash; запустить выполнение проверки кода с eslint, необходимо
  выполнять перед каждым PR и исправлять все ошибки линтера
- `npm lint:fix` &mdash; та же проверка линтера, но с автоматическими
  исправлениями простых ошибок
