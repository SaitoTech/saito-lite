# Polkadot Integration

## Introduction

In order to facilitate integration with DOT and other Substrate-based tokens within the Polkadot ecosystem, Saito has developed a prototype of an Open Infrastructure-type Decentralized Service which is enabled by Saito's ability to serve as an Open PKI Infrastructure and Transport Layer.

The Saito Lite Client facilitates interoperability with any cryptocurrency by implementing a subclass of Modtemplate(i.e. a Module) called [AbstractCryptoModule](https://saito.io/docs/polkadot/AbstractCryptoModule.html)(see [Applications](https://github.com/SaitoTech/saito-lite/blob/master/docs/applications.md) for more details on the Modules system). By implementing an AbstractCryptoModule a DAPP author can enable their Module to be selected as the user's Preferred Cryptocurrency within the Lite Client and allow other DAPPs, such as games, to interact with a cryptocurrency through the AbstractCryptoModule interface.

The functions provided by the [Lite Client's Wallet API](https://saito.io/docs/polkadot/Wallet.html) will honor the user's Preferred Cryptocurrency, allowing a Saito DAPP to seamlessly change from one cryptocurrency to another.

## Working with Substrate-based cryptos

To work with Substrate-based cryptocurrencies, we've extended AbstractCryptoModule as SubstrateBasedCrypto which can be used to interact with Polkadot, Kusama, or Westend. Leveraging this class to interact with parachains in the future should be very straightforward.

This functionality represents the work described in [Milestone 1 of our Web3 Foundation grant](https://github.com/w3f/Open-Grants-Program/blob/master/applications/saito-game-protocol-and-engine.md).

## Tutorial

How to interact with DOT, Kusama, or Westend 

1) Get the crypto mod:
```
let cryptoMod = app.modules.returnModule(subPage);
```
OR
```
let cryptoMod = app.wallet.returnPreferredCrypto();
```
2) Do stuff:
```
cryptoMod.transfer(howMuch, toAddress);
...
cryptoMod.returnBalance();
...
cryptoMod.returnAddress();
...
cryptoMod.hasPayment(howMuch, from, to, timestamp)
```

## Architecture

For details of the architecture, see our [architecture document](https://github.com/SaitoTech/saito-lite/blob/master/docs/saito-dot-integration.pdf).

## Future Work

If a DAPP author also wishes to leverage Saito as an Open Infrastructure platform as well, all interactions with the cryptocurrency can be passed through Saito Transactions. This enables efficient distribution of the transactions to their endpoint services within the Saito Network and also allows the author to receive payment for access to the endpoints by requiring a micro-payment in Saito.

For anyone who wishes to leverage Saito as an Open Infrastructure platform, the previous work does not fully support this. We would suggest that implementing an API similar to the following might be a good starting point:

### SaitoAbstractEndpoint
**Call(methodName, callback, payload):**

Returns a promise which will resolve with the response.(i.e. is an async function).

Wraps a request to an endpoint. This can simply hit an endpoint directly, but will often wrap the request into a Saito Transaction to leverage Saito Open Infrastructure.

For example, a Saito Endpoint might implement calls like these:
```
Call(“GetBalance”, pubkey, callback)
Call(“BuildSignable”, {rawdata: ...}, callback)
Call(“BuildSignableBasicTx”, {to: …, amount: ...}, callback)
Call(“BroadcastTransaction”, {rawtx: …}, callback);
```

The Callable method names are at the discretion of the Saito Endpoint author and can wrap multiple calls to an endpoint. For example, to build a basic transfer transaction a Saito Endpoint Module may need to get both the balance and nonce for the sender, which may represent multiple calls to the actual endpoint.

An ETH-based SaitoEndpoint wrapping ETH might something like this:
Call(“eth_sendTransaction”,...”)
And
Call(“eth_getBalance”, …)
for consistency with the ETH ecosystem.

**CallStream(methodName, payload):**

Returns an Stream Object([https://www.npmjs.com/package/stream](https://www.npmjs.com/package/stream), [https://nodejs.org/api/stream.html](https://nodejs.org/api/stream.html))

Allows the user to keep a stream open the the Saito Endpoint for as long as it is authorized. The endpoint should close the connection automatically when authorization has ended.

Typically wraps a Websocket connection to the endpoint.

> *Note:*
>
> *If a Saito Endpoint author wishes to grant unlimited access to typical HTTP/REST endpoints for a given period of time it is recommended to create a call like Call(“RequestAuthorization”,...) and to add a signed challenge object to subsequent calls to the HTTP endpoints.*
> 
> *For example, if a user has been granted 24 hours of access to a call to something like OnBalanceChange, this could be authorized via Call(“RequestAuthorization”,{pubkey: myPubkey}). Once authorized, subsequent calls to the endpoint would sign dated challenge tokens from the endpoint in order to gain HTTP/REST-style access to those endpoints.*