const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');

const ArcadeMain = require('./lib/arcade-main/arcade-main');
const ArcadeLeftSidebar = require('./lib/arcade-left-sidebar/arcade-left-sidebar');
const ArcadeRightSidebar = require('./lib/arcade-right-sidebar/arcade-right-sidebar');


class Arcade extends ModTemplate {

  constructor(app) {

    super(app);

    this.name 			= "Arcade";
    this.games			= [];
    this.data			= {***REMOVED***;

  ***REMOVED***

  render(app, data) {

    ArcadeMain.render(app, data);
    ArcadeMain.attachEvents(app, data);

    ArcadeLeftSidebar.render(app, data);
    ArcadeLeftSidebar.attachEvents(app, data);

    ArcadeRightSidebar.render(app, data);
    ArcadeRightSidebar.attachEvents(app, data);

  ***REMOVED***

  initialize(app) {

console.log("INITIQLIZING ARCADE");

  ***REMOVED***


  initializeHTML(app) {

console.log("INIT: " + this.games.length);

    let x = [];
    x = this.app.modules.respondTo("arcade-gamelist");
console.log("GAMES THAT RESPOND?: " + x.length);
    for (let i = 0; i < x.length; i++) {  this.games.push(x[i]); ***REMOVED***

console.log("INIT: " + this.games.length);

    this.data.games = this.games;

    this.render(app, this.data);

  ***REMOVED***



  onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let arcade = app.modules.returnModule("Arcade");

    if (conf == 0) {

***REMOVED***

  ***REMOVED***

***REMOVED***

module.exports = Arcade;
