# Saito roadmap

WORK IN PROGRESS. MORE DETAIL WILL BE ADDED VERY SOON.

* Web 3 Grant
  * [W3 Open Grants Program - Saito Game Protocol and Engine](https://github.com/w3f/Open-Grants-Program/blob/master/applications/saito-game-protocol-and-engine.md)
  * The Polkadot ecosystem is full of opportunities and Saito can be leveraged to help facilitate easier and more decentralized/open infrastructure
* Swappable ERC20 Token
  * Early 2021 we will be offering a subset of the Saito Mainnet tokens in the form of swappable ERC20 tokens which will be swappable to Mainnet after launch
* API Version 1.0
  * Services Module
    * This will extend our Module functionality for Modules which provide some server-side functionality and also wish to be discoverable
    * Service Modules will also be able to inform service consumers of their interface through a standard API.
  * Peers Upgrades
    * The peering system will be extended to support local peers and the API will be cleaned up.
    * Local Peers will enable the Lite Client Modules system to be easily configured to work with an arbitrary Core.
  * API Formalization and documentation
    * The Modules API, Services API, Peers API, Wallet API, and other Core APIs will be defined and the existing blockchain will be wrapped in this new API. The REST API will get similar treatment.
  * Block and Transaction Validation Specification and Roadmap
    * The current Block and Transaction Validation rules will be formalized and documented. Additionally, we will plan for future forks when the data formats will be changed for the sake of speed and efficiency.
* Split NPM Core from Saito.io and Core Helper functions
  * The current monolithic library should be split into two to five npm modules. 1) The core which implements the blockchain. 2) A wallet module. 3) Helper functions for interacting with Saito 4) General helper functions 5) The javascript Modules framework.
* High performance implementation of Saito