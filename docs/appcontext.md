# Saito Application Context

The Saito Application Context is an object with some state and a number of helper functions that is passed around to most module methods which helps DAPP developers to interact with Saito.

TODO: Complete this document. Are there other properties? Fill in each method's paramaters, return value, and description.

## Public Properties

app.BROWSER

## CONNECTION

See [events.md](events.md)

## Peers

isConnected()

isMainPeer()

returnHandshake()

returnPublicKey()

>Returns wallet's public key

* returns string public key

deletePeer()

connect(mode = 0)

sendRequest(message, data = "")

sendRequestWithCallback(message, data = "", mycallback)

addSocketEvents()

handleKeylistRequest(message)

configPeerFromHandshake(peershake)

handleHandshakeRequest(message)

handleBlockRequest(message)

handleMissingBlockRequest(message, callback)

async handleBlockchainRequest(message)

sendBlockchain(start_bid, synctype)

handleTransactionRequest(message, mycallback)

returnBlockURL(block_hash)

returnURL()

inTransactionPath(tx)

addPathToTransaction(tx)

## Network

updatePeersWithWatchedPublicKeys()

initialize()

pollPeers(peers, app)

cleanupDisconnectedSocket(peer)

connectToPeer(peerjson)

addRemotePeer(socket)

propagateBlock(blk)

propagateTransaction(tx, outbound_message = "transaction", mycallback = null)

propagateOffchainTransaction(tx, outbound_message = "offchain transaction", mycallback = null)

sendTransaction(message, data = "", fee = 1)

sendRequest(message, data = "", fee = 1) 

sendRequestWithCallback(message, data = "", callback)

sendTransactionToPeers(tx, outbound_message, fees = 1, callback = null)

propagateTransactionWithCallback(tx, mycallback = null)

addBlockHashToQueue(peer, bhash)

async fetchBlocks()

async fetchBlock(block_to_download_url, bhash)

returnPeerByPublicKey(publickey)

isPrivateNetwork()

isProductionNetwork()

isConnected() 

hasPeer(publickey)

## Modules

returnActiveModule()

respondTo(request)

getRespondTos(request)

## Key

addIdentifier(identifier)

removeIdentifier(identifier)

isIdentifier(identifier)

isPublicKey(publickey)

## Keychain

addKey(publickey = "", identifier = "", watched = false, tag = "", bid = "", bsh = "", lc = 1)

decryptMessage(publickey, encrypted_msg)

addGroup(group_id = "", members = [], name = "", watched = false, tag = "", bid = "", bsh = "", lc = 1)

decryptString(publickey, encrypted_string)

encryptMessage(publickey, msg)

findByPublicKey(publickey)

findByIdentifier(identifier)

hasSharedSecret(publickey)

isWatched(publickey)

initializeKeyExchange(publickey)

isTagged(publickey, tag)

saveKeys()

saveGrouos()

removeKey(publickey)

removeKeywordByIdentifierAndKeyword(identifier, tag)

returnKeys()

returnGroups()

returnKeychainByTag(tag)

updateEmail(publickey, email)

returnEmail(publickey)

updateIdenticon(publickey, identicon)

returnIdenticon(publickey)

returnIdenticonColor(publickey)

fetchIdentifierPromise(publickey)

fetchManyIdentifiersPromise(publickeys)

fetchIdentifier(publickey = "", mycallback) 

fetchManyIdentifiers(publickeys = [], mycallback) 

fetchPublicKeyPromise(identifier = "")

fetchPublicKey(identifier = null, mycallback)

returnPublicKeyByIdentifier(identifier)

returnIdentifierByPublicKey(publickey, returnKey = false) 

returnUsername(publickey)

## Storage

loadOptions

saveOptions

resetOptions

saveTransaction

deleteTransaction

loadTransactions

loadTransactionsByKeys

## Transaction

generateRebroadcastTransaction(creator, tid, sid, avg_fee=2)

isFrom(senderPublicKey) 

isTo(receiverPublicKey) 

isGoldenTicket() 

isRebroadcast(oldblk, newblk, sid) 

involvesPublicKey(publickey)

returnPaymentTo(publickey) 

returnSlipsFrom(fromAddress)

returnSlipsToAndFrom(theAddress)

returnSlipsTo(toAddress)

stringToBase64(str)

base64ToString(str)

decryptMessage(app)

returnMessage()

returnSignature(app)

returnSignatureSource(app)

returnFees(app) 

returnRoutingWorkAvailable(app, publickey="")

validate(app, bid=0)

## Wallet

addInput(x) 

addOutput(x) 

containsInput(s) 

containsOutput(s) 

addTransactionToPending(tx) 

doesSlipInPendingTransactionsSpendBlockHash(bsh="") 

isSlipInPendingTransactions(slip=null) 

rebroadcastPendingTransactions(peer=null) 

unspendInputSlips(tmptx=null) 

onChainReorganization(bid, bsh, lc, pos) 

processPayments(blk, lc=0) 

purgeExpiredSlips() 

resetExistingSlips(bid, bsh, lc) 

resetSpentInputs(bid=0) 

returnAdequateInputs(amt) 

calculateBalance() 

calculateDisplayBalance() 

isSlipValid(slip, index) 

returnBalance() 

returnPrivateKey() 

> Returns wallet's private key

* returns string private key

returnPublicKey() 

async backupWallet() 

async resetWallet() 

saveWallet() 

signMessage(msg) 

>Returns wallet's balance

* returns double balance

signTransaction(tx)

>Signs a transaction using the wallet private key.

* tx Saito transaction to sign
* returns saito.transaction Signed Saito transaction

updateBalance() 

returnDisplayBalance() 

createSlip(addr) 

createRawTransaction(txobj) 

createUnsignedTransactionWithDefaultFee(publickey="", amt=0.0) 

>Create a transaction with the appropriate slips given the desired fee and payment to associate with the transaction, and a change address to receive any surplus tokens. Use the default wallet fee.

* recipient Publickey of the recipient (string)
* fee to send with tx
* returns saito.transaction if successful
* returns null if inadequate inputs

signTransaction

>Signs a msg string using the wallet private key.

returnBalance

* msg string to sign
* returns string public key

createUnsignedTransaction(publickey="", amt=0.0, fee=0.0) 

> Create a transaction with the appropriate slips given the desired fee and payment to associate with the transaction, and a change address to receive any surplus tokens.

* recipient Publickey of the recipient (string)
* payment amount
* fee to send with tx
* returns saito.transaction if successful
* returns null if inadequate inputs

createToSlips(num, address, amount, change_amount) 

createReplacementTransaction(oldtx) 

returnInstalledCryptos() 

returnPreferredCrypto() 

returnPreferredCryptoByName()
