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

### APIs
* Login:
POST /auth/loginUserPassword -d {username:xxx, password:xxxx}

* User APIs:
GET  /user
POST /user/authenticate -d '{email: 'email',password:'XXXXXXXXXXXXXX'}'

* Products APIs:
POST / user -d ''