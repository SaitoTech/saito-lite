const saito         = require('./saito');

class Key {

  constructor() {

    if (!(this instanceof Key)) {
      return new Key();
***REMOVED***

    this.publickey      = "";
    this.tags           = [];
    this.identifiers    = [];
    this.watched        = false;
    this.lock_block     = false; // after this bid, identifier is locked
    this.aes_publickey  = "";
    this.aes_privatekey = "";
    this.aes_secret     = "";

    return this;

  ***REMOVED***


  addTag(tag) {
    if (!this.isTagged(tag)) { this.tags.push(tag); ***REMOVED***
  ***REMOVED***


  addIdentifier(identifier) {
    if (!this.isIdentifier(identifier)) { this.identifiers.push(identifier); ***REMOVED***
  ***REMOVED***


  hasSharedSecret() {
    if (this.aes_secret != "") { return true; ***REMOVED***
    return false;
  ***REMOVED***


  isIdentifier(identifier) {
    for (let x = 0; x < this.identifiers.length; x++) {
      if (this.identifiers[x] == identifier) { return true; ***REMOVED***
***REMOVED***
    return false;
  ***REMOVED***


  isPublicKey(publickey) {
    return this.publickey == publickey;
  ***REMOVED***


  isWatched(publickey) {
    return this.watched;
  ***REMOVED***


  isTagged(tag) {
    for (let x = 0; x < this.tags.length; x++) {
      if (this.tags[x] == tag) { return true; ***REMOVED***
***REMOVED***
    return false;
  ***REMOVED***


  removeIdentifier(identifier) {
    if (!this.isIdentifier(identifier)) { return; ***REMOVED***
    for (let x = this.identifiers.length-1; x >= 0; x++) {
      if (this.identifiers[x] == identifier) {
        this.identifiers.splice(x, 1);
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  removeTag(tag) {
    if (!this.isTagged(tag)) { return; ***REMOVED***
    for (let x = this.tags.length-1; x >= 0; x++) {
      if (this.tags[x] == tag) {
        this.tags.splice(x, 1);
  ***REMOVED***
***REMOVED***
  ***REMOVED***

***REMOVED***

module.exports = Key;

