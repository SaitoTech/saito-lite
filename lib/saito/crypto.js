'use strict'

const crypto            = require('crypto-browserify');
const sha256            = require('sha256');
const node_cryptojs     = require('node-cryptojs-aes');
const { randomBytes }   = require('crypto');
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
  // constructor() { return this; }

  ///////////////////////////////////
  // BASIC CRYPTOGRAPHIC FUNCTIONS //
  ///////////////////////////////////

  /**
   * Hashes a string using sha256
   * @param {string} data string data
   * @returns {string} sha256 hash
   */
  hash(data="") { return sha256(data); }


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
  xor(a, b) {
    if (!Buffer.isBuffer(a)) a = new Buffer(a)
    if (!Buffer.isBuffer(b)) b = new Buffer(b)
    var res = []
    if (a.length > b.length) {
      for (var i = 0; i < b.length; i++) {
        res.push(a[i] ^ b[i])
      }
    } else {
      for (var i = 0; i < a.length; i++) {
        res.push(a[i] ^ b[i])
      }
    }
    return new Buffer(res);
  }

  //
  // TODO - don't pad key this way as it creates attack vectors
  //
  encodeXOR(plaintext, key) {
    while (plaintext.length > key.length) { key = key+key; }
    return this.xor(Buffer.from(plaintext, 'hex'), Buffer.from(key, 'hex')).toString('hex');
  }
  //
  // TODO - don't pad key this way as it creates attack vectors
  //
  decodeXOR(str, key) {
    while (str.length > key.length) { key = key+key; }
    return this.xor(Buffer.from(str, 'hex'), Buffer.from(key, 'hex')).toString('hex');
  };

  stringToHex(str) {
    return Buffer.from(str, 'utf-8').toString('hex');
  }
  hexToString(hex) {
    return Buffer.from(hex, 'hex').toString('utf-8');
  }
  stringToBase64(str) {
    return Buffer.from(str, 'utf-8').toString('base64');
  }
  base64ToString(str) {
    return Buffer.from(str, 'base64').toString('utf-8');
  }


  ///////////////////////////////////
  // ELLIPTICAL CURVE CRYPTOGRAPHY //
  ///////////////////////////////////
  /**
   * Compresses public key
   *
   * @param {string} pubkey
   * @returns {string} compressed publickey
   */
  compressPublicKey(pubkey) {
    return this.toBase58(secp256k1.publicKeyConvert(Buffer.from(pubkey,'hex'), true).toString('hex'));
  }


  /**
   * Converts base58 string to hex string
   *
   * @param {string} t string to convertches
   * @returns {string} converted string
   */
  fromBase58(t) {
    return Buffer.from(Base58.decode(t), 'Uint8Array').toString('hex');
  }


  /**
   * Converts hex string to base58 string
   *
   * @param {string} t string to convert
   * @returns {string} converted string
   */
  toBase58(t) {
    return Base58.encode(Buffer.from(t, 'hex'));
  }


  /**
   * Creates a public/private keypair. returns the string
   * of the private key from which the public key can be
   * re-generated.
   * @returns {string} private key
   */
  generateKeys() {
    let privateKey;
    do { privateKey = randomBytes(32) } while (!secp256k1.privateKeyVerify(privateKey, false))
    return privateKey.toString('hex');
  }

  /**
   * Creates a random number, but not a privatekey. used for 
   * XOR encryption in the game engine among other uses. public/private keypair. returns the string
   * @returns {string} private key
   */
  generateRandomNumber() {
    let randomNumber = randomBytes(32);
    return randomNumber.toString('hex');
  }


  /**
   * Returns the public key associated with a private key
   * @param {string} privkey private key (hex)
   * @returns {string} public key (hex)
   */
  returnPublicKey(privkey) {
    return this.compressPublicKey(secp256k1.publicKeyCreate(Buffer.from(privkey,'hex'), false).toString('hex'));
  }


  /**
   * Signs a message with a private key, and returns the message
   * @param {string} msg message to sign
   * @param {string} privkey private key (hex)
   * @returns {string} base-58 signed message
   */
  signMessage(msg, privkey) {
    return this.toBase58(secp256k1.sign(Buffer.from(this.hash(Buffer.from(msg, 'utf-8').toString('base64')),'hex'), Buffer.from(privkey,'hex')).signature.toString('hex'));
  }


  /**
   * Returns an uncompressed public key from publickey
   * @param {string} pubkey public key (base-58)
   * @returns {string} public key (hex)
   */
  uncompressPublicKey(pubkey) {
    return secp256k1.publicKeyConvert(Buffer.from(this.fromBase58(pubkey),'hex'), false).toString('hex');
  }


  /**
   * Confirms that a base64 signatureSource was signed by the
   * key associated with a providded public key
   * @param {string} msg -- sha256 of base64 string
   * @param {string} sig
   * @param {string} pubkey
   * @returns {boolean} is signature valid?
   */
  verifySignatureSource(msg, sig, pubkey) {
    try {
      return secp256k1.verify(Buffer.from(msg,'hex'), Buffer.from(this.fromBase58(sig),'hex'), Buffer.from(this.uncompressPublicKey(pubkey),'hex'));
    } catch (err) {
      console.log(err);
      return false;
    }
  }


  /**
   * Confirms that a message was signed by the private
   * key associated with a providded public key
   * @param {string} msg
   * @param {string} sig
   * @param {string} pubkey
   * @returns {boolean} is signature valid?
   */
  verifyMessage(msg, sig, pubkey) {
    try {
console.log("A: " + msg + " -- " + sig + " " + pubkey);
      return secp256k1.verify(Buffer.from(this.hash(Buffer.from(msg, 'utf-8').toString('base64')),'hex'), Buffer.from(this.fromBase58(sig),'hex'), Buffer.from(this.uncompressPublicKey(pubkey),'hex'));
console.log("B: " + msg + " -- " + sig + " " + pubkey);
    } catch (err) {
      console.log(err);
console.log("C: " + msg + " -- " + sig + " " + pubkey);
      return false;
    }
console.log("D");
  }

  /**
   * Fast verification takes the msg as a hash input (in hex)
   * key associated with a providded public key
   * @param {string} msg
   * @param {string} sig
   * @param {string} pubkey
   * @returns {boolean} is signature valid?
   */
  fastVerifyMessage(msg, sig, pubkey) {
    try {
      return secp256k1.verify(Buffer.from(msg, 'hex'), Buffer.from(this.fromBase58(sig),'hex'), Buffer.from(this.uncompressPublicKey(pubkey),'hex'));
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /**
   * Checks if a publickey passed into a function
   * fits the criteria for a publickey
   * @param {string} publickey
   * @returns {boolean} does publickey fit the criteria?
   */
  isPublicKey(publickey) {
    if (publickey.length == 44 || publickey.length == 45) {
      if (publickey.indexOf("@") > 0) {} else {
        return 1;
      }
    }
    return 0;
  }




  //////////////////
  // MERKLE TREES //
  //////////////////
  //
  // now handled in block.js
  //







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
   * @param {string} pubkey public key
   * @param {string} privkey private key
   * @returns {DiffieHellman object} ecdh
   */
  createDiffieHellman(pubkey="",privkey="") {
    var ecdh   = crypto.createECDH("secp256k1");
    ecdh.generateKeys();
    if (pubkey != "")  { ecdh.setPublicKey(pubkey); }
    if (privkey != "") { ecdh.setPrivateKey(privkey); }
    return ecdh;
  }


  /**
   * Given a Diffie-Hellman object, fetch the keys
   * @param {DiffieHellman object} dh Diffie-Hellamn object
   * @returns {object} object with keys
   */
  returnDiffieHellmanKeys(dh) {
    var keys = {};
    keys.pubkey  = dh.getPublicKey(null, "compressed");
    keys.privkey = dh.getPrivateKey(null, "compressed");
    return keys;
  }


  /**
   * Given your private key and your counterparty's public
   * key and an extra piece of information, you can generate
   * a shared secret.
   *
   * @param {DiffieHellman object} counterparty DH
   * @param {string} my_publickey
   * @return {{pubkey:"", privkey:""}} object with keys
   */
  createDiffieHellmanSecret(a_dh, b_pubkey) {
    return a_dh.computeSecret(b_pubkey);
  }




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
   * @param {string} msg msg to encrypt
   * @param {string} secret shared secret
   * @returns {string} json object
   */
  aesEncrypt(msg, secret) {
    var rp = secret.toString("hex");
    var en = CryptoJS.AES.encrypt(msg, rp, { format: JsonFormatter });
    return en.toString();
  }


  /**
   * Decrypt with AES
   * @param {string} msg encrypted json object from aesEncrypt
   * @param {string} secret shared secret
   * @returns {string} unencrypted string
   */
  aesDecrypt(msg, secret) {
    var rp = secret.toString("hex");
    var de = CryptoJS.AES.decrypt(msg, rp, { format: JsonFormatter });
    return CryptoJS.enc.Utf8.stringify(de);
  }


  //////////////////////////
  // Faster Serialization //
  //////////////////////////
  //
  // Yes, this isn't a cryptographic function, but we can put it here
  // until it makes sense to create a dedicated helper class.
  //
  fastSerialize(jsobj) { return stringify(jsobj); }

}

module.exports = Crypto;

