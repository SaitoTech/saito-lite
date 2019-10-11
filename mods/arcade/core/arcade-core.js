const saito = require('../../../lib/saito/saito.js');
const ModTemplate = require('../../../lib/templates/modtemplate.js');

class ArcadeCore extends ModTemplate {
  constructor(app) {
    super(app);

    this.name = "Arcade";
    this.games = [];
  ***REMOVED***

  async onConfirmation(blk, tx, conf, app) {
    let arcade_self = app.modules.returnModule("Arcade");
    if (tx == null) { return; ***REMOVED***

    if (conf == 0) {
      let txmsg = tx.returnMessage();
      switch (txmsg.request) {
        case 'invite':
          break;
        case 'gameover':
          break;
        case 'accept':
          break;
        case 'creategame':
          if (txmsg.module != "Arcade") { return; ***REMOVED***
          arcade_self.handleCreateGame(tx);
          break;
        default:
          break;
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  handleCreateGame(tx) {
    let pkey = tx.transaction.from[0].add;
    let { game, state, options, ts, sig, validfor, gameid ***REMOVED*** = tx.returnMessage();
    let adminid = `${game.gameid***REMOVED***_${game.game***REMOVED***`;
    let created_at = parseInt(ts);
    let expires_at = created_at + (60000 * parseInt(validfor));

    let opengame = {
      player:     pkey || "",
      winner:     "",
      game:       game || "",
      state:      state || "",
      status:     "",
      options:    JSON.stringify(options) || "",
      sig:        sig || "",
      created_at: created_at || new Date().getTime(),
      expires_at: expires_at || 0,
      gameid:     gameid || "",
      adminid:    adminid || ""
***REMOVED***;

    this.games.push(opengame);
    this.app.network.sendRequest("arcade opengame", opengame);
  ***REMOVED***

  handlePeerRequest(app, req, peer, mycallback) {
    if (req.request == null) { return; ***REMOVED***
    if (req.data == null) { return; ***REMOVED***

    switch(req.request) {
      case 'arcade request games':
        app.network.sendRequest("arcade response games", this.games);
      default:
        break;
***REMOVED***
  ***REMOVED***

  shouldAffixCallbackToModule(modname) {
    if (modname === "Arcade") { return 1; ***REMOVED***
    if (modname === "Solitrio") { return 1; ***REMOVED***
    if (modname === "Twilight") { return 1; ***REMOVED***
    if (modname === "Poker") { return 1; ***REMOVED***
    if (modname === "Pandemic") { return 1; ***REMOVED***
    if (modname === "Chess") { return 1; ***REMOVED***
    if (modname === "Wordblocks") { return 1; ***REMOVED***
    return 0;
  ***REMOVED***
***REMOVED***

module.exports = ArcadeCore;