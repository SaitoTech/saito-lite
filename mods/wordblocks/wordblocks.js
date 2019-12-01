var saito = require('../../lib/saito/saito');
var GameTemplate = require('../../lib/templates/gametemplate');


class Wordblocks extends GameTemplate {

  constructor(app) {

    super(app);

    this.name = "Wordblocks";

    this.wordlist="";
    this.letterset= {***REMOVED***;
    this.mydeck = {***REMOVED***;
    this.score="";
    this.app = app;
    this.name = "Wordblocks";
    this.description = `Wordblocks is a word game in which two to four players score points by placing tiles bearing a single letter onto a board divided into a 15×15 grid of squares. The tiles must form words that, in crossword fashion, read left to right in rows or downward in columns, and be included in a standard dictionary or lexicon.`;

    //
    // Game Class VARS
    //
    this.minPlayers = 2;
    this.maxPlayers = 4;
    this.type       = "Wordgame";
    this.useHUD = 1;


    this.gameboardWidth = 2677;
    this.tileHeight = 163;
    this.tileWidth = 148;
    this.letters = {***REMOVED***;
    this.moves = [];
    this.firstmove = 1;
    this.last_played_word = { player: '', finalword: '', score: '' ***REMOVED***;

    return this;

  ***REMOVED***


  showTiles() {
    if (this.game.deck.length == 0) {
      return;
***REMOVED***

    let html = "";

    for (let i = 0; i < this.game.deck[0].hand.length; i++) {
      html += this.returnTileHTML(this.game.deck[0].cards[this.game.deck[0].hand[i]].name);
***REMOVED***

    $('.tiles').html(html);
    $('#remainder').html("Tiles left: " + this.game.deck[0].crypt.length);

  ***REMOVED***


  initializeGame(game_id) {

console.log("INITIALIZE GAME");

//    if (!this.app.browser.isMobileBrowser(navigator.userAgent)) {
//      const chat = this.app.modules.returnModule("Chat");
//      chat.addPopUpChat();
//***REMOVED***
    this.updateStatus("loading game...");
    this.loadGame(game_id);

    if (this.game.status != "") {
      this.updateStatus(this.game.status);
***REMOVED***

    var dictionary = this.game.options.dictionary;
    let durl = "/wordblocks/dictionaries/" + dictionary + "/" + dictionary + ".js";
    let xhr = new XMLHttpRequest();
    xhr.open('GET', durl, false);

    try {
      xhr.send();
      if (xhr.status != 200) {
        salert(`Network issues downloading dictionary -- ${durl***REMOVED***`);
  ***REMOVED*** else {
	//
	// TODO -- dictionary should be JSON
	//
	eval(xhr.response);
        this.wordlist = wordlist;
  ***REMOVED***
***REMOVED*** catch(err) { // instead of onerror
      salert("Network issues downloading dictionary");
***REMOVED***

console.log("\n\n\nDOWNLOADED WORDLIST: " + JSON.stringify(this.wordlist));

    //
    // deal cards 
    //
    if (this.game.deck.length == 0 && this.game.step.game == 0) {

      this.updateStatus("Generating the Game");

      if (this.game.opponents.length == 1) {
        this.game.queue.push("READY");
        this.game.queue.push("DEAL\t1\t2\t7");
        this.game.queue.push("DEAL\t1\t1\t7");
        this.game.queue.push("DECKENCRYPT\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t1");
        this.game.queue.push("DECKXOR\t1\t2");
        this.game.queue.push("DECKXOR\t1\t1");
  ***REMOVED***

      if (this.game.opponents.length == 2) {
        this.game.queue.push("READY");
        this.game.queue.push("DEAL\t1\t3\t7");
        this.game.queue.push("DEAL\t1\t2\t7");
        this.game.queue.push("DEAL\t1\t1\t7");
        this.game.queue.push("DECKENCRYPT\t1\t3");
        this.game.queue.push("DECKENCRYPT\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t1");
        this.game.queue.push("DECKXOR\t1\t3");
        this.game.queue.push("DECKXOR\t1\t2");
        this.game.queue.push("DECKXOR\t1\t1");
  ***REMOVED***

      if (this.game.opponents.length == 3) {
        this.game.queue.push("READY");
        this.game.queue.push("DEAL\t1\t4\t7");
        this.game.queue.push("DEAL\t1\t3\t7");
        this.game.queue.push("DEAL\t1\t2\t7");
        this.game.queue.push("DEAL\t1\t1\t7");
        this.game.queue.push("DECKENCRYPT\t1\t4");
        this.game.queue.push("DECKENCRYPT\t1\t3");
        this.game.queue.push("DECKENCRYPT\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t1");
        this.game.queue.push("DECKXOR\t1\t4");
        this.game.queue.push("DECKXOR\t1\t3");
        this.game.queue.push("DECKXOR\t1\t2");
        this.game.queue.push("DECKXOR\t1\t1");
  ***REMOVED***
      let tmp_json = JSON.stringify(this.returnDeck());
      this.game.queue.push("DECK\t1\t" + tmp_json);
***REMOVED***;

console.log("INITIALIZE GAME 2");


    //
    // stop here if initializing
    //
    if (this.game.initializing == 1) { return; ***REMOVED***







    resizeBoard = function resizeBoard(app) {

    /*  if (this.window && !app.browser.isMobileBrowser(navigator.userAgent)) {

        let height = this.screen.height;
        let width = this.screen.width;

        if (width < 900) {
          if (width > 500) {
            $('.main').css('zoom', (width / 905));
            $('.rack').css('zoom', (width / 905));
            $('h').css('zoom', (width / 905));
      ***REMOVED*** else {
            $('.main').css('zoom', 500 / 900);
            $('.rack').css('zoom', 500 / 900);
            $('#tiles > div.tile').css('zoom', 500 / 900);
      ***REMOVED***
    ***REMOVED***

        if (height < 900) {
          if (height > 500) {
            $('.main').css('zoom', (height / 905));
            $('.rack').css('zoom', (height / 905));
            $('#tiles > div.tile').css('zoom', (height / 905));
      ***REMOVED*** else {
            $('.main').css('zoom', 500 / 900);
            $('.rack').css('zoom', 500 / 900);
            $('#tiles > div.tile').css('zoom', 500 / 900);
      ***REMOVED***
    ***REMOVED***

        if (height > 900 && width > 900) {
          $('.main').css('zoom', 1);
          $('.rack').css('zoom', 1);
          $('#tiles > div.tile').css('zoom', 1);
    ***REMOVED***

        if (height < 1125) {
          $('#controls').addClass('fixedbottom');
          $('.main').addClass('mainfixedbottom');
    ***REMOVED*** else {
          $('#controls').removeClass('fixedbottom');
          $('.main').removeClass('mainfixedbottom');
    ***REMOVED***
  ***REMOVED*** */
***REMOVED***;



    responsive = function responsive() {***REMOVED***;

    //
    // show tiles
    //
    this.showTiles();

    //
    // initialize scoreboard
    //
    let html = "";
    let am_i_done = 0;
    let players = 1;

    if (this.game.opponents != undefined) {
      players = this.game.opponents.length + 1;
***REMOVED***

    let score = [];

    if (this.game.score == undefined) {
      this.game.score = [];

      for (let i = 0; i < players; i++) {
        this.game.score[i] = 0;
  ***REMOVED***
***REMOVED***

    var op = 0;
    for (let i = 0; i < players; i++) {
      let this_player = i + 1;

      if (this.game.player == this_player) {
        html += `
          <div class="player">
            <span class="player_name">Your Score</span>
            <span id="score_${this_player***REMOVED***"> ${this.game.score[i]***REMOVED*** </span>
          </div>
        `;
  ***REMOVED*** else {
        let opponent = this.game.opponents[op];
        op++;
        html += `
          <div class="player">
            <span class="player_name">${opponent.substring(0, 16)***REMOVED***</span>
            <span id="score_${this_player***REMOVED***"> ${this.game.score[i]***REMOVED*** </span>
          </div>
        `;
  ***REMOVED***
***REMOVED***

    if (this.browser_active == 1) {
      $('.score').html(html);
***REMOVED***

    if (this.game.target == this.game.player) {
      this.updateStatusWithTiles("YOUR TURN: click on the board to place tiles, or <span class=\"link tosstiles\">discard tiles</span>.");
      this.enableEvents();
***REMOVED*** else {
      this.updateStatusWithTiles(`Waiting for Player ${this.game.target***REMOVED*** to move.`);
      this.disableEvents();
***REMOVED***

    //
    // return letters
    //
    this.letters = this.returnLetters();

    //
    // initialize interface
    //
    resizeBoard(this.app);

    //
    // load any existing tiles
    //
    if (this.game.board == undefined) {
      //
      // new board
      //
      this.game.board = this.returnBoard();
***REMOVED*** else {
      //
      // load board
      //
      for (var i in this.game.board) {
        let divname = "#" + i;
        let letter = this.game.board[i].letter; // $(divname).html(this.returnTile(letter));
        this.addTile($(divname), letter);
        if (!(letter == "_") && !(letter == "")) {
          $(divname).addClass("set");
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    //
    // has a move been made
    //
    for (let i = 1; i < 16; i++) {
      for (let k = 1; k < 16; k++) {
        let boardslot = i + "_" + k;
        if (this.game.board[boardslot].letter != "_") {
          this.firstmove = 0;
    ***REMOVED***
  ***REMOVED***
***REMOVED***


    //
    // attach events
    //
    if (this.game.target == this.game.player) {
      this.addEventsToBoard();
***REMOVED***

    $('#shuffle').on('click', function () {
      for (var i = $('#tiles').children.length; i >= 0; i--) {
        $('#tiles')[0].appendChild($('#tiles')[0].childNodes[Math.random() * i | 0]);
  ***REMOVED***
***REMOVED***);
    $('#tiles').sortable();
    $('#tiles').disableSelection();
    $(window).resize(function () {
      resizeBoard();
***REMOVED***);

    var element = document.getElementById('gameboard');

    if (element !== null) {
/********
      var hammertime = new Hammer(element, {***REMOVED***);

      hammertime.get('pinch').set({ enable: true ***REMOVED***);
      hammertime.get('pan').set({ threshold: 0 ***REMOVED***);

      var fixHammerjsDeltaIssue = undefined;
      var pinchStart = { x: undefined, y: undefined ***REMOVED***
      var lastEvent = undefined;

      var originalSize = {
        width: window.screen.width,
        height: window.screen.width
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

        var top = box.top + scrollTop - clientTop;
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


      function getCoordinateShiftDueToScale(size, scale) {
        var newWidth = scale * size.width;
        var newHeight = scale * size.height;
        var dx = (newWidth - size.width) / 2
        var dy = (newHeight - size.height) / 2
        return {
          x: dx,
          y: dy
    ***REMOVED***
  ***REMOVED***

      hammertime.on('pan', function (e) {
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

      hammertime.on('pinch', function (e) {
        var d = scaleFrom(pinchZoomOrigin, last.z, last.z * e.scale)

        let newX = d.x + last.x + e.deltaX;
        let newY = d.y + last.y + e.deltaY;
        let newZ = d.z + last.z;

        current.x = newX;
        current.y = newY;
        current.z = newZ;
        lastEvent = 'pinch';
        update();
  ***REMOVED***);

      var pinchZoomOrigin = undefined;
      hammertime.on('pinchstart', function (e) {
        pinchStart.x = e.center.x;
        pinchStart.y = e.center.y;
        pinchZoomOrigin = getRelativePosition(element, { x: pinchStart.x, y: pinchStart.y ***REMOVED***, originalSize, current.z);
        lastEvent = 'pinchstart';
  ***REMOVED***);

      hammertime.on('panend', function (e) {
        last.x = current.x;
        last.y = current.y;
        lastEvent = 'panend';
  ***REMOVED***);

      hammertime.on('pinchend', function (e) {
        if ((originalSize.height * current.z) <= originalSize.height &&
          (originalSize.width * current.z) <= originalSize.width) {
          return;
    ***REMOVED***

        last.x = current.x;
        last.y = current.y;
        last.z = current.z;
        lastEvent = 'pinchend';
  ***REMOVED***);

      function update() {
        if ((originalSize.height * current.z) < originalSize.height && (originalSize.width * current.z) < originalSize.width) {
          if (current.z < 1) {
            element.style.transform = `translate3d(0, 0, 0) scale(1)`;
            current = { x: 0, y: 0, z: 1 ***REMOVED***;
            last = {
              x: current.x,
              y: current.y,
              z: current.z
        ***REMOVED***
            return;
      ***REMOVED***
    ***REMOVED***

        current.height = originalSize.height * current.z;
        current.width = originalSize.width * current.z;

        element.style.transform = "translate3d(" + current.x + "px, " + current.y + "px, 0) scale(" + current.z + ")";
  ***REMOVED***
*****/
***REMOVED***

    $('#game_status').on('click', () => {
      $('.log').hide();
      if (this.app.browser.isMobileBrowser(navigator.userAgent) && window.matchMedia("(orientation: portrait)").matches || window.innerHeight > 700) {
        $("#sizer").switchClass("fa-caret-up", "fa-caret-down");
        $("#hud").switchClass("short", "tall", 150);
  ***REMOVED*** else {
        $("#sizer").switchClass("fa-caret-left", "fa-caret-right");
        $("#hud").switchClass("narrow", "wide", 150);
  ***REMOVED***

      $('.hud_menu_overlay').hide();
      $('.status').show();
***REMOVED***);

  ***REMOVED***


  updateStatusWithTiles(status) {
    let tile_html = '';
    for (let i = 0; i < this.game.deck[0].hand.length; i++) {
      tile_html += this.returnTileHTML(this.game.deck[0].cards[this.game.deck[0].hand[i]].name);
***REMOVED***
    let { player, finalword, score ***REMOVED*** = this.last_played_word;
    let last_move_html = finalword == '' ? '...' : `Player ${player***REMOVED*** played ${finalword***REMOVED*** for: ${score***REMOVED*** points.`;
    let html =
      `
      <div>${status***REMOVED***</div>
      <div class="status_container">
        <div style="display: flex; font-size: 0.8rem;">
          <div id="remainder" class="remainder">Tiles left: ${this.game.deck[0].crypt.length***REMOVED***</div>
          <div id="lastmove" class="lastmove">
          ${last_move_html***REMOVED***
          </div>
        </div>
        <div class="rack" id="rack">
        <img id="shuffle" class="shuffle" src="/wordblocks/img/reload.png">
          <div class="tiles" id="tiles">
            ${tile_html***REMOVED***
          </div>
        </div>
        <div class="score" id="score">loading...</div>
      </div
    `
    $('.status').html(html);
    this.calculateScore();
    this.enableEvents();
  ***REMOVED***



  async calculateScore() {
    let html = "";
    let am_i_done = 0;
    let players = 1;

    if (this.game.opponents != undefined) {
      players = this.game.opponents.length + 1;
***REMOVED***

    let score = [];

    if (this.game.score == undefined) {
      this.game.score = [];
 
      for (let i = 0; i < players; i++) {
        this.game.score[i] = 0;
  ***REMOVED***
***REMOVED***

    var op = 0;
    for (let i = 0; i < players; i++) {
      let this_player = i + 1;

      if (this.game.player == this_player) {
        html += `
          <div class="player">
            <span class="player_name">Your Score</span>
            <span class="player_score" id="score_${this_player***REMOVED***"> ${this.game.score[i]***REMOVED*** </span>
          </div>
        `;
  ***REMOVED*** else {
***REMOVED***let opponent = await this.app.dns.fetchIdentifierPromise(this.game.opponents[op]);
        let opponent = this.game.opponents[op];
        op++;
        html += `
          <div class="player">
            <span class="player_name">${opponent.substring(0, 16)***REMOVED***</span>
            <span class="player_score" id="score_${this_player***REMOVED***"> ${this.game.score[i]***REMOVED*** </span>
          </div>
        `;
  ***REMOVED***
***REMOVED***

    if (this.browser_active == 1) {
      $('.score').html(html);
***REMOVED***
  ***REMOVED***



  returnTileHTML(letter) {
    let html = "";
    let letterScore = this.returnLetters();
    html = '<div class="tile ' + letter + ' sc'+ letterScore[letter].score + '">' + letter + '</div>';
    return html;
  ***REMOVED***


  addTile(obj, letter) {
    if (letter !== "_") {
      obj.find('.bonus').css('display', 'none');
      obj.append(this.returnTileHTML(letter));
***REMOVED***
  ***REMOVED***



  disableEvents() {
    if (this.browser_active == 1) {
      $('.slot').off();
***REMOVED***
  ***REMOVED***


  enableEvents() {
    if (this.browser_active == 1) {
      this.addEventsToBoard();
***REMOVED***
  ***REMOVED***


  async addEventsToBoard() {
    let wordblocks_self = this;
    $('.tosstiles').off();
    $('.tosstiles').on('click', async function () {
      tiles = await sprompt("Which tiles do you want to discard? Tossed tiles count against your score:");

      if (tiles) {
        salert("Tossed: " + tiles);
        wordblocks_self.removeTilesFromHand(tiles);
        wordblocks_self.addMove("turn\t" + wordblocks_self.game.player);
        let cards_needed = 7;
        cards_needed = cards_needed - wordblocks_self.game.deck[0].hand.length;

        if (cards_needed > wordblocks_self.game.deck[0].crypt.length) {
          cards_needed = wordblocks_self.game.deck[0].crypt.length;
    ***REMOVED***

        if (cards_needed > 0) {
          wordblocks_self.addMove("DEAL\t1\t" + wordblocks_self.game.player + "\t" + cards_needed);
    ***REMOVED***

        wordblocks_self.showTiles();
        wordblocks_self.endTurn();
  ***REMOVED***
***REMOVED***);

    $('.slot').off();
    $('.slot').on('click', function () {
      let divname = $(this).attr("id");
      let html = `
        <div class="tile-placement-controls">
          <span class="action" id="horizontally"><i class="fas fa-arrows-alt-h"></i> horizontally</span>
          <span class="action" id="vertically"><i class="fas fa-arrows-alt-v"></i> vertically</span>
          <span class="action" id="cancel"><i class="far fa-window-close"></i> cancel</span>
        </div>`;
      let tmpx = divname.split("_");
      let y = tmpx[0];
      let x = tmpx[1];
      let orientation = "";
      let word = "";

      let offsetX = wordblocks_self.app.browser.isMobileBrowser(navigator.userAgent) ? 25 : 55;
      let offsetY = wordblocks_self.app.browser.isMobileBrowser(navigator.userAgent) ? 25 : 55;

      let greater_offsetX = wordblocks_self.app.browser.isMobileBrowser(navigator.userAgent) ? 135 : 155;
      let greater_offsetY = wordblocks_self.app.browser.isMobileBrowser(navigator.userAgent) ? 135 : 155;

      let left = $(this).offset().left + offsetX;
      let top = $(this).offset().top + offsetY;

      if (x > 8) { left -= greater_offsetX; ***REMOVED***
      if (y > 8) { top -= greater_offsetY; ***REMOVED***

      $('.tile-placement-controls').remove();

      if (wordblocks_self.app.browser.isMobileBrowser(navigator.userAgent)) {
        let tile_html = '';
        for (let i = 0; i < wordblocks_self.game.deck[0].hand.length; i++) {
          tile_html += wordblocks_self.returnTileHTML(wordblocks_self.game.deck[0].cards[wordblocks_self.game.deck[0].hand[i]].name);
    ***REMOVED***
        let updated_status = `
        <div class="rack" id="rack">
          <div class="tiles" id="tiles">
            ${tile_html***REMOVED***
          </div>
          <img id="shuffle" class="shuffle" src="/wordblocks/img/reload.png">
        </div>
        ${html***REMOVED***
        `
        $('.status').html(updated_status);
        wordblocks_self.enableEvents();
  ***REMOVED*** else {
        $('body').append(html);
        $('.tile-placement-controls').addClass("active-status");
        $('.tile-placement-controls').css({ "position": "absolute", "top": top, "left": left ***REMOVED***);
  ***REMOVED***

      $('.action').off();
      $('.action').on('click', async function () {

        let action2 = $(this).attr("id");

        if (action2 == "horizontally") {
          orientation = "horizontal";
    ***REMOVED***

        if (action2 == "vertically") {
          orientation = "vertical";
    ***REMOVED***

        if (action2 == "cancel") {

          $('.action').off();
          $('.tile-placement-controls').remove();
          wordblocks_self.updateStatusWithTiles("Click on the board to place a letter from that square, or <span class=\"link tosstiles\">discard tiles</span> if you cannot move.");
          wordblocks_self.addEventsToBoard();
          return;
    ***REMOVED***

        word = await sprompt("Provide your word:");

        if (word) {
  ***REMOVED***
  ***REMOVED*** reset board
  ***REMOVED***
          $('.tile-placement-controls').html('');
          $('.status').html("Processing your turn.");

  ***REMOVED***
  ***REMOVED*** if entry is valid
  ***REMOVED***
          if (wordblocks_self.isEntryValid(word, orientation, x, y) == 1) {
            let myscore = 0;
            wordblocks_self.addWordToBoard(word, orientation, x, y);
            myscore = wordblocks_self.scoreWord(word, wordblocks_self.game.player, orientation, x, y);

            if (myscore <= 1) {
              wordblocks_self.removeWordFromBoard(word, orientation, x, y);
              wordblocks_self.updateStatusWithTiles(
                `Try again! Click on the board to place a letter from that square, or
                <span class="link tosstiles">discard tiles</span> if you cannot move.`
              );
              wordblocks_self.addEventsToBoard();
        ***REMOVED*** else {
              wordblocks_self.setBoard(word, orientation, x, y); 

	      //
      ***REMOVED*** place word on board
      ***REMOVED***
              wordblocks_self.addMove("place\t" + word + "\t" + wordblocks_self.game.player + "\t" + x + "\t" + y + "\t" + orientation);
	      //
      ***REMOVED*** discard tiles
      ***REMOVED***
              wordblocks_self.discardTiles(word, orientation, x, y);

	      //
      ***REMOVED*** get new cards
      ***REMOVED***
              let cards_needed = 7;
              cards_needed = cards_needed - wordblocks_self.game.deck[0].hand.length;

              if (cards_needed > wordblocks_self.game.deck[0].crypt.length) {
                cards_needed = wordblocks_self.game.deck[0].crypt.length;
          ***REMOVED***

              if (cards_needed > 0) {
                wordblocks_self.addMove("DEAL\t1\t" + wordblocks_self.game.player + "\t" + cards_needed);
          ***REMOVED***

              wordblocks_self.exhaustWord(word, orientation, x, y);
              wordblocks_self.addScoreToPlayer(wordblocks_self.game.player, myscore);

              if (wordblocks_self.checkForEndGame() == 1) {
                return;
          ***REMOVED***

              $('#remainder').html("Tiles left: " + wordblocks_self.game.deck[0].crypt.length);
              wordblocks_self.endTurn();
        ***REMOVED***;

      ***REMOVED*** else {
            wordblocks_self.updateStatusWithTiles(
              `Word is not valid, try again! Click on the board to place a word, or
              <span class="link tosstiles">discard tiles</span>`
            );
            wordblocks_self.addEventsToBoard();
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***);
***REMOVED***);

    $('#shuffle').on('click', function () {
      for (var i = $('#tiles').children.length; i >= 0; i--) {
        $('#tiles')[0].appendChild($('#tiles')[0].childNodes[Math.random() * i | 0]);
  ***REMOVED***
***REMOVED***);
    $('#tiles').sortable();
    $('#tiles').disableSelection();
    //$(window).resize(function () { resizeBoard(); ***REMOVED***);
  ***REMOVED***


  removeTilesFromHand(word) {

    while (word.length > 0) {
      let tmpx = word[0];
      tmpx = tmpx.toUpperCase();

      for (let i = 0; i < this.game.deck[0].hand.length; i++) {
        if (this.game.deck[0].cards[this.game.deck[0].hand[i]].name == tmpx) {
          this.game.deck[0].hand.splice(i, 1);
          i = this.game.deck[0].hand.length;
    ***REMOVED***
  ***REMOVED***

      if (word.length > 1) {
        word = word.substring(1);
  ***REMOVED*** else {
        word = "";
  ***REMOVED***
***REMOVED***
  ***REMOVED***


  isEntryValid(word, orientation, x, y) {

    let valid_placement = 1;
    let tmphand = JSON.parse(JSON.stringify(this.game.deck[0].hand));
    x = parseInt(x);
    y = parseInt(y);

    //
    // if this is the first word, it has to cross a critical star
    //
    if (this.firstmove == 1) {
      if (orientation == "vertical") {
        if (x != 6 && x != 10) {
          salert("First Word must be placed to cross a Star");
          return 0;
    ***REMOVED***

        let starting_point = y;
        let ending_point = y + word.length - 1;

        if (starting_point <= 6 && ending_point >= 6 || starting_point <= 10 && ending_point >= 6) { ***REMOVED*** else {
          salert("First Word must be long enough to cross a Star");
          return 0;
    ***REMOVED***
  ***REMOVED***

      if (orientation == "horizontal") {
        if (y != 6 && y != 10) {
          salert("First Word must be placed to cross a Star");
          return 0;
    ***REMOVED***

        let starting_point = x;
        let ending_point = x + word.length - 1;

        if (starting_point <= 6 && ending_point >= 6 || starting_point <= 10 && ending_point >= 6) { ***REMOVED*** else {
          salert("First Word must be long enough to cross a Star");
          return 0;
    ***REMOVED***
  ***REMOVED*** //this.firstmove = 0;
***REMOVED***

    for (let i = 0; i < word.length; i++) {
      let boardslot = "";
      let letter = word[i].toUpperCase();

      if (orientation == "horizontal") {
        boardslot = y + "_" + (x + i);
  ***REMOVED***

      if (orientation == "vertical") {
        boardslot = y + i + "_" + x;
  ***REMOVED***

      if (this.game.board[boardslot].letter != "_") {
        if (this.game.board[boardslot].letter != letter) {
          valid_placement = 0;
    ***REMOVED***
  ***REMOVED*** else {
        let letter_found = 0;

        for (let k = 0; k < tmphand.length; k++) {
          if (this.game.deck[0].cards[tmphand[k]].name == letter) {
            tmphand.splice(k, 1);
            letter_found = 1;
            k = tmphand.length + 1;
      ***REMOVED***
    ***REMOVED***

        if (letter_found == 0) {
          salert("INVALID: letter not in hand: " + letter);
          return 0;
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    if (valid_placement == 0) {
      salert("This is an invalid placement!");
***REMOVED***

    return valid_placement;

  ***REMOVED***


  exhaustWord(word, orientation, x, y) {

    x = parseInt(x);
    y = parseInt(y);

    for (let i = 0; i < word.length; i++) {
      let boardslot = "";
      let divname = "";
      let letter = word[i].toUpperCase();

      if (orientation == "horizontal") {
        boardslot = y + "_" + (x + i);
  ***REMOVED***

      if (orientation == "vertical") {
        boardslot = y + i + "_" + x;
  ***REMOVED***

      this.game.board[boardslot].fresh = 0;
***REMOVED***
  ***REMOVED***


  discardTiles(word, orientation, x, y) {

    x = parseInt(x);
    y = parseInt(y);

    for (let i = 0; i < word.length; i++) {
      let boardslot = "";
      let divname = "";
      let letter = word[i].toUpperCase();

      if (orientation == "horizontal") {
        boardslot = y + "_" + (x + i);
  ***REMOVED***

      if (orientation == "vertical") {
        boardslot = y + i + "_" + x;
  ***REMOVED***

      if (this.game.board[boardslot].fresh == 1) {
        this.removeTilesFromHand(word[i]);
  ***REMOVED***
***REMOVED***
  ***REMOVED***




  addWordToBoard(word, orientation, x, y) {
    x = parseInt(x);
    y = parseInt(y);

    for (let i = 0; i < word.length; i++) {
      let boardslot = "";
      let divname = "";
      let letter = word[i].toUpperCase();

      if (orientation == "horizontal") {
        boardslot = y + "_" + (x + i);
  ***REMOVED***

      if (orientation == "vertical") {
        boardslot = y + i + "_" + x;
  ***REMOVED***

      divname = "#" + boardslot;

      if (this.game.board[boardslot].letter != "_") {
        if (this.game.board[boardslot].letter != letter) {
          this.game.board[boardslot].letter = letter;
          this.addTile($(divname), letter);
    ***REMOVED***
  ***REMOVED*** else {
        this.game.board[boardslot].letter = letter;
        this.addTile($(divname), letter);
  ***REMOVED***
***REMOVED***
  ***REMOVED***



  removeWordFromBoard(word, orientation, x, y) {

    x = parseInt(x);
    y = parseInt(y);

    for (let i = 0; i < word.length; i++) {
      let boardslot = "";
      let divname = "";
      let letter = word[i].toUpperCase();
  
      if (orientation == "horizontal") {
        boardslot = y + "_" + (x + i);
  ***REMOVED***

      if (orientation == "vertical") {
        boardslot = y + i + "_" + x;
  ***REMOVED***

      divname = "#" + boardslot;

      if ($(divname).hasClass("set") != true) {
        this.game.board[boardslot].letter = "_";
        $(divname).find('.tile').remove();
        $(divname).find('.bonus').css("display", "block");
  ***REMOVED***
***REMOVED***
  ***REMOVED***


  setBoard(word, orientation, x, y) {

    x = parseInt(x);
    y = parseInt(y);

    for (let i = 0; i < word.length; i++) {
      let boardslot = "";
      let divname = "";

      if (orientation == "horizontal") {
        boardslot = y + "_" + (x + i);
  ***REMOVED***

      if (orientation == "vertical") {
        boardslot = y + i + "_" + x;
  ***REMOVED***

      divname = "#" + boardslot;
      $(divname).addClass("set");
***REMOVED***
  ***REMOVED***




  returnBoard() {

    var board = {***REMOVED***;

    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        let divname = i + 1 + "_" + (j + 1);
        board[divname] = {
          letter: "_",
          fresh: 1
    ***REMOVED***;
  ***REMOVED***
***REMOVED***

    return board;
  ***REMOVED***




  returnDeck() {
    var dictionary = this.game.options.dictionary;
    if (dictionary === "twl") {
      this.mydeck = {"1":{"name":"A"***REMOVED***,"2":{"name":"A"***REMOVED***,"3":{"name":"A"***REMOVED***,"4":{"name":"A"***REMOVED***,"5":{"name":"A"***REMOVED***,"6":{"name":"A"***REMOVED***,"7":{"name":"A"***REMOVED***,"8":{"name":"A"***REMOVED***,"9":{"name":"A"***REMOVED***,"10":{"name":"B"***REMOVED***,"11":{"name":"B"***REMOVED***,"12":{"name":"C"***REMOVED***,"13":{"name":"C"***REMOVED***,"14":{"name":"D"***REMOVED***,"15":{"name":"D"***REMOVED***,"16":{"name":"D"***REMOVED***,"17":{"name":"D"***REMOVED***,"18":{"name":"E"***REMOVED***,"19":{"name":"E"***REMOVED***,"20":{"name":"E"***REMOVED***,"21":{"name":"E"***REMOVED***,"22":{"name":"E"***REMOVED***,"23":{"name":"E"***REMOVED***,"24":{"name":"E"***REMOVED***,"25":{"name":"E"***REMOVED***,"26":{"name":"E"***REMOVED***,"27":{"name":"E"***REMOVED***,"28":{"name":"E"***REMOVED***,"29":{"name":"E"***REMOVED***,"30":{"name":"F"***REMOVED***,"41":{"name":"F"***REMOVED***,"42":{"name":"G"***REMOVED***,"43":{"name":"G"***REMOVED***,"44":{"name":"G"***REMOVED***,"45":{"name":"H"***REMOVED***,"46":{"name":"H"***REMOVED***,"47":{"name":"I"***REMOVED***,"48":{"name":"I"***REMOVED***,"49":{"name":"I"***REMOVED***,"50":{"name":"I"***REMOVED***,"51":{"name":"I"***REMOVED***,"52":{"name":"I"***REMOVED***,"53":{"name":"I"***REMOVED***,"54":{"name":"I"***REMOVED***,"55":{"name":"I"***REMOVED***,"56":{"name":"J"***REMOVED***,"57":{"name":"K"***REMOVED***,"58":{"name":"L"***REMOVED***,"59":{"name":"L"***REMOVED***,"60":{"name":"L"***REMOVED***,"61":{"name":"L"***REMOVED***,"62":{"name":"M"***REMOVED***,"63":{"name":"M"***REMOVED***,"64":{"name":"N"***REMOVED***,"65":{"name":"N"***REMOVED***,"66":{"name":"N"***REMOVED***,"67":{"name":"N"***REMOVED***,"68":{"name":"N"***REMOVED***,"69":{"name":"N"***REMOVED***,"70":{"name":"O"***REMOVED***,"71":{"name":"O"***REMOVED***,"72":{"name":"O"***REMOVED***,"73":{"name":"O"***REMOVED***,"74":{"name":"O"***REMOVED***,"75":{"name":"O"***REMOVED***,"76":{"name":"O"***REMOVED***,"77":{"name":"O"***REMOVED***,"78":{"name":"P"***REMOVED***,"79":{"name":"P"***REMOVED***,"80":{"name":"Q"***REMOVED***,"81":{"name":"R"***REMOVED***,"82":{"name":"R"***REMOVED***,"83":{"name":"R"***REMOVED***,"84":{"name":"R"***REMOVED***,"85":{"name":"R"***REMOVED***,"86":{"name":"R"***REMOVED***,"87":{"name":"S"***REMOVED***,"88":{"name":"S"***REMOVED***,"89":{"name":"S"***REMOVED***,"90":{"name":"S"***REMOVED***,"91":{"name":"T"***REMOVED***,"92":{"name":"T"***REMOVED***,"93":{"name":"T"***REMOVED***,"94":{"name":"T"***REMOVED***,"95":{"name":"T"***REMOVED***,"96":{"name":"T"***REMOVED***,"97":{"name":"U"***REMOVED***,"98":{"name":"U"***REMOVED***,"99":{"name":"U"***REMOVED***,"100":{"name":"U"***REMOVED***,"101":{"name":"V"***REMOVED***,"102":{"name":"V"***REMOVED***,"103":{"name":"W"***REMOVED***,"104":{"name":"W"***REMOVED***,"105":{"name":"X"***REMOVED***,"106":{"name":"U"***REMOVED***,"107":{"name":"Y"***REMOVED***,"108":{"name":"Y"***REMOVED***,"109":{"name":"Z"***REMOVED******REMOVED***;
***REMOVED***
    if (dictionary === "fise") {
      this.mydeck = {"1":{"name":"A"***REMOVED***,"2":{"name":"A"***REMOVED***,"3":{"name":"A"***REMOVED***,"4":{"name":"A"***REMOVED***,"5":{"name":"A"***REMOVED***,"6":{"name":"A"***REMOVED***,"7":{"name":"A"***REMOVED***,"8":{"name":"A"***REMOVED***,"9":{"name":"A"***REMOVED***,"10":{"name":"A"***REMOVED***,"11":{"name":"A"***REMOVED***,"12":{"name":"A"***REMOVED***,"13":{"name":"B"***REMOVED***,"14":{"name":"B"***REMOVED***,"15":{"name":"C"***REMOVED***,"16":{"name":"C"***REMOVED***,"17":{"name":"C"***REMOVED***,"18":{"name":"C"***REMOVED***,"19":{"name":"C"***REMOVED***,"20":{"name":"D"***REMOVED***,"21":{"name":"D"***REMOVED***,"22":{"name":"D"***REMOVED***,"23":{"name":"D"***REMOVED***,"24":{"name":"D"***REMOVED***,"25":{"name":"E"***REMOVED***,"26":{"name":"E"***REMOVED***,"27":{"name":"E"***REMOVED***,"28":{"name":"E"***REMOVED***,"29":{"name":"E"***REMOVED***,"30":{"name":"E"***REMOVED***,"31":{"name":"E"***REMOVED***,"32":{"name":"E"***REMOVED***,"33":{"name":"E"***REMOVED***,"34":{"name":"E"***REMOVED***,"35":{"name":"E"***REMOVED***,"36":{"name":"E"***REMOVED***,"37":{"name":"E"***REMOVED***,"38":{"name":"F"***REMOVED***,"39":{"name":"G"***REMOVED***,"40":{"name":"G"***REMOVED***,"41":{"name":"H"***REMOVED***,"42":{"name":"H"***REMOVED***,"43":{"name":"H"***REMOVED***,"44":{"name":"I"***REMOVED***,"45":{"name":"I"***REMOVED***,"46":{"name":"I"***REMOVED***,"47":{"name":"I"***REMOVED***,"48":{"name":"I"***REMOVED***,"49":{"name":"I"***REMOVED***,"50":{"name":"J"***REMOVED***,"51":{"name":"L"***REMOVED***,"52":{"name":"L"***REMOVED***,"53":{"name":"L"***REMOVED***,"54":{"name":"L"***REMOVED***,"55":{"name":"L"***REMOVED***,"56":{"name":"L"***REMOVED***,"57":{"name":"M"***REMOVED***,"58":{"name":"M"***REMOVED***,"59":{"name":"N"***REMOVED***,"60":{"name":"N"***REMOVED***,"61":{"name":"N"***REMOVED***,"62":{"name":"N"***REMOVED***,"63":{"name":"N"***REMOVED***,"64":{"name":"Ñ"***REMOVED***,"65":{"name":"Ñ"***REMOVED***,"66":{"name":"O"***REMOVED***,"67":{"name":"O"***REMOVED***,"68":{"name":"O"***REMOVED***,"69":{"name":"O"***REMOVED***,"70":{"name":"O"***REMOVED***,"71":{"name":"O"***REMOVED***,"72":{"name":"O"***REMOVED***,"73":{"name":"O"***REMOVED***,"74":{"name":"O"***REMOVED***,"75":{"name":"O"***REMOVED***,"76":{"name":"P"***REMOVED***,"77":{"name":"P"***REMOVED***,"78":{"name":"Q"***REMOVED***,"79":{"name":"R"***REMOVED***,"80":{"name":"R"***REMOVED***,"81":{"name":"R"***REMOVED***,"82":{"name":"R"***REMOVED***,"83":{"name":"R"***REMOVED***,"84":{"name":"R"***REMOVED***,"85":{"name":"R"***REMOVED***,"86":{"name":"S"***REMOVED***,"87":{"name":"S"***REMOVED***,"88":{"name":"S"***REMOVED***,"89":{"name":"S"***REMOVED***,"90":{"name":"S"***REMOVED***,"91":{"name":"S"***REMOVED***,"92":{"name":"S"***REMOVED***,"93":{"name":"T"***REMOVED***,"94":{"name":"T"***REMOVED***,"95":{"name":"T"***REMOVED***,"96":{"name":"T"***REMOVED***,"97":{"name":"U"***REMOVED***,"98":{"name":"U"***REMOVED***,"99":{"name":"U"***REMOVED***,"100":{"name":"U"***REMOVED***,"101":{"name":"U"***REMOVED***,"102":{"name":"V"***REMOVED***,"103":{"name":"X"***REMOVED***,"104":{"name":"Y"***REMOVED***,"105":{"name":"Z"***REMOVED******REMOVED***;
***REMOVED***
    if (dictionary === "sowpods") {
      this.mydeck = {"1":{"name":"A"***REMOVED***,"2":{"name":"A"***REMOVED***,"3":{"name":"A"***REMOVED***,"4":{"name":"A"***REMOVED***,"5":{"name":"A"***REMOVED***,"6":{"name":"A"***REMOVED***,"7":{"name":"A"***REMOVED***,"8":{"name":"A"***REMOVED***,"9":{"name":"A"***REMOVED***,"10":{"name":"B"***REMOVED***,"11":{"name":"B"***REMOVED***,"12":{"name":"C"***REMOVED***,"13":{"name":"C"***REMOVED***,"14":{"name":"D"***REMOVED***,"15":{"name":"D"***REMOVED***,"16":{"name":"D"***REMOVED***,"17":{"name":"D"***REMOVED***,"18":{"name":"E"***REMOVED***,"19":{"name":"E"***REMOVED***,"20":{"name":"E"***REMOVED***,"21":{"name":"E"***REMOVED***,"22":{"name":"E"***REMOVED***,"23":{"name":"E"***REMOVED***,"24":{"name":"E"***REMOVED***,"25":{"name":"E"***REMOVED***,"26":{"name":"E"***REMOVED***,"27":{"name":"E"***REMOVED***,"28":{"name":"E"***REMOVED***,"29":{"name":"E"***REMOVED***,"30":{"name":"F"***REMOVED***,"41":{"name":"F"***REMOVED***,"42":{"name":"G"***REMOVED***,"43":{"name":"G"***REMOVED***,"44":{"name":"G"***REMOVED***,"45":{"name":"H"***REMOVED***,"46":{"name":"H"***REMOVED***,"47":{"name":"I"***REMOVED***,"48":{"name":"I"***REMOVED***,"49":{"name":"I"***REMOVED***,"50":{"name":"I"***REMOVED***,"51":{"name":"I"***REMOVED***,"52":{"name":"I"***REMOVED***,"53":{"name":"I"***REMOVED***,"54":{"name":"I"***REMOVED***,"55":{"name":"I"***REMOVED***,"56":{"name":"J"***REMOVED***,"57":{"name":"K"***REMOVED***,"58":{"name":"L"***REMOVED***,"59":{"name":"L"***REMOVED***,"60":{"name":"L"***REMOVED***,"61":{"name":"L"***REMOVED***,"62":{"name":"M"***REMOVED***,"63":{"name":"M"***REMOVED***,"64":{"name":"N"***REMOVED***,"65":{"name":"N"***REMOVED***,"66":{"name":"N"***REMOVED***,"67":{"name":"N"***REMOVED***,"68":{"name":"N"***REMOVED***,"69":{"name":"N"***REMOVED***,"70":{"name":"O"***REMOVED***,"71":{"name":"O"***REMOVED***,"72":{"name":"O"***REMOVED***,"73":{"name":"O"***REMOVED***,"74":{"name":"O"***REMOVED***,"75":{"name":"O"***REMOVED***,"76":{"name":"O"***REMOVED***,"77":{"name":"O"***REMOVED***,"78":{"name":"P"***REMOVED***,"79":{"name":"P"***REMOVED***,"80":{"name":"Q"***REMOVED***,"81":{"name":"R"***REMOVED***,"82":{"name":"R"***REMOVED***,"83":{"name":"R"***REMOVED***,"84":{"name":"R"***REMOVED***,"85":{"name":"R"***REMOVED***,"86":{"name":"R"***REMOVED***,"87":{"name":"S"***REMOVED***,"88":{"name":"S"***REMOVED***,"89":{"name":"S"***REMOVED***,"90":{"name":"S"***REMOVED***,"91":{"name":"T"***REMOVED***,"92":{"name":"T"***REMOVED***,"93":{"name":"T"***REMOVED***,"94":{"name":"T"***REMOVED***,"95":{"name":"T"***REMOVED***,"96":{"name":"T"***REMOVED***,"97":{"name":"U"***REMOVED***,"98":{"name":"U"***REMOVED***,"99":{"name":"U"***REMOVED***,"100":{"name":"U"***REMOVED***,"101":{"name":"V"***REMOVED***,"102":{"name":"V"***REMOVED***,"103":{"name":"W"***REMOVED***,"104":{"name":"W"***REMOVED***,"105":{"name":"X"***REMOVED***,"106":{"name":"U"***REMOVED***,"107":{"name":"Y"***REMOVED***,"108":{"name":"Y"***REMOVED***,"109":{"name":"Z"***REMOVED******REMOVED***;
***REMOVED***
    return this.mydeck;
  ***REMOVED***




  returnLetters() {
    var dictionary = this.game.options.dictionary;
    if (dictionary === "twl") {
      this.letterset = {"A":{"score":1***REMOVED***,"B":{"score":3***REMOVED***,"C":{"score":2***REMOVED***,"D":{"score":2***REMOVED***,"E":{"score":1***REMOVED***,"F":{"score":2***REMOVED***,"G":{"score":2***REMOVED***,"H":{"score":1***REMOVED***,"I":{"score":1***REMOVED***,"J":{"score":8***REMOVED***,"K":{"score":4***REMOVED***,"L":{"score":2***REMOVED***,"M":{"score":2***REMOVED***,"N":{"score":1***REMOVED***,"O":{"score":1***REMOVED***,"P":{"score":2***REMOVED***,"Q":{"score":10***REMOVED***,"R":{"score":1***REMOVED***,"S":{"score":1***REMOVED***,"T":{"score":1***REMOVED***,"U":{"score":2***REMOVED***,"V":{"score":3***REMOVED***,"W":{"score":2***REMOVED***,"X":{"score":8***REMOVED***,"Y":{"score":2***REMOVED***,"Z":{"score":10***REMOVED******REMOVED***;
***REMOVED***
    if (dictionary === "fise") {
      this.letterset = {"A":{"score":1***REMOVED***,"B":{"score":2***REMOVED***,"C":{"score":3***REMOVED***,"D":{"score":2***REMOVED***,"E":{"score":1***REMOVED***,"F":{"score":4***REMOVED***,"G":{"score":2***REMOVED***,"H":{"score":4***REMOVED***,"I":{"score":1***REMOVED***,"J":{"score":8***REMOVED***,"L":{"score":1***REMOVED***,"M":{"score":3***REMOVED***,"N":{"score":1***REMOVED***,"Ñ":{"score":8***REMOVED***,"O":{"score":1***REMOVED***,"P":{"score":3***REMOVED***,"Q":{"score":6***REMOVED***,"R":{"score":2***REMOVED***,"S":{"score":1***REMOVED***,"T":{"score":1***REMOVED***,"U":{"score":1***REMOVED***,"V":{"score":4***REMOVED***,"X":{"score":8***REMOVED***,"Y":{"score":4***REMOVED***,"Z":{"score":10***REMOVED******REMOVED***;
***REMOVED***
    if (dictionary === "sowpods") {
      this.letterset = {"A":{"score":1***REMOVED***,"B":{"score":3***REMOVED***,"C":{"score":2***REMOVED***,"D":{"score":2***REMOVED***,"E":{"score":1***REMOVED***,"F":{"score":2***REMOVED***,"G":{"score":2***REMOVED***,"H":{"score":1***REMOVED***,"I":{"score":1***REMOVED***,"J":{"score":8***REMOVED***,"K":{"score":4***REMOVED***,"L":{"score":2***REMOVED***,"M":{"score":2***REMOVED***,"N":{"score":1***REMOVED***,"O":{"score":1***REMOVED***,"P":{"score":2***REMOVED***,"Q":{"score":10***REMOVED***,"R":{"score":1***REMOVED***,"S":{"score":1***REMOVED***,"T":{"score":1***REMOVED***,"U":{"score":2***REMOVED***,"V":{"score":3***REMOVED***,"W":{"score":2***REMOVED***,"X":{"score":8***REMOVED***,"Y":{"score":2***REMOVED***,"Z":{"score":10***REMOVED******REMOVED***;
***REMOVED***
    return this.letterset;
  ***REMOVED***




  checkWord(word) {
    if (word.length >= 1 && typeof this.wordlist != "undefined") {
      if (this.wordlist.indexOf(word.toLowerCase()) <= 0) {
        salert(word + " is not a playable word.");
        return false;
  ***REMOVED*** else {
        return true;
  ***REMOVED***
***REMOVED*** else {
      return true;
***REMOVED***
  ***REMOVED***



  returnBonus(pos) {

    let bonus = "";

    if (pos == "1_1") { return "3L"; ***REMOVED***
    if (pos == "1_15") { return "3L"; ***REMOVED***
    if (pos == "3_8") { return "3L"; ***REMOVED***
    if (pos == "8_3") { return "3L"; ***REMOVED***
    if (pos == "8_13") { return "3L"; ***REMOVED***
    if (pos == "13_8") { return "3L"; ***REMOVED***
    if (pos == "15_1") { return "3L"; ***REMOVED***
    if (pos == "15_15") { return "3L"; ***REMOVED***
    if (pos == "2_2") { return "3W"; ***REMOVED***
    if (pos == "2_14") { return "3W"; ***REMOVED***
    if (pos == "8_8") { return "3W"; ***REMOVED***
    if (pos == "14_2") { return "3W"; ***REMOVED***
    if (pos == "14_14") { return "3W"; ***REMOVED***
    if (pos == "1_5") { return "2L"; ***REMOVED***
    if (pos == "1_11") { return "2L"; ***REMOVED***
    if (pos == "3_4") { return "2L"; ***REMOVED***
    if (pos == "3_12") { return "2L"; ***REMOVED***
    if (pos == "4_3") { return "2L"; ***REMOVED***
    if (pos == "4_13") { return "2L"; ***REMOVED***
    if (pos == "5_8") { return "2L"; ***REMOVED***
    if (pos == "5_1") { return "2L"; ***REMOVED***
    if (pos == "5_15") { return "2L"; ***REMOVED***
    if (pos == "8_5") { return "2L"; ***REMOVED***
    if (pos == "8_11") { return "2L"; ***REMOVED***
    if (pos == "11_1") { return "2L"; ***REMOVED***
    if (pos == "11_8") { return "2L"; ***REMOVED***
    if (pos == "11_15") { return "2L"; ***REMOVED***
    if (pos == "12_3") { return "2L"; ***REMOVED***
    if (pos == "12_13") { return "2L"; ***REMOVED***
    if (pos === "13_4") { return "2L"; ***REMOVED***
    if (pos === "13_12") { return "2L"; ***REMOVED***
    if (pos == "15_5") { return "2L"; ***REMOVED***
    if (pos == "15_11") { return "2L"; ***REMOVED***
    if (pos == "1_8") { return "2W"; ***REMOVED***
    if (pos == "4_6") { return "2W"; ***REMOVED***
    if (pos == "4_10") { return "2W"; ***REMOVED***
    if (pos == "6_4") { return "2W"; ***REMOVED***
    if (pos == "6_12") { return "2W"; ***REMOVED***
    if (pos == "8_1") { return "2W"; ***REMOVED***
    if (pos == "8_15") { return "2W"; ***REMOVED***
    if (pos == "10_4") { return "2W"; ***REMOVED***
    if (pos == "10_12") { return "2W"; ***REMOVED***
    if (pos == "12_6") { return "2W"; ***REMOVED***
    if (pos == "12_10") { return "2W"; ***REMOVED***
    if (pos == "15_8") { return "2W"; ***REMOVED***
    return bonus;
  ***REMOVED***


  ////////////////
  // Score Word //
  ////////////////
  scoreWord(word, player, orientation, x, y) {

    let score = 0;
    let touchesWord = 0;
    let thisword = "";
    let finalword = "";
    x = parseInt(x);
    y = parseInt(y);

    //
    // find the start of the word
    //

    if (orientation == "horizontal") {

      let beginning_of_word = x;
      let end_of_word = x;
      let tilesUsed = 0;

      //
      // find the beginning of the word
      //
      let current_x = parseInt(x) - 1;
      let current_y = y;
      let boardslot = y + "_" + current_x;
      let divname = "#" + boardslot;

      if (current_x < 1) {
        beginning_of_word = 1;
  ***REMOVED*** else {
        while (this.game.board[boardslot].letter != "_" && current_x >= 1) {
          beginning_of_word = current_x;
          current_x--;
          boardslot = y + "_" + current_x;
          divname = "#" + boardslot;

          if (current_x < 1) {
            break;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***

      //
      // find the end of the word
      //
      current_x = parseInt(x) + 1;
      current_y = y;
      boardslot = y + "_" + current_x;
      divname = "#" + boardslot;

      if (current_x <= 15) {
        while (this.game.board[boardslot].letter != "_" && current_x <= 15) {
          end_of_word = current_x;
          current_x++;
          boardslot = y + "_" + current_x;
          divname = "#" + boardslot;

          if (current_x > 15) {
            break;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***

      let word_bonus = 1;

      //
      // score this word
      //
      thisword = "";

      for (let i = beginning_of_word, k = 0; i <= end_of_word; i++) {
        boardslot = y + "_" + i;
        let tmpb = this.returnBonus(boardslot);
        let letter_bonus = 1;

        if (tmpb == "3W" && this.game.board[boardslot].fresh == 1) {
          word_bonus = word_bonus * 3;
    ***REMOVED***

        if (tmpb == "2W" && this.game.board[boardslot].fresh == 1) {
          word_bonus = word_bonus * 2;
    ***REMOVED***

        if (tmpb == "3L" && this.game.board[boardslot].fresh == 1) {
          letter_bonus = 3;
    ***REMOVED***

        if (tmpb == "2L" && this.game.board[boardslot].fresh == 1) {
          letter_bonus = 2;
    ***REMOVED***

        if (this.game.board[boardslot].fresh == 1) {
          tilesUsed += 1;
    ***REMOVED***

        if (this.game.board[boardslot].fresh != 1) {
          touchesWord = 1;
    ***REMOVED***

        let thisletter = this.game.board[boardslot].letter;
        thisword += thisletter;
        score += this.letters[thisletter].score * letter_bonus;
  ***REMOVED***

      if (!this.checkWord(thisword)) {
        return -1;
  ***REMOVED***

      finalword += thisword;

      if (tilesUsed == 7) {
        score += 10;
        word_bonus += 1;
  ***REMOVED***

      score *= word_bonus;

      //
      // now score vertical words 
      //

      for (let i = x; i < x + word.length; i++) {
        boardslot = y + "_" + i;

        if (this.game.board[boardslot].fresh == 1) {
          let orth_start = parseInt(y);
          let orth_end = parseInt(y);

  ***REMOVED***
  ***REMOVED*** find the beginning of the word
  ***REMOVED***

          current_x = i;
          current_y = orth_start - 1;
          boardslot = current_y + "_" + current_x;
          divname = "#" + boardslot;

          if (current_y == 0) {
            orth_start = 1;
      ***REMOVED*** else {
            while (this.game.board[boardslot].letter != "_" && current_y > 0) {
              orth_start = current_y;
              current_y--;
              boardslot = current_y + "_" + current_x;
              divname = "#" + boardslot;

              if (current_y < 1) {
                break;
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***

  ***REMOVED***
  ***REMOVED*** find the end of the word
  ***REMOVED***


          current_x = i;
          current_y = orth_end + 1;
          boardslot = current_y + "_" + current_x;
          divname = "#" + boardslot;

          if (current_y > 15) {
            orth_end = 15;
      ***REMOVED*** else {
            while (this.game.board[boardslot].letter != "_" && current_y <= 15) {
              orth_end = current_y;
              current_y++;
              boardslot = current_y + "_" + current_x;

              if (current_y > 15) {
                break;
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***

          let wordscore = 0;
          let word_bonus = 1;

  ***REMOVED***
  ***REMOVED*** score this word
  ***REMOVED***

          thisword = "";

          if (orth_start != orth_end) {
            for (let w = orth_start, q = 0; w <= orth_end; w++) {
              let boardslot = w + "_" + i;
              let tmpb = this.returnBonus(boardslot);
              let letter_bonus = 1;

              if (tmpb == "3W" && this.game.board[boardslot].fresh == 1) {
                word_bonus = word_bonus * 3;
          ***REMOVED***

              if (tmpb == "2W" && this.game.board[boardslot].fresh == 1) {
                word_bonus = word_bonus * 2;
          ***REMOVED***

              if (tmpb == "3L" && this.game.board[boardslot].fresh == 1) {
                letter_bonus = 3;
          ***REMOVED***

              if (tmpb == "2L" && this.game.board[boardslot].fresh == 1) {
                letter_bonus = 2;
          ***REMOVED***

              if (this.game.board[boardslot].fresh != 1) {
                touchesWord = 1;
          ***REMOVED***

              let thisletter = this.game.board[boardslot].letter;
              thisword += thisletter;
              wordscore += this.letters[thisletter].score * letter_bonus;
        ***REMOVED***

            score += wordscore * word_bonus;

            if (!this.checkWord(thisword)) {
              return -1;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    if (orientation == "vertical") {
      let beginning_of_word = y;
      let end_of_word = y;
      let tilesUsed = 0;

      //
      // find the beginning of the word
      //

      let current_x = parseInt(x);
      let current_y = parseInt(y) - 1;
      let boardslot = current_y + "_" + current_x;
      let divname = "#" + boardslot;

      if (current_y <= 0) {
        beginning_of_word = 1;
  ***REMOVED*** else {
        while (this.game.board[boardslot].letter != "_" && current_y > 0) {
          beginning_of_word = current_y;
          current_y--;
          boardslot = current_y + "_" + current_x;
          divname = "#" + boardslot;

          if (current_y <= 0) {
            break;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***

      //
      // find the end of the word
      //
      current_x = parseInt(x);
      current_y = parseInt(y) + 1;
      boardslot = current_y + "_" + current_x;
      divname = "#" + boardslot;

      if (current_y > 15) {
        end_of_word = 15;
  ***REMOVED*** else {
        while (this.game.board[boardslot].letter != "_" && current_y <= 15) {
          end_of_word = current_y;
          current_y++;
          boardslot = current_y + "_" + current_x;
          divname = "#" + boardslot;

          if (current_y > 15) {
            break;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***

      let word_bonus = 1;

      //
      // score this word
      //
      for (let i = beginning_of_word, k = 0; i <= end_of_word; i++) {
        boardslot = i + "_" + x;
        let tmpb = this.returnBonus(boardslot);
        let letter_bonus = 1;

        if (tmpb == "3W" && this.game.board[boardslot].fresh == 1) {
          word_bonus = word_bonus * 3;
    ***REMOVED***

        if (tmpb == "2W" && this.game.board[boardslot].fresh == 1) {
          word_bonus = word_bonus * 2;
    ***REMOVED***

        if (tmpb == "3L" && this.game.board[boardslot].fresh == 1) {
          letter_bonus = 3;
    ***REMOVED***

        if (tmpb == "2L" && this.game.board[boardslot].fresh == 1) {
          letter_bonus = 2;
    ***REMOVED***

        if (this.game.board[boardslot].fresh == 1) {
          tilesUsed += 1;
    ***REMOVED***

        if (this.game.board[boardslot].fresh != 1) {
          touchesWord = 1;
    ***REMOVED***

        let thisletter = this.game.board[boardslot].letter;
        thisword += thisletter;
        score += this.letters[thisletter].score * letter_bonus;
  ***REMOVED***

      if (!this.checkWord(thisword)) {
        return -1;
  ***REMOVED***

      finalword += thisword;

      if (tilesUsed == 7) {
        score += 10;
        word_bonus += 1;
  ***REMOVED***

      score *= word_bonus;

      //
      // now score horizontal words 
      //

      for (let i = y; i < y + word.length; i++) {
        boardslot = i + "_" + x;

        if (this.game.board[boardslot].fresh == 1) {
          let orth_start = parseInt(x);
          let orth_end = parseInt(x);

  ***REMOVED***
  ***REMOVED*** find the beginning of the word
  ***REMOVED***
          current_x = orth_start - 1;
          current_y = i;
          boardslot = current_y + "_" + current_x;
          divname = "#" + boardslot;

          if (current_x < 1) {
            orth_start = 1;
      ***REMOVED*** else {
            while (this.game.board[boardslot].letter != "_" && current_x > 0) {
              orth_start = current_x;
              current_x--;
              boardslot = current_y + "_" + current_x;
              divname = "#" + boardslot;

              if (current_x < 1) {
                break;
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***

  ***REMOVED***
  ***REMOVED*** find the end of the word
  ***REMOVED***
          current_x = orth_end + 1;
          current_y = i;
          boardslot = current_y + "_" + current_x;
          divname = "#" + boardslot;

          if (current_x > 15) {
            orth_end = 15;
      ***REMOVED*** else {
    ***REMOVED***
    ***REMOVED*** >= instead of greater than
    ***REMOVED***
            while (this.game.board[boardslot].letter != "_" && current_x <= 15) {
              orth_end = current_x;
              current_x++;
              boardslot = current_y + "_" + current_x;

              if (current_x > 15) {
                break;
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***

          let wordscore = 0;
          let word_bonus = 1;

  ***REMOVED***
  ***REMOVED*** score this word
  ***REMOVED***

          thisword = "";

          if (orth_start != orth_end) {
            for (let w = orth_start, q = 0; w <= orth_end; w++) {
              boardslot = i + "_" + w;
              let tmpb = this.returnBonus(boardslot);
              let letter_bonus = 1;

              if (tmpb === "3W" && this.game.board[boardslot].fresh == 1) {
                word_bonus = word_bonus * 3;
          ***REMOVED***

              if (tmpb === "2W" && this.game.board[boardslot].fresh == 1) {
                word_bonus = word_bonus * 2;
          ***REMOVED***

              if (tmpb === "3L" && this.game.board[boardslot].fresh == 1) {
                letter_bonus = 3;
          ***REMOVED***

              if (tmpb === "2L" && this.game.board[boardslot].fresh == 1) {
                letter_bonus = 2;
          ***REMOVED***

              if (this.game.board[boardslot].fresh != 1) {
                touchesWord = 1;
          ***REMOVED***

              let thisletter = this.game.board[boardslot].letter;
              thisword += thisletter;
              wordscore += this.letters[thisletter].score * letter_bonus;
        ***REMOVED***

            score += wordscore * word_bonus;

            if (!this.checkWord(thisword)) {
              return -1;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    if (this.firstmove == 0 && touchesWord == 0) {
      salert("Word does not cross our touch an existing word.");
      return -1;
***REMOVED***

    this.firstmove = 0;
    $('#lastmove').html(`Player ${player***REMOVED*** played ${finalword***REMOVED*** for: ${score***REMOVED*** points.`);
    $('#remainder').html(`Tiles left: ${this.game.deck[0].crypt.length***REMOVED***`);
    this.last_played_word = { player, finalword, score ***REMOVED***;
    return score;
  ***REMOVED***



  //
  // Core Game Logic
  //
  handleGameLoop(msg = null) {

    let wordblocks_self = this;

    //
    // show board and tiles
    //

    this.showTiles();

    ///////////
    // QUEUE //
    ///////////

    if (this.game.queue.length > 0) {
      //
      // save before we start executing the game queue
      //
      wordblocks_self.saveGame(wordblocks_self.game.id);
      let qe = this.game.queue.length - 1;
      let mv = this.game.queue[qe].split("\t");
      let shd_continue = 1;

      //
      // game over conditions
      //

      if (mv[0] === "gameover") {

***REMOVED***
***REMOVED*** pick the winner
***REMOVED***
        let x = 0;
        let idx = 0;

        for (let i = 0; i < wordblocks_self.game.score.length; i++) {
          if (wordblocks_self.game.score[i] > x) {
            x = wordblocks_self.game.score[i];
            idx = i;
      ***REMOVED***
    ***REMOVED***

        for (let i = 0; i < wordblocks_self.game.score.length; i++) {
          if (i != idx && wordblocks_self.game.score[i] == wordblocks_self.game.score[idx]) {
            idx = -1;
      ***REMOVED***
    ***REMOVED***

        wordblocks_self.game.winner = idx + 1;
        wordblocks_self.game.over = 1;
        wordblocks_self.saveGame(wordblocks_self.game.id);

        if (wordblocks_self.browser_active == 1) {
          this.disableEvents();
          var result = `Game Over -- Player ${wordblocks_self.game.winner***REMOVED*** Wins!`;

          if (idx < 0) {
            result = "It's a tie! Well done everyone!";
      ***REMOVED***

          wordblocks_self.updateStatus(result);
          wordblocks_self.updateLog(result);
    ***REMOVED***

        this.game.queue.splice(this.game.queue.length - 1, 1);
        return 0;
  ***REMOVED***

      if (mv[0] === "endgame") {
***REMOVED***this.moves;
        this.game.queue.splice(this.game.queue.length - 1, 1);
        this.addMove("gameover");
        return 1;
  ***REMOVED***

      //
      // place word player x y [horizontal/vertical]
      //
      if (mv[0] === "place") {
        let word = mv[1];
        let player = mv[2];
        let x = mv[3];
        let y = mv[4];
        let orient = mv[5];
        let score = 0;

        if (player != wordblocks_self.game.player) {
          this.addWordToBoard(word, orient, x, y);
          this.setBoard(word, orient, x, y);
          score = this.scoreWord(word, player, orient, x, y);
          this.exhaustWord(word, orient, x, y);
          this.addScoreToPlayer(player, score);
    ***REMOVED***

        if (wordblocks_self.game.over == 1) {
          return;
    ***REMOVED***

        if (wordblocks_self.game.player == wordblocks_self.returnNextPlayer(player)) {
          if (wordblocks_self.checkForEndGame() == 1) {
            return;
      ***REMOVED***

          wordblocks_self.updateStatusWithTiles("YOUR TURN: click on the board to place tiles, or <span class=\"link tosstiles\">discard tiles</span>.");
          wordblocks_self.enableEvents();
    ***REMOVED*** else {
          wordblocks_self.updateStatusWithTiles("Player " + wordblocks_self.returnNextPlayer(player) + " turn");
          wordblocks_self.disableEvents();
    ***REMOVED***

        this.game.queue.splice(this.game.queue.length - 1, 1);
        return 1; // remove word and wait for next
  ***REMOVED***

      if (mv[0] === "turn") {
        if (wordblocks_self.checkForEndGame() == 1) {
          return;
    ***REMOVED***

        let player = mv[1];

        if (wordblocks_self.game.player == wordblocks_self.returnNextPlayer(player)) {
          wordblocks_self.updateStatusWithTiles("YOUR TURN: click on the board to place tiles, or <span class=\"link tosstiles\">discard tiles</span>.");
          wordblocks_self.enableEvents();
    ***REMOVED*** else {
          wordblocks_self.updateStatusWithTiles("Player " + wordblocks_self.returnNextPlayer(player) + " turn");
          wordblocks_self.disableEvents();
    ***REMOVED***

        this.game.queue.splice(this.game.queue.length - 1, 1);
        return 1;
  ***REMOVED***

      //
      // avoid infinite loops
      //
      if (shd_continue == 0) {
        return 0;
  ***REMOVED***
***REMOVED***

    return 1;

  ***REMOVED***


  checkForEndGame() {
    //
    // the game ends when one player has no cards left
    //
    if (this.game.deck[0].hand.length == 0 && this.game.deck[0].crypt.length == 0) {
      this.addMove("endgame");
      this.endTurn();
      return 1;
***REMOVED***

    return 0;
  ***REMOVED***



  addScoreToPlayer(player, score) {
    if (this.browser_active == 0) {
      return;
***REMOVED***

    let divname = "#score_" + player;
    this.game.score[player - 1] = this.game.score[player - 1] + score;
    $(divname).html(parseInt($(divname).html()) + score);
  ***REMOVED***



  addMove(mv) {
    this.moves.push(mv);
  ***REMOVED***


  endTurn() {
    this.updateStatusWithTiles("Waiting for information from peers....");
    let extra = {***REMOVED***;
    extra.target = this.returnNextPlayer(this.game.player);
    this.game.turn = this.moves;
    this.moves = [];
    this.sendMessage("game", extra);
  ***REMOVED***

  returnGameOptionsHTML() {

    return `
        <h3>Wordblocks: </h3>

        <form id="options" class="options">

          <label for="dictionary">Dictionary:</label>
          <select name="dictionary">
            <option value="sowpods" selected>English: SOWPODS</option>
            <option value="twl">English: TWL06</option>
            <option value="fise">Spanish: FISE</option>
          </select>

          </form>`
  ***REMOVED***

***REMOVED***

module.exports = Wordblocks;
