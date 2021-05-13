# Welcome to Saito

Saito is a **Tier 1 Blockchain Protocol** that provides **high throughput**. The network accomplishes this with a consensus mechanism that pays the ISPs in the network instead of miners and stakers. The technical solution unleashes a distributed, global PKI layer.

If you need to get in touch with us, please reach out anytime.

The Saito Team
info@saito.tech

## Table of Content

-   [Preamble](#Preamble)
-   [How To Use Saito](#How-To-Use-Saito)
-   [Getting Started](#Getting-Started)
-   [The Consensus Mechanism](#The-Concensus-Mechanism)
-   [Contact](#Contact)

## APIs

-   [REST API](docs/restapi.md)
-   [Application/Module Protocol](docs/applications.md)
-   [Application/Module Events Protocol](docs/events.md)
-   [Application/Module Context API](docs/appcontext.md)
-   [Services](docs/services.md)

## Other Documentation

-   [Roadmap](docs/roadmap.md)
-   [Block and Transaction Validation](docs/validation.md)
-   [JSDoc](https://saitotech.github.io/saito-lite/index.html)

## Web3 Grant and Polkadot Integration

-   [Web3 Game Protocol and Engine Grant](https://github.com/w3f/Open-Grants-Program/blob/master/applications/saito-game-protocol-and-engine.md)
-   [Polkadot Integration](docs/polkadot.md)

# Preamble

Saito is a simple and elegant system. The consensus mechanism provides economic security without the need for external markets or complicated governance structures.

Building on Saito is also very simple. From the perspective of an DAPP developer, all that really needs to be understood is that the chain contains a UTXO set representing a ledger of Saito payments (similar to Bitcoin). Applications install into the wallets of end-users. These applications can attach data to transactions and broadcast them to each other over the network. The Saito application layer describes how to build applications that do this. The Saito network documentation describes the underlying mechanism that powers the blockchain layer.

Before working with this repository it may be helpful to get some perspective on the Saito roadmap and what you can expect at this point.

If you're interested in developing DAPPs on top of Saito, that's all you really need to know. However, we've included a description of the consensus mechanism here because it is an important piece of the protocol and many people reading this document will need to know the details. If you're interested in the core advances Saito makes and in helping to develop the core blockchain, please also see our roadmap doc and reach out anytime with questions or suggestions.

# How To Use Saito

The Reference Implementation of Saito is written in NodeJS. Developers can get started by cloning the repo and running a local node which can serve applications directly to your browser. Once your application is developed you may publish it to the network. When you are ready to deploy a live application see our tutorial on [deploying applications to the network](http://org.saito.tech/tutorial-1-deploy-a-new-application/).

## System Preparation

Saito requires a rececent version of NodeJS (>= 12). You can install this as follows:

### Linux

```
apt update
apt upgrade
apt install npm
```

### Mac / Windows / Other

System-specific installation instructions are available on the [official NodeJS website](https://nodejs.org/en/).

## Install Saito and Start a Node

Clone the Saito software directory and through a Bash shell start-up an instance of Saito as follows:

```
git clone https://github.com/saitotech/saito-lite
cd saito-lite
npm install
npm run nuke
npm start
```

The system will be started in 'local' or 'development' mode with a default set of modules responding on port 12101.

Once Saito is running you can test that it is working by visiting `http://localhost:12101/wallet` in your browser. Saito applications look and feel like websites. They are not -- applications run directly inside your browser and connect with blockchain access-points to send and receive data. Our default installation includes a default set of modules (applications). You can change which modules are installed by editing the file `/config/modules.config.js` to include them. Modules are installed by default in the `/mods` directory.

## Building Applications

A tutorial series that will get you started building applications can be found in our list of [online developer tutorials](http://org.saito.tech/introduction-to-saito-development).

Details on the API used by Saito modules can be found in our [Applications documentation in the /docs directory](docs/applications.md).

Developers may also build applications that integrate directly with the blockchain-layer REST API described below. Tools to assist with this will be coming shortly.

## Installing Applications and Running:

Once you have developed an application, see our [online developer tutorials](http://org.saito.tech/introduction-to-saito-development) for information on how to publish it into the live network and get it hosted on the Saito AppStore for other users and developers to install.

If you wish to install your module locally for testing, put it into the `/mods` directory and add it to both the `core` and `lite` sections of your `/config/modules.config.js` file. Then run this command:

```
npm run compile dev
```

This command will compile the codebase into a javascript payload which can be delivered to browsers. The payload will saved as the `/web/saito/saito.js` file and can be loaded by any page you wish to author. As a convenience, the Saito Application/Module platform will automatically serve web requests if configured correctly, making it quite simple to get started making DAPPs in the browser.

# The Consensus Mechanism

Saito Protocol creates a network similar to Bitcoin. As an economically self-sufficient network, Saito manages a token which is collected from user fees and paid out to the nodes which run the protocol. This reward incentivize nodes to run the protocol and ensures it is always profitable to participate in the network. Saito differs from a typical Proof-of-Work chain in several ways:

## 1) Automatic Transaction Rebroadcasting

Saito's Blockchain has a pruning mechanism that charges rent to transactions which wish to stay on the blockchain. This allows the network to prune old blocks and retain only the header-hash to prove connection with the original genesis block. In addition to giving users full control over how long their data must be hosted and distributed by the network, this approach lowers the cost of using the network for most web3 applications, which no longer need to pay for long-term data persistence.

After a number of blocks which we call the Genesis Period, UTXOs which are below the Rebroadcast Limit can be pruned from the chain. However, the consensus mechanism dictates that any UTXO with sufficient output to pay the Rebroadcast Fee(double the average fee per byte over the last N blocks) must be included in the next block, i.e. rebroadcasted. However, it is important to note that we do not envision this mechanism actually being used to keep UTXOs on the chain, it's primary purpose is to incentives wallets to consolidate their UTXOs in a more sensible manner.

## 2) Burn Fee and Golden Tickets

In other blockchains a single form of work governs who produces a block and who receives payment. The fees contained in a block are handed over to the producer of a block in order to avoid economic attacks on the payment faucet and ensure that the distribution of funds is fair.

In Saito these are split into two separate functions: the network has one algorithm for determining who has the right to produce a block, and a second algorithm for determining how much money that can collect from the publication of any block. Saito regulates both difficulty and payout to ensure the cost of producing a block is always higher than the amount of money any participant can collect from the network.

## 3) Burn Fee

Block production is made difficult by requiring nodes to collect a critical mass of "Routing Work". Nodes accomplish this by servicing users and collecting transactions from them in return. In order to be eligible for payment they must be in the chain of routing nodes that successfully route this transaction into a valid block.

The amount of Routing Work each transaction provides to each node is algorithmically derived from the fee embedded in the transaction modified downwards according to its position in the network. User-facing nodes on the outside of a routing path get more Routing Work from the same transaction than nodes which receive that transaction after several hops. The amount of Routing Work available to each additional node falls as the routing path increases, but the total amount of Routing Work contained in that transaction increases. At this time, the amount of Routing Work provided by a transaction is halved with each hop.

To produce blocks nodes must efficiently locate themselves at critical junctures with access to high-fee, low-hop transaction inflows. We call the amount of work they must gather to produce a valid block the Burn Fee. This Burn Fee is dynamic: it decreases logarithmically from the previous Block Time and will eventually fall to zero, at which point the cost of producing a valid block will fall to zero. When a block is produced, no payment is made to the block producer. They are eligible for payment as a routing node through the Golden Ticket mechanism described below.

## 4) Golden Tickets

Once a valid block is seen on the network, hashers begin trying to solve a hashing puzzle. We call this system the "Golden Ticket System" and the hashing puzzle the "Golden Ticket Puzzle". The network auto-adjusts hashing difficulty to keep the number of tickets produced constant(Currently 1 every 2 blocks). Any sufficiently difficult hash which passes this difficulty threshold constitutes a "Golden Ticket Solution". Golden Ticket solutions are broadcast to the network as a special transaction. If this transaction is included in the very next block we say that the Golden Ticket has been solved.

The Golden Ticket included in the subsequent block is used as a source of entropy to choose a winning Routing node from the list of Routing nodes which routed transactions contained in the previous block. The fees that were burned by the block producer producing the block are then revivified and split between the winning Routing node and the Hashing node that found the Golden Ticket solution.

To ensure that attackers cannot break either the Burn Fee or Golden Ticket mechanisms, Saito adds cryptographic signatures to the network layer of the blockchain. As each transaction is passed around the network, the cost of including it in a block increases. This cost is a claim on all of the fees included in the block. Honest nodes find this acceptable as they are accepting a reduced claim on a basket of fees paid by honest users. Attackers must accept a reduced claim on recapturing their own money.

The cost of attack becomes statistically negative in all situations.

The magic happens at the confluence of these two mechanisms:

-   The amount of Routing Work associated with a transaction increases as the transaction is routed(halved at each hop, same as the Golden Ticket chances).
-   A Routing Node's chance of winning the Golden Ticket is proportional to the amount of extra Routing Work it is adding to the transaction by signing and routing it.

## 5) Moving Beyond Majoritarian Attacks

Those interested in a visual introduction to how "routing work" and "claims-on-payment" are calculated can see our [Introduction to Saito Consensus](http://org.saito.tech/wp-content/uploads/2020/08/Saito-2020-Consensus-Mechanisms.pdf). Diagrams in that presentation show exactly how "routing work" is generated and what percentage claim of the block reward each node gets given its position in the network.

Saito's most valuable insight is that fee processing (i.e. the collection and sharing of fee-paying transasctions) can be used as difficulty function without the need to wash those fees through external markets subject to economic attack. Accomplishing this simply requires making it impossible for attackers to collect more money from the blockchain than they need to spend to produce the longest-chain.

The Golden Ticket system is by far the most difficult and valuable part of Saito's Consensus mechanism. Part of the confusion for most people new to Saito is that the "routing work" and "claims on payment" any transaction provides any node are separate figures derived by separate algorithms from the same transaction fee. As transactions pass around the network, the value of using those transactions to produce blocks shrinks, while the cost of doing so increases. Attackers who put honest transactions to their blocks must transfer income to the honest nodes in the network.

Don't be discouraged if this mechanism seems confusing at first. If you have questions, feel free to reach out. What's important to remember is that:

1. The value of a transaction for producing a block drops the more hops a node is from a user.

2. The amount of money a routing node can expect to get paid on their share of the overall work done by all routing nodes.

The Routing Work associated with a transaction is the sum of the Golden Ticket chances it has imparted to its Routers.

Stated one more way: A valid block can be formed at any time, but will only be profitable to its Routers when the total Burn Fee is offset by the amount of fees included by the transaction in the block. The contribution to Routing Work from a transaction is its fee. The Routing Work needed to include that transaction is increased each time it is routed through the network but the total Burn Fee needed for a given block is decreasing as the previous block gets further away in the past.

If you're still confused don't feel bad: most people have trouble wrapping their head around the mechanism the first time. We encourage those interested in exploring the intricacies of the mechanism to read the [Saito Whitepaper](https://saito.io/saito-whitepaper.pdf). In addition to providing more details on technical and economic implementation, our whitepaper explains how to secure this mechanism against sybil attacks, block-flooding (spam) attacks and more issues that commonly arise in POW and POS-class mechanisms.

# Contact

To connect to the Saito Network please contact us at:

-   network@saito.tech
-   [Discord](https://discord.gg/HjTFh9Tfec)
-   [Telegram](https://t.me/SaitoIO)
