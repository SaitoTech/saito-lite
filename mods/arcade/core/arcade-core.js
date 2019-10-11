const saito = require('../../../lib/saito/saito.js');
const ModTemplate = require('../../../lib/templates/modtemplate.js');

class ArcadeCore extends ModTemplate {
  constructor(app) {
    super(app);

    this.name = "Arcade";
    this.games = [];
  }

  async onConfirmation(blk, tx, conf, app) {
    let arcade_self = app.modules.returnModule("Arcade");
    if (tx == null) { return; }

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
          if (txmsg.module != "Arcade") { return; }
          arcade_self.handleCreateGame(tx);
          break;
        default:
          break;
      }
    }
  }

  handleCreateGame(tx) {
    let pkey = tx.transaction.from[0].add;
    let { game, state, options, ts, sig, validfor, gameid } = tx.returnMessage();
    let adminid = `${game.gameid}_${game.game}`;
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
    };

    this.games.push(opengame);
    this.app.network.sendRequest("arcade opengame", opengame);
  }

  handlePeerRequest(app, req, peer, mycallback) {
    if (req.request == null) { return; }
    if (req.data == null) { return; }

    switch(req.request) {
      case 'arcade request games':
        app.network.sendRequest("arcade response games", this.games);
      default:
        break;
    }
  }

  shouldAffixCallbackToModule(modname) {
    if (modname === "Arcade") { return 1; }
    if (modname === "Solitrio") { return 1; }
    if (modname === "Twilight") { return 1; }
    if (modname === "Poker") { return 1; }
    if (modname === "Pandemic") { return 1; }
    if (modname === "Chess") { return 1; }
    if (modname === "Wordblocks") { return 1; }
    return 0;
  }
}

module.exports = ArcadeCore;