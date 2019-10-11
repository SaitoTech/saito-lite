'use strict'

var xor                 = require('bitwise-xor');
const crypto            = require('crypto-browserify');
const sha256            = require('sha256');
const merkle            = require('merkle-tree-gen');
const node_cryptojs     = require('node-cryptojs-aes');
const { randomBytes ***REMOVED***   = require('crypto');
const secp256k1         = require('secp256k1');
//const secp256k1         = require('secp256k1/elliptic')
const CryptoJS          = node_cryptojs.CryptoJS;
const JsonFormatter     = node_cryptojs.JsonFormatter;
const Base58            = require("base-58");
const stringify 	= require('fastest-stable-stringify');



/**
 * Crypto Constructor
 */
class Crypto {
  constructor() { return this; ***REMOVED***

  ///////////////////////////////////
  // BASIC CRYPTOGRAPHIC FUNCTIONS //
  ///////////////////////////////////

  /**
   * Hashes a string using sha256
   * @param {string***REMOVED*** data string data
   * @returns {string***REMOVED*** sha256 hash
   */
  hash(data="") { return sha256(data); ***REMOVED***


  //////////////////////////
  // XOR - used in gaming //
  //////////////////////////
  //
  // XOR encrypt and decrypt code taken from
  //
  // https://www.npmjs.com/package/bitwise-xor
  //
  // this needs to be replaced by a more secure commutive encryption algorithm
  //
  encodeXOR(plaintext, key) {
    return xor(Buffer.from(plaintext, 'hex'), Buffer.from(key, 'hex')).toString('hex');
  ***REMOVED***
  decodeXOR(str, key) {
    return xor(Buffer.from(str, 'hex'), Buffer.from(key, 'hex')).toString('hex');
  ***REMOVED***;
  stringToHex(str) {
    return Buffer.from(str, 'utf-8').toString('hex');
  ***REMOVED***
  hexToString(hex) {
    return Buffer.from(hex, 'hex').toString('utf-8');
  ***REMOVED***
  stringToBase64(str) {
    return Buffer.from(str, 'utf-8').toString('base64');
  ***REMOVED***
  base64ToString(str) {
    return Buffer.from(str, 'base64').toString('utf-8');
  ***REMOVED***


  ///////////////////////////////////
  // ELLIPTICAL CURVE CRYPTOGRAPHY //
  ///////////////////////////////////
  /**
   * Compresses public key
   *
   * @param {string***REMOVED*** pubkey
   * @returns {string***REMOVED*** compressed publickey
   */
  compressPublicKey(pubkey) {
    return this.toBase58(secp256k1.publicKeyConvert(Buffer.from(pubkey,'hex'), true).toString('hex'));
  ***REMOVED***


  /**
   * Converts base58 string to hex string
   *
   * @param {string***REMOVED*** t string to convert
   * @returns {string***REMOVED*** converted string
   */
  fromBase58(t) {
    return Buffer.from(Base58.decode(t), 'Uint8Array').toString('hex');
  ***REMOVED***


  /**
   * Converts hex string to base58 string
   *
   * @param {string***REMOVED*** t string to convert
   * @returns {string***REMOVED*** converted string
   */
  toBase58(t) {
    return Base58.encode(Buffer.from(t, 'hex'));
  ***REMOVED***


  /**
   * Creates a public/private keypair. returns the string
   * of the private key from which the public key can be
   * re-generated.
   * @returns {string***REMOVED*** private key
   */
  generateKeys() {
    let privateKey;
    do { privateKey = randomBytes(32) ***REMOVED*** while (!secp256k1.privateKeyVerify(privateKey, false))
    return privateKey.toString('hex');
  ***REMOVED***


  /**
   * Returns the public key associated with a private key
   * @param {string***REMOVED*** privkey private key (hex)
   * @returns {string***REMOVED*** public key (hex)
   */
  returnPublicKey(privkey) {
    return this.compressPublicKey(secp256k1.publicKeyCreate(Buffer.from(privkey,'hex'), false).toString('hex'));
  ***REMOVED***


  /**
   * Signs a message with a private key, and returns the message
   * @param {string***REMOVED*** msg message to sign
   * @param {string***REMOVED*** privkey private key (hex)
   * @returns {string***REMOVED*** base-58 signed message
   */
  signMessage(msg, privkey) {
    return this.toBase58(secp256k1.sign(Buffer.from(this.hash(Buffer.from(msg, 'utf-8').toString('base64')),'hex'), Buffer.from(privkey,'hex')).signature.toString('hex'));
  ***REMOVED***


  /**
   * Returns an uncompressed public key from publickey
   * @param {string***REMOVED*** pubkey public key (base-58)
   * @returns {string***REMOVED*** public key (hex)
   */
  uncompressPublicKey(pubkey) {
    return secp256k1.publicKeyConvert(Buffer.from(this.fromBase58(pubkey),'hex'), false).toString('hex');
  ***REMOVED***


  /**
   * Confirms that a base64 signatureSource was signed by the
   * key associated with a providded public key
   * @param {string***REMOVED*** msg -- sha256 of base64 string
   * @param {string***REMOVED*** sig
   * @param {string***REMOVED*** pubkey
   * @returns {boolean***REMOVED*** is signature valid?
   */
  verifySignatureSource(msg, sig, pubkey) {
    try {
      return secp256k1.verify(Buffer.from(msg,'hex'), Buffer.from(this.fromBase58(sig),'hex'), Buffer.from(this.uncompressPublicKey(pubkey),'hex'));
***REMOVED*** catch (err) {
      console.log(err);
      return false;
***REMOVED***
  ***REMOVED***


  /**
   * Confirms that a message was signed by the private
   * key associated with a providded public key
   * @param {string***REMOVED*** msg
   * @param {string***REMOVED*** sig
   * @param {string***REMOVED*** pubkey
   * @returns {boolean***REMOVED*** is signature valid?
   */
  verifyMessage(msg, sig, pubkey) {
    try {
      return secp256k1.verify(Buffer.from(this.hash(Buffer.from(msg, 'utf-8').toString('base64')),'hex'), Buffer.from(this.fromBase58(sig),'hex'), Buffer.from(this.uncompressPublicKey(pubkey),'hex'));
***REMOVED*** catch (err) {
      console.log(err);
      return false;
***REMOVED***
  ***REMOVED***

  /**
   * Fast verification takes the msg as a hash input (in hex)
   * key associated with a providded public key
   * @param {string***REMOVED*** msg
   * @param {string***REMOVED*** sig
   * @param {string***REMOVED*** pubkey
   * @returns {boolean***REMOVED*** is signature valid?
   */
  fastVerifyMessage(msg, sig, pubkey) {
    try {
      return secp256k1.verify(Buffer.from(msg, 'hex'), Buffer.from(this.fromBase58(sig),'hex'), Buffer.from(this.uncompressPublicKey(pubkey),'hex'));
***REMOVED*** catch (err) {
      console.log(err);
      return false;
***REMOVED***
  ***REMOVED***

  /**
   * Checks if a publickey passed into a function
   * fits the criteria for a publickey
   * @param {string***REMOVED*** publickey
   * @returns {boolean***REMOVED*** does publickey fit the criteria?
   */
  isPublicKey(publickey) {
    if (publickey.length == 44 || publickey.length == 45) {
      if (publickey.indexOf("@") > 0) {***REMOVED*** else {
        return 1;
  ***REMOVED***
***REMOVED***
    return 0;
  ***REMOVED***




  //////////////////
  // MERKLE TREES //
  //////////////////

  /**
   * Takes an array of strings and converts them into a merkle tree
   * of SHA256 hashes.
   * @param {array***REMOVED*** inarray array of strings
   * @returns {merkle-tree***REMOVED***
   */
  returnMerkleTree(inarray) {
    var mt   = null;
    var args = { array: inarray, hashalgo: 'sha256', hashlist: false ***REMOVED***;
    merkle.fromArray(args, function (err, tree) { mt = tree; ***REMOVED***);
    return mt;
  ***REMOVED***







  ////////////////////
  // DIFFIE HELLMAN //
  ////////////////////
  //
  // The DiffieHellman process allows two people to generate a shared
  // secret in an environment where all information exchanged between
  // the two can be observed by others.
  //
  // It is used by our encryption module to generate shared secrets,
  // but is generally useful enough that we include it in our core
  // cryptography class
  //
  // see the "encryption" module for an example of how to generate
  // a shared secret using these functions
  //


  /**
   * Creates DiffieHellman object
   * @param {string***REMOVED*** pubkey public key
   * @param {string***REMOVED*** privkey private key
   * @returns {DiffieHellman object***REMOVED*** ecdh
   */
  createDiffieHellman(pubkey="",privkey="") {
    var ecdh   = crypto.createECDH("secp256k1");
    ecdh.generateKeys();
    if (pubkey != "")  { ecdh.setPublicKey(pubkey); ***REMOVED***
    if (privkey != "") { ecdh.setPrivateKey(privkey); ***REMOVED***
    return ecdh;
  ***REMOVED***


  /**
   * Given a Diffie-Hellman object, fetch the keys
   * @param {DiffieHellman object***REMOVED*** dh Diffie-Hellamn object
   * @returns {object***REMOVED*** object with keys
   */
  returnDiffieHellmanKeys(dh) {
    var keys = {***REMOVED***;
    keys.pubkey  = dh.getPublicKey(null, "compressed");
    keys.privkey = dh.getPrivateKey(null, "compressed");
    return keys;
  ***REMOVED***


  /**
   * Given your private key and your counterparty's public
   * key and an extra piece of information, you can generate
   * a shared secret.
   *
   * @param {DiffieHellman object***REMOVED*** counterparty DH
   * @param {string***REMOVED*** my_publickey
   * @return {{pubkey:"", privkey:""***REMOVED******REMOVED*** object with keys
   */
  createDiffieHellmanSecret(a_dh, b_pubkey) {
    return a_dh.computeSecret(b_pubkey);
  ***REMOVED***




  ////////////////////////////////
  // AES SYMMETRICAL ENCRYPTION //
  ////////////////////////////////
  //
  // once we have a shared secret (possibly generated through the
  // Diffie-Hellman method above), we can use it to encrypt and
  // decrypt communications using a symmetrical encryption method
  // like AES.
  //


  /**
   * Encrypts with AES
   * @param {string***REMOVED*** msg msg to encrypt
   * @param {string***REMOVED*** secret shared secret
   * @returns {string***REMOVED*** json object
   */
  aesEncrypt(msg, secret) {
    var rp = Buffer.from(secret.toString("hex"), "hex").toString("base64");
    var en = CryptoJS.AES.encrypt(msg, rp, { format: JsonFormatter ***REMOVED***);
    return en.toString();
  ***REMOVED***


  /**
   * Decrypt with AES
   * @param {string***REMOVED*** msg encrypted json object from aesEncrypt
   * @param {string***REMOVED*** secret shared secret
   * @returns {string***REMOVED*** unencrypted string
   */
  aesDecrypt(msg, secret) {
    var rp = Buffer.from(secret.toString("hex"), "hex").toString("base64");
    var de = CryptoJS.AES.decrypt(msg, rp, { format: JsonFormatter ***REMOVED***);
    return CryptoJS.enc.Utf8.stringify(de);
  ***REMOVED***


  //////////////////////////
  // Faster Serialization //
  //////////////////////////
  //
  // Yes, this isn't a cryptographic function, but we can put it here
  // until it makes sense to create a dedicated helper class.
  //
  fastSerialize(jsobj) { return stringify(jsobj); ***REMOVED***

***REMOVED***

module.exports = Crypto;
