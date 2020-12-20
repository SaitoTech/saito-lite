const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const { Keyring, decodeAddress, encodeAddress, createPair } = require('@polkadot/keyring');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { TypeRegistry } = require('@polkadot/types');
const { randomBytes } = require('crypto');
const EventEmitter = require('events');
// const { createSignedTx, createSigningPayload, methods } = require('@substrate/txwrapper')

function rpcToNode(method, params = []) {
  return fetch("http://178.128.181.212:9933", {
    body: JSON.stringify({
      "jsonrpc": "2.0",
      "method": method,
      "params": params,
      "id": 1
  }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
  .then((response) => {
    return response.json();
  })
  .then(({ error, result }) => {
    if (error) {
      throw new Error(
        `${error.code} ${error.message}: ${JSON.stringify(error.data)}`
      );
    }
    return result;
  });
}
// A Module to support KSM, DOT, or any other Substrate-based crypto
// TODO subscribe to and fire balance_change events in the eventEmitter
// TODO support of setting confirmations
// TODO esitmate fees
class WestieCryptoServer extends ModTemplate {
  constructor(app) {
    super(app);
    this.ticker = "WESTIER";
    this.name = 'WestieCryptoServer';
    this.description = 'Polkadot at Saito Endpoint';
    this.categories = "Cryptocurrency";
    this.app = app;
    this.endpoint = "ws://178.128.181.212:9932";
    this._api = null; // treat as private, please use getApi to access
    this.optionsStorage = {};
    this.keypair = null;
    this.keyring = null;
    this.dotcryptomod = null;
    // TODO: pendingtx only supports on user at a time!! We need to have a map
    // of these for each user!!
    this.pendingTx = null;
    this.unsigned = null;
  }
  async initialize(app) {
    this.load();
    if (!app.BROWSER) {
      const wsProvider = new WsProvider(this.endpoint);
      this._api = new ApiPromise({ provider: wsProvider });
      this._api.on('connected', (stream) => {
        console.log(this.description + ' WestieCryptoServer Socket Provider connected');
      });
      this._api.on('disconnected', (stream) => {
        console.log(this.description + ' WestieCryptoServer Socket Provider disconnected');
      });
      this._api.on('ready', (stream) => {
        console.log(this.description + ' WestieCryptoServer Socket Provider ready');
      });
      this._api.on('error', (stream) => {
        console.log(this.description + ' WestieCryptoServer Socket Provider error');
      });
    }
  }
  respondTo(type = "") {
    return null;
  }
  async onConfirmation(blk, tx, conf, app) {
    if (conf == 0 && !app.BROWSER) {
      let authorizationTime = Date.now() + 24*60*1000;
      this.optionsStorage[tx.transaction.from[0].add] = authorizationTime;
      this.save();
    }
  }
  save() {
    let moduleOptions = this.app.storage.getModuleOptionsByName(this.name);
    moduleOptions.storage = this.optionsStorage;
    this.app.storage.saveOptions();
  }
  load() {
    // TODO: replace this with an actual database
    let moduleOptions = this.app.storage.getModuleOptionsByName(this.name);
    if(moduleOptions) {
      if(!moduleOptions.storage) {
        moduleOptions.storage = {};
        this.save();
      }
      this.optionsStorage = moduleOptions.storage;
    } else {
      throw "Module Not Installed: " + this.name;
    }
  }
  
  async getApi() {
    await this._api.isReady;
    return this._api;
  }
  webServer(app, expressapp, express) {
    super.webServer(app, expressapp, express);
    expressapp.get("/" + this.name + "/getbalance/:address/:sig", async (req, res) => {
      console.log("GET /" + this.name + "/getbalance/:address/:sig");
      // TODO: Authorize the signature!
      if (req.params.address == null) {
        //TODO: send a 403 or w/e
        return;
      }
      if (req.params.sig == null) {
        //TODO: send a 403 or w/e
        return;
      }
      let api = await this.getApi();
      const { nonce, data: balance } = await api.query.system.account(req.params.address);
      res.status(200);
      res.write(JSON.stringify({balance: balance.free }));
      res.end();
    });
    expressapp.get("/" + this.name + "/buildtx/:from/:to/:amount", async (req, res) => {
      console.log("GET /" + this.name + "/buildtx");
      
      
      // const unsigned = methods.balance.transfer(
      //   {
      //     dest: req.params.from,
      //     value: req.params.amount,
      //   },
      //   {
      //     // Additional information needed to construct the transaction offline.
      //   }
      // );
      // 
      let api = await this.getApi();
      this.pendingTx = await api.tx.balances.transfer(req.params.to, req.params.howMuch);
      //console.log(this.pendingTx);
      const { nonce, data: balance } = await api.query.system.account(req.params.from);
      
      const registry = new TypeRegistry();
      const WESTEND_SS58_FORMAT = 42;
      const { block } = await rpcToNode('chain_getBlock');
      const blockHash = await rpcToNode('chain_getBlockHash');
      const genesisHash = await rpcToNode('chain_getBlockHash', [0]);
      const metadataRpc = await rpcToNode('state_getMetadata');
      const { specVersion, transactionVersion } = await rpcToNode(
        'state_getRuntimeVersion'
      );
      const runtimeVersion = (await api._rpc.state.getRuntimeVersion());
      console.log("ENDPOINT INFO");
      console.log(nonce);
      console.log(blockHash);
      console.log(genesisHash);
      
      console.log(specVersion);
      console.log(transactionVersion);
      console.log(runtimeVersion.specVersion);
      console.log(api.extrinsicVersion);
      
      //req.params.to
      //req.params.amount
      // this.unsigned = methods.balances.transfer(
      //   {
      //     value: 12,
      //     dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', // Bob
      //   },
      //   {
      //     address: deriveAddress(alice.publicKey, WESTEND_SS58_FORMAT),
      //     blockHash,
      //     blockNumber: registry
      //       .createType('BlockNumber', block.header.number)
      //       .toNumber(),
      //     eraPeriod: 64,
      //     genesisHash,
      //     metadataRpc,
      //     nonce: 0, // Assuming this is Alice's first tx on the chain
      //     specVersion,
      //     tip: 0,
      //     transactionVersion,
      //   },
      //   {
      //     metadataRpc,
      //     registry,
      //   }
      // );
      // const signingPayload = createSigningPayload(unsigned, {
      //   registry,
      // });
      // 
      //SignerPayloadJSON
      // this.pendingSignable = api.createType('SignerPayload', {
      //   method: this.pendingTx,
      //   nonce,
      //   genesisHash: genesisHash,
      //   blockHash: genesisHash,
      //   specVersion: specVersion,
      //   version: api.extrinsicVersion
      // });
      // this.pendingExtrinsicPayload = api.createType('ExtrinsicPayload', this.pendingSignable.toPayload(), { version: api.extrinsicVersion });
      
      
      // this.pendingExtrinsicPayload = api.createType('ExtrinsicPayload', {
      //   method: this.pendingTx.toHex(),
      //   // era: ... // mortal era or empty for immortal
      //   nonce: nonce, // nonce for the acocunt
      //   // tip: ... // any tip (leave empty for 0)
      //   specVersion: specVersion,
      //   genesisHash: genesisHash,
      //   blockHash: genesisHash
      // }, { version: 4 });
      this.pendingExtrinsicPayload = api.createType('ExtrinsicPayload', {
        address: req.params.from,
        method: this.pendingTx.toHex(),
        nonce: nonce,
        specVersion: specVersion,
        genesisHash: genesisHash,
        blockHash: genesisHash
      }, { version: 4 });
      // console.log(api.runtimeVersion.specVersion);
      // this.pendingExtrinsicPayload = api.createType('ExtrinsicPayload', {
      //   method: this.pendingTx.toHex(),
      //   nonce: nonce,
      //   specVersion: api.runtimeVersion.specVersion,
      //   genesisHash: api.genesisHash,
      //   blockHash: api.genesisHash
      // }, { version: 4 });
      
      const hexPayload = this.pendingExtrinsicPayload.toHex();
      console.log(hexPayload);
      res.status(200);
      res.write(JSON.stringify({hexPayload: hexPayload}));
      res.end();
    });
    
    expressapp.get("/" + this.name + "/send/:from/:signature", async (req, res) => {
      console.log("GET /" + this.name + "/send");
      console.log(req.params.from);
      console.log(req.params.signature);
      try {
        // const address = this.keypair.address;
        //console.log("addSignature");
        //this.pendingTx.addSignature(req.params.from, req.params.signature, this.pendingExtrinsicPayload);
        //tx.addSignature(address, sigHex, payload);
        
        //console.log("send/...");
        // // send the transaction now that is is signed
        this.pendingTx.addSignature(req.params.from, req.params.signature, this.pendingExtrinsicPayload);
        const hash = await this.pendingTx.send();
        
        // const registry = new TypeRegistry();
        // const metadataRpc = await rpcToNode('state_getMetadata');
        // const tx = createSignedTx(this.unsigned, signature, { metadataRpc, registry });
        // const actualTxHash = await rpcToNode('author_submitExtrinsic', [tx]);
        console.log("result");
        console.log(actualTxHash);
        res.status(200);
        res.write(JSON.stringify({result: result }));
        res.end();
      } catch (error) {
        console.error(error);
      }
    });
  }
}
module.exports = WestieCryptoServer;