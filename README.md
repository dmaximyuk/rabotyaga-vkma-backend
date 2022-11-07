# Pre-install
Choose node version
> node -v <br/>
> 16.18.0 <br/>

Choose yarn or npm  version.

Npm
> npm -v <br/>
> 8.19.2 <br/>

Yarn
> yarn -v <br/>
> 1.22.19 <br/>

# Install
Install packages.
```bash
npm i # or
yarn
```
# Run project.
Server
```bash
npm run serve # or
yarn run serve
```
Production
```bash
npm run build
npm run start #or

yarn run build
yarn run serve
```

# Configure ```.env```
Create ```.env``` file in project and paste code in to file:
```bash
PORT=11111 # use your port, recommended: 3001 or 16888.
TOKEN=qwerty11111 # token vk-api
SECRET_KEY_VKMA=eW5uzM9637VMvrB5HmNC # vkma secret key

process.env.TS_NODE_PROJECT=./tsconfig.json # NOT CHANGE, is absolute path
```