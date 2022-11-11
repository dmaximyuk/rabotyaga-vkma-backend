# Pre-install
Choose node version
```bash
$ node -v
$ 16.18.0
```

Choose yarn or npm  version.

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

# Configure ```.env```
Create ```.env``` file in project and paste code in to file:
```bash
PORT=11111 # use your port, recommended: 3001 or 16888.
TOKEN=qwerty11111 # token vk-api
SECRET_KEY_VKMA=eW5uzM9637VMvrB5HmNC # vkma secret key
```