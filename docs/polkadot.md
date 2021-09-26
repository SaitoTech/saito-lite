# Cryptocurrency Integration

## Introduction

Saito makes it possible to write applications that use other blockchains. You can code a game that requires a payment to be made in another cryptocurrency, for instance, or a wallet-plugin that lets you send and receive transactions. Saito does this by supprting third-party "cryptocurrency modules" that provides a bridge to other networks.

In order to use another cryptocurrency with Saito applications, users need to have the appropriate module installed in their Saito wallet. As a member of the Polkadot community, Saito comes by default with bundles that provide support for Polkadot (DOT), Kusama (KSM) and other substrate-based networks. Modules can easily be built that support for other networks too -- if you are a developer interested in getting your favourite cryptocurrency supported get in touch!


## What Can You Build

There are two basic types of applications you can build:

Applications that require a specific cryptocurrency. See an example of our Polkadot application tutorial (we build a simple application that sends and receives DOT transactions) for sample code showing how to do this.

Applications that work with whatever cryptocurrency users prefer to use. An example of this is the Poker game that runs in the Saito Arcade. Our Saito Game Engine is also written to be cryptocurrency-agnostic: as soon as a module is available for some cryptocurrency all of the games in the Arcade will instantly support it.


## Using Cryptocurrencies within Saito Applications

The Saito Wallet provides the core interface for dealing with Cryptocurrency Modules. It allows users to set a "preferred cryptocurrency" and fetch that module. Requests to the other network can then be sent through a standard set of functions which are defined in all cryptocurrency modules.

```
let cryptoMod = app.wallet.returnPreferredCrypto();

cryptoMod.returnBalance();
cryptoMod.returnAddress();
cryptoMod.transfer(howMuch, toAddress);
```

Documentation on the functions available within each Cryptocurrency Module is available here. It is not necessary to deal directly with cryptocurrency modules in order to send-or-receive transactions. Requests can also be made directly through the Saito wallet, which provides several functions that simplify interactions with external blockchains:

```
app.wallet.returnBalance();
app.wallet.returnPublicKey();
async app.wallet.sendPayment(senders=[], receivers=[], amounts=[], timestamp, mycallback, ticker);
async app.wallet.receivePayment(senders=[], receivers=[], amounts=[], timestamp, mycallback, ticker, tries=36, pollWaitTime=5000);
async app.wallet.returnPreferredCryptoBalances(addresses=[], mycallback=null, ticker="") {

Documentation on these wallet-level functions is available here. We recommend those interested in coding actual applications that use these various approaches to consult this tutorial code for a sense of how these features can be integrated with other applications. See also the Saito Game Engine (in particularly the SEND / RECEIVE commands) for an example of how to programmatically integrate Saito wallet-layer functionality with UI elements that process while sending and receive transactions.


## How to Build a Cryptocurrency Module

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
