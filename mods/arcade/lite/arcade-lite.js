const saito = require('../../../lib/saito/saito.js');
const ModTemplate = require('../../../lib/templates/modtemplate.js');

class ArcadeLite extends ModTemplate {
  constructor(app) {
    super(app);

    this.name = "Arcade";
    this.games = [];
  ***REMOVED***

  handlePeerRequest(app, req, peer, mycallback) {
    if (req.request == null) { return; ***REMOVED***
    if (req.data == null) { return; ***REMOVED***

    switch(req.request) {
      case 'arcade opengame':
        this.games.push(req.data);
        this.addRowToGameTable(req.data);
        break;
      case 'arcade response games':
        req.data.forEach((row) => {
          this.games.push(row);
          this.addRowToGameTable(req.data);
    ***REMOVED***)
        break;
      default:
        break;
***REMOVED***
  ***REMOVED***

  addRowToGameTable(row) {***REMOVED***
***REMOVED***

module.exports = ArcadeLite;