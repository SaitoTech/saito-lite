# Saito Roadmap

This document is a WORK IN PROGRESS. It exists to signal major directions in the development of the Saito project, and communicate.


* __Web 3 Applications__
  * [W3 Open Grants Program - Saito Game Protocol and Engine](https://github.com/w3f/Open-Grants-Program/blob/master/applications/saito-game-protocol-and-engine.md)
  * The Polkadot ecosystem is full of opportunities and Saito can be leveraged to help facilitate easier and more decentralized/open infrastructure. We are working to bring the Saito application platform to the world of Polkadot parachains.
  * Particular emphasis on gaming applications that leverage the strengths and interests of our existing Saito community


* __Network Token__
  * Early 2021 we will be offering a portion of Saito Mainnet tokens for sale in the form of swappable on-chain asset. These tokens will be withdrawable to the live Saito network at any point in time.



* __API Version 1.0__
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


* __High performance implementation of Saito__
  * RUST client 
    * elimination of string processing, JSON parsing, binary block format
    * parallelizing processing of block and UTXO data across multiple threads
    * Google Dense Hashmap for UTXO slip management


* __Advertising Model__ 
  * supporting the private sector in creating an advertising revenue model for users, so as to create a dynamic and virtuous cycle permitting free-use of Saito for most average users and creating a revenue model capable of paying for critical infrastructure for both Saito as well as other networks



