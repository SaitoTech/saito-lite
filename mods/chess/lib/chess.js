// downloaded from https://github.com/jhlywa/chess.js/blob/master/chess.js
// on 27 July 2013
// commit: eed8f8a3b96d99fcd570b7ced105e8415409a800

'use strict';

/*
 * Copyright (c) 2011, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 *----------------------------------------------------------------------------*/

// window['Chess'] = window['Chess'] || function(fen) {
var Chess = function(fen) {

  /* jshint indent: false */

  var BLACK = 'b';
  var WHITE = 'w';

  var EMPTY = -1;

  var PAWN = 'p';
  var KNIGHT = 'n';
  var BISHOP = 'b';
  var ROOK = 'r';
  var QUEEN = 'q';
  var KING = 'k';

  var SYMBOLS = 'pnbrqkPNBRQK';

  var DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  var POSSIBLE_RESULTS = ['1-0', '0-1', '1/2-1/2', '*'];

  var PAWN_OFFSETS = {
    b: [16, 32, 17, 15],
    w: [-16, -32, -17, -15]
  ***REMOVED***;

  var PIECE_OFFSETS = {
    n: [-18, -33, -31, -14,  18, 33, 31,  14],
    b: [-17, -15,  17,  15],
    r: [-16,   1,  16,  -1],
    q: [-17, -16, -15,   1,  17, 16, 15,  -1],
    k: [-17, -16, -15,   1,  17, 16, 15,  -1]
  ***REMOVED***;

  var ATTACKS = [
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20, 0,
     0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
     0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
     0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
     0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    24,24,24,24,24,24,56,  0, 56,24,24,24,24,24,24, 0,
     0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
     0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
     0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
     0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20
  ];

  var RAYS = [
     17,  0,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0,  0, 15, 0,
      0, 17,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0, 15,  0, 0,
      0,  0, 17,  0,  0,  0,  0, 16,  0,  0,  0,  0, 15,  0,  0, 0,
      0,  0,  0, 17,  0,  0,  0, 16,  0,  0,  0, 15,  0,  0,  0, 0,
      0,  0,  0,  0, 17,  0,  0, 16,  0,  0, 15,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0, 17,  0, 16,  0, 15,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0,  0, 17, 16, 15,  0,  0,  0,  0,  0,  0, 0,
      1,  1,  1,  1,  1,  1,  1,  0, -1, -1,  -1,-1, -1, -1, -1, 0,
      0,  0,  0,  0,  0,  0,-15,-16,-17,  0,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0,-15,  0,-16,  0,-17,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,-15,  0,  0,-16,  0,  0,-17,  0,  0,  0,  0, 0,
      0,  0,  0,-15,  0,  0,  0,-16,  0,  0,  0,-17,  0,  0,  0, 0,
      0,  0,-15,  0,  0,  0,  0,-16,  0,  0,  0,  0,-17,  0,  0, 0,
      0,-15,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,-17,  0, 0,
    -15,  0,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,  0,-17
  ];

  var SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 ***REMOVED***;

  var FLAGS = {
    NORMAL: 'n',
    CAPTURE: 'c',
    BIG_PAWN: 'b',
    EP_CAPTURE: 'e',
    PROMOTION: 'p',
    KSIDE_CASTLE: 'k',
    QSIDE_CASTLE: 'q'
  ***REMOVED***;

  var BITS = {
    NORMAL: 1,
    CAPTURE: 2,
    BIG_PAWN: 4,
    EP_CAPTURE: 8,
    PROMOTION: 16,
    KSIDE_CASTLE: 32,
    QSIDE_CASTLE: 64
  ***REMOVED***;

  var RANK_1 = 7;
  var RANK_2 = 6;
  var RANK_3 = 5;
  var RANK_4 = 4;
  var RANK_5 = 3;
  var RANK_6 = 2;
  var RANK_7 = 1;
  var RANK_8 = 0;

  var SQUARES = {
    a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
    a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
    a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
    a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
    a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
    a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
    a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
    a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
  ***REMOVED***;

  var ROOKS = {
    w: [{square: SQUARES.a1, flag: BITS.QSIDE_CASTLE***REMOVED***,
        {square: SQUARES.h1, flag: BITS.KSIDE_CASTLE***REMOVED***],
    b: [{square: SQUARES.a8, flag: BITS.QSIDE_CASTLE***REMOVED***,
        {square: SQUARES.h8, flag: BITS.KSIDE_CASTLE***REMOVED***]
  ***REMOVED***;

  var board = new Array(128);
  var kings = {w: EMPTY, b: EMPTY***REMOVED***;
  var turn = WHITE;
  var castling = {w: 0, b: 0***REMOVED***;
  var ep_square = EMPTY;
  var half_moves = 0;
  var move_number = 1;
  var history = [];
  var header = {***REMOVED***;

  /* if the user passes in a fen string, load it, else default to
   * starting position
   */
  if (typeof fen === 'undefined') {
    load(DEFAULT_POSITION);
  ***REMOVED*** else {
    load(fen);
  ***REMOVED***

  function clear() {
    board = new Array(128);
    kings = {w: EMPTY, b: EMPTY***REMOVED***;
    turn = WHITE;
    castling = {w: 0, b: 0***REMOVED***;
    ep_square = EMPTY;
    half_moves = 0;
    move_number = 1;
    history = [];
    header = {***REMOVED***;
    update_setup(generate_fen());
  ***REMOVED***

  function reset() {
    load(DEFAULT_POSITION);
  ***REMOVED***

  function load(fen) {
    var tokens = fen.split(/\s+/);
    var position = tokens[0];
    var square = 0;
    var valid = SYMBOLS + '12345678/';

    if (!validate_fen(fen).valid) {
      return false;
***REMOVED***

    clear();

    for (var i = 0; i < position.length; i++) {
      var piece = position.charAt(i);

      if (piece === '/') {
        square += 8;
  ***REMOVED*** else if (is_digit(piece)) {
        square += parseInt(piece, 10);
  ***REMOVED*** else {
        var color = (piece < 'a') ? WHITE : BLACK;
        put({type: piece.toLowerCase(), color: color***REMOVED***, algebraic(square));
        square++;
  ***REMOVED***
***REMOVED***

    turn = tokens[1];

    if (tokens[2].indexOf('K') > -1) {
      castling.w |= BITS.KSIDE_CASTLE;
***REMOVED***
    if (tokens[2].indexOf('Q') > -1) {
      castling.w |= BITS.QSIDE_CASTLE;
***REMOVED***
    if (tokens[2].indexOf('k') > -1) {
      castling.b |= BITS.KSIDE_CASTLE;
***REMOVED***
    if (tokens[2].indexOf('q') > -1) {
      castling.b |= BITS.QSIDE_CASTLE;
***REMOVED***

    ep_square = (tokens[3] === '-') ? EMPTY : SQUARES[tokens[3]];
    half_moves = parseInt(tokens[4], 10);
    move_number = parseInt(tokens[5], 10);

    update_setup(generate_fen());

    return true;
  ***REMOVED***

  function validate_fen(fen) {
    var errors = {
       0: 'No errors.',
       1: 'FEN string must contain six space-delimited fields.',
       2: '6th field (move number) must be a positive integer.',
       3: '5th field (half move counter) must be a non-negative integer.',
       4: '4th field (en-passant square) is invalid.',
       5: '3rd field (castling availability) is invalid.',
       6: '2nd field (side to move) is invalid.',
       7: '1st field (piece positions) does not contain 8 \'/\'-delimited rows.',
       8: '1st field (piece positions) is invalid [consecutive numbers].',
       9: '1st field (piece positions) is invalid [invalid piece].',
      10: '1st field (piece positions) is invalid [row too large].',
***REMOVED***;

    /* 1st criterion: 6 space-seperated fields? */
    var tokens = fen.split(/\s+/);
    if (tokens.length !== 6) {
      return {valid: false, error_number: 1, error: errors[1]***REMOVED***;
***REMOVED***

    /* 2nd criterion: move number field is a integer value > 0? */
    if (isNaN(tokens[5]) || (parseInt(tokens[5], 10) <= 0)) {
      return {valid: false, error_number: 2, error: errors[2]***REMOVED***;
***REMOVED***

    /* 3rd criterion: half move counter is an integer >= 0? */
    if (isNaN(tokens[4]) || (parseInt(tokens[4], 10) < 0)) {
      return {valid: false, error_number: 3, error: errors[3]***REMOVED***;
***REMOVED***

    /* 4th criterion: 4th field is a valid e.p.-string? */
    if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
      return {valid: false, error_number: 4, error: errors[4]***REMOVED***;
***REMOVED***

    /* 5th criterion: 3th field is a valid castle-string? */
    if( !/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(tokens[2])) {
      return {valid: false, error_number: 5, error: errors[5]***REMOVED***;
***REMOVED***

    /* 6th criterion: 2nd field is "w" (white) or "b" (black)? */
    if (!/^(w|b)$/.test(tokens[1])) {
      return {valid: false, error_number: 6, error: errors[6]***REMOVED***;
***REMOVED***

    /* 7th criterion: 1st field contains 8 rows? */
    var rows = tokens[0].split('/');
    if (rows.length !== 8) {
      return {valid: false, error_number: 7, error: errors[7]***REMOVED***;
***REMOVED***

    /* 8th criterion: every row is valid? */
    for (var i = 0; i < rows.length; i++) {
      /* check for right sum of fields AND not two numbers in succession */
      var sum_fields = 0;
      var previous_was_number = false;

      for (var k = 0; k < rows[i].length; k++) {
        if (!isNaN(rows[i][k])) {
          if (previous_was_number) {
            return {valid: false, error_number: 8, error: errors[8]***REMOVED***;
      ***REMOVED***
          sum_fields += parseInt(rows[i][k], 10);
          previous_was_number = true;
    ***REMOVED*** else {
          if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
            return {valid: false, error_number: 9, error: errors[9]***REMOVED***;
      ***REMOVED***
          sum_fields += 1;
          previous_was_number = false;
    ***REMOVED***
  ***REMOVED***
      if (sum_fields !== 8) {
        return {valid: false, error_number: 10, error: errors[10]***REMOVED***;
  ***REMOVED***
***REMOVED***

    /* everything's okay! */
    return {valid: true, error_number: 0, error: errors[0]***REMOVED***;
  ***REMOVED***

  function generate_fen() {
    var empty = 0;
    var fen = '';

    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      if (board[i] == null) {
        empty++;
  ***REMOVED*** else {
        if (empty > 0) {
          fen += empty;
          empty = 0;
    ***REMOVED***
        var color = board[i].color;
        var piece = board[i].type;

        fen += (color === WHITE) ?
                 piece.toUpperCase() : piece.toLowerCase();
  ***REMOVED***

      if ((i + 1) & 0x88) {
        if (empty > 0) {
          fen += empty;
    ***REMOVED***

        if (i !== SQUARES.h1) {
          fen += '/';
    ***REMOVED***

        empty = 0;
        i += 8;
  ***REMOVED***
***REMOVED***

    var cflags = '';
    if (castling[WHITE] & BITS.KSIDE_CASTLE) { cflags += 'K'; ***REMOVED***
    if (castling[WHITE] & BITS.QSIDE_CASTLE) { cflags += 'Q'; ***REMOVED***
    if (castling[BLACK] & BITS.KSIDE_CASTLE) { cflags += 'k'; ***REMOVED***
    if (castling[BLACK] & BITS.QSIDE_CASTLE) { cflags += 'q'; ***REMOVED***

    /* do we have an empty castling flag? */
    cflags = cflags || '-';
    var epflags = (ep_square === EMPTY) ? '-' : algebraic(ep_square);

    return [fen, turn, cflags, epflags, half_moves, move_number].join(' ');
  ***REMOVED***

  function set_header(args) {
    for (var i = 0; i < args.length; i += 2) {
      if (typeof args[i] === 'string' &&
          typeof args[i + 1] === 'string') {
        header[args[i]] = args[i + 1];
  ***REMOVED***
***REMOVED***
    return header;
  ***REMOVED***

  /* called when the initial board setup is changed with put() or remove().
   * modifies the SetUp and FEN properties of the header object.  if the FEN is
   * equal to the default position, the SetUp and FEN are deleted
   * the setup is only updated if history.length is zero, ie moves haven't been
   * made.
   */
  function update_setup(fen) {
    if (history.length > 0) return;

    if (fen !== DEFAULT_POSITION) {
      header['SetUp'] = fen;
      header['FEN'] = '1';
***REMOVED*** else {
      delete header['SetUp'];
      delete header['FEN'];
***REMOVED***
  ***REMOVED***

  function get(square) {
    var piece = board[SQUARES[square]];
    return (piece) ? {type: piece.type, color: piece.color***REMOVED*** : null;
  ***REMOVED***

  function put(piece, square) {
    /* check for valid piece object */
    if (!('type' in piece && 'color' in piece)) {
      return false;
***REMOVED***

    /* check for piece */
    if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) {
      return false;
***REMOVED***

    /* check for valid square */
    if (!(square in SQUARES)) {
      return false;
***REMOVED***

    var sq = SQUARES[square];
    board[sq] = {type: piece.type, color: piece.color***REMOVED***;
    if (piece.type === KING) {
      kings[piece.color] = sq;
***REMOVED***

    update_setup(generate_fen());

    return true;
  ***REMOVED***

  function remove(square) {
    var piece = get(square);
    board[SQUARES[square]] = null;
    if (piece && piece.type === KING) {
      kings[piece.color] = EMPTY;
***REMOVED***

    update_setup(generate_fen());

    return piece;
  ***REMOVED***

  function build_move(board, from, to, flags, promotion) {
    var move = {
      color: turn,
      from: from,
      to: to,
      flags: flags,
      piece: board[from].type
***REMOVED***;

    if (promotion) {
      move.flags |= BITS.PROMOTION;
      move.promotion = promotion;
***REMOVED***

    if (board[to]) {
      move.captured = board[to].type;
***REMOVED*** else if (flags & BITS.EP_CAPTURE) {
        move.captured = PAWN;
***REMOVED***
    return move;
  ***REMOVED***

  function generate_moves(options) {
    function add_move(board, moves, from, to, flags) {
      /* if pawn promotion */
      if (board[from].type === PAWN &&
         (rank(to) === RANK_8 || rank(to) === RANK_1)) {
          var pieces = [QUEEN, ROOK, BISHOP, KNIGHT];
          for (var i = 0, len = pieces.length; i < len; i++) {
            moves.push(build_move(board, from, to, flags, pieces[i]));
      ***REMOVED***
  ***REMOVED*** else {
       moves.push(build_move(board, from, to, flags));
  ***REMOVED***
***REMOVED***

    var moves = [];
    var us = turn;
    var them = swap_color(us);
    var second_rank = {b: RANK_7, w: RANK_2***REMOVED***;

    var first_sq = SQUARES.a8;
    var last_sq = SQUARES.h1;
    var single_square = false;

    /* do we want legal moves? */
    var legal = (typeof options !== 'undefined' && 'legal' in options) ?
                options.legal : true;

    /* are we generating moves for a single square? */
    if (typeof options !== 'undefined' && 'square' in options) {
      if (options.square in SQUARES) {
        first_sq = last_sq = SQUARES[options.square];
        single_square = true;
  ***REMOVED*** else {
        /* invalid square */
        return [];
  ***REMOVED***
***REMOVED***

    for (var i = first_sq; i <= last_sq; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) { i += 7; continue; ***REMOVED***

      var piece = board[i];
      if (piece == null || piece.color !== us) {
        continue;
  ***REMOVED***

      if (piece.type === PAWN) {
        /* single square, non-capturing */
        var square = i + PAWN_OFFSETS[us][0];
        if (board[square] == null) {
            add_move(board, moves, i, square, BITS.NORMAL);

          /* double square */
          var square = i + PAWN_OFFSETS[us][1];
          if (second_rank[us] === rank(i) && board[square] == null) {
            add_move(board, moves, i, square, BITS.BIG_PAWN);
      ***REMOVED***
    ***REMOVED***

        /* pawn captures */
        for (j = 2; j < 4; j++) {
          var square = i + PAWN_OFFSETS[us][j];
          if (square & 0x88) continue;

          if (board[square] != null &&
              board[square].color === them) {
              add_move(board, moves, i, square, BITS.CAPTURE);
      ***REMOVED*** else if (square === ep_square) {
              add_move(board, moves, i, ep_square, BITS.EP_CAPTURE);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED*** else {
        for (var j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
          var offset = PIECE_OFFSETS[piece.type][j];
          var square = i;

          while (true) {
            square += offset;
            if (square & 0x88) break;

            if (board[square] == null) {
              add_move(board, moves, i, square, BITS.NORMAL);
        ***REMOVED*** else {
              if (board[square].color === us) break;
              add_move(board, moves, i, square, BITS.CAPTURE);
              break;
        ***REMOVED***

            /* break, if knight or king */
            if (piece.type === 'n' || piece.type === 'k') break;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    /* check for castling if: a) we're generating all moves, or b) we're doing
     * single square move generation on the king's square
     */
    if ((!single_square) || last_sq === kings[us]) {
      /* king-side castling */
      if (castling[us] & BITS.KSIDE_CASTLE) {
        var castling_from = kings[us];
        var castling_to = castling_from + 2;

        if (board[castling_from + 1] == null &&
            board[castling_to]       == null &&
            !attacked(them, kings[us]) &&
            !attacked(them, castling_from + 1) &&
            !attacked(them, castling_to)) {
          add_move(board, moves, kings[us] , castling_to,
                   BITS.KSIDE_CASTLE);
    ***REMOVED***
  ***REMOVED***

      /* queen-side castling */
      if (castling[us] & BITS.QSIDE_CASTLE) {
        var castling_from = kings[us];
        var castling_to = castling_from - 2;

        if (board[castling_from - 1] == null &&
            board[castling_from - 2] == null &&
            board[castling_from - 3] == null &&
            !attacked(them, kings[us]) &&
            !attacked(them, castling_from - 1) &&
            !attacked(them, castling_to)) {
          add_move(board, moves, kings[us], castling_to,
                   BITS.QSIDE_CASTLE);
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    /* return all pseudo-legal moves (this includes moves that allow the king
     * to be captured)
     */
    if (!legal) {
      return moves;
***REMOVED***

    /* filter out illegal moves */
    var legal_moves = [];
    for (var i = 0, len = moves.length; i < len; i++) {
      make_move(moves[i]);
      if (!king_attacked(us)) {
        legal_moves.push(moves[i]);
  ***REMOVED***
      undo_move();
***REMOVED***

    return legal_moves;
  ***REMOVED***

  /* convert a move from 0x88 coordinates to Standard Algebraic Notation
   * (SAN)
   */
  function move_to_san(move) {
    var output = '';

    if (move.flags & BITS.KSIDE_CASTLE) {
      output = 'O-O';
***REMOVED*** else if (move.flags & BITS.QSIDE_CASTLE) {
      output = 'O-O-O';
***REMOVED*** else {
      var disambiguator = get_disambiguator(move);

      if (move.piece !== PAWN) {
        output += move.piece.toUpperCase() + disambiguator;
  ***REMOVED***

      if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
        if (move.piece === PAWN) {
          output += algebraic(move.from)[0];
    ***REMOVED***
        output += 'x';
  ***REMOVED***

      output += algebraic(move.to);

      if (move.flags & BITS.PROMOTION) {
        output += '=' + move.promotion.toUpperCase();
  ***REMOVED***
***REMOVED***

    make_move(move);
    if (in_check()) {
      if (in_checkmate()) {
        output += '#';
  ***REMOVED*** else {
        output += '+';
  ***REMOVED***
***REMOVED***
    undo_move();

    return output;
  ***REMOVED***

  function attacked(color, square) {
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) { i += 7; continue; ***REMOVED***

      /* if empty square or wrong color */
      if (board[i] == null || board[i].color !== color) continue;

      var piece = board[i];
      var difference = i - square;
      var index = difference + 119;

      if (ATTACKS[index] & (1 << SHIFTS[piece.type])) {
        if (piece.type === PAWN) {
          if (difference > 0) {
            if (piece.color === WHITE) return true;
      ***REMOVED*** else {
            if (piece.color === BLACK) return true;
      ***REMOVED***
          continue;
    ***REMOVED***

        /* if the piece is a knight or a king */
        if (piece.type === 'n' || piece.type === 'k') return true;

        var offset = RAYS[index];
        var j = i + offset;

        var blocked = false;
        while (j !== square) {
          if (board[j] != null) { blocked = true; break; ***REMOVED***
          j += offset;
    ***REMOVED***

        if (!blocked) return true;
  ***REMOVED***
***REMOVED***

    return false;
  ***REMOVED***

  function king_attacked(color) {
    return attacked(swap_color(color), kings[color]);
  ***REMOVED***

  function in_check() {
    return king_attacked(turn);
  ***REMOVED***

  function in_checkmate() {
    return in_check() && generate_moves().length === 0;
  ***REMOVED***

  function in_stalemate() {
    return !in_check() && generate_moves().length === 0;
  ***REMOVED***

  function insufficient_material() {
    var pieces = {***REMOVED***;
    var bishops = [];
    var num_pieces = 0;
    var sq_color = 0;

    for (var i = SQUARES.a8; i<= SQUARES.h1; i++) {
      sq_color = (sq_color + 1) % 2;
      if (i & 0x88) { i += 7; continue; ***REMOVED***

      var piece = board[i];
      if (piece) {
        pieces[piece.type] = (piece.type in pieces) ?
                              pieces[piece.type] + 1 : 1;
        if (piece.type === BISHOP) {
          bishops.push(sq_color);
    ***REMOVED***
        num_pieces++;
  ***REMOVED***
***REMOVED***

    /* k vs. k */
    if (num_pieces === 2) { return true; ***REMOVED***

    /* k vs. kn .... or .... k vs. kb */
    else if (num_pieces === 3 && (pieces[BISHOP] === 1 ||
                                 pieces[KNIGHT] === 1)) { return true; ***REMOVED***

    /* kb vs. kb where any number of bishops are all on the same color */
    else if (num_pieces === pieces[BISHOP] + 2) {
      var sum = 0;
      var len = bishops.length;
      for (var i = 0; i < len; i++) {
        sum += bishops[i];
  ***REMOVED***
      if (sum === 0 || sum === len) { return true; ***REMOVED***
***REMOVED***

    return false;
  ***REMOVED***

  function in_threefold_repetition() {
    /* TODO: while this function is fine for casual use, a better
     * implementation would use a Zobrist key (instead of FEN). the
     * Zobrist key would be maintained in the make_move/undo_move functions,
     * avoiding the costly that we do below.
     */
    var moves = [];
    var positions = {***REMOVED***;
    var repetition = false;

    while (true) {
      var move = undo_move();
      if (!move) break;
      moves.push(move);
***REMOVED***

    while (true) {
      /* remove the last two fields in the FEN string, they're not needed
       * when checking for draw by rep */
      var fen = generate_fen().split(' ').slice(0,4).join(' ');

      /* has the position occurred three or move times */
      positions[fen] = (fen in positions) ? positions[fen] + 1 : 1;
      if (positions[fen] >= 3) {
        repetition = true;
  ***REMOVED***

      if (!moves.length) {
        break;
  ***REMOVED***
      make_move(moves.pop());
***REMOVED***

    return repetition;
  ***REMOVED***

  function push(move) {
    history.push({
      move: move,
      kings: {b: kings.b, w: kings.w***REMOVED***,
      turn: turn,
      castling: {b: castling.b, w: castling.w***REMOVED***,
      ep_square: ep_square,
      half_moves: half_moves,
      move_number: move_number
***REMOVED***);
  ***REMOVED***

  function make_move(move) {
    var us = turn;
    var them = swap_color(us);
    push(move);

    board[move.to] = board[move.from];
    board[move.from] = null;

    /* if ep capture, remove the captured pawn */
    if (move.flags & BITS.EP_CAPTURE) {
      if (turn === BLACK) {
        board[move.to - 16] = null;
  ***REMOVED*** else {
        board[move.to + 16] = null;
  ***REMOVED***
***REMOVED***

    /* if pawn promotion, replace with new piece */
    if (move.flags & BITS.PROMOTION) {
      board[move.to] = {type: move.promotion, color: us***REMOVED***;
***REMOVED***

    /* if we moved the king */
    if (board[move.to].type === KING) {
      kings[board[move.to].color] = move.to;

      /* if we castled, move the rook next to the king */
      if (move.flags & BITS.KSIDE_CASTLE) {
        var castling_to = move.to - 1;
        var castling_from = move.to + 1;
        board[castling_to] = board[castling_from];
        board[castling_from] = null;
  ***REMOVED*** else if (move.flags & BITS.QSIDE_CASTLE) {
        var castling_to = move.to + 1;
        var castling_from = move.to - 2;
        board[castling_to] = board[castling_from];
        board[castling_from] = null;
  ***REMOVED***

      /* turn off castling */
      castling[us] = '';
***REMOVED***

    /* turn off castling if we move a rook */
    if (castling[us]) {
      for (var i = 0, len = ROOKS[us].length; i < len; i++) {
        if (move.from === ROOKS[us][i].square &&
            castling[us] & ROOKS[us][i].flag) {
          castling[us] ^= ROOKS[us][i].flag;
          break;
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    /* turn off castling if we capture a rook */
    if (castling[them]) {
      for (var i = 0, len = ROOKS[them].length; i < len; i++) {
        if (move.to === ROOKS[them][i].square &&
            castling[them] & ROOKS[them][i].flag) {
          castling[them] ^= ROOKS[them][i].flag;
          break;
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    /* if big pawn move, update the en passant square */
    if (move.flags & BITS.BIG_PAWN) {
      if (turn === 'b') {
        ep_square = move.to - 16;
  ***REMOVED*** else {
        ep_square = move.to + 16;
  ***REMOVED***
***REMOVED*** else {
      ep_square = EMPTY;
***REMOVED***

    /* reset the 50 move counter if a pawn is moved or a piece is captured */
    if (move.piece === PAWN) {
      half_moves = 0;
***REMOVED*** else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
      half_moves = 0;
***REMOVED*** else {
      half_moves++;
***REMOVED***

    if (turn === BLACK) {
      move_number++;
***REMOVED***
    turn = swap_color(turn);
  ***REMOVED***

  function undo_move() {
    var old = history.pop();
    if (old == null) { return null; ***REMOVED***

    var move = old.move;
    kings = old.kings;
    turn = old.turn;
    castling = old.castling;
    ep_square = old.ep_square;
    half_moves = old.half_moves;
    move_number = old.move_number;

    var us = turn;
    var them = swap_color(turn);

    board[move.from] = board[move.to];
    board[move.from].type = move.piece;  // to undo any promotions
    board[move.to] = null;

    if (move.flags & BITS.CAPTURE) {
      board[move.to] = {type: move.captured, color: them***REMOVED***;
***REMOVED*** else if (move.flags & BITS.EP_CAPTURE) {
      var index;
      if (us === BLACK) {
        index = move.to - 16;
  ***REMOVED*** else {
        index = move.to + 16;
  ***REMOVED***
      board[index] = {type: PAWN, color: them***REMOVED***;
***REMOVED***


    if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
      var castling_to, castling_from;
      if (move.flags & BITS.KSIDE_CASTLE) {
        castling_to = move.to + 1;
        castling_from = move.to - 1;
  ***REMOVED*** else if (move.flags & BITS.QSIDE_CASTLE) {
        castling_to = move.to - 2;
        castling_from = move.to + 1;
  ***REMOVED***

      board[castling_to] = board[castling_from];
      board[castling_from] = null;
***REMOVED***

    return move;
  ***REMOVED***

  /* this function is used to uniquely identify ambiguous moves */
  function get_disambiguator(move) {
    var moves = generate_moves();

    var from = move.from;
    var to = move.to;
    var piece = move.piece;

    var ambiguities = 0;
    var same_rank = 0;
    var same_file = 0;

    for (var i = 0, len = moves.length; i < len; i++) {
      var ambig_from = moves[i].from;
      var ambig_to = moves[i].to;
      var ambig_piece = moves[i].piece;

      /* if a move of the same piece type ends on the same to square, we'll
       * need to add a disambiguator to the algebraic notation
       */
      if (piece === ambig_piece && from !== ambig_from && to === ambig_to) {
        ambiguities++;

        if (rank(from) === rank(ambig_from)) {
          same_rank++;
    ***REMOVED***

        if (file(from) === file(ambig_from)) {
          same_file++;
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    if (ambiguities > 0) {
      /* if there exists a similar moving piece on the same rank and file as
       * the move in question, use the square as the disambiguator
       */
      if (same_rank > 0 && same_file > 0) {
        return algebraic(from);
  ***REMOVED***
      /* if the moving piece rests on the same file, use the rank symbol as the
       * disambiguator
       */
      else if (same_file > 0) {
        return algebraic(from).charAt(1);
  ***REMOVED***
      /* else use the file symbol */
      else {
        return algebraic(from).charAt(0);
  ***REMOVED***
***REMOVED***

    return '';
  ***REMOVED***

  function ascii() {
    var s = '   +------------------------+\n';
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      /* display the rank */
      if (file(i) === 0) {
        s += ' ' + '87654321'[rank(i)] + ' |';
  ***REMOVED***

      /* empty piece */
      if (board[i] == null) {
        s += ' . ';
  ***REMOVED*** else {
        var piece = board[i].type;
        var color = board[i].color;
        var symbol = (color === WHITE) ?
                     piece.toUpperCase() : piece.toLowerCase();
        s += ' ' + symbol + ' ';
  ***REMOVED***

      if ((i + 1) & 0x88) {
        s += '|\n';
        i += 8;
  ***REMOVED***
***REMOVED***
    s += '   +------------------------+\n';
    s += '     a  b  c  d  e  f  g  h\n';

    return s;
  ***REMOVED***

  /*****************************************************************************
   * UTILITY FUNCTIONS
   ****************************************************************************/
  function rank(i) {
    return i >> 4;
  ***REMOVED***

  function file(i) {
    return i & 15;
  ***REMOVED***

  function algebraic(i){
    var f = file(i), r = rank(i);
    return 'abcdefgh'.substring(f,f+1) + '87654321'.substring(r,r+1);
  ***REMOVED***

  function swap_color(c) {
    return c === WHITE ? BLACK : WHITE;
  ***REMOVED***

  function is_digit(c) {
    return '0123456789'.indexOf(c) !== -1;
  ***REMOVED***

  /* pretty = external move object */
  function make_pretty(ugly_move) {
    var move = clone(ugly_move);
    move.san = move_to_san(move);
    move.to = algebraic(move.to);
    move.from = algebraic(move.from);

    var flags = '';

    for (var flag in BITS) {
      if (BITS[flag] & move.flags) {
        flags += FLAGS[flag];
  ***REMOVED***
***REMOVED***
    move.flags = flags;

    return move;
  ***REMOVED***

  function clone(obj) {
    var dupe = (obj instanceof Array) ? [] : {***REMOVED***;

    for (var property in obj) {
      if (typeof property === 'object') {
        dupe[property] = clone(obj[property]);
  ***REMOVED*** else {
        dupe[property] = obj[property];
  ***REMOVED***
***REMOVED***

    return dupe;
  ***REMOVED***

  function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
  ***REMOVED***

  /*****************************************************************************
   * DEBUGGING UTILITIES
   ****************************************************************************/
  function perft(depth) {
    var moves = generate_moves({legal: false***REMOVED***);
    var nodes = 0;
    var color = turn;

    for (var i = 0, len = moves.length; i < len; i++) {
      make_move(moves[i]);
      if (!king_attacked(color)) {
        if (depth - 1 > 0) {
          var child_nodes = perft(depth - 1);
          nodes += child_nodes;
    ***REMOVED*** else {
          nodes++;
    ***REMOVED***
  ***REMOVED***
      undo_move();
***REMOVED***

    return nodes;
  ***REMOVED***

  return {
    /***************************************************************************
     * PUBLIC CONSTANTS (is there a better way to do this?)
     **************************************************************************/
    WHITE: WHITE,
    BLACK: BLACK,
    PAWN: PAWN,
    KNIGHT: KNIGHT,
    BISHOP: BISHOP,
    ROOK: ROOK,
    QUEEN: QUEEN,
    KING: KING,
    SQUARES: (function() {
                /* from the ECMA-262 spec (section 12.6.4):
                 * "The mechanics of enumerating the properties ... is
                 * implementation dependent"
                 * so: for (var sq in SQUARES) { keys.push(sq); ***REMOVED*** might not be
                 * ordered correctly
                 */
                var keys = [];
                for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
                  if (i & 0x88) { i += 7; continue; ***REMOVED***
                  keys.push(algebraic(i));
            ***REMOVED***
                return keys;
          ***REMOVED***)(),
    FLAGS: FLAGS,

    /***************************************************************************
     * PUBLIC API
     **************************************************************************/
    load: function(fen) {
      return load(fen);
***REMOVED***,

    reset: function() {
      return reset();
***REMOVED***,

    moves: function(options) {
      /* The internal representation of a chess move is in 0x88 format, and
       * not meant to be human-readable.  The code below converts the 0x88
       * square coordinates to algebraic coordinates.  It also prunes an
       * unnecessary move keys resulting from a verbose call.
       */

      var ugly_moves = generate_moves(options);
      var moves = [];

      for (var i = 0, len = ugly_moves.length; i < len; i++) {

        /* does the user want a full move object (most likely not), or just
         * SAN
         */
        if (typeof options !== 'undefined' && 'verbose' in options &&
            options.verbose) {
          moves.push(make_pretty(ugly_moves[i]));
    ***REMOVED*** else {
          moves.push(move_to_san(ugly_moves[i]));
    ***REMOVED***
  ***REMOVED***

      return moves;
***REMOVED***,

    in_check: function() {
      return in_check();
***REMOVED***,

    in_checkmate: function() {
      return in_checkmate();
***REMOVED***,

    in_stalemate: function() {
      return in_stalemate();
***REMOVED***,

    in_draw: function() {
      return half_moves >= 100 ||
             in_stalemate() ||
             insufficient_material() ||
             in_threefold_repetition();
***REMOVED***,

    insufficient_material: function() {
      return insufficient_material();
***REMOVED***,

    in_threefold_repetition: function() {
      return in_threefold_repetition();
***REMOVED***,

    game_over: function() {
      return half_moves >= 100 ||
             in_checkmate() ||
             in_stalemate() ||
             insufficient_material() ||
             in_threefold_repetition();
***REMOVED***,

    validate_fen: function(fen) {
      return validate_fen(fen);
***REMOVED***,

    fen: function() {
      return generate_fen();
***REMOVED***,

    pgn: function(options) {
      /* using the specification from http://www.chessclub.com/help/PGN-spec
       * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" ***REMOVED***)
       */
      var newline = (typeof options === 'object' &&
                     typeof options.newline_char === 'string') ?
                     options.newline_char : '\n';
      var max_width = (typeof options === 'object' &&
                       typeof options.max_width === 'number') ?
                       options.max_width : 0;
      var result = [];
      var header_exists = false;

      /* add the PGN header headerrmation */
      for (var i in header) {
        /* TODO: order of enumerated properties in header object is not
         * guaranteed, see ECMA-262 spec (section 12.6.4)
         */
        result.push('[' + i + ' \"' + header[i] + '\"]' + newline);
        header_exists = true;
  ***REMOVED***

      if (header_exists && history.length) {
        result.push(newline);
  ***REMOVED***

      /* pop all of history onto reversed_history */
      var reversed_history = [];
      while (history.length > 0) {
        reversed_history.push(undo_move());
  ***REMOVED***

      var moves = [];
      var move_string = '';
      var pgn_move_number = 1;

      /* build the list of moves.  a move_string looks like: "3. e3 e6" */
      while (reversed_history.length > 0) {
        var move = reversed_history.pop();

        /* if the position started with black to move, start PGN with 1. ... */
        if (pgn_move_number === 1 && move.color === 'b') {
          move_string = '1. ...';
          pgn_move_number++;
    ***REMOVED*** else if (move.color === 'w') {
          /* store the previous generated move_string if we have one */
          if (move_string.length) {
            moves.push(move_string);
      ***REMOVED***
          move_string = pgn_move_number + '.';
          pgn_move_number++;
    ***REMOVED***

        move_string = move_string + ' ' + move_to_san(move);
        make_move(move);
  ***REMOVED***

      /* are there any other leftover moves? */
      if (move_string.length) {
        moves.push(move_string);
  ***REMOVED***

      /* is there a result? */
      if (typeof header.Result !== 'undefined') {
        moves.push(header.Result);
  ***REMOVED***

      /* history should be back to what is was before we started generating PGN,
       * so join together moves
       */
      if (max_width === 0) {
        return result.join('') + moves.join(' ');
  ***REMOVED***

      /* wrap the PGN output at max_width */
      var current_width = 0;
      for (var i = 0; i < moves.length; i++) {
        /* if the current move will push past max_width */
        if (current_width + moves[i].length > max_width && i !== 0) {

          /* don't end the line with whitespace */
          if (result[result.length - 1] === ' ') {
            result.pop();
      ***REMOVED***

          result.push(newline);
          current_width = 0;
    ***REMOVED*** else if (i !== 0) {
          result.push(' ');
          current_width++;
    ***REMOVED***
        result.push(moves[i]);
        current_width += moves[i].length;
  ***REMOVED***

      return result.join('');
***REMOVED***,

    load_pgn: function(pgn, options) {
      function mask(str) {
        return str.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
  ***REMOVED***

      /* convert a move from Standard Algebraic Notation (SAN) to 0x88
       * coordinates
      */
      function move_from_san(move) {
        var to, from, flags = BITS.NORMAL, promotion;
        var parse = move.match(/^([NBKRQ])?([abcdefgh12345678][12345678]?)?(x)?([abcdefgh][12345678])(=?[NBRQ])?/);
        if (move.slice(0, 5) === 'O-O-O') {
          from = kings[turn];
          to = from - 2;
          flags = BITS.QSIDE_CASTLE;
    ***REMOVED*** else if (move.slice(0, 3) === 'O-O') {
          from = kings[turn];
          to = from + 2;
          flags = BITS.KSIDE_CASTLE;
    ***REMOVED*** else if (parse && parse[1]) {
  ***REMOVED*** regular moves
          var piece = parse[1].toLowerCase();
          if (parse[3]) {
    ***REMOVED*** capture
            flags = BITS.CAPTURE;
      ***REMOVED***
          to = SQUARES[parse[4]];
          for (var j = 0, len = PIECE_OFFSETS[piece].length; j < len; j++) {
            var offset = PIECE_OFFSETS[piece][j];
            var square = to;

            while (true) {
              square += offset;
              if (square & 0x88) break;

              var b = board[square];
              if (b) {
                if (b.color === turn && b.type === piece && (!parse[2] || algebraic(square).indexOf(parse[2]) >= 0)) {
                  from = square;
            ***REMOVED***
                break;
          ***REMOVED***

              /* break, if knight or king */
              if (piece === 'n' || piece === 'k') break;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED*** else if (parse) {
  ***REMOVED*** pawn move
          if (parse[3]) {
    ***REMOVED*** capture
            to = SQUARES[parse[4]];
            for (var j = 2; j < 4; j++) {
              var square = to - PAWN_OFFSETS[turn][j];
              if (square & 0x88) continue;

              if (board[square] != null &&
                  board[square].color === turn &&
                  algebraic(square)[0] === parse[2]) {
                from = square;
          ***REMOVED***
        ***REMOVED***
            if (board[to]) {
              flags = BITS.CAPTURE;
        ***REMOVED*** else {
              flags = BITS.EP_CAPTURE;
        ***REMOVED***
      ***REMOVED*** else {
    ***REMOVED*** normal move
            to = SQUARES[move.slice(0,2)];
            var c = to - PAWN_OFFSETS[turn][0],
                b = board[c];
            if (b && b.type === PAWN && b.color === turn) {
              from = c;
        ***REMOVED*** else {
              c = to - PAWN_OFFSETS[turn][1];
              b = board[c];
              if (b && b.type === PAWN && b.color === turn) {
                from = c;
                flags = BITS.BIG_PAWN;
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
  ***REMOVED*** promotion?
          if (parse[5]) {
            if(typeof parse[5][1] == 'undefined') {
              promotion = parse[5][0].toLowerCase();
        ***REMOVED*** else {
              promotion = parse[5][1].toLowerCase();
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
        if (from >=0 && to >=0 && flags) {
          return build_move(board, from, to, flags, promotion);
    ***REMOVED*** else if (move.length > 0) {
          /* alert(move); // error in PGN, or in parsing. */
    ***REMOVED***
  ***REMOVED***

      function get_move_obj(move) {
        return move_from_san(trim(move));
  ***REMOVED***

      function has_keys(object) {
        var has_keys = false;
        for (var key in object) {
          has_keys = true;
    ***REMOVED***
        return has_keys;
  ***REMOVED***

      function parse_pgn_header(header, options) {
        var newline_char = (typeof options === 'object' &&
                            typeof options.newline_char === 'string') ?
                            options.newline_char : '\r?\n';
        var header_obj = {***REMOVED***;
        var headers = header.split(newline_char);
        var key = '';
        var value = '';

        for (var i = 0; i < headers.length; i++) {
          key = headers[i].replace(/^\[([A-Z][A-Za-z]*)\s.*\]$/, '$1');
          value = headers[i].replace(/^\[[A-Za-z]+\s"(.*)"\]$/, '$1');
          if (trim(key).length > 0) {
            header_obj[key] = value;
      ***REMOVED***
    ***REMOVED***

        return header_obj;
  ***REMOVED***

      var newline_char = (typeof options === 'object' &&
                          typeof options.newline_char === 'string') ?
                          options.newline_char : '\r?\n';
        var regex = new RegExp('^(\\[(.|' + mask(newline_char) + ')*\\])' +
                               '(' + mask(newline_char) + ')*' +
                               '1.(' + mask(newline_char) + '|.)*$', 'g');

      /* get header part of the PGN file */
      var header_string = pgn.replace(regex, '$1');

      /* no info part given, begins with moves */
      if (header_string[0] !== '[') {
        header_string = '';
  ***REMOVED***

     reset();

      /* parse PGN header */
      var headers = parse_pgn_header(header_string, options);
      for (var key in headers) {
        set_header([key, headers[key]]);
  ***REMOVED***

      /* delete header to get the moves */
      var ms = pgn.replace(header_string, '').replace(new RegExp(mask(newline_char), 'g'), ' ');

      /* delete comments */
      ms = ms.replace(/(\{[^***REMOVED***]+\***REMOVED***)+?/g, '');

      /* delete move numbers */
      ms = ms.replace(/\d+\./g, '');


      /* trim and get array of moves */
      var moves = trim(ms).split(new RegExp(/\s+/));

      /* delete empty entries */
      moves = moves.join(',').replace(/,,+/g, ',').split(',');
      var move = '';

      for (var half_move = 0; half_move < moves.length - 1; half_move++) {
        move = get_move_obj(moves[half_move]);

        /* move not possible! (don't clear the board to examine to show the
         * latest valid position)
         */
        if (move == null) {
          return false;
    ***REMOVED*** else {
          make_move(move);
    ***REMOVED***
  ***REMOVED***

      /* examine last move */
      move = moves[moves.length - 1];
      if (POSSIBLE_RESULTS.indexOf(move) > -1) {
        if (has_keys(header) && typeof header.Result === 'undefined') {
          set_header(['Result', move]);
    ***REMOVED***
  ***REMOVED***
      else {
        move = get_move_obj(move);
        if (move == null) {
          return false;
    ***REMOVED*** else {
          make_move(move);
    ***REMOVED***
  ***REMOVED***
      return true;
***REMOVED***,

    header: function() {
      return set_header(arguments);
***REMOVED***,

    ascii: function() {
      return ascii();
***REMOVED***,

    turn: function() {
      return turn;
***REMOVED***,

    move: function(move) {
      /* The move function can be called with in the following parameters:
       *
       * .move('Nxb7')      <- where 'move' is a case-sensitive SAN string
       *
       * .move({ from: 'h7', <- where the 'move' is a move object (additional
       *         to :'h8',      fields are ignored)
       *         promotion: 'q',
       *  ***REMOVED***)
       */
      var move_obj = null;
      var moves = generate_moves();

      if (typeof move === 'string') {
        /* convert the move string to a move object */
        for (var i = 0, len = moves.length; i < len; i++) {
          if (move === move_to_san(moves[i])) {
            move_obj = moves[i];
            break;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED*** else if (typeof move === 'object') {
        /* convert the pretty move object to an ugly move object */
        for (var i = 0, len = moves.length; i < len; i++) {
          if (move.from === algebraic(moves[i].from) &&
              move.to === algebraic(moves[i].to) &&
              (!('promotion' in moves[i]) ||
              move.promotion === moves[i].promotion)) {
            move_obj = moves[i];
            break;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***

      /* failed to find move */
      if (!move_obj) {
        return null;
  ***REMOVED***

      /* need to make a copy of move because we can't generate SAN after the
       * move is made
       */
      var pretty_move = make_pretty(move_obj);

      make_move(move_obj);

      return pretty_move;
***REMOVED***,

    undo: function() {
      var move = undo_move();
      return (move) ? make_pretty(move) : null;
***REMOVED***,

    clear: function() {
      return clear();
***REMOVED***,

    put: function(piece, square) {
      return put(piece, square);
***REMOVED***,

    get: function(square) {
      return get(square);
***REMOVED***,

    remove: function(square) {
      return remove(square);
***REMOVED***,

    perft: function(depth) {
      return perft(depth);
***REMOVED***,

    square_color: function(square) {
      if (square in SQUARES) {
        var sq_0x88 = SQUARES[square];
        return ((rank(sq_0x88) + file(sq_0x88)) % 2 === 0) ? 'light' : 'dark';
  ***REMOVED***

      return null;
***REMOVED***,

    history: function(options) {
      var reversed_history = [];
      var move_history = [];
      var verbose = (typeof options !== 'undefined' && 'verbose' in options &&
                     options.verbose);

      while (history.length > 0) {
        reversed_history.push(undo_move());
  ***REMOVED***

      while (reversed_history.length > 0) {
        var move = reversed_history.pop();
        if (verbose) {
          move_history.push(make_pretty(move));
    ***REMOVED*** else {
          move_history.push(move_to_san(move));
    ***REMOVED***
        make_move(move);
  ***REMOVED***

      return move_history;
***REMOVED***

  ***REMOVED***;
***REMOVED***;

/* export Chess object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') exports.Chess = Chess;