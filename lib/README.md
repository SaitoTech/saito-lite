# saito-lib

saito-lib is a Javascript library that allows developers to connect their Javscript application to the Saito blockchain.

## Installation
Add `saito-lib` as a Javascript to your node_modules using the following command:
```
npm install saito-lib --save
```

## Getting Started
On startup, instantiate a Saito instance and connect to the chain via a full node of your own choosing:

```javascript
import { Saito } from 'saito-lib';

const saito = new Saito({
  peers: [{
    host: "apps.saito.network",
    port: 443,
    protocol: "https",
    synctype: "lite"
  }]
});
```

The configuration passed to Saito is what will be used as your `options` file. You can pass in any fields that exist for the standard Saito options file:

You can add manually add keys to your wallet on instantiation:

```javascript
const saito = new Saito({
  peers: [{
    host: "apps.saito.network",
    port: 443,
    protocol: "https",
    synctype: "lite"
  }],
  wallet: {
    privatekey: "5e8aaab4c1551f0145adf9dd790ae03ba2b01e3563dd1713775639ed8ab4a295",
    publickey: "mn2u1muJVEeJfmcKcqfXVEAFam4JQ11yYx8YzCFskkeP"
  },
});
```

## Usable Actions
To see the list of functions that are available, checkout the [existing documentation](https://saitotech.github.io/saito). We'll give a quick example of creating and propagating a transaction with data here:

```javascript
var newtx = saito.wallet.createUnsignedTransaction(address, amount, fee);

newtx.transaction.msg = Object.assign({}, { module: "OurModule" });

newtx = saito.wallet.signTransaction(newtx);

saito.network.propagateTransactionWithCallback(newtx, () => {
	if (this.app.BROWSER) {
		alert("your message was propagated")
	}
});
```