***REMOVED***
const GameTemplate = require('../../lib/templates/gametemplate');
const util = require('util');



//
// Missile Envy is a bit messy
//
var is_this_missile_envy_noneventable = 0;

//
// allows cancellation of pick "pickagain"
//
var original_selected_card = null;







//////////////////
// CONSTRUCTOR  //
//////////////////
class Twilight extends GameTemplate {

  constructor(app) {

    super(app);

    this.app             = app;

    this.name            = "Twilight";
    this.description     = `Twilight Struggle is a card-driven strategy game for two players, with its theme taken from the Cold War. One player plays the United States (US), and the other plays the Soviet Union (USSR).`
    this.publisher_message = "GMT Games";

    //
    // this sets the ratio used for determining
    // the size of the original pieces
    //
    this.boardgameWidth  = 5100;

    this.moves           = [];
    this.is_testing = 0;

    this.interface = 1;
    this.dont_show_confirm = 0;

    this.gameboardZoom  = 0.90;
    this.gameboardMobileZoom = 0.67;

    return this;

  ***REMOVED***






////////////////
// initialize //
////////////////
initializeGame(game_id) {

  //
  // enable chat
  //
  //if (this.browser_active == 1) {
  //  if (!this.app.browser.isMobileBrowser(navigator.userAgent)) {
  //    const chat = this.app.modules.returnModule("Chat");
  //    chat.addPopUpChat();
  //  ***REMOVED***
  //***REMOVED***

  //
  // check user preferences to update interface, if text
  //
  if (this.app.options != undefined) {
    if (this.app.options.gameprefs != undefined) {
      if (this.app.options.gameprefs.interface == 0) {
        this.interface = 0;
  ***REMOVED***
      if (this.app.options.gameprefs.dont_show_confirm == 1) {
        this.dont_show_confirm = 1;
  ***REMOVED***
***REMOVED***
  ***REMOVED***


  if (this.game.status != "") { this.updateStatus(this.game.status); ***REMOVED***


  //
  // initialize
  //
  if (this.game.countries == undefined) {
    this.game.countries = this.returnCountries();
  ***REMOVED***
  if (this.game.state == undefined) {
    this.game.state = this.returnState();
  ***REMOVED***
  if (this.game.deck.length == 0) {

console.log("\n\n\n\n");
console.log("---------------------------");
console.log("---------------------------");
console.log("------ INITIALIZE GAME ----");
console.log("---------------------------");
console.log("---------------------------");
console.log("---------------------------");
console.log("\n\n\n\n");

    this.updateStatus("Generating the Game");

    this.game.queue.push("round");
    if (this.game.options.usbonus != undefined) {
      if (this.game.options.usbonus > 0) {
        this.game.queue.push("placement_bonus\t2\t"+this.game.options.usbonus);
  ***REMOVED***
***REMOVED***
    this.game.queue.push("placement\t2");
    this.game.queue.push("placement\t1");
    this.game.queue.push("READY");
    this.game.queue.push("DEAL\t1\t2\t8");
    this.game.queue.push("DEAL\t1\t1\t8");
    this.game.queue.push("DECKENCRYPT\t1\t2");
    this.game.queue.push("DECKENCRYPT\t1\t1");
    this.game.queue.push("DECKXOR\t1\t2");
    this.game.queue.push("DECKXOR\t1\t1");

    //
    // TESTING
    //
    if (this.is_testing == 1) {

      this.game.options = {***REMOVED***;
      this.game.options.culturaldiplomacy = 1;
      this.game.options.gouzenkoaffair = 1;
      this.game.options.berlinagreement = 1;
      this.game.options.handshake = 1;
      this.game.options.rustinredsquare = 1;

      let a = this.returnEarlyWarCards();
      let b = this.returnMidWarCards();
      let c = this.returnLateWarCards();
      let d = Object.assign({***REMOVED***, a, b);
      let e = Object.assign({***REMOVED***, d, c);
      console.log("CARDS: " + JSON.stringify(e));
      this.game.queue.push("DECK\t1\t"+JSON.stringify(e));
***REMOVED*** else {
      this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnEarlyWarCards()));
***REMOVED***
    this.game.queue.push("init");

    if (this.game.dice === "") {
      this.initializeDice();
***REMOVED***

  ***REMOVED***

  this.countries = this.game.countries;

  //
  // adjust screen ratio
  //
  $('.country').css('width', this.scale(202)+"px");
  $('.us').css('width', this.scale(100)+"px");
  $('.ussr').css('width', this.scale(100)+"px");
  $('.us').css('height', this.scale(100)+"px");
  $('.ussr').css('height', this.scale(100)+"px");

  //
  $('.formosan_resolution').css('width', this.scale(202)+"px");
  $('.formosan_resolution').css('height', this.scale(132)+"px");
  $('.formosan_resolution').css('top', this.scale(this.countries['taiwan'].top-32)+"px");
  $('.formosan_resolution').css('left', this.scale(this.countries['taiwan'].left)+"px");

  //
  // update defcon and milops and stuff
  //
  this.updateDefcon();
  this.updateActionRound();
  this.updateSpaceRace();
  this.updateVictoryPoints();
  this.updateMilitaryOperations();
  this.updateRound();

  //
  // initialize interface
  //
  for (var i in this.countries) {

    let divname      = '#'+i;
    let divname_us   = divname + " > .us > img";
    let divname_ussr = divname + " > .ussr > img";

    let us_i   = 0;
    let ussr_i = 0;

    $(divname).css('top', this.scale(this.countries[i].top)+"px");
    $(divname).css('left', this.scale(this.countries[i].left)+"px");
    $(divname_us).css('height', this.scale(100)+"px");
    $(divname_ussr).css('height', this.scale(100)+"px");

    if (this.countries[i].us > 0) { this.showInfluence(i, "us"); ***REMOVED***
    if (this.countries[i].ussr > 0) { this.showInfluence(i, "ussr"); ***REMOVED***
  ***REMOVED***






  var element = document.getElementById('gameboard');

  if (element !== null) {
/*******
    var hammertime = new Hammer(element, {***REMOVED***);

    hammertime.get('pinch').set({ enable: true ***REMOVED***);
    hammertime.get('pan').set({ threshold: 0 ***REMOVED***);

    var fixHammerjsDeltaIssue = undefined;
    var pinchStart = { x: undefined, y: undefined ***REMOVED***
    var lastEvent = undefined;

    var originalSize = {
      width: 2550,
      height: 1650
***REMOVED***

    var current = {
      x: 0,
      y: 0,
      z: 1,
      zooming: false,
      width: originalSize.width * 1,
      height: originalSize.height * 1,
***REMOVED***

    var last = {
      x: current.x,
      y: current.y,
      z: current.z
***REMOVED***

    function getRelativePosition(element, point, originalSize, scale) {
      var domCoords = getCoords(element);

      var elementX = point.x - domCoords.x;
      var elementY = point.y - domCoords.y;

      var relativeX = elementX / (originalSize.width * scale / 2) - 1;
      var relativeY = elementY / (originalSize.height * scale / 2) - 1;
      return { x: relativeX, y: relativeY ***REMOVED***
***REMOVED***

    function getCoords(elem) { // crossbrowser version
      var box = elem.getBoundingClientRect();

      var body = document.body;
      var docEl = document.documentElement;

      var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
      var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

      var clientTop = docEl.clientTop || body.clientTop || 0;
      var clientLeft = docEl.clientLeft || body.clientLeft || 0;

      var top  = box.top +  scrollTop - clientTop;
      var left = box.left + scrollLeft - clientLeft;

      return { x: Math.round(left), y: Math.round(top) ***REMOVED***;
***REMOVED***

    function scaleFrom(zoomOrigin, currentScale, newScale) {
      var currentShift = getCoordinateShiftDueToScale(originalSize, currentScale);
      var newShift = getCoordinateShiftDueToScale(originalSize, newScale)

      var zoomDistance = newScale - currentScale

      var shift = {
              x: currentShift.x - newShift.x,
              y: currentShift.y - newShift.y,
  ***REMOVED***

      var output = {
          x: zoomOrigin.x * shift.x,
          y: zoomOrigin.y * shift.y,
          z: zoomDistance
  ***REMOVED***
      return output
***REMOVED***


    function getCoordinateShiftDueToScale(size, scale){
      var newWidth = scale * size.width;
      var newHeight = scale * size.height;
      var dx = (newWidth - size.width) / 2
      var dy = (newHeight - size.height) / 2
      return {
        x: dx,
        y: dy
  ***REMOVED***
***REMOVED***

    hammertime.on('pan', function(e) {
      if (lastEvent !== 'pan') {
        fixHammerjsDeltaIssue = {
          x: e.deltaX,
          y: e.deltaY
    ***REMOVED***
  ***REMOVED***

      current.x = last.x + e.deltaX - fixHammerjsDeltaIssue.x;
      current.y = last.y + e.deltaY - fixHammerjsDeltaIssue.y;
      lastEvent = 'pan';
      update();
***REMOVED***);

    hammertime.on('pinch', function(e) {
      var d = scaleFrom(pinchZoomOrigin, last.z, last.z * e.scale)
      current.x = d.x + last.x + e.deltaX;
      current.y = d.y + last.y + e.deltaY;
      current.z = d.z + last.z;
      lastEvent = 'pinch';
      update();
***REMOVED***)

    var pinchZoomOrigin = undefined;
    hammertime.on('pinchstart', function(e) {
      pinchStart.x = e.center.x;
      pinchStart.y = e.center.y;
      pinchZoomOrigin = getRelativePosition(element, { x: pinchStart.x, y: pinchStart.y ***REMOVED***, originalSize, current.z);
      lastEvent = 'pinchstart';
***REMOVED***)

    hammertime.on('panend', function(e) {
      last.x = current.x;
      last.y = current.y;
      lastEvent = 'panend';
***REMOVED***)

    hammertime.on('pinchend', function(e) {
      last.x = current.x;
      last.y = current.y;
      last.z = current.z;
      lastEvent = 'pinchend';
***REMOVED***)

    function update() {
      current.height = originalSize.height * current.z;
      current.width = originalSize.width * current.z;
      element.style.transform = "translate3d(" + current.x + "px, " + current.y + "px, 0) scale(" + current.z + ")";
***REMOVED***
******/
  ***REMOVED***


  let twilight_self = this;
  $('.scoring_card').off();
  $('.scoring_card')
    .mouseover(function() {

      let region = this.id;
      let scoring = twilight_self.calculateScoring(region);
      let total_vp = scoring.us.vp - scoring.ussr.vp;
      let vp_color = "white";

      if (total_vp > 0) { vp_color = "blue" ***REMOVED***
      if (total_vp < 0) { vp_color = "red" ***REMOVED***
      if (total_vp > 20 || total_vp < -20) { total_vp = "WIN" ***REMOVED***

      $(`.display_card#${region***REMOVED***`).show();
      $(`.display_vp#${region***REMOVED***`).html(
        `VP: <div style="color:${vp_color***REMOVED***">&nbsp${total_vp***REMOVED***</div>`
      );
***REMOVED***)
    .mouseout(function() {
      let region = this.id;
      $(`.display_card#${region***REMOVED***`).hide();
***REMOVED***)

***REMOVED***





//
// Core Game Logic
//
handleGameLoop(msg=null) {

  let twilight_self = this;
  let player = "ussr"; if (this.game.player == 2) { player = "us"; ***REMOVED***

  //
  // support observer mode
  //
  if (this.game.player == 0) { player = "observer"; ***REMOVED***


  if (this.game.over == 1) {
    let winner = "ussr";
    if (this.game.winner == 2) { winner = "us"; ***REMOVED***
    let gid = $('#sage_game_id').attr("class");
    if (gid === this.game.id) {
      this.updateStatus("<span>Game Over:</span> "+winner.toUpperCase() + "</span> <span>wins</span>");
***REMOVED***
    return 0;
  ***REMOVED***

  //this.game.state.opponent_cards_in_hand = msg.extra.cards_in_hand;



  ///////////
  // QUEUE //
  ///////////
  if (this.game.queue.length > 0) {

console.log("QUEUE: " + JSON.stringify(this.game.queue));

      let qe = this.game.queue.length-1;
      let mv = this.game.queue[qe].split("\t");
      let shd_continue = 1;

      //
      // cambridge region
      // chernobyl region
      // grainsales sender card
      // missileenvy sender card
      // latinamericandebtcrisis (if USSR can double)
      // che ussr country_of_target1
      //
      // start round
      // flush [discards] // empty discards pile if exists
      // placement (initial placement)
      // ops [us/ussr] card num
      // round
      // move [us/ussr]
      // turn [us/ussr]
      // event [us/ussr] card
      // remove [us/ussr] [us/ussr] countryname influence     // player moving, then player whose ops to remove
      // place [us/ussr] [us/ussr] countryname influence      // player moving, then player whose ops to remove
      // resolve card
      // space [us/ussr] card
      // defcon [lower/raise]
      // notify [msg]
      // coup [us/ussr] countryname influence
      // realign [us/ussr] countryname
      // card [us/ussr] card  --> hand card to play
      // vp [us/ussr] points [delay_settlement_until_end_of_turn=1]
      // discard [us/ussr] card --> discard from hand
      // discard [ussr/us] card
      // deal [1/2]  --- player decides how many cards they need, adds DEAL and clears when ready
      // init
      //
      if (mv[0] == "init") {

***REMOVED***
***REMOVED*** OPTIONAL - players pick sides
***REMOVED***
        let tmpar = this.game.id.split("&");
        if (this.game.options.player1 != undefined) {

  ***REMOVED***
  ***REMOVED*** random pick
  ***REMOVED***
          if (this.game.options.player1 == "random") {
            let roll = this.rollDice(6);
            if (roll <= 3) {
              this.game.options.player1 = "us";
        ***REMOVED*** else {
              this.game.options.player1 = "ussr";
        ***REMOVED***
      ***REMOVED***

          if (tmpar[0] === this.app.wallet.returnPublicKey()) {
            if (this.game.options.player1 == "us") {
              this.game.player = 2;
        ***REMOVED*** else {
              this.game.player = 1;
        ***REMOVED***
      ***REMOVED*** else {
            if (this.game.options.player1 == "us") {
              this.game.player = 1;
        ***REMOVED*** else {
              this.game.player = 2;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***

        this.game.queue.splice(qe, 1);

  ***REMOVED***
      if (mv[0] === "turn") {
        this.game.state.turn_in_round++;
        this.game.state.events.china_card_eligible = 0;
        this.game.queue.splice(qe, 1);
        this.updateActionRound();
  ***REMOVED***
      if (mv[0] === "discard") {
        if (mv[2] === "china") {
  ***REMOVED***
  ***REMOVED*** china card switches hands
  ***REMOVED***
          if (mv[1] == "ussr") {
            this.updateLog("China Card passes to US face down");
            this.game.state.events.china_card = 2;
      ***REMOVED***
          if (mv[1] == "us") {
            this.updateLog("China Card passes to USSR face down");
            this.game.state.events.china_card = 1;
      ***REMOVED***
    ***REMOVED*** else {

	  //
	  // remove from hand if present
	  //
	  this.removeCardFromHand(mv[2]);

	  //
	  // missile envy is an exception, non-player triggers
	  //
	  if (mv[2] == "missileenvy" && this.game.state.events.missile_envy != this.game.player) {
	    this.game.state.events.missile_envy = 0;
	    this.game.state.events.missileenvy = 0;
	  ***REMOVED***

          for (var i in this.game.deck[0].cards) {
            if (mv[2] == i) {
              if (this.game.deck[0].cards[mv[2]] != undefined) {
        ***REMOVED***
        ***REMOVED*** move to discard pile
        ***REMOVED***
                this.updateLog("<span>" + mv[1].toUpperCase() + " discards</span> <span class=\"logcard\" id=\""+mv[2]+"\">" + this.game.deck[0].cards[mv[2]].name + "</span>");
        ***REMOVED***
        ***REMOVED*** discard pile is parallel to normal
        ***REMOVED***
                this.game.deck[0].discards[i] = this.game.deck[0].cards[i];
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
        this.game.queue.splice(qe, 1);
  ***REMOVED***
      //
      // wargames
      //
      if (mv[0] == "wargames") {

        let player = mv[1];
        let activate = parseInt(mv[2]);

        if (activate == 0) {

  ***REMOVED***
  ***REMOVED*** card is discarded, nothing happens
  ***REMOVED***

    ***REMOVED*** else {

          if (player == "us") {
            this.game.state.vp -= 6;
            this.updateVictoryPoints();
            if (this.game.state.vp > 0) {
                this.endGame("us","Wargames");
        ***REMOVED***
            if (this.game.state.vp < 0) {
                this.endGame("ussr","Wargames");
        ***REMOVED***
            if (this.game.state.vp == 0) {
              this.endGame("ussr","Wargames");
        ***REMOVED***
      ***REMOVED*** else {
            this.game.state.vp += 6;
            this.updateVictoryPoints();
            if (this.game.state.vp > 0) {
                this.endGame("us","Wargames");
        ***REMOVED***
            if (this.game.state.vp < 0) {
              this.endGame("ussr","Wargames");
        ***REMOVED***
            if (this.game.state.vp == 0) {
              this.endGame("us","Wargames");
        ***REMOVED***
      ***REMOVED***

    ***REMOVED***

        this.game.queue.splice(qe, 1);
  ***REMOVED***



      //
      // grainsales
      //
      if (mv[0] === "grainsales") {

***REMOVED***
***REMOVED*** this is the ussr telling the
***REMOVED*** us what card they can choose
***REMOVED***
        if (mv[1] == "ussr") {

  ***REMOVED*** remove the command triggering this
          this.game.queue.splice(qe, 1);

          if (this.game.player == 2) {

            let html  = "<span>Grain Sales pulls</span> <span class=\"showcard\" id=\""+mv[2]+"\">" + this.game.deck[0].cards[mv[2]].name + "</span> <span>from USSR. Do you want to play this card?</span>";
            if (mv[2] == "unintervention" && this.game.state.headline == 1) {***REMOVED*** else {
                html += '<ul><li class="card" id="play">play card</li>';
        ***REMOVED***
                html += '<li class="card" id="nope">return card</li>';
                html += '</ul>';
            this.updateStatus(html);

            let twilight_self = this;

            $('.card').off();
            twilight_self.addShowCardEvents();

            $('.card').on('click', function() {
            let action2 = $(this).attr("id");

              if (action2 == "play") {
        ***REMOVED*** trigger play of selected card
                twilight_self.addMove("resolve\tgrainsales");
                twilight_self.playerTurn(mv[2]);
          ***REMOVED***
              if (action2 == "nope") {
                twilight_self.addMove("resolve\tgrainsales");
                twilight_self.addMove("ops\tus\tgrainsales\t2");
                twilight_self.addMove("grainsales\tus\t"+mv[2]);
                twilight_self.endTurn();
          ***REMOVED***
        ***REMOVED***);
      ***REMOVED***
          shd_continue = 0;
    ***REMOVED***

***REMOVED***
***REMOVED*** this is the us telling the
***REMOVED*** ussr they are returning a
***REMOVED*** card
***REMOVED***
        if (mv[1] == "us") {

          if (this.game.player == 1) {
            this.game.deck[0].hand.push(mv[2]);
      ***REMOVED***

          this.game.queue.splice(qe, 1);
          shd_continue = 1;
    ***REMOVED***
  ***REMOVED***
      //
      // Stage
      //
      if (mv[0] == "stage") {
        this.game.queue.splice(qe, 1);
	shd_continue = 1;
  ***REMOVED***
      //
      // Che
      //
      if (mv[0] == "checoup") {

        let target1 = mv[2];
        let original_us = this.countries[mv[2]].us;
        let twilight_self = this;
        let couppower = mv[3];

***REMOVED***
***REMOVED*** this is the first coup, which runs on both
***REMOVED*** computers, so they can collectively see the
***REMOVED*** results.
***REMOVED***
        twilight_self.playCoup("ussr", mv[2], couppower, function() {
          if (twilight_self.countries[mv[2]].us < original_us) {

            let valid_targets = 0;
            for (var i in twilight_self.countries) {
              let countryname = i;
              if ( twilight_self.countries[countryname].bg == 0 && (twilight_self.countries[countryname].region == "africa" || twilight_self.countries[countryname].region == "camerica" || twilight_self.countries[countryname].region == "samerica") && twilight_self.countries[countryname].us > 0 ) {
                if (countryname !== target1) {
                  valid_targets++;
            ***REMOVED***
          ***REMOVED***
        ***REMOVED***

            if (valid_targets == 0) {
              twilight_self.updateLog("No valid targets for Che");
              twilight_self.game.queue.splice(qe, 1);
              shd_continue = 1;
            ***REMOVED*** else {

              if (twilight_self.game.player == 1) {

                twilight_self.addMove("resolve\tchecoup");
                twilight_self.updateStatus("Pick second target for coup:");
                twilight_self.playerFinishedPlacingInfluence();

                let user_message = "Che takes effect. Pick first target for coup:<p></p><ul>";
                    user_message += '<li class="card" id="skipche">or skip coup</li>';
                    user_message += '</ul>';
                twilight_self.updateStatus(user_message);

                $('.card').off();
                $('.card').on('click', function() {
                  let action2 = $(this).attr("id");
                  if (action2 == "skipche") {
                    twilight_self.updateStatus("Skipping Che coups...");
                    twilight_self.addMove("resolve\tchecoup");
                    twilight_self.endTurn();
              ***REMOVED***
            ***REMOVED***);


                for (var i in twilight_self.countries) {
                  let countryname  = i;
                  let divname      = '#'+i;
                  if ( twilight_self.countries[countryname].bg == 0 && (twilight_self.countries[countryname].region == "africa" || twilight_self.countries[countryname].region == "camerica" || twilight_self.countries[countryname].region == "samerica") && countryname !== target1 && twilight_self.countries[countryname].us > 0) {
                    $(divname).off();
                    $(divname).on('click', function() {
                      let c = $(this).attr('id');
                      twilight_self.addMove("coup\tussr\t"+c+"\t"+couppower);
                      twilight_self.endTurn();
                ***REMOVED***);
              ***REMOVED*** else {
                    $(divname).off();
                    $(divname).on('click', function() {
              ***REMOVED*** twilight_self.displayModal("Invalid Target");
                      twilight_self.displayModal("Invalid Target");
                ***REMOVED***);
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***

      ***REMOVED***
      ***REMOVED*** ussr will tell us who to coup next
      ***REMOVED***
              twilight_self.game.queue.splice(qe, 1);
              shd_continue = 0;

        ***REMOVED***


      ***REMOVED*** else {
    ***REMOVED***
    ***REMOVED*** done
    ***REMOVED***
            twilight_self.game.queue.splice(qe, 1);
            shd_continue = 1;
      ***REMOVED***

    ***REMOVED***);

  ***REMOVED***
      //
      // missileenvy \t sender \t card
      //
      if (mv[0] === "missileenvy") {

        let sender = mv[1];
        let card = mv[2];
        let receiver = "us";
        let discarder = "ussr";
        if (sender == 2) { receiver = "ussr"; discarder = "us"; ***REMOVED***

        this.game.state.events.missile_envy = sender;

        let opponent_card = 0;
        if (this.game.deck[0].cards[card].player == "us" && sender == 2) { opponent_card = 1; ***REMOVED***
        if (this.game.deck[0].cards[card].player == "ussr" && sender == 1) { opponent_card = 1; ***REMOVED***

***REMOVED*** remove missileenvy from queue
        this.game.queue.splice(qe, 1);

***REMOVED***
***REMOVED*** play for ops
***REMOVED***
        if (opponent_card == 1) {
          this.game.queue.push("discard\t"+discarder+"\t"+card);
          this.game.queue.push("ops\t"+receiver+"\t"+card+"\t"+this.game.deck[0].cards[card].ops);
          this.game.queue.push("notify\t"+discarder.toUpperCase() + " offers " + this.game.deck[0].cards[card].name + " for OPS");
    ***REMOVED***

***REMOVED***
***REMOVED*** or play for event
***REMOVED***
        if (opponent_card == 0) {
          this.game.queue.push("discard\t"+discarder+"\t"+card);
          this.game.queue.push("event\t"+receiver+"\t"+card);
          this.game.queue.push("notify\t"+discarder.toUpperCase() + " offers " + this.game.deck[0].cards[card].name + " for EVENT");
    ***REMOVED***

***REMOVED***
***REMOVED*** remove card from hand
***REMOVED***
        if (this.game.player == sender) {
          this.removeCardFromHand(card);
    ***REMOVED***

        shd_continue = 1;

  ***REMOVED***
      //
      // quagmire ussr/us card
      //
      if (mv[0] === "quagmire") {

        let roll = this.rollDice(6);

        this.updateLog(mv[1].toUpperCase() + " </span>rolls a<span> " + roll);

        if (roll < 5) {

          if (mv[1] == "ussr") {
            this.game.state.events.beartrap = 0;
              this.updateLog("Bear Trap ends");
      ***REMOVED***
          if (mv[1] == "us") {
            this.game.state.events.quagmire = 0;
              this.updateLog("Quagmire ends");
      ***REMOVED***

    ***REMOVED*** else {
          if (mv[1] == "ussr") {
              this.updateLog("Bear Trap continues...");
      ***REMOVED***
          if (mv[1] == "us") {
              this.updateLog("Quagmire continues...");
      ***REMOVED***
    ***REMOVED***

        this.game.queue.splice(qe, 1);
        shd_continue = 1;

  ***REMOVED***
      //
      // tehran
      //
      if (mv[0] == "tehran") {

        let twilight_self = this;
        let sender  = mv[1];
        let keysnum = mv[2];
        this.game.queue.splice(qe, 1);

        if (sender == "ussr") {

  ***REMOVED***
  ***REMOVED*** ussr has sent keys to decrypt
  ***REMOVED***
          if (this.game.player == 1) {

            for (let i = 0; i < keysnum; i++) { this.game.queue.splice(this.game.queue.length-1, 1); ***REMOVED***
            shd_continue = 0;

      ***REMOVED*** else {

    ***REMOVED***
    ***REMOVED*** us decrypts and decides what to toss
    ***REMOVED***
            var cardoptions = [];
            var pos_to_discard = [];

            for (let i = 0; i < keysnum; i++) {
              cardoptions[i] = this.game.deck[0].crypt[i];
              cardoptions[i] = this.app.crypto.decodeXOR(cardoptions[i], this.game.deck[0].keys[i]);
        ***REMOVED***
            for (let i = 0; i < keysnum; i++) {
              cardoptions[i] = this.app.crypto.decodeXOR(cardoptions[i], this.game.queue[this.game.queue.length-keysnum+i]);
              cardoptions[i] = this.app.crypto.hexToString(cardoptions[i]);
        ***REMOVED***
            for (let i = 0; i < keysnum; i++) {
               this.game.queue.splice(this.game.queue.length-1, 1);
        ***REMOVED***

            let user_message = "Select cards to discard:<p></p><ul>";
            for (let i = 0; i < cardoptions.length; i++) {
              user_message += '<li class="card" id="'+this.game.deck[0].crypt[i]+'_'+cardoptions[i]+'">'+this.game.deck[0].cards[cardoptions[i]].name+'</li>';
        ***REMOVED***
            user_message += '</ul><p></p>When you are done discarding <span class="card dashed" id="finished">click here</span>.';
            twilight_self.updateStatus(user_message);

    ***REMOVED***
    ***REMOVED*** cardoptions is in proper order
    ***REMOVED***
            let cards_discarded = 0;

            $('.card').off();
            $('.card').on('click', function() {

              let action2 = $(this).attr("id");

              if (action2 == "finished") {

                for (let i = 0; i < pos_to_discard.length; i++) { twilight_self.addMove(pos_to_discard[i]); ***REMOVED***
                twilight_self.addMove("tehran\tus\t"+cards_discarded);
                twilight_self.endTurn();

          ***REMOVED*** else {

                let tmpar = action2.split("_");

                    if (twilight_self.app.browser.isMobileBrowser(navigator.userAgent)) {
                  twilight_self.mobileCardSelect(card, player, function() {

                    $(this).hide();
                    pos_to_discard.push(tmpar[0]);
                    cards_discarded++;
                    twilight_self.addMove("discard\tus\t"+tmpar[1]);
                    twilight_self.addMove("notify\tUS discards <span class=\"logcard\" id=\""+tmpar[1]+"\">"+twilight_self.game.deck[0].cards[tmpar[1]].name +"</span>");

              ***REMOVED***, "discard");
                  return 0;

            ***REMOVED*** else {

                  $(this).hide();
                    pos_to_discard.push(tmpar[0]);
                  cards_discarded++;
                  twilight_self.addMove("discard\tus\t"+tmpar[1]);
                  twilight_self.addMove("notify\tUS discards <span class=\"logcard\" id=\""+tmpar[1]+"\">"+twilight_self.game.deck[0].cards[tmpar[1]].name +"</span>");

            ***REMOVED***
          ***REMOVED***
        ***REMOVED***);
      ***REMOVED***

          shd_continue = 0;

    ***REMOVED*** else {

  ***REMOVED***
  ***REMOVED*** us has sent keys to discard back
  ***REMOVED***
          let removedcard = [];
          for (let i = 0; i < keysnum; i++) {
            removedcard[i] = this.game.queue[this.game.queue.length-1];
             this.game.queue.splice(this.game.queue.length-1, 1);
      ***REMOVED***

          for (let i = 0; i < 5; i++) {
            if (removedcard.includes(this.game.deck[0].crypt[i])) {
      ***REMOVED***
      ***REMOVED*** set cards to zero
      ***REMOVED***
              this.game.deck[0].crypt[i] = "";
              this.game.deck[0].keys[i] = "";
        ***REMOVED***
      ***REMOVED***

  ***REMOVED***
  ***REMOVED*** remove empty elements
  ***REMOVED***
          var newcards = [];
          var newkeys  = [];
          for (let i = 0; i < this.game.deck[0].crypt.length; i++) {
            if (this.game.deck[0].crypt[i] != "") {
              newcards.push(this.game.deck[0].crypt[i]);
              newkeys.push(this.game.deck[0].keys[i]);
        ***REMOVED***
      ***REMOVED***

  ***REMOVED***
  ***REMOVED*** keys and cards refreshed
  ***REMOVED***
          this.game.deck[0].crypt = newcards;
          this.game.deck[0].keys = newkeys;

    ***REMOVED***
  ***REMOVED***

      //
      // limit [restriction] [region]
      //
      if (mv[0] == "limit") {
        if (mv[1] == "china") { this.game.state.events.china_card_in_play = 1; ***REMOVED***
        if (mv[1] == "coups") { this.game.state.limit_coups = 1; ***REMOVED***
        if (mv[1] == "spacerace") { this.game.state.limit_spacerace = 1; ***REMOVED***
        if (mv[1] == "realignments") { this.game.state.limit_realignments = 1; ***REMOVED***
        if (mv[1] == "placement") { this.game.state.limit_placement = 1; ***REMOVED***
        if (mv[1] == "milops") { this.game.state.limit_milops = 1; ***REMOVED***
        if (mv[1] == "ignoredefcon") { this.game.state.limit_ignoredefcon = 1; ***REMOVED***
        if (mv[1] == "region") { this.game.state.limit_region += mv[2]; ***REMOVED***
        this.game.queue.splice(qe, 1);
  ***REMOVED***
      if (mv[0] == "flush") {

        if (mv[1] == "discards") {
          this.game.deck[0].discards = {***REMOVED***;
    ***REMOVED***
        this.game.queue.splice(qe, 1);

  ***REMOVED***
      //
      // latinamericandebtcrisis
      //
      if (mv[0] == "latinamericandebtcrisis") {

        let twilight_self = this;


        if (this.game.player == 2) {
          this.game.queue.splice(qe, 1);
          return 0;
    ***REMOVED***

        if (this.game.player == 1) {

          this.game.queue.splice(qe, 1);

          let countries_to_double = 0;
          for (var i in this.countries) {
            if (this.countries[i].region == "samerica") {
              if (this.countries[i].ussr > 0) { countries_to_double++; ***REMOVED***
        ***REMOVED***
      ***REMOVED***
          if (countries_to_double > 2) { countries_to_double = 2; ***REMOVED***
          if (countries_to_double == 0) {
            this.addMove("notify\tUSSR has no countries with influence to double");
            this.endTurn();
            return 0;
      ***REMOVED***


          this.updateStatus("<span>Select</span> "+countries_to_double+" <span>countries in South America to double USSR influence</span>");

  ***REMOVED***
  ***REMOVED*** double influence in two countries
  ***REMOVED***
          for (var i in this.countries) {

            let countryname  = i;
            let divname      = '#'+i;

            if (this.countries[i].region == "samerica") {

              if (this.countries[i].ussr > 0 ) {
                twilight_self.countries[countryname].place = 1;
          ***REMOVED***

              $(divname).off();
              $(divname).on('click', function() {

                let countryname = $(this).attr('id');

                if (twilight_self.countries[countryname].place == 1) {
                  let ops_to_place = twilight_self.countries[countryname].ussr;
                  twilight_self.placeInfluence(countryname, ops_to_place, "ussr", function() {
                    twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t" + ops_to_place);
                      twilight_self.countries[countryname].place = 0;
                    countries_to_double--;
                    if (countries_to_double == 0) {
                      twilight_self.playerFinishedPlacingInfluence();
                      twilight_self.endTurn();
                ***REMOVED***
              ***REMOVED***);
            ***REMOVED*** else {
          ***REMOVED*** twilight_self.displayModal("Invalid Target");
                  twilight_self.displayModal("InvalidTarget");
            ***REMOVED***
          ***REMOVED***);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
        return 0;
  ***REMOVED***
      //
      // north sea oil bonus turn
      //
      if (mv[0] == "northsea") {
        if (this.game.player == 1) {
          let html  = "US determining whether to take extra turn";
          this.updateStatus(html);
    ***REMOVED***
        if (this.game.player == 2) {
          let html  = "<span>Do you wish to take an extra turn:<span><p></p><ul>";
          html += '<li class="card" id="play">play turn</li>';
          html += '<li class="card" id="nope">no turn</li>';
          html += '</ul>';
          this.updateStatus(html);

          let twilight_self = this;

          $('.card').off();
          $('.card').on('click', function() {

            let action2 = $(this).attr("id");

            if (action2 == "play") {
                twilight_self.addMove("resolve\tnorthsea");
                twilight_self.addMove("play\t2");
                twilight_self.endTurn();
        ***REMOVED***
            if (action2 == "nope") {
                twilight_self.addMove("resolve\tnorthsea");
                twilight_self.addMove("play\t2");
                twilight_self.endTurn();
        ***REMOVED***

      ***REMOVED***);
    ***REMOVED***
        shd_continue = 0;
  ***REMOVED***
      //
      // space race  us/ussr card
      //
      if (mv[0] == "space") {
        this.playerSpaceCard(mv[2], mv[1]);
        this.game.deck[0].discards[mv[2]] = this.game.deck[0].cards[mv[2]];
        this.game.queue.splice(qe, 1);
  ***REMOVED***
      //
      // unlimit
      //
      if (mv[0] == "unlimit") {
        if (mv[1] == "china") { this.game.state.events_china_card_in_play = 0; ***REMOVED***
        if (mv[1] == "cmc") { this.game.state.events.cubanmissilecrisis = 0; ***REMOVED***
        if (mv[1] == "coups") { this.game.state.limit_coups = 0; ***REMOVED***
        if (mv[1] == "spacerace") { this.game.state.limit_spacerace = 0; ***REMOVED***
        if (mv[1] == "realignments") { this.game.state.limit_realignments = 0; ***REMOVED***
        if (mv[1] == "placement") { this.game.state.limit_placement = 0; ***REMOVED***
        if (mv[1] == "milops") { this.game.state.limit_milops = 0; ***REMOVED***
        if (mv[1] == "ignoredefcon") { this.game.state.limit_ignoredefcon = 0; ***REMOVED***
        if (mv[1] == "region") { this.game.state.limit_region = ""; ***REMOVED***
        this.game.queue.splice(qe, 1);
  ***REMOVED***
      //
      // chernobyl
      //
      if (mv[0] == "chernobyl") {
        this.game.state.events.chernobyl = mv[1];
        this.game.queue.splice(qe, 1);
  ***REMOVED***
      //
      // burn die roll
      //
      if (mv[0] == "dice") {
        if (mv[1] == "burn") {
          if (this.game.player == 1 && mv[2] == "ussr") {
            roll = this.rollDice(6);
      ***REMOVED***
          if (this.game.player == 2 && mv[2] == "us")   {
            roll = this.rollDice(6);
      ***REMOVED***
    ***REMOVED***
        this.game.queue.splice(qe, 1);
  ***REMOVED***
      //
      // aldrich ames
      //
      if (mv[0] == "aldrichreveal") {

        if (this.game.player == 2) {

          let cards_to_reveal = this.game.deck[0].hand.length;
          let revealed = "";
          for (let i = 0; i < this.game.deck[0].hand.length; i++) {
            if (i > 0) { revealed += ", "; ***REMOVED***
            revealed += this.game.deck[0].hand[i];
      ***REMOVED***
          this.addMove("notify\tUS hand contains: "+revealed);
          this.endTurn();
    ***REMOVED***

        this.game.queue.splice(qe, 1);
        return 0;

  ***REMOVED***
      if (mv[0] == "aldrich") {

***REMOVED***
***REMOVED*** us telling ussr their hand
***REMOVED***
        if (mv[1] == "us") {

          let num = mv[2];
          let html = "<span>Aldrich Ames triggered. USSR discard card from US hand:<span><p></p><ul>";
          this.game.queue.splice(qe, 1);

          for (let i = 0; i < num; i++) {
            let uscard = this.game.queue[this.game.queue.length-1];
            html += '<li class="card showcard" id="'+uscard+'">'+this.game.deck[0].cards[uscard].name+'</li>';
            this.game.queue.splice(this.game.queue.length-1, 1);
      ***REMOVED***
          html += '</ul>';

          if (this.game.player == 2) {
            this.updateStatus("USSR is playing Aldrich Ames");
      ***REMOVED***

          if (this.game.player == 1) {

            this.updateStatus(html);

            let twilight_self = this;

            $('.card').off();
            twilight_self.addShowCardEvents();
            $('.card').on('click', function() {

              let action2 = $(this).attr("id");
              twilight_self.addMove("aldrich\tussr\t"+action2);
              twilight_self.endTurn();

        ***REMOVED***);
      ***REMOVED***

          shd_continue = 0;
    ***REMOVED***


        if (mv[1] == "ussr") {

          if (this.game.player == 2) {
            this.removeCardFromHand(mv[2]);
      ***REMOVED***

          this.game.queue.splice(qe, 1);
          this.updateLog("<span>USSR discards </span><span class=\"logcard\" id=\""+mv[2]+"\">"+this.game.deck[0].cards[mv[2]].name + "</span>");
          shd_continue = 1;
    ***REMOVED***

  ***REMOVED***
      //
      // cambridge five
      //
      if (mv[0] === "cambridge") {
        if (this.game.player == 1) {
          let placetxt = player.toUpperCase() + " place 1 OP in";
          for (let b = 1; b < mv.length; b++) {
            placetxt += " ";
            placetxt += mv[b];
      ***REMOVED***
          twilight_self.updateStatus(placetxt);
          for (let i = 1; i < mv.length; i++) {
            for (var k in this.countries) {

      ***REMOVED***
      ***REMOVED*** names of cards differ for these two. update so region matches
      ***REMOVED***
              if (mv[i] == "centralamerica") { mv[i] = "camerica"; ***REMOVED***
              if (mv[i] == "southamerica") { mv[i] = "samerica"; ***REMOVED***

              if (this.countries[k].region.indexOf(mv[i]) > -1) {
                let divname = "#"+k;
                $(divname).off();
                $(divname).on('click',function() {
                  let countryname = $(this).attr('id');
                  twilight_self.playerFinishedPlacingInfluence();
                  twilight_self.countries[countryname].ussr += 1;
                  twilight_self.showInfluence(countryname, "ussr");
                  twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
                  twilight_self.endTurn();
            ***REMOVED***);
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
        this.game.queue.splice(qe, 1);
        shd_continue = 0;
  ***REMOVED***
      //
      // tear down this wall
      //
      if (mv[0] === "teardownthiswall") {

        if (this.game.player == 1) {
          this.updateStatus("US playing Tear Down This Wall");
          return 0;
    ***REMOVED***

        let user_message = "<span>Tear Down this Wall is played -- US may make 3 OP free Coup Attempt or Realignments in Europe.</span><p></p><ul>";
            user_message += '<li class="card" id="taketear"><span>make coup or realign</span></li>';
            user_message += '<li class="card" id="skiptear"><span>skip coup</span></li>';
            user_message += '</ul>';
        twilight_self.updateStatus(user_message);


        $('.card').off();
        $('.card').on('click', function() {

          let action2 = $(this).attr("id");

            if (action2 == "skiptear") {
            twilight_self.updateStatus("<span>Skipping Tear Down this Wall...</span>");
            twilight_self.addMove("resolve\tteardownthiswall");
            twilight_self.endTurn();
      ***REMOVED***

            if (action2 == "taketear") {
            twilight_self.addMove("resolve\tteardownthiswall");
            twilight_self.addMove("unlimit\tignoredefcon");
            twilight_self.addMove("unlimit\tregion");
            twilight_self.addMove("unlimit\tplacement");
            twilight_self.addMove("unlimit\tmilops");
            twilight_self.addMove("ops\tus\tteardown\t3");
            twilight_self.addMove("limit\tmilops");
            twilight_self.addMove("limit\tplacement");
            twilight_self.addMove("limit\tregion\tasia");
            twilight_self.addMove("limit\tregion\tmideast");
            twilight_self.addMove("limit\tregion\tsamerica");
            twilight_self.addMove("limit\tregion\tcamerica");
            twilight_self.addMove("limit\tregion\tafrica");
            twilight_self.addMove("limit\tignoredefcon");
            twilight_self.endTurn();
      ***REMOVED***

    ***REMOVED***);

        shd_continue = 0;

  ***REMOVED***
      if (mv[0] === "deal") {
        if (this.game.player == mv[1]) {

          let cards_needed_per_player = 8;
          if (this.game.state.round >= 4) { cards_needed_per_player = 9; ***REMOVED***

          let ussr_cards = this.game.deck[0].hand.length;
          for (let z = 0; z < this.game.deck[0].hand.length; z++) {
            if (this.game.deck[0].hand[z] == "china") {
              ussr_cards--;
        ***REMOVED***
      ***REMOVED***
          let us_cards   = this.game.state.opponent_cards_in_hand;

          if (this.game.player == 2) {
            let x = ussr_cards;
            ussr_cards = us_cards;
            us_cards = x;
      ***REMOVED***

          let us_cards_needed = cards_needed_per_player - us_cards;
          let ussr_cards_needed = cards_needed_per_player - ussr_cards;
          reshuffle_limit = us_cards_needed + ussr_cards_needed;

console.log("\n\n\n-------debugging-------");
console.log("CARDS IN MY DECK: " + this.game.deck[0].hand.length);
console.log("US cards needed: " + us_cards_needed);
console.log("USSR cards needed: " + ussr_cards_needed);
console.log("\n\n\n");

          if (mv[1] == 1) {
            this.addMove("resolve\tdeal");
            this.addMove("DEAL\t1\t"+mv[1]+"\t"+ussr_cards_needed);
      ***REMOVED*** else {
            this.addMove("resolve\tdeal");
            this.addMove("DEAL\t1\t"+mv[1]+"\t"+us_cards_needed);
      ***REMOVED***
          this.endTurn();
    ***REMOVED*** else {
          this.updateStatus("<span>Opponent is being dealt new cards.</span>");
    ***REMOVED***
        this.updateStatus(player.toUpperCase() + "</span> <span>is fetching new cards</span>");
        return 0;
  ***REMOVED***
      if (mv[0] === "ops") {
        if (this.game.deck[0].cards[mv[2]] != undefined) { this.game.state.event_name = this.game.deck[0].cards[mv[2]].name; ***REMOVED***
        this.updateLog("<span>" + mv[1].toUpperCase() + " plays </span><span class=\"logcard\" id=\""+mv[2]+"\">" + this.game.state.event_name + "</span> <span>for " + mv[3] + " OPS</span>");
***REMOVED***
***REMOVED*** unset formosan if China card played by US
***REMOVED***
        if (mv[1] == "us" && mv[2] == "china") { 
	  this.game.state.events.formosan = 0; 
	  $('.formosan').hide();
	***REMOVED***
        this.playOps(mv[1], mv[3], mv[2]);
        shd_continue = 0;
  ***REMOVED***
      if (mv[0] === "milops") {
        this.updateLog(mv[1].toUpperCase() + "</span> <span>receives</span> <span>" + mv[2] + "</span> <span>milops");
        if (mv[1] === "us") {
          this.game.state.milops_us += parseInt(mv[2]);
    ***REMOVED*** else {
          this.game.state.milops_ussr += parseInt(mv[2]);
    ***REMOVED***
        this.updateMilitaryOperations();
        this.game.queue.splice(qe, 1);
  ***REMOVED***
      if (mv[0] === "vp") {
        if (mv.length > 3) {
          if (parseInt(mv[3]) == 1) {
            this.updateLog(mv[1].toUpperCase() + "</span> <span>receives</span> " + mv[2] + " <span>VP");
            if (mv[1] === "us") {
              this.game.state.vp_outstanding += parseInt(mv[2]);
        ***REMOVED*** else {
              this.game.state.vp_outstanding -= parseInt(mv[2]);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED*** else {
          this.updateLog(mv[1].toUpperCase() + "</span> <span>receives</span> <span>" + mv[2] + "</span> <span>VP");
          if (mv[1] === "us") {
            this.game.state.vp += parseInt(mv[2]);
      ***REMOVED*** else {
            this.game.state.vp -= parseInt(mv[2]);
      ***REMOVED***
          this.updateVictoryPoints();
    ***REMOVED***
        this.game.queue.splice(qe, 1);
  ***REMOVED***
      if (mv[0] === "coup") {

	let card = "";
	if (mv.length >= 5) { card = mv[4]; ***REMOVED***

        this.updateLog("<span>" + mv[1].toUpperCase() + "</span> <span>coups</span> <span>" + this.countries[mv[2]].name + "</span> <span>with</span> <span>" + mv[3] + "</span> <span>OPS</span>"); 
        if (this.game.state.limit_milops != 1) {
	  //
	  // modify ops is handled incoherently with milops, so we calculate afresh here
	  //
	  // reason is that modify ops is run before submitting coups sometimes and sometimes now
	  //
	  if (card != "") {
            if (mv[1] == "us") { this.game.state.milops_us += this.modifyOps(parseInt(mv[3]), card, 2); ***REMOVED***
            if (mv[1] == "ussr") { this.game.state.milops_ussr += this.modifyOps(parseInt(mv[3]), card, 1); ***REMOVED***
	  ***REMOVED*** else {
            if (mv[1] == "us") { this.game.state.milops_us += this.modifyOps(parseInt(mv[3]), "", 2); ***REMOVED***
            if (mv[1] == "ussr") { this.game.state.milops_ussr += this.modifyOps(parseInt(mv[3]), "", 1); ***REMOVED***
	  ***REMOVED***
          this.updateMilitaryOperations();
     ***REMOVED***
	//
	// do not submit card, ops already modified
	//
        this.playCoup(mv[1], mv[2], mv[3]);
        this.game.queue.splice(qe, 1);
  ***REMOVED***


      if (mv[0] === "realign") {
        this.updateLog("<span>" + mv[1].toUpperCase() + " <span>realigns</span> <span>" + this.countries[mv[2]].name + "</span> <span>with 1 OPS</span>");
        if (mv[1] != player) { this.playRealign(mv[2]); ***REMOVED***
        this.game.queue.splice(qe, 1);
  ***REMOVED***
      if (mv[0] === "defcon") {
        if (mv[1] == "lower") {
            this.lowerDefcon();
          if (this.game.state.defcon <= 0) {
            if (this.game.state.headline == 1) {
	      if (this.game.state.player_to_go == 1) {
		this.endGame("us", "headline defcon suicide!");
	  ***REMOVED*** else {
		this.endGame("ussr", "headline defcon suicide!");
	  ***REMOVED***
	      return;
	***REMOVED***
            if (this.game.state.turn == 0) {
              this.endGame("ussr", "defcon");
        ***REMOVED*** else {
              this.endGame("us", "defcon");
        ***REMOVED***
	    return;
      ***REMOVED***
    ***REMOVED***
        if (mv[1] == "raise") {
             this.game.state.defcon++;
          if (this.game.state.defcon > 5) { this.game.state.defcon = 5; ***REMOVED***
          this.updateDefcon();
    ***REMOVED***
        this.game.queue.splice(qe, 1);
  ***REMOVED***
      if (mv[0] === "notify") {
        this.updateLog(mv[1]);
        this.game.queue.splice(qe, 1);
  ***REMOVED***
      if (mv[0] === "move") {
        if (mv[1] == "ussr") { this.game.state.move = 0; ***REMOVED***
        if (mv[1] == "us") { this.game.state.move = 1; ***REMOVED***
        this.game.queue.splice(qe, 1);
  ***REMOVED***
      if (mv[0] === "event") {

        if (this.game.deck[0].cards[mv[2]] != undefined) { this.game.state.event_name = this.game.deck[0].cards[mv[2]].name; ***REMOVED***
        this.updateLog("<span>" + mv[1].toUpperCase() + "</span> <span>triggers</span> <span class=\"logcard\" id=\""+mv[2]+"\">" + this.game.state.event_name + "</span> <span>event</span>");

        shd_continue = this.playEvent(mv[1], mv[2]);

***REMOVED***
***REMOVED*** show active events
***REMOVED***
        this.updateEventTiles();

        if (shd_continue == 0) {

  ***REMOVED***
  ***REMOVED*** game will stop
  ***REMOVED***
  ***REMOVED***this.game.saveGame(this.game.id);

    ***REMOVED*** else {

  ***REMOVED***
  ***REMOVED*** only continue if we do not stop
  ***REMOVED***
          if (mv[1] == "china") {
      ***REMOVED*** else {

    ***REMOVED***
    ***REMOVED*** remove non-recurring events from game
    ***REMOVED***
            for (var i in this.game.deck[0].cards) {
              if (mv[2] == i) {
                if (this.game.deck[0].cards[i].recurring != 1) {

                  let event_removal = 1;

          ***REMOVED***
          ***REMOVED*** Wargames not removed if DEFCON > 2
          ***REMOVED***
                  if (this.game.state.defcon > 2 && mv[2] == "wargames") {
                    event_removal = 0;
              ***REMOVED***

          ***REMOVED***
          ***REMOVED*** NATO not removed if prerequisitcs not met
          ***REMOVED***
                  if (this.game.state.events.nato == 0 && mv[2] == "nato") {
                    event_removal = 0;
              ***REMOVED***

          ***REMOVED***
          ***REMOVED*** Solidarity not removed if Pope John Paul II not in play
          ***REMOVED***
                  if (this.game.state.events.johnpaul == 0 && mv[2] == "solidarity") {
                    event_removal = 0;
              ***REMOVED***

          ***REMOVED***
          ***REMOVED*** Star Wars not removed if not triggered
          ***REMOVED***
                  if (this.game.state.events.starwars == 0 && mv[2] == "starwars") {
                    event_removal = 0;
              ***REMOVED***


          ***REMOVED***
          ***REMOVED*** Our Man in Tehran not removed if not triggered
          ***REMOVED***
                  if (this.game.state.events.ourmanintehran == 0 && mv[2] == "ourmanintehran") {
                    event_removal = 0;
              ***REMOVED***


          ***REMOVED***
          ***REMOVED*** Kitchen Debates not removed if not triggered
          ***REMOVED***
                  if (this.game.state.events.kitchendebates == 0 && mv[2] == "kitchendebates") {
                    event_removal = 0;
              ***REMOVED***


                  if (event_removal == 1) {

                    this.updateLog("<span>" + this.game.deck[0].cards[i].name + "</span> <span>removed from game</span>");
                    this.game.deck[0].removed[i] = this.game.deck[0].cards[i];
                    delete this.game.deck[0].cards[i];

              ***REMOVED*** else {

            ***REMOVED*** just discard -- NATO catch mostly
                    this.updateLog("<span>" + this.game.deck[0].cards[i].name + "</span> <span>discarded</span>");
                      this.game.deck[0].discards[i] = this.game.deck[0].cards[i];

              ***REMOVED***
            ***REMOVED*** else {
                  this.updateLog("<span>" + this.game.deck[0].cards[i].name + "</span> <span>discarded</span>");
                    this.game.deck[0].discards[i] = this.game.deck[0].cards[i];
            ***REMOVED***
            ***REMOVED***
        ***REMOVED***
      ***REMOVED***

  ***REMOVED*** delete event if not deleted already
          this.game.queue.splice(qe, 1);
    ***REMOVED***
  ***REMOVED***
      if (mv[0] === "place") {
        if (player != mv[1]) { this.placeInfluence(mv[3], parseInt(mv[4]), mv[2]); ***REMOVED***
        this.game.queue.splice(qe, 1);
  ***REMOVED***
      if (mv[0] === "setvar") {

        if (mv[1] == "opponent_cards_in_hand") {
	  this.game.state.opponent_cards_in_hand = parseInt(mv[2]);
	***REMOVED***

        this.game.queue.splice(qe, 1);

  ***REMOVED***
      if (mv[0] === "remove") {
        if (player != mv[1]) { this.removeInfluence(mv[3], parseInt(mv[4]), mv[2]); ***REMOVED***
        this.showInfluence(mv[3], "us");
        this.showInfluence(mv[3], "ussr");
        this.game.queue.splice(qe, 1);
  ***REMOVED***
      if (mv[0] === "resolve") {

***REMOVED***
***REMOVED*** eliminate junta
***REMOVED***
        if (mv[1] === "junta") { this.game.state.events.junta = 0; ***REMOVED***

        if (qe == 0) {
            this.game.queue = [];
    ***REMOVED*** else {

          let le = qe-1;

  ***REMOVED***
  ***REMOVED*** resolving UN intervention means disabling the effect
  ***REMOVED***
          if (mv[1] == "unintervention") {

    ***REMOVED***
    ***REMOVED*** UNIntervention causing issues with USSR when US plays
    ***REMOVED*** force the event to reset in ALL circumstances
    ***REMOVED***
            this.game.state.events.unintervention = 0;

            let lmv = this.game.queue[le].split("\t");
            if (lmv[0] == "event" && lmv[2] == mv[1]) {
              this.game.state.events.unintervention = 0;
        ***REMOVED***

      ***REMOVED***
  ***REMOVED***
  ***REMOVED*** we can remove the event if it is immediately above us in the queue
  ***REMOVED***
          if (le <= 0) {
            this.game.queue = [];
      ***REMOVED*** else {

            let lmv = this.game.queue[le].split("\t");
            let rmvd = 0;

            if (lmv[0] == "headline" && mv[1] == "headline") {
              this.game.queue.splice(le, 2);
              rmvd = 1;
        ***REMOVED***
            if (lmv[0] == "ops" && mv[1] == "ops") {
              this.game.queue.splice(le, 2);
              rmvd = 1;
        ***REMOVED***
            if (lmv[0] == "play" && mv[1] == "play") {
              this.game.queue.splice(le, 2);
              rmvd = 1;
        ***REMOVED***
            if (lmv[0] == "event" && lmv[2] == mv[1]) {
              this.game.queue.splice(le, 2);
              rmvd = 1;
        ***REMOVED***
            if (lmv[0] == "placement" && mv[1] == "placement") {
              this.game.queue.splice(le, 2);
              rmvd = 1;
        ***REMOVED***
            if (lmv[0] == "placement_bonus" && mv[1] == "placement_bonus") {
              this.game.queue.splice(le, 2);
              rmvd = 1;
        ***REMOVED***
	    if (lmv[0] == "deal" && mv[1] == "deal") {
              this.game.queue.splice(le, 2);
              rmvd = 1;
        ***REMOVED***
            if (lmv[0] == "discard" && lmv[2] == mv[1]) {
              this.game.queue.splice(qe, 1);
              rmvd = 1;
        ***REMOVED***
            if (lmv[0] === mv[1]) {	// "discard teardownthiswall"
              this.game.queue.splice(le, 2);
              rmvd = 1;
        ***REMOVED***
            if (rmvd == 0) {

      ***REMOVED***
      ***REMOVED*** remove the event
      ***REMOVED***
              this.game.queue.splice(qe, 1);

      ***REMOVED***
      ***REMOVED*** go back through the queue and remove any event tht matches this one
      ***REMOVED***
              for (let z = le, zz = 1; z >= 0 && zz == 1; z--) {
                let tmplmv = this.game.queue[z].split("\t");
                if (tmplmv.length > 0) {
                  if (tmplmv[0] === "event") {
                    if (tmplmv.length > 2) {
                      if (tmplmv[2] === mv[1]) {
console.log("resolving earlier: " + this.game.queue[z]);
                        this.game.queue.splice(z);
                        zz = 0;
                  ***REMOVED***
                ***REMOVED***
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***

***REMOVED***
***REMOVED*** remove non-recurring events from game
***REMOVED***
        for (var i in this.game.deck[0].cards) {
          if (mv[1] == i) {
            if (this.game.deck[0].cards[i].recurring != 1) {
              this.updateLog("<span>" + this.game.deck[0].cards[i].name + "</span> <span>removed from game</span>");
              this.game.deck[0].removed[i] = this.game.deck[0].cards[i];
              delete this.game.deck[0].cards[i];
        ***REMOVED*** else {
              this.updateLog("<span>" + this.game.deck[0].cards[i].name + "</span> <span>discarded</span>");
              this.game.deck[0].discards[i] = this.game.deck[0].cards[i];
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***


  ***REMOVED***
      if (mv[0] === "placement") {

***REMOVED***
***REMOVED*** TESTING
***REMOVED***
***REMOVED*** if you want to hardcode the hands of the players, you can set
***REMOVED*** them manually here. Be sure that all of the cards have been
***REMOVED*** dealt into the DECK during the setup phase though.
***REMOVED***

        if (this.is_testing == 1) {
          if (this.game.player == 1) {
            this.game.deck[0].hand = ["wwby","fiveyearplan", "berlinagreement", "junta", "che","degaulle","nato","naziscientist","missileenvy","formosan"];
      ***REMOVED*** else {
            this.game.deck[0].hand = ["duckandcover","degaulle","lonegunman","cubanmissile","handshake","lonegunman","asia","nasser","sadat"];
      ***REMOVED***
    ***REMOVED***

console.log("IN PLACEMENT");

***REMOVED***
***REMOVED*** add china card
***REMOVED***
        this.game.deck[0].cards["china"] = this.returnChinaCard();
        if (this.game.player == 1) {
          let hand_contains_china = 0;
          for (let x = 0; x < this.game.deck[0].hand.length; x++) {
            if (this.game.deck[0].hand[x] == "china") { hand_contains_china = 1; ***REMOVED***
      ***REMOVED***
          if (hand_contains_china == 0) {
            if (! this.game.deck[0].hand.includes("china")) {
              this.game.deck[0].hand.push("china");
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***

        if (mv[1] == 1) {
          if (this.game.player == mv[1]) {
            this.playerPlaceInitialInfluence("ussr");
      ***REMOVED*** else {
            this.updateStatusAndListCards('USSR is making its initial placement of influence:');
      ***REMOVED***
    ***REMOVED*** else {
          if (this.game.player == mv[1]) {
            this.playerPlaceInitialInfluence("us");
      ***REMOVED*** else {
            this.updateStatusAndListCards('US is making its initial placement of influence:');
      ***REMOVED***
    ***REMOVED***

***REMOVED***
***REMOVED*** do not remove from queue -- handle RESOLVE on endTurn submission
***REMOVED***
        return 0;

  ***REMOVED***
      if (mv[0] === "placement_bonus") {
        if (mv[1] == 1) {
          if (this.game.player == mv[1]) {
            this.playerPlaceBonusInfluence("ussr", mv[2]);
      ***REMOVED*** else {
            this.updateStatusAndListCards(`USSR is making its bonus placement of ${mv[2]***REMOVED*** influence`);
      ***REMOVED***
    ***REMOVED*** else {
          if (this.game.player == mv[1]) {
            this.playerPlaceBonusInfluence("us", mv[2]);
      ***REMOVED*** else {
            this.updateStatusAndListCards(`US is making its bonus placement of ${mv[2]***REMOVED*** influence`);
      ***REMOVED***
    ***REMOVED***

***REMOVED***
***REMOVED*** do not remove from queue -- handle RESOLVE on endTurn submission
***REMOVED***
        return 0;

  ***REMOVED***

      if (mv[0] === "headline") {

	let stage  = "headline1";
        let player = 1;
	let hash   = "";
	let xor    = "";
	let card   = "";

	if (mv.length > 2) {	  
	  stage = mv[1];
	  player = parseInt(mv[2]);
	***REMOVED***

        if (stage === "headline1") {
	  this.game.state.defectors_pulled_in_headline = 0;
    ***REMOVED***

        if (mv.length > 3) { hash = mv[3]; ***REMOVED***
        if (mv.length > 4) { xor = mv[4]; ***REMOVED***
	if (mv.length > 5) { card = mv[5]; ***REMOVED***

console.log("HEADLINE: " + stage + " -- " + player + " -- " + hash + " -- " + xor + " -- " + card);

        let x = this.playHeadlineModern(stage, player, hash, xor, card);

	//
	// do not remove from queue -- handle RESOLVE on endTurn submission
	//
	return 0;

  ***REMOVED***
      if (mv[0] === "round") {


***REMOVED***
***REMOVED*** NORAD
***REMOVED***
        if (this.game.state.us_defcon_bonus == 1) {
          if (this.isControlled("us", "canada") == 1) {

            let twilight_self = this;
            this.game.state.us_defcon_bonus = 0;

            if (this.game.player == 1) {
              this.updateStatus("NORAD triggers: US places 1 influence in country with US influence");
              this.updateLog("NORAD triggers: US places 1 influence in country with US influence");
              return 0;
        ***REMOVED***
            if (this.game.player == 2) {
            this.updateLog("NORAD triggers: US places 1 influence in country with US influence");
              for (var i in this.countries) {

                let countryname  = i;
                let divname      = '#'+i;

                if (this.countries[countryname].us > 0) {

                    this.updateStatus("Place your NORAD bonus: (1 OP)");

                    $(divname).off();
                    $(divname).on('click', function() {

            ***REMOVED*** no need for this end-of-round
            ***REMOVED*** twilight_self.addMove("resolve\tturn");

                    let countryname = $(this).attr('id');
                    twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
                    twilight_self.placeInfluence(countryname, 1, "us", function() {
                      twilight_self.playerFinishedPlacingInfluence();
                      twilight_self.endTurn();
                ***REMOVED***);
              ***REMOVED***);
            ***REMOVED***
          ***REMOVED***
        ***REMOVED***
            return 0;
      ***REMOVED*** else {
            this.game.state.us_defcon_bonus = 0;
      ***REMOVED***
    ***REMOVED***

***REMOVED***
***REMOVED*** prevent DEFCON bonus from carrying over to next round
***REMOVED***
        this.game.state.us_defcon_bonus = 0;


***REMOVED***
***REMOVED*** settle outstanding VP issue
***REMOVED***
        this.settleVPOutstanding();


***REMOVED***
***REMOVED*** show active events
***REMOVED***
        this.updateEventTiles();

        if (this.game.state.events.northseaoil_bonus == 1) {

          this.game.state.events.northseaoil_bonus = 0;
          if (this.game.player == 1) {
            this.updateStatus("US is deciding whether to take extra turn");
            return 0;
      ***REMOVED***

  ***REMOVED***
  ***REMOVED*** US gets extra move
  ***REMOVED***
          let html  = "<span>Do you want to take an extra turn: (North Sea Oil)</span><p></p><ul>";
              html += '<li class="card" id="play">play extra turn</li>';
              html += '<li class="card" id="nope">do not play</li>';
              html += '</ul>';
          this.updateStatus(html);

          let twilight_self = this;

          $('.card').off();
          $('.card').on('click', function() {

            let action2 = $(this).attr("id");

            if (action2 == "play") {
              twilight_self.addMove("play\t2");
              twilight_self.endTurn(1);
        ***REMOVED***
            if (action2 == "nope") {
              twilight_self.addMove("notify\tUS does not play extra turn");
              twilight_self.endTurn(1);
        ***REMOVED***

      ***REMOVED***);

          return 0;

    ***REMOVED***


***REMOVED***
***REMOVED*** Eagle Has Landed
***REMOVED***
        if (this.game.state.eagle_has_landed != "" && this.game.state.eagle_has_landed_bonus_taken == 0 && this.game.state.round > 0) {

          this.game.state.eagle_has_landed_bonus_taken = 1;

          let bonus_player = 1;
          if (this.game.state.eagle_has_landed == "us") { bonus_player = 2; ***REMOVED***

          if (this.game.player != bonus_player) {
            this.updateStatus(this.game.state.eagle_has_landed.toUpperCase() + " </span> <span>is deciding whether to discard a card");
	    //
	    // commented-out 2019-09-18
	    //
    ***REMOVED***this.saveGame(this.game.id);
            return 0;
      ***REMOVED***

  ***REMOVED***
  ***REMOVED*** DISCARD CARD
  ***REMOVED***
          let html  = "<span>US may discard a card: (Eagle Has Landed)</span><p></p><ul>";
          if (bonus_player == 1) { html  = "<span>USSR may discard a card: (Bear Has Landed)</span><p></p><ul>"; ***REMOVED***
              html += '<li class="card" id="discard">discard card</li>';
              html += '<li class="card" id="nope">do not discard</li>';
              html += '</ul>';
          this.updateStatus(html);

          let twilight_self = this;

          $('.card').off();
          $('.card').on('click', function() {

            let action2 = $(this).attr("id");

            if (action2 == "nope") {
              twilight_self.addMove("notify\t"+twilight_self.game.state.eagle_has_landed.toUpperCase()+" does not discard a card");
              twilight_self.endTurn(1);
        ***REMOVED***

            if (action2 == "discard") {

              let cards_discarded = 0;

              let cards_to_discard = 0;
              let user_message = "<span>Select card to discard:</span><p></p><ul>";
              for (let i = 0; i < twilight_self.game.deck[0].hand.length; i++) {
                if (twilight_self.game.deck[0].hand[i] != "china") {
                  user_message += '<li class="card showcard" id="'+twilight_self.game.deck[0].hand[i]+'">'+twilight_self.game.deck[0].cards[twilight_self.game.deck[0].hand[i]].name+'</li>';
                  cards_to_discard++;
            ***REMOVED***
          ***REMOVED***

              if (cards_to_discard == 0) {
                twilight_self.updateStatus("<span>No cards available to discard! Please wait for next turn...</span>");
                twilight_self.addMove("notify\tUS has no cards available to discard");
                twilight_self.endTurn(1);
	***REMOVED***
	***REMOVED*** commented-out 2019-09-18
	***REMOVED***
        ***REMOVED***twilight_self.saveGame(twilight_self.game.id);
                return;
          ***REMOVED***

              user_message += '</ul><p></p></span>If you wish to cancel your discard,</span> <span class="card dashed" id="finished">click here</span>.';
              twilight_self.updateStatus(user_message);

              $('.card').off();
              twilight_self.addShowCardEvents();
              $('.card').on('click', function() {

                let action2 = $(this).attr("id");

                if (action2 == "finished") {
                  twilight_self.endTurn(1);
            ***REMOVED*** else {
                  $(this).hide();
                  twilight_self.hideCard();
                  twilight_self.updateStatus("Discarding...");
                  cards_discarded++;
                  twilight_self.removeCardFromHand(action2);
                  twilight_self.addMove("discard\t"+twilight_self.game.state.eagle_has_landed+"\t"+action2);
                  twilight_self.addMove("notify\t"+twilight_self.game.state.eagle_has_landed.toUpperCase()+" discards <span class=\"logcard\" id=\""+action2+"\">"+twilight_self.game.deck[0].cards[action2].name + "</span>");
                  twilight_self.endTurn(1);
                  return 0;
            ***REMOVED***
          ***REMOVED***);
        ***REMOVED***

            return 0;

      ***REMOVED***);

          return 0;

    ***REMOVED***




***REMOVED***
***REMOVED*** Space Shuttle
***REMOVED***
        if (this.game.state.space_shuttle != "" && this.game.state.space_shuttle_bonus_taken == 0 && this.game.state.round > 0) {

          this.game.state.space_shuttle_bonus_taken = 1;

          let bonus_player = 1;
          if (this.game.state.space_shuttle == "us") { bonus_player = 2; ***REMOVED***

          if (this.game.player != bonus_player) {
            this.updateStatus(this.game.state.space_shuttle.toUpperCase() + "</span> <span>is deciding whether to take extra turn");
            return 0;
      ***REMOVED***

  ***REMOVED***
  ***REMOVED*** player gets extra move
  ***REMOVED***
          let html  = "<span>Do you want to take an extra turn: (Space Shuttle)</span><p></p><ul>";
              html += '<li class="card" id="play">play extra turn</li>';
              html += '<li class="card" id="nope">do not play</li>';
              html += '</ul>';
          this.updateStatus(html);

          let twilight_self = this;

          $('.card').off();
          $('.card').on('click', function() {

            let action2 = $(this).attr("id");

            if (action2 == "play") {
              twilight_self.addMove("play\t"+bonus_player);
              twilight_self.endTurn(1);
        ***REMOVED***
            if (action2 == "nope") {
              twilight_self.addMove("notify\t"+twilight_self.game.state.space_shuttle.toUpperCase()+" does not play extra turn");
              twilight_self.endTurn(1);
        ***REMOVED***

      ***REMOVED***);

          return 0;

    ***REMOVED***



***REMOVED***
***REMOVED*** if we have come this far, move to the next turn
***REMOVED***
        if (this.game.state.round > 0) {
          this.updateLog("End of Round");
    ***REMOVED***
        this.endRound();

        this.updateStatus("<span>Preparing for round</span> " + this.game.state.round);

        let rounds_in_turn = 6;
        if (this.game.state.round > 3) { rounds_in_turn = 7; ***REMOVED***

        for (let i = 0; i < rounds_in_turn; i++) {
          this.game.queue.push("turn");
          this.game.queue.push("play\t2");
          this.game.queue.push("play\t1");
    ***REMOVED***
        this.game.queue.push("headline");
        this.game.state.headline = 0;


***REMOVED***
***REMOVED*** END GAME IF WE MAKE IT !
***REMOVED***
        if (this.game.state.round == 11) {
          this.finalScoring();
    ***REMOVED***


***REMOVED***
***REMOVED*** DEAL MISSING CARDS
***REMOVED***
        if (this.game.state.round > 1) {

          this.updateLog(this.game.deck[0].crypt.length + " <span>cards remaining in deck...</span>");

          this.game.queue.push("deal\t2");
          this.game.queue.push("deal\t1");

          let reshuffle_limit = 14;

          let cards_needed_per_player = 8;
          if (this.game.state.round >= 4) { cards_needed_per_player = 9; ***REMOVED***

          let ussr_cards = this.game.deck[0].hand.length;
          for (let z = 0; z < this.game.deck[0].hand.length; z++) {
            if (this.game.deck[0].hand[z] == "china") {
              ussr_cards--;
        ***REMOVED***
      ***REMOVED***
          let us_cards   = this.game.state.opponent_cards_in_hand;

          if (this.game.player == 2) {
            let x = ussr_cards;
            ussr_cards = us_cards;
            us_cards = x;
      ***REMOVED***

          let us_cards_needed = cards_needed_per_player - us_cards;
          let ussr_cards_needed = cards_needed_per_player - ussr_cards;
          reshuffle_limit = us_cards_needed + ussr_cards_needed;

          if (this.game.deck[0].crypt.length < reshuffle_limit) {

    ***REMOVED***
    ***REMOVED*** no need to reshuffle in turn 4 or 8 as we have new cards inbound
    ***REMOVED***
            if (this.game.state.round != 4 && this.game.state.round != 8) {

      ***REMOVED***
      ***REMOVED*** this resets discards = {***REMOVED*** so that DECKBACKUP will not retain
      ***REMOVED***
              let discarded_cards = this.returnDiscardedCards();
              if (Object.keys(discarded_cards).length > 0) {

        ***REMOVED***
        ***REMOVED*** shuffle in discarded cards
        ***REMOVED***
                this.game.queue.push("SHUFFLE\t1");
                this.game.queue.push("DECKRESTORE\t1");
                this.game.queue.push("DECKENCRYPT\t1\t2");
                this.game.queue.push("DECKENCRYPT\t1\t1");
                this.game.queue.push("DECKXOR\t1\t2");
                this.game.queue.push("DECKXOR\t1\t1");
                this.game.queue.push("DECK\t1\t"+JSON.stringify(discarded_cards));
                this.game.queue.push("DECKBACKUP\t1");
                this.updateLog("Shuffling discarded cards back into the deck...");

          ***REMOVED***

      ***REMOVED***
      ***REMOVED*** deal existing cards before
      ***REMOVED*** we shuffle the discards into the
      ***REMOVED*** deck
      ***REMOVED***
              let cards_available = this.game.deck[0].crypt.length;
              let player2_cards = Math.floor(cards_available / 2);
              let player1_cards = cards_available - player2_cards;;

      ***REMOVED***
      ***REMOVED*** adjust distribution of cards
      ***REMOVED***
              if (player2_cards > us_cards_needed) {
                let surplus_cards = player2_cards - us_cards_needed;
                player2_cards = us_cards_needed;
                player1_cards += surplus_cards;
          ***REMOVED***
              if (player1_cards > ussr_cards_needed) {
                let surplus_cards = player1_cards - ussr_cards_needed;
                player1_cards = ussr_cards_needed;
                player2_cards += surplus_cards;
          ***REMOVED***

              if (player1_cards > 0) {
                this.game.queue.push("DEAL\t1\t2\t"+player2_cards);
                this.game.queue.push("DEAL\t1\t1\t"+player1_cards);
          ***REMOVED***
              this.updateStatus("Dealing remaining cards from draw deck before reshuffling...");
              this.updateLog("Dealing remaining cards from draw deck before reshuffling...");

        ***REMOVED***

      ***REMOVED***



          if (this.game.state.round == 4) {

            this.game.queue.push("SHUFFLE\t1");
            this.game.queue.push("DECKRESTORE\t1");
            this.game.queue.push("DECKENCRYPT\t1\t2");
            this.game.queue.push("DECKENCRYPT\t1\t1");
            this.game.queue.push("DECKXOR\t1\t2");
            this.game.queue.push("DECKXOR\t1\t1");
            this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnMidWarCards()));
            this.game.queue.push("DECKBACKUP\t1");
            this.updateLog("Adding Mid War cards to the deck...");

      ***REMOVED***


          if (this.game.state.round == 8) {

            this.game.queue.push("SHUFFLE\t1");
            this.game.queue.push("DECKRESTORE\t1");
            this.game.queue.push("DECKENCRYPT\t1\t2");
            this.game.queue.push("DECKENCRYPT\t1\t1");
            this.game.queue.push("DECKXOR\t1\t2");
            this.game.queue.push("DECKXOR\t1\t1");
            this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnLateWarCards()));
            this.game.queue.push("DECKBACKUP\t1");
            this.updateLog("Adding Late War cards to the deck...");

      ***REMOVED***
    ***REMOVED***

        return 1;
  ***REMOVED***
      if (mv[0] === "play") {

***REMOVED***
***REMOVED*** it is no longer the headline
***REMOVED***
        this.game.state.headline = 0;

***REMOVED***
***REMOVED*** resolve outstanding VP
***REMOVED***
        this.settleVPOutstanding();

***REMOVED***
***REMOVED*** show active events
***REMOVED***
        this.updateEventTiles();


        if (mv[1] == 1) {
          this.game.state.turn = 0;
     ***REMOVED***
        if (mv[1] == 2) { this.game.state.turn = 1; ***REMOVED***

***REMOVED***
***REMOVED*** deactivate cards
***REMOVED***
        this.game.state.events.china_card_eligible = 0;

	//
	// back button functions again
	//
        this.game.state.back_button_cancelled = 0;

***REMOVED***
***REMOVED*** NORAD
***REMOVED***
        if (this.game.state.us_defcon_bonus == 1) {
          if (this.isControlled("us", "canada") == 1) {

            let twilight_self = this;
            this.game.state.us_defcon_bonus = 0;

            if (this.game.player == 1) {
              this.updateStatus("NORAD triggers: US places 1 influence in country with US influence");
              this.updateLog("NORAD triggers: US places 1 influence in country with US influence");
              return 0;
        ***REMOVED***
            if (this.game.player == 2) {
            this.updateLog("NORAD triggers: US places 1 influence in country with US influence");
              for (var i in this.countries) {

                let countryname  = i;
                let divname      = '#'+i;

                if (this.countries[countryname].us > 0) {

                    this.updateStatus("US place NORAD bonus: (1 OP)");

                    $(divname).off();
                    $(divname).on('click', function() {

                    twilight_self.addMove("resolve\tturn");

                    let countryname = $(this).attr('id');
                    twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
                    twilight_self.placeInfluence(countryname, 1, "us", function() {
                      twilight_self.playerFinishedPlacingInfluence();
                      twilight_self.endTurn();
                ***REMOVED***);
              ***REMOVED***);
            ***REMOVED***
          ***REMOVED***
        ***REMOVED***
            return 0;
      ***REMOVED*** else {
            this.game.state.us_defcon_bonus = 0;
      ***REMOVED***
    ***REMOVED***

        this.updateDefcon();
        this.updateActionRound();
        this.updateSpaceRace();
        this.updateVictoryPoints();
        this.updateMilitaryOperations();
        this.updateRound();

        this.playMove(msg);
        return 0;
  ***REMOVED***


      //
      // avoid infinite loops
      //
      if (shd_continue == 0) {
        console.log("NOT CONTINUING");
        return 0;
  ***REMOVED***


  ***REMOVED*** // if cards in queue
  return 1;

***REMOVED***





playHeadlineModern(stage, player, hash="", xor="", card="") {

  this.game.state.headline = 1;

  //
  // NO HEADLINE PEEKING
  //
  if (this.game.state.man_in_earth_orbit == "") {

    //
    // USSR picks
    //
    if (stage == "headline1") {

      //
      // both players reset headline info
      //
      this.game.state.headline_hash  		= "";
      this.game.state.headline_xor   		= "";
      this.game.state.headline_card  		= "";
      this.game.state.headline_opponent_hash  	= "";
      this.game.state.headline_opponent_xor   	= "";
      this.game.state.headline_opponent_card  	= "";

      if (this.game.player == player) {
        this.updateLog("USSR selecting headline card");
	this.addMove("resolve\theadline");
        this.playerPickHeadlineCard();
  ***REMOVED*** else {
        this.updateStatusAndListCards(`Waiting for USSR to pick headline card`);
  ***REMOVED***

      return 0;
***REMOVED***

    //
    // US picks
    //
    if (stage == "headline2") {
      if (this.game.player == player) {

        this.game.state.headline_opponent_hash = hash;

        this.updateLog("US selecting headline card");
	this.addMove("resolve\theadline");
        this.playerPickHeadlineCard();

  ***REMOVED*** else {

        this.updateStatusAndListCards(`Waiting for US to pick headline card`);

  ***REMOVED***
      return 0;
***REMOVED***


    //
    // USSR sends XOR
    //
    if (stage == "headline3") {
      if (this.game.player == player) {

        this.game.state.headline_opponent_hash = hash;

        this.updateLog("Initiating blind headline card swap");

	this.addMove("resolve\theadline");
	this.addMove("headline\theadline4\t"+2+"\t"+this.game.state.headline_hash+"\t"+this.game.state.headline_xor+"\t"+this.game.state.headline_card);
	this.endTurn();

  ***REMOVED*** else {

        this.updateLog("Waiting for USSR to confirm card selection");

  ***REMOVED***
      return 0;
***REMOVED***


    //
    // US confirms USSR XOR and sends its XOR
    //
    if (stage == "headline4") {
      if (this.game.player == player) {

        this.game.state.headline_opponent_xor  = xor;
        this.game.state.headline_opponent_card = card;

        if (this.game.state.headline_opponent_hash != this.app.crypto.encodeXOR(this.app.crypto.stringToHex(this.game.state.headline_opponent_card), this.game.state.headline_opponent_xor)) {
          alert("PLAYER 1 HASH WRONG: -- this is a development error message that can be triggered if the opponent attempts to cheat by changing their selected card after sharing the encrypted hash. It can also be rarely caused if one or both players reload or have unreliable connections during the headline exchange process. The solution in this case is for both players to reload until the game hits the first turn. " + this.game.state.headline_opponent_hash + " -- " + this.game.state.headline_opponent_card + " -- " + this.game.state.headline_opponent_xor + " -- " + this.app.crypto.encodeXOR(this.app.crypto.stringToHex(this.game.state.headline_opponent_card), this.game.state.headline_opponent_xor));
    ***REMOVED***

        this.updateLog("Initiating blind headline card swap");

	this.addMove("resolve\theadline");
	this.addMove("headline\theadline5\t"+1+"\t"+this.game.state.headline_hash+"\t"+this.game.state.headline_xor+"\t"+this.game.state.headline_card);
	this.endTurn();

  ***REMOVED*** else {

        this.updateLog("Waiting for US to confirm card selection");

  ***REMOVED***
      return 0;
***REMOVED***


    //
    // USSR confirms US XOR
    //
    if (stage == "headline5") {
      if (this.game.player == player) {

        this.game.state.headline_opponent_xor  = xor;
        this.game.state.headline_opponent_card = card;

        if (this.game.state.headline_opponent_hash != this.app.crypto.encodeXOR(this.app.crypto.stringToHex(this.game.state.headline_opponent_card), this.game.state.headline_opponent_xor)) {
          alert("PLAYER 2 HASH WRONG: -- this is a development error message that can be triggered if the opponent attempts to cheat by changing their selected card after sharing the encrypted hash. It can also be rarely caused if one or both players reload or have unreliable connections during the headline exchange process. The solution in this case is for both players to reload until the game hits the first turn. " + this.game.state.headline_opponent_hash + " -- " + this.game.state.headline_opponent_card + " -- " + this.game.state.headline_opponent_xor + " -- " + this.app.crypto.encodeXOR(this.app.crypto.stringToHex(this.game.state.headline_opponent_card), this.game.state.headline_opponent_xor));
    ***REMOVED***

        this.updateLog("Initiating blind headline card swap");

	this.addMove("resolve\theadline");
	this.addMove("headline\theadline6\t"+2+"\t"+this.game.state.headline_hash+"\t"+this.game.state.headline_xor+"\t"+this.game.state.headline_card);
	this.endTurn();

  ***REMOVED*** else {

        this.updateLog("Waiting for US to confirm card selection");

  ***REMOVED***
      return 0;
***REMOVED***



  ***REMOVED*** // end man-in-earth orbit




  //
  // man in earth orbit = HEADLINE PEEKING
  //
  else {

    //
    // first remember we are in the headline phase
    //
    this.game.state.headline = 1;

    let first_picker = 2;
    let second_picker = 1;
    let playerside = "US";

    if (this.game.state.man_in_earth_orbit === "us") { first_picker = 1; second_picker = 2; playerside = "USSR"; ***REMOVED***


    //
    // first player sends card 
    //
    if (stage == "headline1") {

      if (this.game.player == first_picker) {
        this.updateLog(playerside + " selecting headline card first");
	this.addMove("resolve\theadline");
	this.playerPickHeadlineCard();
  ***REMOVED*** else {
        this.updateStatusAndListCards(playerside + ' picks headline card first');
  ***REMOVED***
      return 0;

***REMOVED***



    //
    // second player sends card 
    //
    if (stage == "headline2") {

      if (this.game.player == second_picker) {

        this.game.state.headline_opponent_hash = hash;
        this.game.state.headline_opponent_xor = xor;
        this.game.state.headline_opponent_card = card;

        this.updateLog(playerside + " selecting headline card player");
	this.addMove("resolve\theadline");
	this.playerPickHeadlineCard();

  ***REMOVED*** else {
        this.updateStatusAndListCards('Opponent picking headline card second');
  ***REMOVED***
      return 0;

***REMOVED***



    //
    // first player gets second player pick, then we move on....
    //
    if (stage == "headline3") {

      if (this.game.player == first_picker) {

        this.game.state.headline_opponent_hash = hash;
        this.game.state.headline_opponent_xor = xor;
        this.game.state.headline_opponent_card = card;

  ***REMOVED***

      stage = "headline6";

***REMOVED***

  ***REMOVED*** // end man-in-earth-orbit









  //
  // default to ussr
  //
  this.game.state.player_to_go = 1;

  //
  // headline execution starts here
  //
  if (stage == "headline6") {

    this.updateLog("Moving into first headline card event");

    let my_card = this.game.state.headline_card;
    let opponent_card = this.game.state.headline_opponent_card;

    if (this.game.player == 1) {
      if (this.returnOpsOfCard(my_card) > this.returnOpsOfCard(opponent_card)) {
        this.game.state.player_to_go = 1;
  ***REMOVED*** else {
        this.game.state.player_to_go = 2;
  ***REMOVED***
***REMOVED***
    if (this.game.player == 2) {
      if (this.returnOpsOfCard(my_card) >= this.returnOpsOfCard(opponent_card)) {
        this.game.state.player_to_go = 2;
  ***REMOVED*** else {
        this.game.state.player_to_go = 1;
  ***REMOVED***
***REMOVED***

    let player = "ussr";
    let opponent = "us";
    if (this.game.player == 2) { player = "us"; opponent = "ussr"; ***REMOVED***
    let card_player = player;

    //
    // headline4 is our FIRST headline card
    // headline5 is our SECOND headline card
    //
    let shd_continue = 1;

    //
    // check to see if defectors is live
    //
    let us_plays_defectors = 0;
    let ussr_plays_defectors = 0;

    if (my_card == "defectors") {
      if (opponent == "ussr") {
        us_plays_defectors = 1;
  ***REMOVED***
      if (opponent == "us") {
        ussr_plays_defectors = 1;
  ***REMOVED***
***REMOVED*** else {
      if (opponent_card == "defectors") {
        if (opponent == "ussr") {
            ussr_plays_defectors = 1;
    ***REMOVED***
        if (opponent == "us") {
            us_plays_defectors = 1;
    ***REMOVED***
  ***REMOVED***
***REMOVED***


    if (us_plays_defectors == 1) {

      this.updateLog("<span>US headlines</span> <span class=\"logcard\" id=\"defectors\">Defectors</span>");

      this.game.turn = [];
      if (my_card != "defectors") {
        this.updateLog("<span>USSR headlines</span> <span class=\"logcard\" id=\""+my_card+"\">"+this.game.deck[0].cards[my_card].name+"</span>");
  ***REMOVED*** else {
        this.updateLog("<span>USSR headlines</span> <span class=\"logcard\" id=\""+opponent_card+"\">"+this.game.deck[0].cards[opponent_card].name+"</span>");
  ***REMOVED***

      this.updateLog("Defectors cancels USSR headline.");
      this.updateStatus("Defectors cancels USSR headline. Moving into first turn...");

      //
      // only one player should trigger next round
      //
      if (this.game.player == 1) {
        this.addMove("resolve\theadline");
        this.addMove("discard\tus\tdefectors");
        this.addMove("discard\tussr\t"+my_card);
        this.endTurn();
  ***REMOVED***

***REMOVED*** else {

      // show headline card information to both players
      if (this.game.player == 1) {
        this.updateStatus("<span>US headlines</span> <span class=\"showcard\" id=\""+opponent_card+"\">"+this.game.deck[0].cards[opponent_card].name+"</span>. USSR headlines <span class=\"showcard\" id=\""+my_card+"\">"+this.game.deck[0].cards[my_card].name+"</span>");
        this.updateLog("<span>US headlines</span> <span class=\"logcard\" id=\""+opponent_card+"\">"+this.game.deck[0].cards[opponent_card].name+"</span>.");
        this.updateLog("<span>USSR headlines</span> <span class=\"logcard\" id=\""+my_card+"\">"+this.game.deck[0].cards[my_card].name+"</span>");
  ***REMOVED*** else {
        this.updateStatus("<span>USSR headlines</span> <span class=\"showcard\" id=\""+opponent_card+"\">"+this.game.deck[0].cards[opponent_card].name+"</span>. US headlines <span class=\"showcard\" id=\""+my_card+"\">"+this.game.deck[0].cards[my_card].name+"</span>");
        this.updateLog("<span>USSR headlines <span class=\"logcard\" id=\""+opponent_card+"\">"+this.game.deck[0].cards[opponent_card].name+"</span>.");
        this.updateLog("<span>US headlines <span class=\"logcard\" id=\""+my_card+"\">"+this.game.deck[0].cards[my_card].name+"</span>");
  ***REMOVED***



      if (this.game.state.player_to_go == this.game.player) {
	this.addMove("resolve\theadline");
	this.addMove("headline\theadline7\t"+2+"\t"+this.game.state.headline_hash+"\t"+this.game.state.headline_xor+"\t"+this.game.state.headline_card);
        this.addMove("event\t"+card_player+"\t"+my_card);
        this.addMove("discard\t"+card_player+"\t"+my_card);
        this.addMove("discard\t"+opponent+"\t"+opponent_card);
        this.removeCardFromHand(my_card);
        this.endTurn();
  ***REMOVED***
***REMOVED***
    return 0;
  ***REMOVED***




  //
  // second player plays headline card
  // 
  if (stage == "headline7") {

    let my_card = this.game.state.headline_card;
    let opponent_card = this.game.state.headline_opponent_card;

    //
    // we switch to the other player now
    //
    if (this.game.player == 1) {
      if (this.game.deck[0].cards[my_card] == undefined) { this.game.state.player_to_go = 2; ***REMOVED*** else {
        if (this.game.deck[0].cards[opponent_card] == undefined) { this.game.state.player_to_go = 1; ***REMOVED*** else {
          if (this.returnOpsOfCard(my_card) > this.returnOpsOfCard(opponent_card)) {
            this.game.state.player_to_go = 2;
      ***REMOVED*** else {
            this.game.state.player_to_go = 1;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    if (this.game.player == 2) {
      if (this.game.deck[0].cards[my_card] == undefined) { this.game.state.player_to_go = 1; ***REMOVED*** else {
        if (this.game.deck[0].cards[opponent_card] == undefined) { this.game.state.player_to_go = 2; ***REMOVED*** else {
          if (this.returnOpsOfCard(my_card) >= this.returnOpsOfCard(opponent_card)) {
            this.game.state.player_to_go = 1;
      ***REMOVED*** else {
            this.game.state.player_to_go = 2;
      ***REMOVED***
      ***REMOVED***
  ***REMOVED***
***REMOVED***


    let player = "ussr";
    let opponent = "us";
    if (this.game.player == 2) { player = "us"; opponent = "ussr"; ***REMOVED***
    let card_player = player;

    if (player == "ussr" && this.game.state.defectors_pulled_in_headline == 1) {
      if (this.game.state.player_to_go == this.game.player) {
        this.addMove("resolve\theadline");
        this.addMove("notify\tDefectors cancels USSR headline. Tough luck, there.");
        this.removeCardFromHand(my_card);
        this.endTurn();
  ***REMOVED***
***REMOVED*** else {
      if (this.game.state.player_to_go == this.game.player) {
        this.addMove("resolve\theadline");
        this.addMove("event\t"+card_player+"\t"+my_card);
        this.removeCardFromHand(my_card);
        this.endTurn();
  ***REMOVED***
***REMOVED***

    return 0;

  ***REMOVED***

  return 1;
***REMOVED***





playMove(msg) {

  this.game.state.headline  = 0;
  this.game.state.headline_hash = "";
  this.game.state.headline_card = "";
  this.game.state.headline_xor = "";
  this.game.state.headline_opponent_hash = "";
  this.game.state.headline_opponent_card = "";
  this.game.state.headline_opponent_xor = "";


  //
  // how many turns left?
  //
  let rounds_in_turn = 6;
  if (this.game.state.round > 3) { rounds_in_turn = 7; ***REMOVED***
  let moves_remaining = rounds_in_turn - this.game.state.turn_in_round;


  //
  //
  //
  let scoring_cards_available = 0;
  for (i = 0; i < this.game.deck[0].hand.length; i++) {
    if (this.game.deck[0].cards[this.game.deck[0].hand[i]] != undefined) {
      if (this.game.deck[0].cards[this.game.deck[0].hand[i]].scoring == 1) { scoring_cards_available++; ***REMOVED***
***REMOVED***
  ***REMOVED***

  //
  // player 1 moves
  //
  if (this.game.state.turn == 0) {
    if (this.game.player == 1) {
      if (this.game.state.turn_in_round == 0) {
        this.game.state.turn_in_round++;
        this.updateActionRound();
  ***REMOVED***
      if (this.game.state.events.missile_envy == 1) {

***REMOVED***
***REMOVED*** if must play scoring card -- moves remaining at 0 in last move
***REMOVED***
        if (scoring_cards_available > moves_remaining) {
          this.playerTurn("scoringcard");
    ***REMOVED*** else {

  ***REMOVED***
  ***REMOVED*** if cannot sacrifice missile envy to bear trap because red purged
  ***REMOVED***
          if (this.game.state.events.beartrap == 1 && this.game.state.events.redscare_player1 == 1) {
            this.playerTurn();
      ***REMOVED*** else {
            this.playerTurn("missileenvy");
      ***REMOVED***
    ***REMOVED***
  ***REMOVED*** else {
        this.playerTurn();
  ***REMOVED***
***REMOVED*** else {
      this.updateStatusAndListCards(`Waiting for USSR to move`);
      if (this.game.state.turn_in_round == 0) {
        this.game.state.turn_in_round++;
        this.updateActionRound();
  ***REMOVED***
***REMOVED***
    return;
  ***REMOVED***

  //
  // player 2 moves
  //
  if (this.game.state.turn == 1) {

    if (this.game.player == 2) {

      if (this.game.state.turn_in_round == 0) {
        this.removeCardFromHand(this.game.state.headline_card);
  ***REMOVED***

      if (this.game.state.events.missile_envy == 2) {

***REMOVED***
***REMOVED*** moves remaining will be 0 last turn
***REMOVED***
        if (scoring_cards_available > moves_remaining) {
          this.playerTurn("scoringcard");
    ***REMOVED*** else {

  ***REMOVED***
  ***REMOVED*** if cannot sacrifice missile envy to quagmire because red scare
  ***REMOVED***
          if (this.game.state.events.quagmire == 1 && this.game.state.events.redscare_player2 == 1) {
            this.playerTurn();
      ***REMOVED*** else {
            this.playerTurn("missileenvy");
      ***REMOVED***

    ***REMOVED***
  ***REMOVED*** else {
        this.playerTurn();
  ***REMOVED***
***REMOVED*** else {
      // this.updateStatus("Waiting for US to move");
      this.updateStatusAndListCards(`Waiting for US to move`);
***REMOVED***
    return;
  ***REMOVED***


  return 1;

***REMOVED***






playOps(player, ops, card) {

  //
  // modify ops
  //
  ops = this.modifyOps(ops, card);

  let me = "ussr";
  let twilight_self = this;

  // reset events / DOM
  twilight_self.playerFinishedPlacingInfluence();

  if (this.game.player == 2) { me = "us"; ***REMOVED***

  if (player === me) {

    let html = twilight_self.formatPlayOpsStatus(player, ops);
    twilight_self.updateStatus(html);

    $('.card').off();
    $('.card').on('click', function() {

      let action2 = $(this).attr("id");

      //
      // prevent ops hang
      //
      twilight_self.addMove("resolve\tops");

      if (action2 == "place") {

        let j = ops;
        let html = twilight_self.formatStatusHeader("Place " + j + " influence", true)
        twilight_self.updateStatus(html);
        twilight_self.prePlayerPlaceInfluence(player);
        if (j == 1) {
          twilight_self.uneventOpponentControlledCountries(player, card);
    ***REMOVED***
        twilight_self.playerPlaceInfluence(player, (country, player) => {

          j--;

  ***REMOVED***
  ***REMOVED*** breaking control must be costly
  ***REMOVED***
          if (twilight_self.game.break_control == 1) {
            j--;
            if (j < 0) { twilight_self.endRegionBonus(); j = 0; ***REMOVED***
      ***REMOVED***
          twilight_self.game.break_control = 0;

          if (j < 2) {
            twilight_self.uneventOpponentControlledCountries(player, card);
      ***REMOVED***

          let html = twilight_self.formatStatusHeader("Place " + j + " influence", true)
          twilight_self.updateStatus(html);

          if (j <= 0) {
            if (twilight_self.isRegionBonus(card) == 1) {
              twilight_self.updateStatus("Place regional bonus");
              j++;
              twilight_self.limitToRegionBonus();
              twilight_self.endRegionBonus();
        ***REMOVED*** else {
              twilight_self.playerFinishedPlacingInfluence();
              twilight_self.endTurn();
              return;
        ***REMOVED***
      ***REMOVED***


          twilight_self.bindBackButtonFunction(() => {
	    //
    ***REMOVED*** If the placement array is full, then
    ***REMOVED*** undo all of the influence placed this turn
	    //
            if (twilight_self.undoMove(action2, ops - j)) { 
              twilight_self.playOps(player, ops, card);
	***REMOVED***
	  ***REMOVED***);

    ***REMOVED***);

  ***REMOVED***

      if (action2 == "coup") {
 
        let html = twilight_self.formatStatusHeader("Pick a country to coup", true);
        twilight_self.updateStatus(html);
        twilight_self.playerCoupCountry(player, ops, card);

***REMOVED*** return;
  ***REMOVED***


      if (action2 == "realign") {

        let html = twilight_self.formatStatusHeader(`Realign with ${ops***REMOVED*** OPS, or:`, true);
        html += `<p></p><ul><li class=\"card\" id=\"cancelrealign\">end turn</li></ul>`;
        twilight_self.updateStatus(html);

        $('.card').off();
        $('.card').on('click', function() {

          let action2 = $(this).attr("id");
          if (action2 == "cancelrealign") {
            twilight_self.addMove("notify\t"+player.toUpperCase()+" opts to end realignments");
            twilight_self.endTurn();
            return;
      ***REMOVED***

    ***REMOVED***);

        let j = ops;
        twilight_self.playerRealign(player, card, () => {

  ***REMOVED***
  ***REMOVED*** disable countries without
  ***REMOVED***
          for (var countryname in twilight_self.countries) {

            let divname3 = "#"+countryname;

            if (twilight_self.game.player == 1) {
              if (twilight_self.countries[countryname].us < 1) {
                $(divname3).off();
                $(divname3).on('click',()=>{ twilght_self.displayModal('Invalid Realign Target'); ***REMOVED***);
          ***REMOVED***
        ***REMOVED*** else {
              if (twilight_self.countries[countryname].ussr < 1) {
                $(divname3).off();
                $(divname3).on('click',()=>{ twilght_self.displayModal('Invalid Realign Target'); ***REMOVED***);
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***


          j--;

          twilight_self.updateStatus("Realign with " + j + " OPS, or:<p></p><ul><li class=\"card\" id=\"cancelrealign\">stop realigning</li></ul>");
          let html = twilight_self.formatStatusHeader(`Realign with ${j***REMOVED*** OPS, or:`, true);
          html += `<p></p><ul><li class=\"card\" id=\"cancelrealign\">end turn</li></ul>`;
          twilight_self.updateStatus(html);

          $('.card').off();
          $('.card').on('click', function() {

            let action2 = $(this).attr("id");
            if (action2 == "cancelrealign") {

      ***REMOVED***
      ***REMOVED*** reverse order of realigns
      ***REMOVED***
      ***REMOVED*** they need to be executed in the order that we did them for bonuses to work properly
      ***REMOVED***
              let new_moves = [];
              for (let z = twilight_self.moves.length-1; z >= 0; z--) {
                let tmpar = twilight_self.moves[z].split("\t");
                if (tmpar[0] === "realign") {
                  new_moves.push(twilight_self.moves[z]);
            ***REMOVED*** else {
                  new_moves.unshift(twilight_self.moves[z])
            ***REMOVED***
          ***REMOVED***
              twilight_self.moves = new_moves;
              twilight_self.endTurn();
              return;
        ***REMOVED***
      ***REMOVED***);


          if (j <= 0) {
            if (twilight_self.isRegionBonus(card) == 1) {
              twilight_self.updateStatus("Realign with bonus OP");
              j++;
              twilight_self.limitToRegionBonus();
              twilight_self.endRegionBonus();
        ***REMOVED*** else {

      ***REMOVED***
      ***REMOVED*** reverse order of realigns
      ***REMOVED***
      ***REMOVED*** they need to be executed in the order that we did them for bonuses to work properly
      ***REMOVED***
              let new_moves = [];
              for (let z = twilight_self.moves.length-1; z >= 0; z--) {
                let tmpar = twilight_self.moves[z].split("\t");
                if (tmpar[0] === "realign") {
                  new_moves.push(twilight_self.moves[z]);
            ***REMOVED*** else {
                  new_moves.unshift(twilight_self.moves[z])
            ***REMOVED***
          ***REMOVED***
              twilight_self.moves = new_moves;
              twilight_self.endTurn();
              return;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***

      twilight_self.bindBackButtonFunction(() => {
	twilight_self.playOps(player, ops, card);
  ***REMOVED***);

***REMOVED***);
  ***REMOVED***

  return;

***REMOVED***

confirmEvent() {
  return confirm("Confirm your desire to play this event");
***REMOVED***

formatPlayOpsStatus(player, ops) {
  let html = `<span>${player.toUpperCase()***REMOVED*** plays ${ops***REMOVED*** OPS:</span><p></p><ul>`;
  if (this.game.state.limit_placement == 0) { html += '<li class="card" id="place">place influence</li>'; ***REMOVED***
  if (this.game.state.limit_coups == 0) { html += '<li class="card" id="coup">launch coup</li>'; ***REMOVED***
  if (this.game.state.limit_realignments == 0) { html += '<li class="card" id="realign">realign country</li>'; ***REMOVED***
  html += '</ul>';
  return html;
***REMOVED***

bindBackButtonFunction(mycallback) {
  $('#back_button').off();
  $('#back_button').on('click', mycallback);
***REMOVED***



playerPickHeadlineCard() {

  let twilight_self = this;

  if (this.browser_active == 0) { return; ***REMOVED***

  let player = "us";
  if (this.game.player == 1) { player = "ussr"; ***REMOVED***
  let x = "";

  //
  // HEADLINE PEEKING / man in earth orbit
  //
  if (this.game.state.man_in_earth_orbit != "") { 
    if (this.game.state.man_in_earth_orbit === "us") { 
      if (this.game.player == 1) {
        x = `<div class="cardbox-status-container">
          <div><span>${player.toUpperCase()***REMOVED***</span> <span>pick your headline card first</span></div>
          ${this.returnCardList(this.game.deck[0].hand)***REMOVED***
        </div>`;
  ***REMOVED*** else {
        x = `<div class="cardbox-status-container">
          <div><span>${player.toUpperCase()***REMOVED***</span> <span>pick your headline card second (opponent selected: ${twilight_self.game.state.headline_opponent_card***REMOVED***)</span></div>
          ${this.returnCardList(this.game.deck[0].hand)***REMOVED***
        </div>`;
  ***REMOVED***
***REMOVED*** else {
      if (this.game.player == 1) {
        x = `<div class="cardbox-status-container">
          <div><span>${player.toUpperCase()***REMOVED***</span> <span>pick your headline card second (opponent selected: ${twilight_self.game.state.headline_opponent_card***REMOVED***)</span></div>
          ${this.returnCardList(this.game.deck[0].hand)***REMOVED***
        </div>`;
  ***REMOVED*** else {
        x = `<div class="cardbox-status-container">
          <div><span>${player.toUpperCase()***REMOVED***</span> <span>pick your headline card first</span></div>
          ${this.returnCardList(this.game.deck[0].hand)***REMOVED***
        </div>`;
  ***REMOVED***
***REMOVED***
  //
  // NORMAL HEADLINE ORDER
  //
  ***REMOVED*** else {
    x = `<div class="cardbox-status-container">
      <div><span>${player.toUpperCase()***REMOVED***</span> <span>pick your headline card</span></div>
      ${this.returnCardList(this.game.deck[0].hand)***REMOVED***
    </div>`;
  ***REMOVED***






  this.updateStatus(x);


  $('.card').off();
  twilight_self.addShowCardEvents();
  $('.card').on('click', function() {

    let card = $(this).attr("id");

    //
    // mobile clients have sanity check on card check
    //
    if (twilight_self.app.browser.isMobileBrowser(navigator.userAgent)) {
      twilight_self.mobileCardSelect(card, player, function() {
        twilight_self.playerTurnHeadlineSelected(card, player);
  ***REMOVED***, "play");

      return;
***REMOVED***

    twilight_self.playerTurnHeadlineSelected(card, player);

  ***REMOVED***);

***REMOVED***


playerTurnHeadlineSelected(card, player) {

  let twilight_self = this;

  // cannot pick china card or UN intervention
  if (card == "china") {
    twilght_self.displayModal("Invalid Headline", "You cannot headline China"); return; ***REMOVED***
  if (card == "unintervention") {
    twilght_self.displayModal("Invalid Headline", "You cannot headline UN Intervention"); return; ***REMOVED***

  twilight_self.game.state.headline_card = card;
  twilight_self.game.state.headline_xor = twilight_self.app.crypto.hash(Math.random());
  twilight_self.game.state.headline_hash = twilight_self.app.crypto.encodeXOR(twilight_self.app.crypto.stringToHex(twilight_self.game.state.headline_card), twilight_self.game.state.headline_xor);


  //
  // HEADLINE PEEKING / man in earth orbit
  //
  if (this.game.state.man_in_earth_orbit != "") {
    if (this.game.state.man_in_earth_orbit === "us") {
      if (this.game.player == 1) {
        twilight_self.addMove("headline\theadline2\t2\t"+twilight_self.game.state.headline_hash+"\t"+twilight_self.game.state.headline_xor+"\t"+twilight_self.game.state.headline_card+"\t");
  ***REMOVED*** else {
        twilight_self.addMove("headline\theadline3\t2\t"+twilight_self.game.state.headline_hash+"\t"+twilight_self.game.state.headline_xor+"\t"+twilight_self.game.state.headline_card+"\t");
  ***REMOVED***
***REMOVED*** else {
      if (this.game.player == 1) {
        twilight_self.addMove("headline\theadline3\t2\t"+twilight_self.game.state.headline_hash+"\t"+twilight_self.game.state.headline_xor+"\t"+twilight_self.game.state.headline_card+"\t");
  ***REMOVED*** else {
        twilight_self.addMove("headline\theadline2\t2\t"+twilight_self.game.state.headline_hash+"\t"+twilight_self.game.state.headline_xor+"\t"+twilight_self.game.state.headline_card+"\t");
  ***REMOVED***
***REMOVED***
  //
  // NORMAL HEADLINE ORDER
  //
  ***REMOVED*** else {
    if (this.game.player == 1) {
      twilight_self.addMove("headline\theadline2\t2\t"+twilight_self.game.state.headline_hash+"\t\t\t");
***REMOVED*** else {
      twilight_self.addMove("headline\theadline3\t1\t"+twilight_self.game.state.headline_hash+"\t\t\t");
***REMOVED***
  ***REMOVED***

  twilight_self.updateStatus("simultaneous blind pick... encrypting selected card");
  twilight_self.game.turn = [];

  $('.card').off();
  $('.showcard').off();
  twilight_self.hideCard();
  twilight_self.endTurn();

  return;

***REMOVED***



playerTurn(selected_card=null) {

  //
  // remove back button from forced gameplay
  //
  if (selected_card != null) { this.game.state.back_button_cancelled = 1; ***REMOVED***


  //
  // show active events
  //
  this.updateEventTiles();


  original_selected_card = selected_card;

  if (this.browser_active == 0) { return; ***REMOVED***

  //
  // reset region bonuses (if applicable)
  //
  this.game.state.events.china_card_in_play = 0;
  this.game.state.events.vietnam_revolts_eligible = 1;
  this.game.state.events.china_card_eligible = 1;
  this.game.state.events.region_bonus = "";
  this.game.state.ironlady_before_ops = 0;

  let player = "ussr";
  let opponent = "us";
  let playable_cards = [];

  if (this.game.player == 2) { player = "us"; opponent = "ussr"; ***REMOVED***

  is_this_missile_envy_noneventable = this.game.state.events.missileenvy;

console.log("IS_THIS_MISSILE_ENVY_NONEVENTABLE: " + is_this_missile_envy_noneventable);

  let user_message = "";
  if (selected_card == null) {

    user_message = player.toUpperCase() + " pick a card: ";
    for (i = 0; i < this.game.deck[0].hand.length; i++) {
      //
      // when UN Intervention is eventing, we can only select opponent cards
      //
      if (this.game.state.events.unintervention == 1) {
        if (this.game.player == 1 && this.game.deck[0].cards[this.game.deck[0].hand[i]].player === "us") {
          playable_cards.push(this.game.deck[0].hand[i]);
    ***REMOVED***
        if (this.game.player == 2 && this.game.deck[0].cards[this.game.deck[0].hand[i]].player === "ussr") {
          playable_cards.push(this.game.deck[0].hand[i]);
    ***REMOVED***
  ***REMOVED*** else {
        playable_cards.push(this.game.deck[0].hand[i]);
  ***REMOVED***
***REMOVED***;
  ***REMOVED*** else {

    if (selected_card === "scoringcard") {
      user_message = 'Scoring card must be played: <p></p><ul>';
      for (i = 0; i < this.game.deck[0].hand.length; i++) {
        if (this.game.deck[0].cards[this.game.deck[0].hand[i]] != undefined) {
          if (this.game.deck[0].cards[this.game.deck[0].hand[i]].scoring == 1) {
            selected_card = this.game.deck[0].hand[i];
            playable_cards.push(this.game.deck[0].hand[i]);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED*** else {
      playable_cards.push(selected_card);
***REMOVED***
  ***REMOVED***

  //
  // Cuban Missile Crisis
  //
  if ((this.game.player == 1 && this.game.state.events.cubanmissilecrisis == 1) || (this.game.player == 2 && this.game.state.events.cubanmissilecrisis == 2)) {
    let can_remove = 0;
    if (this.game.player == 1 && this.countries['cuba'].ussr >= 2) { can_remove = 1; ***REMOVED***
    if (this.game.player == 2 && this.countries['turkey'].us >= 2) { can_remove = 1; ***REMOVED***
    if (this.game.player == 2 && this.countries['westgermany'].us >= 2) { can_remove = 1; ***REMOVED***
    if (can_remove == 1) {
      playable_cards.push("cancel cuban missile crisis");
***REMOVED***
  ***REMOVED***

  //
  // Bear Trap and Quagmire
  //
  // headline check ensures that Quagmire does not trigger if headlined and the US triggers a card pull
  //
  if (this.game.state.headline == 0 && ((this.game.player == 1 && this.game.state.events.beartrap == 1) || (this.game.player == 2 && this.game.state.events.quagmire == 1)) ) {

    //
    // do we have cards to select
    //
    let cards_available = 0;
    let scoring_cards_available = 0;

    //
    // how many turns left?
    //
    let rounds_in_turn = 6;
    if (this.game.state.round > 3) { rounds_in_turn = 7; ***REMOVED***
    let moves_remaining = rounds_in_turn - this.game.state.turn_in_round;


    if (this.game.state.events.beartrap == 1 && this.game.player == 1) {
      user_message = "Select a card for Bear Trap: ";
***REMOVED*** else {
      user_message = "Select a card for Quagmire: ";
***REMOVED***

    for (i = 0; i < this.game.deck[0].hand.length; i++) {
      if (this.modifyOps(this.game.deck[0].cards[this.game.deck[0].hand[i]].ops, this.game.deck[0].hand[i], this.game.player, 0) >= 2 && this.game.deck[0].hand[i] != "china") {
        cards_available++;
  ***REMOVED***
      if (this.game.deck[0].cards[this.game.deck[0].hand[i]] != undefined) {
        if (this.game.deck[0].cards[this.game.deck[0].hand[i]].scoring == 1) { scoring_cards_available++; ***REMOVED***
  ***REMOVED***
***REMOVED***

    //
    // handle missile envy if needed
    //
    if (this.game.state.events.missile_envy == this.game.player) {
      if (this.modifyOps(2, "missileenvy", this.game.player, 0) >= 2) {
	playable_cards = [];
	playable_cards.push("missileenvy");
  ***REMOVED***
***REMOVED*** else {

      //
      // do we have any cards to play?
      //
      if (cards_available > 0 && scoring_cards_available <= moves_remaining) {
        this.updateStatus(user_message);
        playable_cards = [];
        for (i = 0; i < this.game.deck[0].hand.length; i++) {
          if (this.game.deck[0].cards[this.game.deck[0].hand[i]] != undefined) {
            if (this.modifyOps(this.game.deck[0].cards[this.game.deck[0].hand[i]].ops, this.game.deck[0].hand[i], this.game.player, 0) >= 2 && this.game.deck[0].hand[i] != "china") {
              playable_cards.push(this.game.deck[0].hand[i]);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED*** else {
        if (scoring_cards_available > 0) {
          if (this.game.state.events.beartrap == 1) {
            user_message = "Bear Trap restricts you to Scoring Cards: ";
      ***REMOVED*** else {
            user_message = "Quagmire restricts you to Scoring Cards: ";
      ***REMOVED***
          for (i = 0; i < this.game.deck[0].hand.length; i++) {
            if (this.game.deck[0].cards[this.game.deck[0].hand[i]] != undefined) {
              if (this.game.deck[0].cards[this.game.deck[0].hand[i]].scoring == 1) {
                playable_cards.push(this.game.deck[0].hand[i]);
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
    ***REMOVED*** else {
          if (this.game.state.events.beartrap == 1) {
            user_message = "No cards playable due to Bear Trap: ";
      ***REMOVED*** else {
            user_message = "No cards playable due to Quagmire: ";
      ***REMOVED***
          playable_cards = [];
          playable_cards.push("skip turn");
    ***REMOVED***
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  //
  // display the cards
  //
  if (playable_cards.length > 0) {
    this.updateStatusAndListCards(user_message, playable_cards);
  ***REMOVED*** else {
    this.updateStatusAndListCards(user_message, this.game.deck[0].hand);
  ***REMOVED***


  let twilight_self = this;

  if (this.game.state.events.unintervention != 1 && selected_card != "grainsales") {
    this.moves = [];
  ***REMOVED***

  twilight_self.playerFinishedPlacingInfluence();

  //
  // cannot play if no cards remain
  //
  if (selected_card == null && this.game.deck[0].hand.length == 0) {
    this.updateStatus("Skipping turn... no cards left to play");
    this.updateLog("Skipping turn... no cards left to play");
    this.addMove("resolve\tplay");
    this.endTurn();
    return;
  ***REMOVED***


  $('.card').off();
  twilight_self.addShowCardEvents();
  $('.card').on('click', function() {

    let card = $(this).attr("id");

    //
    // mobile clients have sanity check on card check
    //
    if (twilight_self.app.browser.isMobileBrowser(navigator.userAgent)) {
      twilight_self.mobileCardSelect(card, player, function() {

***REMOVED*** cancel missile envy if played appropriately
        if (twilight_self.game.state.events.missile_envy != 0 && twilight_self.game.state.events.missileenvy != 0 && card == "missileenvy") {
          twilight_self.game.state.events.missile_envy = 0;
          twilight_self.game.state.events.missileenvy = 0;
    ***REMOVED***

        twilight_self.playerTurnCardSelected(card, player);
  ***REMOVED***, "select");
      return;
***REMOVED***


    // cancel missile envy if played appropriately
    if (twilight_self.game.state.events.missile_envy != 0 && twilight_self.game.state.events.missileenvy != 0 && card == "missileenvy") {
      twilight_self.game.state.events.missile_envy = 0;
      twilight_self.game.state.events.missileenvy = 0;
***REMOVED***

    twilight_self.playerTurnCardSelected(card, player);

  ***REMOVED***);
***REMOVED***


playerTurnCardSelected(card, player) {

  let twilight_self = this;
  let opponent = "us";
  if (this.game.player == 2) { opponent = "ussr"; ***REMOVED***

    //
    // Skip Turn
    //
    if (card === "skipturn") {
      twilight_self.hideCard(card);
      twilight_self.addMove("resolve\tplay");
      twilight_self.addMove("notify\t"+player+" has no cards playable.");
      twilight_self.endTurn();
      return 0;
***REMOVED***


    //
    // warn if user is leaving a scoring card in hand
    //
    let scoring_cards_available = 0;
    let rounds_in_turn = 6;
    if (twilight_self.game.state.round > 3) { rounds_in_turn = 7; ***REMOVED***
    let moves_remaining = rounds_in_turn - twilight_self.game.state.turn_in_round;

    for (i = 0; i < twilight_self.game.deck[0].hand.length; i++) {
      if (this.game.deck[0].cards[this.game.deck[0].hand[i]] != undefined) {
        if (twilight_self.game.deck[0].cards[twilight_self.game.deck[0].hand[i]].scoring == 1) { scoring_cards_available++; ***REMOVED***
  ***REMOVED***
***REMOVED***

    if (scoring_cards_available > 0 && scoring_cards_available > moves_remaining && twilight_self.game.deck[0].cards[card].scoring == 0) {
      let c = confirm("Holding a scoring card at the end of the turn will lose you the game. Still play this card?");
      if (c) {***REMOVED*** else { return; ***REMOVED***
***REMOVED***

    //
    // Quagmire / Bear Trap
    //
    if (twilight_self.game.state.headline == 0 && (twilight_self.game.state.events.quagmire == 1 && twilight_self.game.player == 2) || (twilight_self.game.state.events.beartrap == 1 && twilight_self.game.player == 1) ) {

      //
      // scoring cards score, not get discarded
      //
      if (twilight_self.game.deck[0].cards[card].scoring == 0) {
        twilight_self.hideCard(card);
        twilight_self.removeCardFromHand(card);
        twilight_self.addMove("resolve\tplay");
        twilight_self.addMove("quagmire\t"+player+"\t"+card);
        twilight_self.addMove("discard\t"+player+"\t"+card);
        twilight_self.endTurn();
        return 0;
  ***REMOVED***
***REMOVED***


    //
    // Cuban Missile Crisis
    //
    if (card == "cancelcubanmissilecrisis") {
      if (twilight_self.game.player == 1) {
        twilight_self.removeInfluence("cuba", 2, "ussr");
        twilight_self.addMove("remove\tussr\tussr\tcuba\t2");
        twilight_self.addMove("unlimit\tcmc");
        twilight_self.addMove("notify\tUSSR has cancelled the Cuban Missile Crisis");
        twilight_self.endTurn();
  ***REMOVED*** else {

        let user_message = "Select country from which to remove influence:<p></p><ul>";
        if (twilight_self.countries['turkey'].us >= 2) {
          user_message += '<li class="card showcard" id="turkey">Turkey</li>';
    ***REMOVED***
        if (twilight_self.countries['westgermany'].us >= 2) {
          user_message += '<li class="card showcard" id="westgermany">West Germany</li>';
    ***REMOVED***
        user_message += '</ul>';
        twilight_self.updateStatus(user_message);

        $('.card').off();
        $('.card').on('click', function() {

          let action2 = $(this).attr("id");

          if (action2 === "turkey") {
            twilight_self.removeInfluence("turkey", 2, "us");
            twilight_self.addMove("remove\tus\tus\tturkey\t2");
            twilight_self.addMove("unlimit\tcmc");
            twilight_self.addMove("notify\tUS has cancelled the Cuban Missile Crisis");
            twilight_self.endTurn();
      ***REMOVED***
          if (action2 === "westgermany") {
            twilight_self.removeInfluence("westgermany", 2, "us");
            twilight_self.addMove("remove\tus\tus\twestgermany\t2");
            twilight_self.addMove("unlimit\tcmc");
            twilight_self.addMove("notify\tUS has cancelled the Cuban Missile Crisis");
              twilight_self.endTurn();
      ***REMOVED***
    ***REMOVED***);

  ***REMOVED***
      return 0;
***REMOVED***

    //
    // The China Card
    //
    twilight_self.hideCard(card);
    twilight_self.addMove("resolve\tplay");
    twilight_self.addMove("discard\t"+player+"\t"+card);

    if (card == "china") {
      twilight_self.addMove("unlimit\tchina");
      twilight_self.game.state.events.china_card_in_play = 1;
***REMOVED***

    //
    // WWBY triggers on non-headlines, so Grain Sales headline shdn't trigger
    //
    if (twilight_self.game.state.events.wwby == 1 && twilight_self.game.state.headline == 0) {
      if (player == "us") {
        if (card != "unintervention") {
          twilight_self.game.state.events.wwby_triggers = 1;
    ***REMOVED***
        twilight_self.game.state.events.wwby = 0;
  ***REMOVED***
***REMOVED***


    if (twilight_self.game.deck[0].cards[card].scoring == 1) {
      let status_header = `Playing ${twilight_self.game.deck[0].cards[card].name***REMOVED***:`;
      let html = ``;

      // true means we want to include the back button in our functionality
      if (this.game.state.back_button_cancelled == 1) {
        html += twilight_self.formatStatusHeader(status_header, false);
  ***REMOVED*** else {
        html += twilight_self.formatStatusHeader(status_header, true);
  ***REMOVED***
      html += `<p></p><ul><li class="card" id="event">score region</li></ul>`
      twilight_self.updateStatus(html);
***REMOVED*** else {

      let ops = twilight_self.modifyOps(twilight_self.game.deck[0].cards[card].ops, card, twilight_self.game.player, 0);


      //
      // is space race an option
      //
      let sre = 1;
      if (twilight_self.game.player == 1 && twilight_self.game.state.space_race_ussr_counter >= 1) {
        if (twilight_self.game.state.animal_in_space == "ussr" && twilight_self.game.state.space_race_ussr_counter < 2) {***REMOVED*** else {
          sre = 0;
    ***REMOVED***
  ***REMOVED***
      if (twilight_self.game.player == 2 && twilight_self.game.state.space_race_us_counter >= 1) {
        if (twilight_self.game.state.animal_in_space == "us" && twilight_self.game.state.space_race_us_counter < 2) {***REMOVED*** else {
          sre = 0;
    ***REMOVED***
  ***REMOVED***


      let announcement = "";

      if (twilight_self.game.state.back_button_cancelled == 1) {
        announcement = twilight_self.formatStatusHeader(
          `<span>${player.toUpperCase()***REMOVED***</span> <span>playing</span> <span>${twilight_self.game.deck[0].cards[card].name***REMOVED***</span>`,
          false
        );
  ***REMOVED*** else {
        announcement = twilight_self.formatStatusHeader(
          `<span>${player.toUpperCase()***REMOVED***</span> <span>playing</span> <span>${twilight_self.game.deck[0].cards[card].name***REMOVED***</span>`,
          true
        );

  ***REMOVED***
      announcement += `<p></p><ul>`;

      //
      // cannot play China card or Missile Envy (forced) for event
      //
      // cannot event UN Intervention w/o the opponent card in hand
      //
      let can_play_event = 1;
      if (card == "unintervention") {
        let opponent_event_in_hand = 0;
        for (let b = 0; b < twilight_self.game.deck[0].hand.length; b++) {
          let tmpc = twilight_self.game.deck[0].hand[b];
          if (tmpc != "china") {
            if (twilight_self.game.player == 1) {
              if (twilight_self.game.deck[0].cards[tmpc].player === "us") { opponent_event_in_hand = 1; ***REMOVED***
        ***REMOVED*** else {
              if (twilight_self.game.deck[0].cards[tmpc].player === "ussr") { opponent_event_in_hand = 1; ***REMOVED***
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
        if (opponent_event_in_hand == 0) { can_play_event = 0; ***REMOVED***
  ***REMOVED***
      if (card == "china") { can_play_event = 0; ***REMOVED***
      if (card == "missileenvy" && is_this_missile_envy_noneventable == 1) { can_play_event = 0; ***REMOVED***

      //
      // cannot play event of opponent card (usability fix)
      //
      if (twilight_self.game.deck[0].cards[card].player == opponent) { can_play_event = 0; ***REMOVED***

      if (can_play_event == 1) { announcement += '<li class="card" id="event">play event</li>'; ***REMOVED***

      announcement += '<li class="card" id="ops">play ops</li>';

      if (sre == 1) {
        if (player == "ussr" && ops > 1) {
          if (twilight_self.game.state.space_race_ussr < 4 && ops > 1) {
            announcement += '<li class="card" id="space">space race</li>';
      ***REMOVED***
          if (twilight_self.game.state.space_race_ussr >= 4 && twilight_self.game.state.space_race_ussr < 7 && ops > 2) {
            announcement += '<li class="card" id="space">space race</li>';
      ***REMOVED***
          if (twilight_self.game.state.space_race_ussr == 7 && ops > 3) {
            announcement += '<li class="card" id="space">space race</li>';
        ***REMOVED***
    ***REMOVED***
        if (player == "us" && ops > 1) {
          if (twilight_self.game.state.space_race_us < 4 && ops > 1) {
            announcement += '<li class="card" id="space">space race</li>';
      ***REMOVED***
          if (twilight_self.game.state.space_race_us >= 4 && twilight_self.game.state.space_race_us < 7 && ops > 2) {
            announcement += '<li class="card" id="space">space race</li>';
      ***REMOVED***
          if (twilight_self.game.state.space_race_us == 7 && ops > 3) {
            announcement += '<li class="card" id="space">space race</li>';
        ***REMOVED***
    ***REMOVED***
  ***REMOVED*** else {
  ***REMOVED***

      //
      // cancel cuban missile crisis
      //
      if ((twilight_self.game.player == 1 && twilight_self.game.state.events.cubanmissilecrisis == 1) || (twilight_self.game.player == 2 && twilight_self.game.state.events.cubanmissilecrisis == 2)) {
        let can_remove = 0;
        if (twilight_self.game.player == 1 && twilight_self.countries['cuba'].ussr >= 2) { can_remove = 1; ***REMOVED***
        if (twilight_self.game.player == 2 && twilight_self.countries['turkey'].us >= 2) { can_remove = 1; ***REMOVED***
        if (can_remove == 1) {
          announcement += '<li class="card" id="cancel_cmc">cancel cuban missile crisis</li>';
    ***REMOVED***
  ***REMOVED***

      twilight_self.updateStatus(announcement);
***REMOVED***

    $('#back_button').off();
    $('#back_button').on('click', () => {
      this.playerTurn();
***REMOVED***);

    $('.card').off();
    $('.card').on('click', function() {

      let action = $(this).attr("id");
      $('.card').off();

      //
      // Cuban Missile Crisis
      //
      if (action == "cancel_cmc") {
        this.moves = [];
        if (twilight_self.game.player == 1) {
          twilight_self.removeInfluence("cuba", 2, "ussr");
          twilight_self.addMove("remove\tussr\tussr\tcuba\t2");
          twilight_self.addMove("notify\tUSSR has cancelled the Cuban Missile Crisis");
          twilight_self.addMove("unlimit\tcmc");
          twilight_self.endTurn();
    ***REMOVED*** else {

          let user_message = "Select country from which to remove influence:<p></p><ul>";
          if (twilight_self.countries['turkey'].us >= 2) {
            user_message += '<li class="card showcard" id="turkey">Turkey</li>';
      ***REMOVED***
          if (twilight_self.countries['westgermany'].us >= 2) {
            user_message += '<li class="card showcard" id="westgermany">West Germany</li>';
      ***REMOVED***
          user_message += '</ul>';
          twilight_self.updateStatus(user_message);

          $('.card').off();
          $('.card').on('click', function() {

            let action2 = $(this).attr("id");

            if (action2 === "turkey") {
              twilight_self.removeInfluence("turkey", 2, "us");
              twilight_self.addMove("remove\tus\tus\tturkey\t2");
              twilight_self.addMove("unlimit\tcmc");
              twilight_self.addMove("notify\tUS has cancelled the Cuban Missile Crisis");
              twilight_self.endTurn();
        ***REMOVED***
            if (action2 === "westgermany") {
              twilight_self.removeInfluence("westgermany", 2, "us");
              twilight_self.addMove("remove\tus\tus\twestgermany\t2");
              twilight_self.addMove("unlimit\tcmc");
              twilight_self.addMove("notify\tUS has cancelled the Cuban Missile Crisis");
                twilight_self.endTurn();
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***
        return;
  ***REMOVED***


      if (action == "event") {

***REMOVED***
***REMOVED*** sanity check on opponent event choice
***REMOVED***
        if (twilight_self.game.deck[0].cards[card].player != "both" && twilight_self.game.deck[0].cards[card].player != player) {

          let fr =  "<span>This is your opponent's event. Are you sure you wish to play it for the event instead of the OPS?</span><p></p><ul>";
              fr += '<li class="card" id="playevent">play event</li>';
              fr += '<li class="card" id="pickagain">pick again</li>';
              fr += '</ul>';

          twilight_self.updateStatus(fr);

          $('.card').off();
          $('.card').on('click', function() {

            let action = $(this).attr("id");
            $('.card').off();

            if (action == "playevent") {
              twilight_self.playerTriggerEvent(player, card);
              return;
        ***REMOVED***
            if (action == "pickagain") {
              twilight_self.playerTurn(original_selected_card);
              return;
        ***REMOVED***

      ***REMOVED***);

          return;
    ***REMOVED***

***REMOVED*** our event or both
***REMOVED***
        if (twilight_self.dont_show_confirm == 0) {
          let fr =
            `
            Confirm you want to play this event
            <ul>
            <li class="card" id="playevent">play event</li>
            <li class="card" id="pickagain">pick again</li>
            </ul>
            <input type="checkbox" name="dontshowme" value="true" style="width: 20px;height: 1.5em;"> Don't show me this again
            `;

          twilight_self.updateStatus(fr);

          $('.card').off();
          $('.card').on('click', function() {

            let action = $(this).attr("id");
            $('.card').off();

            if (action == "playevent") {
              twilight_self.playerTriggerEvent(player, card);
              return;
        ***REMOVED***
            if (action == "pickagain") {
              twilight_self.playerTurn(original_selected_card);
              return;
        ***REMOVED***

      ***REMOVED***);

          $('input:checkbox').change(function() {
            if ($(this).is(':checked')) {
              twilight_self.dont_show_confirm = 1;
              twilight_self.saveGamePreference('dont_show_confirm', 1);
        ***REMOVED***
      ***REMOVED***)

          return;
    ***REMOVED***

***REMOVED*** play normally when not confirmed
        twilight_self.playerTriggerEvent(player, card);
        return;

  ***REMOVED***

      if (action == "ops") {

        if (twilight_self.game.deck[0].cards[card].player == opponent) {
          if (twilight_self.game.state.events.unintervention == 1) {

    ***REMOVED***
    ***REMOVED*** Flower Power
    ***REMOVED***
            if (twilight_self.game.state.events.flowerpower == 1) {
              if (card == "arabisraeli" || card == "koreanwar" || card == "brushwar" || card == "indopaki" || card == "iraniraq") {
                if (player === "us") {
                  twilight_self.addMove("notify\tFlower Power triggered by "+card);
                  twilight_self.addMove("vp\tussr\t2\t1");
            ***REMOVED***
          ***REMOVED***
        ***REMOVED***

    ***REMOVED*** resolve added
            twilight_self.addMove("notify\t"+player.toUpperCase()+" plays "+card+" with UN Intervention");
            twilight_self.addMove("ops\t"+player+"\t"+card+"\t"+twilight_self.game.deck[0].cards[card].ops);
            twilight_self.removeCardFromHand(card);
            twilight_self.endTurn();
            return;

      ***REMOVED*** else {

    ***REMOVED***
    ***REMOVED*** Flower Power
    ***REMOVED***
            if (twilight_self.game.state.events.flowerpower == 1) {
              if (card == "arabisraeli" || card == "koreanwar" || card == "brushwar" || card == "indopaki" || card == "iraniraq") {
                if (player === "us") {
                  twilight_self.addMove("notify\tFlower Power triggered by "+card);
                  twilight_self.addMove("vp\tussr\t2\t1");
            ***REMOVED***
          ***REMOVED***
        ***REMOVED***

            let html = twilight_self.formatStatusHeader('Playing opponent card:', true);
                html += '<p></p><ul><li class="card" id="before">event before ops</li><li class="card" id="after">event after ops</li></ul>';
            twilight_self.updateStatus(html);
            twilight_self.bindBackButtonFunction(() => {
 	       twilight_self.playerTurnCardSelected(card, player);
        ***REMOVED***);

            $('.card').off();
            $('.card').on('click', function() {

              let action2 = $(this).attr("id");

              twilight_self.game.state.event_before_ops = 0;
              twilight_self.game.state.event_name = "";

              if (action2 === "before") {
                twilight_self.game.state.event_before_ops = 1;
                twilight_self.game.state.event_name = twilight_self.game.deck[0].cards[card].name;
                twilight_self.addMove("ops\t"+player+"\t"+card+"\t"+twilight_self.game.deck[0].cards[card].ops);
                twilight_self.addMove("event\t"+player+"\t"+card);
                twilight_self.removeCardFromHand(card);
                twilight_self.endTurn();
                return;
          ***REMOVED***
              if (action2 === "after") {
                twilight_self.game.state.event_name = twilight_self.game.deck[0].cards[card].name;
                twilight_self.addMove("event\t"+player+"\t"+card);
                twilight_self.addMove("ops\t"+player+"\t"+card+"\t"+twilight_self.game.deck[0].cards[card].ops);
                twilight_self.removeCardFromHand(card);
                twilight_self.endTurn();
                return;
          ***REMOVED***

        ***REMOVED***);
      ***REMOVED***

          return;

    ***REMOVED*** else {

          twilight_self.addMove("ops\t"+player+"\t"+card+"\t"+twilight_self.game.deck[0].cards[card].ops);
          if (card == "china") { twilight_self.addMove("limit\tchina"); ***REMOVED***
          twilight_self.removeCardFromHand(card);

  ***REMOVED***
  ***REMOVED*** Flower Power
  ***REMOVED***
          if (twilight_self.game.state.events.flowerpower == 1) {
            if (card == "arabisraeli" || card == "koreanwar" || card == "brushwar" || card == "indopaki" || card == "iraniraq") {
              if (player === "us") {
                twilight_self.addMove("notify\tFlower Power triggered by "+card);
                twilight_self.addMove("vp\tussr\t2\t1");
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***

          twilight_self.endTurn();
          return;

    ***REMOVED***
  ***REMOVED***

      if (action == "space") {
        twilight_self.addMove("space\t"+player+"\t"+card);
        twilight_self.removeCardFromHand(card);
        twilight_self.endTurn();
        return;
  ***REMOVED***

      twilight_self.updateStatus("");

***REMOVED***);

***REMOVED***


playerTriggerEvent(player, card) {

  let twilight_self = this;

  //
  // Flower Power
  //
  if (twilight_self.game.state.events.flowerpower == 1) {
    if (card == "arabisraeli" || card == "koreanwar" || card == "brushwar" || card == "indopaki" || card == "iraniraq") {
      if (player === "us") {
        twilight_self.addMove("notify\tFlower Power triggered by "+card);
        twilight_self.addMove("vp\tussr\t2\t1");
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  twilight_self.game.state.event_name = twilight_self.game.deck[0].cards[card].name;
  twilight_self.addMove("event\t"+player+"\t"+card);
  twilight_self.removeCardFromHand(card);


  //
  // Our Man in Tehran -- check if reshuffle is needed
  //
  if (card == "tehran") {

    //
    // reshuffle needed before event
    //
    if (5 > twilight_self.game.deck[0].crypt.length) {

      let discarded_cards = twilight_self.returnDiscardedCards();
      if (Object.keys(discarded_cards).length > 0) {

***REMOVED***
***REMOVED*** shuffle in discarded cards -- eliminate SHUFFLE here as unnecessary
***REMOVED***
        twilight_self.addMove("DECKRESTORE\t1");
        twilight_self.addMove("DECKENCRYPT\t1\t2");
        twilight_self.addMove("DECKENCRYPT\t1\t1");
        twilight_self.addMove("DECKXOR\t1\t2");
        twilight_self.addMove("DECKXOR\t1\t1");
        twilight_self.addMove("flush\tdiscards"); // opponent should know to flush discards as we have
        twilight_self.addMove("DECK\t1\t"+JSON.stringify(discarded_cards));
        twilight_self.addMove("DECKBACKUP\t1");
        twilight_self.updateLog("cards remaining: " + twilight_self.game.deck[0].crypt.length);
        twilight_self.updateLog("Shuffling discarded cards back into the deck...");

  ***REMOVED***
***REMOVED***
  ***REMOVED***

  twilight_self.endTurn();
  return;

***REMOVED***











/////////////////////
// Place Influence //
/////////////////////
uneventOpponentControlledCountries(player, card) {

  let bonus_regions = this.returnArrayOfRegionBonuses(card);

  for (var i in this.countries) {
    if (player == "us") {
      if (this.isControlled("ussr", i) == 1) {

***REMOVED***
***REMOVED*** allow bonus regions to break control with bonuses
***REMOVED***
        let bonus_region_applies = 0;
        for (let z = 0; z < bonus_regions.length; z++) {
          if (this.countries[i].region.indexOf(bonus_regions[z]) > -1) { bonus_region_applies = 1; ***REMOVED***
    ***REMOVED***

        if (bonus_region_applies == 1) {
    ***REMOVED*** else {
          this.countries[i].place = 0;
          let divname = '#'+i;
          $(divname).off();
    ***REMOVED***

  ***REMOVED***
***REMOVED***

    if (player == "ussr") {
      if (this.isControlled("us", i) == 1) {

***REMOVED***
***REMOVED*** allow bonus regions to break control with bonuses
***REMOVED***
        let bonus_region_applies = 0;
        for (let z = 0; z < bonus_regions.length; z++) {
          if (this.countries[i].region.indexOf(bonus_regions[z]) > -1) { bonus_region_applies = 1; ***REMOVED***
    ***REMOVED***

        if (bonus_region_applies == 1) {
    ***REMOVED*** else {
          this.countries[i].place = 0;
          let divname = '#'+i;
          $(divname).off();
    ***REMOVED***

  ***REMOVED***
***REMOVED***
  ***REMOVED***

***REMOVED***

prePlayerPlaceInfluence(player) {

  //
  // reset
  //
  for (var i in this.game.countries) { this.game.countries[i].place = 0; ***REMOVED***

  //
  // ussr
  //
  if (player == "ussr") {

    this.game.countries['finland'].place = 1;
    this.game.countries['poland'].place = 1;
    this.game.countries['romania'].place = 1;
    this.game.countries['afghanistan'].place = 1;
    this.game.countries['northkorea'].place = 1;

    for (var i in this.game.countries) {
      if (this.game.countries[i].ussr > 0) {

        let place_in_country = 1;

***REMOVED***
***REMOVED*** skip argentina if only has 1 and ironlady_before_ops
***REMOVED***
        if (this.game.state.ironlady_before_ops == 1 && this.game.countries['chile'].ussr < 1 && this.game.countries['uruguay'].ussr < 1 && this.game.countries['paraguay'].ussr < 1 && this.game.countries['argentina'].ussr == 1 && i === "argentina") { place_in_country = 0; ***REMOVED***

        this.game.countries[i].place = place_in_country;

        if (place_in_country == 1) {
          for (let n = 0; n < this.game.countries[i].neighbours.length; n++) {
            let j = this.game.countries[i].neighbours[n];
            this.game.countries[j].place = 1;
      ***REMOVED***
    ***REMOVED***

  ***REMOVED***
***REMOVED***
  ***REMOVED***

  //
  // us
  //
  if (player == "us") {

    this.game.countries['canada'].place = 1;
    this.game.countries['mexico'].place = 1;
    this.game.countries['cuba'].place = 1;
    this.game.countries['japan'].place = 1;

    for (var i in this.game.countries) {
      if (this.game.countries[i].us > 0) {
        this.game.countries[i].place = 1;
        for (let n = 0; n < this.game.countries[i].neighbours.length; n++) {
          let j = this.game.countries[i].neighbours[n];
          this.game.countries[j].place = 1;
    ***REMOVED***
  ***REMOVED***
***REMOVED***
  ***REMOVED***

***REMOVED***



playerPlaceInitialInfluence(player) {

  let twilight_self = this;

  if (player == "ussr") {

    twilight_self.addMove("resolve\tplacement");

    this.updateStatusAndListCards(`You are the USSR. Place six additional influence in Eastern Europe.`);


    var placeable = [];
    placeable.push("finland");
    placeable.push("eastgermany");
    placeable.push("poland");
    placeable.push("austria");
    placeable.push("czechoslovakia");
    placeable.push("hungary");
    placeable.push("romania");
    placeable.push("yugoslavia");
    placeable.push("bulgaria");

    let ops_to_place = 6;

    for (let i = 0; i < placeable.length; i++) {

      this.game.countries[placeable[i]].place = 1;

      let divname = "#"+placeable[i];

      $(divname).off();
      $(divname).on('click', function() {

        let countryname = $(this).attr('id');

        if (twilight_self.countries[countryname].place == 1) {
          twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
          twilight_self.placeInfluence(countryname, 1, "ussr");
          ops_to_place--;

          if (ops_to_place == 0) {
            twilight_self.playerFinishedPlacingInfluence();
            twilight_self.game.state.placement = 1;
            twilight_self.endTurn();
      ***REMOVED***
    ***REMOVED*** else {
  ***REMOVED*** twilight_self.displayModal("you cannot place there...: " + j + " influence left");
          twilight_self.displayModal("Invalid Influence Placement", `You cannot place there...: ${j***REMOVED*** influence left`);
    ***REMOVED***
  ***REMOVED***);
***REMOVED***
  ***REMOVED***


  if (player == "us") {

    twilight_self.addMove("resolve\tplacement");

    this.updateStatusAndListCards(`You are the US. Place seven additional influence in Western Europe.`)

    var placeable = [];

    placeable.push("canada");
    placeable.push("uk");
    placeable.push("benelux");
    placeable.push("france");
    placeable.push("italy");
    placeable.push("westgermany");
    placeable.push("greece");
    placeable.push("spain");
    placeable.push("turkey");
    placeable.push("austria");
    placeable.push("norway");
    placeable.push("denmark");
    placeable.push("sweden");
    placeable.push("finland");

    var ops_to_place = 7;

    for (let i = 0; i < placeable.length; i++) {
      this.game.countries[placeable[i]].place = 1;

      let divname = "#"+placeable[i];

      $(divname).off();
      $(divname).on('click', function() {

        let countryname = $(this).attr('id');

        if (twilight_self.countries[countryname].place == 1) {
          twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
          twilight_self.placeInfluence(countryname, 1, "us");
          ops_to_place--;

          if (ops_to_place == 0) {
            twilight_self.playerFinishedPlacingInfluence();
            twilight_self.game.state.placement = 1;
            twilight_self.endTurn();
      ***REMOVED***
    ***REMOVED*** else {
  ***REMOVED*** twilight_self.displayModal("you cannot place there...: " + j + " influence left");
          twilight_self.displayModal("Invalid Influence Placement", `You cannot place there...: ${j***REMOVED*** influence left`);
    ***REMOVED***
  ***REMOVED***);
***REMOVED***
  ***REMOVED***
***REMOVED***



playerPlaceBonusInfluence(player, bonus) {

  let twilight_self = this;

  if (player == "ussr") {

    twilight_self.addMove("resolve\tplacement_bonus");

    this.updateStatusAndListCards(`You are the USSR. Place</span> ${bonus***REMOVED*** <span>additional influence in countries with existing Soviet influence.`);

    let ops_to_place = bonus;

    for (var i in this.game.countries) {
      if (this.game.countries[i].ussr > 0) {

        let countryname  = i;
        let divname      = '#'+i;

        $(divname).off();
        $(divname).on('click', function() {

          let countryname = $(this).attr('id');

          twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
          twilight_self.placeInfluence(countryname, 1, "ussr");
          ops_to_place--;

          if (ops_to_place == 0) {
            twilight_self.playerFinishedPlacingInfluence();
            twilight_self.game.state.placement = 1;
            twilight_self.endTurn();
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***
***REMOVED***
  ***REMOVED***



  if (player == "us") {

    twilight_self.addMove("resolve\tplacement_bonus");

    this.updateStatusAndListCards(`You are the US. Place</span> ${bonus***REMOVED*** <span>additional influence in countries with existing American influence.`);

    let ops_to_place = bonus;

    for (var i in this.game.countries) {
      if (this.game.countries[i].us > 0) {

        let countryname  = i;
        let divname      = '#'+i;

        $(divname).off();
        $(divname).on('click', function() {

          let countryname = $(this).attr('id');

          twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
          twilight_self.placeInfluence(countryname, 1, "us");
          ops_to_place--;

          if (ops_to_place == 0) {
            twilight_self.playerFinishedPlacingInfluence();
            twilight_self.game.state.placement = 1;
            twilight_self.endTurn();
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***
***REMOVED***
  ***REMOVED***
***REMOVED***









/////////////////////
// PLACE INFLUENCE //
/////////////////////
removeCardFromHand(card) {

  for (i = 0; i < this.game.deck[0].hand.length; i++) {
    if (this.game.deck[0].hand[i] == card) {
      this.game.deck[0].hand.splice(i, 1);
***REMOVED***
  ***REMOVED***

***REMOVED***
removeInfluence(country, inf, player, mycallback=null) {

  if (player == "us") {
    this.countries[country].us = parseInt(this.countries[country].us) - parseInt(inf);
    if (this.countries[country].us < 0) { this.countries[country].us = 0; ***REMOVED***;
    this.showInfluence(country, "ussr");
  ***REMOVED*** else {
    this.countries[country].ussr = parseInt(this.countries[country].ussr) - parseInt(inf);
    if (this.countries[country].ussr < 0) { this.countries[country].ussr = 0; ***REMOVED***;
    this.showInfluence(country, "us");
  ***REMOVED***

  this.updateLog(player.toUpperCase() + "</span> <span>removes </span> " + inf + "<span> from</span> <span>" + this.countries[country].name);

  this.showInfluence(country, player, mycallback);

***REMOVED***

placeInfluence(country, inf, player, mycallback=null) {

  if (player == "us") {
    this.countries[country].us = parseInt(this.countries[country].us) + parseInt(inf);
  ***REMOVED*** else {
    this.countries[country].ussr = parseInt(this.countries[country].ussr) + parseInt(inf);
  ***REMOVED***

  this.updateLog(player.toUpperCase() + "</span> <span>places</span> " + inf + " <span>in</span> <span>" + this.countries[country].name);

  this.showInfluence(country, player, mycallback);

***REMOVED***


showInfluence(country, player, mycallback=null) {

  let obj_us    = "#"+country+ " > .us";
  let obj_ussr = "#"+country+ " > .ussr";

  let us_i   = parseInt(this.countries[country].us);
  let ussr_i = parseInt(this.countries[country].ussr);

  let has_control = 0;

  if (player == "us") {
    let diff = us_i - ussr_i;
    if (diff > 0 && diff >= this.countries[country].control) {
      has_control = 1;
***REMOVED***
  ***REMOVED*** else {
    let diff = ussr_i - us_i;
    if (diff > 0 && diff >= this.countries[country].control) {
      has_control = 1;
***REMOVED***
  ***REMOVED***


  //
  // update non-player if control broken
  //
  if (player == "us") {
    if (this.isControlled("ussr", country) == 0) {
      if (this.countries[country].ussr > 0) {
        $(obj_ussr).html('<div class="ussr_uncontrol">'+ussr_i+'</div>');
  ***REMOVED***
***REMOVED*** else {
      if (this.isControlled("us", country) == 1) {
        $(obj_us).html('<div class="us_control">'+us_i+'</div>');
  ***REMOVED***
***REMOVED***
  ***REMOVED*** else {
    if (this.isControlled("us", country) == 0) {
      if (this.countries[country].us > 0) {
        $(obj_us).html('<div class="us_uncontrol">'+us_i+'</div>');
  ***REMOVED***
***REMOVED*** else {
      if (this.isControlled("ussr", country) == 1) {
        $(obj_ussr).html('<div class="ussr_control">'+ussr_i+'</div>');
  ***REMOVED***
***REMOVED***
  ***REMOVED***


  //
  // update HTML
  //
  if (has_control == 1) {
    if (player == "us") {
      $(obj_us).html('<div class="us_control">'+us_i+'</div>');
***REMOVED*** else {
      $(obj_ussr).html('<div class="ussr_control">'+ussr_i+'</div>');
***REMOVED***
  ***REMOVED*** else {
    if (player == "us") {
      if (us_i == 0) {
        $(obj_us).html('');
  ***REMOVED*** else {
        $(obj_us).html('<div class="us_uncontrol">'+us_i+'</div>');
  ***REMOVED***
***REMOVED*** else {
      if (ussr_i == 0) {
        $(obj_ussr).html('');
  ***REMOVED*** else {
        $(obj_ussr).html('<div class="ussr_uncontrol">'+ussr_i+'</div>');
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  $('.us_control').css('height', this.scale(100)+"px");
  $('.us_uncontrol').css('height', this.scale(100)+"px");
  $('.ussr_control').css('height', this.scale(100)+"px");
  $('.ussr_uncontrol').css('height', this.scale(100)+"px");

  $('.us_control').css('font-size', this.scale(100)+"px");
  $('.us_uncontrol').css('font-size', this.scale(100)+"px");
  $('.ussr_control').css('font-size', this.scale(100)+"px");
  $('.ussr_uncontrol').css('font-size', this.scale(100)+"px");

  //
  // adjust screen ratio
  //
  $('.country').css('width', this.scale(202)+"px");
  $('.us').css('width', this.scale(100)+"px");
  $('.ussr').css('width', this.scale(100)+"px");
  $('.us').css('height', this.scale(100)+"px");
  $('.ussr').css('height', this.scale(100)+"px");

  //
  // update game state
  //
  this.game.countries = this.countries;

  if (mycallback != null) { mycallback(country, player); ***REMOVED***

***REMOVED***








playerRealign(player, card, mycallback=null) {

  // reset off
  this.playerFinishedPlacingInfluence();

  var twilight_self = this;
  var valid_target = 0;

  // all countries can be realigned
  for (var i in this.countries) {

    let countryname = i;

    valid_target = 1;


    //
    // Can Only Realign Countries with Opponent Influence
    //
    if (twilight_self.game.player == 1) {
      if (twilight_self.countries[countryname].us < 1) {
        valid_target = 0;
  ***REMOVED***
***REMOVED*** else {
      if (twilight_self.countries[countryname].ussr < 1) {
        valid_target = 0;
  ***REMOVED***
***REMOVED***


    //
    // Region Restrictions
    //
    if (twilight_self.game.state.limit_region.indexOf(twilight_self.countries[countryname].region) > -1) {
      valid_target = 0;
***REMOVED***

    //
    // DEFCON restrictions
    //
    if (twilight_self.game.state.limit_ignoredefcon == 0) {
      if (twilight_self.countries[countryname].region == "europe" && twilight_self.game.state.defcon < 5) {
        valid_target = 0;
  ***REMOVED***
      if (twilight_self.countries[countryname].region == "asia" && twilight_self.game.state.defcon < 4) {
        valid_target = 0;
  ***REMOVED***
      if (twilight_self.countries[countryname].region == "seasia" && twilight_self.game.state.defcon < 4) {
        valid_target = 0;
  ***REMOVED***
      if (twilight_self.countries[countryname].region == "mideast" && twilight_self.game.state.defcon < 3) {
        valid_target = 0;
  ***REMOVED***
***REMOVED***

    //
    // Junta
    //
    if (card == "junta" && (this.countries[i].region != "camerica" && this.countries[i].region != "samerica")) {
      valid_target = 0;
***REMOVED***

    let divname      = '#'+i;

    if (valid_target == 1) {

      $(divname).off();
      $(divname).on('click', function() {

        let c = $(this).attr('id');

***REMOVED***
***REMOVED*** US / Japan Alliance
***REMOVED***
        if (twilight_self.game.state.events.usjapan == 1 && c == "japan" && this.game.player == 1) {
  ***REMOVED*** twilight_self.displayModal("US / Japan Alliance prevents realignments in Japan");
          twilight_self.displayModal("Invalid Realignment", `US / Japan Alliance prevents realignments in Japan`);
          valid_target = 0;
    ***REMOVED***

***REMOVED***
***REMOVED*** vietnam revolts and china card bonuses
***REMOVED***
        if (twilight_self.countries[c].region !== "seasia") { twilight_self.game.state.events.vietnam_revolts_eligible = 0; ***REMOVED***
        if (twilight_self.countries[c].region !== "seasia" && twilight_self.countries[c].region !== "asia") { twilight_self.game.state.events.china_card_eligible = 0; ***REMOVED***

        var result = twilight_self.playRealign(c);
        twilight_self.addMove("realign\t"+player+"\t"+c);
        mycallback();
  ***REMOVED***);

***REMOVED*** else {

      $(divname).off();
      $(divname).on('click', function() {
***REMOVED*** twilight_self.displayModal("Invalid Target");
        twilight_self.displayModal("Invalid Target");
  ***REMOVED***);

***REMOVED***
  ***REMOVED***
***REMOVED***

playerPlaceInfluence(player, mycallback=null) {

  // reset off
  this.playerFinishedPlacingInfluence();

  var twilight_self = this;

  for (var i in this.countries) {

    let countryname  = i;
    let divname      = '#'+i;

    let restricted_country = 0;

    //
    // Chernobyl
    //
    if (this.game.player == 1 && this.game.state.events.chernobyl != "") {
      if (this.countries[i].region == this.game.state.events.chernobyl) { restricted_country = 1; 

  ***REMOVED***
***REMOVED***

    if (this.game.state.limit_region.indexOf(this.countries[i].region) > -1) { restricted_country = 1; ***REMOVED***

    if (restricted_country == 1) {

alert("restricted COUNTRY == 1: " + divname);
 
      $(divname).off();
      $(divname).on('click', function() {
        twilight_self.displayModal("Invalid Target");
  ***REMOVED***);

***REMOVED*** else {

      if (player == "us") {

        $(divname).off();
        $(divname).on('click', function() {

          let countryname = $(this).attr('id');

          if (twilight_self.countries[countryname].place == 1) {

    ***REMOVED***
    ***REMOVED*** vietnam revolts and china card
    ***REMOVED***
            if (twilight_self.countries[countryname].region !== "seasia") { twilight_self.game.state.events.vietnam_revolts_eligible = 0; ***REMOVED***
            if (twilight_self.countries[countryname].region.indexOf("asia") < 0) { twilight_self.game.state.events.china_card_eligible = 0; ***REMOVED***

            if (twilight_self.isControlled("ussr", countryname) == 1) { twilight_self.game.break_control = 1; ***REMOVED***

    ***REMOVED***
    ***REMOVED*** permit cuban missile crisis removal after placement
    ***REMOVED***
            if (twilight_self.game.state.events.cubanmissilecrisis == 2) {
              if (countryname === "turkey" || countryname === "westgermany") {
                if (twilight_self.countries[countryname].us >= 1) {

          ***REMOVED***
          ***REMOVED*** allow player to remove CMC
          ***REMOVED***
                  if (twilight_self.app.BROWSER == 1) {

                    let removeinf = confirm("You are placing 1 influence in "+twilight_self.countries[countryname].name+". Once this is done, do you want to cancel the Cuban Missile Crisis by removing 2 influence in "+twilight_self.countries[countryname].name+"?");
                    if (removeinf) {

                      if (countryname === "turkey") {
                        twilight_self.removeInfluence("turkey", 2, "us");
                        twilight_self.addMove("remove\tus\tus\tturkey\t2");
                        twilight_self.addMove("unlimit\tcmc");
                        twilight_self.addMove("notify\tUS has cancelled the Cuban Missile Crisis");
                  ***REMOVED***
                      if (countryname === "westgermany") {
                        twilight_self.removeInfluence("westgermany", 2, "us");
                        twilight_self.addMove("remove\tus\tus\twestgermany\t2");
                        twilight_self.addMove("unlimit\tcmc");
                        twilight_self.addMove("notify\tUS has cancelled the Cuban Missile Crisis");
                  ***REMOVED***
                ***REMOVED***
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***
        ***REMOVED***

            twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
            twilight_self.placeInfluence(countryname, 1, "us", mycallback);

      ***REMOVED*** else {
            twilight_self.displayModal("you cannot place there...");
            return;
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED*** else {

        $(divname).off();
        $(divname).on('click', function() {

          let countryname = $(this).attr('id');

          if (twilight_self.countries[countryname].place == 1) {

    ***REMOVED***
    ***REMOVED*** vietnam revolts and china card
    ***REMOVED***
            if (twilight_self.countries[countryname].region !== "seasia") { twilight_self.game.state.events.vietnam_revolts_eligible = 0; ***REMOVED***
            if (twilight_self.countries[countryname].region.indexOf("asia") < 0) { twilight_self.game.state.events.china_card_eligible = 0; ***REMOVED***
            if (twilight_self.isControlled("us", countryname) == 1) { twilight_self.game.break_control = 1; ***REMOVED***

    ***REMOVED***
    ***REMOVED*** permit cuban missile crisis removal after placement
    ***REMOVED***
            if (twilight_self.game.state.events.cubanmissilecrisis == 1) {
              if (countryname === "cuba") {
                if (twilight_self.countries[countryname].ussr >= 1) {

          ***REMOVED***
          ***REMOVED*** allow player to remove CMC
          ***REMOVED***
                  if (twilight_self.app.BROWSER == 1) {

                    let removeinf = confirm("You are placing 1 influence in "+twilight_self.countries[countryname].name+". Once this is done, do you want to cancel the Cuban Missile Crisis by removing 2 influence in "+twilight_self.countries[countryname].name+"?");
                    if (removeinf) {

                      if (countryname === "cuba") {
                        twilight_self.removeInfluence("cuba", 2, "ussr");
                        twilight_self.addMove("remove\tussr\tussr\tcuba\t2");
                        twilight_self.addMove("unlimit\tcmc");
                        twilight_self.addMove("notify\tUSSR has cancelled the Cuban Missile Crisis");
                  ***REMOVED***
                ***REMOVED***
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***
        ***REMOVED***

            twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
            twilight_self.placeInfluence(countryname, 1, "ussr", mycallback);
      ***REMOVED*** else {
alert("set to cannot place!");
            twilight_self.displayModal("Invalid Target");
            return;
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED*** // NON RESTRICTED COUNTRY
***REMOVED***
  ***REMOVED***

***REMOVED***


playerFinishedPlacingInfluence(player, mycallback=null) {

  for (var i in this.countries) {
    let divname      = '#'+i;
    $(divname).off();
  ***REMOVED***

  if (mycallback != null) { mycallback(); ***REMOVED***

***REMOVED***


playerSpaceCard(card, player) {

  if (player == "ussr") {
    this.game.state.space_race_ussr_counter++;
  ***REMOVED*** else {
    this.game.state.space_race_us_counter++;
  ***REMOVED***

  let roll = this.rollDice(6);

  let successful     = 0;
  let next_box       = 1;

  if (player == "ussr") { next_box = this.game.state.space_race_ussr+1; ***REMOVED***
  if (player == "us") { next_box = this.game.state.space_race_us+1; ***REMOVED***

  if (next_box == 1) { if (roll < 4) { successful = 1; ***REMOVED*** ***REMOVED***
  if (next_box == 2) { if (roll < 5) { successful = 1; ***REMOVED*** ***REMOVED***
  if (next_box == 3) { if (roll < 4) { successful = 1; ***REMOVED*** ***REMOVED***
  if (next_box == 4) { if (roll < 5) { successful = 1; ***REMOVED*** ***REMOVED***
  if (next_box == 5) { if (roll < 4) { successful = 1; ***REMOVED*** ***REMOVED***
  if (next_box == 6) { if (roll < 5) { successful = 1; ***REMOVED*** ***REMOVED***
  if (next_box == 7) { if (roll < 4) { successful = 1; ***REMOVED*** ***REMOVED***
  if (next_box == 8) { if (roll < 2) { successful = 1; ***REMOVED*** ***REMOVED***

  this.updateLog("<span>" + player.toUpperCase() + "</span> <span>attempts space race (rolls</span> " + roll + ")");

  if (successful == 1) {
    this.updateLog("<span>" + player.toUpperCase() + "</span> <span>advances in the Space Race</span>");
    this.advanceSpaceRace(player);
  ***REMOVED*** else {
    this.updateLog("<span>" + player.toUpperCase() + "</span> <span>fails in the Space Race</span>");
  ***REMOVED***

***REMOVED***




///////////
// COUPS //
///////////
playerCoupCountry(player,  ops, card) {

  var twilight_self = this;

  for (var i in this.countries) {

    let countryname  = i;
    let divname      = '#'+i;

    $(divname).off();
    $(divname).on('click', function() {

      let valid_target = 0;
      let countryname = $(this).attr('id');

      //
      // sanity DEFCON check
      //
      if (twilight_self.game.state.defcon == 2 && twilight_self.game.countries[countryname].bg == 1) {
        if (confirm("Are you sure you wish to coup a Battleground State? (DEFCON is 2)")) {
    ***REMOVED*** else {
          twilight_self.playOps(player, ops, card);
          return;
    ***REMOVED***
  ***REMOVED***

      //
      // sanity Cuban Missile Crisis check
      //
      if (twilight_self.game.state.events.cubanmissilecrisis == 2 && player =="us" ||
          twilight_self.game.state.events.cubanmissilecrisis == 1 && player =="ussr"
      ) {
        if (confirm("Are you sure you wish to coup during the Cuban Missile Crisis?")) {
    ***REMOVED*** else {
          twilight_self.playOps(player, ops, card);
          return;
    ***REMOVED***
  ***REMOVED***



      if (player == "us") {
        if (twilight_self.countries[countryname].ussr <= 0) { twilight_self.displayModal("Cannot Coup"); ***REMOVED*** else { valid_target = 1; ***REMOVED***
  ***REMOVED*** else {
        if (twilight_self.countries[countryname].us <= 0)   { twilight_self.displayModal("Cannot Coup"); ***REMOVED*** else { valid_target = 1; ***REMOVED***
  ***REMOVED***

      //
      // Coup Restrictions
      //
      if (twilight_self.game.state.events.usjapan == 1 && countryname == "japan") {
        twilight_self.displayModal("US / Japan Alliance prevents coups in Japan");
        valid_target = 0;
  ***REMOVED***
      if (twilight_self.game.state.limit_ignoredefcon == 0) {
        if (twilight_self.game.state.limit_region.indexOf(twilight_self.countries[countryname].region) > -1) {
          twilight_self.displayModal("Invalid Region for this Coup");
          valid_target = 0;
    ***REMOVED***
        if (twilight_self.countries[countryname].region == "europe" && twilight_self.game.state.defcon < 5) {
          twilight_self.displayModal("DEFCON prevents coups in Europe");
          valid_target = 0;
    ***REMOVED***
        if (twilight_self.countries[countryname].region == "asia" && twilight_self.game.state.defcon < 4) {
          twilight_self.displayModal("DEFCON prevents coups in Asia");
          valid_target = 0;
    ***REMOVED***
        if (twilight_self.countries[countryname].region == "seasia" && twilight_self.game.state.defcon < 4) {
          twilight_self.displayModal("DEFCON prevents coups in Asia");
          valid_target = 0;
    ***REMOVED***
        if (twilight_self.countries[countryname].region == "mideast" && twilight_self.game.state.defcon < 3) {
          twilight_self.displayModal("DEFCON prevents coups in the Middle-East");
          valid_target = 0;
    ***REMOVED***
  ***REMOVED***
      if (valid_target == 1 && twilight_self.countries[countryname].region == "europe" && twilight_self.game.state.events.nato == 1) {
        if (twilight_self.isControlled("us", countryname) == 1) {
          if ( (countryname == "westgermany" && twilight_self.game.state.events.nato_westgermany == 0) || (countryname == "france" && twilight_self.game.state.events.nato_france == 0) ) {***REMOVED*** else {
            twilight_self.displayModal("NATO prevents coups of US-controlled countries in Europe");
            valid_target = 0;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***

      if (valid_target == 1) {

***REMOVED***
***REMOVED*** china card regional bonuses
***REMOVED***
        if (card == "china" && (twilight_self.game.countries[countryname].region == "asia" || twilight_self.game.countries[countryname].region == "seasia")) {
          twilight_self.updateLog("China bonus OP added to Asia coup...");
          ops++;
    ***REMOVED***
        if (player == "ussr" && twilight_self.game.state.events.vietnam_revolts == 1 && twilight_self.game.countries[countryname].region == "seasia") {
          twilight_self.updateLog("Vietnam Revolts bonus OP added to Southeast Asia coup...");
          ops++;
    ***REMOVED***

***REMOVED*** twilight_self.displayModal("Coup launched in " + twilight_self.game.countries[countryname].name);
        twilight_self.displayModal("Coup Launched", `Coup launched in ${twilight_self.game.countries[countryname].name***REMOVED***`);
        twilight_self.addMove("coup\t"+player+"\t"+countryname+"\t"+ops+"\t"+card);
        twilight_self.endTurn();
  ***REMOVED***

***REMOVED***);
  ***REMOVED***
***REMOVED***




playCoup(player, countryname, ops, mycallback=null) {

  let roll    = this.rollDice(6);

  //
  // Yuri and Samantha
  //
  if (this.game.state.events.yuri == 1) {
    if (player == "us") {
      this.game.state.vp -= 1;
      this.updateVictoryPoints();
      this.updateLog("USSR gains 1 VP from Yuri and Samantha");
***REMOVED***
  ***REMOVED***

  //
  // Salt Negotiations
  //
  if (this.game.state.events.saltnegotiations == 1) {
    this.updateLog("Salt Negotiations -1 modifier on coups");
    roll--;
  ***REMOVED***

  //
  // Latin American Death Squads
  //
  if (this.game.state.events.deathsquads != 0) {
    if (this.game.state.events.deathsquads == 1) {
      if (this.countries[countryname].region == "camerica" || this.countries[countryname].region == "samerica") {
        if (player == "ussr") {
          this.updateLog("USSR gets +1 coup bonus");
          this.updateLog("Latin American Death Squads trigger");
          roll++;
    ***REMOVED***
  ***REMOVED***
      if (player == "us")   {
        this.updateLog("US gets -1 coup penalty");
        this.updateLog("Latin American Death Squads trigger");
        roll--;
  ***REMOVED***
***REMOVED***
    if (this.game.state.events.deathsquads == 2) {
      if (player == "ussr") {
        this.updateLog("USSR gets -1 coup penalty");
        this.updateLog("Latin American Death Squads trigger");
        roll--;
  ***REMOVED***
      if (this.countries[countryname].region == "camerica" || this.countries[countryname].region == "samerica") {
        if (player == "us")   {
          this.updateLog("US gets +1 coup bonus");
          this.updateLog("Latin American Death Squads trigger");
          roll++;
    ***REMOVED***
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  let control = this.countries[countryname].control;
  let winning = parseInt(roll) + parseInt(ops) - parseInt(control * 2);

  //
  // Cuban Missile Crisis
  //
  if (player == "ussr" && this.game.state.events.cubanmissilecrisis == 1) {
    this.endGame("us","Cuban Missile Crisis");
    return;
  ***REMOVED***
  if (player == "us" && this.game.state.events.cubanmissilecrisis == 2) {
    this.endGame("ussr","Cuban Missile Crisis");
    return;
  ***REMOVED***


  if (this.countries[countryname].bg == 1) {
    //
    // Nuclear Submarines
    //
    if (player == "us" && this.game.state.events.nuclearsubs == 1) {***REMOVED*** else {
      this.lowerDefcon();
***REMOVED***
  ***REMOVED***


  if (winning > 0) {

    if (this.browser_active == 1) {
      this.displayModal(`COUP SUCCEEDED: ${player.toUpperCase()***REMOVED*** rolls ${roll***REMOVED*** (${this.game.countries[countryname].name***REMOVED***)`);
***REMOVED***

    this.updateLog(player.toUpperCase() + " <span>rolls</span> " + roll);

    while (winning > 0) {

      if (player == "us") {

        if (this.countries[countryname].ussr > 0) {
          this.removeInfluence(countryname, 1, "ussr");
    ***REMOVED*** else {
          this.placeInfluence(countryname, 1, "us");
    ***REMOVED***
  ***REMOVED***

      if (player == "ussr") {
        if (this.countries[countryname].us > 0) {
          this.removeInfluence(countryname, 1, "us");
    ***REMOVED*** else {
          this.placeInfluence(countryname, 1, "ussr");
    ***REMOVED***
  ***REMOVED***

      winning--;

***REMOVED***
  ***REMOVED*** else {

    if (this.browser_active == 1) {
      this.updateLog(player.toUpperCase() + "</span> <span>rolls</span> " + roll + " <span>(no change)");
***REMOVED***
  ***REMOVED***


  //
  // update country
  //
  this.showInfluence(countryname, player);

  if (mycallback != null) {
    mycallback();
  ***REMOVED***

  return;
***REMOVED***



playRealign(country) {

  let outcome_determined = 0;

  while (outcome_determined == 0) {

    let bonus_us = 0;
    let bonus_ussr = 0;

    if (this.countries[country].us > this.countries[country].ussr) {
      bonus_us++;
***REMOVED***
    if (this.countries[country].ussr > this.countries[country].us) {
      bonus_ussr++;
***REMOVED***
    for (let z = 0; z < this.countries[country].neighbours.length; z++) {
      let racn = this.countries[country].neighbours[z];
      if (this.isControlled("us", racn) == 1) {
        bonus_us++;
  ***REMOVED***
      if (this.isControlled("ussr", racn) == 1) {
        bonus_ussr++;
  ***REMOVED***
***REMOVED***

    //
    // handle adjacent influence
    //
    if (country === "mexico") { bonus_us++; ***REMOVED***
    if (country === "cuba")   { bonus_us++; ***REMOVED***
    if (country === "japan")  { bonus_us++; ***REMOVED***
    if (country === "canada") { bonus_us++; ***REMOVED***
    if (country === "finland") { bonus_ussr++; ***REMOVED***
    if (country === "romania") { bonus_ussr++; ***REMOVED***
    if (country === "afghanistan") { bonus_ussr++; ***REMOVED***
    if (country === "northkorea") { bonus_ussr++; ***REMOVED***


    //
    // Iran-Contra Scandal
    //
    if (this.game.state.events.irancontra == 1) {
      this.updateLog("Iran-Contra Scandal -1 modification on US roll");
      bonus_us--;
***REMOVED***

    let roll_us   = this.rollDice(6);
    let roll_ussr = this.rollDice(6);

    this.updateLog("<span>US bonus</span> " + bonus_us + " <span>vs. USSR bonus</span> " + bonus_ussr);
    this.updateLog("<span>US roll</span> " + roll_us + " <span>vs. USSR roll</span> " + roll_ussr);

    roll_us   = roll_us + bonus_us;
    roll_ussr = roll_ussr + bonus_ussr;

    if (roll_us > roll_ussr) {
      outcome_determined = 1;
      let diff = roll_us - roll_ussr;
      if (this.countries[country].ussr > 0) {
        if (this.countries[country].ussr < diff) {
          diff = this.countries[country].ussr;
    ***REMOVED***
        this.removeInfluence(country, diff, "ussr");
  ***REMOVED***
***REMOVED***
    if (roll_us < roll_ussr) {
      outcome_determined = 1;
      let diff = roll_ussr - roll_us;
      if (this.countries[country].us > 0) {
        if (this.countries[country].us < diff) {
          diff = this.countries[country].us;
    ***REMOVED***
        this.removeInfluence(country, diff, "us");
  ***REMOVED***
***REMOVED***
    if (roll_us === roll_ussr) {
      outcome_determined = 1;
***REMOVED***
  ***REMOVED***

  this.showInfluence(country, "us");
  this.showInfluence(country, "ussr");

***REMOVED***








///////////////////////
// Twilight Specific //
///////////////////////
addMove(mv) {
  this.moves.push(mv);
***REMOVED***

removeMove() {
  return this.moves.pop();
***REMOVED***

endTurn(nextTarget=0) {

  //
  // cancel back button on subsequent cards picks
  //
  this.game.state.back_button_cancelled = 1;

console.log("\n\n\nHERE WE ARE AT END TURN: " + JSON.stringify(this.game.queue));

  //
  // show active events
  //
  this.updateEventTiles();


  this.updateStatus("Waiting for information from peers....");

  //
  // remove events from board to prevent "Doug Corley" gameplay
  //
  $(".card").off();
  $(".country").off();

  //
  // we will bury you scores first!
  //
  if (this.game.state.events.wwby_triggers == 1) {
    this.addMove("notify\tWe Will Bury You triggers +3 VP for USSR");
    this.addMove("vp\tussr\t3");
    this.game.state.events.wwby_triggers = 0;
  ***REMOVED***

  let cards_in_hand = this.game.deck[0].hand.length;
  for (let z = 0; z < this.game.deck[0].hand.length; z++) {
    if (this.game.deck[0].hand[z] == "china") {
      cards_in_hand--;
***REMOVED***
  ***REMOVED***

  let extra = {***REMOVED***;
  this.addMove("setvar\topponent_cards_in_hand\t"+cards_in_hand);
  this.game.turn = this.moves;
  this.moves = [];
  this.sendMessage("game", extra);

console.log("MESSAGE SENT: " + this.game.queue);

***REMOVED***


undoMove(move_type, num_of_moves) {

  switch(move_type) {
    case 'place':
      // iterate through the queue and remove past moves
      // cycle through past moves to know what to revert
      for (let i = 0; i < num_of_moves; i++) {
        let last_move = this.removeMove();
        last_move = last_move.split('\t');
        let player = last_move[2];
        let country = last_move[3];
        let ops = last_move[4];

	let opponent = "us";
	if (player == "us") { opponent = "ussr"; ***REMOVED***
        this.removeInfluence(country, ops, player);

	//
	// if the country is now enemy controlled, it must have taken an extra move
	// for the play to place there....
	//
        if (this.isControlled(opponent, country) == 1) {
	  i++;
    ***REMOVED***

  ***REMOVED***

      // use this to clear the "resolve ops" move
      this.removeMove();
      return 1;
    default:
      break;
      return 0;
  ***REMOVED***
***REMOVED***


endGame(winner, method) {

  this.game.over = 1;
  if (winner == "us") { this.game.winner = 2; ***REMOVED***
  if (winner == "ussr") { this.game.winner = 1; ***REMOVED***

  if (this.game.winner == this.game.player) {
    //
    // share wonderful news
    //
    this.game.over = 0;
    this.resignGame();
  ***REMOVED***

  if (this.browser_active == 1) {
    this.displayModal("<span>The Game is Over</span> - <span>" + winner.toUpperCase() + "</span> <span>wins by</span> <span>" + method + "<span>");
    this.updateStatus("<span>The Game is Over</span> - <span>" + winner.toUpperCase() + "</span> <span>wins by</span> <span>" + method + "<span>");
  ***REMOVED***
***REMOVED***




endRound() {

  this.game.state.round++;
  this.game.state.turn 		= 0;
  this.game.state.turn_in_round = 0;
  this.game.state.move 		= 0;

  //
  // game over if scoring card is held
  //
  if (this.game.state.round > 1) {
    for (let i = 0 ; i < this.game.deck[0].hand.length; i++) {
      if (this.game.deck[0].cards[this.game.deck[0].hand[i]].scoring == 1) {
        let player = "us";
        let winner = "ussr";
        if (this.game.player == 1) { player = "ussr"; winner = "us"; this.game.winner = 2; ***REMOVED***
        this.resignGame(player.toUpperCase() + " held scoring card");
        this.endGame(winner, "opponent held scoring card");
  ***REMOVED***
***REMOVED***
  ***REMOVED***


  //
  // calculate milops
  //
  if (this.game.state.round > 1) {
    let milops_needed = this.game.state.defcon;
    let ussr_milops_deficit = (this.game.state.defcon-this.game.state.milops_ussr);
    let us_milops_deficit = (this.game.state.defcon-this.game.state.milops_us);

    if (ussr_milops_deficit > 0) {
      this.game.state.vp += ussr_milops_deficit;
      this.updateLog("<span>USSR penalized</span> " + ussr_milops_deficit + " <span>VP (milops)</span>");
***REMOVED***
    if (us_milops_deficit > 0) {
      this.game.state.vp -= us_milops_deficit;
      this.updateLog("<span>US penalized</span> " + us_milops_deficit + " <span>VP (milops)</span>");
***REMOVED***
  ***REMOVED***

  this.game.state.us_defcon_bonus = 0;

  this.game.state.milops_us = 0;
  this.game.state.milops_ussr = 0;

  this.game.state.space_race_us_counter = 0;
  this.game.state.space_race_ussr_counter = 0;
  this.game.state.eagle_has_landed_bonus_taken = 0;
  this.game.state.space_shuttle_bonus_taken = 0;

  // set to 1 when ironlady events before ops played (by ussr - limits placement to rules)
  this.game.state.ironlady_before_ops = 0;

  this.game.state.events.wwby_triggers = 0;
  this.game.state.events.region_bonus = "";
  this.game.state.events.u2 = 0;
  this.game.state.events.containment = 0;
  this.game.state.events.brezhnev = 0;
  this.game.state.events.redscare_player1 = 0;
  this.game.state.events.redscare_player2 = 0;
  this.game.state.events.vietnam_revolts = 0;
  this.game.state.events.vietnam_revolts_eligible = 0;
  this.game.state.events.deathsquads = 0;
  this.game.state.events.missileenvy = 0;
  this.game.state.events.cubanmissilecrisis = 0;
  this.game.state.events.nuclearsubs = 0;
  this.game.state.events.saltnegotiations = 0;
  this.game.state.events.northseaoil_bonus = 0;
  this.game.state.events.yuri = 0;
  this.game.state.events.irancontra = 0;
  this.game.state.events.chernobyl = "";
  this.game.state.events.aldrich = 0;

  //
  // increase DEFCON by one
  //
  this.game.state.defcon++;
  if (this.game.state.defcon > 5) { this.game.state.defcon = 5; ***REMOVED***
  this.game.state.ussr_milops = 0;
  this.game.state.us_milops = 0;


  this.updateDefcon();
  this.updateActionRound();
  this.updateSpaceRace();
  this.updateVictoryPoints();
  this.updateMilitaryOperations();
  this.updateRound();

  //
  // give me the china card if needed
  //
  let do_i_have_the_china_card = 0;
  for (let i = 0; i < this.game.deck[0].hand.length; i++) {
    if (this.game.deck[0].hand[i] == "china") {
      do_i_have_the_china_card = 1;
***REMOVED***
  ***REMOVED***
  if (do_i_have_the_china_card == 0) {
    if (this.game.player == 1) {
      if (this.game.state.events.china_card == 1) {
        if (!this.game.deck[0].hand.includes("china")) {
          this.game.deck[0].hand.push("china");
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    if (this.game.player == 2) {
      if (this.game.state.events.china_card == 2) {
        if (!this.game.deck[0].hand.includes("china")) {
          this.game.deck[0].hand.push("china");
    ***REMOVED***
  ***REMOVED***
***REMOVED***
  ***REMOVED***
  this.game.state.events.china_card = 0;
  this.game.state.events.china_card_eligible = 0;


***REMOVED***




whoHasTheChinaCard() {

  let do_i_have_the_china_card = 0;

  for (let i = 0; i < this.game.deck[0].hand.length; i++) {
    if (this.game.deck[0].hand[i] == "china") {
      do_i_have_the_china_card = 1;
***REMOVED***
  ***REMOVED***

  if (do_i_have_the_china_card == 0) {
    if (this.game.player == 1) {
      if (this.game.state.events.china_card == 1) {
        if (!this.game.deck[0].hand.includes("china")) {
          return "us";
    ***REMOVED*** else {
          return "ussr";
    ***REMOVED***
  ***REMOVED*** else {
        if (do_i_have_the_china_card == 1) {
          return "ussr";
    ***REMOVED*** else {
          return "us";
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    if (this.game.player == 2) {
      if (this.game.state.events.china_card == 2) {
        if (!this.game.deck[0].hand.includes("china")) {
          return "ussr";
    ***REMOVED*** else {
          return "us";
    ***REMOVED***
  ***REMOVED*** else {
        if (do_i_have_the_china_card == 1) {
          return "us";
    ***REMOVED*** else {
          return "ussr";
    ***REMOVED***
  ***REMOVED***
***REMOVED***
  ***REMOVED*** else {
    if (this.game.player == 1) { return "ussr"; ***REMOVED***
    if (this.game.player == 2) { return "us"; ***REMOVED***
  ***REMOVED***

  //
  // we should never hit this
  //

***REMOVED***




////////////////////
// Core Game Data //
////////////////////
returnState() {

  var state = {***REMOVED***;

  state.dealt = 0;
  state.back_button_cancelled = 0;
  state.defectors_pulled_in_headline = 0;
  state.placement = 0;
  state.headline  = 0;
  state.headline_hash = "";
  state.headline_card = "";
  state.headline_xor = "";
  state.headline_opponent_hash = "";
  state.headline_opponent_card = "";
  state.headline_opponent_xor = "";
  state.round = 0;
  state.turn  = 0;
  state.turn_in_round = 0;
  state.broke_control = 0;
  state.us_efcon_bonus = 0;
  state.opponent_cards_in_hand = 0;
  state.event_before_ops = 0;
  state.event_name = "";
  state.player_to_go = 1; // used in headline to track phasing player (primarily for assigning losses for defcon lowering stunts)

  state.vp_outstanding = 0; // vp not settled yet

  state.space_race_us = 0;
  state.space_race_ussr = 0;

  state.animal_in_space = "";
  state.man_in_earth_orbit = "";
  state.eagle_has_landed = "";
  state.eagle_has_landed_bonus_taken = 0;
  state.space_shuttle = "";
  state.space_shuttle_bonus_taken = 0;

  state.space_race_us_counter = 0;
  state.space_race_ussr_counter = 0;

  state.limit_coups = 0;
  state.limit_realignments = 0;
  state.limit_placement = 0;
  state.limit_spacerace = 0;
  state.limit_region = "";
  state.limit_ignoredefcon = 0;

  // track as US (+) and USSR (-)
  state.vp    = 0;

  state.ar_ps         = [];

  // relative --> top: 38px
  state.ar_ps[0]      = { top : 208 , left : 920 ***REMOVED***;
  state.ar_ps[1]      = { top : 208 , left : 1040 ***REMOVED***;
  state.ar_ps[2]      = { top : 208 , left : 1155 ***REMOVED***;
  state.ar_ps[3]      = { top : 208 , left : 1270 ***REMOVED***;
  state.ar_ps[4]      = { top : 208 , left : 1390 ***REMOVED***;
  state.ar_ps[5]      = { top : 208 , left : 1505 ***REMOVED***;
  state.ar_ps[6]      = { top : 208 , left : 1625 ***REMOVED***;
  state.ar_ps[7]      = { top : 208 , left : 1740 ***REMOVED***;

  state.vp_ps     = [];
  state.vp_ps[0]  = { top : 2460, left : 3040 ***REMOVED***;
  state.vp_ps[1]  = { top : 2460, left : 3300 ***REMOVED***;
  state.vp_ps[2]  = { top : 2460, left : 3435 ***REMOVED***;
  state.vp_ps[3]  = { top : 2460, left : 3570 ***REMOVED***;
  state.vp_ps[4]  = { top : 2460, left : 3705 ***REMOVED***;
  state.vp_ps[5]  = { top : 2460, left : 3840 ***REMOVED***;
  state.vp_ps[6]  = { top : 2460, left : 3975 ***REMOVED***;
  state.vp_ps[7]  = { top : 2460, left : 4110 ***REMOVED***;

  state.vp_ps[8]  = { top : 2600, left : 3035 ***REMOVED***;
  state.vp_ps[9]  = { top : 2600, left : 3170 ***REMOVED***;
  state.vp_ps[10]  = { top : 2600, left : 3305 ***REMOVED***;
  state.vp_ps[11]  = { top : 2600, left : 3435 ***REMOVED***;
  state.vp_ps[12]  = { top : 2600, left : 3570 ***REMOVED***;
  state.vp_ps[13]  = { top : 2600, left : 3705 ***REMOVED***;
  state.vp_ps[14]  = { top : 2600, left : 3840 ***REMOVED***;
  state.vp_ps[15]  = { top : 2600, left : 3975 ***REMOVED***;
  state.vp_ps[16]  = { top : 2600, left : 4110 ***REMOVED***;

  state.vp_ps[17]  = { top : 2740, left : 3035 ***REMOVED***;
  state.vp_ps[18]  = { top : 2740, left : 3170 ***REMOVED***;
  state.vp_ps[19]  = { top : 2740, left : 3305 ***REMOVED***;
  state.vp_ps[20]  = { top : 2740, left : 3570 ***REMOVED***;
  state.vp_ps[21]  = { top : 2740, left : 3840 ***REMOVED***;
  state.vp_ps[22]  = { top : 2740, left : 3975 ***REMOVED***;
  state.vp_ps[23]  = { top : 2740, left : 4110 ***REMOVED***;

  state.vp_ps[24]  = { top : 2880, left : 3035 ***REMOVED***;
  state.vp_ps[25]  = { top : 2880, left : 3170 ***REMOVED***;
  state.vp_ps[26]  = { top : 2880, left : 3305 ***REMOVED***;
  state.vp_ps[27]  = { top : 2880, left : 3435 ***REMOVED***;
  state.vp_ps[28]  = { top : 2880, left : 3570 ***REMOVED***;
  state.vp_ps[29]  = { top : 2880, left : 3705 ***REMOVED***;
  state.vp_ps[30]  = { top : 2880, left : 3840 ***REMOVED***;
  state.vp_ps[31]  = { top : 2880, left : 3975 ***REMOVED***;
  state.vp_ps[32]  = { top : 2880, left : 4110 ***REMOVED***;

  state.vp_ps[33]  = { top : 3025, left : 3035 ***REMOVED***;
  state.vp_ps[34]  = { top : 3025, left : 3170 ***REMOVED***;
  state.vp_ps[35]  = { top : 3025, left : 3305 ***REMOVED***;
  state.vp_ps[36]  = { top : 3025, left : 3435 ***REMOVED***;
  state.vp_ps[37]  = { top : 3025, left : 3570 ***REMOVED***;
  state.vp_ps[38]  = { top : 3025, left : 3705 ***REMOVED***;
  state.vp_ps[39]  = { top : 3025, left : 3840 ***REMOVED***;
  state.vp_ps[40]  = { top : 3025, left : 3975 ***REMOVED***;

  state.space_race_ps = [];
  state.space_race_ps[0] = { top : 510 , left : 3465 ***REMOVED***
  state.space_race_ps[1] = { top : 510 , left : 3638 ***REMOVED***
  state.space_race_ps[2] = { top : 510 , left : 3810 ***REMOVED***
  state.space_race_ps[3] = { top : 510 , left : 3980 ***REMOVED***
  state.space_race_ps[4] = { top : 510 , left : 4150 ***REMOVED***
  state.space_race_ps[5] = { top : 510 , left : 4320 ***REMOVED***
  state.space_race_ps[6] = { top : 510 , left : 4490 ***REMOVED***
  state.space_race_ps[7] = { top : 510 , left : 4660 ***REMOVED***
  state.space_race_ps[8] = { top : 510 , left : 4830 ***REMOVED***

  state.milops_us = 0;
  state.milops_ussr = 0;

  state.milops_ps    = [];
  state.milops_ps[0]  = { top : 2940 , left : 1520 ***REMOVED***;
  state.milops_ps[1]  = { top : 2940 , left : 1675 ***REMOVED***;
  state.milops_ps[2]  = { top : 2940 , left : 1830 ***REMOVED***;
  state.milops_ps[3]  = { top : 2940 , left : 1985 ***REMOVED***;
  state.milops_ps[4]  = { top : 2940 , left : 2150 ***REMOVED***;
  state.milops_ps[5]  = { top : 2940 , left : 2305 ***REMOVED***;

  state.defcon = 5;

  state.defcon_ps    = [];
  state.defcon_ps[0] = { top : 2585, left : 1520 ***REMOVED***;
  state.defcon_ps[1] = { top : 2585, left : 1675 ***REMOVED***;
  state.defcon_ps[2] = { top : 2585, left : 1830 ***REMOVED***;
  state.defcon_ps[3] = { top : 2585, left : 1985 ***REMOVED***;
  state.defcon_ps[4] = { top : 2585, left : 2140 ***REMOVED***;

  state.round_ps    = [];
  state.round_ps[0] = { top : 150, left : 3473 ***REMOVED***;
  state.round_ps[1] = { top : 150, left : 3627 ***REMOVED***;
  state.round_ps[2] = { top : 150, left : 3781 ***REMOVED***;
  state.round_ps[3] = { top : 150, left : 3935 ***REMOVED***;
  state.round_ps[4] = { top : 150, left : 4098 ***REMOVED***;
  state.round_ps[5] = { top : 150, left : 4252 ***REMOVED***;
  state.round_ps[6] = { top : 150, left : 4405 ***REMOVED***;
  state.round_ps[7] = { top : 150, left : 4560 ***REMOVED***;
  state.round_ps[8] = { top : 150, left : 4714 ***REMOVED***;
  state.round_ps[9] = { top : 150, left : 4868 ***REMOVED***;

  // events - early war
  state.events = {***REMOVED***;
  state.events.optional = {***REMOVED***;			// optional cards -- makes easier to search for
  state.events.formosan           = 0;
  state.events.redscare_player1   = 0;
  state.events.redscare_player2   = 0;
  state.events.containment        = 0;
  state.events.degaulle           = 0;
  state.events.nato               = 0;
  state.events.nato_westgermany   = 0;
  state.events.nato_france        = 0;
  state.events.marshall           = 0;
  state.events.warsawpact         = 0;
  state.events.unintervention     = 0;
  state.events.usjapan            = 0;
  state.events.norad              = 0;

  // regional bonus events
  state.events.vietnam_revolts = 0;
  state.events.vietnam_revolts_eligible = 0;
  state.events.china_card         = 0;
  state.events.china_card_in_play = 0;
  state.events.china_card_eligible = 0;

  // events - mid-war
  state.events.northseaoil        = 0;
  state.events.johnpaul           = 0;
  state.events.ourmanintehran     = 0;
  state.events.kitchendebates     = 0;
  state.events.brezhnev           = 0;
  state.events.wwby               = 0;
  state.events.wwby_triggers      = 0;
  state.events.willybrandt        = 0;
  state.events.shuttlediplomacy   = 0;
  state.events.deathsquads        = 0;
  state.events.campdavid          = 0;
  state.events.cubanmissilecrisis = 0;
  state.events.saltnegotiations   = 0;
  state.events.missileenvy        = 0; // tracks whether happening
  state.events.missile_envy       = 0; // to whom
  state.events.flowerpower        = 0;
  state.events.beartrap           = 0;
  state.events.quagmire           = 0;

  // events - late war
  state.events.awacs              = 0;
  state.events.starwars           = 0;
  state.events.teardown           = 0;
  state.events.iranianhostage     = 0;
  state.events.ironlady           = 0;
  state.events.reformer           = 0;
  state.events.northseaoil        = 0;
  state.events.northseaoil_bonus  = 0;
  state.events.evilempire         = 0;
  state.events.yuri               = 0;
  state.events.aldrich            = 0;

  return state;

***REMOVED***


returnCountries() {

  var countries = {***REMOVED***;

  // EUROPE
  countries['canada'] = { top : 752, left : 842 , us : 2 , ussr : 0 , control : 4 , bg : 0 , neighbours : [ 'uk' ] , region : "europe" , name : "Canada" ***REMOVED***;
  countries['uk'] = { top : 572, left : 1690 , us : 5 , ussr : 0 , control : 5 , bg : 0 , neighbours : [ 'canada','norway','benelux','france' ] , region : "europe" , name : "UK" ***REMOVED***;
  countries['benelux'] = { top : 728, left : 1860 , us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'uk','westgermany' ] , region : "europe" , name : "Benelux" ***REMOVED***;
  countries['france'] = { top : 906, left : 1820 , us : 0 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'algeria', 'uk','italy','spain','westgermany' ] , region : "europe" , name : "France" ***REMOVED***;
  countries['italy'] = { top : 1036, left : 2114 , us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'spain','france','greece','austria','yugoslavia' ] , region : "europe" , name : "Italy" ***REMOVED***;
  countries['westgermany'] = { top : 728, left : 2078 , us : 0 , ussr : 0 , control : 4 , bg : 1 , neighbours : [ 'austria','france','benelux','denmark','eastgermany' ] , region : "europe" , name : "West Germany" ***REMOVED***;
  countries['eastgermany'] = { top : 580, left : 2156 , us : 0 , ussr : 3 , control : 3 , bg : 1 , neighbours : [ 'westgermany','poland','austria' ] , region : "europe" , name : "East Germany" ***REMOVED***;
  countries['poland'] = { top : 580, left : 2386 , us : 0 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'eastgermany','czechoslovakia' ] , region : "europe" , name : "Poland" ***REMOVED***;
  countries['spain'] = { top : 1118, left : 1660 , us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'morocco', 'france','italy' ] , region : "europe" , name : "Spain" ***REMOVED***;
  countries['greece'] = { top : 1200, left : 2392 , us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'italy','turkey','yugoslavia','bulgaria' ] , region : "europe" , name : "Greece" ***REMOVED***;
  countries['turkey'] = { top : 1056, left : 2788 , us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'syria', 'greece','romania','bulgaria' ] , region : "europe"  , name : "Turkey"***REMOVED***;
  countries['yugoslavia'] = { top : 1038, left : 2342 , us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'italy','hungary','romania','greece' ] , region : "europe" , name : "Yugoslavia" ***REMOVED***;
  countries['bulgaria'] = { top : 1038, left : 2570 , us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'greece','turkey' ] , region : "europe" , name : "Bulgaria" ***REMOVED***;

  countries['romania'] = { top : 880, left : 2614 , us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'turkey','hungary','yugoslavia' ] , region : "europe" , name : "Romania" ***REMOVED***;
  countries['hungary'] = { top : 880, left : 2394 , us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'austria','czechoslovakia','romania','yugoslavia' ] , region : "europe" , name : "Hungary" ***REMOVED***;
  countries['austria'] = { top : 880, left : 2172 , us : 0 , ussr : 0 , control : 4 , bg : 0 , neighbours : [ 'hungary','italy','westgermany','eastgermany' ] , region : "europe" , name : "Austria" ***REMOVED***;
  countries['czechoslovakia'] = { top : 728, left : 2346 , us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'hungary','poland','eastgermany' ] , region : "europe" , name : "Czechoslovakia" ***REMOVED***;
  countries['denmark'] = { top : 432, left : 1982 , us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'sweden','westgermany' ] , region : "europe" , name : "Denmark" ***REMOVED***;
  countries['norway'] = { top : 278, left : 1932 , us : 0 , ussr : 0 , control : 4 , bg : 0 , neighbours : [ 'uk','sweden' ] , region : "europe" , name : "Norway" ***REMOVED***;
  countries['finland'] = { top : 286, left : 2522 , us : 0 , ussr : 1 , control : 4 , bg : 0 , neighbours : [ 'sweden' ] , region : "europe" , name : "Finland" ***REMOVED***;
  countries['sweden'] = { top : 410, left : 2234 , us : 0 , ussr : 0 , control : 4 , bg : 0 , neighbours : [ 'finland','denmark','norway' ] , region : "europe" , name : "Sweden" ***REMOVED***;

  // MIDDLE EAST
  countries['libya'] = { top : 1490, left : 2290, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'egypt','tunisia' ] , region : "mideast" , name : "Libya" ***REMOVED***;
  countries['egypt'] = { top : 1510, left : 2520, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'libya','sudan','israel' ], region : "mideast"  , name : "Egypt"***REMOVED***;
  countries['lebanon'] = { top : 1205, left : 2660, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'syria','jordan','israel' ], region : "mideast"  , name : "Lebanon"***REMOVED***;
  countries['syria'] = { top : 1205, left : 2870, us : 0 , ussr : 1 , control : 2 , bg : 0 , neighbours : [ 'lebanon','turkey','israel' ], region : "mideast"  , name : "Syria"***REMOVED***;
  countries['israel'] = { top : 1350, left : 2620, us : 1 , ussr : 0 , control : 4 , bg : 1 , neighbours : [ 'egypt','jordan','lebanon','syria' ], region : "mideast" , name : "Israel" ***REMOVED***;
  countries['iraq'] = { top : 1350, left : 2870, us : 0 , ussr : 1 , control : 3 , bg : 1 , neighbours : [ 'jordan','iran','gulfstates','saudiarabia' ], region : "mideast" , name : "Iraq" ***REMOVED***;
  countries['iran'] = { top : 1350, left : 3082, us : 1 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'iraq','afghanistan','pakistan' ], region : "mideast" , name : "Iran" ***REMOVED***;
  countries['jordan'] = { top : 1500, left : 2760, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'israel','lebanon','iraq','saudiarabia' ], region : "mideast" , name : "Jordan" ***REMOVED***;
  countries['gulfstates'] = { top : 1500, left : 3010, us : 0 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'iraq','saudiarabia' ], region : "mideast" , name : "Gulf States" ***REMOVED***;
  countries['saudiarabia'] = { top : 1650, left : 2950, us : 0 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'jordan','iraq','gulfstates' ], region : "mideast" , name : "Saudi Arabia" ***REMOVED***;


  // ASIA
  countries['afghanistan'] = { top : 1250, left : 3345, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'iran','pakistan' ], region : "asia" , name : "Afghanistan" ***REMOVED***;
  countries['pakistan'] = { top : 1450, left : 3345, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'iran','afghanistan','india' ], region : "asia" , name : "Pakistan"***REMOVED***
  countries['india'] = { top : 1552, left : 3585, us : 0 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'pakistan','burma' ], region : "asia" , name : "India"***REMOVED***;
  countries['burma'] = { top : 1580, left : 3855, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'india','laos' ], region : "seasia" , name : "Burma"***REMOVED***;
  countries['laos'] = { top : 1600, left : 4070, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'burma','thailand','vietnam' ], region : "seasia" , name : "Laos"***REMOVED***;
  countries['thailand'] = { top : 1769, left : 3980, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'laos','vietnam','malaysia' ], region : "seasia" , name : "Thailand"***REMOVED***;
  countries['vietnam'] = { top : 1760, left : 4200, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'laos','thailand' ], region : "seasia" , name : "Vietnam"***REMOVED***;
  countries['malaysia'] = { top : 1990, left : 4080, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'thailand','australia','indonesia' ], region : "seasia" , name : "Malaysia"***REMOVED***;
  countries['australia'] = { top : 2442, left : 4450, us : 4 , ussr : 0 , control : 4 , bg : 0 , neighbours : [ 'malaysia' ], region : "seasia" , name : "Australia" ***REMOVED***;
  countries['indonesia'] = { top : 2176, left : 4450, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'malaysia','philippines' ], region : "seasia" , name : "Indonesia"***REMOVED***;
  countries['philippines'] = { top : 1755, left : 4530, us : 1 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'indonesia','japan' ], region : "seasia" , name : "Philippines"***REMOVED***;
  countries['taiwan'] = { top : 1525, left : 4435, us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'japan','southkorea' ], region : "asia" , name : "Taiwan"***REMOVED***;
  countries['japan'] = { top : 1348, left : 4705, us : 1 , ussr : 0 , control : 4 , bg : 1 , neighbours : [ 'philippines','taiwan','southkorea' ], region : "asia" , name : "Japan"***REMOVED***;
  countries['southkorea'] = { top : 1200, left : 4530, us : 1 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'japan','taiwan','northkorea' ], region : "asia" , name : "South Korea"***REMOVED***;
  countries['northkorea'] = { top : 1050, left : 4480, us : 0 , ussr : 3 , control : 3 , bg : 1 , neighbours : [ 'southkorea' ], region : "asia" , name : "North Korea"***REMOVED***;



  // CENTRAL AMERICA
  countries['mexico'] = { top : 1370, left : 175, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'guatemala' ], region : "camerica" , name : "Mexico"***REMOVED***;
  countries['guatemala'] = { top : 1526, left : 360, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'mexico','elsalvador','honduras' ], region : "camerica" , name : "Guatemala"***REMOVED***;
  countries['elsalvador'] = { top : 1690, left : 295, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'honduras','guatemala' ], region : "camerica" , name : "El Salvador"***REMOVED***;
  countries['honduras'] = { top : 1675, left : 515, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'nicaragua','costarica','guatemala','elsalvador' ], region : "camerica" , name : "Honduras"***REMOVED***;
  countries['nicaragua'] = { top : 1675, left : 735, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'costarica','honduras','cuba' ], region : "camerica" , name : "Nicaragua"***REMOVED***;
  countries['costarica'] = { top : 1830, left : 495, us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'honduras', 'panama','nicaragua' ], region : "camerica" , name : "Costa Rica"***REMOVED***;
  countries['panama'] = { top : 1830, left : 738, us : 1 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'colombia','costarica' ], region : "camerica" , name : "Panama"***REMOVED***;
  countries['cuba'] = { top : 1480, left : 750, us : 0 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'haiti','nicaragua' ], region : "camerica" , name : "Cuba"***REMOVED***;
  countries['haiti'] = { top : 1620, left : 970, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'cuba','dominicanrepublic' ], region : "camerica" , name : "Haiti"***REMOVED***;
  countries['dominicanrepublic'] = { top : 1620, left : 1180, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'haiti' ], region : "camerica" , name : "Dominican Republic"***REMOVED***;

  // SOUTH AMERICA
  countries['venezuela'] = { top : 1850, left : 1000, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'colombia','brazil' ], region : "samerica" , name : "Venezuela"***REMOVED***;
  countries['colombia'] = { top : 2010, left : 878, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'panama','venezuela','ecuador' ], region : "samerica" , name : "Colombia"***REMOVED***;
  countries['ecuador'] = { top : 2075, left : 650, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'peru','colombia' ], region : "samerica" , name : "Ecuador"***REMOVED***;
  countries['peru'] = { top : 2244, left : 780, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'ecuador','chile','bolivia' ], region : "samerica" , name : "Peru"***REMOVED***;
  countries['chile'] = { top : 2570, left : 885, us : 0 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'peru','argentina' ], region : "samerica" , name : "Chile"***REMOVED***;
  countries['bolivia'] = { top : 2385, left : 1005, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'paraguay','peru' ], region : "samerica" , name : "Bolivia"***REMOVED***;
  countries['argentina'] = { top : 2860, left : 955, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'chile','uruguay','paraguay' ], region : "samerica" , name : "Argentina"***REMOVED***;
  countries['paraguay'] = { top : 2550, left : 1130, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'uruguay','argentina','bolivia' ], region : "samerica" , name : "Paraguay"***REMOVED***;
  countries['uruguay'] = { top : 2740, left : 1200, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'argentina','paraguay','brazil' ], region : "samerica" , name : "Uruguay"***REMOVED***;
  countries['brazil'] = { top : 2230, left : 1385, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'uruguay','venezuela' ], region : "samerica" , name : "Brazil"***REMOVED***;

  // AFRICA
  countries['morocco'] = { top : 1400, left : 1710, us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'westafricanstates','algeria','spain' ], region : "africa" , name : "Morocco"***REMOVED***;
  countries['algeria'] = { top : 1330, left : 1935, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'tunisia','morocco','france','saharanstates' ], region : "africa" , name : "Algeria"***REMOVED***;
  countries['tunisia'] = { top : 1310, left : 2160, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'libya','algeria' ], region : "africa" , name : "Tunisia"***REMOVED***;
  countries['westafricanstates'] = { top : 1595, left : 1690, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'ivorycoast','morocco' ], region : "africa" , name : "West African States"***REMOVED***;
  countries['saharanstates'] = { top : 1650, left : 2025, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'algeria','nigeria' ], region : "africa" , name : "Saharan States"***REMOVED***;
  countries['sudan'] = { top : 1690, left : 2550, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'egypt','ethiopia' ], region : "africa" , name : "Sudan"***REMOVED***;
  countries['ivorycoast'] = { top : 1885, left : 1835, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'nigeria','westafricanstates' ], region : "africa" , name : "Ivory Coast"***REMOVED***;
  countries['nigeria'] = { top : 1859, left : 2110, us : 0 , ussr : 0 , control : 1 , bg : 1 , neighbours : [ 'ivorycoast','cameroon','saharanstates' ], region : "africa" , name : "Nigeria"***REMOVED***;
  countries['ethiopia'] = { top : 1845, left : 2710, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'sudan','somalia' ], region : "africa" , name : "Ethiopia"***REMOVED***;
  countries['somalia'] = { top : 1910, left : 2955, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'ethiopia','kenya' ], region : "africa" , name : "Somalia"***REMOVED***;
  countries['cameroon'] = { top : 2035, left : 2210, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'zaire','nigeria' ], region : "africa" , name : "Cameroon"***REMOVED***;
  countries['zaire'] = { top : 2110, left : 2470, us : 0 , ussr : 0 , control : 1 , bg : 1 , neighbours : [ 'angola','zimbabwe','cameroon' ], region : "africa" , name : "Zaire"***REMOVED***;
  countries['kenya'] = { top : 2045, left : 2735, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'seafricanstates','somalia' ], region : "africa" , name : "Kenya"***REMOVED***;
  countries['angola'] = { top : 2290, left : 2280, us : 0 , ussr : 0 , control : 1 , bg : 1 , neighbours : [ 'southafrica','botswana','zaire' ], region : "africa" , name : "Angola"***REMOVED***;
  countries['seafricanstates'] = { top : 2250, left : 2760, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'zimbabwe','kenya' ], region : "africa" , name : "Southeast African States"***REMOVED***;
  countries['zimbabwe'] = { top : 2365, left : 2545, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'seafricanstates','botswana','zaire' ], region : "africa" , name : "Zimbabwe"***REMOVED***;
  countries['botswana'] = { top : 2520, left : 2475, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'southafrica','angola','zimbabwe' ], region : "africa" , name : "Botswana"***REMOVED***;
  countries['southafrica'] = { top : 2690, left : 2370, us : 1 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'angola','botswana' ], region : "africa" , name : "South Africa"***REMOVED***;

  for (var i in countries) { countries[i].place = 0; ***REMOVED***

  return countries;

***REMOVED***



returnChinaCard() {
  return { img : "TNRnTS-06" , name : "China" , scoring : 0 , bg : 0 , player : "both" , recurring : 1 , ops : 4 ***REMOVED***;
***REMOVED***



returnEarlyWarCards() {

  var deck = {***REMOVED***;

  // EARLY WAR
  deck['asia']            = { img : "TNRnTS-01" , name : "Asia Scoring", scoring : 1 , player : "both" , recurring : 1 , ops : 0 ***REMOVED***;
  deck['europe']          = { img : "TNRnTS-02" , name : "Europe Scoring", scoring : 1 , player : "both" , recurring : 1 , ops : 0 ***REMOVED***;
  deck['mideast']         = { img : "TNRnTS-03" , name : "Middle-East Scoring", scoring : 1 , player : "both" , recurring : 1 , ops : 0 ***REMOVED***;
  deck['duckandcover']    = { img : "TNRnTS-04" , name : "Duck and Cover", scoring : 0 , player : "us"   , recurring : 1 , ops : 3 ***REMOVED***;
  deck['fiveyearplan']    = { img : "TNRnTS-05" , name : "Five Year Plan", scoring : 0 , player : "us"   , recurring : 1 , ops : 3 ***REMOVED***;
  deck['socgov']          = { img : "TNRnTS-07" , name : "Socialist Governments", scoring : 0 , player : "ussr" , recurring : 1 , ops : 3 ***REMOVED***;
  deck['fidel']           = { img : "TNRnTS-08" , name : "Fidel", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 ***REMOVED***;
  deck['vietnamrevolts']  = { img : "TNRnTS-09" , name : "Vietnam Revolts", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 ***REMOVED***;
  deck['blockade']        = { img : "TNRnTS-10" , name : "Blockade", scoring : 0 , player : "ussr" , recurring : 0 , ops : 1 ***REMOVED***;
  deck['koreanwar']       = { img : "TNRnTS-11" , name : "Korean War", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 ***REMOVED***;
  deck['romanianab']      = { img : "TNRnTS-12" , name : "Romanian Abdication", scoring : 0 , player : "ussr" , recurring : 0 , ops : 1 ***REMOVED***;
  deck['arabisraeli']     = { img : "TNRnTS-13" , name : "Arab-Israeli War", scoring : 0 , player : "ussr" , recurring : 1 , ops : 2 ***REMOVED***;
  deck['comecon']         = { img : "TNRnTS-14" , name : "Comecon", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['nasser']          = { img : "TNRnTS-15" , name : "Nasser", scoring : 0 , player : "ussr" , recurring : 0 , ops : 1 ***REMOVED***;
  deck['warsawpact']      = { img : "TNRnTS-16" , name : "Warsaw Pact", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['degaulle']        = { img : "TNRnTS-17" , name : "De Gaulle Leads France", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['naziscientist']   = { img : "TNRnTS-18" , name : "Nazi Scientist", scoring : 0 , player : "both" , recurring : 0 , ops : 1 ***REMOVED***;
  deck['truman']          = { img : "TNRnTS-19" , name : "Truman", scoring : 0 , player : "us"   , recurring : 0 , ops : 1 ***REMOVED***;
  deck['olympic']         = { img : "TNRnTS-20" , name : "Olympic Games", scoring : 0 , player : "both" , recurring : 1 , ops : 2 ***REMOVED***;
  deck['nato']            = { img : "TNRnTS-21" , name : "NATO", scoring : 0 , player : "us"   , recurring : 0 , ops : 4 ***REMOVED***;
  deck['indreds']         = { img : "TNRnTS-22" , name : "Independent Reds", scoring : 0 , player : "us"   , recurring : 0 , ops : 2 ***REMOVED***;
  deck['marshall']        = { img : "TNRnTS-23" , name : "Marshall Plan", scoring : 0 , player : "us"   , recurring : 0 , ops : 4 ***REMOVED***;
  deck['indopaki']        = { img : "TNRnTS-24" , name : "Indo-Pakistani War", scoring : 0 , player : "both" , recurring : 1 , ops : 2 ***REMOVED***;
  deck['containment']     = { img : "TNRnTS-25" , name : "Containment", scoring : 0 , player : "us"   , recurring : 0 , ops : 3 ***REMOVED***;
  deck['cia']             = { img : "TNRnTS-26" , name : "CIA Created", scoring : 0 , player : "us"   , recurring : 0 , ops : 1 ***REMOVED***;
  deck['usjapan']         = { img : "TNRnTS-27" , name : "US/Japan Defense Pact", scoring : 0 , player : "us"   , recurring : 0 , ops : 4 ***REMOVED***;
  deck['suezcrisis']      = { img : "TNRnTS-28" , name : "Suez Crisis", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['easteuropean']    = { img : "TNRnTS-29" , name : "East European Unrest", scoring : 0 , player : "us"   , recurring : 1 , ops : 3 ***REMOVED***;
  deck['decolonization']  = { img : "TNRnTS-30" , name : "Decolonization", scoring : 0 , player : "ussr" , recurring : 1 , ops : 2 ***REMOVED***;
  deck['redscare']        = { img : "TNRnTS-31" , name : "Red Scare", scoring : 0 , player : "both" , recurring : 1 , ops : 4 ***REMOVED***;
  deck['unintervention']  = { img : "TNRnTS-32" , name : "UN Intervention", scoring : 0 , player : "both" , recurring : 1 , ops : 1 ***REMOVED***;
  deck['destalinization'] = { img : "TNRnTS-33" , name : "Destalinization", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['nucleartestban']  = { img : "TNRnTS-34" , name : "Nuclear Test Ban Treaty", scoring : 0 , player : "both" , recurring : 1 , ops : 4 ***REMOVED***;
  deck['formosan']        = { img : "TNRnTS-35" , name : "Formosan Resolution", scoring : 0 , player : "us"   , recurring : 0 , ops : 2 ***REMOVED***;

  //
  // OPTIONS - we default to the expanded deck
  //
  if (this.game.options.deck != "original" ) {
    deck['defectors']       = { img : "TNRnTS-103" ,name : "Defectors", scoring : 0 , player : "us"   , recurring : 1 , ops : 2 ***REMOVED***;
    deck['cambridge']       = { img : "TNRnTS-104" ,name : "The Cambridge Five", scoring : 0 , player : "ussr"   , recurring : 1 , ops : 2 ***REMOVED***;
    deck['specialrelation'] = { img : "TNRnTS-105" ,name : "Special Relationship", scoring : 0 , player : "us"   , recurring : 1 , ops : 2 ***REMOVED***;
    deck['norad']           = { img : "TNRnTS-106" ,name : "NORAD", scoring : 0 , player : "us"   , recurring : 0 , ops : 3 ***REMOVED***;
  ***REMOVED***


  //
  // remove any cards specified
  //
  if (this.game.options != undefined) {
    for (var key in this.game.options) {

      if (deck[key] != undefined) { delete deck[key]; ***REMOVED***

      //
      // optional midwar cards
      //
      if (key === "culturaldiplomacy") { deck['culturaldiplomacy'] = { img : "TNRnTS-202png" , name : "Cultural Diplomacy", scoring : 0 , player : "both" , recurring : 1 , ops : 2 ***REMOVED***; ***REMOVED***
      if (key === "gouzenkoaffair") { deck['gouzenkoaffair'] = { img : "TNRnTS-204png" , name : "Gouzenko Affair", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 ***REMOVED***; ***REMOVED***
***REMOVED***
  ***REMOVED***


  //
  // specify early-war period
  //
  for (var key in deck) { deck[key].p = 0; ***REMOVED***

  return deck;

***REMOVED***



returnMidWarCards() {

  var deck = {***REMOVED***;

  deck['brushwar']          = { img : "TNRnTS-36" , name : "Brush War", scoring : 0 , player : "both" , recurring : 1 , ops : 3 ***REMOVED***;
  deck['centralamerica']    = { img : "TNRnTS-37" , name : "Central America Scoring", scoring : 1 , player : "both" , recurring : 1 , ops : 0 ***REMOVED***;
  deck['seasia']            = { img : "TNRnTS-38" , name : "Southeast Asia Scoring", scoring : 1 , player : "both" , recurring : 0 , ops : 0 ***REMOVED***;
  deck['armsrace']          = { img : "TNRnTS-39" , name : "Arms Race", scoring : 0 , player : "both" , recurring : 1 , ops : 3 ***REMOVED***;
  deck['cubanmissile']      = { img : "TNRnTS-40" , name : "Cuban Missile Crisis", scoring : 0 , player : "both" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['nuclearsubs']       = { img : "TNRnTS-41" , name : "Nuclear Subs", scoring : 0 , player : "us" , recurring : 0 , ops : 2 ***REMOVED***;
  deck['quagmire']          = { img : "TNRnTS-42" , name : "Quagmire", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['saltnegotiations']  = { img : "TNRnTS-43" , name : "Salt Negotiations", scoring : 0 , player : "both" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['beartrap']          = { img : "TNRnTS-44" , name : "Bear Trap", scoring : 0 , player : "us" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['summit']            = { img : "TNRnTS-45" , name : "Summit", scoring : 0 , player : "both" , recurring : 1 , ops : 1 ***REMOVED***;
  deck['howilearned']       = { img : "TNRnTS-46" , name : "How I Learned to Stop Worrying", scoring : 0 , player : "both" , recurring : 0 , ops : 2 ***REMOVED***;
  deck['junta']             = { img : "TNRnTS-47" , name : "Junta", scoring : 0 , player : "both" , recurring : 1 , ops : 2 ***REMOVED***;
  deck['kitchendebates']    = { img : "TNRnTS-48" , name : "Kitchen Debates", scoring : 0 , player : "us" , recurring : 0 , ops : 1 ***REMOVED***;
  deck['missileenvy']       = { img : "TNRnTS-49" , name : "Missile Envy", scoring : 0 , player : "both" , recurring : 1 , ops : 2 ***REMOVED***;
  deck['wwby']              = { img : "TNRnTS-50" , name : "We Will Bury You", scoring : 0 , player : "ussr" , recurring : 0 , ops : 4 ***REMOVED***;
  deck['brezhnev']          = { img : "TNRnTS-51" , name : "Brezhnev Doctrine", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['portuguese']        = { img : "TNRnTS-52" , name : "Portuguese Empire Crumbles", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 ***REMOVED***;
  deck['southafrican']      = { img : "TNRnTS-53" , name : "South African Unrest", scoring : 0 , player : "ussr" , recurring : 1 , ops : 2 ***REMOVED***;
  deck['allende']           = { img : "TNRnTS-54" , name : "Allende", scoring : 0 , player : "ussr" , recurring : 0 , ops : 1 ***REMOVED***;
  deck['willybrandt']       = { img : "TNRnTS-55" , name : "Willy Brandt", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 ***REMOVED***;
  deck['muslimrevolution']  = { img : "TNRnTS-56" , name : "Muslim Revolution", scoring : 0 , player : "ussr" , recurring : 1 , ops : 4 ***REMOVED***;
  deck['abmtreaty']         = { img : "TNRnTS-57" , name : "ABM Treaty", scoring : 0 , player : "both" , recurring : 1 , ops : 4 ***REMOVED***;
  deck['culturalrev']       = { img : "TNRnTS-58" , name : "Cultural Revolution", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['flowerpower']       = { img : "TNRnTS-59" , name : "Flower Power", scoring : 0 , player : "ussr" , recurring : 0 , ops : 4 ***REMOVED***;
  deck['u2']                = { img : "TNRnTS-60" , name : "U2 Incident", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['opec']              = { img : "TNRnTS-61" , name : "OPEC", scoring : 0 , player : "ussr" , recurring : 1 , ops : 3 ***REMOVED***;
  deck['lonegunman']        = { img : "TNRnTS-62" , name : "Lone Gunman", scoring : 0 , player : "ussr" , recurring : 0 , ops : 1 ***REMOVED***;
  deck['colonial']          = { img : "TNRnTS-63" , name : "Colonial Rear Guards", scoring : 0 , player : "us" , recurring : 1 , ops : 2 ***REMOVED***;
  deck['panamacanal']       = { img : "TNRnTS-64" , name : "Panama Canal Returned", scoring : 0 , player : "us" , recurring : 0 , ops : 1 ***REMOVED***;
  deck['campdavid']         = { img : "TNRnTS-65" , name : "Camp David Accords", scoring : 0 , player : "us" , recurring : 0 , ops : 2 ***REMOVED***;
  deck['puppet']            = { img : "TNRnTS-66" , name : "Puppet Governments", scoring : 0 , player : "us" , recurring : 0 , ops : 2 ***REMOVED***;
  deck['grainsales']        = { img : "TNRnTS-67" , name : "Grain Sales to Soviets", scoring : 0 , player : "us" , recurring : 1 , ops : 2 ***REMOVED***;
  deck['johnpaul']          = { img : "TNRnTS-68" , name : "John Paul II Elected Pope", scoring : 0 , player : "us" , recurring : 0 , ops : 2 ***REMOVED***;
  deck['deathsquads']       = { img : "TNRnTS-69" , name : "Latin American Death Squads", scoring : 0 , player : "both" , recurring : 1 , ops : 2 ***REMOVED***;
  deck['oas']               = { img : "TNRnTS-70" , name : "OAS Founded", scoring : 0 , player : "us" , recurring : 0 , ops : 1 ***REMOVED***;
  deck['nixon']             = { img : "TNRnTS-71" , name : "Nixon Plays the China Card", scoring : 0 , player : "us" , recurring : 0 , ops : 2 ***REMOVED***;
  deck['sadat']             = { img : "TNRnTS-72" , name : "Sadat Expels Soviets", scoring : 0 , player : "us" , recurring : 0 , ops : 1 ***REMOVED***;
  deck['shuttle']           = { img : "TNRnTS-73" , name : "Shuttle Diplomacy", scoring : 0 , player : "us" , recurring : 1 , ops : 3 ***REMOVED***;
  deck['voiceofamerica']    = { img : "TNRnTS-74" , name : "Voice of America", scoring : 0 , player : "us" , recurring : 1 , ops : 2 ***REMOVED***;
  deck['liberation']        = { img : "TNRnTS-75" , name : "Liberation Theology", scoring : 0 , player : "ussr" , recurring : 1 , ops : 2 ***REMOVED***;
  deck['ussuri']            = { img : "TNRnTS-76" , name : "Ussuri River Skirmish", scoring : 0 , player : "us" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['asknot']            = { img : "TNRnTS-77" , name : "Ask Not What Your Country...", scoring : 0 , player : "us" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['alliance']          = { img : "TNRnTS-78" , name : "Alliance for Progress", scoring : 0 , player : "us" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['africa']            = { img : "TNRnTS-79" , name : "Africa Scoring", scoring : 1 , player : "both" , recurring : 1 , ops : 0 ***REMOVED***;
  deck['onesmallstep']      = { img : "TNRnTS-80" , name : "One Small Step", scoring : 0 , player : "both" , recurring : 1 , ops : 2 ***REMOVED***;
  deck['southamerica']      = { img : "TNRnTS-81" , name : "South America Scoring", scoring : 1 , player : "both" , recurring : 1 , ops : 0 ***REMOVED***;

  //
  // OPTIONS - we default to the expanded deck
  //
  if (this.game.options.deck != "original" ) {
    deck['che']               = { img : "TNRnTS-107" , name : "Che", scoring : 0 , player : "ussr" , recurring : 1 , ops : 3 ***REMOVED***;
    deck['tehran']            = { img : "TNRnTS-108" , name : "Our Man in Tehran", scoring : 0 , player : "us" , recurring : 0 , ops : 2 ***REMOVED***;
  ***REMOVED***

  //
  // remove any cards specified
  //
  if (this.game.options != undefined) {
    for (var key in this.game.options) {

      if (deck[key] != undefined) { delete deck[key]; ***REMOVED***

      //
      // optional midwar cards
      //
      if (key === "handshake") { deck['handshake'] = { img : "TNRnTS-201png" , name : "Handshake in Space", scoring : 0 , player : "both" , recurring : 1 , ops : 1 ***REMOVED***; ***REMOVED***
      if (key === "berlinagreement") { deck['berlinagreement'] = { img : "TNRnTS-205png" , name : "Berlin Agreement", scoring : 0 , player : "both" , recurring : 0 , ops : 2 ***REMOVED***; ***REMOVED***

***REMOVED***
  ***REMOVED***

  //
  // specify early-war period
  //
  for (var key in deck) { deck[key].p = 1; ***REMOVED***


  return deck;

***REMOVED***


returnLateWarCards() {

  var deck = {***REMOVED***;

  deck['iranianhostage']    = { img : "TNRnTS-82" , name : "Iranian Hostage Crisis", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['ironlady']          = { img : "TNRnTS-83" , name : "The Iron Lady", scoring : 0 , player : "us" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['reagan']            = { img : "TNRnTS-84" , name : "Reagan Bombs Libya", scoring : 0 , player : "us" , recurring : 0 , ops : 2 ***REMOVED***;
  deck['starwars']          = { img : "TNRnTS-85" , name : "Star Wars", scoring : 0 , player : "us" , recurring : 0 , ops : 2 ***REMOVED***;
  deck['northseaoil']       = { img : "TNRnTS-86" , name : "North Sea Oil", scoring : 0 , player : "us" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['reformer']          = { img : "TNRnTS-87" , name : "The Reformer", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['marine']            = { img : "TNRnTS-88" , name : "Marine Barracks Bombing", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 ***REMOVED***;
  deck['KAL007']            = { img : "TNRnTS-89" , name : "Soviets Shoot Down KAL-007", scoring : 0 , player : "us" , recurring : 0 , ops : 4 ***REMOVED***;
  deck['glasnost']          = { img : "TNRnTS-90" , name : "Glasnost", scoring : 0 , player : "ussr" , recurring : 0 , ops : 4 ***REMOVED***;
  deck['ortega']            = { img : "TNRnTS-91" , name : "Ortega Elected in Nicaragua", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 ***REMOVED***;
  deck['terrorism']         = { img : "TNRnTS-92" , name : "Terrorism", scoring : 0 , player : "both" , recurring : 1 , ops : 2 ***REMOVED***;
  deck['irancontra']        = { img : "TNRnTS-93" , name : "Iran Contra Scandal", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 ***REMOVED***;
  deck['chernobyl']         = { img : "TNRnTS-94" , name : "Chernobyl", scoring : 0 , player : "us" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['debtcrisis']        = { img : "TNRnTS-95" , name : "Latin American Debt Crisis", scoring : 0 , player : "ussr" , recurring : 1 , ops : 2 ***REMOVED***;
  deck['teardown']          = { img : "TNRnTS-96" , name : "Tear Down this Wall", scoring : 0 , player : "us" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['evilempire']        = { img : "TNRnTS-97" , name : "An Evil Empire", scoring : 0 , player : "us" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['aldrichames']       = { img : "TNRnTS-98" , name : "Aldrich Ames Remix", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['pershing']          = { img : "TNRnTS-99" , name : "Pershing II Deployed", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 ***REMOVED***;
  deck['wargames']          = { img : "TNRnTS-100" , name : "Wargames", scoring : 0 , player : "both" , recurring : 0 , ops : 4 ***REMOVED***;
  deck['solidarity']        = { img : "TNRnTS-101" , name : "Solidarity", scoring : 0 , player : "us" , recurring : 0 , ops : 2 ***REMOVED***;

  //
  // OPTIONS - we default to the expanded deck
  //
  if (this.game.options.deck != "original" ) {
    deck['iraniraq']          = { img : "TNRnTS-102" , name : "Iran-Iraq War", scoring : 0 , player : "both" , recurring : 1 , ops : 2 ***REMOVED***;
    deck['yuri']              = { img : "TNRnTS-109" , name : "Yuri and Samantha", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 ***REMOVED***;
    deck['awacs']             = { img : "TNRnTS-110" , name : "AWACS Sale to Saudis", scoring : 0 , player : "us" , recurring : 0 , ops : 3 ***REMOVED***;
  ***REMOVED***

  //
  // remove any cards specified
  //
  if (this.game.options != undefined) {
    for (var key in this.game.options) {

      if (deck[key] != undefined) { delete deck[key]; ***REMOVED***

      //
      // optional latewar cards
      //
      if (key === "rustinredsquare") { deck['rustinredsquare'] = { img : "TNRnTS-203png" , name : "Rust Lands in Red Square", scoring : 0 , player : "us" , recurring : 0 , ops : 1 ***REMOVED***; ***REMOVED***


***REMOVED***
  ***REMOVED***


  //
  // specify early-war period
  //
  for (var key in deck) { deck[key].p = 2; ***REMOVED***

  return deck;

***REMOVED***


returnDiscardedCards() {

  var discarded = {***REMOVED***;

  for (var i in this.game.deck[0].discards) {
    discarded[i] = this.game.deck[0].cards[i];
    delete this.game.deck[0].cards[i];
  ***REMOVED***

  this.game.deck[0].discards = {***REMOVED***;

  return discarded;

***REMOVED***

/////////////////
// Play Events //
/////////////////
//
// the point of this function is either to execute events directly
// or permit the relevant player to translate them into actions
// that can be directly executed by UPDATE BOARD.
//
// this function returns 1 if we can continue, or 0 if we cannot
// in the handleGame loop managing the events / turns that are
// queued up to go.
//
playEvent(player, card) {

  if (this.game.deck[0].cards[card] != undefined) {
    this.updateStatus("<span>Playing event:</span> <span>" + this.game.deck[0].cards[card].name + "</span>");
  ***REMOVED*** else {
    //
    // event already run - sync loading error
    //
    console.log("sync loading error -- playEvent");
    return 1;
  ***REMOVED***


  ///////////////
  // EARLY WAR //
  ///////////////
  //
  // scoring
  //
  if (card == "asia") {
    this.scoreRegion("asia");
    return 1;
  ***REMOVED***
  if (card == "europe") {
    this.scoreRegion("europe");
    return 1;
  ***REMOVED***
  if (card == "mideast") {
    this.scoreRegion("mideast");
    return 1;
  ***REMOVED***


  //
  // Defectors
  //
  if (card == "defectors") {

    if (this.game.state.headline == 0) {
      if (this.game.state.turn == 0) {
        this.game.state.vp += 1;
        this.updateLog("US gains 1 VP from Defectors");
        this.updateDefcon();
  ***REMOVED***
      return 1;
***REMOVED***

    //
    // Defectors can be PULLED in the headline phase by 5 Year Plan or Grain Sales, in which 
    // case it can only cancel the USSR headline if the USSR headline has not already gone.
    // what an insanely great but complicated game dynamic at play here....
    //
    if (this.game.state.headline == 1) {
      this.game.state.defectors_pulled_in_headline = 1;
***REMOVED***

    return 1;
  ***REMOVED***

  //
  // Special Relationship
  //
  if (card == "specialrelation") {

    if (this.isControlled("us", "uk") == 1) {

      if (this.game.player == 1) {
        this.updateStatus("US is playing Special Relationship");
        return 0;
  ***REMOVED***

      this.updateStatus("US is playing Special Relationship");

      let twilight_self = this;
      let ops_to_place = 1;
      let placeable = [];

      if (this.game.state.events.nato == 1) {
        ops_to_place = 2;
        placeable.push("canada");
        placeable.push("uk");
        placeable.push("italy");
        placeable.push("france");
        placeable.push("spain");
        placeable.push("greece");
        placeable.push("turkey");
        placeable.push("austria");
        placeable.push("benelux");
        placeable.push("westgermany");
        placeable.push("denmark");
        placeable.push("norway");
        placeable.push("sweden");
        placeable.push("finland");

        this.updateStatus("US is playing Special Relationship. Place 2 OPS anywhere in Western Europe.");

  ***REMOVED*** else {

        this.updateStatus("US is playing Special Relationship. Place 1 OP adjacent to the UK.");

        placeable.push("canada");
        placeable.push("france");
        placeable.push("norway");
        placeable.push("benelux");
  ***REMOVED***

      for (let i = 0; i < placeable.length; i++) {

        this.game.countries[placeable[i]].place = 1;

        let divname = "#"+placeable[i];


        $(divname).off();
        $(divname).on('click', function() {

          twilight_self.addMove("resolve\tspecialrelation");
          if (twilight_self.game.state.events.nato == 1) {
              twilight_self.addMove("vp\tus\t2");
      ***REMOVED***

          let c = $(this).attr('id');

          if (twilight_self.countries[c].place != 1) {
            twilight_self.displayModal("Invalid Placement");
      ***REMOVED*** else {
            twilight_self.placeInfluence(c, ops_to_place, "us", function() {
              twilight_self.addMove("place\tus\tus\t"+c+"\t"+ops_to_place);
              twilight_self.playerFinishedPlacingInfluence();
              twilight_self.endTurn();
        ***REMOVED***);
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***
      return 0;
***REMOVED***
    return 1;
  ***REMOVED***

  //
  // Cambridge Five
  //
  if (card == "cambridge") {

    if (this.game.state.round > 7) {
      this.updateLog("<span>The Cambridge Five cannot be played as an event in Late Wa</span>");
      this.updateStatus("<span>The Cambridge Five cannot be played as an event in Late War</span>");
      return 1;
***REMOVED***

    if (this.game.player == 1) {
      this.updateStatus("<span>USSR is playing The Cambridge Five (fetching scoring cards in US hand)</span>");
      return 0;
***REMOVED***

    if (this.game.player == 2) {

      this.addMove("resolve\tcambridge");
      this.updateStatus("USSR is playing The Cambridge Five");

      let scoring_cards = "";
      let scoring_alert  = "cambridge\t";
      for (let i = 0; i < this.game.deck[0].hand.length; i++) {
        if (this.game.deck[0].cards[this.game.deck[0].hand[i]] != undefined) {
          if (this.game.deck[0].cards[this.game.deck[0].hand[i]].scoring == 1) {
            if (scoring_cards.length > 0) { scoring_cards += ", "; scoring_alert += "\t"; ***REMOVED***
            scoring_cards += '<span>' + this.game.deck[0].hand[i] + '</span>';
            scoring_alert += this.game.deck[0].hand[i];
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***

      if (scoring_cards.length == 0) {

        this.addMove("notify\tUS does not have any scoring cards");
        this.endTurn();

  ***REMOVED*** else {

        this.addMove(scoring_alert);
        this.addMove("notify\tUS has scoring cards for: " + scoring_cards);
        this.endTurn();

  ***REMOVED***
***REMOVED***

    return 0;
  ***REMOVED***



  //
  // Norad
  //
  if (card == "norad") {
    this.game.state.events.norad = 1;
    return 1;
  ***REMOVED***



  //
  // NASSER
  //
  if (card == "nasser") {

    let original_us = parseInt(this.countries["egypt"].us);
    let influence_to_remove = 0;

    while (original_us > 0) { 
      influence_to_remove++;
      original_us -= 2;
***REMOVED***

    this.removeInfluence("egypt", influence_to_remove, "us");
    this.placeInfluence("egypt", 2, "ussr");
    this.updateStatus("Nasser - Soviets add two influence in Egypt. US loses half (rounded-up) of all influence in Egypt.");
    return 1;

  ***REMOVED***



  //
  // Nazi Scientist
  //
  if (card == "naziscientist") {
    this.advanceSpaceRace(player);
    return 1;
  ***REMOVED***



  //
  // INDEPENDENT REDS
  //
  if (card == "indreds") {

    if (this.game.player == 1) {
      this.updateStatus("US is playing Independent Reds");
      return 0;
***REMOVED***

    let yugo_ussr = this.countries['yugoslavia'].ussr;
    let romania_ussr = this.countries['romania'].ussr;
    let bulgaria_ussr = this.countries['bulgaria'].ussr;
    let hungary_ussr = this.countries['hungary'].ussr;
    let czechoslovakia_ussr = this.countries['czechoslovakia'].ussr;

    let yugo_us = this.countries['yugoslavia'].us;
    let romania_us = this.countries['romania'].us;
    let bulgaria_us = this.countries['bulgaria'].us;
    let hungary_us = this.countries['hungary'].us;
    let czechoslovakia_us = this.countries['czechoslovakia'].us;

    let yugo_diff = yugo_ussr - yugo_us;
    let romania_diff = romania_ussr - romania_us;
    let bulgaria_diff = bulgaria_ussr - bulgaria_us;
    let hungary_diff = hungary_ussr - hungary_us;
    let czechoslovakia_diff = czechoslovakia_ussr - czechoslovakia_us;


    this.addMove("resolve\tindreds");
    if (hungary_us >= hungary_ussr && yugo_us >= yugo_ussr && romania_us >= romania_ussr && bulgaria_us >= bulgaria_ussr && czechoslovakia_us >= czechoslovakia_ussr) {
      this.endTurn();
      return 0;
***REMOVED*** else {


      let userhtml = "<span>Match USSR influence in which country?</span><p></p><ul>";

      if (yugo_diff > 0) {
        userhtml += '<li class="card" id="yugoslavia">Yugoslavia</li>';
  ***REMOVED***
      if (romania_diff > 0) {
        userhtml += '<li class="card" id="romania">Romania</li>';
  ***REMOVED***
      if (bulgaria_diff > 0) {
        userhtml += '<li class="card" id="bulgaria">Bulgaria</li>';
  ***REMOVED***
      if (hungary_diff > 0) {
        userhtml += '<li class="card" id="hungary">Hungary</li>';
  ***REMOVED***
      if (czechoslovakia_diff > 0) {
        userhtml += '<li class="card" id="czechoslovakia">Czechoslovakia</li>';
  ***REMOVED***
      userhtml += '</ul>';

      this.updateStatus(userhtml);
      let twilight_self = this;

      $('.card').off();
      $('.card').on('click', function() {

        let myselect = $(this).attr("id");

        if (myselect == "romania") {
          twilight_self.placeInfluence(myselect, romania_diff, "us");
          twilight_self.addMove("place\tus\tus\tromania\t"+romania_diff);
          twilight_self.endTurn();
    ***REMOVED***
        if (myselect == "yugoslavia") {
          twilight_self.placeInfluence(myselect, yugo_diff, "us");
          twilight_self.addMove("place\tus\tus\tyugoslavia\t"+yugo_diff);
          twilight_self.endTurn();
    ***REMOVED***
        if (myselect == "bulgaria") {
          twilight_self.placeInfluence(myselect, bulgaria_diff, "us");
          twilight_self.addMove("place\tus\tus\tbulgaria\t"+bulgaria_diff);
          twilight_self.endTurn();
    ***REMOVED***
        if (myselect == "hungary") {
          twilight_self.placeInfluence(myselect, hungary_diff, "us");
          twilight_self.addMove("place\tus\tus\thungary\t"+hungary_diff);
          twilight_self.endTurn();
    ***REMOVED***
        if (myselect == "czechoslovakia") {
          twilight_self.placeInfluence(myselect, czechoslovakia_diff, "us");
          twilight_self.addMove("place\tus\tus\tczechoslovakia\t"+czechoslovakia_diff);
          twilight_self.endTurn();
    ***REMOVED***
        return 0;

  ***REMOVED***);

      return 0;
***REMOVED***
    return 1;
  ***REMOVED***



  ///////////////////
  // MARSHALL PLAN //
  ///////////////////
  if (card == "marshall") {

    this.game.state.events.marshall = 1;

    if (this.game.player == 1) {
      this.updateStatus("US is playing Marshall Plan");
      return 0;
***REMOVED***
    if (this.game.player == 2) {

      this.updateStatus("Place 1 influence in each of 7 non USSR-controlled countries in Western Europe");

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();

      var ops_to_place = 7;
      twilight_self.addMove("resolve\tmarshall");
      for (var i in this.countries) {

        let countryname  = i;
        let divname      = '#'+i;
        if (i == "canada" || i == "uk" || i == "sweden" || i == "france" || i == "benelux" || i == "westgermany" || i == "spain" ||  i == "italy" || i == "greece" || i == "turkey" || i == "denmark" || i == "norway" || i == "sweden" ||  i == "finland" || i == "austria") {
          if (twilight_self.isControlled("ussr", countryname) != 1) {
            twilight_self.countries[countryname].place = 1;
            $(divname).off();
            $(divname).on('click', function() {
              let countryname = $(this).attr('id');
              if (twilight_self.countries[countryname].place == 1) {
                twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
                twilight_self.placeInfluence(countryname, 1, "us", function() {
                  twilight_self.countries[countryname].place = 0;
                  ops_to_place--;
                  if (ops_to_place == 0) {
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
              ***REMOVED***
            ***REMOVED***);
          ***REMOVED*** else {
                twilight_self.displayModal("you cannot place there...");
          ***REMOVED***
        ***REMOVED***);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
      return 0;
***REMOVED***
  ***REMOVED***


  ////////////////////
  // Decolonization //
  ////////////////////
  if (card == "decolonization") {

    if (this.game.player == 2) {
      this.updateStatus("USSR is playing Decolonization");
      return 0;
***REMOVED***
    if (this.game.player == 1) {

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();

      var ops_to_place = 4;
      twilight_self.addMove("resolve\tdecolonization");

      this.updateStatus("Place four influence in Africa or Southeast Asia (1 per country)");

      for (var i in this.countries) {

        let countryname  = i;
        let divname      = '#'+i;

        if (i == "morocco" || i == "algeria" || i == "tunisia" || i == "westafricanstates" || i == "saharanstates" || i == "sudan" || i == "ivorycoast" || i == "nigeria" || i == "ethiopia" || i == "somalia" || i == "cameroon" || i == "zaire" || i == "kenya" || i == "angola" || i == "seafricanstates" || i == "zimbabwe" || i == "botswana" || i == "southafrica" || i == "philippines" || i == "indonesia" || i == "malaysia" || i == "vietnam" || i == "thailand" || i == "laos" || i == "burma") {
          twilight_self.countries[countryname].place = 1;
          $(divname).off();
          $(divname).on('click', function() {
            let countryname = $(this).attr('id');
            if (twilight_self.countries[countryname].place == 1) {
              twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
              twilight_self.placeInfluence(countryname, 1, "ussr", function() {
                twilight_self.countries[countryname].place = 0;
                ops_to_place--;
                if (ops_to_place <= 0) {
                  twilight_self.playerFinishedPlacingInfluence();
                  twilight_self.endTurn();
            ***REMOVED***
          ***REMOVED***);
        ***REMOVED*** else {
              twilight_self.displayModal("you cannot place there...");
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***
      return 0;
***REMOVED***
  ***REMOVED***



  /////////////
  // Comecon //
  /////////////
  if (card == "comecon") {

    if (this.game.player == 2) { return 0; ***REMOVED***
    if (this.game.player == 1) {

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();
      twilight_self.updateStatus("Place four influence in non-US controlled countries in Eastern Europe (1 per country)");

      var ops_to_place = 4;
      twilight_self.addMove("resolve\tcomecon");
      for (var i in this.countries) {

        let countryname  = i;
        let divname      = '#'+i;

        if (i == "finland" || i == "poland" || i == "eastgermany" || i == "austria" || i == "czechoslovakia" || i == "bulgaria" || i == "hungary" || i == "romania" || i == "yugoslavia") {
          twilight_self.countries[countryname].place = 1;
          $(divname).off();
          $(divname).on('click', function() {
            let countryname = $(this).attr('id');
            if (twilight_self.countries[countryname].place == 1 && twilight_self.isControlled("us", countryname) != 1) {
              twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
              twilight_self.placeInfluence(countryname, 1, "ussr", function() {
                twilight_self.countries[countryname].place = 0;
                ops_to_place--;
                if (ops_to_place == 0) {
                  twilight_self.playerFinishedPlacingInfluence();
                  twilight_self.endTurn();
            ***REMOVED***
          ***REMOVED***);
        ***REMOVED*** else {
              twilight_self.displayModal("you cannot place there...");
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***
      return 0;
***REMOVED***
  ***REMOVED***


  /////////////////////
  // UN Intervention //
  /////////////////////
  if (card == "unintervention") {

    this.game.state.events.unintervention = 1;

    let me = "ussr";
    let opponent = "us";
    if (this.game.player == 2) { opponent = "ussr"; me = "us"; ***REMOVED***

    if (player != me) {
      return 0;
***REMOVED*** else {

      let twilight_self = this;

      //
      // U2
      //
      if (twilight_self.game.state.events.u2 == 1) {
        twilight_self.addMove("notify\tU2 activates and triggers +1 VP for USSR");
        twilight_self.addMove("vp\tussr\t1\t1");
  ***REMOVED***

      //
      // let player pick another turn
      //
      this.addMove("resolve\tunintervention");
      this.addMove("play\t"+this.game.player);
      this.playerTurn();
      return 0;
***REMOVED***

  ***REMOVED***


  ////////////////////////
  // Indo-Pakistani War //
  ////////////////////////
  if (card == "indopaki") {

    let me = "ussr";
    let opponent = "us";
    if (this.game.player == 2) { opponent = "ussr"; me = "us"; ***REMOVED***

    if (me != player) {
      let burned = this.rollDice(6);
      return 0;
***REMOVED***
    if (me == player) {

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();

      twilight_self.addMove("resolve\tindopaki");
      twilight_self.updateStatus('Indo-Pakistani War. Choose Target:<p></p><ul><li class="card" id="invadepakistan">Pakistan</li><li class="card" id="invadeindia">India</li></ul>');

      let target = 4;

      $('.card').off();
      $('.card').on('click', function() {

        let invaded = $(this).attr("id");

        if (invaded == "invadepakistan") {

          if (twilight_self.isControlled(opponent, "india") == 1) { target++; ***REMOVED***
          if (twilight_self.isControlled(opponent, "iran") == 1) { target++; ***REMOVED***
          if (twilight_self.isControlled(opponent, "afghanistan") == 1) { target++; ***REMOVED***

          let die = twilight_self.rollDice(6);
          twilight_self.addMove("notify\t"+player.toUpperCase()+" rolls "+die);

          if (die >= target) {

            if (player == "us") {
              twilight_self.addMove("place\tus\tus\tpakistan\t"+twilight_self.countries['pakistan'].ussr);
              twilight_self.addMove("remove\tus\tussr\tpakistan\t"+twilight_self.countries['pakistan'].ussr);
              twilight_self.addMove("milops\tus\t2");
              twilight_self.addMove("vp\tus\t2");
              twilight_self.placeInfluence("pakistan", twilight_self.countries['pakistan'].ussr, "us");
              twilight_self.removeInfluence("pakistan", twilight_self.countries['pakistan'].ussr, "ussr");
              twilight_self.endTurn();
              twilight_self.showInfluence("pakistan", "ussr");
        ***REMOVED*** else {
              twilight_self.addMove("place\tussr\tussr\tpakistan\t"+twilight_self.countries['pakistan'].us);
              twilight_self.addMove("remove\tussr\tus\tpakistan\t"+twilight_self.countries['pakistan'].us);
              twilight_self.addMove("milops\tussr\t2");
              twilight_self.addMove("vp\tussr\t2");
              twilight_self.placeInfluence("pakistan", twilight_self.countries['pakistan'].us, "ussr");
              twilight_self.removeInfluence("pakistan", twilight_self.countries['pakistan'].us, "us");
              twilight_self.endTurn();
              twilight_self.showInfluence("pakistan", "ussr");
        ***REMOVED***
      ***REMOVED*** else {

            if (player == "us") {
              twilight_self.addMove("milops\tus\t2");
              twilight_self.endTurn();
        ***REMOVED*** else {
              twilight_self.addMove("milops\tussr\t2");
              twilight_self.endTurn();
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
        if (invaded == "invadeindia") {

          if (twilight_self.isControlled(opponent, "pakistan") == 1) { target++; ***REMOVED***
          if (twilight_self.isControlled(opponent, "burma") == 1) { target++; ***REMOVED***

          let die = twilight_self.rollDice(6);
          twilight_self.addMove("notify\t"+player.toUpperCase()+" rolls "+die);

          if (die >= target) {

            if (player == "us") {
              twilight_self.addMove("place\tus\tus\tindia\t"+twilight_self.countries['india'].ussr);
              twilight_self.addMove("remove\tus\tussr\tindia\t"+twilight_self.countries['india'].ussr);
              twilight_self.addMove("milops\tus\t2");
              twilight_self.addMove("vp\tus\t2");
              twilight_self.placeInfluence("india", twilight_self.countries['india'].ussr, "us");
              twilight_self.removeInfluence("india", twilight_self.countries['india'].ussr, "ussr");
              twilight_self.endTurn();
              twilight_self.showInfluence("india", "ussr");
        ***REMOVED*** else {
              twilight_self.addMove("place\tussr\tussr\tindia\t"+twilight_self.countries['india'].us);
              twilight_self.addMove("remove\tussr\tus\tindia\t"+twilight_self.countries['india'].us);
              twilight_self.addMove("milops\tussr\t2");
              twilight_self.addMove("vp\tussr\t2");
              twilight_self.placeInfluence("india", twilight_self.countries['india'].us, "ussr");
              twilight_self.removeInfluence("india", twilight_self.countries['india'].us, "us");
               twilight_self.endTurn();
              twilight_self.showInfluence("india", "ussr");
        ***REMOVED***
      ***REMOVED*** else {

            if (player == "us") {
              twilight_self.addMove("milops\tus\t2");
              twilight_self.endTurn();
        ***REMOVED*** else {
              twilight_self.addMove("milops\tussr\t2");
               twilight_self.endTurn();
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***);
***REMOVED***
    return 0;
  ***REMOVED***




  //////////////////////
  // Arab Israeli War //
  //////////////////////
  if (card == "arabisraeli") {

    if (this.game.state.events.campdavid == 1) {
      this.updateLog("Arab-Israeli conflict cancelled by Camp David Accords");
      return 1;
***REMOVED***

    let target = 4;

    if (this.isControlled("us", "israel") == 1) { target++; ***REMOVED***
    if (this.isControlled("us", "egypt") == 1) { target++; ***REMOVED***
    if (this.isControlled("us", "jordan") == 1) { target++; ***REMOVED***
    if (this.isControlled("us", "lebanon") == 1) { target++; ***REMOVED***
    if (this.isControlled("us", "syria") == 1) { target++; ***REMOVED***

    let roll = this.rollDice(6);
    this.updateLog("<span>" + player.toUpperCase()+"</span> <span>rolls</span> "+roll);

    if (roll >= target) {
      this.updateLog("USSR wins the Arab-Israeli War");
      this.placeInfluence("israel", this.countries['israel'].us, "ussr");
      this.removeInfluence("israel", this.countries['israel'].us, "us");
      this.game.state.vp -= 2;
      this.game.state.milops_ussr += 2;
      this.updateVictoryPoints();
      this.updateMilitaryOperations();
***REMOVED*** else {
      this.updateLog("US wins the Arab-Israeli War");
      this.game.state.milops_ussr += 2;
      this.updateMilitaryOperations();
***REMOVED***

    return 1;
  ***REMOVED***








  ////////////////
  // Korean War //
  ////////////////
  if (card == "koreanwar") {

    let target = 4;

    if (this.isControlled("us", "japan") == 1) { target++; ***REMOVED***
    if (this.isControlled("us", "taiwan") == 1) { target++; ***REMOVED***

    let roll = this.rollDice(6);

    this.updateLog("<span>Korean War happens (roll:</span> " + roll + ")");

    if (roll >= target) {
      this.updateLog("North Korea wins the Korean War");
      this.placeInfluence("southkorea", this.countries['southkorea'].us, "ussr");
      this.removeInfluence("southkorea", this.countries['southkorea'].us, "us");
      this.game.state.vp -= 2;
      this.game.state.milops_ussr += 2;
      this.updateMilitaryOperations();
      this.updateVictoryPoints();
***REMOVED*** else {
      this.updateLog("South Korea wins the Korean War");
      this.game.state.milops_ussr += 2;
      this.updateMilitaryOperations();
***REMOVED***
    return 1;

  ***REMOVED***


  /////////////////////
  // Vietnam Revolts //
  /////////////////////
  if (card == "vietnamrevolts") {
    this.game.state.events.vietnam_revolts = 1;
    this.placeInfluence("vietnam", 2, "ussr");
    return 1;
  ***REMOVED***



  //////////
  // NATO //
  //////////
  if (card == "nato") {
    if (this.game.state.events.marshall == 1 || this.game.state.events.warsawpact == 1) {
      this.game.state.events.nato = 1;
      this.game.state.events.nato_westgermany = 1;
      this.game.state.events.nato_france = 1;
***REMOVED*** else {
      this.updateLog("NATO cannot trigger before Warsaw Pact of Marshall Plan. Moving to discard pile.");
***REMOVED***
    return 1;
  ***REMOVED***



  ////////////////
  // China Card //
  ////////////////
  if (card == "china") {
    this.game.state.events.formosan = 0;
    if (player == "ussr") {
      this.game.state.events.china_card = 2;
***REMOVED*** else {
      this.game.state.events.china_card = 1;
***REMOVED***
    return 1;
  ***REMOVED***



  //////////////
  // Formosan //
  //////////////
  if (card == "formosan") {
    this.game.state.events.formosan = 1;
    $('.formosan_resolution').show();
    return 1;
  ***REMOVED***


  ///////////
  // Fidel //
  ///////////
  if (card == "fidel") {
    let usinf = parseInt(this.countries['cuba'].us);
    let ussrinf = parseInt(this.countries['cuba'].ussr);
    this.removeInfluence("cuba", usinf, "us");
    if (ussrinf < 3) {
      this.placeInfluence("cuba", (3-ussrinf), "ussr");
***REMOVED***
    return 1;
  ***REMOVED***


  /////////////////
  // Containment //
  /////////////////
  if (card == "containment") {
    this.game.state.events.containment = 1;
    return 1;
  ***REMOVED***


  ////////////
  // Truman //
  ////////////
  if (card == "truman") {

    if (this.game.player == 1) {
      this.updateStatus("US is selecting target for Truman");
      return 0;
***REMOVED***
    if (this.game.player == 2) {

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();

      twilight_self.addMove("resolve\ttruman");

      var options_purge = [];

      if (twilight_self.countries['canada'].ussr > 0 && twilight_self.isControlled('ussr', 'canada') != 1 && twilight_self.isControlled('us', 'canada') != 1) { options_purge.push('canada'); ***REMOVED***
      if (twilight_self.countries['uk'].ussr > 0 && twilight_self.isControlled('ussr', 'uk') != 1 && twilight_self.isControlled('us', 'uk') != 1) { options_purge.push('uk'); ***REMOVED***
      if (twilight_self.countries['france'].ussr > 0 && twilight_self.isControlled('ussr', 'france') != 1 && twilight_self.isControlled('us', 'france') != 1) { options_purge.push('france'); ***REMOVED***
      if (twilight_self.countries['spain'].ussr > 0 && twilight_self.isControlled('ussr', 'spain') != 1 && twilight_self.isControlled('us', 'spain') != 1) { options_purge.push('spain'); ***REMOVED***
      if (twilight_self.countries['greece'].ussr > 0 && twilight_self.isControlled('ussr', 'greece') != 1 && twilight_self.isControlled('us', 'greece') != 1) { options_purge.push('greece'); ***REMOVED***
      if (twilight_self.countries['turkey'].ussr > 0 && twilight_self.isControlled('ussr', 'turkey') != 1 && twilight_self.isControlled('us', 'turkey') != 1) { options_purge.push('turkey'); ***REMOVED***
      if (twilight_self.countries['italy'].ussr > 0 && twilight_self.isControlled('ussr', 'italy') != 1 && twilight_self.isControlled('us', 'italy') != 1) { options_purge.push('italy'); ***REMOVED***
      if (twilight_self.countries['westgermany'].ussr > 0 && twilight_self.isControlled('ussr', 'westgermany') != 1 && twilight_self.isControlled('us', 'westgermany') != 1) { options_purge.push('westgermany'); ***REMOVED***
      if (twilight_self.countries['eastgermany'].ussr > 0 && twilight_self.isControlled('ussr', 'eastgermany') != 1 && twilight_self.isControlled('us', 'eastgermany') != 1) { options_purge.push('eastgermany'); ***REMOVED***
      if (twilight_self.countries['poland'].ussr > 0 && twilight_self.isControlled('ussr', 'poland') != 1 && twilight_self.isControlled('us', 'poland') != 1) { options_purge.push('poland'); ***REMOVED***
      if (twilight_self.countries['benelux'].ussr > 0 && twilight_self.isControlled('ussr', 'benelux') != 1 && twilight_self.isControlled('us', 'benelux') != 1) { options_purge.push('benelux'); ***REMOVED***
      if (twilight_self.countries['denmark'].ussr > 0 && twilight_self.isControlled('ussr', 'denmark') != 1 && twilight_self.isControlled('us', 'denmark') != 1) { options_purge.push('denmark'); ***REMOVED***
      if (twilight_self.countries['norway'].ussr > 0 && twilight_self.isControlled('ussr', 'norway') != 1 && twilight_self.isControlled('us', 'norway') != 1) { options_purge.push('norway'); ***REMOVED***
      if (twilight_self.countries['finland'].ussr > 0 && twilight_self.isControlled('ussr', 'finland') != 1 && twilight_self.isControlled('us', 'finland') != 1) { options_purge.push('finland'); ***REMOVED***
      if (twilight_self.countries['sweden'].ussr > 0 && twilight_self.isControlled('ussr', 'sweden') != 1 && twilight_self.isControlled('us', 'sweden') != 1) { options_purge.push('sweden'); ***REMOVED***
      if (twilight_self.countries['yugoslavia'].ussr > 0 && twilight_self.isControlled('ussr', 'yugoslavia') != 1 && twilight_self.isControlled('us', 'yugoslavia') != 1) { options_purge.push('yugoslavia'); ***REMOVED***
      if (twilight_self.countries['czechoslovakia'].ussr > 0 && twilight_self.isControlled('ussr', 'czechoslovakia') != 1 && twilight_self.isControlled('us', 'czechoslovakia') != 1) { options_purge.push('czechoslovakia'); ***REMOVED***
      if (twilight_self.countries['bulgaria'].ussr > 0 && twilight_self.isControlled('ussr', 'bulgaria') != 1 && twilight_self.isControlled('us', 'bulgaria') != 1) { options_purge.push('bulgaria'); ***REMOVED***
      if (twilight_self.countries['hungary'].ussr > 0 && twilight_self.isControlled('ussr', 'hungary') != 1 && twilight_self.isControlled('us', 'hungary') != 1) { options_purge.push('hungary'); ***REMOVED***
      if (twilight_self.countries['romania'].ussr > 0 && twilight_self.isControlled('ussr', 'romania') != 1 && twilight_self.isControlled('us', 'romania') != 1) { options_purge.push('romania'); ***REMOVED***
      if (twilight_self.countries['austria'].ussr > 0 && twilight_self.isControlled('ussr', 'austria') != 1 && twilight_self.isControlled('us', 'austria') != 1) { options_purge.push('austria'); ***REMOVED***

      if (options_purge.length == 0) {
        twilight_self.addMove("notify\tUSSR has no influence that can be removed");
        twilight_self.endTurn();
	return 0;
  ***REMOVED***

      twilight_self.updateStatus("Select a non-controlled country in Europe to remove all USSR influence: ");

      for (let i = 0; i < options_purge.length; i++) {

        let countryname  = options_purge[i];
        let divname      = '#'+countryname;

        twilight_self.countries[countryname].place = 1;

        $(divname).off();
        $(divname).on('click', function() {

          let c = $(this).attr('id');
          let ussrpur = twilight_self.countries[c].ussr;

          twilight_self.removeInfluence(c, ussrpur, "ussr", function() {
            twilight_self.addMove("notify\tUS removes all USSR influence from "+twilight_self.countries[c].name);
            twilight_self.addMove("remove\tus\tussr\t"+c+"\t"+ussrpur);
            twilight_self.playerFinishedPlacingInfluence();
            twilight_self.endTurn();
      ***REMOVED***);
    ***REMOVED***);
  ***REMOVED***
***REMOVED***

    return 0;
  ***REMOVED***



  ///////////////////////////
  // Socialist Governments //
  ///////////////////////////
  if (card == "socgov") {

    if (this.game.state.events.ironlady == 1) {
      this.updateLog("Iron Lady cancels Socialist Governments");
      return 1;
***REMOVED***

    if (this.game.player == 2) {
      this.updateStatus("Socialist Governments: USSR is removing 3 US influence from Western Europe (max 2 per country)");
      return 0;
***REMOVED***
    if (this.game.player == 1) {

      this.updateStatus("Remove 3 US influence from Western Europe (max 2 per country)");

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();

      twilight_self.addMove("resolve\tsocgov");

      var ops_to_purge = 3;
      var ops_purged = {***REMOVED***;
      var available_targets = 0;

      for (var i in this.countries) {
        if (i == "italy" || i == "turkey" || i == "greece" || i == "spain" || i == "france" || i == "westgermany" || i == "uk" ||  i == "canada" || i == "benelux" || i == "finland" || i == "austria" || i == "denmark" || i == "norway" || i == "sweden") {
          if (twilight_self.countries[i].us == 1) { available_targets += 1; ***REMOVED***
          if (twilight_self.countries[i].us > 1) { available_targets += 2; ***REMOVED***
	***REMOVED***
  ***REMOVED***
      if (available_targets < 3) { 
	ops_to_purge = available_targets; 
        this.updateStatus("Remove "+ops_to_purge+" US influence from Western Europe (max 2 per country)");
  ***REMOVED***


      for (var i in this.countries) {

        let countryname  = i;
        ops_purged[countryname] = 0;
        let divname      = '#'+i;

        if (i == "italy" || i == "turkey" || i == "greece" || i == "spain" || i == "france" || i == "westgermany" || i == "uk" ||  i == "canada" || i == "benelux" || i == "finland" || i == "austria" || i == "denmark" || i == "norway" || i == "sweden") {

          twilight_self.countries[countryname].place = 1;
	  
	  if (twilight_self.countries[countryname].us > 0) {

            $(divname).off();
            $(divname).on('click', function() {
              let c = $(this).attr('id');
              if (twilight_self.countries[c].place != 1) {
                twilight_self.displayModal("Invalid Country");
          ***REMOVED*** else {
                ops_purged[c]++;
                if (ops_purged[c] >= 2) {
                  twilight_self.countries[c].place = 0;
            ***REMOVED***
                twilight_self.removeInfluence(c, 1, "us", function() {
                  twilight_self.addMove("remove\tussr\tus\t"+c+"\t1");
                  ops_to_purge--;
                  if (ops_to_purge == 0) {
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
              ***REMOVED***
            ***REMOVED***);
          ***REMOVED***
        ***REMOVED***);
	  ***REMOVED***
    ***REMOVED***
  ***REMOVED***
      return 0;
***REMOVED***
  ***REMOVED***




  /////////////////
  // Suez Crisis //
  /////////////////
  if (card == "suezcrisis") {

    if (this.game.player == 2) {
      this.updateStatus("USSR is playing Suez Crisis");
      return 0;
***REMOVED***
    if (this.game.player == 1) {

      var twilight_self = this;

      twilight_self.addMove("resolve\tsuezcrisis");
      twilight_self.updateStatus("Remove four influence from Israel, UK or France");

      var ops_to_purge = 4;
      var options_purge = [];
      var options_available = 0;
      let options_purged = {***REMOVED***;

      var israel_ops = twilight_self.countries['israel'].us;
      var uk_ops = twilight_self.countries['uk'].us;
      var france_ops = twilight_self.countries['france'].us;

      if (israel_ops > 2) { israel_ops = 2; ***REMOVED***
      if (uk_ops > 2)     { uk_ops = 2; ***REMOVED***
      if (france_ops > 2) { france_ops = 2; ***REMOVED***

      options_available = israel_ops + uk_ops + france_ops;

      if (options_available <= 4) {

        this.updateLog("Suez Crisis auto-removed available influence");

        if (israel_ops >= 2) { israel_ops = 2; ***REMOVED*** else {***REMOVED***
        if (uk_ops >= 2) { uk_ops = 2; ***REMOVED*** else {***REMOVED***
        if (france_ops >= 2) { france_ops = 2; ***REMOVED*** else {***REMOVED***

        if (israel_ops > 0) {
          twilight_self.removeInfluence("israel", israel_ops, "us");
            twilight_self.addMove("remove\tussr\tus\tisrael\t"+israel_ops);
    ***REMOVED***
        if (france_ops > 0) {
          twilight_self.removeInfluence("france", france_ops, "us");
          twilight_self.addMove("remove\tussr\tus\tfrance\t"+france_ops);
    ***REMOVED***
        if (uk_ops > 0) {
          twilight_self.removeInfluence("uk", uk_ops, "us");
          twilight_self.addMove("remove\tussr\tus\tuk\t"+uk_ops);
    ***REMOVED***
        twilight_self.endTurn();

  ***REMOVED*** else {

        if (twilight_self.countries['uk'].us > 0) { options_purge.push('uk'); ***REMOVED***
        if (twilight_self.countries['france'].us > 0) { options_purge.push('france'); ***REMOVED***
        if (twilight_self.countries['israel'].us > 0) { options_purge.push('israel'); ***REMOVED***

        for (let m = 0; m < options_purge.length; m++) {

          let countryname = options_purge[m];
          options_purged[countryname] = 0;
          twilight_self.countries[countryname].place = 1;

          let divname      = '#'+countryname;

          $(divname).off();
          $(divname).on('click', function() {

            let c = $(this).attr('id');

            if (twilight_self.countries[c].place != 1) {
              twilight_self.displayModal("Invalid Option");
        ***REMOVED*** else {
              twilight_self.removeInfluence(c, 1, "us");
              twilight_self.addMove("remove\tussr\tus\t"+c+"\t1");
              options_purged[c]++;
              if (options_purged[c] >= 2) {
                twilight_self.countries[c].place = 0;
          ***REMOVED***
              ops_to_purge--;
              if (ops_to_purge == 0) {
                twilight_self.playerFinishedPlacingInfluence();
                twilight_self.displayModal("All Influence Removed");
                twilight_self.endTurn();
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    return 0;
  ***REMOVED***




  /////////////////
  // CIA Created //
  /////////////////
  if (card == "cia") {

    if (this.game.player == 2) {
      this.updateStatus("USSR is playing CIA Created");
      return 0;
***REMOVED***
    if (this.game.player == 1) {

      this.addMove("resolve\tcia");
      this.updateStatus("US is playing CIA Created");

      if (this.game.deck[0].hand.length < 1) {
        this.addMove("ops\tus\tcia\t1");
        this.addMove("notify\tUSSR has no cards to reveal");
        this.endTurn();
  ***REMOVED*** else {
        let revealed = "";
        for (let i = 0; i < this.game.deck[0].hand.length; i++) {
          if (i > 0) { revealed += ", "; ***REMOVED***
          revealed += this.game.deck[0].cards[this.game.deck[0].hand[i]].name;
    ***REMOVED***
        this.addMove("ops\tus\tcia\t1");
        this.addMove("notify\tUSSR holds: "+revealed);
        this.endTurn();
  ***REMOVED***
***REMOVED***
    return 0;
  ***REMOVED***




  //////////////
  // Blockade //
  //////////////
  if (card == "blockade") {

    if (this.game.state.events.optional.berlinagreement == 1) {
      this.updateLog("Berlin Agreement prevents Blockade.");
      return 1;
***REMOVED***

    if (this.game.player == 1) {
      this.updateStatus("US is responding to Blockade");
      return 0;
***REMOVED***
    if (this.game.player == 2) {

      this.addMove("resolve\tblockade");

      let twilight_self = this;
      let available = 0;

      for (let i = 0; i < this.game.deck[0].hand.length; i++) {
        if (this.game.deck[0].hand[i] != "china") {
          let avops = this.modifyOps(this.game.deck[0].cards[this.game.deck[0].hand[i]].ops, this.game.deck[0].hand[i], this.game.player, 0);
          if (avops >= 3) { available = 1; ***REMOVED***
    ***REMOVED***
  ***REMOVED***

      if (available == 0) {
        this.updateStatus("Blockade played: no cards available to discard.");
        this.addMove("remove\tus\tus\twestgermany\t"+this.countries['westgermany'].us);
        this.addMove("notify\tUS removes all influence from West Germany");
        this.removeInfluence("westgermany", this.countries['westgermany'].us, "us");
        this.endTurn();
        return 0;
  ***REMOVED***

      this.updateStatus('<span>Blockade triggers:</span><p></p><ul><li class="card" id="discard">discard 3 OP card</li><li class="card" id="remove">remove all US influence in W. Germany</li></ul>');

      $('.card').off();
      $('.card').on('click', function() {

        let action = $(this).attr("id");

        if (action == "discard") {
          let choicehtml = "<span>Choose a card to discard:</span><p></p><ul>";
          for (let i = 0; i < twilight_self.game.deck[0].hand.length; i++) {
            if (twilight_self.modifyOps(twilight_self.game.deck[0].cards[twilight_self.game.deck[0].hand[i]].ops, twilight_self.game.deck[0].hand[i], twilight_self.game.player, 0) >= 3 && twilight_self.game.deck[0].hand[i] != "china") {
              choicehtml += '<li class="card showcard" id="'+twilight_self.game.deck[0].hand[i]+'">'+twilight_self.game.deck[0].cards[twilight_self.game.deck[0].hand[i]].name+'</li>';
        ***REMOVED***
      ***REMOVED***
          choicehtml += '</ul>';
          twilight_self.updateStatus(choicehtml);


          $('.card').off();
          $('.card').on('click', function() {

            let card = $(this).attr("id");

            if (twilight_self.app.browser.isMobileBrowser(navigator.userAgent)) {
              twilight_self.mobileCardSelect(card, player, function() {
                twilight_self.removeCardFromHand(card);
                twilight_self.addMove("notify\tus discarded "+card);
                twilight_self.endTurn();
          ***REMOVED***, "discard");
              return 0;
        ***REMOVED***

            twilight_self.removeCardFromHand(card);
              twilight_self.addMove("notify\tus discarded "+card);
            twilight_self.endTurn();
            return 0;

      ***REMOVED***);

    ***REMOVED***
        if (action == "remove") {
          twilight_self.updateStatus("Blockade played: no cards available to discard.");
          twilight_self.addMove("remove\tus\tus\twestgermany\t"+twilight_self.countries['westgermany'].us);
          twilight_self.removeInfluence("westgermany", twilight_self.countries['westgermany'].us, "us");
          twilight_self.endTurn();
          return 0;
    ***REMOVED***

  ***REMOVED***);

      return 0;
***REMOVED***
  ***REMOVED***




  ///////////////////
  // Olympic Games //
  ///////////////////
  if (card == "olympic") {

    let me = "ussr";
    let opponent = "us";
    if (this.game.player == 2) { opponent = "ussr"; me = "us"; ***REMOVED***

    if (player == me) {
      this.updateStatus("Opponent is deciding whether to boycott the Olympics");
      return 0;
***REMOVED*** else {

      let twilight_self = this;

      this.addMove("resolve\tolympic");

      twilight_self.updateStatus('<span>' + opponent.toUpperCase() + ' holds the Olympics:</span><p></p><ul><li class="card" id="boycott">boycott</li><li class="card" id="participate">participate</li></ul>');

      $('.card').off();
      $('.card').on('click', function() {

        let action = $(this).attr("id");

        if (action == "boycott") {
          twilight_self.addMove("ops\t"+opponent+"\tolympic\t4");
          twilight_self.addMove("defcon\tlower");
          twilight_self.addMove("notify\t"+opponent.toUpperCase()+" plays 4 OPS");
          twilight_self.addMove("notify\t"+me.toUpperCase()+" boycotts the Olympics");
          twilight_self.endTurn();
          return;
    ***REMOVED***
        if (action == "participate") {

          let winner = 0;

          while (winner == 0) {

              let usroll   = twilight_self.rollDice(6);
            let ussrroll = twilight_self.rollDice(6);

            twilight_self.addMove("dice\tburn\t"+player);
            twilight_self.addMove("dice\tburn\t"+player);

            if (opponent == "us") {
              usroll += 2;
        ***REMOVED*** else {
              ussrroll += 2;
        ***REMOVED***

            if (ussrroll > usroll) {
              twilight_self.addMove("vp\tussr\t2");
              twilight_self.addMove("notify\tUSSR rolls "+ussrroll+" / US rolls "+usroll);
              twilight_self.addMove("notify\t"+me.toUpperCase()+" participates in the Olympics");
              twilight_self.endTurn();
              winner = 1;
        ***REMOVED***
            if (usroll > ussrroll) {
              twilight_self.addMove("vp\tus\t2");
              twilight_self.addMove("notify\tUSSR rolls "+ussrroll+" / US rolls "+usroll);
              twilight_self.addMove("notify\t"+me.toUpperCase()+" participates in the Olympics");
              twilight_self.endTurn();
              winner = 2;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***);
***REMOVED***

    return 0;
  ***REMOVED***





  //////////////////////////
  // East European Unrest //
  //////////////////////////
  if (card == "easteuropean") {

    if (this.game.player == 1) {
      this.updateStatus("US is playing East European Unrest");
      return 0;
***REMOVED***
    if (this.game.player == 2) {

      var twilight_self = this;

      var ops_to_purge = 1;
      var countries_to_purge = 3;
      var options_purge = [];

      if (this.game.state.round > 7) {
        ops_to_purge = 2;
  ***REMOVED***

      twilight_self.addMove("resolve\teasteuropean");

      if (twilight_self.countries['czechoslovakia'].ussr > 0) { options_purge.push('czechoslovakia'); ***REMOVED***
      if (twilight_self.countries['austria'].ussr > 0) { options_purge.push('austria'); ***REMOVED***
      if (twilight_self.countries['hungary'].ussr > 0) { options_purge.push('hungary'); ***REMOVED***
      if (twilight_self.countries['romania'].ussr > 0) { options_purge.push('romania'); ***REMOVED***
      if (twilight_self.countries['yugoslavia'].ussr > 0) { options_purge.push('yugoslavia'); ***REMOVED***
      if (twilight_self.countries['bulgaria'].ussr > 0) { options_purge.push('bulgaria'); ***REMOVED***
      if (twilight_self.countries['eastgermany'].ussr > 0) { options_purge.push('eastgermany'); ***REMOVED***
      if (twilight_self.countries['poland'].ussr > 0) { options_purge.push('poland'); ***REMOVED***
      if (twilight_self.countries['finland'].ussr > 0) { options_purge.push('finland'); ***REMOVED***

      if (options_purge.length <= countries_to_purge) {
        for (let i = 0; i < options_purge.length; i++) {
          twilight_self.addMove("remove\tus\tussr\t"+options_purge[i]+"\t"+ops_to_purge);
          twilight_self.removeInfluence(options_purge[i], ops_to_purge, "ussr");
    ***REMOVED***
        twilight_self.endTurn();
  ***REMOVED*** else {

        twilight_self.updateStatus("Remove "+ops_to_purge+" from 3 countries in Eastern Europe");

        var countries_purged = 0;

        for (var i in twilight_self.countries) {

          let countryname  = i;
          let divname      = '#'+i;

          if (i == "czechoslovakia" || i == "austria" || i == "hungary" || i == "romania" || i == "yugoslavia" || i == "bulgaria" ||  i == "eastgermany" || i == "poland" || i == "finland") {

            if (twilight_self.countries[countryname].ussr > 0) {
              twilight_self.countries[countryname].place = 1;
        ***REMOVED***

            $(divname).off();
            $(divname).on('click', function() {

              let c = $(this).attr('id');

              if (twilight_self.countries[c].place != 1) {
                twilight_self.displayModal("Invalid Option");
          ***REMOVED*** else {
                twilight_self.countries[c].place = 0;
                twilight_self.removeInfluence(c, ops_to_purge, "ussr", function() {
                  twilight_self.addMove("remove\tus\tussr\t"+c+"\t"+ops_to_purge);
                  countries_to_purge--;

                  if (countries_to_purge == 0) {
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
              ***REMOVED***
            ***REMOVED***);
          ***REMOVED***
        ***REMOVED***);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***

      return 0;
***REMOVED***
  ***REMOVED***




  /////////////////
  // Warsaw Pact //
  /////////////////
  if (card == "warsawpact") {

    this.game.state.events.warsawpact = 1;

    if (this.game.player == 2) {
      this.updateStatus("Waiting for USSR to play Warsaw Pact");
      return 0;
***REMOVED***
    if (this.game.player == 1) {

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();

      let html  = "USSR establishes the Warsaw Pact:<p></p><ul>";
          html += '<li class="card" id="remove">remove all US influence in four countries in Eastern Europe</li>';
          html += '<li class="card" id="add">add five USSR influence in Eastern Europe (max 2 per country)</li>';
          html += '</ul>';
      twilight_self.updateStatus(html);

      $('.card').off();
      $('.card').on('click', function() {

        let action2 = $(this).attr("id");

        if (action2 == "remove") {

          twilight_self.addMove("resolve\twarsawpact");
          twilight_self.updateStatus('Remove all US influence from four countries in Eastern Europe');

          var countries_to_purge = 4;
          var options_purge = [];

          if (twilight_self.countries['czechoslovakia'].us > 0) { options_purge.push('czechoslovakia'); ***REMOVED***
          if (twilight_self.countries['austria'].us > 0) { options_purge.push('austria'); ***REMOVED***
          if (twilight_self.countries['hungary'].us > 0) { options_purge.push('hungary'); ***REMOVED***
          if (twilight_self.countries['romania'].us > 0) { options_purge.push('romania'); ***REMOVED***
          if (twilight_self.countries['yugoslavia'].us > 0) { options_purge.push('yugoslavia'); ***REMOVED***
          if (twilight_self.countries['bulgaria'].us > 0) { options_purge.push('bulgaria'); ***REMOVED***
          if (twilight_self.countries['eastgermany'].us > 0) { options_purge.push('eastgermany'); ***REMOVED***
          if (twilight_self.countries['poland'].us > 0) { options_purge.push('poland'); ***REMOVED***
          if (twilight_self.countries['finland'].us > 0) { options_purge.push('finland'); ***REMOVED***

          if (options_purge.length <= countries_to_purge) {

            for (let i = 0; i < options_purge.length; i++) {
              twilight_self.addMove("remove\tussr\tus\t"+options_purge[i]+"\t"+twilight_self.countries[options_purge[i]].us);
              twilight_self.removeInfluence(options_purge[i], twilight_self.countries[options_purge[i]].us, "us");
        ***REMOVED***

            twilight_self.endTurn();

      ***REMOVED*** else {

            var countries_purged = 0;

            for (var i in twilight_self.countries) {

              let countryname  = i;
              let divname      = '#'+i;

              if (i == "czechoslovakia" || i == "austria" || i == "hungary" || i == "romania" || i == "yugoslavia" || i == "bulgaria" ||  i == "eastgermany" || i == "poland" || i == "finland") {

                if (twilight_self.countries[countryname].us > 0) {
                  twilight_self.countries[countryname].place = 1;
            ***REMOVED***

                $(divname).off();
                $(divname).on('click', function() {

                  let c = $(this).attr('id');

                  if (twilight_self.countries[c].place != 1) {
                    twilight_self.displayModal("Invalid Option");
              ***REMOVED*** else {
                    twilight_self.countries[c].place = 0;
                    let uspur = twilight_self.countries[c].us;
                    twilight_self.removeInfluence(c, uspur, "us", function() {
                      twilight_self.addMove("remove\tussr\tus\t"+c+"\t"+uspur);
                      countries_purged++;
                      if (countries_purged == countries_to_purge) {
                        twilight_self.playerFinishedPlacingInfluence();
                        twilight_self.endTurn();
                  ***REMOVED***
                ***REMOVED***);
              ***REMOVED***
            ***REMOVED***);
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
        if (action2 == "add") {

          twilight_self.addMove("resolve\twarsawpact");
          twilight_self.updateStatus('Add five influence in Eastern Europe (max 2 per country)');

          var ops_to_place = 5;
          var ops_placed = {***REMOVED***;

          for (var i in twilight_self.countries) {

            let countryname  = i;
            ops_placed[countryname] = 0;
            let divname      = '#'+i;

            if (i == "czechoslovakia" || i == "austria" || i == "hungary" || i == "romania" || i == "yugoslavia" || i == "bulgaria" ||  i == "eastgermany" || i == "poland" || i == "finland") {

              twilight_self.countries[countryname].place = 1;

              $(divname).off();
              $(divname).on('click', function() {

                let c = $(this).attr('id');

                if (twilight_self.countries[c].place != 1) {
                  twilight_self.displayModal("Invalid Placement");
            ***REMOVED*** else {
                  ops_placed[c]++;
                  twilight_self.placeInfluence(c, 1, "ussr", function() {
                    twilight_self.addMove("place\tussr\tussr\t"+c+"\t1");
                    if (ops_placed[c] >= 2) { twilight_self.countries[c].place = 0; ***REMOVED***
                    ops_to_place--;
                    if (ops_to_place == 0) {
                      twilight_self.playerFinishedPlacingInfluence();
                      twilight_self.endTurn();
                ***REMOVED***
              ***REMOVED***);
            ***REMOVED***
          ***REMOVED***);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***);
      return 0;
***REMOVED***

    return 1;
  ***REMOVED***




  /////////////////////
  // Destalinization //
  /////////////////////
  if (card == "destalinization") {

    if (this.game.player == 2) {
      this.updateStatus("USSR is playing Destalinization");
      return 0;
***REMOVED***
    if (this.game.player == 1) {

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();

      twilight_self.addMove("resolve\tdestalinization");

      twilight_self.updateStatus('Remove four USSR influence from existing countries:');

      let ops_to_purge = 4;

      for (var i in this.countries) {

        let countryname  = i;
        let divname      = '#'+i;

        $(divname).off();
        $(divname).on('click', function() {

          let c = $(this).attr('id');

          if (twilight_self.countries[c].ussr <= 0) {
            twilight_self.displayModal("Invalid Option");
            return;
      ***REMOVED*** else {
            twilight_self.removeInfluence(c, 1, "ussr");
            twilight_self.addMove("remove\tussr\tussr\t"+c+"\t1");
            ops_to_purge--;
            if (ops_to_purge == 0) {

              twilight_self.updateStatus('Add four USSR influence to any non-US controlled countries');

              twilight_self.playerFinishedPlacingInfluence();

              var ops_to_place = 4;
              var countries_placed = {***REMOVED***;

              for (var i in twilight_self.countries) {

                countries_placed[i] = 0;
                let countryname  = i;
                let divname      = '#'+i;

                $(divname).off();
                $(divname).on('click', function() {

                  let cn = $(this).attr('id');
                  if (twilight_self.isControlled("us", cn) == 1) {
                    twilight_self.displayModal("Cannot re-allocate to US controlled countries");
                    return;
              ***REMOVED*** else {
                    if (countries_placed[cn] == 2) {
                      twilight_self.displayModal("Cannot place more than 2 influence in any one country");
                      return;
                ***REMOVED*** else {
                      twilight_self.placeInfluence(cn, 1, "ussr");
                      twilight_self.addMove("place\tussr\tussr\t"+cn+"\t1");
                      ops_to_place--;
                      countries_placed[cn]++;
                      if (ops_to_place == 0) {
                        twilight_self.playerFinishedPlacingInfluence();
                        twilight_self.endTurn();
                  ***REMOVED***
                ***REMOVED***
              ***REMOVED***
            ***REMOVED***);
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***
***REMOVED***
    return 0;
  ***REMOVED***



  ///////////////
  // Red Scare //
  ///////////////
  if (card == "redscare") {
    if (player == "ussr") { this.game.state.events.redscare_player2 = 1; ***REMOVED***
    if (player == "us") { this.game.state.events.redscare_player1 = 1; ***REMOVED***
    return 1;
  ***REMOVED***


  ///////////
  // Fidel //
  ///////////
  if (card == "fidel") {
    let usinf = parseInt(this.countries['cuba'].us);
    let ussrinf = parseInt(this.countries['cuba'].ussr);
    this.removeInfluence("cuba", usinf, "us");
    if (ussrinf < 3) {
      this.placeInfluence("cuba", (3-ussrinf), "ussr");
***REMOVED***
    return 1;
  ***REMOVED***



  //////////////////////
  // Nuclear Test Ban //
  //////////////////////
  if (card == "nucleartestban") {

    let vpchange = this.game.state.defcon-2;
    if (vpchange < 0) { vpchange = 0; ***REMOVED***
    this.game.state.defcon = this.game.state.defcon+2;
    if (this.game.state.defcon > 5) { this.game.state.defcon = 5; ***REMOVED***

    if (player == "us") {
      this.game.state.vp = this.game.state.vp+vpchange;
***REMOVED*** else {
      this.game.state.vp = this.game.state.vp-vpchange;
***REMOVED***
    this.updateVictoryPoints();
    this.updateDefcon();

    return 1;
  ***REMOVED***


  ////////////////////
  // Duck and Cover //
  ////////////////////
  if (card == "duckandcover") {

    this.lowerDefcon();
    this.updateDefcon();

    let vpchange = 5-this.game.state.defcon;

    if (this.game.state.defcon <= 1 && this.game.over != 1) {
      if (this.game.state.turn == 0) {
        this.endGame("us", "defcon");
  ***REMOVED*** else {
        this.endGame("ussr", "defcon");
  ***REMOVED***

      return;

***REMOVED*** else {

      this.game.state.vp = this.game.state.vp+vpchange;
      this.updateVictoryPoints();

***REMOVED***
    return 1;
  ***REMOVED***



  ////////////////////
  // Five Year Plan //
  ////////////////////
  if (card == "fiveyearplan") {

    let twilight_self = this;

    //
    // US has to wait for Soviets to execute
    // burn 1 roll
    //
    if (this.game.player == 2) {
      let burnrand = this.rollDice();
      return 0;
***REMOVED***

    //
    // Soviets self-report - TODO provide proof
    // of randomness
    //
    if (this.game.player == 1) {

      twilight_self.addMove("resolve\tfiveyearplan");

      let size_of_hand_minus_china_card = this.game.deck[0].hand.length;
      for (let i = 0; i < this.game.deck[0].hand.length; i++) {
        if (this.game.deck[0].hand == "china") { size_of_hand_minus_china_card--; ***REMOVED***
  ***REMOVED***


      if (size_of_hand_minus_china_card < 1) {
***REMOVED*** burn roll anyway as US will burn
        let burnrand = this.rollDice();
        twilight_self.displayModal("No cards left to discard");
          this.addMove("notify\tUSSR has no cards to discard");
        this.endTurn();
        return 0;
  ***REMOVED*** else {

        let twilight_self = this;

        twilight_self.rollDice(twilight_self.game.deck[0].hand.length, function(roll) {
          roll = parseInt(roll)-1;
          let card = twilight_self.game.deck[0].hand[roll];

          if (card == "china") {
            if (roll-1 >= 0) { card = twilight_self.game.deck[0].hand[roll-1]; ***REMOVED*** else {
                card = twilight_self.game.deck[0].hand[roll+1];
        ***REMOVED***
      ***REMOVED***

          twilight_self.removeCardFromHand(card);
          if (twilight_self.game.deck[0].cards[card].player == "us") {
            twilight_self.displayModal("You have rolled: " + card);
            twilight_self.addMove("event\tus\t"+card);
            twilight_self.endTurn();
      ***REMOVED*** else {
            twilight_self.displayModal("You have rolled: " + card);
              twilight_self.addMove("notify\tUSSR discarded "+card);
            twilight_self.endTurn();
      ***REMOVED***
    ***REMOVED***);

        return 0;
  ***REMOVED***
      return 0;
***REMOVED***
  ***REMOVED***



  ///////////////////////////
  // DeGaulle Leads France //
  ///////////////////////////
  if (card == "degaulle") {
    this.game.state.events.degaulle = 1;
    this.removeInfluence("france", 2, "us");
    this.placeInfluence("france", 1, "ussr");
    return 1;
  ***REMOVED***

  /////////////////////////
  // Romanian Abdication //
  /////////////////////////
  if (card == "romanianab") {
    let usinf = parseInt(this.countries['romania'].us);
    let ussrinf = parseInt(this.countries['romania'].ussr);
    this.removeInfluence("romania", usinf, "us");
    if (ussrinf < 3) {
      this.placeInfluence("romania", (3-ussrinf), "ussr");
***REMOVED***
    return 1;
  ***REMOVED***



  /////////////////////////
  // US / Japan Alliance //
  /////////////////////////
  if (card == "usjapan") {
    this.game.state.events.usjapan = 1;
    let usinf = parseInt(this.countries['japan'].us);
    let ussrinf = parseInt(this.countries['japan'].ussr);
    let targetinf = ussrinf + 4;
    this.placeInfluence("japan", (targetinf - usinf), "us");
    return 1;
  ***REMOVED***





















  /////////////
  // MID WAR //
  /////////////
  //
  // scoring
  //
  if (card == "seasia") {
    this.scoreRegion("seasia");
    return 1;
  ***REMOVED***
  if (card == "southamerica") {
    this.scoreRegion("southamerica");
    return 1;
  ***REMOVED***
  if (card == "centralamerica") {
    this.scoreRegion("centralamerica");
    return 1;
  ***REMOVED***
  if (card == "africa") {
    this.scoreRegion("africa");
    return 1;
  ***REMOVED***



  //
  // Willy Brandt
  //
  if (card == "willybrandt") {

    if (this.game.state.events.teardown == 1) {
      this.updateLog("Willy Brandt canceled by Tear Down this Wall");
      return 1;
***REMOVED***

    this.game.state.vp -= 1;
    this.updateVictoryPoints();

    this.countries["westgermany"].ussr += 1;
    this.showInfluence("westgermany", "ussr");

    this.game.state.events.nato_westgermany = 0;
    this.game.state.events.willybrandt = 1;

    return 1;
  ***REMOVED***




  //
  // Muslim Revolution
  //
  if (card == "muslimrevolution") {

    if (this.game.state.events.awacs == 1) { return 1; ***REMOVED***

    var countries_to_purge = 2;
    let countries_with_us_influence = 0;
    if (this.countries["sudan"].us > 0) { countries_with_us_influence++; ***REMOVED***
    if (this.countries["egypt"].us > 0) { countries_with_us_influence++; ***REMOVED***
    if (this.countries["libya"].us > 0) { countries_with_us_influence++; ***REMOVED***
    if (this.countries["syria"].us > 0) { countries_with_us_influence++; ***REMOVED***
    if (this.countries["iran"].us > 0) { countries_with_us_influence++; ***REMOVED***
    if (this.countries["iraq"].us > 0) { countries_with_us_influence++; ***REMOVED***
    if (this.countries["jordan"].us > 0) { countries_with_us_influence++; ***REMOVED***
    if (this.countries["saudiarabia"].us > 0) { countries_with_us_influence++; ***REMOVED***
    if (countries_with_us_influence < countries_to_purge) { countries_to_purge = countries_with_us_influence; ***REMOVED***
    if (countries_with_us_influence == 0) {
      this.updateLog("No countries with US influence to remove");
      return 1;
***REMOVED***

    if (this.game.player == 2) { this.updateStatus("USSR is playing Muslim Revolution"); return 0; ***REMOVED***
    if (this.game.player == 1) {

      this.updateStatus("Remove All US influence from 2 countries among: Sudan, Egypt, Iran, Iraq, Libya, Saudi Arabia, Syria, Joran.");

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();
      twilight_self.addMove("resolve\tmuslimrevolution");

      for (var i in this.countries) {

        let countryname  = i;
        let divname      = '#'+i;

        if (i == "sudan" || i == "egypt" || i == "iran" || i == "iraq" || i == "libya" || i == "saudiarabia" || i == "syria" || i == "jordan") {

          if (this.countries[i].us > 0) { countries_with_us_influence++; ***REMOVED***

          $(divname).off();
          $(divname).on('click', function() {

            let c = $(this).attr('id');

            if (twilight_self.countries[c].us <= 0) {
              twilight_self.displayModal("Invalid Country");
        ***REMOVED*** else {
              let purginf = twilight_self.countries[c].us;
              twilight_self.removeInfluence(c, purginf, "us", function() {
                twilight_self.addMove("remove\tussr\tus\t"+c+"\t"+purginf);
                countries_to_purge--;
                if (countries_to_purge == 0) {
                  twilight_self.playerFinishedPlacingInfluence();
                  twilight_self.endTurn();
            ***REMOVED***
          ***REMOVED***);
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    return 0;
  ***REMOVED***







  //
  // Shuttle Diplomacy
  //
  if (card == "shuttle") {
    this.game.state.events.shuttlediplomacy = 1;
    return 1;
  ***REMOVED***



  //
  // Latin American Death Squads
  //
  if (card == "deathsquads") {
    if (player == "ussr") { this.game.state.events.deathsquads = 1; ***REMOVED***
    if (player == "us") { this.game.state.events.deathsquads = 2; ***REMOVED***
    return 1;
  ***REMOVED***





  //
  // Grain Sales to Soviets
  //
  if (card == "grainsales") {

    //
    // US has to wait for Soviets to execute
    // burn 1 roll
    //
    if (this.game.player == 2) {
      this.updateStatus("Waiting for random card from USSR");
      let burnrand = this.rollDice();
      return 0;
***REMOVED***

    //
    // Soviets self-report - TODO provide proof
    // of randomness
    //
    if (this.game.player == 1) {

      this.updateStatus("Sending random card to USSR");
      this.addMove("resolve\tgrainsales");

      if (this.game.deck[0].hand.length < 1) {
        let burnrand = this.rollDice();
        this.addMove("ops\tus\tgrainsales\t2");
        this.addMove("notify\tUSSR has no cards to discard");
        this.endTurn();
        return 0;
  ***REMOVED*** else {

        let twilight_self = this;

        if (this.game.deck[0].hand.length == 1 && this.game.deck[0].hand[0] == "china") {
          let burnrand = this.rollDice();
          this.addMove("ops\tus\tgrainsales\t2");
          this.addMove("notify\tUSSR has no cards to discard");
          this.endTurn();
          return 0;
    ***REMOVED***

        twilight_self.rollDice(twilight_self.game.deck[0].hand.length, function(roll) {
          roll = parseInt(roll)-1;
          let card = twilight_self.game.deck[0].hand[roll];

          if (card == "china") {
            if (roll > 0) { roll--; ***REMOVED*** else { roll++; ***REMOVED***
            card = twilight_self.game.deck[0].hand[roll];
      ***REMOVED***

          twilight_self.removeCardFromHand(card);
          twilight_self.addMove("grainsales\tussr\t"+card);
          twilight_self.addMove("notify\tUSSR shares "+twilight_self.game.deck[0].cards[card].name);
          twilight_self.endTurn();
    ***REMOVED***);
  ***REMOVED***
***REMOVED***
    return 0;
  ***REMOVED***




  //
  // Missile Envy
  //
  if (card == "missileenvy") {

    let instigator = 1;
    let opponent = "us";
    if (player == "us") { instigator = 2; opponent = "ussr"; ***REMOVED***
    this.game.state.events.missileenvy = 1;

    //
    //
    //
    if (this.game.player == instigator) {
      this.updateStatus("Opponent is returning card for Missile Envy");
      return 0;
***REMOVED***


    //
    // targeted player provided list if multiple options available
    //
    if (this.game.player != instigator) {

      this.addMove("resolve\tmissileenvy");

      let selected_card  = "";
      let selected_ops   = 0;
      let multiple_cards = 0;

      if (this.game.deck[0].hand.length == 0) {
        this.addMove("notify\t"+opponent.toUpperCase()+" hand contains no cards.");
        this.endTurn();
        return 0;
  ***REMOVED***


      for (let i = 0; i < this.game.deck[0].hand.length; i++) {

        if (this.game.deck[0].hand[i] == "china") {
          i++;
          if (this.game.deck[0].hand.length < 2) {
            this.addMove("notify\t"+opponent.toUpperCase()+" hand contains only the China card.");
            this.endTurn();
            return 0;
      ***REMOVED***
    ***REMOVED***

        if (i < this.game.deck[0].hand.length) {

          let card = this.game.deck[0].cards[this.game.deck[0].hand[i]];

          if (card != "china") {
            if (card.ops == selected_ops) {
              multiple_cards++;
        ***REMOVED***
            if (card.ops > selected_ops) {
              selected_ops  = card.ops;
              selected_card = this.game.deck[0].hand[i];
              multiple_cards = 0;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***


      if (multiple_cards == 0) {

***REMOVED***
***REMOVED*** offer highest card
***REMOVED***
        this.addMove("missileenvy\t"+this.game.player+"\t"+selected_card);
        this.endTurn();

  ***REMOVED*** else {

***REMOVED***
***REMOVED*** select highest card
***REMOVED***
        let user_message = "<span>Select card to give opponent:</span><p></p><ul>";
        for (let i = 0; i < this.game.deck[0].hand.length; i++) {
          if (this.game.deck[0].cards[this.game.deck[0].hand[i]].ops == selected_ops && this.game.deck[0].hand[i] != "china") {
            user_message += '<li class="card showcard" id="'+this.game.deck[0].hand[i]+'">'+this.game.deck[0].cards[this.game.deck[0].hand[i]].name+'</li>';
      ***REMOVED***
    ***REMOVED***
        user_message += '</ul>';
        this.updateStatus(user_message);

        let twilight_self = this;

        $('.card').off();
        $('.card').on('click', function() {

          let action2 = $(this).attr("id");

  ***REMOVED***
  ***REMOVED*** offer card
  ***REMOVED***
          twilight_self.addMove("missileenvy\t"+twilight_self.game.player+"\t"+action2);
          twilight_self.endTurn();

    ***REMOVED***);
  ***REMOVED***
***REMOVED***
    return 0;
  ***REMOVED***






  //
  // Che
  //
  if (card == "che") {

    let twilight_self = this;
    let valid_targets = 0;
    let couppower = 3;

    if (player == "us") { couppower = this.modifyOps(3,"che",2); ***REMOVED***
    if (player == "ussr") { couppower = this.modifyOps(3,"che",1); ***REMOVED***

    for (var i in this.countries) {
      let countryname = i;
      if ( twilight_self.countries[countryname].bg == 0 && (twilight_self.countries[countryname].region == "africa" || twilight_self.countries[countryname].region == "camerica" || twilight_self.countries[countryname].region == "samerica") && twilight_self.countries[countryname].us > 0 ) {
        valid_targets++;
  ***REMOVED***
***REMOVED***

    if (valid_targets == 0) {
      this.updateLog("No valid targets for Che");
      return 1;
***REMOVED***

    if (this.game.player == 2) {
      this.updateStatus("Waiting for USSR to play Che");
      return 0;
***REMOVED***
    if (this.game.player == 1) {

      twilight_self.playerFinishedPlacingInfluence();
      let user_message = "Che takes effect. Pick first target for coup:<p></p><ul>";
          user_message += '<li class="card" id="skipche">or skip coup</li>';
          user_message += '</ul>';
      twilight_self.updateStatus(user_message);

      $('.card').off();
      $('.card').on('click', function() {
        let action2 = $(this).attr("id");
        if (action2 == "skipche") {
          twilight_self.updateStatus("Skipping Che coups...");
          twilight_self.addMove("resolve\tche");
          twilight_self.endTurn();
    ***REMOVED***
  ***REMOVED***);

      for (var i in twilight_self.countries) {

        let countryname  = i;
        let divname      = '#'+i;

        if ( twilight_self.countries[countryname].bg == 0 && (twilight_self.countries[countryname].region == "africa" || twilight_self.countries[countryname].region == "camerica" || twilight_self.countries[countryname].region == "samerica") && twilight_self.countries[countryname].us > 0 ) {

          $(divname).off();
          $(divname).on('click', function() {

            let c = $(this).attr('id');

            twilight_self.addMove("resolve\tche");
            twilight_self.addMove("checoup\tussr\t"+c+"\t"+couppower);
            twilight_self.addMove("milops\tussr\t"+couppower);
            twilight_self.endTurn();
      ***REMOVED***);
    ***REMOVED*** else {

          $(divname).off();
          $(divname).on('click', function() {
            twilight_self.displayModal("Invalid Target");
      ***REMOVED***);

    ***REMOVED***
  ***REMOVED***
***REMOVED***
    return 0;
  ***REMOVED***











  //
  // Ask Not What Your Country Can Do For You
  //
  if (card == "asknot") {

    if (this.game.player == 1) {
      this.updateStatus("Waiting for US to play Ask Not What Your Country Can Do For You");
      return 0;
***REMOVED***
    if (this.game.player == 2) {

      var twilight_self = this;
      let cards_discarded = 0;

      let cards_to_discard = 0;
      let user_message = "Select cards to discard:<p></p><ul>";
      for (let i = 0; i < this.game.deck[0].hand.length; i++) {
        if (this.game.deck[0].hand[i] != "china") {
          user_message += '<li class="card showcard" id="'+this.game.deck[0].hand[i]+'">'+this.game.deck[0].cards[this.game.deck[0].hand[i]].name+'</li>';
          cards_to_discard++;
    ***REMOVED***
  ***REMOVED***

      if (cards_to_discard == 0) {
        twilight_self.addMove("notify\tUS has no cards available to discard");
        twilight_self.endTurn();
        return;
  ***REMOVED***

      user_message += '</ul><p></p>When you are done discarding <span class="card dashed" id="finished">click here</span>.';

      twilight_self.updateStatus(user_message);
      twilight_self.addMove("resolve\tasknot");

      $('.card').off();
      twilight_self.addShowCardEvents();
      $('.card').on('click', function() {

        let action2 = $(this).attr("id");

        if (action2 == "finished") {

  ***REMOVED***
  ***REMOVED*** if Aldrich Ames is active, US must reveal cards
  ***REMOVED***
          if (twilight_self.game.state.events.aldrich == 1) {
            twilight_self.addMove("aldrichreveal\tus");
      ***REMOVED***

          twilight_self.addMove("DEAL\t1\t2\t"+cards_discarded);

  ***REMOVED***
  ***REMOVED*** are there enough cards available, if not, reshuffle
  ***REMOVED***
          if (cards_discarded > twilight_self.game.deck[0].crypt.length) {

            let discarded_cards = twilight_self.returnDiscardedCards();
            if (Object.keys(discarded_cards).length > 0) {

      ***REMOVED***
      ***REMOVED*** shuffle in discarded cards
      ***REMOVED***
              twilight_self.addMove("SHUFFLE\t1");
              twilight_self.addMove("DECKRESTORE\t1");
              twilight_self.addMove("DECKENCRYPT\t1\t2");
              twilight_self.addMove("DECKENCRYPT\t1\t1");
              twilight_self.addMove("DECKXOR\t1\t2");
              twilight_self.addMove("DECKXOR\t1\t1");
              twilight_self.addMove("flush\tdiscards"); // opponent should know to flush discards as we have
              twilight_self.addMove("DECK\t1\t"+JSON.stringify(discarded_cards));
              twilight_self.addMove("DECKBACKUP\t1");
              twilight_self.updateLog("cards remaining: " + twilight_self.game.deck[0].crypt.length);
              twilight_self.updateLog("Shuffling discarded cards back into the deck...");

        ***REMOVED***
      ***REMOVED***

          twilight_self.endTurn();

    ***REMOVED*** else {

              if (twilight_self.app.browser.isMobileBrowser(navigator.userAgent)) {
            twilight_self.mobileCardSelect(card, player, function() {
              $(this).hide();
              cards_discarded++;
              twilight_self.removeCardFromHand(action2);
              twilight_self.addMove("discard\tus\t"+action2);
        ***REMOVED***, "discard");
      ***REMOVED*** else {
            $(this).hide();
              cards_discarded++;
            twilight_self.removeCardFromHand(action2);
            twilight_self.addMove("discard\tus\t"+action2);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***);
***REMOVED***

    return 0;
  ***REMOVED***




  //
  // Salt Negotiations
  //
  if (card == "saltnegotiations") {

    // update defcon
    this.game.state.defcon += 2;
    if (this.game.state.defcon > 5) { this.game.state.defcon = 5; ***REMOVED***
    this.updateDefcon();

    // affect coups
    this.game.state.events.saltnegotiations = 1;

    // otherwise sort through discards
    let discardlength = 0;
    for (var i in this.game.deck[0].discards) { discardlength++; ***REMOVED***
    if (discardlength == 0) {
      this.updateLog("No cards in discard pile");
      return 1;
***REMOVED***

    let my_go = 0;

    if (player === "ussr" && this.game.player == 1) { my_go = 1; ***REMOVED***
    if (player === "us" && this.game.player == 2) { my_go = 1; ***REMOVED***

    if (my_go == 0) {
      this.updateStatus("Opponent retrieving card from discard pile");
      console.log("HERE: " + my_go + " --- " + this.game.player + " --- " + player);
      return 0;
***REMOVED***

    // pick discarded card
    var twilight_self = this;

    let user_message = "Pick Card to Reclaim:<p></p><ul>";
    for (var i in this.game.deck[0].discards) {
      if (this.game.deck[0].discards[i].scoring == 0) {
        user_message += '<li class="card showcard" id="'+i+'">'+this.game.deck[0].discards[i].name+'</li>';
  ***REMOVED***
***REMOVED***
    user_message += '<li class="card showcard" id="nocard">do not reclaim card...</li>';
    user_message += "</ul>";
    twilight_self.updateStatus(user_message);

    twilight_self.addMove("resolve\tsaltnegotiations");


    $('.card').off();
    $('.card').on('click', function() {

      let action2 = $(this).attr("id");

      if (twilight_self.app.browser.isMobileBrowser(navigator.userAgent)) {
        twilight_self.mobileCardSelect(card, player, function() {

          if (action2 != "nocard") {
            twilight_self.game.deck[0].hand.push(action2);
            twilight_self.addMove("notify\t"+player+" retrieved "+twilight_self.game.deck[0].cards[action2].name);
      ***REMOVED*** else {
            twilight_self.addMove("notify\t"+player+" does not retrieve card");
      ***REMOVED***
          twilight_self.endTurn();

    ***REMOVED***, "retrieve");
  ***REMOVED*** else {

        if (action2 != "nocard") {
          twilight_self.game.deck[0].hand.push(action2);
          twilight_self.addMove("notify\t"+player+" retrieved "+twilight_self.game.deck[0].cards[action2].name);
    ***REMOVED*** else {
          twilight_self.addMove("notify\t"+player+" does not retrieve card");
    ***REMOVED***
        twilight_self.endTurn();
  ***REMOVED***

***REMOVED***);

    return 0;
  ***REMOVED***




  //
  // Our Man in Tehran
  //
  if (card == "tehran") {

    let usc = 0;

    if (this.isControlled("us", "egypt") == 1) { usc = 1; ***REMOVED***
    if (this.isControlled("us", "libya") == 1) { usc = 1; ***REMOVED***
    if (this.isControlled("us", "israel") == 1) { usc = 1; ***REMOVED***
    if (this.isControlled("us", "lebanon") == 1) { usc = 1; ***REMOVED***
    if (this.isControlled("us", "syria") == 1) { usc = 1; ***REMOVED***
    if (this.isControlled("us", "iraq") == 1) { usc = 1; ***REMOVED***
    if (this.isControlled("us", "iran") == 1) { usc = 1; ***REMOVED***
    if (this.isControlled("us", "jordan") == 1) { usc = 1; ***REMOVED***
    if (this.isControlled("us", "gulfstates") == 1) { usc = 1; ***REMOVED***
    if (this.isControlled("us", "saudiarabia") == 1) { usc = 1; ***REMOVED***

    if (usc == 0) {
      this.updateLog("US does not control any Middle-East Countries");
      return 1;
***REMOVED***

    this.game.state.events.ourmanintehran = 1;

    if (this.game.player == 2) {
      this.updateStatus("Waiting for USSR to provide keys to examine deck");
***REMOVED***
    if (this.game.player == 1) {
      this.addMove("resolve\ttehran");
      let keys_given = 0;
      for (let i = 0; i < this.game.deck[0].crypt.length && i < 5; i++) {
        this.addMove(this.game.deck[0].keys[i]);
        keys_given++;
  ***REMOVED***
      this.addMove("tehran\tussr\t"+keys_given);
      this.endTurn();
***REMOVED***
    return 0;
  ***REMOVED***




  //
  // Flower Power
  //
  if (card == "flowerpower") {
    if (this.game.state.events.evilempire == 1) {
      this.updateLog("Flower Power prevented by Evil Empire");
      return 1;
***REMOVED***
    this.game.state.events.flowerpower = 1;
    return 1;
  ***REMOVED***




  //
  // Quagmire
  //
  if (card == "quagmire") {
    this.game.state.events.norad = 0;
    this.game.state.events.quagmire = 1;
    return 1;
  ***REMOVED***


  //
  // Bear Trap
  //
  if (card == "beartrap") {
    this.game.state.events.beartrap = 1;
    return 1;
  ***REMOVED***




  //
  // Summit
  //
  if (card == "summit") {

    let us_roll = this.rollDice(6);
    let ussr_roll = this.rollDice(6);

    this.updateLog("<span>Summit: US rolls</span> "+us_roll+" <span>and USSR rolls</span> "+ussr_roll);

    if (this.doesPlayerDominateRegion("ussr", "europe") == 1)   { ussr_roll++; ***REMOVED***
    if (this.doesPlayerDominateRegion("ussr", "mideast") == 1)  { ussr_roll++; ***REMOVED***
    if (this.doesPlayerDominateRegion("ussr", "asia") == 1)     { ussr_roll++; ***REMOVED***
    if (this.doesPlayerDominateRegion("ussr", "africa") == 1)   { ussr_roll++; ***REMOVED***
    if (this.doesPlayerDominateRegion("ussr", "camerica") == 1) { ussr_roll++; ***REMOVED***
    if (this.doesPlayerDominateRegion("ussr", "samerica") == 1) { ussr_roll++; ***REMOVED***

    if (this.doesPlayerDominateRegion("us", "europe") == 1)   { us_roll++; ***REMOVED***
    if (this.doesPlayerDominateRegion("us", "mideast") == 1)  { us_roll++; ***REMOVED***
    if (this.doesPlayerDominateRegion("us", "asia") == 1)     { us_roll++; ***REMOVED***
    if (this.doesPlayerDominateRegion("us", "africa") == 1)   { us_roll++; ***REMOVED***
    if (this.doesPlayerDominateRegion("us", "camerica") == 1) { us_roll++; ***REMOVED***
    if (this.doesPlayerDominateRegion("us", "samerica") == 1) { us_roll++; ***REMOVED***

    let is_winner = 0;

    if (us_roll > ussr_roll) { is_winner = 1; ***REMOVED***
    if (ussr_roll > us_roll) { is_winner = 1; ***REMOVED***

    if (is_winner == 0) {
      return 1;
***REMOVED*** else {

      //
      // winner
      //
      let my_go = 0;
      if (us_roll > ussr_roll && this.game.player == 2) { my_go = 1; ***REMOVED***
      if (ussr_roll > us_roll && this.game.player == 1) { my_go = 1; ***REMOVED***

      if (my_go == 1) {

        let twilight_self = this;

        twilight_self.addMove("resolve\tsummit");

        if (us_roll > ussr_roll) {
          twilight_self.addMove("vp\tus\t2");
    ***REMOVED*** else {
           twilight_self.addMove("vp\tussr\t2");
    ***REMOVED***

        let x = 0;
        let y = 0;

        this.updateStatus('<span>You win the Summit:</span><p></p><ul><li class="card" id="raise">raise DEFCON</li><li class="card" id="lower">lower DEFCON</li></ul>');

        $('.card').off();
        $('.card').on('click', function() {

          let action2 = $(this).attr("id");

            if (action2 == "raise") {
            twilight_self.updateStatus("broadcasting choice....");
            twilight_self.addMove("resolve\tsummit");
            twilight_self.addMove("defcon\traise");
            twilight_self.endTurn();
      ***REMOVED***
            if (action2 == "lower") {
            twilight_self.updateStatus("broadcasting choice....");
            twilight_self.addMove("resolve\tsummit");
            twilight_self.addMove("defcon\tlower");
            twilight_self.endTurn();
      ***REMOVED***

    ***REMOVED***);
  ***REMOVED***
      return 0;
***REMOVED***
  ***REMOVED***




  //
  // Nuclear Subs
  //
  if (card == "nuclearsubs") {
    this.game.state.events.nuclearsubs = 1;
    return 1;
  ***REMOVED***



  //
  // Cuban Missile Crisis
  //
  if (card == "cubanmissile") {
    this.game.state.defcon = 2;
    this.updateDefcon();
    if (player == "ussr") { this.game.state.events.cubanmissilecrisis = 2; ***REMOVED***
    if (player == "us") { this.game.state.events.cubanmissilecrisis = 1; ***REMOVED***
    return 1;
  ***REMOVED***




  //
  // Junta
  //
  if (card == "junta") {

    this.game.state.events.junta = 1;

    let my_go = 0;
    if (player == "ussr" && this.game.player == 1) { my_go = 1; ***REMOVED***
    if (player == "us" && this.game.player == 2) { my_go = 1; ***REMOVED***

    if (my_go == 0) {
      this.updateStatus(player.toUpperCase() + "</span> <span>playing Junta");
***REMOVED***
    if (my_go == 1) {

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();

      twilight_self.updateStatus(player.toUpperCase() + ' to place 2 Influence in Central or South America');

      for (var i in this.countries) {

        let countryname  = i;
        let divname      = '#'+i;
        let countries_with_us_influence = 0;

        if (this.countries[i].region === "samerica" || this.countries[i].region === "camerica") {

          let divname = '#'+i;

          $(divname).off();
          $(divname).on('click', function() {

            let c = $(this).attr('id');

            twilight_self.placeInfluence(c, 2, player, function() {

	      //
	      // disable event
	      //
	      $('.country').off();

              let confirmoptional = '<span>Do you wish to launch a free coup or conduct realignment rolls in Central or South America with the Junta card?</span><p></p><ul><li class="card" id="conduct">coup or realign</li><li class="card" id="skip">skip</li></ul>';
              twilight_self.updateStatus(confirmoptional);

              $('.card').off();
              $('.card').on('click', function() {

                let action2 = $(this).attr("id");

                if (action2 == "conduct") {
                  twilight_self.addMove("resolve\tjunta");
                  twilight_self.addMove("unlimit\tplacement");
                  twilight_self.addMove("unlimit\tmilops");
                  twilight_self.addMove("unlimit\tregion");
                  twilight_self.addMove("ops\t"+player+"\tjunta\t2");
                  twilight_self.addMove("limit\tregion\teurope");
                  twilight_self.addMove("limit\tregion\tafrica");
                  twilight_self.addMove("limit\tregion\tmideast");
                  twilight_self.addMove("limit\tregion\tasia");
                  twilight_self.addMove("limit\tmilops");
                  twilight_self.addMove("limit\tplacement");
                  twilight_self.addMove("place\t"+player+"\t"+player+"\t"+c+"\t2");
                  twilight_self.playerFinishedPlacingInfluence();
                  twilight_self.endTurn();
            ***REMOVED***

                if (action2 == "skip") {
                  twilight_self.addMove("resolve\tjunta");
                  twilight_self.addMove("place\t"+player+"\t"+player+"\t"+c+"\t2");
                  twilight_self.playerFinishedPlacingInfluence();
                  twilight_self.endTurn();
            ***REMOVED***

          ***REMOVED***);
        ***REMOVED***);
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    return 0;
  ***REMOVED***





  //
  // ABM Treaty
  //
  if (card == "abmtreaty") {

    this.updateStatus(player.toUpperCase() + "</span> <span>plays ABM Treaty");
    this.updateLog("DEFCON increases by 1");

    this.game.state.defcon++;
    if (this.game.state.defcon > 5) { this.game.state.defcon = 5; ***REMOVED***
    this.updateDefcon();

    let did_i_play_this = 0;

    if (player == "us" && this.game.player == 2)   { did_i_play_this = 1; ***REMOVED***
    if (player == "ussr" && this.game.player == 1) { did_i_play_this = 1; ***REMOVED***

    if (did_i_play_this == 1) {
      this.addMove("resolve\tabmtreaty");
      this.addMove("ops\t"+player+"\tabmtreaty\t4");
      this.endTurn();
***REMOVED***

    return 0;
  ***REMOVED***










  //
  // Cultural Revolution
  //
  if (card == "culturalrev") {

    if (this.game.state.events.china_card == 1) {

      this.game.state.vp -= 1;
      this.updateLog("USSR gains 1 VP from Cultural Revolution");
      this.updateVictoryPoints();

***REMOVED*** else {

      if (this.game.state.events.china_card == 2) {

        this.updateLog("USSR gains the China Card face up");

        if (this.game.player == 1) {
          this.game.deck[0].hand.push("china");
    ***REMOVED***
        this.game.state.events.china_card = 0;

  ***REMOVED*** else {

***REMOVED***
***REMOVED*** it is in one of our hands
***REMOVED***
        if (this.game.player == 1) {

          let do_i_have_cc = 0;

          for (let i = 0; i < this.game.deck[0].hand.length; i++) {
                if (this.game.deck[0].hand[i] == "china") {
              do_i_have_cc = 1;
        ***REMOVED***
      ***REMOVED***

          if (do_i_have_cc == 1) {
            this.game.state.vp -= 1;
            this.updateVictoryPoints();
      ***REMOVED*** else {
            if (! this.game.deck[0].hand.includes("china")) {
              this.game.deck[0].hand.push("china");
        ***REMOVED***
            this.game.state.events.china_card = 0;
      ***REMOVED***

    ***REMOVED***
        if (this.game.player == 2) {

            let do_i_have_cc = 0;

          for (let i = 0; i < this.game.deck[0].hand.length; i++) {
                if (this.game.deck[0].hand[i] == "china") {
              do_i_have_cc = 1;
        ***REMOVED***
      ***REMOVED***

          if (do_i_have_cc == 1) {
            for (let i = 0; i < this.game.deck[0].hand.length; i++) {
              if (this.game.deck[0].hand[i] == "china") {
                this.game.deck[0].hand.splice(i, 1);
                return 1;
          ***REMOVED***
        ***REMOVED***
      ***REMOVED*** else {
            this.game.state.vp -= 1;
            this.updateLog("USSR gains 1 VP from Cultural Revolution");
            this.updateVictoryPoints();
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    return 1;
  ***REMOVED***






  //
  // Nixon Plays the China Card
  //
  if (card == "nixon") {

    let does_us_get_vp = 0;

    if (this.game.state.events.china_card == 2) {
      does_us_get_vp = 1;
***REMOVED*** else {

      if (this.game.state.events.china_card == 1) {
        this.game.state.events.china_card = 2;
  ***REMOVED*** else {

        if (this.game.player == 2) {
          for (let i = 0; i < this.game.deck[0].hand.length; i++) {
                if (this.game.deck[0].hand[i] == "china") {
              does_us_get_vp = 1;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
        if (this.game.player == 1) {
            does_us_get_vp = 1;
          for (let i = 0; i < this.game.deck[0].hand.length; i++) {
                if (this.game.deck[0].hand[i] == "china") {
              does_us_get_vp = 0;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    if (does_us_get_vp == 1) {
      this.game.state.vp += 2;
      this.updateVictoryPoints();
      this.updateLog("US gets 2 VP from Nixon");
***REMOVED*** else {
      if (this.game.player == 1) {
        for (let i = 0; i < this.game.deck[0].hand.length; i++) {
          if (this.game.deck[0].hand[i] == "china") {
            this.updateLog("US gets the China Card (face down)");
            this.game.deck[0].hand.splice(i, 1);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
      this.game.state.events.china_card = 2;
***REMOVED***

    return 1;
  ***REMOVED***




  //
  // Kitchen Debates
  //
  if (card == "kitchendebates") {

    let us_bg = 0;
    let ussr_bg = 0;

    if (this.isControlled("us", "mexico") == 1)        { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "mexico") == 1)      { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "cuba") == 1)          { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "cuba") == 1)        { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "panama") == 1)        { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "panama") == 1)      { ussr_bg++; ***REMOVED***

    if (this.isControlled("us", "venezuela") == 1)     { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "venezuela") == 1)   { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "brazil") == 1)        { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "brazil") == 1)      { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "argentina") == 1)     { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "argentina") == 1)   { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "chile") == 1)         { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "chile") == 1)       { ussr_bg++; ***REMOVED***

    if (this.isControlled("us", "southafrica") == 1)   { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "southafrica") == 1) { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "angola") == 1)        { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "angola") == 1)      { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "zaire") == 1)         { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "zaire") == 1)       { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "nigeria") == 1)       { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "nigeria") == 1)     { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "algeria") == 1)       { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "algeria") == 1)     { ussr_bg++; ***REMOVED***

    if (this.isControlled("us", "poland") == 1)        { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "poland") == 1)      { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "eastgermany") == 1)   { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "eastgermany") == 1) { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "westgermany") == 1)   { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "westgermany") == 1) { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "france") == 1)        { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "france") == 1)      { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "italy") == 1)         { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "italy") == 1)       { ussr_bg++; ***REMOVED***

    if (this.isControlled("us", "libya") == 1)         { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "libya") == 1)       { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "egypt") == 1)         { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "egypt") == 1)       { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "israel") == 1)        { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "israel") == 1)      { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "iraq") == 1)          { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "iraq") == 1)        { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "iran") == 1)          { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "iran") == 1)        { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "saudiarabia") == 1)   { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "saudiarabia") == 1) { ussr_bg++; ***REMOVED***

    if (this.isControlled("us", "pakistan") == 1)      { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "pakistan") == 1)    { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "india") == 1)         { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "india") == 1)       { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "thailand") == 1)      { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "thailand") == 1)    { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "japan") == 1)         { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "japan") == 1)       { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "southkorea") == 1)    { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "southkorea") == 1)  { ussr_bg++; ***REMOVED***
    if (this.isControlled("us", "northkorea") == 1)    { us_bg++; ***REMOVED***
    if (this.isControlled("ussr", "northkorea") == 1)  { ussr_bg++; ***REMOVED***

    if (us_bg > ussr_bg) {
      this.game.state.events.kitchendebates = 1;
      this.updateLog("US gains 2 VP and pokes USSR in chest...");
      this.game.state.vp += 2;
      this.updateVictoryPoints();
***REMOVED*** else {
      this.updateLog("US does not have more battleground countries than USSR...");
***REMOVED***

    return 1;
  ***REMOVED***




  //
  // Voice of America
  //
  if (card == "voiceofamerica") {

    var ops_to_purge = 4;
    var ops_removable = 0;

    for (var i in this.countries) { if (this.countries[i].ussr > 0) { ops_removable += this.countries[i].ussr; ***REMOVED*** ***REMOVED***
    if (ops_to_purge > ops_removable) { ops_to_purge = ops_removable; ***REMOVED***
    if (ops_to_purge <= 0) {
      return 1;
***REMOVED***


    if (this.game.player == 1) { return 0; ***REMOVED***
    if (this.game.player == 2) {

      this.updateStatus("Remove 4 USSR influence from non-European countries (max 2 per country)");

      var twilight_self = this;
      var ops_purged = {***REMOVED***;

      twilight_self.playerFinishedPlacingInfluence();
      twilight_self.addMove("resolve\tvoiceofamerica");

      for (var i in this.countries) {

        let countryname  = i;
        ops_purged[countryname] = 0;
        let divname      = '#'+i;

        if (this.countries[i].region != "europe") {

          twilight_self.countries[countryname].place = 1;

          $(divname).off();
          $(divname).on('click', function() {

            let c = $(this).attr('id');

            if (twilight_self.countries[c].place != 1 || twilight_self.countries[c].ussr == 0) {
              twilight_self.displayModal("Invalid Country");
        ***REMOVED*** else {
              ops_purged[c]++;
              if (ops_purged[c] >= 2) {
                twilight_self.countries[c].place = 0;
          ***REMOVED***
              twilight_self.removeInfluence(c, 1, "ussr", function() {
                twilight_self.addMove("remove\tus\tussr\t"+c+"\t1");
                ops_to_purge--;
                if (ops_to_purge == 0) {
                  twilight_self.playerFinishedPlacingInfluence();
                  twilight_self.endTurn();
            ***REMOVED***
          ***REMOVED***);
        ***REMOVED***
      ***REMOVED***);

    ***REMOVED***
  ***REMOVED***
***REMOVED***
    return 0;
  ***REMOVED***



  //
  // Puppet Government
  //
  if (card == "puppet") {

    if (this.game.player == 1) {
      this.updateStatus("US is playing Puppet Governments");
      return 0;
***REMOVED***
    if (this.game.player == 2) {

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();

      var ops_to_place = 3;
      var available_targets = 0;

      twilight_self.addMove("resolve\tpuppet");

      this.updateStatus("US place three influence in countries without any influence");

      for (var i in this.countries) {

        let countryname  = i;
        let divname      = '#'+i;

        if (twilight_self.countries[countryname].us == 0 && twilight_self.countries[countryname].ussr == 0) {

          available_targets++;
          twilight_self.countries[countryname].place = 1;

          $(divname).off();
          $(divname).on('click', function() {
            let countryname = $(this).attr('id');
            if (twilight_self.countries[countryname].place == 1) {
              twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
              twilight_self.placeInfluence(countryname, 1, "us", function() {
                twilight_self.countries[countryname].place = 0;
                ops_to_place--;
                if (ops_to_place == 0) {
                  twilight_self.playerFinishedPlacingInfluence();
                  twilight_self.endTurn();
            ***REMOVED***
          ***REMOVED***);
        ***REMOVED*** else {
              twilight_self.displayModal("you cannot place there...");
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***

      if (available_targets < ops_to_place) { ops_to_place = available_targets; ***REMOVED***
      if (ops_to_place > 0) {
        return 0;
  ***REMOVED*** else {
        twilight_self.playerFinishedPlacingInfluence();
        return 0;
  ***REMOVED***
***REMOVED***
  ***REMOVED***




  //
  // Liberation Theology
  //
  if (card == "liberation") {

    if (this.game.player == 2) {
      this.updateStatus("USSR is playing Liberation Theology");
      return 0;
***REMOVED***
    if (this.game.player == 1) {

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();

      var ops_to_place = 3;
      var already_placed = [];

      twilight_self.addMove("resolve\tliberation");

      this.updateStatus("USSR places three influence in Central America");
      for (var i in this.countries) {

        let countryname  = i;
        let divname      = '#'+i;
        if (i == "mexico" || i == "guatemala" || i == "elsalvador" || i == "honduras" || i == "nicaragua" || i == "costarica" || i == "panama" || i == "cuba" || i == "haiti" || i == "dominicanrepublic") {
          twilight_self.countries[countryname].place = 1;

          already_placed[countryname] = 0;

          $(divname).off();
          $(divname).on('click', function() {
            let countryname = $(this).attr('id');
            if (twilight_self.countries[countryname].place == 1) {
              already_placed[countryname]++;
              if (already_placed[countryname] == 2) {
                twilight_self.countries[countryname].place = 0;
          ***REMOVED***
              twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
              twilight_self.placeInfluence(countryname, 1, "ussr", function() {
                ops_to_place--;
                if (ops_to_place == 0) {
                  twilight_self.playerFinishedPlacingInfluence();
                  twilight_self.endTurn();
            ***REMOVED***
          ***REMOVED***);
        ***REMOVED*** else {
              twilight_self.displayModal("you cannot place there...");
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***
      return 0;
***REMOVED***
  ***REMOVED***




  //
  // Ussuri River Skirmish
  //
  if (card == "ussuri") {

    let us_cc = 0;

    //
    // does us have cc
    //
    if (this.game.state.events.china_card == 2) {
      us_cc = 1;
***REMOVED*** else {

      //
      // it is in one of our hands
      //
      if (this.game.player == 1) {

        let do_i_have_cc = 0;

        if (this.game.state.events.china_card == 1) { do_i_have_cc = 1; ***REMOVED***

        for (let i = 0; i < this.game.deck[0].hand.length; i++) {
              if (this.game.deck[0].hand[i] == "china") {
            do_i_have_cc = 1;
      ***REMOVED***
    ***REMOVED***

        if (do_i_have_cc == 1) {
    ***REMOVED*** else {
          us_cc = 1;
    ***REMOVED***

  ***REMOVED***
      if (this.game.player == 2) {
        for (let i = 0; i < this.game.deck[0].hand.length; i++) {
              if (this.game.deck[0].hand[i] == "china") {
            us_cc = 1;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***


    //
    //
    //
    if (us_cc == 1) {

      this.updateLog("US places 4 influence in Asia (max 2 per country)");

      //
      // place four in asia
      //
      if (this.game.player == 1) {
        this.updateStatus("US is playing USSURI River Skirmish");
        return 0;
  ***REMOVED***
      if (this.game.player == 2) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        var ops_to_place = 4;
        twilight_self.addMove("resolve\tussuri");

        this.updateStatus("US place four influence in Asia (2 max per country)");

        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;
          let ops_placed   = [];

            if (this.countries[i].region.indexOf("asia") != -1) {

            ops_placed[i] = 0;

            twilight_self.countries[countryname].place = 1;
            $(divname).off();
            $(divname).on('click', function() {
              let countryname = $(this).attr('id');
              if (twilight_self.countries[countryname].place == 1) {
                ops_placed[countryname]++;
                twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
                twilight_self.placeInfluence(countryname, 1, "us", function() {
                  if (ops_placed[countryname] >= 2) {
                    twilight_self.countries[countryname].place = 0;
              ***REMOVED***
                  ops_to_place--;
                  if (ops_to_place == 0) {
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
              ***REMOVED***
            ***REMOVED***);
          ***REMOVED*** else {
                twilight_self.displayModal("you cannot place there...");
          ***REMOVED***
        ***REMOVED***);
      ***REMOVED***
    ***REMOVED***
        return 0;
  ***REMOVED***
***REMOVED*** else {

      this.updateLog("US gets the China Card (face up)");

      //
      // us gets china card face up
      //
      this.game.state.events.china_card = 0;

      if (this.game.player == 1) {
        for (let i = 0; i < this.game.deck[0].hand.length; i++) {
          if (this.game.deck[0].hand[i] == "china") {
            this.game.deck[0].hand.splice(i, 1);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
      if (this.game.player == 2) {
        if (! this.game.deck[0].hand.includes("china")) {
          this.game.deck[0].hand.push("china");
    ***REMOVED***
  ***REMOVED***

      return 1;
***REMOVED***
  ***REMOVED***



  //
  // South African Unrest
  //
  if (card == "southafrican") {

    if (this.game.player == 2) {
      this.updateStatus("USSR is playing South African Unrest");
      return 0;
***REMOVED***
    if (this.game.player == 1) {

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();

      twilight_self.updateStatus('USSR chooses:<p></p><ul><li class="card" id="southafrica">2 Influence in South Africa</li><li class="card" id="adjacent">1 Influence in South Africa and 2 Influence in adjacent countries</li></ul>');

      $('.card').off();
      $('.card').on('click', function() {

        let action2 = $(this).attr("id");

        if (action2 == "southafrica") {

          twilight_self.placeInfluence("southafrica", 2, "ussr", function() {
            twilight_self.addMove("resolve\tsouthafrican");
            twilight_self.addMove("place\tussr\tussr\tsouthafrica\t2");
            twilight_self.endTurn();
      ***REMOVED***);
          return 0;

    ***REMOVED***
        if (action2 == "adjacent") {

          twilight_self.placeInfluence("southafrica", 1, "ussr", function() {
            twilight_self.addMove("resolve\tsouthafrican");
            twilight_self.addMove("place\tussr\tussr\tsouthafrica\t1");

            twilight_self.updateStatus("Place two influence in countries adjacent to South Africa");

            var ops_to_place = 2;

            for (var i in twilight_self.countries) {

              let countryname  = i;
              let divname      = '#'+i;

              if (i == "angola" || i == "botswana") {

                $(divname).off();
                $(divname).on('click', function() {

                  let c = $(this).attr('id');
                  twilight_self.placeInfluence(c, 1, "ussr", function() {

                    twilight_self.addMove("place\tussr\tussr\t"+c+"\t1");
                    ops_to_place--;
                    if (ops_to_place == 0) {
                      twilight_self.playerFinishedPlacingInfluence();
                      twilight_self.endTurn();
                ***REMOVED***
              ***REMOVED***);
            ***REMOVED***);
          ***REMOVED***;
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***);
      return 0;
***REMOVED***
  ***REMOVED***




  //
  // How I Learned to Stop Worrying
  //
  if (card == "howilearned") {

    let twilight_self = this;

    let my_go = 0;

    if (player == "ussr") { this.game.state.milops_ussr = 5; ***REMOVED***
    if (player == "us") { this.game.state.milops_us = 5; ***REMOVED***

    if (player == "ussr" && this.game.player == 1) { my_go = 1; ***REMOVED***
    if (player == "us"   && this.game.player == 2) { my_go = 1; ***REMOVED***

    if (my_go == 1) {

      twilight_self.updateStatus('Set DEFCON at level:<p></p><ul><li class="card" id="five">five</li><li class="card" id="four">four</li><li class="card" id="three">three</li><li class="card" id="two">two</li><li class="card" id="one">one</li></ul>');

      $('.card').off();
      $('.card').on('click', function() {

        let defcon_target = 5;

        let action2 = $(this).attr("id");

        twilight_self.addMove("resolve\thowilearned");

        if (action2 == "one")   { defcon_target = 1; ***REMOVED***
        if (action2 == "two")   { defcon_target = 2; ***REMOVED***
        if (action2 == "three") { defcon_target = 3; ***REMOVED***
        if (action2 == "four")  { defcon_target = 4; ***REMOVED***
        if (action2 == "five")  { defcon_target = 5; ***REMOVED***

        if (defcon_target > twilight_self.game.state.defcon) {
          let defcon_diff = defcon_target-twilight_self.game.state.defcon;
          for (i = 0; i < defcon_diff; i++) {
            twilight_self.addMove("defcon\traise");
      ***REMOVED***
    ***REMOVED***

        if (defcon_target < twilight_self.game.state.defcon) {
          let defcon_diff = twilight_self.game.state.defcon - defcon_target;
          for (i = 0; i < defcon_diff; i++) {
            twilight_self.addMove("defcon\tlower");
      ***REMOVED***
    ***REMOVED***

        twilight_self.endTurn();

  ***REMOVED***);
***REMOVED***
    return 0;
  ***REMOVED***





  //
  // OAS
  //
  if (card == "oas") {

    if (this.game.player == 1) {
      this.updateStatus("US is playing OAS");
      return 0;
***REMOVED***
    if (this.game.player == 2) {

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();

      var ops_to_place = 2;

      twilight_self.addMove("resolve\toas");

      this.updateStatus("US places two influence in Central or South America");
      for (var i in this.countries) {

        let countryname  = i;
        let divname      = '#'+i;
        if (i == "venezuela" || i == "colombia" || i == "ecuador" || i == "peru" || i == "chile" || i == "bolivia" || i == "argentina" || i == "paraguay" || i == "uruguay" || i == "brazil" || i == "mexico" || i == "guatemala" || i == "elsalvador" || i == "honduras" || i == "nicaragua" || i == "costarica" || i == "panama" || i == "cuba" || i == "haiti" || i == "dominicanrepublic") {

          twilight_self.countries[countryname].place = 1;

          $(divname).off();
          $(divname).on('click', function() {
            let countryname = $(this).attr('id');
            if (twilight_self.countries[countryname].place == 1) {
              twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
              twilight_self.placeInfluence(countryname, 1, "us", function() {
                ops_to_place--;
                if (ops_to_place == 0) {
                  twilight_self.playerFinishedPlacingInfluence();
                  twilight_self.endTurn();
            ***REMOVED***
          ***REMOVED***);
        ***REMOVED*** else {
              twilight_self.displayModal("you cannot place there...");
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***
      return 0;
***REMOVED***
  ***REMOVED***





  //
  // Allende
  //
  if (card == "allende") {
    this.placeInfluence("chile", 2, "ussr");
    return 1;
  ***REMOVED***



  //
  // Panama Canal
  //
  if (card == "panamacanal") {
    this.placeInfluence("panama", 1, "us");
    this.placeInfluence("venezuela", 1, "us");
    this.placeInfluence("costarica", 1, "us");
    return 1;
  ***REMOVED***



  //
  // Camp David
  //
  if (card == "campdavid") {

    this.game.state.events.campdavid = 1;

    this.updateLog("US gets 1 VP for Camp David Accords");

    this.game.state.vp += 1;
    this.updateVictoryPoints();

    this.placeInfluence("israel", 1, "us");
    this.placeInfluence("egypt", 1, "us");
    this.placeInfluence("jordan", 1, "us");
    return 1;
  ***REMOVED***





  //
  // Sadat Expels Soviets
  //
  if (card == "sadat") {
    if (this.countries["egypt"].ussr > 0) {
      this.removeInfluence("egypt", this.countries["egypt"].ussr, "ussr");
***REMOVED***
    this.placeInfluence("egypt", 1, "us");
    return 1;
  ***REMOVED***




  //
  // U2 Incident
  //
  if (card == "u2") {

    this.game.state.events.u2 = 1;
    this.game.state.vp -= 1;
    this.updateVictoryPoints();

    return 1;
  ***REMOVED***





  //
  // Portuguese Empire Crumbles
  //
  if (card == "portuguese") {
    this.placeInfluence("seafricanstates", 2, "ussr");
    this.placeInfluence("angola", 2, "ussr");
    return 1;
  ***REMOVED***



  //
  // John Paul II
  //
  if (card == "johnpaul") {

    this.game.state.events.johnpaul = 1;

    this.removeInfluence("poland", 2, "ussr");
    this.placeInfluence("poland", 1, "us");
    return 1;
  ***REMOVED***



  //
  // Colonial Rear Guards //
  //
  if (card == "colonial") {

    if (this.game.player == 1) {
      this.updateStatus("US is playing Colonial Rear Guards");
      return 0;
***REMOVED***
    if (this.game.player == 2) {

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();

      var ops_to_place = 4;
      twilight_self.addMove("resolve\tcolonial");

      this.updateStatus("US place four influence in Africa or Asia (1 per country)");

      for (var i in this.countries) {

        let countryname  = i;
        let divname      = '#'+i;

        if (i == "morocco" || i == "algeria" || i == "tunisia" || i == "westafricanstates" || i == "saharanstates" || i == "sudan" || i == "ivorycoast" || i == "nigeria" || i == "ethiopia" || i == "somalia" || i == "cameroon" || i == "zaire" || i == "kenya" || i == "angola" || i == "seafricanstates" || i == "zimbabwe" || i == "botswana" || i == "southafrica" || i == "philippines" || i == "indonesia" || i == "malaysia" || i == "vietnam" || i == "thailand" || i == "laos" || i == "burma") {
          twilight_self.countries[countryname].place = 1;
          $(divname).off();
          $(divname).on('click', function() {
            let countryname = $(this).attr('id');
            if (twilight_self.countries[countryname].place == 1) {
              twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
              twilight_self.placeInfluence(countryname, 1, "us", function() {
                twilight_self.countries[countryname].place = 0;
                ops_to_place--;
                if (ops_to_place == 0) {
                  twilight_self.playerFinishedPlacingInfluence();
                  twilight_self.endTurn();
            ***REMOVED***
          ***REMOVED***);
        ***REMOVED*** else {
              twilight_self.displayModal("you cannot place there...");
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***
      return 0;
***REMOVED***
  ***REMOVED***


  //
  // Brezhnev Doctrine
  //
  if (card == "brezhnev") {
    this.game.state.events.brezhnev = 1;
    return 1;
  ***REMOVED***





  //
  // We Will Bury You
  //
  if (card == "wwby") {

    this.game.state.events.wwby = 1;

    this.lowerDefcon();
    this.updateDefcon();

    if (this.game.state.defcon <= 1 && this.game.over != 1) {
      if (this.game.state.turn == 0) {
        this.endGame("us", "defcon");
  ***REMOVED*** else {
        this.endGame("ussr", "defcon");
  ***REMOVED***
      return 0;
***REMOVED***
    return 1;
  ***REMOVED***







  //
  // One Small Step
  //
  if (card == "onesmallstep") {
    if (player == "us") {
      if (this.game.state.space_race_us < this.game.state.space_race_ussr) {
        this.updateLog("US takes one small step into space...");
        this.game.state.space_race_us += 1;
	if (this.game.state.space_race_us == 2) { this.game.state.animal_in_space = ""; ***REMOVED***
	if (this.game.state.space_race_us == 4) { this.game.state.man_in_earth_orbit = ""; ***REMOVED***
	if (this.game.state.space_race_us == 6) { this.game.state.eagle_has_landed = ""; ***REMOVED***
	if (this.game.state.space_race_us == 8) { this.game.state.space_shuttle = ""; ***REMOVED***
        this.advanceSpaceRace("us");
  ***REMOVED***
***REMOVED*** else {
      if (this.game.state.space_race_ussr < this.game.state.space_race_us) {
        this.updateLog("USSR takes one small step into space...");
        this.game.state.space_race_ussr += 1;
	if (this.game.state.space_race_ussr == 2) { this.game.state.animal_in_space = ""; ***REMOVED***
	if (this.game.state.space_race_ussr == 4) { this.game.state.man_in_earth_orbit = ""; ***REMOVED***
	if (this.game.state.space_race_ussr == 6) { this.game.state.eagle_has_landed = ""; ***REMOVED***
	if (this.game.state.space_race_ussr == 8) { this.game.state.space_shuttle = ""; ***REMOVED***
        this.advanceSpaceRace("ussr");
  ***REMOVED***
***REMOVED***

    return 1;
  ***REMOVED***



  //
  // Alliance for Progress
  //
  if (card == "alliance") {

    let us_bonus = 0;

    if (this.isControlled("us", "mexico") == 1)     { us_bonus++; ***REMOVED***
    if (this.isControlled("us", "cuba") == 1)       { us_bonus++; ***REMOVED***
    if (this.isControlled("us", "panama") == 1)     { us_bonus++; ***REMOVED***
    if (this.isControlled("us", "chile") == 1)      { us_bonus++; ***REMOVED***
    if (this.isControlled("us", "argentina") == 1)  { us_bonus++; ***REMOVED***
    if (this.isControlled("us", "brazil") == 1)     { us_bonus++; ***REMOVED***
    if (this.isControlled("us", "venezuela") == 1)  { us_bonus++; ***REMOVED***

    this.game.state.vp += us_bonus;
    this.updateVictoryPoints();
    this.updateLog("<span>US VP bonus is:</span> " + us_bonus);

    return 1;

  ***REMOVED***




  //
  // Lone Gunman
  //
  if (card == "lonegunman") {

    if (this.game.player == 1) {
      this.updateStatus("US is playing Lone Gunman");
      return 0;
***REMOVED***
    if (this.game.player == 2) {

      this.addMove("resolve\tlonegunman");
      this.updateStatus("US is playing Lone Gunman");

      if (this.game.deck[0].hand.length < 1) {
        this.addMove("ops\tussr\tlonegunman\t1");
        this.addMove("notify\tUS has no cards to reveal");
        this.endTurn();
  ***REMOVED*** else {
        let revealed = "";
        for (let i = 0; i < this.game.deck[0].hand.length; i++) {
          if (i > 0) { revealed += ", "; ***REMOVED***
          revealed += this.game.deck[0].cards[this.game.deck[0].hand[i]].name;
    ***REMOVED***
        this.addMove("ops\tussr\tlonegunman\t1");
        this.addMove("notify\tUS holds: "+revealed);
        this.endTurn();
  ***REMOVED***
***REMOVED***
    return 0;
  ***REMOVED***



  //
  // OPEC
  //
  if (card == "opec") {

    if (this.game.state.events.northseaoil == 0) {

      let ussr_bonus = 0;

      if (this.isControlled("ussr", "egypt") == 1)       { ussr_bonus++; ***REMOVED***
      if (this.isControlled("ussr", "iran") == 1)        { ussr_bonus++; ***REMOVED***
      if (this.isControlled("ussr", "libya") == 1)       { ussr_bonus++; ***REMOVED***
      if (this.isControlled("ussr", "saudiarabia") == 1) { ussr_bonus++; ***REMOVED***
      if (this.isControlled("ussr", "gulfstates") == 1)  { ussr_bonus++; ***REMOVED***
      if (this.isControlled("ussr", "iraq") == 1)        { ussr_bonus++; ***REMOVED***
      if (this.isControlled("ussr", "venezuela") == 1)   { ussr_bonus++; ***REMOVED***

      this.game.state.vp -= ussr_bonus;
      this.updateVictoryPoints();
      this.updateLog("<span>USSR VP bonus is:</span> " + ussr_bonus);

***REMOVED***

    return 1;

  ***REMOVED***




  //
  // Brush War
  //
  if (card == "brushwar") {

    let me = "ussr";
    let opponent = "us";
    if (this.game.player == 2) { opponent = "ussr"; me = "us"; ***REMOVED***

    if (me != player) {
      let burned = this.rollDice(6);
      return 0;
***REMOVED***
    if (me == player) {

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();

      twilight_self.addMove("resolve\tbrushwar");
      twilight_self.updateStatus('Pick target for Brush War');



      for (var i in twilight_self.countries) {

        if (twilight_self.countries[i].control <= 2) {

          let play_brush_war = 1;
          let divname = "#" + i;

          if (i === "italy") {
            if (twilight_self.game.state.events.nato == 1) {
              if (twilight_self.isControlled("us", "italy") == 1) {
                play_brush_war = 0;
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***

          if (play_brush_war == 1) {

            $(divname).off();
            $(divname).on('click', function() {

              let c = $(this).attr('id');

              twilight_self.displayModal("Launching Brush War in "+twilight_self.countries[c].name);

              let dieroll = twilight_self.rollDice(6);
              let modify = 0;

              for (let v = 0; v < twilight_self.countries[c].neighbours.length; v++) {
                if (twilight_self.isControlled(opponent, v) == 1) {
                  modify++;
            ***REMOVED***
          ***REMOVED***

              if (twilight_self.game.player == 1) {
                if (c == "mexico") { modify++; ***REMOVED***
                if (c == "cuba") { modify++; ***REMOVED***
                if (c == "japan") { modify++; ***REMOVED***
                if (c == "canada") { modify++; ***REMOVED***
          ***REMOVED***
              if (twilight_self.game.player == 2) {
                if (c == "finland") { modify++; ***REMOVED***
                if (c == "romania") { modify++; ***REMOVED***
                if (c == "afghanistan") { modify++; ***REMOVED***
                if (c == "northkorea") { modify++; ***REMOVED***
          ***REMOVED***

              dieroll = dieroll - modify;

              if (dieroll >= 3) {

                let usinf = twilight_self.countries[c].us;
                let ussrinf = twilight_self.countries[c].ussr;

                if (me == "us") {
                  twilight_self.removeInfluence(c, ussrinf, "ussr");
                  twilight_self.placeInfluence(c, ussrinf, "us");
                  twilight_self.addMove("remove\tus\tussr\t"+c+"\t"+ussrinf);
                  twilight_self.addMove("place\tus\tus\t"+c+"\t"+ussrinf);
                  twilight_self.addMove("milops\tus\t3");
                  if (twilight_self.game.state.events.flowerpower == 1) {
                    twilight_self.addMove("vp\tus\t1\t1");
              ***REMOVED*** else {
                    twilight_self.addMove("vp\tus\t1");
              ***REMOVED***
                  twilight_self.endTurn();
            ***REMOVED*** else {
                  twilight_self.removeInfluence(c, usinf, "us");
                  twilight_self.placeInfluence(c, usinf, "ussr");
                  twilight_self.addMove("remove\tussr\tus\t"+c+"\t"+usinf);
                  twilight_self.addMove("place\tussr\tussr\t"+c+"\t"+usinf);
                  twilight_self.addMove("milops\tussr\t3");
                  if (twilight_self.game.state.events.flowerpower == 1) {
                    twilight_self.addMove("vp\tussr\t1\t1");
              ***REMOVED*** else {
                    twilight_self.addMove("vp\tussr\t1");
              ***REMOVED***
            ***REMOVED***
                twilight_self.addMove("notify\tBrush War in "+twilight_self.countries[c].name+" succeeded.");
                twilight_self.addMove("notify\tBrush War rolls "+dieroll);
                twilight_self.endTurn();

          ***REMOVED*** else {
                if (me == "us") {
                  twilight_self.addMove("milops\tus\t3");
            ***REMOVED*** else {
                  twilight_self.addMove("milops\tussr\t3");
            ***REMOVED***
                twilight_self.addMove("notify\tBrush War in "+twilight_self.countries[c].name+" failed.");
                twilight_self.addMove("notify\tBrush War rolls "+dieroll);
                twilight_self.endTurn();
          ***REMOVED***
        ***REMOVED***);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    return 0;
  ***REMOVED***




  //
  // Arms Race
  //
  if (card == "armsrace") {

    let me = "ussr";
    let opponent = "us";
    if (this.game.player == 2) { opponent = "ussr"; me = "us"; ***REMOVED***

    if (player == "us") {
      if (this.game.state.milops_us > this.game.state.milops_ussr) {
        this.updateLog("US gains 1 VP from Arms Race");
        this.game.state.vp += 1;
        if (this.game.state.milops_us >= this.game.state.defcon) {
          this.updateLog("US gains 2 bonus VP rom Arms Race");
          this.game.state.vp += 2;
    ***REMOVED***
  ***REMOVED***
***REMOVED*** else {
      if (this.game.state.milops_ussr > this.game.state.milops_us) {
        this.updateLog("USSR gains 1 VP from Arms Race");
        this.game.state.vp -= 1;
        if (this.game.state.milops_ussr >= this.game.state.defcon) {
          this.updateLog("USSR gains 2 bonus VP from Arms Race");
          this.game.state.vp -= 2;
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    this.updateVictoryPoints();
    return 1;

  ***REMOVED***
















  //////////////
  // LATE WAR //
  //////////////


  //
  // Iranian Hostage Crisis
  //
  if (card == "iranianhostage") {
    this.game.state.events.iranianhostage = 1;
    if (this.countries["iran"].us > 0) { this.removeInfluence("iran", this.countries["iran"].us, "us"); ***REMOVED***
    this.placeInfluence("iran", 2, "ussr");
    return 1;
  ***REMOVED***



  //
  // North Sea Oil
  //
  if (card == "northseaoil") {
    this.game.state.events.northseaoil = 1;
    this.game.state.events.northseaoil_bonus = 1;
    return 1;
  ***REMOVED***



  //
  // Marine Barracks Bombing
  //
  if (card == "marine") {

    this.countries["lebanon"].us = 0;
    this.showInfluence("lebanon", "us");
    this.updateLog("All US influence removed from Lebanon");

    let ustroops = 0;
    for (var i in this.countries) {
      if (this.countries[i].region == "mideast") {
        ustroops += this.countries[i].us;
  ***REMOVED***
***REMOVED***

    if (ustroops == 0) {
      this.updateLog("US has no influence in the Middle-East");
      return 1;
***REMOVED***

    if (this.game.player == 2) {
      return 0;
***REMOVED***
    if (this.game.player == 1) {

      this.addMove("resolve\tmarine");

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();

      var ops_to_purge = 2;

      var ops_available = 0;
      for (var i in this.countries) {
        if (this.countries[i].region == "mideast") {
          if (this.countries[i].us > 0) {
            ops_available += this.countries[i].us;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***

      if (ops_available < 2) { ops_to_purge = ops_available; ***REMOVED***

      this.updateStatus("Remove</span> <span>"+ops_to_purge+" </span>US influence from the Middle East");
      for (var i in this.countries) {

        let countryname  = i;
        let divname      = '#'+i;

        if (this.countries[i].region == "mideast") {

          twilight_self.countries[countryname].place = 1;
          $(divname).off();
          $(divname).on('click', function() {

            let c = $(this).attr('id');

            if (twilight_self.countries[c].place != 1) {
              twilight_self.displayModal("Invalid Country");
        ***REMOVED*** else {
              twilight_self.removeInfluence(c, 1, "us", function() {
                twilight_self.addMove("remove\tussr\tus\t"+c+"\t1");
                ops_to_purge--;
                if (ops_to_purge == 0) {
                  twilight_self.playerFinishedPlacingInfluence();
                  twilight_self.endTurn();
            ***REMOVED***
          ***REMOVED***);
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***
      return 0;
***REMOVED***
  ***REMOVED***





  //
  // Latin American Debt Crisis
  //
  if (card == "debtcrisis") {

    if (this.game.player == 1) {
      this.updateStatus("US playing Latin American Debt Crisis");
      return 0;
***REMOVED***

    let cards_available = 0;
    let twilight_self = this;

    let user_message = "<span>Choose a card to discard or USSR doubles influence in two countries in South America:</span><p></p><ul>";
    for (i = 0; i < this.game.deck[0].hand.length; i++) {
      if (this.modifyOps(this.game.deck[0].cards[this.game.deck[0].hand[i]].ops, this.game.deck[0].hand[i], this.game.player, 0) > 2 && this.game.deck[0].hand[i] != "china") {
        user_message += '<li class="card showcard" id="'+this.game.deck[0].hand[i]+'">'+this.game.deck[0].cards[this.game.deck[0].hand[i]].name+'</li>';
        cards_available++;
  ***REMOVED***
***REMOVED***
    user_message += '<li class="card showcard" id="nodiscard">[do not discard]</li>';
    user_message += '</ul>';
    this.updateStatus(user_message);


    if (cards_available == 0) {
      this.addMove("resolve\tdebtcrisis");
      this.addMove("latinamericandebtcrisis");
      this.addMove("notify\tUS has no cards available for Latin American Debt Crisis");
      this.endTurn();
      return 0;
***REMOVED***


    $('.card').off();
    $('.card').on('click', function() {

      let action2 = $(this).attr("id");

      if (action2 == "nodiscard") {
        twilight_self.addMove("resolve\tdebtcrisis");
        twilight_self.addMove("latinamericandebtcrisis");
        twilight_self.endTurn();
        return 0;
  ***REMOVED***

      twilight_self.addMove("resolve\tdebtcrisis");
      twilight_self.addMove("discard\tus\t"+action2);
      twilight_self.addMove("notify\tUS discards <span class=\"logcard\" id=\""+action2+"\">"+twilight_self.game.deck[0].cards[action2].name + "</span>");
      twilight_self.removeCardFromHand(action2);
      twilight_self.endTurn();

***REMOVED***);

    return 0;
  ***REMOVED***





  //
  // AWACS Sale to Saudis
  //
  if (card == "awacs") {
    this.game.state.events.awacs = 1;
    this.countries["saudiarabia"].us += 2;
    this.showInfluence("saudiarabia", "us");
    return 1;
  ***REMOVED***



  //
  // Iran-Iraq War
  //
  if (card == "iraniraq") {

    let me = "ussr";
    let opponent = "us";
    if (this.game.player == 2) { opponent = "ussr"; me = "us"; ***REMOVED***

    if (me != player) {
      let burned = this.rollDice(6);
      return 0;
***REMOVED***
    if (me == player) {

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();

      twilight_self.addMove("resolve\tiraniraq");
      twilight_self.updateStatus('Iran-Iraq War. Choose Target:<p></p><ul><li class="card" id="invadeiraq">Iraq</li><li class="card" id="invadeiran">Iran</li></ul>');

      let target = 4;

      $('.card').off();
      $('.card').on('click', function() {

        let invaded = $(this).attr("id");

        if (invaded == "invadeiran") {

          if (twilight_self.isControlled(opponent, "pakistan") == 1) { target++; ***REMOVED***
          if (twilight_self.isControlled(opponent, "iraq") == 1) { target++; ***REMOVED***
          if (twilight_self.isControlled(opponent, "afghanistan") == 1) { target++; ***REMOVED***

          let die = twilight_self.rollDice(6);
          twilight_self.addMove("notify\t"+player.toUpperCase()+" rolls "+die);

          if (die >= target) {

            if (player == "us") {
              twilight_self.addMove("place\tus\tus\tiran\t"+twilight_self.countries['iran'].ussr);
              twilight_self.addMove("remove\tus\tussr\tiran\t"+twilight_self.countries['iran'].ussr);
              twilight_self.addMove("milops\tus\t2");
              if (twilight_self.game.state.events.flowerpower == 1) {
                twilight_self.addMove("vp\tussr\t2\t1");
          ***REMOVED***
              twilight_self.addMove("vp\tus\t2");
              twilight_self.placeInfluence("iran", twilight_self.countries['iran'].ussr, "us");
              twilight_self.removeInfluence("iran", twilight_self.countries['iran'].ussr, "ussr");
              twilight_self.endTurn();
              twilight_self.showInfluence("iran", "ussr");
        ***REMOVED*** else {
              twilight_self.addMove("place\tussr\tussr\tiran\t"+twilight_self.countries['iran'].us);
              twilight_self.addMove("remove\tussr\tus\tiran\t"+twilight_self.countries['iran'].us);
              twilight_self.addMove("milops\tussr\t2");
              if (twilight_self.game.state.events.flowerpower == 1) {
                twilight_self.addMove("vp\tussr\t2\t1");
          ***REMOVED***
              twilight_self.addMove("vp\tussr\t2");
              twilight_self.placeInfluence("iran", twilight_self.countries['iran'].us, "ussr");
              twilight_self.removeInfluence("iran", twilight_self.countries['iran'].us, "us");
              twilight_self.endTurn();
              twilight_self.showInfluence("iran", "ussr");
        ***REMOVED***
      ***REMOVED*** else {

            if (player == "us") {
              twilight_self.addMove("milops\tus\t2");
              if (twilight_self.game.state.events.flowerpower == 1) {
                twilight_self.addMove("vp\tussr\t2\t1");
          ***REMOVED***
              twilight_self.endTurn();
        ***REMOVED*** else {
              twilight_self.addMove("milops\tussr\t2");
              if (twilight_self.game.state.events.flowerpower == 1) {
                twilight_self.addMove("vp\tussr\t2\t1");
          ***REMOVED***
              twilight_self.endTurn();
        ***REMOVED***

      ***REMOVED***

    ***REMOVED***
        if (invaded == "invadeiraq") {

          if (twilight_self.isControlled(opponent, "iran") == 1) { target++; ***REMOVED***
          if (twilight_self.isControlled(opponent, "jordan") == 1) { target++; ***REMOVED***
          if (twilight_self.isControlled(opponent, "gulfstates") == 1) { target++; ***REMOVED***
          if (twilight_self.isControlled(opponent, "saudiarabia") == 1) { target++; ***REMOVED***

          let die = twilight_self.rollDice(6);

          if (die >= target) {

            if (player == "us") {
              twilight_self.addMove("place\tus\tus\tiraq\t"+twilight_self.countries['iraq'].ussr);
              twilight_self.addMove("remove\tus\tussr\tiraq\t"+twilight_self.countries['iraq'].ussr);
              twilight_self.addMove("milops\tus\t2");
              twilight_self.addMove("vp\tus\t2");
              twilight_self.placeInfluence("iraq", twilight_self.countries['iraq'].ussr, "us");
              twilight_self.removeInfluence("iraq", twilight_self.countries['iraq'].ussr, "ussr");
              twilight_self.endTurn();
              twilight_self.showInfluence("iraq", "ussr");
        ***REMOVED*** else {
              twilight_self.addMove("place\tus\tussr\tiraq\t"+twilight_self.countries['iraq'].us);
              twilight_self.addMove("remove\tus\tus\tiraq\t"+twilight_self.countries['iraq'].us);
              twilight_self.addMove("milops\tussr\t2");
              twilight_self.addMove("vp\tussr\t2");
              twilight_self.placeInfluence("iraq", twilight_self.countries['iraq'].us, "ussr");
              twilight_self.removeInfluence("iraq", twilight_self.countries['iraq'].us, "us");
              twilight_self.endTurn();
              twilight_self.showInfluence("iraq", "ussr");
        ***REMOVED***
      ***REMOVED*** else {

            if (player == "us") {
              twilight_self.addMove("milops\tus\t2");
              if (twilight_self.game.state.events.flowerpower == 1) {
                twilight_self.addMove("vp\tussr\t2\t1");
          ***REMOVED***
              twilight_self.endTurn();
        ***REMOVED*** else {
              twilight_self.addMove("milops\tussr\t2");
              if (twilight_self.game.state.events.flowerpower == 1) {
                twilight_self.addMove("vp\tussr\t2\t1");
          ***REMOVED***
              twilight_self.endTurn();
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***);
***REMOVED***
    return 0;
  ***REMOVED***




  //
  // Tear Down This Wall
  //
  if (card === "teardown") {

    this.game.state.events.teardown = 1;
    this.game.state.events.willybrandt = 0;
    if (this.game.state.events.nato == 1) {
      this.game.state.events.nato_westgermany = 1;
***REMOVED***

    this.countries["eastgermany"].us += 3;
    this.showInfluence("eastgermany", "us");

    if (this.game.player == 2) {
      this.addMove("resolve\tteardown");
      this.addMove("teardownthiswall\tus");
      this.endTurn();
***REMOVED***

    return 0;
  ***REMOVED***




  //
  // Chernobyl
  //
  if (card == "chernobyl") {

    if (this.game.player == 1) {
      this.updateStatus("US is playing Chernobyl");
      return 0;
***REMOVED***

    let html = "<span>Chernobyl triggered. Designate region to prohibit USSR placement of influence from OPS: </span><p></p><ul>";
        html += '<li class="card" id="asia">Asia</li>';
        html += '<li class="card" id="europe">Europe</li>';
        html += '<li class="card" id="africa">Africa</li>';
        html += '<li class="card" id="camerica">Central America</li>';
        html += '<li class="card" id="samerica">South America</li>';
        html += '<li class="card" id="mideast">Middle-East</li>';
        html += '</ul>';

    this.updateStatus(html);

    let twilight_self = this;

    $('.card').off();
    $('.card').on('click', function() {

      let action2 = $(this).attr("id");

      twilight_self.addMove("resolve\tchernobyl");
      twilight_self.addMove("chernobyl\t"+action2);
      twilight_self.addMove("notify\tUS restricts placement in "+action2);
      twilight_self.endTurn();

***REMOVED***);

    return 0;
  ***REMOVED***




  //
  // Aldrich Ames Remix
  //
  if (card == "aldrichames") {

    this.game.state.events.aldrich = 1;

    if (this.game.player == 1) {
      this.updateStatus("US is revealing its cards to USSR");
      return 0;
***REMOVED***
    if (this.game.player == 2) {

      this.updateStatus("USSR is playing Aldrich Ames");

      this.addMove("resolve\taldrichames");

      let cards_to_reveal = this.game.deck[0].hand.length;
      for (let i = 0; i < this.game.deck[0].hand.length; i++) {
        if (this.game.deck[0].hand[i] === "china") { cards_to_reveal--; ***REMOVED***
        else {
          this.addMove(this.game.deck[0].hand[i]);
    ***REMOVED***
  ***REMOVED***
      this.addMove("aldrich\tus\t"+cards_to_reveal);
      this.endTurn();

***REMOVED***
    return 0;
  ***REMOVED***



  //
  // Solidarity
  //
  if (card == "solidarity") {
    if (this.game.state.events.johnpaul == 1) {
      this.placeInfluence("poland", 3, "us");
***REMOVED***
    return 1;
  ***REMOVED***




  //
  // Star Wars
  //
  if (card == "starwars") {

    if (this.game.state.space_race_us <= this.game.state.space_race_ussr) {
      this.updateLog("US is not ahead of USSR in the space race");
      return 1;
***REMOVED***

    this.game.state.events.starwars = 1;

    // otherwise sort through discards
    let discardlength = 0;
    for (var i in this.game.deck[0].discards) { discardlength++; ***REMOVED***
    if (discardlength == 0) {
      this.updateLog("No cards in discard pile");
      return 1;
***REMOVED***

    if (this.game.player == 1) {
      updateStatus("Opponent retrieving event from discard pile");
      return 0;
***REMOVED***


    var twilight_self = this;

    this.addMove("resolve\tstarwars");


    let user_message = "Choose card to reclaim: <p></p><ul>";
    for (var i in this.game.deck[0].discards) {
      if (this.game.state.headline == 1 && i == "unintervention") {***REMOVED*** else {
        if (this.game.deck[0].cards[i] != undefined) {
          if (this.game.deck[0].cards[i].name != undefined) {
            if (this.game.deck[0].cards[i].scoring != 1) {
              user_message += '<li class="card showcard" id="'+i+'">'+this.game.deck[0].cards[i].name+'</li>';
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    user_message += '</li>';
    twilight_self.updateStatus(user_message);

    $('.card').off();
    twilight_self.addShowCardEvents();
    $('.card').on('click', function() {

      let action2 = $(this).attr("id");

      if (twilight_self.app.browser.isMobileBrowser(navigator.userAgent)) {
        twilight_self.mobileCardSelect(card, player, function() {
          twilight_self.addMove("event\tus\t"+action2);
          twilight_self.addMove("notify\t"+player+" retrieved "+twilight_self.game.deck[0].cards[action2].name);
          twilight_self.endTurn();
    ***REMOVED***, "play event");
        return 0;
  ***REMOVED***

      twilight_self.addMove("event\tus\t"+action2);
      twilight_self.addMove("notify\t"+player+" retrieved "+twilight_self.game.deck[0].cards[action2].name);
      twilight_self.endTurn();

***REMOVED***);

    return 0;
  ***REMOVED***




  //
  // Iran-Contra Scandal
  //
  if (card == "irancontra") {
    this.game.state.events.irancontra = 1;
    return 1;
  ***REMOVED***




  //
  // Yuri and Samantha
  //
  if (card == "yuri") {
    this.game.state.events.yuri = 1;
    return 1;
  ***REMOVED***





  //
  // Wargames
  //
  if (card == "wargames") {

    if (this.game.state.defcon != 2) {
      this.updateLog("Wargames event cannot trigger as DEFCON is not at 2");
      return 1;
***REMOVED***

    let twilight_self = this;
    let player_to_go = 1;
    if (player == "us") { player_to_go = 2; ***REMOVED***

    let choicehtml = '<span>Wargames triggers. Do you want to give your opponent 6 VP and End the Game? (VP ties will be won by opponents)</span><p></p><ul><li class="card" id="endgame">end the game</li><li class="card" id="cont">continue playing</li></ul>';

    if (player_to_go == this.game.player) {
      this.updateStatus(choicehtml);
***REMOVED*** else {
      this.updateStatus("Opponent deciding whether to trigger Wargames...");
      return 0;
***REMOVED***

    $('.card').off();
    $('.card').on('click', function() {
      let action2 = $(this).attr("id");
      if (action2 == "endgame") {
        twilight_self.updateStatus("Triggering Wargames...");
        twilight_self.addMove("resolve\twargames");
        twilight_self.addMove("wargames\t"+player+"\t1");
        twilight_self.endTurn();
  ***REMOVED***
      if (action2 == "cont") {
        twilight_self.updateStatus("Discarding Wargames...");
        twilight_self.addMove("resolve\twargames");
        twilight_self.addMove("wargames\t"+player+"\t0");
        twilight_self.endTurn();
  ***REMOVED***
***REMOVED***);

    return 0;
  ***REMOVED***




  //
  // An Evil Empire
  //
  if (card == "evilempire") {

    this.game.state.events.evilempire = 1;
    this.game.state.events.flowerpower = 0;

    this.game.state.vp += 1;
    this.updateVictoryPoints();

    return 1;

  ***REMOVED***




  //
  // The Iron Lady
  //
  if (card == "ironlady") {

    this.game.state.vp += 1;
    this.updateVictoryPoints();

    //
    // keep track of whether the USSR has influence in Argentina in order
    // to know whether it can place there or beside Argentina if it plays
    // ops after the event, and uses the US event to get influence into the
    // country..
    //
    this.game.state.ironlady_before_ops = 1;

    this.placeInfluence("argentina", 1, "ussr");
    if (this.countries["uk"].ussr > 0) { this.removeInfluence("uk", this.countries["uk"].ussr, "ussr"); ***REMOVED***

    this.game.state.events.ironlady = 1;

    return 1;
  ***REMOVED***




  //
  // Reagan Bombs Libya
  //
  if (card == "reagan") {

    let us_vp = 0;
    let x = this.countries["libya"].ussr;

    if (x >= 2) {
      while (x > 1) {
        x -= 2;
        us_vp++;
  ***REMOVED***
      this.updateLog("<span>Reagan bombs Libya and US scores</span> "+us_vp+" <span>VP</span>");
      this.game.state.vp += us_vp;
      this.updateVictoryPoints();
***REMOVED***

    return 1;
  ***REMOVED***






  //
  // Soviets Shoot Down KAL-007
  //
  if (card == "KAL007") {

    this.game.state.vp += 2;
    this.updateVictoryPoints();

    this.lowerDefcon();

    if (this.isControlled("us", "southkorea") == 1) {
      this.addMove("resolve\tKAL007");
      this.addMove("unlimit\tcoups");
      this.addMove("ops\tus\tKAL007\t4");
      this.addMove("limit\tcoups");
      this.endTurn();
      return 0;
***REMOVED*** else {
      return 1;
***REMOVED***

  ***REMOVED***




  //
  // Pershing II Deployed
  //
  if (card == "pershing") {

    if (this.game.player == 2) {
      this.updateStatus("USSR playing Pershing II Deployed");
      return 0;
***REMOVED***
    if (this.game.player == 1) {

      this.updateStatus("Remove 3 US influence from Western Europe (max 1 per country)");

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();

      twilight_self.addMove("resolve\tpershing");
      twilight_self.addMove("vp\tussr\t1");

      let valid_targets = 0;
      for (var i in this.countries) {
        let countryname  = i;
        let divname      = '#'+i;
        if (twilight_self.countries[countryname].us > 0) {
          valid_targets++;
    ***REMOVED***
  ***REMOVED***

      if (valid_targets == 0) {
        twilight_self.addMove("notify\tUS does not have any targets for Pershing II");
        twilight_self.endTurn();
        return;
  ***REMOVED***

      var ops_to_purge = 3;
      if (valid_targets < ops_to_purge) { ops_to_purge = valid_targets; ***REMOVED***

      for (var i in this.countries) {

        let countryname  = i;
        let divname      = '#'+i;

        if (countryname == "turkey" ||
            countryname == "greece" ||
            countryname == "spain" ||
            countryname == "italy" ||
            countryname == "france" ||
            countryname == "canada" ||
            countryname == "uk" ||
            countryname == "benelux" ||
            countryname == "denmark" ||
            countryname == "austria" ||
            countryname == "norway" ||
            countryname == "sweden" ||
            countryname == "finland" ||
            countryname == "westgermany") {

          if (twilight_self.countries[countryname].us > 0) {

            twilight_self.countries[countryname].place = 1;
            $(divname).off();
            $(divname).on('click', function() {

                let c = $(this).attr('id');

              if (twilight_self.countries[c].place != 1) {
                twilight_self.displayModal("Invalid Country");
          ***REMOVED*** else {
                twilight_self.countries[c].place = 0;
                twilight_self.removeInfluence(c, 1, "us", function() {
                  twilight_self.addMove("remove\tussr\tus\t"+c+"\t1");
                  ops_to_purge--;
                  if (ops_to_purge == 0) {
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
              ***REMOVED***
            ***REMOVED***);
          ***REMOVED***
        ***REMOVED***);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    return 0;
  ***REMOVED***




  //
  // Terrorism
  //
  if (card == "terrorism") {

    let cards_to_discard = 1;
    let target = "ussr";
    let twilight_self = this;

    if (player == "ussr") { target = "us"; ***REMOVED***
    if (target == "us") { if (this.game.state.events.iranianhostage == 1) { cards_to_discard = 2; ***REMOVED*** ***REMOVED***

    this.addMove("resolve\tterrorism");

    if (this.game.player == 2 && target == "us") {

      let available_cards = this.game.deck[0].hand.length;
      for (let z = 0; z < this.game.deck[0].hand.length; z++) {
        if (this.game.deck[0].hand[z] == "china") { available_cards--; ***REMOVED***
  ***REMOVED***
      if (available_cards < cards_to_discard) { cards_to_discard = available_cards; ***REMOVED***

      if (cards_to_discard == 0) { this.addMove("notify\tUS has no cards to discard"); ***REMOVED***


      for (let i = 0; i < cards_to_discard; i++) {
        this.rollDice(twilight_self.game.deck[0].hand.length, function(roll) {
          roll = parseInt(roll)-1;
          let card = twilight_self.game.deck[0].hand[roll];

          if (card == "china") {
            if (roll-2 >= 0) { card = twilight_self.game.deck[0].hand[roll-2]; ***REMOVED*** else {
              card = twilight_self.game.deck[0].hand[roll];
        ***REMOVED***
      ***REMOVED***

          twilight_self.removeCardFromHand(card);
          twilight_self.addMove("dice\tburn\tussr");
          twilight_self.addMove("discard\tus\t"+card);
            twilight_self.addMove("notify\t"+target.toUpperCase()+" discarded "+twilight_self.game.deck[0].cards[card].name);
    ***REMOVED***);
  ***REMOVED***
      twilight_self.endTurn();
***REMOVED***
    if (this.game.player == 1 && target == "ussr") {

      let available_cards = this.game.deck[0].hand.length;
      for (let z = 0; z < this.game.deck[0].hand.length; z++) {
        if (this.game.deck[0].hand[z] == "china") { available_cards--; ***REMOVED***
  ***REMOVED***
      if (available_cards < cards_to_discard) { cards_to_discard = available_cards; ***REMOVED***

      if (cards_to_discard == 0) { this.addMove("notify\tUSSR has no cards to discard"); this.endTurn(); return 0; ***REMOVED***
      this.rollDice(twilight_self.game.deck[0].hand.length, function(roll) {
          roll = parseInt(roll)-1;
          let card = twilight_self.game.deck[0].hand[roll];

          if (card == "china") {
            if (roll-2 >= 0) { card = twilight_self.game.deck[0].hand[roll-2]; ***REMOVED*** else {
              card = twilight_self.game.deck[0].hand[roll];
        ***REMOVED***
      ***REMOVED***

          twilight_self.removeCardFromHand(card);
          twilight_self.addMove("dice\tburn\tus");
          twilight_self.addMove("discard\tussr\t"+card);
            twilight_self.addMove("notify\t"+target.toUpperCase()+" discarded "+twilight_self.game.deck[0].cards[card].name);
          twilight_self.endTurn();
  ***REMOVED***);
***REMOVED***

    return 0;
  ***REMOVED***









  //
  // Glasnost
  //
  if (card == "glasnost") {

    let twilight_self = this;

    this.game.state.defcon += 1;
    if (this.game.state.defcon > 5) { this.game.state.defcon = 5; ***REMOVED***
    this.game.state.vp -= 2;
    this.updateDefcon();
    this.updateVictoryPoints();

    this.updateLog("DEFCON increases by 1 point");
    this.updateLog("USSR gains 2 VP");

    if (this.game.state.events.reformer == 1) {
      this.addMove("resolve\tglasnost");
      this.addMove("unlimit\tcoups");
      this.addMove("ops\tussr\tglasnost\t4");
      this.addMove("limit\tcoups");
      this.addMove("notify\tUSSR plays 4 OPS for influence or realignments");
      this.endTurn();
***REMOVED*** else {
      return 1;
***REMOVED***

    return 0;
  ***REMOVED***




  //
  // The Reformer
  //
  if (card == "reformer") {

    this.game.state.events.reformer = 1;

    if (this.game.player == 2) {
      this.updateStatus("Waiting for USSR to play The Reformer");
      return 0;
***REMOVED***
    if (this.game.player == 1) {

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();

      let influence_to_add = 4;
      if (this.game.state.vp < 0) { influence_to_add = 6; ***REMOVED***

      this.addMove("resolve\treformer");
      this.updateStatus('Add</span> '+influence_to_add+' <span>influence in Europe (max 2 per country)');

      var ops_to_place = influence_to_add;
      var ops_placed = {***REMOVED***;
      for (var i in twilight_self.countries) {

        let countryname  = i;
        ops_placed[countryname] = 0;
        let divname      = '#'+i;

        if (this.countries[countryname].region == "europe") {

          this.countries[countryname].place = 1;

          $(divname).off();
          $(divname).on('click', function() {

             let c = $(this).attr('id');

            if (twilight_self.countries[c].place != 1) {
              twilight_self.displayModal("Invalid Placement");
        ***REMOVED*** else {
              ops_placed[c]++;
              twilight_self.placeInfluence(c, 1, "ussr", function() {
                twilight_self.addMove("place\tussr\tussr\t"+c+"\t1");
                if (ops_placed[c] >= 2) { twilight_self.countries[c].place = 0; ***REMOVED***
                ops_to_place--;
                if (ops_to_place == 0) {
                  twilight_self.playerFinishedPlacingInfluence();
                  twilight_self.endTurn();
            ***REMOVED***
          ***REMOVED***);
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***
      return 0;
***REMOVED***

    return 1;
  ***REMOVED***



  //
  // Ortega Elected in Nicaragua
  //
  if (card == "ortega") {

    let twilight_self = this;

    this.countries["nicaragua"].us = 0;
    this.showInfluence("nicaragua", "us");

    let can_coup = 0;

    if (this.countries["cuba"].us > 0) { can_coup = 1; ***REMOVED***
    if (this.countries["honduras"].us > 0) { can_coup = 1; ***REMOVED***
    if (this.countries["costarica"].us > 0) { can_coup = 1; ***REMOVED***

    if (can_coup == 0) {
      this.updateLog("notify\tUSSR does not have valid coup target");
      return 1;
***REMOVED***

    if (this.game.player == 1) {
      this.updateStatus("Pick a country adjacent to Nicaragua to coup: ");
***REMOVED*** else {
      this.updateStatus("USSR is selecting a country for its free coup");
      return 0;
***REMOVED***

    for (var i in twilight_self.countries) {

      let countryname  = i;
      let divname      = '#'+i;

      if (i == "costarica" || i == "cuba" || i == "honduras") {

        if (this.countries[i].us > 0) {

          $(divname).off();
          $(divname).on('click', function() {

            let c = $(this).attr('id');

            twilight_self.addMove("resolve\tortega");
            twilight_self.addMove("unlimit\tmilops");
            twilight_self.addMove("coup\tussr\t"+c+"\t2");
            twilight_self.addMove("limit\tmilops");
            twilight_self.addMove("notify\tUSSR launches coup in "+c);
            twilight_self.endTurn();

      ***REMOVED***);
    ***REMOVED***

  ***REMOVED*** else {

        $(divname).off();
        $(divname).on('click', function() {
          twilight_self.displayModal("Invalid Target");
    ***REMOVED***);

  ***REMOVED***
***REMOVED***

    return 0;
  ***REMOVED***















  //////////////////////////////
  // OPTIONQL COMMUNITY CARDS //
  //////////////////////////////

  //
  // Cultural Diplomacy
  //
  if (card == "culturaldiplomacy") {

    var twilight_self = this;
    twilight_self.playerFinishedPlacingInfluence();

    if ((player == "us" && this.game.player == 2) || (player == "ussr" && this.game.player == 1)) {

      twilight_self.addMove("resolve\tculturaldiplomacy");

      this.updateStatus("Place one influence two hops away from a country in which you have existing influence");

      for (var i in this.countries) {

        let countryname  = i;
        let divname      = '#'+i;

        $(divname).off();
        $(divname).on('click', function() {

          let is_this_two_hops = 0;
          let selected_countryname = $(this).attr('id');

  	  let neighbours = twilight_self.countries[selected_countryname].neighbours;
	  for (let z = 0; z < neighbours.length; z++) {

	    let this_country = twilight_self.countries[selected_countryname].neighbours[z];
  	    let neighbours2  = twilight_self.countries[this_country].neighbours;

	    for (let zz = 0; zz < neighbours2.length; zz++) {
	      let two_hopper = neighbours2[zz];
	      if (player == "us") { if ( twilight_self.countries[two_hopper].us > 0) { is_this_two_hops = 1; ***REMOVED*** ***REMOVED***
	      if (player == "ussr") { if ( twilight_self.countries[two_hopper].ussr > 0) { is_this_two_hops = 1; ***REMOVED*** ***REMOVED***
	      if (is_this_two_hops == 1) { z = 100; zz = 100; ***REMOVED***
	***REMOVED***
	  ***REMOVED***

	  if (is_this_two_hops == 1) {
            twilight_self.addMove("place\t"+player+"\t"+player+"\t"+selected_countryname+"\t1");
            twilight_self.placeInfluence(selected_countryname, 1, player, function() {
              twilight_self.playerFinishedPlacingInfluence();
              twilight_self.endTurn();
        ***REMOVED***);
      ***REMOVED*** else {
      // alert("invalid target");
      twilight_self.displayModal("Invalid Target");
	  ***REMOVED***
    ***REMOVED***);
  ***REMOVED***
***REMOVED*** else {
      this.updateLog("Opponent is launching a soft-power tour");
***REMOVED***

    return 0;
  ***REMOVED***


  //
  // Handshake in Space
  //
  if (card == "handshake") {
    if (player == "us") {
      this.updateLog("USSR advances in the Space Race...");
      this.game.state.space_race_ussr += 1;
      this.updateSpaceRace();
***REMOVED*** else {
      this.updateLog("US advances in the Space Race...");
      this.game.state.space_race_us += 1;
      this.updateSpaceRace();
***REMOVED***
    return 1;
  ***REMOVED***



  //
  // Rust Lands in Red Square -- credit https://www.reddit.com/user/paul_thomas84/
  //
  if (card == "rustinredsquare") {
    this.updateLog("DEFCON increases by 1");
    this.updateLog("USSR milops reset to 0");
    this.game.state.defcon++;
    this.game.state.milops_ussr = 0;
    this.updateDefcon();
    this.updateMilitaryOperations();
    return 1;
  ***REMOVED***



  //
  // Gouzenko Affair -- credit https://www.reddit.com/user/ludichrisness/
  //
  if (card == "gouzenkoaffair") {
    this.updateLog("Canada now permanently adjacent to USSR");
    this.game.countries['canada'].ussr += 2;
    this.game.state.events.optional.gouzenkoaffair = 1;
    this.showInfluence("canada", "ussr");
    return 1;
  ***REMOVED***




  //
  // Berlin Agreement -- credit https://www.reddit.com/user/mlhermann/
  //
  if (card == "berlinagreement") {

    this.game.state.events.optional.berlinagreement = 1;

    let twilight_self = this;

    let me = "ussr";
    let opponent = "us";
    if (this.game.player == 2) { opponent = "ussr"; me = "us"; ***REMOVED***

    this.game.countries['eastgermany'].us += 2;
    this.game.countries['westgermany'].ussr += 2;

    this.showInfluence("eastgermany", "us");
    this.showInfluence("westgermany", "ussr");

    let ops_to_place = 1;
    let placeable = [];

    for (var i in twilight_self.countries) {
      let countryname  = i;
      let us_predominates = 0;
      let ussr_predominates = 0;
      if (this.countries[countryname].region == "europe") {
        if (this.countries[countryname].us > this.countries[countryname].ussr) { us_predominates = 1; ***REMOVED***
        if (this.countries[countryname].us < this.countries[countryname].ussr) { ussr_predominates = 1; ***REMOVED***
	if (player == "us" && us_predominates == 1) { placeable.push(countryname); ***REMOVED***
	if (player == "ussr" && ussr_predominates == 1) { placeable.push(countryname); ***REMOVED***
  ***REMOVED***
***REMOVED***
 
    if (placeable.length == 0) {
      this.updateLog(player + " cannot place 1 additional OP");
      return 1;
***REMOVED*** else {

      if (player == opponent) { 
	this.updateStatus("Opponent is placing 1 influence in a European country in which they have a predominance of influence");
	return 0; 
  ***REMOVED***

      this.addMove("resolve\tberlinagreement");
      this.updateStatus("Place 1 influence in a European country in which you have a predominance of influence");

      for (let i = 0; i < placeable.length; i++) {

        let countryname = placeable[i];
        let divname = "#"+placeable[i];

        this.game.countries[placeable[i]].place = 1;

        $(divname).off();
        $(divname).on('click', function() {

          twilight_self.placeInfluence(countryname, 1, player, function() {
            twilight_self.addMove("place\t"+player+"\t"+player+"\t"+countryname+"\t1");
            twilight_self.playerFinishedPlacingInfluence();
            twilight_self.endTurn();
      ***REMOVED***);

	***REMOVED***);

  ***REMOVED***

***REMOVED***

    return 0;
  ***REMOVED***








  //
  // return 0 so other cards do not trigger infinite loop
  //
  return 0;
***REMOVED***




isControlled(player, country) {

  if (this.countries[country] == undefined) { return 0; ***REMOVED***

  let country_lead = 0;

  if (player == "ussr") {
    country_lead = parseInt(this.countries[country].ussr) - parseInt(this.countries[country].us);
  ***REMOVED***
  if (player == "us") {
    country_lead = parseInt(this.countries[country].us) - parseInt(this.countries[country].ussr);
  ***REMOVED***

  if (this.countries[country].control <= country_lead) { return 1; ***REMOVED***
  return 0;

***REMOVED***



returnOpsOfCard(card="", deck=0) {
  if (this.game.deck[deck].cards[card] != undefined) {
    return this.game.deck[deck].cards[card].ops;
  ***REMOVED***
  if (this.game.deck[deck].discards[card] != undefined) {
    return this.game.deck[deck].discards[card].ops;
  ***REMOVED***
  if (this.game.deck[deck].removed[card] != undefined) {
    return this.game.deck[deck].removed[card].ops;
  ***REMOVED***
  if (card == "china") { return 4; ***REMOVED***
  return 1;
***REMOVED***



returnArrayOfRegionBonuses(card="") {

  let regions = [];

  //
  // Vietnam Revolts
  //
  if (this.game.state.events.vietnam_revolts == 1 && this.game.state.events.vietnam_revolts_eligible == 1 && this.game.player == 1) {

    //
    // Vietnam Revolts does not give bonus to 1 OP card in SEA if USSR Red Purged
    // https://boardgamegeek.com/thread/1136951/red-scarepurge-and-vietnam-revolts
    let pushme = 1;
    if (card != "") { 
      if (this.game.state.events.redscare_player1 == 1) {
        if (this.returnOpsOfCard(card) == 1) { pushme = 0; ***REMOVED*** 
  ***REMOVED***
***REMOVED***
    if (pushme == 1) {
      regions.push("seasia");
***REMOVED***
  ***REMOVED***

  //
  // The China Card
  //
  if (this.game.state.events.china_card_in_play == 1 && this.game.state.events.china_card_eligible == 1) {
    regions.push("asia");
  ***REMOVED***

  return regions;

***REMOVED***



isRegionBonus(card="") {

  //
  // Vietnam Revolts
  //
  if (this.game.state.events.vietnam_revolts == 1 && this.game.state.events.vietnam_revolts_eligible == 1 && this.game.player == 1) {

    //
    // Vietnam Revolts does not give bonus to 1 OP card in SEA if USSR Red Purged
    // https://boardgamegeek.com/thread/1136951/red-scarepurge-and-vietnam-revolts
    if (card != "") { if (this.returnOpsOfCard(card) == 1 && this.game.state.events.redscare_player1 == 1) { return 0; ***REMOVED*** ***REMOVED***

    this.updateStatus("Extra 1 OP Available for Southeast Asia");
    this.game.state.events.region_bonus = "seasia";
    return 1;
  ***REMOVED***

  //
  // The China Card
  //
  if (this.game.state.events.china_card_in_play == 1 && this.game.state.events.china_card_eligible == 1) {

    this.updateStatus("Extra 1 OP Available for Asia");
    this.game.state.events.region_bonus = "asia";
    return 1;
  ***REMOVED***
  return 0;
***REMOVED***




endRegionBonus() {
  if (this.game.state.events.vietnam_revolts_eligible == 1 && this.game.state.events.vietnam_revolts == 1) {
    this.game.state.events.vietnam_revolts_eligible = 0;
    return;
  ***REMOVED***
  if (this.game.state.events.china_card_eligible == 1) {
    this.game.state.events.china_card_eligible = 0;
    return;
  ***REMOVED***
***REMOVED***


limitToRegionBonus() {
  for (var i in this.countries) {
    if (this.countries[i].region.indexOf(this.game.state.events.region_bonus) == -1) {
      let divname = '#'+i;
      $(divname).off();
***REMOVED*** else {

	let extra_bonus_available = 0;
	if (this.game.state.events.region_bonus == "seasia" && this.game.state.events.china_card_eligible == 1) {
	  extra_bonus_available = 1;
	***REMOVED***

	if (extra_bonus_available == 0) {
          if (this.game.player == 1) {

    ***REMOVED*** prevent breaking control
            if (this.isControlled("us", i) == 1) {
              let divname = '#'+i;
              $(divname).off();
	***REMOVED***
      ***REMOVED*** else {

    ***REMOVED*** prevent breaking control
            if (this.isControlled("ussr", i) == 1) {
              let divname = '#'+i;
              $(divname).off();
	***REMOVED***
	  ***REMOVED***
	***REMOVED***
  ***REMOVED***

  ***REMOVED***
  return;
***REMOVED***



modifyOps(ops,card="",playernum=0, updatelog=1) {

  if (playernum == 0) { playernum = this.game.player; ***REMOVED***

  if (card == "olympic" && ops == 4) {***REMOVED*** else {
    if (card != "") { ops = this.returnOpsOfCard(card); ***REMOVED***
  ***REMOVED***

  if (this.game.state.events.brezhnev == 1 && playernum == 1) {
    if (updatelog == 1) {
      this.updateLog("USSR gets Brezhnev bonus +1");
***REMOVED***
    ops++;
  ***REMOVED***
  if (this.game.state.events.containment == 1 && playernum == 2) {
    if (updatelog == 1) {
      this.updateLog("US gets Containment bonus +1");
***REMOVED***
    ops++;
  ***REMOVED***
  if (this.game.state.events.redscare_player1 == 1 && playernum == 1) {
    if (updatelog == 1) {
      this.updateLog("USSR is affected by Red Purge");
***REMOVED***
    ops--;
  ***REMOVED***
  if (this.game.state.events.redscare_player2 == 1 && playernum == 2) {
    if (updatelog == 1) {
      this.updateLog("US is affected by Red Scare");
***REMOVED***
    ops--;
  ***REMOVED***
  if (ops <= 0) { return 1; ***REMOVED***
  if (ops >= 4) { return 4; ***REMOVED***
  return ops;
***REMOVED***



finalScoring() {

  //
  // disable shuttle diplomacy
  //
  this.game.state.events.shuttlediplomacy = 0;

  //
  //
  //
  if (this.whoHasTheChinaCard() == "ussr") { 
    this.game.state.vp--;
    this.updateLog("USSR receives 1 VP for the China Card");
    if (this.game.state.vp <= -20) {
      this.endGame("ussr", "victory points");
      return;
***REMOVED***
  ***REMOVED*** else {
    this.game.state.vp++;
    this.updateLog("US receives 1 VP for the China Card");
    if (this.game.state.vp >= 20) {
      this.endGame("us", "victory points");
      return;
***REMOVED***
  ***REMOVED***



  this.scoreRegion("europe");
  this.scoreRegion("asia");
  this.scoreRegion("mideast");
  this.scoreRegion("africa");
  this.scoreRegion("southamerica");
  this.scoreRegion("centralamerica");

  this.updateVictoryPoints();

  if (this.game.state.vp < 0) {
    this.endGame("ussr", "final scoring");
  ***REMOVED*** else {
    this.endGame("us", "final scoring");
  ***REMOVED***

  return 1;
***REMOVED***



calculateControlledBattlegroundCountries(scoring, bg_countries) {
  for (var [player, side] of Object.entries(scoring)) {
    for (var country of bg_countries) {
      if (this.isControlled(player, country) == 1) { side.bg++; ***REMOVED***
***REMOVED***
  ***REMOVED***
  return scoring;
***REMOVED***

calculateControlledCountries(scoring, countries) {
  for (var [player, side] of Object.entries(scoring)) {
    for (var country of countries) {
      if (this.isControlled(player, country) == 1) { side.total++ ***REMOVED***;
***REMOVED***
  ***REMOVED***
  return scoring;
***REMOVED***

determineRegionVictor(scoring, region_scoring_range, max_bg_num) {
  if (scoring.us.bg == max_bg_num && scoring.us.total > scoring.ussr.total) { scoring.us.vp = region_scoring_range.control; ***REMOVED***
  else if (scoring.us.bg > scoring.ussr.bg && scoring.us.total > scoring.us.bg && scoring.us.total > scoring.ussr.total) { scoring.us.vp = region_scoring_range.domination; ***REMOVED***
  else if (scoring.us.total > 0) { scoring.us.vp = region_scoring_range.presence; ***REMOVED***

  if (scoring.ussr.bg == max_bg_num && scoring.ussr.total > scoring.us.total) { scoring.ussr.vp = region_scoring_range.control; ***REMOVED***
  else if (scoring.ussr.bg > scoring.us.bg && scoring.ussr.total > scoring.ussr.bg && scoring.ussr.total > scoring.us.total) { scoring.ussr.vp = region_scoring_range.domination; ***REMOVED***
  else if (scoring.ussr.total > 0) { scoring.ussr.vp = region_scoring_range.presence; ***REMOVED***

  scoring.us.vp = scoring.us.vp + scoring.us.bg;
  scoring.ussr.vp = scoring.ussr.vp + scoring.ussr.bg;

  return scoring;
***REMOVED***

calculateScoring(region) {

  var scoring = {
    us: {total: 0, bg: 0, vp: 0***REMOVED***,
    ussr: {total: 0, bg: 0, vp: 0***REMOVED***,
  ***REMOVED***

  switch (region) {

    ////////////
    // EUROPE //
    ////////////
    case "europe":
      let eu_bg_countries = ["italy", "france", "westgermany", "eastgermany", "poland"];
      let eu_countries = [
        "spain",
        "greece",
        "turkey",
        "yugoslavia",
        "bulgaria",
        "austria",
        "romania",
        "hungary",
        "czechoslovakia",
        "benelux",
        "uk",
        "canada",
        "norway",
        "denmark",
        "sweden",
        "finland",
      ];
      let eu_scoring_range = {presence: 3, domination: 7, control: 10000 ***REMOVED***;

      scoring = this.calculateControlledBattlegroundCountries(scoring, eu_bg_countries);
      scoring.us.total = scoring.us.bg;
      scoring.ussr.total = scoring.ussr.bg;
      scoring = this.calculateControlledCountries(scoring, eu_countries);
      scoring = this.determineRegionVictor(scoring, eu_scoring_range, eu_bg_countries.length);

      //
      // neighbouring countries
      //
      if (this.isControlled("us", "finland") == 1) { scoring.us.vp++; ***REMOVED***
      if (this.isControlled("us", "romania") == 1) { scoring.us.vp++; ***REMOVED***
      if (this.isControlled("us", "poland") == 1) { scoring.us.vp++; ***REMOVED***
      if (this.isControlled("ussr", "canada") == 1) { scoring.ussr.vp++; ***REMOVED***
      break;


    /////////////
    // MIDEAST //
    /////////////
    case "mideast":
      let me_bg_countries = [
        "libya",
        "egypt",
        "israel",
        "iraq",
        "iran",
        "saudiarabia"
      ];

      let me_countries = [
        "lebanon",
        "syria",
        "jordan",
        "gulfstates",
      ];
      let me_scoring_range = { presence: 3, domination: 5, control: 7 ***REMOVED***;

      // pseudo function to calculate control
      scoring = this.calculateControlledBattlegroundCountries(scoring, me_bg_countries);
      scoring.us.total = scoring.us.bg;
      scoring.ussr.total = scoring.ussr.bg;
      scoring = this.calculateControlledCountries(scoring, me_countries);

      //
      // Shuttle Diplomacy
      //
      if (this.game.state.events.shuttlediplomacy == 1) {
        if (scoring.ussr.bg > 0) {
          scoring.ussr.bg--;
          scoring.ussr.total--;
    ***REMOVED***
        this.game.state.events.shuttlediplomacy = 0;
  ***REMOVED***

      scoring = this.determineRegionVictor(scoring, me_scoring_range, me_bg_countries.length);

      // scoring transform
      break;


    /////////////
    // SE ASIA //
    /////////////
    case "seasia":
      let seasia_countries = [
        "burma",
        "laos",
        "vietnam",
        "malaysia",
        "philippines",
        "indonesia",
        "thailand",
      ];

      for (var [player, side] of Object.entries(scoring)) {
        for (country of seasia_countries) {
          if (this.isControlled(player, country) == 1) { country == "thailand" ? side.bg+=2 : side.bg++; ***REMOVED***
    ***REMOVED***
  ***REMOVED***

      scoring.us.vp = scoring.us.vp + scoring.us.bg;
      scoring.ussr.vp = scoring.ussr.vp + scoring.ussr.bg;
      break;
    case "africa":
      let af_bg_countries = [
        "algeria",
        "nigeria",
        "zaire",
        "angola",
        "southafrica",
      ];

      let af_countries = [
        "morocco",
        "tunisia",
        "westafricanstates",
        "saharanstates",
        "sudan",
        "ivorycoast",
        "ethiopia",
        "somalia",
        "cameroon",
        "kenya",
        "seafricanstates",
        "zimbabwe",
        "botswana",
      ];
      let af_scoring_range = {presence: 1, domination: 4, control: 6 ***REMOVED***;

      scoring = this.calculateControlledBattlegroundCountries(scoring, af_bg_countries);
      scoring.us.total = scoring.us.bg;
      scoring.ussr.total = scoring.ussr.bg;
      scoring = this.calculateControlledCountries(scoring, af_countries);
      scoring = this.determineRegionVictor(scoring, af_scoring_range, af_bg_countries.length);

      break;

    /////////////////////
    // CENTRAL AMERICA //
    /////////////////////
    case "centralamerica":
      let ca_bg_countries = [
        "mexico",
        "cuba",
        "panama",
      ];

      let ca_countries = [
        "guatemala",
        "elsalvador",
        "honduras",
        "costarica",
        "nicaragua",
        "haiti",
        "dominicanrepublic",
      ];
      let ca_scoring_range = {presence: 1, domination: 3, control: 5***REMOVED***;

      scoring = this.calculateControlledBattlegroundCountries(scoring, ca_bg_countries);
      scoring.us.total = scoring.us.bg;
      scoring.ussr.total = scoring.ussr.bg;
      scoring = this.calculateControlledCountries(scoring, ca_countries);
      scoring = this.determineRegionVictor(scoring, ca_scoring_range, ca_bg_countries.length);

      //
      // neighbouring countries
      //
      if (this.isControlled("ussr", "mexico") == 1) { scoring.ussr.vp++; ***REMOVED***
      if (this.isControlled("ussr", "cuba") == 1) { scoring.ussr.vp++; ***REMOVED***

      break;

    ///////////////////
    // SOUTH AMERICA //
    ///////////////////
    case "southamerica":
      let sa_bg_countries = [
        "venezuela",
        "brazil",
        "argentina",
        "chile",
      ];

      let sa_countries = [
        "colombia",
        "ecuador",
        "peru",
        "bolivia",
        "paraguay",
        "uruguay",
      ];
      let sa_scoring_range = {presence: 2, domination: 5, control: 6***REMOVED***;

      scoring = this.calculateControlledBattlegroundCountries(scoring, sa_bg_countries);
      scoring.us.total = scoring.us.bg;
      scoring.ussr.total = scoring.ussr.bg;
      scoring = this.calculateControlledCountries(scoring, sa_countries);
      scoring = this.determineRegionVictor(scoring, sa_scoring_range, sa_bg_countries.length);

      break;


    //////////
    // ASIA //
    //////////
    case "asia":
      let as_bg_countries = [
        "northkorea",
        "southkorea",
        "japan",
        "thailand",
        "india",
        "pakistan",
      ];

      let as_countries = [
        "afghanistan",
        "burma",
        "laos",
        "vietnam",
        "malaysia",
        "australia",
        "indonesia",
        "philippines",
      ];
      let as_scoring_range = {presence: 3, domination: 7, control: 9***REMOVED***;

      scoring = this.calculateControlledBattlegroundCountries(scoring, as_bg_countries);


      if (this.game.state.events.formosan == 1) {
        if (this.isControlled("us", "taiwan") == 1) { scoring.us.bg++; ***REMOVED***
  ***REMOVED***

      scoring.us.total = scoring.us.bg;
      scoring.ussr.total = scoring.ussr.bg;

      scoring = this.calculateControlledCountries(scoring, as_countries);


      if (this.game.state.events.formosan == 0) {
        if (this.isControlled("us", "taiwan") == 1) { scoring.us.total++; ***REMOVED***
        if (this.isControlled("ussr", "taiwan") == 1) { scoring.ussr.total++; ***REMOVED***
  ***REMOVED***

      //
      // Shuttle Diplomacy
      //
      if (this.game.state.events.shuttlediplomacy == 1) {
        if (scoring.ussr.bg > 0) {
          scoring.ussr.bg--;
          scoring.ussr.total--;
    ***REMOVED***
        this.game.state.events.shuttlediplomacy = 0;
  ***REMOVED***

      if (this.game.state.events.formosan == 1) {
        if (scoring.us.bg == 7 && scoring.us.total > scoring.ussr.total) { scoring.us.vp = 9; ***REMOVED***
        if (scoring.us.bg == 6 && scoring.us.total > scoring.ussr.total && this.isControlled("us", "taiwan") == 0) { scoring.us.vp = 9; ***REMOVED***
        if (scoring.ussr.bg == 6 && scoring.ussr.total > scoring.us.total) { vp_ussr = 9; ***REMOVED***
  ***REMOVED*** else {
        if (scoring.us.bg == 6 && scoring.us.total > scoring.ussr.total) { scoring.us.vp = 9; ***REMOVED***
        if (scoring.ussr.bg == 6 && scoring.ussr.total > scoring.us.total) { vp_ussr = 9; ***REMOVED***
  ***REMOVED***


      if (scoring.us.vp >= 9 && scoring.us.total > scoring.ussr.total) {***REMOVED***
      else if (scoring.us.bg > scoring.ussr.bg && scoring.us.total > scoring.us.bg && scoring.us.total > scoring.ussr.total) { scoring.us.vp = as_scoring_range.domination; ***REMOVED***
      else if (scoring.us.total > 0) { scoring.us.vp = as_scoring_range.presence; ***REMOVED***

      if (scoring.ussr.bg == 6 && scoring.ussr.total > scoring.us.total) { scoring.ussr.vp = 9; ***REMOVED***
      else if (scoring.ussr.bg > scoring.us.bg && scoring.ussr.total > scoring.ussr.bg && scoring.ussr.total > scoring.us.total) { scoring.ussr.vp = as_scoring_range.domination; ***REMOVED***
      else if (scoring.ussr.total > 0) { scoring.ussr.vp = as_scoring_range.presence; ***REMOVED***

      scoring.us.vp = scoring.us.vp + scoring.us.bg;
      scoring.ussr.vp = scoring.ussr.vp + scoring.ussr.bg;

      //
      // neighbouring countries
      //
      if (this.isControlled("us", "afghanistan") == 1) { scoring.us.vp++; ***REMOVED***
      if (this.isControlled("us", "northkorea") == 1) { scoring.us.vp++; ***REMOVED***
      if (this.isControlled("ussr", "japan") == 1) { scoring.ussr.vp++; ***REMOVED***

      break;
***REMOVED***
  return scoring;
***REMOVED***


scoreRegion(card) {

  let total_us = 0;
  let total_ussr = 0;
  let bg_us = 0;
  let bg_ussr = 0;
  let vp_us = 0;
  let vp_ussr = 0;

  ////////////
  // EUROPE //
  ////////////
  if (card == "europe") {

    if (this.isControlled("us", "italy") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "italy") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "france") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "france") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "westgermany") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "westgermany") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "eastgermany") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "eastgermany") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "poland") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "poland") == 1) { bg_ussr++; ***REMOVED***

    total_us = bg_us;
    total_ussr = bg_ussr;

    if (this.isControlled("us", "spain") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "spain") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "greece") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "greece") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "turkey") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "turkey") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "yugoslavia") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "yugoslavia") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "bulgaria") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "bulgaria") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "austria") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "austria") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "romania") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "romania") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "hungary") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "hungary") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "czechoslovakia") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "czechoslovakia") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "benelux") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "benelux") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "uk") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "uk") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "canada") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "canada") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "norway") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "norway") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "denmark") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "denmark") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "sweden") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "sweden") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "finland") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "finland") == 1) { total_ussr++; ***REMOVED***

    if (total_us > 0) { vp_us = 3; ***REMOVED***
    if (total_ussr> 0) { vp_ussr = 3; ***REMOVED***

    if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 7; ***REMOVED***
    if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 7; ***REMOVED***

    if (bg_us == 5 && total_us > total_ussr) { vp_us = 10000; ***REMOVED***
    if (bg_ussr == 5 && total_ussr > total_us) { vp_ussr = 10000; ***REMOVED***

    vp_us = vp_us + bg_us;
    vp_ussr = vp_ussr + bg_ussr;

    //
    // neighbouring countries
    //
    if (this.isControlled("us", "finland") == 1) { vp_us++; ***REMOVED***
    if (this.isControlled("us", "romania") == 1) { vp_us++; ***REMOVED***
    if (this.isControlled("us", "poland") == 1) { vp_us++; ***REMOVED***
    if (this.isControlled("ussr", "canada") == 1) { vp_ussr++; ***REMOVED***

    //
    // GOUZENKO AFFAIR -- early war optional
    //
    if (this.game.state.events.optional.gouzenkoaffair == 1) {
      if (this.isControlled("us", "canada") == 1) { vp_us++; ***REMOVED***  
***REMOVED***


    //
    // Report Adjustment
    //
    let vp_adjustment = vp_us - vp_ussr;
    this.game.state.vp += vp_adjustment;
    if (vp_adjustment > 9000 || vp_adjustment < -9000) { vp_adjustment = 'WIN' ***REMOVED***
    this.updateLog("<span>Europe: </span> " + vp_adjustment + " <span>VP</span>");

  ***REMOVED***



  /////////////////
  // MIDDLE EAST //
  /////////////////
  if (card == "mideast") {

    if (this.isControlled("us", "libya") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "libya") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "egypt") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "egypt") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "israel") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "israel") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "iraq") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "iraq") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "iran") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "iran") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "saudiarabia") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "saudiarabia") == 1) { bg_ussr++; ***REMOVED***

    total_us = bg_us;
    total_ussr = bg_ussr;

    if (this.isControlled("us", "lebanon") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "lebanon") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "syria") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "syria") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "jordan") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "jordan") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "gulfstates") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "gulfstates") == 1) { total_ussr++; ***REMOVED***

    //
    // Shuttle Diplomacy
    //
    if (this.game.state.events.shuttlediplomacy == 1) {
      if (bg_ussr > 0) {
        bg_ussr--;
        total_ussr--;
  ***REMOVED***
      this.game.state.events.shuttlediplomacy = 0;
***REMOVED***


    if (total_us > 0) { vp_us = 3; ***REMOVED***
    if (total_ussr> 0) { vp_ussr = 3; ***REMOVED***

    if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 5; ***REMOVED***
    if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 5; ***REMOVED***

    if (bg_us == 6 && total_us > total_ussr) { vp_us = 7; ***REMOVED***
    if (bg_ussr == 6 && total_ussr > total_us) { vp_ussr = 7; ***REMOVED***

    vp_us = vp_us + bg_us;
    vp_ussr = vp_ussr + bg_ussr;

    //
    // Report Adjustment
    //
    let vp_adjustment = vp_us - vp_ussr;
    this.game.state.vp += vp_adjustment;
    this.updateLog("<span>Middle-East:</span> " + vp_adjustment + " <span>VP</span>");

  ***REMOVED***



  ////////////////////
  // SOUTHEAST ASIA //
  ////////////////////
  if (card == "seasia") {

    vp_us = 0;
    vp_ussr = 0;

    if (this.isControlled("us", "burma") == 1) { vp_us++; ***REMOVED***
    if (this.isControlled("ussr", "burma") == 1) { vp_ussr++; ***REMOVED***
    if (this.isControlled("us", "laos") == 1) { vp_us++; ***REMOVED***
    if (this.isControlled("ussr", "laos") == 1) { vp_ussr++; ***REMOVED***
    if (this.isControlled("us", "vietnam") == 1) { vp_us++; ***REMOVED***
    if (this.isControlled("ussr", "vietnam") == 1) { vp_ussr++; ***REMOVED***
    if (this.isControlled("us", "malaysia") == 1) { vp_us++; ***REMOVED***
    if (this.isControlled("ussr", "malaysia") == 1) { vp_ussr++; ***REMOVED***
    if (this.isControlled("us", "philippines") == 1) { vp_us++; ***REMOVED***
    if (this.isControlled("ussr", "philippines") == 1) { vp_ussr++; ***REMOVED***
    if (this.isControlled("us", "indonesia") == 1) { vp_us++; ***REMOVED***
    if (this.isControlled("ussr", "indonesia") == 1) { vp_ussr++; ***REMOVED***
    if (this.isControlled("us", "thailand") == 1) { vp_us+=2; ***REMOVED***
    if (this.isControlled("ussr", "thailand") == 1) { vp_ussr+=2; ***REMOVED***

    vp_us = vp_us + bg_us;
    vp_ussr = vp_ussr + bg_ussr;

    //
    // Report Adjustment
    //
    let vp_adjustment = vp_us - vp_ussr;
    this.game.state.vp += vp_adjustment;
    this.updateLog("<span>Southeast Asia:</span> " + vp_adjustment + " <span>VP</span>");

  ***REMOVED***




  ////////////
  // AFRICA //
  ////////////
  if (card == "africa") {

    if (this.isControlled("us", "algeria") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "algeria") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "nigeria") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "nigeria") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "zaire") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "zaire") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "angola") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "angola") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "southafrica") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "southafrica") == 1) { bg_ussr++; ***REMOVED***

    total_us = bg_us;
    total_ussr = bg_ussr;

    if (this.isControlled("us", "morocco") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "morocco") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "tunisia") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "tunisia") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "westafricanstates") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "westafricanstates") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "saharanstates") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "saharanstates") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "sudan") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "sudan") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "ivorycoast") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "ivorycoast") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "ethiopia") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "ethiopia") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "somalia") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "somalia") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "cameroon") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "cameroon") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "kenya") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "kenya") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "seafricanstates") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "seafricanstates") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "zimbabwe") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "zimbabwe") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "botswana") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "botswana") == 1) { total_ussr++; ***REMOVED***

    if (total_us > 0) { vp_us = 1; ***REMOVED***
    if (total_ussr> 0) { vp_ussr = 1; ***REMOVED***

    if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 4; ***REMOVED***
    if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 4; ***REMOVED***

    if (bg_us == 5 && total_us > total_ussr) { vp_us = 6; ***REMOVED***
    if (bg_ussr == 5 && total_ussr > total_us) { vp_ussr = 6; ***REMOVED***

    vp_us = vp_us + bg_us;
    vp_ussr = vp_ussr + bg_ussr;

    //
    // Report Adjustment
    //
    let vp_adjustment = vp_us - vp_ussr;
    this.game.state.vp += vp_adjustment;
    this.updateLog("<span>Africa:</span> " + vp_adjustment + " <span>VP</span>");

  ***REMOVED***



  /////////////////////
  // CENTRAL AMERICA //
  /////////////////////
  if (card == "centralamerica") {

    if (this.isControlled("us", "mexico") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "mexico") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "cuba") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "cuba") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "panama") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "panama") == 1) { bg_ussr++; ***REMOVED***

    total_us = bg_us;
    total_ussr = bg_ussr;

    if (this.isControlled("us", "guatemala") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "guatemala") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "elsalvador") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "elsalvador") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "honduras") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "honduras") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "costarica") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "costarica") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "nicaragua") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "nicaragua") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "haiti") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "haiti") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "dominicanrepublic") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "dominicanrepublic") == 1) { total_ussr++; ***REMOVED***

    if (total_us > 0) { vp_us = 1; ***REMOVED***
    if (total_ussr > 0) { vp_ussr = 1; ***REMOVED***

    if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 3; ***REMOVED***
    if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 3; ***REMOVED***

    if (bg_us == 3 && total_us > total_ussr) { vp_us = 5; ***REMOVED***
    if (bg_ussr == 3 && total_ussr > total_us) { vp_ussr = 5; ***REMOVED***

    vp_us = vp_us + bg_us;
    vp_ussr = vp_ussr + bg_ussr;

    //
    // neighbouring countries
    //
    if (this.isControlled("ussr", "mexico") == 1) { vp_ussr++; ***REMOVED***
    if (this.isControlled("ussr", "cuba") == 1) { vp_ussr++; ***REMOVED***

    //
    // Report Adjustment
    //
    let vp_adjustment = vp_us - vp_ussr;
    this.game.state.vp += vp_adjustment;
    this.updateLog("<span>Central America:</span> " + vp_adjustment + " <span>VP</span>");

  ***REMOVED***



  ///////////////////
  // SOUTH AMERICA //
  ///////////////////
  if (card == "southamerica") {

    if (this.isControlled("us", "venezuela") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "venezuela") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "brazil") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "brazil") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "argentina") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "argentina") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "chile") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "chile") == 1) { bg_ussr++; ***REMOVED***

    total_us = bg_us;
    total_ussr = bg_ussr;

    if (this.isControlled("us", "colombia") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "colombia") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "ecuador") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "ecuador") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "peru") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "peru") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "bolivia") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "bolivia") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "paraguay") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "paraguay") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "uruguay") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "uruguay") == 1) { total_ussr++; ***REMOVED***

    if (total_us > 0) { vp_us = 2; ***REMOVED***
    if (total_ussr> 0) { vp_ussr = 2; ***REMOVED***

    if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 5; ***REMOVED***
    if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 5; ***REMOVED***

    if (bg_us == 4 && total_us > total_ussr) { vp_us = 6; ***REMOVED***
    if (bg_ussr == 4 && total_ussr > total_us) { vp_ussr = 6; ***REMOVED***

    vp_us = vp_us + bg_us;
    vp_ussr = vp_ussr + bg_ussr;


    //
    // Report Adjustment
    //
    let vp_adjustment = vp_us - vp_ussr;
    this.game.state.vp += vp_adjustment;
    this.updateLog("<span>South America:</span> " + vp_adjustment + " <span>VP</span>");


  ***REMOVED***




  //////////
  // ASIA //
  //////////
  if (card == "asia") {

    if (this.isControlled("us", "northkorea") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "northkorea") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "southkorea") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "southkorea") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "japan") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "japan") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "thailand") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "thailand") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "india") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "india") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "pakistan") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "pakistan") == 1) { bg_ussr++; ***REMOVED***
    if (this.game.state.events.formosan == 1) {
      if (this.isControlled("us", "taiwan") == 1) { bg_us++; ***REMOVED***
***REMOVED***

    total_us = bg_us;
    total_ussr = bg_ussr;

    if (this.isControlled("us", "afghanistan") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "afghanistan") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "burma") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "burma") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "laos") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "laos") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "vietnam") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "vietnam") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "malaysia") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "malaysia") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "australia") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "australia") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "indonesia") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "indonesia") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "philippines") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "philippines") == 1) { total_ussr++; ***REMOVED***
    if (this.game.state.events.formosan == 0) {
      if (this.isControlled("us", "taiwan") == 1) { total_us++; ***REMOVED***
      if (this.isControlled("ussr", "taiwan") == 1) { total_ussr++; ***REMOVED***
***REMOVED***

    //
    // Shuttle Diplomacy
    //
    if (this.game.state.events.shuttlediplomacy == 1) {
      if (bg_ussr > 0) {
        bg_ussr--;
        total_ussr--;
  ***REMOVED***
      this.game.state.events.shuttlediplomacy = 0;
***REMOVED***

    if (total_us > 0) { vp_us = 3; ***REMOVED***
    if (total_ussr> 0) { vp_ussr = 3; ***REMOVED***

    if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 7; ***REMOVED***
    if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 7; ***REMOVED***

    if (this.game.state.events.formosan == 1) {
      if (bg_us == 7 && total_us > total_ussr) { vp_us = 9; ***REMOVED***
      if (bg_us == 6 && total_us > total_ussr && this.isControlled("taiwan", "us") == 0) { vp_us = 9; ***REMOVED***
      if (bg_ussr == 6 && total_ussr > total_us) { vp_ussr = 9; ***REMOVED***
***REMOVED*** else {
      if (bg_us == 6 && total_us > total_ussr) { vp_us = 9; ***REMOVED***
      if (bg_ussr == 6 && total_ussr > total_us) { vp_ussr = 9; ***REMOVED***
***REMOVED***

    vp_us = vp_us + bg_us;
    vp_ussr = vp_ussr + bg_ussr;

    //
    // neighbouring countries
    //
    if (this.isControlled("us", "afghanistan") == 1) { vp_us++; ***REMOVED***
    if (this.isControlled("us", "northkorea") == 1) { vp_us++; ***REMOVED***
    if (this.isControlled("ussr", "japan") == 1) { vp_ussr++; ***REMOVED***

    //
    // Report Adjustment
    //
    let vp_adjustment = vp_us - vp_ussr;
    this.game.state.vp += vp_adjustment;
    this.updateLog("<span>Asia:</span> " + vp_adjustment + " <span>VP</span>");

  ***REMOVED***

  this.updateVictoryPoints();

***REMOVED***



doesPlayerDominateRegion(player, region) {

  let total_us = 0;
  let total_ussr = 0;
  let bg_us = 0;
  let bg_ussr = 0;
  let vp_us = 0;
  let vp_ussr = 0;


  ////////////
  // EUROPE //
  ////////////
  if (region == "europe") {

    if (this.isControlled("us", "italy") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "italy") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "france") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "france") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "westgermany") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "westgermany") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "eastgermany") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "eastgermany") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "poland") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "poland") == 1) { bg_ussr++; ***REMOVED***

    total_us = bg_us;
    total_ussr = bg_ussr;

    if (this.isControlled("us", "spain") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "spain") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "greece") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "greece") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "turkey") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "turkey") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "yugoslavia") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "yugoslavia") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "bulgaria") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "bulgaria") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "austria") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "austria") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "romania") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "romania") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "hungary") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "hungary") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "czechoslovakia") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "czechoslovakia") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "benelux") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "benelux") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "uk") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "uk") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "canada") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "canada") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "norway") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "norway") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "denmark") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "denmark") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "sweden") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "sweden") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "finland") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "finland") == 1) { total_ussr++; ***REMOVED***

    if (total_us > 0) { vp_us = 3; ***REMOVED***
    if (total_ussr> 0) { vp_ussr = 3; ***REMOVED***

    if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 7; ***REMOVED***
    if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 7; ***REMOVED***

    if (total_us == 6 && total_us > total_ussr) { vp_us = 10000; ***REMOVED***
    if (total_ussr == 6 && total_us > total_ussr) { vp_ussr = 10000; ***REMOVED***

    vp_us = vp_us + bg_us;
    vp_ussr = vp_ussr + bg_ussr;

    if (vp_us >= vp_ussr+2) {
      if (player == "us") { return 1; ***REMOVED***
      if (player == "ussr") { return 0; ***REMOVED***
***REMOVED***
    if (vp_ussr >= vp_us+2) {
      if (player == "us") { return 0; ***REMOVED***
      if (player == "ussr") { return 1; ***REMOVED***
***REMOVED***
  ***REMOVED***



  /////////////////
  // MIDDLE EAST //
  /////////////////
  if (region == "mideast") {

    if (this.isControlled("us", "libya") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "libya") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "egypt") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "egypt") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "israel") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "israel") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "iraq") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "iraq") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "iran") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "iran") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "saudiarabia") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "saudiarabia") == 1) { bg_ussr++; ***REMOVED***

    total_us = bg_us;
    total_ussr = bg_ussr;

    if (this.isControlled("us", "lebanon") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "lebanon") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "syria") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "syria") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "jordan") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "jordan") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "gulfstates") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "gulfstates") == 1) { total_ussr++; ***REMOVED***

    if (total_us > 0) { vp_us = 3; ***REMOVED***
    if (total_ussr> 0) { vp_ussr = 3; ***REMOVED***

    if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 5; ***REMOVED***
    if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 5; ***REMOVED***

    if (total_us == 7 && total_us > total_ussr) { vp_us = 7; ***REMOVED***
    if (total_ussr == 7 && total_us > total_ussr) { vp_ussr = 7; ***REMOVED***

    vp_us = vp_us + bg_us;
    vp_ussr = vp_ussr + bg_ussr;

    if (vp_us >= vp_ussr+2) {
      if (player == "us") { return 1; ***REMOVED***
      if (player == "ussr") { return 0; ***REMOVED***
***REMOVED***
    if (vp_ussr >= vp_us+2) {
      if (player == "us") { return 0; ***REMOVED***
      if (player == "ussr") { return 1; ***REMOVED***
***REMOVED***
  ***REMOVED***



  ////////////
  // AFRICA //
  ////////////
  if (region == "africa") {

    if (this.isControlled("us", "algeria") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "algeria") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "nigeria") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "nigeria") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "zaire") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "zaire") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "angola") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "angola") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "southafrica") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "southafrica") == 1) { bg_ussr++; ***REMOVED***

    total_us = bg_us;
    total_ussr = bg_ussr;

    if (this.isControlled("us", "morocco") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "morocco") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "tunisia") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "tunisia") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "westafricanstates") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "westafricanstates") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "saharanstates") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "saharanstates") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "sudan") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "sudan") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "ivorycoast") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "ivorycoast") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "ethiopia") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "ethiopia") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "somalia") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "somalia") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "cameroon") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "cameroon") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "kenya") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "kenya") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "seafricanstates") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "seafricanstates") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "zimbabwe") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "zimbabwe") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "botswana") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "botswana") == 1) { total_ussr++; ***REMOVED***

    if (total_us > 0) { vp_us = 1; ***REMOVED***
    if (total_ussr> 0) { vp_ussr = 1; ***REMOVED***

    if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 4; ***REMOVED***
    if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 4; ***REMOVED***

    if (total_us == 7 && total_us > total_ussr) { vp_us = 6; ***REMOVED***
    if (total_ussr == 7 && total_us > total_ussr) { vp_ussr = 6; ***REMOVED***

    vp_us = vp_us + bg_us;
    vp_ussr = vp_ussr + bg_ussr;

    if (vp_us >= vp_ussr+2) {
      if (player == "us") { return 1; ***REMOVED***
      if (player == "ussr") { return 0; ***REMOVED***
***REMOVED***
    if (vp_ussr >= vp_us+2) {
      if (player == "us") { return 0; ***REMOVED***
      if (player == "ussr") { return 1; ***REMOVED***
***REMOVED***
  ***REMOVED***



  /////////////////////
  // CENTRAL AMERICA //
  /////////////////////
  if (region == "centralamerica") {

    if (this.isControlled("us", "mexico") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "mexico") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "cuba") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "cuba") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "panama") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "panama") == 1) { bg_ussr++; ***REMOVED***

    total_us = bg_us;
    total_ussr = bg_ussr;

    if (this.isControlled("us", "guatemala") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "guatemala") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "elsalvador") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "elsalvador") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "honduras") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "honduras") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "costarica") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "costarica") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "nicaragua") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "nicaragua") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "haiti") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "haiti") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "dominicanrepublic") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "dominicanrepublic") == 1) { total_ussr++; ***REMOVED***

    if (total_us > 0) { vp_us = 1; ***REMOVED***
    if (total_ussr> 0) { vp_ussr = 1; ***REMOVED***

    if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 3; ***REMOVED***
    if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 3; ***REMOVED***

    if (total_us == 7 && total_us > total_ussr) { vp_us = 5; ***REMOVED***
    if (total_ussr == 7 && total_us > total_ussr) { vp_ussr = 5; ***REMOVED***

    vp_us = vp_us + bg_us;
    vp_ussr = vp_ussr + bg_ussr;

    if (vp_us >= vp_ussr+2) {
      if (player == "us") { return 1; ***REMOVED***
      if (player == "ussr") { return 0; ***REMOVED***
***REMOVED***
    if (vp_ussr >= vp_us+2) {
      if (player == "us") { return 0; ***REMOVED***
      if (player == "ussr") { return 1; ***REMOVED***
***REMOVED***
  ***REMOVED***



  ///////////////////
  // SOUTH AMERICA //
  ///////////////////
  if (region == "southamerica") {

    if (this.isControlled("us", "venezuela") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "venezuela") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "brazil") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "brazil") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "argentina") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "argentina") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "chile") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "chile") == 1) { bg_ussr++; ***REMOVED***

    total_us = bg_us;
    total_ussr = bg_ussr;

    if (this.isControlled("us", "colombia") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "colombia") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "ecuador") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "ecuador") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "peru") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "peru") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "bolivia") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "bolivia") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "paraguay") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "paraguay") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "uruguay") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "uruguay") == 1) { total_ussr++; ***REMOVED***

    if (total_us > 0) { vp_us = 2; ***REMOVED***
    if (total_ussr> 0) { vp_ussr = 2; ***REMOVED***

    if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 5; ***REMOVED***
    if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 5; ***REMOVED***

    if (total_us == 7 && total_us > total_ussr) { vp_us = 6; ***REMOVED***
    if (total_ussr == 7 && total_us > total_ussr) { vp_ussr = 6; ***REMOVED***

    vp_us = vp_us + bg_us;
    vp_ussr = vp_ussr + bg_ussr;

    if (vp_us >= vp_ussr+2) {
      if (player == "us") { return 1; ***REMOVED***
      if (player == "ussr") { return 0; ***REMOVED***
***REMOVED***
    if (vp_ussr >= vp_us+2) {
      if (player == "us") { return 0; ***REMOVED***
      if (player == "ussr") { return 1; ***REMOVED***
***REMOVED***

  ***REMOVED***




  //////////
  // ASIA //
  //////////
  if (region == "asia") {

    if (this.isControlled("us", "northkorea") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "northkorea") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "southkorea") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "southkorea") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "japan") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "japan") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "thailand") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "thailand") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "india") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "india") == 1) { bg_ussr++; ***REMOVED***
    if (this.isControlled("us", "pakistan") == 1) { bg_us++; ***REMOVED***
    if (this.isControlled("ussr", "pakistan") == 1) { bg_ussr++; ***REMOVED***
    if (this.game.state.events.formosan == 1) {
      if (this.isControlled("us", "taiwan") == 1) { bg_us++; ***REMOVED***
***REMOVED***

    total_us = bg_us;
    total_ussr = bg_ussr;

    if (this.isControlled("us", "afghanistan") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "afghanistan") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "burma") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "burma") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "laos") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "laos") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "vietnam") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "vietnam") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "malaysia") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "malaysia") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "australia") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "australia") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "indonesia") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "indonesia") == 1) { total_ussr++; ***REMOVED***
    if (this.isControlled("us", "philippines") == 1) { total_us++; ***REMOVED***
    if (this.isControlled("ussr", "philippines") == 1) { total_ussr++; ***REMOVED***

    if (total_us > 0) { vp_us = 3; ***REMOVED***
    if (total_ussr> 0) { vp_ussr = 3; ***REMOVED***

    if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 7; ***REMOVED***
    if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 7; ***REMOVED***

    if (this.game.state.events.formosan == 1) {
      if (total_us == 7 && total_us > total_ussr) { vp_us = 9; ***REMOVED***
      if (total_ussr == 7 && total_us > total_ussr) { vp_ussr = 9; ***REMOVED***
***REMOVED*** else {
      if (total_us == 6 && total_us > total_ussr) { vp_us = 9; ***REMOVED***
      if (total_ussr == 6 && total_us > total_ussr) { vp_ussr = 9; ***REMOVED***
***REMOVED***

    vp_us = vp_us + bg_us;
    vp_ussr = vp_ussr + bg_ussr;

    if (vp_us >= vp_ussr+2) {
      if (player == "us") { return 1; ***REMOVED***
      if (player == "ussr") { return 0; ***REMOVED***
***REMOVED***
    if (vp_ussr >= vp_us+2) {
      if (player == "us") { return 0; ***REMOVED***
      if (player == "ussr") { return 1; ***REMOVED***
***REMOVED***
  ***REMOVED***

  return 0;

***REMOVED***




returnCardItem(card) {

  if (this.interface == 1) {
    if (this.game.deck[0].cards[card] == undefined) {
      return `<div id="${card.replace(/ /g,'')***REMOVED***" class="card cardbox-hud cardbox-hud-status">${this.returnCardImage(card)***REMOVED***</div>`;
***REMOVED***
    return `<div id="${card.replace(/ /g,'')***REMOVED***" class="card showcard cardbox-hud cardbox-hud-status">${this.returnCardImage(card)***REMOVED***</div>`;
  ***REMOVED*** else {
    if (this.game.deck[0].cards[card] == undefined) {
      return '<li class="card" id="'+card+'">'+this.game.deck[0].cards[card].name+'</li>';
***REMOVED***
    return '<li class="card" id="'+card+'">'+this.game.deck[0].cards[card].name+'</li>';
  ***REMOVED***

***REMOVED***





returnCardList(cardarray=[]) {

  let hand = this.game.deck[0].hand;

  let html = "";


  if (this.interface == 1) {
    for (i = 0; i < cardarray.length; i++) {
      html += this.returnCardItem(cardarray[i]);
***REMOVED***
    html = `
      <div class="display-cards display-cards-status">
        ${html***REMOVED***
      </div>`;
  ***REMOVED*** else {

    html = "<ul>";
    for (i = 0; i < cardarray.length; i++) {
      html += this.returnCardItem(cardarray[i]);
***REMOVED***
    html += '</ul>';

  ***REMOVED***

  return html;

***REMOVED***



updateStatusAndListCards(message, cards=null) {

  if (cards == null) {
    cards = this.game.deck[0].hand;
  ***REMOVED***

  html = `
    <div class="cardbox-status-container">
      <div>${message***REMOVED***</div>
      ${this.returnCardList(cards)***REMOVED***
    </div>
  `

  this.updateStatus(html);
  this.addShowCardEvents();
***REMOVED***



updateStatus(str) {

  let twilight_self = this;

  this.game.status = str;

  if (this.browser_active == 1) {

    $('#status').html("<span>" + this.game.status + "</span>");

    try {
      twilight_self.addShowCardEvents();
***REMOVED*** catch (err) {***REMOVED***

    $('#status').show();

    try {
      if ($('#game_log').hasClass("loading") == true) {
        $('#game_log').removeClass("loading");
        $('#game_log').addClass("loaded");
  ***REMOVED*** else {
  ***REMOVED***
***REMOVED*** catch (err) {
***REMOVED***
  ***REMOVED***;

***REMOVED***



updateRound() {

  let dt = 0;
  let dl = 0;

  if (this.game.state.round == 0) {
    dt = this.game.state.round_ps[0].top;
    dl = this.game.state.round_ps[0].left;
  ***REMOVED***
  if (this.game.state.round == 1) {
    dt = this.game.state.round_ps[0].top;
    dl = this.game.state.round_ps[0].left;
  ***REMOVED***
  if (this.game.state.round == 2) {
    dt = this.game.state.round_ps[1].top;
    dl = this.game.state.round_ps[1].left;
  ***REMOVED***
  if (this.game.state.round == 3) {
    dt = this.game.state.round_ps[2].top;
    dl = this.game.state.round_ps[2].left;
  ***REMOVED***
  if (this.game.state.round == 4) {
    dt = this.game.state.round_ps[3].top;
    dl = this.game.state.round_ps[3].left;
  ***REMOVED***
  if (this.game.state.round == 5) {
    dt = this.game.state.round_ps[4].top;
    dl = this.game.state.round_ps[4].left;
  ***REMOVED***
  if (this.game.state.round == 6) {
    dt = this.game.state.round_ps[5].top;
    dl = this.game.state.round_ps[5].left;
  ***REMOVED***
  if (this.game.state.round == 7) {
    dt = this.game.state.round_ps[6].top;
    dl = this.game.state.round_ps[6].left;
  ***REMOVED***
  if (this.game.state.round == 8) {
    dt = this.game.state.round_ps[7].top;
    dl = this.game.state.round_ps[7].left;
  ***REMOVED***
  if (this.game.state.round == 9) {
    dt = this.game.state.round_ps[8].top;
    dl = this.game.state.round_ps[8].left;
  ***REMOVED***
  if (this.game.state.round == 10) {
    dt = this.game.state.round_ps[9].top;
    dl = this.game.state.round_ps[9].left;
  ***REMOVED***

  dt = this.scale(dt)+"px";
  dl = this.scale(dl)+"px";

  $('.round').css('width', this.scale(140)+"px");
  $('.round').css('height', this.scale(140)+"px");
  $('.round').css('top', dt);
  $('.round').css('left', dl);

***REMOVED***


lowerDefcon() {

  this.game.state.defcon--;

  this.updateLog("<span>DEFCON falls to</span> " + this.game.state.defcon);

  if (this.game.state.defcon == 2) {
    if (this.game.state.events.norad == 1) {
      if (this.game.state.headline != 1) {
        this.game.state.us_defcon_bonus = 1;
  ***REMOVED***
***REMOVED***
  ***REMOVED***


console.log("LOWERING DEFCON: " + this.game.state.defcon + " -- " + this.game.state.headline + " -- " + this.game.state.player_to_go);

  if (this.game.state.defcon == 1) {
    if (this.game.state.headline == 1) {
      //
      // phasing player in headline loses
      //
      if (this.game.state.player_to_go == 1) {
        this.endGame("us", "<span>USSR triggers thermonuclear war</span>");
  ***REMOVED***
      if (this.game.state.player_to_go == 2) {
        this.endGame("ussr", "<span>US triggers thermonuclear war</span>");
  ***REMOVED***
      return;
***REMOVED***
    if (this.game.state.turn == 0) {
      this.endGame("us", "<span>USSR triggers thermonuclear war 1</span>");
***REMOVED*** else {
      this.endGame("ussr", "<span>US triggers thermonuclear war 2</span>");
***REMOVED***
  ***REMOVED***

  this.updateDefcon();
***REMOVED***


updateDefcon() {

  if (this.game.state.defcon > 5) { this.game.state.defcon = 5; ***REMOVED***

  let dt = 0;
  let dl = 0;

  if (this.game.state.defcon == 5) {
    dt = this.game.state.defcon_ps[0].top;
    dl = this.game.state.defcon_ps[0].left;
  ***REMOVED***
  if (this.game.state.defcon == 4) {
    dt = this.game.state.defcon_ps[1].top;
    dl = this.game.state.defcon_ps[1].left;
  ***REMOVED***
  if (this.game.state.defcon == 3) {
    dt = this.game.state.defcon_ps[2].top;
    dl = this.game.state.defcon_ps[2].left;
  ***REMOVED***
  if (this.game.state.defcon == 2) {
    dt = this.game.state.defcon_ps[3].top;
    dl = this.game.state.defcon_ps[3].left;
  ***REMOVED***
  if (this.game.state.defcon == 1) {
    dt = this.game.state.defcon_ps[4].top;
    dl = this.game.state.defcon_ps[4].left;
  ***REMOVED***

  dt = this.scale(dt) + "px";
  dl = this.scale(dl) + "px";

  dt = dt;
  dl = dl;

  $('.defcon').css('width', this.scale(120)+"px");
  $('.defcon').css('height', this.scale(120)+"px");
  $('.defcon').css('top', dt);
  $('.defcon').css('left', dl);

***REMOVED***



updateActionRound() {

  let dt = 0;
  let dl = 0;
  let dt_us = 0;
  let dl_us = 0;

  let turn_in_round = this.game.state.turn_in_round;

  if (turn_in_round == 0) {
    dt = this.game.state.ar_ps[0].top;
    dl = this.game.state.ar_ps[0].left;
  ***REMOVED***
  if (turn_in_round == 1) {
    dt = this.game.state.ar_ps[0].top;
    dl = this.game.state.ar_ps[0].left;
  ***REMOVED***
  if (turn_in_round == 2) {
    dt = this.game.state.ar_ps[1].top;
    dl = this.game.state.ar_ps[1].left;
  ***REMOVED***
  if (turn_in_round == 3) {
    dt = this.game.state.ar_ps[2].top;
    dl = this.game.state.ar_ps[2].left;
  ***REMOVED***
  if (turn_in_round == 4) {
    dt = this.game.state.ar_ps[3].top;
    dl = this.game.state.ar_ps[3].left;
  ***REMOVED***
  if (turn_in_round == 5) {
    dt = this.game.state.ar_ps[4].top;
    dl = this.game.state.ar_ps[4].left;
  ***REMOVED***
  if (turn_in_round == 6) {
    dt = this.game.state.ar_ps[5].top;
    dl = this.game.state.ar_ps[5].left;
  ***REMOVED***
  if (turn_in_round == 7) {
    dt = this.game.state.ar_ps[6].top;
    dl = this.game.state.ar_ps[6].left;
  ***REMOVED***
  if (turn_in_round == 8) {
    dt = this.game.state.ar_ps[7].top;
    dl = this.game.state.ar_ps[7].left;
  ***REMOVED***

  dt = this.scale(dt)+"px";
  dl = this.scale(dl)+"px";

  if (this.game.state.turn == 0) {
    $('.action_round_us').hide();
    $('.action_round_ussr').show();
    $('.action_round_ussr').css('width', this.scale(100)+"px");
    $('.action_round_ussr').css('height', this.scale(100)+"px");
    $('.action_round_ussr').css('top', dt);
    $('.action_round_ussr').css('left', dl);
  ***REMOVED*** else {
    $('.action_round_ussr').hide();
    $('.action_round_us').show();
    $('.action_round_us').css('width', this.scale(100)+"px");
    $('.action_round_us').css('height', this.scale(100)+"px");
    $('.action_round_us').css('top', dt);
    $('.action_round_us').css('left', dl);
  ***REMOVED***

  let rounds_this_turn = 6;
  if (this.game.state.round > 3) { rounds_this_turn = 7; ***REMOVED***
  if (this.game.state.northseaoil == 1 && this.game.player == 2) { rounds_this_turn++; ***REMOVED***
  if (this.game.state.space_station === "us" && this.game.player == 2) { rounds_this_turn++; ***REMOVED***
  if (this.game.state.space_station === "ussr" && this.game.player == 1) { rounds_this_turn++; ***REMOVED***

  $('.action_round_cover').css('width', this.scale(100)+"px");
  $('.action_round_cover').css('height', this.scale(100)+"px");

  let dt8 = this.scale(this.game.state.ar_ps[7].top) + "px";
  let dl8 = this.scale(this.game.state.ar_ps[7].left) + "px";
  let dt7 = this.scale(this.game.state.ar_ps[6].top) + "px";
  let dl7 = this.scale(this.game.state.ar_ps[6].left) + "px";

  $('.action_round_8_cover').css('top', dt8);
  $('.action_round_8_cover').css('left', dl8);
  $('.action_round_7_cover').css('top', dt7);
  $('.action_round_7_cover').css('left', dl7);

  if (rounds_this_turn < 8) { $('.action_round_8_cover').css('display','all'); ***REMOVED*** else { $('.action_round_8_cover').css('display','none'); ***REMOVED***
  if (rounds_this_turn < 7) { $('.action_round_7_cover').css('display','all'); ***REMOVED*** else { $('.action_round_7_cover').css('display','none'); ***REMOVED***

***REMOVED***



advanceSpaceRace(player) {

  this.updateLog("<span>" + player.toUpperCase() + "</span> <span>has advanced in the space race</span>");

  if (player == "us") {

    this.game.state.space_race_us++;

    // Earth Satellite
    if (this.game.state.space_race_us == 1) {
      if (this.game.state.space_race_ussr < 1) {
        this.game.state.vp += 2;
        this.updateVictoryPoints();
  ***REMOVED*** else {
        this.game.state.vp += 1;
        this.updateVictoryPoints();
  ***REMOVED***
***REMOVED***

    // Animal in Space
    if (this.game.state.space_race_us == 2) {
      if (this.game.state.space_race_ussr < 2) {
        this.game.state.animal_in_space = "us";
  ***REMOVED*** else {
        this.game.state.animal_in_space = "";
  ***REMOVED***
***REMOVED***

    // Man in Space
    if (this.game.state.space_race_us == 3) {
      if (this.game.state.space_race_ussr < 3) {
        this.game.state.vp += 2;
        this.updateVictoryPoints();
  ***REMOVED*** else {
        this.game.state.animal_in_space = "";
  ***REMOVED***
***REMOVED***

    // Man in Earth Orbit
    if (this.game.state.space_race_us == 4) {
      if (this.game.state.space_race_ussr < 4) {
        this.game.state.man_in_earth_orbit = "us";
  ***REMOVED*** else {
        this.game.state.man_in_earth_orbit = "";
        this.game.state.animal_in_space = "";
  ***REMOVED***
***REMOVED***

    // Lunar Orbit
    if (this.game.state.space_race_us == 5) {
      if (this.game.state.space_race_ussr < 5) {
        this.game.state.vp += 3;
        this.updateVictoryPoints();
  ***REMOVED*** else {
        this.game.state.vp += 1;
        this.updateVictoryPoints();
        this.game.state.man_in_earth_orbit = "";
        this.game.state.animal_in_space = "";
  ***REMOVED***
***REMOVED***

    // Eagle has Landed
    if (this.game.state.space_race_us == 6) {
      if (this.game.state.space_race_ussr < 6) {
        this.game.state.eagle_has_landed = "us";
  ***REMOVED*** else {
        this.game.state.eagle_has_landed = "";
        this.game.state.man_in_earth_orbit = "";
        this.game.state.animal_in_space = "";
  ***REMOVED***
***REMOVED***

    // Space Shuttle
    if (this.game.state.space_race_us == 7) {
      if (this.game.state.space_race_ussr < 7) {
        this.game.state.vp += 4;
        this.updateVictoryPoints();
  ***REMOVED*** else {
        this.game.state.vp += 2;
        this.updateVictoryPoints();
        this.game.state.eagle_has_landed = "";
        this.game.state.man_in_earth_orbit = "";
        this.game.state.animal_in_space = "";
  ***REMOVED***
***REMOVED***

    // Space Station
    if (this.game.state.space_race_us == 8) {
      if (this.game.state.space_race_ussr < 8) {
        this.game.state.vp += 2;
        this.updateVictoryPoints();
        this.game.state.space_shuttle = "us";
  ***REMOVED*** else {
        this.game.state.eagle_has_landed = "";
        this.game.state.man_in_earth_orbit = "";
        this.game.state.animal_in_space = "";
        this.game.state.space_shuttle = "";
  ***REMOVED***
***REMOVED***
  ***REMOVED***





  if (player == "ussr") {

    this.game.state.space_race_ussr++;

    // Earth Satellite
    if (this.game.state.space_race_ussr == 1) {
      if (this.game.state.space_race_us < 1) {
        this.game.state.vp -= 2;
        this.updateVictoryPoints();
  ***REMOVED*** else {
        this.game.state.vp -= 1;
        this.updateVictoryPoints();
  ***REMOVED***
***REMOVED***

    // Animal in Space
    if (this.game.state.space_race_ussr == 2) {
      if (this.game.state.space_race_us < 2) {
        this.game.state.animal_in_space = "ussr";
  ***REMOVED*** else {
        this.game.state.animal_in_space = "";
  ***REMOVED***
***REMOVED***

    // Man in Space
    if (this.game.state.space_race_ussr == 3) {
      if (this.game.state.space_race_us < 3) {
        this.game.state.vp -= 2;
        this.updateVictoryPoints();
  ***REMOVED*** else {
        this.game.state.animal_in_space = "";
  ***REMOVED***
***REMOVED***

    // Man in Earth Orbit
    if (this.game.state.space_race_ussr == 4) {
      if (this.game.state.space_race_us < 4) {
        this.game.state.man_in_earth_orbit = "ussr";
  ***REMOVED*** else {
        this.game.state.animal_in_space = "";
        this.game.state.man_in_earth_orbit = "";
  ***REMOVED***
***REMOVED***

    // Lunar Orbit
    if (this.game.state.space_race_ussr == 5) {
      if (this.game.state.space_race_us < 5) {
        this.game.state.vp -= 3;
        this.updateVictoryPoints();
  ***REMOVED*** else {
        this.game.state.vp -= 1;
        this.updateVictoryPoints();
        this.game.state.animal_in_space = "";
        this.game.state.man_in_earth_orbit = "";
  ***REMOVED***
***REMOVED***

    // Bear has Landed
    if (this.game.state.space_race_ussr == 6) {
      if (this.game.state.space_race_us < 6) {
        this.game.state.eagle_has_landed = "ussr";
  ***REMOVED*** else {
        this.game.state.animal_in_space = "";
        this.game.state.man_in_earth_orbit = "";
        this.game.state.eagle_has_landed = "";
  ***REMOVED***
***REMOVED***

    // Space Shuttle
    if (this.game.state.space_race_ussr == 7) {
      if (this.game.state.space_race_us < 7) {
        this.game.state.vp -= 4;
        this.updateVictoryPoints();
  ***REMOVED*** else {
        this.game.state.vp -= 2;
        this.updateVictoryPoints();
        this.game.state.animal_in_space = "";
        this.game.state.man_in_earth_orbit = "";
        this.game.state.eagle_has_landed = "";
  ***REMOVED***
***REMOVED***

    // Space Station
    if (this.game.state.space_race_ussr == 8) {
      if (this.game.state.space_race_us < 8) {
        this.game.state.vp -= 2;
        this.updateVictoryPoints();
        this.game.state.space_shuttle = "ussr";
  ***REMOVED*** else {
        this.game.state.animal_in_space = "";
        this.game.state.man_in_earth_orbit = "";
        this.game.state.eagle_has_landed = "";
        this.game.state.space_shuttle = "";
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  this.updateSpaceRace();
***REMOVED***



updateSpaceRace() {

  let dt_us = 0;
  let dl_us = 0;
  let dt_ussr = 0;
  let dl_ussr = 0;

  if (this.game.state.space_race_us == 0) {
    dt_us = this.game.state.space_race_ps[0].top;
    dl_us = this.game.state.space_race_ps[0].left;
  ***REMOVED***
  if (this.game.state.space_race_us == 1) {
    dt_us = this.game.state.space_race_ps[1].top;
    dl_us = this.game.state.space_race_ps[1].left;
  ***REMOVED***
  if (this.game.state.space_race_us == 2) {
    dt_us = this.game.state.space_race_ps[2].top;
    dl_us = this.game.state.space_race_ps[2].left;
  ***REMOVED***
  if (this.game.state.space_race_us == 3) {
    dt_us = this.game.state.space_race_ps[3].top;
    dl_us = this.game.state.space_race_ps[3].left;
  ***REMOVED***
  if (this.game.state.space_race_us == 4) {
    dt_us = this.game.state.space_race_ps[4].top;
    dl_us = this.game.state.space_race_ps[4].left;
  ***REMOVED***
  if (this.game.state.space_race_us == 5) {
    dt_us = this.game.state.space_race_ps[5].top;
    dl_us = this.game.state.space_race_ps[5].left;
  ***REMOVED***
  if (this.game.state.space_race_us == 6) {
    dt_us = this.game.state.space_race_ps[6].top;
    dl_us = this.game.state.space_race_ps[6].left;
  ***REMOVED***
  if (this.game.state.space_race_us == 7) {
    dt_us = this.game.state.space_race_ps[7].top;
    dl_us = this.game.state.space_race_ps[7].left;
  ***REMOVED***
  if (this.game.state.space_race_us == 8) {
    dt_us = this.game.state.space_race_ps[8].top;
    dl_us = this.game.state.space_race_ps[8].left;
  ***REMOVED***

  if (this.game.state.space_race_ussr == 0) {
    dt_ussr = this.game.state.space_race_ps[0].top;
    dl_ussr = this.game.state.space_race_ps[0].left;
  ***REMOVED***
  if (this.game.state.space_race_ussr == 1) {
    dt_ussr = this.game.state.space_race_ps[1].top;
    dl_ussr = this.game.state.space_race_ps[1].left;
  ***REMOVED***
  if (this.game.state.space_race_ussr == 2) {
    dt_ussr = this.game.state.space_race_ps[2].top;
    dl_ussr = this.game.state.space_race_ps[2].left;
  ***REMOVED***
  if (this.game.state.space_race_ussr == 3) {
    dt_ussr = this.game.state.space_race_ps[3].top;
    dl_ussr = this.game.state.space_race_ps[3].left;
  ***REMOVED***
  if (this.game.state.space_race_ussr == 4) {
    dt_ussr = this.game.state.space_race_ps[4].top;
    dl_ussr = this.game.state.space_race_ps[4].left;
  ***REMOVED***
  if (this.game.state.space_race_ussr == 5) {
    dt_ussr = this.game.state.space_race_ps[5].top;
    dl_ussr = this.game.state.space_race_ps[5].left;
  ***REMOVED***
  if (this.game.state.space_race_ussr == 6) {
    dt_ussr = this.game.state.space_race_ps[6].top;
    dl_ussr = this.game.state.space_race_ps[6].left;
  ***REMOVED***
  if (this.game.state.space_race_ussr == 7) {
    dt_ussr = this.game.state.space_race_ps[7].top;
    dl_ussr = this.game.state.space_race_ps[7].left;
  ***REMOVED***
  if (this.game.state.space_race_ussr == 8) {
    dt_ussr = this.game.state.space_race_ps[8].top;
    dl_ussr = this.game.state.space_race_ps[8].left;
  ***REMOVED***

  dt_us = this.scale(dt_us);
  dl_us = this.scale(dl_us);
  dt_ussr = this.scale(dt_ussr+40)+"px";
  dl_ussr = this.scale(dl_ussr+10)+"px";

  $('.space_race_us').css('width', this.scale(100)+"px");
  $('.space_race_us').css('height', this.scale(100)+"px");
  $('.space_race_us').css('top', dt_us);
  $('.space_race_us').css('left', dl_us);

  $('.space_race_ussr').css('width', this.scale(100)+"px");
  $('.space_race_ussr').css('height', this.scale(100)+"px");
  $('.space_race_ussr').css('top', dt_ussr);
  $('.space_race_ussr').css('left', dl_ussr);

***REMOVED***



updateEventTiles() {

  if (this.game.state.events.warsawpact == 0) {
    $('#eventtile_warsaw').css('display','none');
  ***REMOVED*** else {
    $('#eventtile_warsaw').css('display','block');
  ***REMOVED***

  if (this.game.state.events.degaulle == 0) {
    $('#eventtile_degaulle').css('display','none');
  ***REMOVED*** else {
    $('#eventtile_degaulle').css('display','block');
  ***REMOVED***

  if (this.game.state.events.nato == 0) {
    $('#eventtile_nato').css('display','none');
  ***REMOVED*** else {
    $('#eventtile_nato').css('display','block');
  ***REMOVED***

  if (this.game.state.events.marshall == 0) {
    $('#eventtile_marshall').css('display','none');
  ***REMOVED*** else {
    $('#eventtile_marshall').css('display','block');
  ***REMOVED***

  if (this.game.state.events.usjapan == 0) {
    $('#eventtile_usjapan').css('display','none');
  ***REMOVED*** else {
    $('#eventtile_usjapan').css('display','block');
  ***REMOVED***

  if (this.game.state.events.norad == 0) {
    $('#eventtile_norad').css('display','none');
  ***REMOVED*** else {
    $('#eventtile_norad').css('display','block');
  ***REMOVED***

  if (this.game.state.events.quagmire == 0) {
    $('#eventtile_quagmire').css('display','none');
  ***REMOVED*** else {
    $('#eventtile_quagmire').css('display','block');
  ***REMOVED***

  if (this.game.state.events.formosan == 0) {
    $('#eventtile_formosan').css('display','none');
    $('.formosan_resolution').css('display','none');
    $('.formosan_resolution').hide();
  ***REMOVED*** else {
    if (this.isControlled("ussr", "taiwan") != 1) {
      $('#eventtile_formosan').css('display','block');
      $('.formosan_resolution').css('display','block');
      $('.formosan_resolution').show();
***REMOVED*** else {
      $('.formosan_resolution').css('display','none');
      $('.formosan_resolution').hide();
***REMOVED***
  ***REMOVED***

  if (this.game.state.events.beartrap == 0) {
    $('#eventtile_beartrap').css('display','none');
  ***REMOVED*** else {
    $('#eventtile_beartrap').css('display','block');
  ***REMOVED***

  if (this.game.state.events.willybrandt == 0) {
    $('#eventtile_willybrandt').css('display','none');
  ***REMOVED*** else {
    $('#eventtile_willybrandt').css('display','block');
  ***REMOVED***

  if (this.game.state.events.campdavid == 0) {
    $('#eventtile_campdavid').css('display','none');
  ***REMOVED*** else {
    $('#eventtile_campdavid').css('display','block');
  ***REMOVED***

  if (this.game.state.events.flowerpower == 0) {
    $('#eventtile_flowerpower').css('display','none');
  ***REMOVED*** else {
    $('#eventtile_flowerpower').css('display','block');
  ***REMOVED***

  if (this.game.state.events.johnpaul == 0) {
    $('#eventtile_johnpaul').css('display','none');
  ***REMOVED*** else {
    $('#eventtile_johnpaul').css('display','block');
  ***REMOVED***

  if (this.game.state.events.iranianhostage == 0) {
    $('#eventtile_iranianhostagecrisis').css('display','none');
  ***REMOVED*** else {
    $('#eventtile_iranianhostagecrisis').css('display','block');
  ***REMOVED***

  if (this.game.state.events.shuttlediplomacy == 0) {
    $('#eventtile_shuttlediplomacy').css('display','none');
  ***REMOVED*** else {
    $('#eventtile_shuttlediplomacy').css('display','block');
  ***REMOVED***

  if (this.game.state.events.ironlady == 0) {
    $('#eventtile_ironlady').css('display','none');
  ***REMOVED*** else {
    $('#eventtile_ironlady').css('display','block');
  ***REMOVED***

  if (this.game.state.events.northseaoil == 0) {
    $('#eventtile_northseaoil').css('display','none');
  ***REMOVED*** else {
    $('#eventtile_northseaoil').css('display','block');
  ***REMOVED***

  if (this.game.state.events.reformer == 0) {
    $('#eventtile_reformer').css('display','none');
  ***REMOVED*** else {
    $('#eventtile_reformer').css('display','block');
  ***REMOVED***

  if (this.game.state.events.teardown == 0) {
    $('#eventtile_teardown').css('display','none');
  ***REMOVED*** else {
    $('#eventtile_teardown').css('display','block');
  ***REMOVED***

  if (this.game.state.events.evilempire == 0) {
    $('#eventtile_evilempire').css('display','none');
  ***REMOVED*** else {
    $('#eventtile_evilempire').css('display','block');
  ***REMOVED***

  if (this.game.state.events.awacs == 0) {
    $('#eventtile_awacs').css('display','none');
  ***REMOVED*** else {
    $('#eventtile_awacs').css('display','block');
  ***REMOVED***

***REMOVED***



updateMilitaryOperations() {

  let dt_us = 0;
  let dl_us = 0;
  let dt_ussr = 0;
  let dl_ussr = 0;

  if (this.game.state.milops_us == 0) {
    dt_us = this.game.state.milops_ps[0].top;
    dl_us = this.game.state.milops_ps[0].left;
  ***REMOVED***
  if (this.game.state.milops_us == 1) {
    dt_us = this.game.state.milops_ps[1].top;
    dl_us = this.game.state.milops_ps[1].left;
  ***REMOVED***
  if (this.game.state.milops_us == 2) {
    dt_us = this.game.state.milops_ps[2].top;
    dl_us = this.game.state.milops_ps[2].left;
  ***REMOVED***
  if (this.game.state.milops_us == 3) {
    dt_us = this.game.state.milops_ps[3].top;
    dl_us = this.game.state.milops_ps[3].left;
  ***REMOVED***
  if (this.game.state.milops_us == 4) {
    dt_us = this.game.state.milops_ps[4].top;
    dl_us = this.game.state.milops_ps[4].left;
  ***REMOVED***
  if (this.game.state.milops_us >= 5) {
    dt_us = this.game.state.milops_ps[5].top;
    dl_us = this.game.state.milops_ps[5].left;
  ***REMOVED***

  if (this.game.state.milops_ussr == 0) {
    dt_ussr = this.game.state.milops_ps[0].top;
    dl_ussr = this.game.state.milops_ps[0].left;
  ***REMOVED***
  if (this.game.state.milops_ussr == 1) {
    dt_ussr = this.game.state.milops_ps[1].top;
    dl_ussr = this.game.state.milops_ps[1].left;
  ***REMOVED***
  if (this.game.state.milops_ussr == 2) {
    dt_ussr = this.game.state.milops_ps[2].top;
    dl_ussr = this.game.state.milops_ps[2].left;
  ***REMOVED***
  if (this.game.state.milops_ussr == 3) {
    dt_ussr = this.game.state.milops_ps[3].top;
    dl_ussr = this.game.state.milops_ps[3].left;
  ***REMOVED***
  if (this.game.state.milops_ussr == 4) {
    dt_ussr = this.game.state.milops_ps[4].top;
    dl_ussr = this.game.state.milops_ps[4].left;
  ***REMOVED***
  if (this.game.state.milops_ussr >= 5) {
    dt_ussr = this.game.state.milops_ps[5].top;
    dl_ussr = this.game.state.milops_ps[5].left;
  ***REMOVED***

  dt_us = this.scale(dt_us);
  dl_us = this.scale(dl_us);
  dt_ussr = this.scale(dt_ussr+40)+"px";
  dl_ussr = this.scale(dl_ussr+10)+"px";

  $('.milops_us').css('width', this.scale(100)+"px");
  $('.milops_us').css('height', this.scale(100)+"px");
  $('.milops_us').css('top', dt_us);
  $('.milops_us').css('left', dl_us);

  $('.milops_ussr').css('width', this.scale(100)+"px");
  $('.milops_ussr').css('height', this.scale(100)+"px");
  $('.milops_ussr').css('top', dt_ussr);
  $('.milops_ussr').css('left', dl_ussr);

***REMOVED***



updateVictoryPoints() {

  //
  // if VP are outstanding, do not update VP and trigger end
  //
  if (this.game.state.vp_outstanding != 0) { return; ***REMOVED***

  let dt = 0;
  let dl = 0;

  if (this.game.state.vp <= -20) {
    dt = this.game.state.vp_ps[0].top;
    dl = this.game.state.vp_ps[0].left;
  ***REMOVED***
  if (this.game.state.vp == -19) {
    dt = this.game.state.vp_ps[1].top;
    dl = this.game.state.vp_ps[1].left;
  ***REMOVED***
  if (this.game.state.vp == -18) {
    dt = this.game.state.vp_ps[2].top;
    dl = this.game.state.vp_ps[2].left;
  ***REMOVED***
  if (this.game.state.vp == -17) {
    dt = this.game.state.vp_ps[3].top;
    dl = this.game.state.vp_ps[3].left;
  ***REMOVED***
  if (this.game.state.vp == -16) {
    dt = this.game.state.vp_ps[4].top;
    dl = this.game.state.vp_ps[4].left;
  ***REMOVED***
  if (this.game.state.vp == -15) {
    dt = this.game.state.vp_ps[5].top;
    dl = this.game.state.vp_ps[5].left;
  ***REMOVED***
  if (this.game.state.vp == -14) {
    dt = this.game.state.vp_ps[6].top;
    dl = this.game.state.vp_ps[6].left;
  ***REMOVED***
  if (this.game.state.vp == -13) {
    dt = this.game.state.vp_ps[7].top;
    dl = this.game.state.vp_ps[7].left;
  ***REMOVED***
  if (this.game.state.vp == -12) {
    dt = this.game.state.vp_ps[8].top;
    dl = this.game.state.vp_ps[8].left;
  ***REMOVED***
  if (this.game.state.vp == -11) {
    dt = this.game.state.vp_ps[9].top;
    dl = this.game.state.vp_ps[9].left;
  ***REMOVED***
  if (this.game.state.vp == -10) {
    dt = this.game.state.vp_ps[10].top;
    dl = this.game.state.vp_ps[10].left;
  ***REMOVED***
  if (this.game.state.vp == -9) {
    dt = this.game.state.vp_ps[11].top;
    dl = this.game.state.vp_ps[11].left;
  ***REMOVED***
  if (this.game.state.vp == -8) {
    dt = this.game.state.vp_ps[12].top;
    dl = this.game.state.vp_ps[12].left;
  ***REMOVED***
  if (this.game.state.vp == -7) {
    dt = this.game.state.vp_ps[13].top;
    dl = this.game.state.vp_ps[13].left;
  ***REMOVED***
  if (this.game.state.vp == -6) {
    dt = this.game.state.vp_ps[14].top;
    dl = this.game.state.vp_ps[14].left;
  ***REMOVED***
  if (this.game.state.vp == -5) {
    dt = this.game.state.vp_ps[15].top;
    dl = this.game.state.vp_ps[15].left;
  ***REMOVED***
  if (this.game.state.vp == -4) {
    dt = this.game.state.vp_ps[16].top;
    dl = this.game.state.vp_ps[16].left;
  ***REMOVED***
  if (this.game.state.vp == -3) {
    dt = this.game.state.vp_ps[17].top;
    dl = this.game.state.vp_ps[17].left;
  ***REMOVED***
  if (this.game.state.vp == -2) {
    dt = this.game.state.vp_ps[18].top;
    dl = this.game.state.vp_ps[18].left;
  ***REMOVED***
  if (this.game.state.vp == -1) {
    dt = this.game.state.vp_ps[19].top;
    dl = this.game.state.vp_ps[19].left;
  ***REMOVED***
  if (this.game.state.vp == 0) {
    dt = this.game.state.vp_ps[20].top;
    dl = this.game.state.vp_ps[20].left;
  ***REMOVED***
  if (this.game.state.vp == 1) {
    dt = this.game.state.vp_ps[21].top;
    dl = this.game.state.vp_ps[21].left;
  ***REMOVED***
  if (this.game.state.vp == 2) {
    dt = this.game.state.vp_ps[22].top;
    dl = this.game.state.vp_ps[22].left;
  ***REMOVED***
  if (this.game.state.vp == 3) {
    dt = this.game.state.vp_ps[23].top;
    dl = this.game.state.vp_ps[23].left;
  ***REMOVED***
  if (this.game.state.vp == 4) {
    dt = this.game.state.vp_ps[24].top;
    dl = this.game.state.vp_ps[24].left;
  ***REMOVED***
  if (this.game.state.vp == 5) {
    dt = this.game.state.vp_ps[25].top;
    dl = this.game.state.vp_ps[25].left;
  ***REMOVED***
  if (this.game.state.vp == 6) {
    dt = this.game.state.vp_ps[26].top;
    dl = this.game.state.vp_ps[26].left;
  ***REMOVED***
  if (this.game.state.vp == 7) {
    dt = this.game.state.vp_ps[27].top;
    dl = this.game.state.vp_ps[27].left;
  ***REMOVED***
  if (this.game.state.vp == 8) {
    dt = this.game.state.vp_ps[28].top;
    dl = this.game.state.vp_ps[28].left;
  ***REMOVED***
  if (this.game.state.vp == 9) {
    dt = this.game.state.vp_ps[29].top;
    dl = this.game.state.vp_ps[29].left;
  ***REMOVED***
  if (this.game.state.vp == 10) {
    dt = this.game.state.vp_ps[30].top;
    dl = this.game.state.vp_ps[30].left;
  ***REMOVED***
  if (this.game.state.vp == 11) {
    dt = this.game.state.vp_ps[31].top;
    dl = this.game.state.vp_ps[31].left;
  ***REMOVED***
  if (this.game.state.vp == 12) {
    dt = this.game.state.vp_ps[32].top;
    dl = this.game.state.vp_ps[32].left;
  ***REMOVED***
  if (this.game.state.vp == 13) {
    dt = this.game.state.vp_ps[33].top;
    dl = this.game.state.vp_ps[33].left;
  ***REMOVED***
  if (this.game.state.vp == 14) {
    dt = this.game.state.vp_ps[34].top;
    dl = this.game.state.vp_ps[34].left;
  ***REMOVED***
  if (this.game.state.vp == 15) {
    dt = this.game.state.vp_ps[35].top;
    dl = this.game.state.vp_ps[35].left;
  ***REMOVED***
  if (this.game.state.vp == 16) {
    dt = this.game.state.vp_ps[36].top;
    dl = this.game.state.vp_ps[36].left;
  ***REMOVED***
  if (this.game.state.vp == 17) {
    dt = this.game.state.vp_ps[37].top;
    dl = this.game.state.vp_ps[37].left;
  ***REMOVED***
  if (this.game.state.vp == 18) {
    dt = this.game.state.vp_ps[38].top;
    dl = this.game.state.vp_ps[38].left;
  ***REMOVED***
  if (this.game.state.vp == 19) {
    dt = this.game.state.vp_ps[39].top;
    dl = this.game.state.vp_ps[39].left;
  ***REMOVED***
  if (this.game.state.vp >= 20) {
    dt = this.game.state.vp_ps[40].top;
    dl = this.game.state.vp_ps[40].left;
  ***REMOVED***


  if (this.app.BROWSER == 1) {

    if (this.game.state.vp > 19) {
      this.endGame("us", "victory point track");
***REMOVED***
    if (this.game.state.vp < -19) {
      this.endGame("ussr", "victory point track");
***REMOVED***

    dt = this.scale(dt);
    dl = this.scale(dl);

    dt = dt + "px";
    dl = dl + "px";

    $('.vp').css('width', this.scale(120)+"px");
    $('.vp').css('height', this.scale(120)+"px");
    $('.vp').css('top', dt);
    $('.vp').css('left', dl);
  ***REMOVED***
***REMOVED***







mobileCardSelect(card, player, mycallback, prompttext="play") {

  let twilight_self = this;

  twilight_self.hideCard();
  twilight_self.showCard(card);

  $('.cardbox_menu_playcard').css('display','block');
  $('.cardbox_menu_playcard').off();
  $('.cardbox_menu_playcard').on('click', function () {
    $('.cardbox_menu').css('display','none');
    twilight_self.hideCard();
    mycallback();
    $(this).hide();
    $('.cardbox-exit').hide();
  ***REMOVED***);
  // HERE WE ARE
  $('.cardbox-exit').off();
  $('.cardbox-exit').on('click', function () {
    twilight_self.hideCard();
    $('.cardbox_menu_playcard').css('display','none');
    $(this).css('display', 'none');
  ***REMOVED***);

***REMOVED***

returnCardImage(cardname) {

  var c = this.game.deck[0].cards[cardname];
  if (c == undefined) { c = this.game.deck[0].discards[cardname]; ***REMOVED***
  if (c == undefined) { c = this.game.deck[0].removed[cardname]; ***REMOVED***
  if (c == undefined) {

    //
    // this is not a card, it is something like "skip turn" or cancel
    //
    return '<div class="noncard">'+cardname+'</div>';

  ***REMOVED***

  var html = `<img class="cardimg" src="/twilight/img/${this.lang***REMOVED***/${c.img***REMOVED***.svg" />`;

  //
  // cards can be generated with http://www.invadethree.space/tscardgen/
  // as long as they have the string "png" included in the name they will
  // be treated as fully formed (i.e. not SVG files). The convention is to
  // name these cards starting at 201 in order to avoid conflict with other
  // cards that may be released officially.
  //
  if (c.img.indexOf("png") > -1) {
      html = `<img class="cardimg" src="/twilight/img/${this.lang***REMOVED***/${c.img***REMOVED***.png" />`;
  ***REMOVED*** else {
      if (c.p == 0) { html +='<img class="cardimg" src="/twilight/img/EarlyWar.svg" />'; ***REMOVED***
      if (c.p == 1) { html +='<img class="cardimg" src="/twilight/img/MidWar.svg" />'; ***REMOVED***
      if (c.p == 2) { html +='<img class="cardimg" src="/twilight/img/LateWar.svg" />'; ***REMOVED***

    switch (c.player) {
      case "both":
        html += '<img class="cardimg" src="/twilight/img/BothPlayerCard.svg" />';
        if (c.ops) {
          html += `<img class="cardimg" src="/twilight/img/White${c.ops***REMOVED***.svg" />`;
          html += `<img class="cardimg" src="/twilight/img/Black${c.ops***REMOVED***.svg" />`;
    ***REMOVED***
        break;
      case "us":
        html +='<img class="cardimg" src="/twilight/img/AmericanPlayerCard.svg" />';
        if (c.ops) { html += `<img class="cardimg" src="/twilight/img/Black${c.ops***REMOVED***.svg" />`; ***REMOVED***
        break;
      case "ussr":
        html +='<img class="cardimg" src="/twilight/img/SovietPlayerCard.svg" />';
        if (c.ops) { html += `<img class="cardimg" src="/twilight/img/White${c.ops***REMOVED***.svg" />`; ***REMOVED***
        break;
      default:
        break;
***REMOVED***
  ***REMOVED***

  if (c.scoring == 1) {
    html +='<img class="cardimg" src="/twilight/img/MayNotBeHeld.svg" />';
  ***REMOVED*** else if (c.recurring == 0) {
    html +='<img class="cardimg" src="/twilight/img/RemoveFromPlay.svg" />';
  ***REMOVED***

  return html
***REMOVED***

showCard(cardname) {

  let url = this.returnCardImage(cardname);

  //
  // mobile needs recentering
  //
  if (this.app.browser.isMobileBrowser(navigator.userAgent)) {
    // add additional html
    url += `
    <div id="cardbox-exit-background">
    <div class="cardbox-exit" id="cardbox-exit">×</div>
    </div>
    <div class="cardbox_menu_playcard cardbox_menu_btn" id="cardbox_menu_playcard">PLAY</div>`
    $('.cardbox-exit').show();
  ***REMOVED***

  $('#cardbox').html(url);
  $('#cardbox').show();
***REMOVED***

hideCard() {
  $('#cardbox').hide();
  //$('.cardbox_event_blocker').css('height','0px');
  //$('.cardbox_event_blocker').css('width','0px');
  //$('.cardbox_event_blocker').css('display','none');
***REMOVED***



//
// OVERWRITES GAME.JS MODULE TO ADD CARD HOVERING
//
updateLog(str, length = 150) {

  let twilight_self = this;

  //
  // workaround repeat messages
  //
  if (str === this.last_log_msg) {
    if (str.indexOf("is affected by") > 0) { return; ***REMOVED***  ***REMOVED***

  this.last_log_msg = str;

  if (str) {
    this.game.log.unshift(str);
    if (this.game.log.length > length) { this.game.log.splice(length); ***REMOVED***
  ***REMOVED***

  let html = '';

  for (let i = 0; i < this.game.log.length; i++) {
    if (i > 0) { html += '<br/>'; ***REMOVED***
    html += "> <span>" + this.game.log[i] + "</span>";
  ***REMOVED***

  if (this.app.BROWSER == 1) {

    $('#log').html(html);
    twilight_self.addLogCardEvents();

    try {
      if (! $('#game_log').isVisible()) {
        $('#game_log').addClass("loading");
  ***REMOVED***
***REMOVED*** catch (err) {***REMOVED***

  ***REMOVED***

***REMOVED***





returnGameOptionsHTML() {

  return `
        <h3>Twilight Struggle: </h3>

        <form id="options" class="options">

          <label for="player1">Play as:</label>
          <select name="player1">
            <option value="random">random</option>
            <option value="ussr" default>USSR</option>
            <option value="us">US</option>
          </select>

          <label for="deck">Deck:</label>
          <select name="deck" id="deckselect" onchange='
if ($("#deckselect").val() == "saito") { $(".saito_edition").prop("checked",true); ***REMOVED*** else { $(".saito_edition").prop("checked", false); if ($("#deckselect").val() == "optional") { $(".optional_edition").prop("checked", false); ***REMOVED*** else { $(".optional_edition").prop("checked", true); ***REMOVED*** ***REMOVED***  '> 
           <option value="original">original</option>
            <option value="optional">optional</option>
            <option value="saito" selected>saito edition</option>
          </select>

          <label for="usbonus">US bonus: </label>
          <select name="usbonus">
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>


          <div onclick='$(".remove_cards_box").show();$(this).html(" ");' style="font-size:0.80em;cursor:pointer;">&gt; advanced...</div>
          <div id="remove_cards_box" class="remove_cards_box" style="display:none">
            <div style="font-size:0.85em;font-weight:bold">remove cards from play: </div>
            <ul id="removecards" class="removecards">
            <li><input class="remove_card" type="checkbox" name="asia" /> Asia Scoring</li>
            <li><input class="remove_card" type="checkbox" name="europe" /> Europe Scoring</li>
            <li><input class="remove_card" type="checkbox" name="mideast" /> Middle-East Scoring</li>
            <li><input class="remove_card" type="checkbox" name="duckandcover" /> Duck and Cover</li>
            <li><input class="remove_card" type="checkbox" name="fiveyearplan" /> Five Year Plan</li>
            <li><input class="remove_card" type="checkbox" name="socgov" /> Socialist Governments</li>
            <li><input class="remove_card" type="checkbox" name="fidel" /> Fidel</li>
            <li><input class="remove_card" type="checkbox" name="vietnamrevolts" /> Vietnam Revolts</li>
            <li><input class="remove_card" type="checkbox" name="blockade" /> Blockade</li>
            <li><input class="remove_card" type="checkbox" name="koreanwar" /> Korean War</li>
            <li><input class="remove_card" type="checkbox" name="romanianab" /> Romanian Abdication</li>
            <li><input class="remove_card" type="checkbox" name="arabisraeli" /> Arab Israeli War</li>
            <li><input class="remove_card" type="checkbox" name="comecon" /> Comecon</li>
            <li><input class="remove_card" type="checkbox" name="nasser" /> Nasser</li>
            <li><input class="remove_card" type="checkbox" name="warsawpact" /> Warsaw Pact</li>
            <li><input class="remove_card" type="checkbox" name="degualle" /> De Gualle Leads France</li>
            <li><input class="remove_card" type="checkbox" name="naziscientist" /> Nazi Scientists Captured</li>
            <li><input class="remove_card" type="checkbox" name="truman" /> Truman</li>
            <li><input class="remove_card saito_edition" type="checkbox" name="olympic" checked /> Olympic Games</li>
            <li><input class="remove_card" type="checkbox" name="nato" /> NATO</li>
            <li><input class="remove_card" type="checkbox" name="indreds" /> Independent Reds</li>
            <li><input class="remove_card" type="checkbox" name="marshall" /> Marshall Plan</li>
            <li><input class="remove_card" type="checkbox" name="indopaki" /> Indo-Pakistani War</li>
            <li><input class="remove_card" type="checkbox" name="containment" /> Containment</li>
            <li><input class="remove_card" type="checkbox" name="cia" /> CIA Created</li>
            <li><input class="remove_card" type="checkbox" name="usjapan" /> US/Japan Defense Pact</li>
            <li><input class="remove_card" type="checkbox" name="suezcrisis" /> Suez Crisis</li>
            <li><input class="remove_card" type="checkbox" name="easteuropean" /> East European Unrest</li>
            <li><input class="remove_card" type="checkbox" name="decolonization" /> Decolonization</li>
            <li><input class="remove_card" type="checkbox" name="redscare" /> Red Scare</li>
            <li><input class="remove_card" type="checkbox" name="unintervention" /> UN Intervention</li>
            <li><input class="remove_card" type="checkbox" name="destalinization" /> Destalinization</li>
            <li><input class="remove_card" type="checkbox" name="nucleartestban" /> Nuclear Test Ban Treaty</li>
            <li><input class="remove_card" type="checkbox" name="formosan" /> Formosan Resolution</li>
            <li><input class="remove_card optional_edition" type="checkbox" name="defectors" /> Defectors</li>
            <li><input class="remove_card optional_edition " type="checkbox" name="specialrelation" /> Special Relationship</li>
            <li><input class="remove_card optional_edition" type="checkbox" name="cambridge" /> The Cambridge Five</li>
            <li><input class="remove_card optional_edition" type="checkbox" name="norad" /> NORAD</li>
          </ul>
          <ul class="removecards" style="clear:both;margin-top:13px">
            <li><input class="remove_card" type="checkbox" name="brushwar" /> Brush War</li>
            <li><input class="remove_card" type="checkbox" name="centralamerica" /> Central America Scoring</li>
            <li><input class="remove_card" type="checkbox" name="seasia" /> Southeast Asia Scoring</li>
            <li><input class="remove_card" type="checkbox" name="armsrace" /> Arms Race</li>
            <li><input class="remove_card" type="checkbox" name="cubanmissile" /> Cuban Missile Crisis</li>
            <li><input class="remove_card" type="checkbox" name="nuclearsubs" /> Nuclear Subs</li>
            <li><input class="remove_card" type="checkbox" name="quagmire" /> Quagmire</li>
            <li><input class="remove_card" type="checkbox" name="saltnegotiations" /> Salt Negotiations</li>
            <li><input class="remove_card" type="checkbox" name="beartrap" /> Bear Trap</li>
            <li><input class="remove_card saito_edition" type="checkbox" name="summit" checked /> Summit</li>
            <li><input class="remove_card" type="checkbox" name="howilearned" /> How I Learned to Stop Worrying</li>
            <li><input class="remove_card" type="checkbox" name="junta" /> Junta</li>
            <li><input class="remove_card" type="checkbox" name="kitchendebates" /> Kitchen Debates</li>
            <li><input class="remove_card" type="checkbox" name="missileenvy" /> Missile Envy</li>
            <li><input class="remove_card" type="checkbox" name="wwby" /> We Will Bury You</li>
            <li><input class="remove_card" type="checkbox" name="brezhnev" /> Brezhnev Doctrine</li>
            <li><input class="remove_card" type="checkbox" name="portuguese" /> Portuguese Empire Crumbles</li>
            <li><input class="remove_card" type="checkbox" name="southafrican" /> South African Unrest</li>
            <li><input class="remove_card" type="checkbox" name="allende" /> Allende</li>
            <li><input class="remove_card" type="checkbox" name="willybrandt" /> Willy Brandt</li>
            <li><input class="remove_card" type="checkbox" name="muslimrevolution" /> Muslim Revolution</li>
            <li><input class="remove_card" type="checkbox" name="abmtreaty" /> ABM Treaty</li>
            <li><input class="remove_card" type="checkbox" name="culturalrev" /> Cultural Revolution</li>
            <li><input class="remove_card" type="checkbox" name="flowerpower" /> Flower Power</li>
            <li><input class="remove_card" type="checkbox" name="u2" /> U-2 Incident</li>
            <li><input class="remove_card" type="checkbox" name="opec" /> OPEC</li>
            <li><input class="remove_card" type="checkbox" name="lonegunman" /> Lone Gunman</li>
            <li><input class="remove_card" type="checkbox" name="colonial" /> Colonial</li>
            <li><input class="remove_card" type="checkbox" name="panamacanal" /> Panama Canal</li>
            <li><input class="remove_card" type="checkbox" name="campdavid" /> Camp David Accords</li>
            <li><input class="remove_card" type="checkbox" name="puppet" /> Puppet Governments</li>
            <li><input class="remove_card" type="checkbox" name="grainsales" /> Grain Sales to Soviets</li>
            <li><input class="remove_card" type="checkbox" name="johnpaul" /> John Paul</li>
            <li><input class="remove_card" type="checkbox" name="deathsquads" /> Death Squads</li>
            <li><input class="remove_card" type="checkbox" name="oas" /> OAS Founded</li>
            <li><input class="remove_card" type="checkbox" name="nixon" /> Nixon Plays the China Card</li>
            <li><input class="remove_card" type="checkbox" name="sadat" /> Sadat Expels Soviets</li>
            <li><input class="remove_card" type="checkbox" name="shuttle" /> Shuttle Diplomacy</li>
            <li><input class="remove_card" type="checkbox" name="voiceofamerica" /> Voice of America</li>
            <li><input class="remove_card" type="checkbox" name="liberation" /> Liberation Theology</li>
            <li><input class="remove_card" type="checkbox" name="ussuri" /> Ussuri River Skirmish</li>
            <li><input class="remove_card" type="checkbox" name="asknot" /> Ask Not What Your Country Can Do For You</li>
            <li><input class="remove_card" type="checkbox" name="alliance" /> Alliance for Progress</li>
            <li><input class="remove_card" type="checkbox" name="africa" /> Africa Scoring</li>
            <li><input class="remove_card" type="checkbox" name="onesmallstep" /> One Small Step</li>
            <li><input class="remove_card" type="checkbox" name="southamerica" /> South America</li>
            <li><input class="remove_card optional_edition" type="checkbox" name="che" /> Che</li>
            <li><input class="remove_card optional_edition" type="checkbox" name="tehran" /> Our Man in Tehran</li>
          </ul>
          <ul class="removecards" style="clear:both;margin-top:13px">
            <li><input class="remove_card" type="checkbox" name="iranianhostage" /> Iranian Hostage Crisis</li>
            <li><input class="remove_card" type="checkbox" name="ironlady" /> The Iron Lady</li>
            <li><input class="remove_card" type="checkbox" name="reagan" /> Reagan Bombs Libya</li>
            <li><input class="remove_card" type="checkbox" name="starwars" /> Star Wars</li>
            <li><input class="remove_card" type="checkbox" name="northseaoil" /> North Sea Oil</li>
            <li><input class="remove_card" type="checkbox" name="reformer" /> The Reformer</li>
            <li><input class="remove_card" type="checkbox" name="marine" /> Marine Barracks Bombing</li>
            <li><input class="remove_card" type="checkbox" name="KAL007" /> Soviets Shoot Down KAL-007</li>
            <li><input class="remove_card" type="checkbox" name="glasnost" /> Glasnost</li>
            <li><input class="remove_card" type="checkbox" name="ortega" /> Ortega Elected in Nicaragua</li>
            <li><input class="remove_card" type="checkbox" name="terrorism" /> Terrorism</li>
            <li><input class="remove_card" type="checkbox" name="ironcontra" /> Iran Contra Scandal</li>
            <li><input class="remove_card" type="checkbox" name="chernobyl" /> Chernobyl</li>
            <li><input class="remove_card" type="checkbox" name="debtcrisis" /> Latin American Debt Crisis</li>
            <li><input class="remove_card" type="checkbox" name="teardown" /> Tear Down this Wall</li>
            <li><input class="remove_card" type="checkbox" name="evilempire" /> An Evil Empire</li>
            <li><input class="remove_card" type="checkbox" name="aldrichames" /> Aldrich Ames Remix</li>
            <li><input class="remove_card" type="checkbox" name="pershing" /> Pershing II Deployed</li>
            <li><input class="remove_card" type="checkbox" name="wargames" /> Wargames</li>
            <li><input class="remove_card" type="checkbox" name="solidarity" /> Solidarity</li>
            <li><input class="remove_card optional_edition" type="checkbox" name="iraniraq" /> Iran-Iraq War</li>
            <li><input class="remove_card optional_edition" type="checkbox" name="yuri" /> Yuri and Samantha</li>
            <li><input class="remove_card optional_edition" type="checkbox" name="awacs" /> AWACS Sale to Saudis</li>
          </ul>

          <div style="font-size:0.85em;font-weight:bold;clear:both;margin-top:10px;">add cards to game: </div>
          <ul id="removecards" class="removecards">
            <li><input class="remove_card saito_edition" type="checkbox" name="culturaldiplomacy" checked /> Cultural Diplomacy (Early-War)</li>
            <li><input class="remove_card saito_edition" type="checkbox" name="handshake" checked /> Handshake in Space (Mid-War)</li>
            <li><input class="remove_card saito_edition" type="checkbox" name="rustinredsquare" checked /> Rust Lands in Red Square (Late-War)</li>
            <li><input class="remove_card" type="checkbox" name="gouzenkoaffair" /> Gouzenko Affair (Early-War)</li>
            <li><input class="remove_card saito_edition" type="checkbox" name="berlinagreement" checked /> 1971 Berlin Agreement (Mid-War)</li>
          </div>
        </form>

        `;

***REMOVED***

settleVPOutstanding() {

  if (this.game.state.vp_outstanding != 0) {
    this.game.state.vp += this.game.state.vp_outstanding;
  ***REMOVED***
  this.game.state.vp_outstanding = 0;
  this.updateVictoryPoints();

***REMOVED***

addShowCardEvents() {

  let twilight_self = this;

  if (!this.app.browser.isMobileBrowser(navigator.userAgent)) {

    $('.showcard').off();
    $('.showcard').mouseover(function() {
      let card = $(this).attr("id");
      twilight_self.showCard(card);
***REMOVED***).mouseout(function() {
      let card = $(this).attr("id");
      twilight_self.hideCard(card);
***REMOVED***);

  ***REMOVED***

***REMOVED***
addLogCardEvents() {

  let twilight_self = this;

  if (!this.app.browser.isMobileBrowser(navigator.userAgent)) {

    $('.logcard').off();
    $('.logcard').mouseover(function() {
      let card = $(this).attr("id");
      twilight_self.showCard(card);
***REMOVED***).mouseout(function() {
      let card = $(this).attr("id");
      twilight_self.hideCard(card);
***REMOVED***);

  ***REMOVED***

***REMOVED***

returnQuickLinkGameOptions(options) {
  let new_options = {***REMOVED***;
  for (var index in options) {
    if (index == "player1") {
      new_options[index] = options[index] == "ussr" ? "us" : "ussr";
***REMOVED*** else {
      new_options[index] = options[index]
***REMOVED***
  ***REMOVED***

  return new_options;
***REMOVED***



formatStatusHeader(status_header, include_back_button=false) {
  let back_button_html = `<i class="fa fa-arrow-left" id="back_button"></i>`;
  return `
  <div>
    ${include_back_button ? back_button_html : ""***REMOVED***
    <div style="text-align: center;">
      ${status_header***REMOVED***
    </div>
  </div>
  `
***REMOVED***


***REMOVED*** // end Twilight class

module.exports = Twilight;










