# Saito Application Context
## Public Properties

app.BROWSER

## CONNECTION

See [events.md](events.md)

## Peers
## Network
## Modules

respondTo

## Key

isIdentifier
isPublicKey

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

## Wallet

TODO: Make sure these are all up to date and complete
createUnsignedTransaction

* recipient Publickey of the recipient (string)
* payment amount
* fee to send with tx
* returns saito.transaction if successful
* returns null if inadequate inputs

Create a transaction with the appropriate slips given the desired fee and payment to associate with the transaction, and a change address to receive any surplus tokens.
createUnsignedTransactionWithDefaultFee

* recipient Publickey of the recipient (string)
* fee to send with tx
* returns saito.transaction if successful
* returns null if inadequate inputs

Create a transaction with the appropriate slips given the desired fee and payment to associate with the transaction, and a change address to receive any surplus tokens. Use the default wallet fee.
signTransaction

* tx Saito transaction to sign
* returns saito.transaction Signed Saito transaction

Signs a transaction using the wallet private key.
signMessage

* msg string to sign
* returns string public key

Signs a msg string using the wallet private key.
returnBalance

* returns double balance

Returns wallet's balance
returnDefaultFee

* returns double fee

Returns wallet's default fee
returnPublicKey

* returns string public key

Returns wallet's public key
returnPrivateKey

* returns string private key

Returns wallet's private key
returnIdentifier

* returns string identifier

If exists, Return the default identifier associated with a wallet