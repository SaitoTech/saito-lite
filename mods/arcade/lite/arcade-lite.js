const saito = require('../../../lib/saito/saito.js');
const ModTemplate = require('../../../lib/templates/modtemplate.js');

class ArcadeLite extends ModTemplate {
  constructor(app) {
    super(app);

    this.name = "Arcade";
    this.games = [];
  }

  handlePeerRequest(app, req, peer, mycallback) {
    if (req.request == null) { return; }
    if (req.data == null) { return; }

    switch(req.request) {
      case 'arcade opengame':
        this.games.push(req.data);
        this.addRowToGameTable(req.data);
        break;
      case 'arcade response games':
        req.data.forEach((row) => {
          this.games.push(row);
          this.addRowToGameTable(req.data);
        })
        break;
      default:
        break;
    }
  }

  addRowToGameTable(row) {}
}

module.exports = ArcadeLite;