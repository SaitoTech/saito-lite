const saito = require('./saito');
const modtemplate = require('./../templates/modtemplate');
var Identicon = require('identicon.js');


class Keychain {

  constructor(app) {

    this.app         = app || {***REMOVED***;
    this.keys        = [];
    this.groups      = [];
    this.modtemplate = new modtemplate(this.app);

  ***REMOVED***



  initialize() {

    if (this.app.options.keys == null) { this.app.options.keys = {***REMOVED***; ***REMOVED***

    for (let i = 0; i < this.app.options.keys.length; i++) {

      var tk               = this.app.options.keys[i];

      var k                = new saito.key();
          k.publickey      = tk.publickey;
          k.watched        = tk.watched;
          k.bid            = tk.bid;
          k.bsh            = tk.bsh;
          k.lc             = tk.lc;
          k.aes_publickey  = tk.aes_publickey;
          k.aes_privatekey = tk.aes_privatekey;
          k.aes_secret     = tk.aes_secret;

      for (let m = 0; m < tk.identifiers.length; m++) {
        k.identifiers[m] = tk.identifiers[m];
  ***REMOVED***
      for (let m = 0; m < tk.tags.length; m++) {
        k.tags[m] = tk.tags[m];
  ***REMOVED***
      this.keys.push(k);
***REMOVED***
  ***REMOVED***


  addKey(publickey, identifier = "", watched = false, tag = "", bid="", bsh="", lc=1) {

    if (publickey == "") { return; ***REMOVED***
    publickey = publickey.trim();

    let tmpkey = this.findByPublicKey(publickey);
    if (tmpkey == null) {
      tmpkey                = new saito.key();
      tmpkey.publickey      = publickey;
      tmpkey.watched        = watched;
      tmpkey.bid	    = bid;
      tmpkey.bsh	    = bsh;
      tmpkey.lc		    = lc;
      if (identifier != "") { tmpkey.addIdentifier(identifier); ***REMOVED***
      if (tag != "")        { tmpkey.addTag(tag); ***REMOVED***
      this.keys.push(tmpkey);
***REMOVED*** else {
      if (bid != "" && bsh != "") {

        if (tmpkey.bsh != bsh && tmpkey.bid != bid) {

	  tmpkey                = new saito.key();
          tmpkey.publickey      = publickey;
          tmpkey.watched        = watched;
          tmpkey.bid	    	= bid;
          tmpkey.bsh	    	= bsh;
          tmpkey.lc		= lc;
          if (identifier != "") { tmpkey.addIdentifier(identifier); ***REMOVED***
          if (tag != "")        { tmpkey.addTag(tag); ***REMOVED***
          this.keys.push(tmpkey);

	***REMOVED*** else {
	
          tmpkey.publickey      = publickey;
          tmpkey.watched        = watched;
          tmpkey.bid	    	= bid;
          tmpkey.bsh	    	= bsh;
          tmpkey.lc		= lc;
          if (identifier != "") { tmpkey.addIdentifier(identifier); ***REMOVED***
          if (tag != "")        { tmpkey.addTag(tag); ***REMOVED***

	***REMOVED***

  ***REMOVED*** else {
        if (identifier != "") { tmpkey.addIdentifier(identifier); ***REMOVED***
        if (tag != "")        { tmpkey.addTag(tag); ***REMOVED***
        if (watched)          { tmpkey.watched = true; ***REMOVED***
  ***REMOVED***
***REMOVED***
    this.saveKeys();
  ***REMOVED***



  decryptMessage(publickey, encrypted_msg) {

    // submit JSON parsed object after unencryption
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey) {
        if (this.keys[x].aes_secret != "") {
          var tmpmsg = this.app.crypto.aesDecrypt(encrypted_msg, this.keys[x].aes_secret);
          if (tmpmsg != null) {
            var tmpx = JSON.parse(tmpmsg);
            if (tmpx.module != null) {
              return JSON.parse(tmpmsg);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***
 
    // or return original
    return encrypted_msg;
  ***REMOVED***



  addGroup(group_id="", members=[], name = "", watched = false, tag = "", bid="", bsh="", lc=1) {

    for (let i = 0; i < members.length++; i++) {
      this.addKey(members[i]);
***REMOVED***
    if (watched == true) {
      for (let i = 0; i < this.keys.length; i++) {
	this.keys[i].watched = true; 
  ***REMOVED***	
      this.saveKeys();
***REMOVED***

    let group = {***REMOVED***;

    for (let z = 0; z < this.groups.length; z++) {
      if (this.groups[z].id === group_id) {
	group = this.groups[z];
  ***REMOVED***
***REMOVED***

    group.id = group_id;
    group.members = members;
    group.name = name;
    if (watched == true) { 
      group.watched = true;
***REMOVED***
    if (group.watched == undefined) {
      group.watched = false;
***REMOVED***
    if (group.tags == undefined) { group.tags = []; ***REMOVED***
    if (tag != "") { if (!group.tags.includes(tag)) { group.tags.push(tag); ***REMOVED*** ***REMOVED***

    this.saveGroups();

  ***REMOVED***


  decryptMessage(publickey, encrypted_msg) {

    // submit JSON parsed object after unencryption
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey) {
        if (this.keys[x].aes_secret != "") {
          var tmpmsg = this.app.crypto.aesDecrypt(encrypted_msg, this.keys[x].aes_secret);
          if (tmpmsg != null) {
            var tmpx = JSON.parse(tmpmsg);
            if (tmpx.module != null) {
              return JSON.parse(tmpmsg);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***
 
    // or return original
    return encrypted_msg;
  ***REMOVED***


  decryptString(publickey, encrypted_string) {

    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey) {
        if (this.keys[x].aes_secret != "") {
          let tmpmsg = this.app.crypto.aesDecrypt(encrypted_string, this.keys[x].aes_secret);
          return tmpmsg;
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    return encrypted_string;
  ***REMOVED***


  encryptMessage(publickey, msg) {
    let jsonmsg = JSON.stringify(msg);
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey) {
        if (this.keys[x].aes_secret != "") {
          return this.app.crypto.aesEncrypt(jsonmsg, this.keys[x].aes_secret);
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    return msg;
  ***REMOVED***


  findByPublicKey(publickey) {
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey) { return this.keys[x]; ***REMOVED***
***REMOVED***
    return null;
  ***REMOVED***


  findByIdentifier(identifier) {
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].isIdentifier(identifier) == 1) { return this.keys[x]; ***REMOVED***
***REMOVED***
    return null;
  ***REMOVED***


  hasSharedSecret(publickey) {
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey || this.keys[x].isIdentifier(publickey) == 1) {
        if (this.keys[x].hasSharedSecret() == 1) {
          return true;
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    return false;
  ***REMOVED***


  isWatched(publickey) {
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey || this.keys[x].isIdentifier(publickey)) {
        if (this.keys[x].isWatched()) {
          return true;
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    return false;
  ***REMOVED***


  initializeKeyExchange(publickey) {

    var alice            = this.app.crypto.createDiffieHellman();
    var alice_publickey  = alice.getPublicKey(null, "compressed").toString("hex");
    var alice_privatekey = alice.getPrivateKey(null, "compressed").toString("hex");
    this.updateCryptoByPublicKey(publickey, alice_publickey, alice_privatekey, "");
    return alice_publickey;

  ***REMOVED***


  isTagged(publickey, tag) {
    var x = this.findByPublicKey(publickey);
    if (x == null) { return false; ***REMOVED***
    return x.isTagged(tag);
  ***REMOVED***


  saveKeys() {
    this.app.options.keys = this.keys;
    this.app.storage.saveOptions();
  ***REMOVED***

  saveGrouos() {
    this.app.options.groups = this.groups;
    this.app.storage.saveOptions();
  ***REMOVED***


  removeKey(publickey) {
    for (let x = this.keys.length-1; x >= 0; x--) {
      if (this.keys[x].publickey == publickey) {
        this.keys.splice(x, 1);
  ***REMOVED***
***REMOVED***
  ***REMOVED***


  removeKeywordByIdentifierAndKeyword(identifier, tag) {
    for (let x = this.keys.length-1; x >= 0; x--) {
      if (this.keys[x].isIdentifier(identifier) && this.keys[x].isTagged(tag)) {
        this.removeKey(this.keys[x].publickey);
        return;
  ***REMOVED***
***REMOVED***
  ***REMOVED***


  returnKeys() {
    var kx = [];
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].lc == 1 && this.keys[x].publickey != this.app.wallet.returnPublicKey()) { kx[kx.length] = this.keys[x]; ***REMOVED***
***REMOVED***
    return kx;
  ***REMOVED***


  returnGroups() {
    return this.groups;
  ***REMOVED***


  returnKeychainByTag(tag) {
    var kx = [];
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].isTagged(tag)) { kx[kx.length] = this.keys[x]; ***REMOVED***
***REMOVED***
    return kx;
  ***REMOVED***


  returnIdenticon(publickey) {
    if (this.keys != undefined) {
      for (let x = 0; x < this.keys.length; x++) {
        if (this.keys[x].publickey === publickey) {
          if (this.keys[x].data.identicon != "" && typeof this.keys[x].data.identicon !== "undefined") {
            return this.keys[x].data.identicon;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    //
    // if we reach here, generate from publickey
    //
    let options = {
      //foreground: [247, 31, 61, 255],   ***REMOVED*** saito red
      //background: [255, 255, 255, 255],
      margin: 0.0,                      ***REMOVED*** 0% margin
      size: 420,                        ***REMOVED*** 420px square
      format: 'svg'                     ***REMOVED*** use SVG instead of PNG
***REMOVED***;
    let data = new Identicon(this.app.crypto.hash(publickey), options).toString();
    let img = 'data:image/svg+xml;base64,' + data;

    return img;  
  ***REMOVED***




  fetchIdentifierPromise(publickey) {
    return new Promise((resolve, reject) => {
      this.fetchIdentifier(publickey, (answer) => {
        resolve(answer);
  ***REMOVED***);
***REMOVED***);
  ***REMOVED***

  fetchManyIdentifiersPromise(publickeys) {
    return new Promise((resolve, reject) => {
      this.fetchManyIdentifiers(publickeys, (answer) => {
        resolve(answer);
  ***REMOVED***)
***REMOVED***);
  ***REMOVED***



  fetchIdentifier(publickey="", mycallback) {

    let identifier = "";
    if (publickey == "") { mycallback(identifier); ***REMOVED***

    identifier = this.returnIdentifierByPublicKey(publickey);
    if (!identifier) { mycallback(identifier); ***REMOVED***

    //
    // if no result, fetch from server (modtemplate)
    //
    this.modtemplate.sendPeerDatabaseRequest("registry", "records", "*", "", null, (res) => {
      let rows = [];
      if (res.rows == undefined) mycallback(rows);
      rows = res.rows.map(row => {
        let { publickey, identifier, bid, bsh, lc ***REMOVED*** = row;
        this.addKey(publickey, identifier, false, "", bid, bsh, lc);
  ***REMOVED***);
      mycallback(rows);
***REMOVED***)

  ***REMOVED***

  fetchManyIdentifiers(publickeys=[], callback) {
    let found_keys = {***REMOVED***;
    let missing_keys = [];

    publickeys.forEach(publickey => {
      let identifier = this.returnIdentifierByPublicKey(publickey);
      if (identifier) found_keys[publickey] = identifier;
      else missing_keys.push(`'${publickey***REMOVED***'`);
***REMOVED***);

    if (missing_keys.length == 0) callback(found_keys);
    let where_statement = `publickey in (${missing_keys.join(',')***REMOVED***)`;

    this.modtemplate.sendPeerDatabaseRequest("registry", "records", "*", where_statement, null, (res) => {
      let rows = [];
      if (res.rows == undefined) callback(rows);
      rows = res.rows.map(row => {
        let { publickey, identifier, bid, bsh, lc ***REMOVED*** = row;
        this.addKey(publickey, identifier, false, "", bid, bsh, lc);
        found_keys[publickey] = identifier;
  ***REMOVED***);
      callback(found_keys);
***REMOVED***);
  ***REMOVED***

  fetchPublicKeyPromise(identifier="") {
    return new Promise((resolve, reject) => {
      this.fetchPublicKey(identifier, (answer) => {
        resolve (answer);
  ***REMOVED***);
***REMOVED***);
  ***REMOVED***


  fetchPublicKey(identifier="", mycallback) {

    let publickey = "";
    if (identifier=="") { mycallback(publickey); ***REMOVED***

    publickey = this.returnPublicKeyByIdentifier(identifier);
    if (publickey != "") { mycallback(publickey); ***REMOVED***

    //
    // if no result, fetch from server (modtemplate)
    //
    this.modtemplate.sendPeerDatabaseRequest("registry", "records", "*", "", null, (res) => {
      let rows = [];
      if (res.rows == undefined) { mycallback(rows); ***REMOVED***
      res.rows.forEach(row => {
        let { publickey, identifier, bid, bsh, lc ***REMOVED*** = row;
        this.addKey(publickey, identifier, false, "", bid, bsh, lc);
  ***REMOVED***)
      //
      // should only get back one row
      mycallback(res);
***REMOVED***)

  ***REMOVED***


  returnPublicKeyByIdentifier(identifier) {
    for (let x = 0; x < this.keys.length; x++) {
      let key = this.keys[x];
      if (key.lc == 1 && key.isIdentifier(identifier)) return key.publickey;
***REMOVED***
    return "";
  ***REMOVED***


  returnIdentifierByPublicKey(publickey) {
    if (this.keys != undefined) {
      for (let x = 0; x < this.keys.length; x++) {
        let key = this.keys[x];
        if (key.publickey === publickey) {
  	  if (key.identifiers != undefined && key.lc == 1) {
            if (key.identifiers.length > 0) {
              return key.identifiers[0];
        ***REMOVED***
	  ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    return null;
  ***REMOVED***


  returnWatchedPublicKeys() {
    var x = [];
    for (let i = 0; i < this.keys.length; i++) {
      if (this.keys[i].isWatched() && this.keys[i].lc == 1) {
        x.push(this.keys[i].publickey);
  ***REMOVED***
***REMOVED***
    return x;
  ***REMOVED***


  addWatchedPublicKey(publickey="") {
    this.addKey(publickey, "", true);
    this.app.network.updatePeersWithWatchedPublicKeys();
  ***REMOVED***



  updateCryptoByPublicKey(publickey, aes_publickey = "", aes_privatekey = "", shared_secret = "") {

    if (publickey == "") { return; ***REMOVED***

    this.addKey(publickey);

    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey && this.keys[x].lc == 1) {
        this.keys[x].aes_publickey  = aes_publickey;
        this.keys[x].aes_privatekey = aes_privatekey;
        this.keys[x].aes_secret     = shared_secret;
  ***REMOVED***
***REMOVED***

    this.saveKeys();

    return true;
  ***REMOVED***



  alreadyHaveSharedSecret(publickey) {

    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey && this.keys[x].lc == 1) {
        if (this.keys[x].aes_secret != "") {
          return true;
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    return false;

  ***REMOVED***


  clean() {
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].isWatched() == false) {
        if (this.keys[x].aes_secret != "") {
  	  console.log("purging key records: " + this.keys[x].publickey + " " + JSON.stringify(this.keys[x].identifiers));
          this.keys.splice(x, 1);
	  x--;
    ***REMOVED***
  ***REMOVED***
***REMOVED***
  ***REMOVED***

***REMOVED***

module.exports = Keychain;

