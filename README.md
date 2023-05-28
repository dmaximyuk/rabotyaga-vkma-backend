# Pre-install

Choose node version

```bash
$ node -v
$ 16.18.0
```

Choose yarn or npm version.

Npm

```bash
$ npm -v
$ 8.19.2
```

Yarn

```bash
$ yarn -v
$ 1.22.19
```

# Install

Install packages.

```bash
$ npm i # or
$ yarn
```

# Run project.

Server

```bash
$ npm run start:dev # or
$ yarn run start:dev
```

Production

```bash
$ npm run build
$ npm run start #or

$ yarn run build
$ yarn run start
```

# Configure `.env`

Create `.env` file in project and paste code in to file:

```bash
PORT = 3000 # use your port, recommended: 3001 or 16888.
APP_KEY = "test" # app secret key
CODE_ERROR_AUTH = 401 # code error
CODE_ERROR_EVENT = 404 # code error
```
