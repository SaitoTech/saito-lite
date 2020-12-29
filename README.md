# Welcome to Saito

Please see the documents in the /docs directory for instructions on how to
install Saito, learn how the network works, or just get started building
applications on the network.

If you need to get in touch with us, please reach out anytime.

The Saito Team
info@saito.tech

## build (node version >= 12)

[Ubuntu 20.04]

### System Preparation

```
apt upate
apt upgrade
apt install npm
```

### Clone Repository

`git clone https://github.com/saitotech/saito-lite `

### Install Dependencies and Run

```
npm install
npm run compile
npm start
```

The system will be installed in 'local' or 'development' mode with a default set of modules responding on port 12101.

To connect to the Saito Network please contact us at:

- network@saito.tech
- [Discord](https://discord.gg/QjeXTC3)
- [Telegram](https://t.me/joinchat/BOSYOk_BR8HIqp-scldlEA)

## Linting

Only [code which has been added to be commited](https://github.com/okonet/lint-staged) will be linted.  
This will happen automatically via a [husky-commit hook](https://typicode.github.io/husky/#/?id=usage).

### Disable automatic linting

Using the `--no-verify` option will disable the linting:

```
git commit -m "yolo!" --no-verify
```

You can run it manually by running:

```
npx lint-staged
```

### Tools being used

- https://eslint.org  
  For linting JavaScript
- https://prettier.io  
  For linting JavaScript, HTML, json, markdown, ...
- https://github.com/okonet/lint-staged  
  Focus linting on staged files
- https://typicode.github.io/husky  
  Using git-hooks via npm-scripts

#### VSCode Extensions

- https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode  
  This extension will run prettier on "save file" automatically

- https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint  
  This extension will show eslint-issues withon vscode
