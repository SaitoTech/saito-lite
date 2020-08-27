# Introduction

The Saito Game Engine is an open source game engine that uses cryptographic techniques to provide things like provably-fair deck shuffles, dice rolls and allows complex multiplayer games to be played in peer-to-peer fashion without the need for a central server.

In this tutorial we will create a basic Saito game module that does the following:

 - display a game board and game pieces
 - display a game log and user control menu
 - deal cards to players 
 - implement basic game rules
 - use the Saito Arcade

Before we get into the details of programming, however, I want to start with a quick overview of how Saito applications work, so it is more obvious why building games using a decentralized platforms like Saito matter and why we are developing this game engine. If you would like to jump directly to the programming bits, please just jump to Section 2.


## 1. Introduction to Saito

Saito is a blockchain that allows users to add data to transactions and broadcast them. Applications are modules that run on the computers of users and communicate with each other by sending data over the network (or in some cases off-chain). So the first thing to know is that when you play a game on the Saito Arcade, you are not actually using a website: your browser has started up a lite-client and is interacting directly with the blockchain and with its peers.

Programming a game means programming an application users install into their wallet/browser. And this is the most important difference between Saito and other systems: because the network is entirely open source, there is no central server that can limit what games are available, restrict who can play, or impose their own business model on publishers or players. As we shall see, it also means the programming model is not client-server but rather client-client.

This peer-to-peer design also enables anyone to add features to games and distribute their improvements. It is also possible to code new modules that add additional features to the underlying Saito wallet. So there are usually multiple ways to accomplish things. Programmers can build features into their games., Or they can design them to interact with other modules that perform specific functions. Bitcoin and Ethereum payment channels are trivial to get running atop Saito, for instance, so it is possible to use Saito to send and receive payments in other cryptocurrencies.

If you are interested in exploring which applications are available and getting a sense for how this works in practice, we recommend checking out the Saito Email (https://saito.io/email) application. Click on the "Settings" menu to see which applications are installed in your version of Saito by default. If you would like to install more, click on the "AppStore" sidebar (itself a distributed application) and you'll be able to see what new modules are available for install.

So what are Saito Games? Game modules are simply standard Saito modules that inherent from a special superclass. In addition to having all of the functionality of other Saito modules, they come with an extended set of features. Some handle displaying and interacting with the game board. Others manage user interface components. And some provide support for complex but extremely fundamental cryptoraphic-functions like:

1. provably fair gameplay
2. cryptographically-signed moves
3. deck shuffles and dice roles

Our hope for this game engine is not only that people find it useful. We also hope that as it grows it will help the gaming industry by supporting new business models that help publishers escape from an excessive dependence on closed platforms like Unity and Steam.


