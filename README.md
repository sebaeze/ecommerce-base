### mini e-commerce backend

### Instalar localmente
git clone
npm install
npm install -D parcel-bundler babel-preset-react babel-preset-env

### Ejecutar localmente
parcel ./src/index.html
o
npm run dev

### Build y Start
npm run build && npm start

### NoSql database: CloudAnt
Set up credential in environment variable: process.env.CLOUDANT_CREDENTIALS
or
In the file ./dev/cloudantCredentials.json for dev environment

### APIs
* Auth:
POST /auth/loginUserPassword -d {username:xxx, password:xxxx}
GET  /auth/mercadolibre
GET  /auth/google
GET  /auth/facebook

* User APIs:
GET  /user
POST /user/authenticate -d '{email: 'email',password:'XXXXXXXXXXXXXX'}'

* Products APIs:
POST / user -d ''