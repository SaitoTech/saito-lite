/*!
 * Font Awesome Free 5.10.1 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global['fontawesome-free-conflict-detection'] = {***REMOVED***)));
***REMOVED***(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
  ***REMOVED***;
***REMOVED*** else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  ***REMOVED***;
***REMOVED***

    return _typeof(obj);
  ***REMOVED***

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
  ***REMOVED***);
***REMOVED*** else {
      obj[key] = value;
***REMOVED***

    return obj;
  ***REMOVED***

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {***REMOVED***;
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
    ***REMOVED***));
  ***REMOVED***

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
  ***REMOVED***);
***REMOVED***

    return target;
  ***REMOVED***

  var _WINDOW = {***REMOVED***;
  var _DOCUMENT = {***REMOVED***;

  try {
    if (typeof window !== 'undefined') _WINDOW = window;
    if (typeof document !== 'undefined') _DOCUMENT = document;
  ***REMOVED*** catch (e) {***REMOVED***

  var _ref = _WINDOW.navigator || {***REMOVED***,
      _ref$userAgent = _ref.userAgent,
      userAgent = _ref$userAgent === void 0 ? '' : _ref$userAgent;

  var WINDOW = _WINDOW;
  var DOCUMENT = _DOCUMENT;
  var IS_BROWSER = !!WINDOW.document;
  var IS_DOM = !!DOCUMENT.documentElement && !!DOCUMENT.head && typeof DOCUMENT.addEventListener === 'function' && typeof DOCUMENT.createElement === 'function';
  var IS_IE = ~userAgent.indexOf('MSIE') || ~userAgent.indexOf('Trident/');

  var functions = [];

  var listener = function listener() {
    DOCUMENT.removeEventListener('DOMContentLoaded', listener);
    loaded = 1;
    functions.map(function (fn) {
      return fn();
***REMOVED***);
  ***REMOVED***;

  var loaded = false;

  if (IS_DOM) {
    loaded = (DOCUMENT.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(DOCUMENT.readyState);
    if (!loaded) DOCUMENT.addEventListener('DOMContentLoaded', listener);
  ***REMOVED***

  function domready (fn) {
    if (!IS_DOM) return;
    loaded ? setTimeout(fn, 0) : functions.push(fn);
  ***REMOVED***

  function report (_ref) {
    var nodesTested = _ref.nodesTested,
        nodesFound = _ref.nodesFound;
    var timedOutTests = {***REMOVED***;

    for (var key in nodesFound) {
      if (!(nodesTested.conflict[key] || nodesTested.noConflict[key])) {
        timedOutTests[key] = nodesFound[key];
  ***REMOVED***
***REMOVED***

    var conflictsCount = Object.keys(nodesTested.conflict).length;

    if (conflictsCount > 0) {
      console.info("%cConflict".concat(conflictsCount > 1 ? 's' : '', " found:"), 'color: darkred; font-size: large');
      var data = {***REMOVED***;

      for (var _key in nodesTested.conflict) {
        var item = nodesTested.conflict[_key];
        data[_key] = {
          'tagName': item.tagName,
          'src/href': item.src || item.href || 'n/a',
          'innerText excerpt': item.innerText && item.innerText !== '' ? item.innerText.slice(0, 200) + '...' : '(empty)'
    ***REMOVED***;
  ***REMOVED***

      console.table(data);
***REMOVED***

    var noConflictsCount = Object.keys(nodesTested.noConflict).length;

    if (noConflictsCount > 0) {
      console.info("%cNo conflict".concat(noConflictsCount > 1 ? 's' : '', " found with ").concat(noConflictsCount == 1 ? 'this' : 'these', ":"), 'color: green; font-size: large');
      var _data = {***REMOVED***;

      for (var _key2 in nodesTested.noConflict) {
        var _item = nodesTested.noConflict[_key2];
        _data[_key2] = {
          'tagName': _item.tagName,
          'src/href': _item.src || _item.href || 'n/a',
          'innerText excerpt': _item.innerText && _item.innerText !== '' ? _item.innerText.slice(0, 200) + '...' : '(empty)'
    ***REMOVED***;
  ***REMOVED***

      console.table(_data);
***REMOVED***

    var timeOutCount = Object.keys(timedOutTests).length;

    if (timeOutCount > 0) {
      console.info("%cLeftovers--we timed out before collecting test results for ".concat(timeOutCount == 1 ? 'this' : 'these', ":"), 'color: blue; font-size: large');
      var _data2 = {***REMOVED***;

      for (var _key3 in timedOutTests) {
        var _item2 = timedOutTests[_key3];
        _data2[_key3] = {
          'tagName': _item2.tagName,
          'src/href': _item2.src || _item2.href || 'n/a',
          'innerText excerpt': _item2.innerText && _item2.innerText !== '' ? _item2.innerText.slice(0, 200) + '...' : '(empty)'
    ***REMOVED***;
  ***REMOVED***

      console.table(_data2);
***REMOVED***
  ***REMOVED***

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {***REMOVED***;

  function createCommonjsModule(fn, module) {
  	return module = { exports: {***REMOVED*** ***REMOVED***, fn(module, module.exports), module.exports;
  ***REMOVED***

  var md5 = createCommonjsModule(function (module) {

    (function ($) {
      /**
       * Add integers, wrapping at 2^32.
       * This uses 16-bit operations internally to work around bugs in interpreters.
       *
       * @param {number***REMOVED*** x First integer
       * @param {number***REMOVED*** y Second integer
       * @returns {number***REMOVED*** Sum
       */

      function safeAdd(x, y) {
        var lsw = (x & 0xffff) + (y & 0xffff);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return msw << 16 | lsw & 0xffff;
  ***REMOVED***
      /**
       * Bitwise rotate a 32-bit number to the left.
       *
       * @param {number***REMOVED*** num 32-bit number
       * @param {number***REMOVED*** cnt Rotation count
       * @returns {number***REMOVED*** Rotated number
       */


      function bitRotateLeft(num, cnt) {
        return num << cnt | num >>> 32 - cnt;
  ***REMOVED***
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number***REMOVED*** q q
       * @param {number***REMOVED*** a a
       * @param {number***REMOVED*** b b
       * @param {number***REMOVED*** x x
       * @param {number***REMOVED*** s s
       * @param {number***REMOVED*** t t
       * @returns {number***REMOVED*** Result
       */


      function md5cmn(q, a, b, x, s, t) {
        return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  ***REMOVED***
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number***REMOVED*** a a
       * @param {number***REMOVED*** b b
       * @param {number***REMOVED*** c c
       * @param {number***REMOVED*** d d
       * @param {number***REMOVED*** x x
       * @param {number***REMOVED*** s s
       * @param {number***REMOVED*** t t
       * @returns {number***REMOVED*** Result
       */


      function md5ff(a, b, c, d, x, s, t) {
        return md5cmn(b & c | ~b & d, a, b, x, s, t);
  ***REMOVED***
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number***REMOVED*** a a
       * @param {number***REMOVED*** b b
       * @param {number***REMOVED*** c c
       * @param {number***REMOVED*** d d
       * @param {number***REMOVED*** x x
       * @param {number***REMOVED*** s s
       * @param {number***REMOVED*** t t
       * @returns {number***REMOVED*** Result
       */


      function md5gg(a, b, c, d, x, s, t) {
        return md5cmn(b & d | c & ~d, a, b, x, s, t);
  ***REMOVED***
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number***REMOVED*** a a
       * @param {number***REMOVED*** b b
       * @param {number***REMOVED*** c c
       * @param {number***REMOVED*** d d
       * @param {number***REMOVED*** x x
       * @param {number***REMOVED*** s s
       * @param {number***REMOVED*** t t
       * @returns {number***REMOVED*** Result
       */


      function md5hh(a, b, c, d, x, s, t) {
        return md5cmn(b ^ c ^ d, a, b, x, s, t);
  ***REMOVED***
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number***REMOVED*** a a
       * @param {number***REMOVED*** b b
       * @param {number***REMOVED*** c c
       * @param {number***REMOVED*** d d
       * @param {number***REMOVED*** x x
       * @param {number***REMOVED*** s s
       * @param {number***REMOVED*** t t
       * @returns {number***REMOVED*** Result
       */


      function md5ii(a, b, c, d, x, s, t) {
        return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  ***REMOVED***
      /**
       * Calculate the MD5 of an array of little-endian words, and a bit length.
       *
       * @param {Array***REMOVED*** x Array of little-endian words
       * @param {number***REMOVED*** len Bit length
       * @returns {Array<number>***REMOVED*** MD5 Array
       */


      function binlMD5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << len % 32;
        x[(len + 64 >>> 9 << 4) + 14] = len;
        var i;
        var olda;
        var oldb;
        var oldc;
        var oldd;
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;

        for (i = 0; i < x.length; i += 16) {
          olda = a;
          oldb = b;
          oldc = c;
          oldd = d;
          a = md5ff(a, b, c, d, x[i], 7, -680876936);
          d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
          c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
          b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
          a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
          d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
          c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
          b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
          a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
          d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
          c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
          b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
          a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
          d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
          c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
          b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
          a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
          d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
          c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
          b = md5gg(b, c, d, a, x[i], 20, -373897302);
          a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
          d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
          c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
          b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
          a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
          d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
          c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
          b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
          a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
          d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
          c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
          b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
          a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
          d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
          c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
          b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
          a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
          d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
          c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
          b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
          a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
          d = md5hh(d, a, b, c, x[i], 11, -358537222);
          c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
          b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
          a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
          d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
          c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
          b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
          a = md5ii(a, b, c, d, x[i], 6, -198630844);
          d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
          c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
          b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
          a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
          d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
          c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
          b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
          a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
          d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
          c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
          b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
          a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
          d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
          c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
          b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
          a = safeAdd(a, olda);
          b = safeAdd(b, oldb);
          c = safeAdd(c, oldc);
          d = safeAdd(d, oldd);
    ***REMOVED***

        return [a, b, c, d];
  ***REMOVED***
      /**
       * Convert an array of little-endian words to a string
       *
       * @param {Array<number>***REMOVED*** input MD5 Array
       * @returns {string***REMOVED*** MD5 string
       */


      function binl2rstr(input) {
        var i;
        var output = '';
        var length32 = input.length * 32;

        for (i = 0; i < length32; i += 8) {
          output += String.fromCharCode(input[i >> 5] >>> i % 32 & 0xff);
    ***REMOVED***

        return output;
  ***REMOVED***
      /**
       * Convert a raw string to an array of little-endian words
       * Characters >255 have their high-byte silently ignored.
       *
       * @param {string***REMOVED*** input Raw input string
       * @returns {Array<number>***REMOVED*** Array of little-endian words
       */


      function rstr2binl(input) {
        var i;
        var output = [];
        output[(input.length >> 2) - 1] = undefined;

        for (i = 0; i < output.length; i += 1) {
          output[i] = 0;
    ***REMOVED***

        var length8 = input.length * 8;

        for (i = 0; i < length8; i += 8) {
          output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
    ***REMOVED***

        return output;
  ***REMOVED***
      /**
       * Calculate the MD5 of a raw string
       *
       * @param {string***REMOVED*** s Input string
       * @returns {string***REMOVED*** Raw MD5 string
       */


      function rstrMD5(s) {
        return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
  ***REMOVED***
      /**
       * Calculates the HMAC-MD5 of a key and some data (raw strings)
       *
       * @param {string***REMOVED*** key HMAC key
       * @param {string***REMOVED*** data Raw input string
       * @returns {string***REMOVED*** Raw MD5 string
       */


      function rstrHMACMD5(key, data) {
        var i;
        var bkey = rstr2binl(key);
        var ipad = [];
        var opad = [];
        var hash;
        ipad[15] = opad[15] = undefined;

        if (bkey.length > 16) {
          bkey = binlMD5(bkey, key.length * 8);
    ***REMOVED***

        for (i = 0; i < 16; i += 1) {
          ipad[i] = bkey[i] ^ 0x36363636;
          opad[i] = bkey[i] ^ 0x5c5c5c5c;
    ***REMOVED***

        hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
        return binl2rstr(binlMD5(opad.concat(hash), 512 + 128));
  ***REMOVED***
      /**
       * Convert a raw string to a hex string
       *
       * @param {string***REMOVED*** input Raw input string
       * @returns {string***REMOVED*** Hex encoded string
       */


      function rstr2hex(input) {
        var hexTab = '0123456789abcdef';
        var output = '';
        var x;
        var i;

        for (i = 0; i < input.length; i += 1) {
          x = input.charCodeAt(i);
          output += hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f);
    ***REMOVED***

        return output;
  ***REMOVED***
      /**
       * Encode a string as UTF-8
       *
       * @param {string***REMOVED*** input Input string
       * @returns {string***REMOVED*** UTF8 string
       */


      function str2rstrUTF8(input) {
        return unescape(encodeURIComponent(input));
  ***REMOVED***
      /**
       * Encodes input string as raw MD5 string
       *
       * @param {string***REMOVED*** s Input string
       * @returns {string***REMOVED*** Raw MD5 string
       */


      function rawMD5(s) {
        return rstrMD5(str2rstrUTF8(s));
  ***REMOVED***
      /**
       * Encodes input string as Hex encoded string
       *
       * @param {string***REMOVED*** s Input string
       * @returns {string***REMOVED*** Hex encoded string
       */


      function hexMD5(s) {
        return rstr2hex(rawMD5(s));
  ***REMOVED***
      /**
       * Calculates the raw HMAC-MD5 for the given key and data
       *
       * @param {string***REMOVED*** k HMAC key
       * @param {string***REMOVED*** d Input string
       * @returns {string***REMOVED*** Raw MD5 string
       */


      function rawHMACMD5(k, d) {
        return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d));
  ***REMOVED***
      /**
       * Calculates the Hex encoded HMAC-MD5 for the given key and data
       *
       * @param {string***REMOVED*** k HMAC key
       * @param {string***REMOVED*** d Input string
       * @returns {string***REMOVED*** Raw MD5 string
       */


      function hexHMACMD5(k, d) {
        return rstr2hex(rawHMACMD5(k, d));
  ***REMOVED***
      /**
       * Calculates MD5 value for a given string.
       * If a key is provided, calculates the HMAC-MD5 value.
       * Returns a Hex encoded string unless the raw argument is given.
       *
       * @param {string***REMOVED*** string Input string
       * @param {string***REMOVED*** [key] HMAC key
       * @param {boolean***REMOVED*** raw Raw oytput switch
       * @returns {string***REMOVED*** MD5 output
       */


      function md5(string, key, raw) {
        if (!key) {
          if (!raw) {
            return hexMD5(string);
      ***REMOVED***

          return rawMD5(string);
    ***REMOVED***

        if (!raw) {
          return hexHMACMD5(key, string);
    ***REMOVED***

        return rawHMACMD5(key, string);
  ***REMOVED***

      if (module.exports) {
        module.exports = md5;
  ***REMOVED*** else {
        $.md5 = md5;
  ***REMOVED***
***REMOVED***)(commonjsGlobal);
  ***REMOVED***);

  function md5ForNode(node) {
    if (null === node || 'object' !== _typeof(node)) return undefined;

    if (node.src) {
      return md5(node.src);
***REMOVED*** else if (node.href) {
      return md5(node.href);
***REMOVED*** else if (node.innerText && '' !== node.innerText) {
      // eslint-disable-line yoda
      return md5(node.innerText);
***REMOVED*** else {
      return undefined;
***REMOVED***
  ***REMOVED***

  var diagScriptId = 'fa-kits-diag';
  var nodeUnderTestId = 'fa-kits-node-under-test';
  var md5Attr = 'data-md5';
  var detectionIgnoreAttr = 'data-fa-detection-ignore';
  var timeoutAttr = 'data-fa-detection-timeout';
  var resultsCollectionMaxWaitAttr = 'data-fa-detection-results-collection-max-wait';

  function pollUntil(_ref) {
    var _ref$fn = _ref.fn,
        fn = _ref$fn === void 0 ? function () {
      return true;
***REMOVED*** : _ref$fn,
        _ref$initialDuration = _ref.initialDuration,
        initialDuration = _ref$initialDuration === void 0 ? 1 : _ref$initialDuration,
        _ref$maxDuration = _ref.maxDuration,
        maxDuration = _ref$maxDuration === void 0 ? WINDOW.FontAwesomeDetection.timeout : _ref$maxDuration,
        _ref$showProgress = _ref.showProgress,
        showProgress = _ref$showProgress === void 0 ? false : _ref$showProgress,
        progressIndicator = _ref.progressIndicator;
    return new Promise(function (resolve, reject) {
      // eslint-disable-line compat/compat
      function poll(duration, cumulativeDuration) {
        setTimeout(function () {
          var result = fn();

          if (showProgress) {
            console.info(progressIndicator);
      ***REMOVED***

          if (!!result) {
    ***REMOVED*** eslint-disable-line no-extra-boolean-cast
            resolve(result);
      ***REMOVED*** else {
            var nextDuration = 250;
            var nextCumulativeDuration = nextDuration + cumulativeDuration;

            if (nextCumulativeDuration <= maxDuration) {
              poll(nextDuration, nextCumulativeDuration);
        ***REMOVED*** else {
              reject('timeout'); // eslint-disable-line prefer-promise-reject-errors
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***, duration);
  ***REMOVED***

      poll(initialDuration, 0);
***REMOVED***);
  ***REMOVED***

  function detectWebfontConflicts() {
    var linkTags = Array.from(DOCUMENT.getElementsByTagName('link')).filter(function (t) {
      return !t.hasAttribute(detectionIgnoreAttr);
***REMOVED***);
    var styleTags = Array.from(DOCUMENT.getElementsByTagName('style')).filter(function (t) {
      if (t.hasAttribute(detectionIgnoreAttr)) {
        return false;
  ***REMOVED*** // If the browser has loaded the FA5 CSS, let's not test that <style> element.
      // Its enough that we'll be testing for traces of the corresponding JS being loaded, and testing
      // this <style> would only produce a false negative anyway.


      if (WINDOW.FontAwesomeConfig && t.innerText.match(new RegExp("svg:not\\(:root\\)\\.".concat(WINDOW.FontAwesomeConfig.replacementClass)))) {
        return false;
  ***REMOVED***

      return true;
***REMOVED***);

    function runDiag(scriptOrLinkTag, md5) {
      var diagFrame = DOCUMENT.createElement('iframe'); // Using "visibility: hidden; position: absolute" instead of "display: none;" because
      // Firefox will not return the expected results for getComputedStyle if our iframe has display: none.

      diagFrame.setAttribute('style', 'visibility: hidden; position: absolute; height: 0; width: 0;');
      var testIconId = 'fa-test-icon-' + md5;
      var iTag = DOCUMENT.createElement('i');
      iTag.setAttribute('class', 'fa fa-coffee');
      iTag.setAttribute('id', testIconId);
      var diagScript = DOCUMENT.createElement('script');
      diagScript.setAttribute('id', diagScriptId); // WARNING: this function will be toString()'d and assigned to innerText of the diag script
      // element that we'll be putting into a diagnostic iframe.
      // That means that this code won't compile until after the outer script has run and injected
      // this code into the iframe. There are some compile time errors that might occur there.
      // For example, using single line (double-slash) comments like this one inside that function
      // will probably cause it to choke. Chrome will show an error like this:
      // Uncaught SyntaxError: Unexpected end of input

      var diagScriptFun = function diagScriptFun(nodeUnderTestId, testIconId, md5, parentOrigin) {
        parent.FontAwesomeDetection.__pollUntil({
          fn: function fn() {
            var iEl = document.getElementById(testIconId);
            var computedStyle = window.getComputedStyle(iEl);
            var fontFamily = computedStyle.getPropertyValue('font-family');

            if (!!fontFamily.match(/FontAwesome/) || !!fontFamily.match(/Font Awesome 5/)) {
              return true;
        ***REMOVED*** else {
              return false;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***).then(function () {
          var node = document.getElementById(nodeUnderTestId);
          parent.postMessage({
            type: 'fontawesome-conflict',
            technology: 'webfont',
            href: node.href,
            innerText: node.innerText,
            tagName: node.tagName,
            md5: md5
      ***REMOVED***, parentOrigin);
    ***REMOVED***).catch(function (e) {
          var node = document.getElementById(nodeUnderTestId);

          if (e === 'timeout') {
            parent.postMessage({
              type: 'no-conflict',
              technology: 'webfont',
              href: node.src,
              innerText: node.innerText,
              tagName: node.tagName,
              md5: md5
        ***REMOVED***, parentOrigin);
      ***REMOVED*** else {
            console.error(e);
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***;

      var parentOrigin = WINDOW.location.origin === 'file://' ? '*' : WINDOW.location.origin;
      diagScript.innerText = "(".concat(diagScriptFun.toString(), ")('").concat(nodeUnderTestId, "', '").concat(testIconId || 'foo', "', '").concat(md5, "', '").concat(parentOrigin, "');");

      diagFrame.onload = function () {
        diagFrame.contentDocument.head.appendChild(diagScript);
        diagFrame.contentDocument.head.appendChild(scriptOrLinkTag);
        diagFrame.contentDocument.body.appendChild(iTag);
  ***REMOVED***;

      domready(function () {
        return DOCUMENT.body.appendChild(diagFrame);
  ***REMOVED***);
***REMOVED***

    var cssByMD5 = {***REMOVED***;

    for (var i = 0; i < linkTags.length; i++) {
      var linkUnderTest = DOCUMENT.createElement('link');
      linkUnderTest.setAttribute('id', nodeUnderTestId);
      linkUnderTest.setAttribute('href', linkTags[i].href);
      linkUnderTest.setAttribute('rel', linkTags[i].rel);
      var md5ForLink = md5ForNode(linkTags[i]);
      linkUnderTest.setAttribute(md5Attr, md5ForLink);
      cssByMD5[md5ForLink] = linkTags[i];
      runDiag(linkUnderTest, md5ForLink);
***REMOVED***

    for (var _i = 0; _i < styleTags.length; _i++) {
      var styleUnderTest = DOCUMENT.createElement('style');
      styleUnderTest.setAttribute('id', nodeUnderTestId);
      var md5ForStyle = md5ForNode(styleTags[_i]);
      styleUnderTest.setAttribute(md5Attr, md5ForStyle);
      styleUnderTest.innerText = styleTags[_i].innerText;
      cssByMD5[md5ForStyle] = styleTags[_i];
      runDiag(styleUnderTest, md5ForStyle);
***REMOVED***

    return cssByMD5;
  ***REMOVED***

  function detectSvgConflicts(currentScript) {
    var scripts = Array.from(DOCUMENT.scripts).filter(function (t) {
      return !t.hasAttribute(detectionIgnoreAttr) && t !== currentScript;
***REMOVED***);
    var scriptsByMD5 = {***REMOVED***;

    var _loop = function _loop(scriptIdx) {
      var diagFrame = DOCUMENT.createElement('iframe');
      diagFrame.setAttribute('style', 'display:none;');
      var scriptUnderTest = DOCUMENT.createElement('script');
      scriptUnderTest.setAttribute('id', nodeUnderTestId);
      var md5ForScript = md5ForNode(scripts[scriptIdx]);
      scriptUnderTest.setAttribute(md5Attr, md5ForScript);
      scriptsByMD5[md5ForScript] = scripts[scriptIdx];

      if (scripts[scriptIdx].src !== '') {
        scriptUnderTest.src = scripts[scriptIdx].src;
  ***REMOVED***

      if (scripts[scriptIdx].innerText !== '') {
        scriptUnderTest.innerText = scripts[scriptIdx].innerText;
  ***REMOVED***

      scriptUnderTest.async = true;
      var diagScript = DOCUMENT.createElement('script');
      diagScript.setAttribute('id', diagScriptId);
      var parentOrigin = WINDOW.location.origin === 'file://' ? '*' : WINDOW.location.origin;

      var diagScriptFun = function diagScriptFun(nodeUnderTestId, md5, parentOrigin) {
        parent.FontAwesomeDetection.__pollUntil({
          fn: function fn() {
            return !!window.FontAwesomeConfig;
      ***REMOVED***
    ***REMOVED***).then(function () {
          var scriptNode = document.getElementById(nodeUnderTestId);
          parent.postMessage({
            type: 'fontawesome-conflict',
            technology: 'js',
            src: scriptNode.src,
            innerText: scriptNode.innerText,
            tagName: scriptNode.tagName,
            md5: md5
      ***REMOVED***, parentOrigin);
    ***REMOVED***).catch(function (e) {
          var scriptNode = document.getElementById(nodeUnderTestId);

          if (e === 'timeout') {
            parent.postMessage({
              type: 'no-conflict',
              src: scriptNode.src,
              innerText: scriptNode.innerText,
              tagName: scriptNode.tagName,
              md5: md5
        ***REMOVED***, parentOrigin);
      ***REMOVED*** else {
            console.error(e);
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***;

      diagScript.innerText = "(".concat(diagScriptFun.toString(), ")('").concat(nodeUnderTestId, "', '").concat(md5ForScript, "', '").concat(parentOrigin, "');");

      diagFrame.onload = function () {
        diagFrame.contentDocument.head.appendChild(diagScript);
        diagFrame.contentDocument.head.appendChild(scriptUnderTest);
  ***REMOVED***;

      domready(function () {
        return DOCUMENT.body.appendChild(diagFrame);
  ***REMOVED***);
***REMOVED***;

    for (var scriptIdx = 0; scriptIdx < scripts.length; scriptIdx++) {
      _loop(scriptIdx);
***REMOVED***

    return scriptsByMD5;
  ***REMOVED***

  function setDoneResults(_ref2) {
    var nodesTested = _ref2.nodesTested,
        nodesFound = _ref2.nodesFound;
    WINDOW.FontAwesomeDetection = WINDOW.FontAwesomeDetection || {***REMOVED***;
    WINDOW.FontAwesomeDetection.nodesTested = nodesTested;
    WINDOW.FontAwesomeDetection.nodesFound = nodesFound;
    WINDOW.FontAwesomeDetection.detectionDone = true;
  ***REMOVED***

  function conflictDetection() {
    var report$$1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {***REMOVED***;
    var nodesTested = {
      conflict: {***REMOVED***,
      noConflict: {***REMOVED***
***REMOVED***;

    WINDOW.onmessage = function (e) {
      if (WINDOW.location.origin === 'file://' || e.origin === WINDOW.location.origin) {
        if (e && e.data) {
          if (e.data.type === 'fontawesome-conflict') {
            nodesTested.conflict[e.data.md5] = e.data;
      ***REMOVED*** else if (e.data.type === 'no-conflict') {
            nodesTested.noConflict[e.data.md5] = e.data;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***;

    var scriptsToTest = detectSvgConflicts(DOCUMENT.currentScript);
    var cssToTest = detectWebfontConflicts();

    var nodesFound = _objectSpread({***REMOVED***, scriptsToTest, cssToTest);

    var testCount = Object.keys(scriptsToTest).length + Object.keys(cssToTest).length; // The resultsCollectionMaxWait allows for the time between when the tests running under
    // child iframes call postMessage with their results, and when the parent window
    // receives and handles those events with window.onmessage.
    // Making it configurable allows us to test the scenario where this timeout is exceeded.
    // Naming it something very different from "timeout" is to help avoid the potential ambiguity between
    // these two timeout-related settings.

    var masterTimeout = WINDOW.FontAwesomeDetection.timeout + WINDOW.FontAwesomeDetection.resultsCollectionMaxWait;
    console.group('Font Awesome Detector');

    if (testCount === 0) {
      console.info('%cAll Good!', 'color: green; font-size: large');
      console.info('We didn\'t find anything that needs testing for conflicts. Ergo, no conflicts.');
***REMOVED*** else {
      console.info("Testing ".concat(testCount, " possible conflicts."));
      console.info("We'll wait about ".concat(Math.round(WINDOW.FontAwesomeDetection.timeout / 10) / 100, " seconds while testing these and\n") + "then up to another ".concat(Math.round(WINDOW.FontAwesomeDetection.resultsCollectionMaxWait / 10) / 100, " to allow the browser time\n") + "to accumulate the results. But we'll probably be outta here way before then.\n\n");
      console.info("You can adjust those durations by assigning values to these attributes on the <script> element that loads this detection:");
      console.info("\t%c".concat(timeoutAttr, "%c: milliseconds to wait for each test before deciding whether it's a conflict."), 'font-weight: bold;', 'font-size: normal;');
      console.info("\t%c".concat(resultsCollectionMaxWaitAttr, "%c: milliseconds to wait for the browser to accumulate test results before giving up."), 'font-weight: bold;', 'font-size: normal;');
      pollUntil({
***REMOVED*** Give this overall timer a little extra cushion
        maxDuration: masterTimeout,
        showProgress: true,
        progressIndicator: 'waiting...',
        fn: function fn() {
          return Object.keys(nodesTested.conflict).length + Object.keys(nodesTested.noConflict).length >= testCount;
    ***REMOVED***
  ***REMOVED***).then(function () {
        console.info('DONE!');
        setDoneResults({
          nodesTested: nodesTested,
          nodesFound: nodesFound
    ***REMOVED***);
        report$$1({
          nodesTested: nodesTested,
          nodesFound: nodesFound
    ***REMOVED***);
        console.groupEnd();
  ***REMOVED***).catch(function (e) {
        if (e === 'timeout') {
          console.info('TIME OUT! We waited until we got tired. Here\'s what we found:');
          setDoneResults({
            nodesTested: nodesTested,
            nodesFound: nodesFound
      ***REMOVED***);
          report$$1({
            nodesTested: nodesTested,
            nodesFound: nodesFound
      ***REMOVED***);
    ***REMOVED*** else {
          console.info('Whoops! We hit an error:', e);
          console.info('Here\'s what we\'d found up until that error:');
          setDoneResults({
            nodesTested: nodesTested,
            nodesFound: nodesFound
      ***REMOVED***);
          report$$1({
            nodesTested: nodesTested,
            nodesFound: nodesFound
      ***REMOVED***);
    ***REMOVED***

        console.groupEnd();
  ***REMOVED***);
***REMOVED***
  ***REMOVED*** // Allow clients to access, and in some cases, override some properties

  var initialConfig = WINDOW.FontAwesomeDetection || {***REMOVED***; // These can be overridden

  var _default = {
    report: report,
    timeout: +(DOCUMENT.currentScript.getAttribute(timeoutAttr) || "2000"),
    resultsCollectionMaxWait: +(DOCUMENT.currentScript.getAttribute(resultsCollectionMaxWaitAttr) || "5000")
  ***REMOVED***;

  var _config = _objectSpread({***REMOVED***, _default, initialConfig, {
    // These cannot be overridden
    __pollUntil: pollUntil,
    md5ForNode: md5ForNode,
    detectionDone: false,
    nodesTested: null,
    nodesFound: null
  ***REMOVED***);

  WINDOW.FontAwesomeDetection = _config;

  var PRODUCTION = function () {
    try {
      return process.env.NODE_ENV === 'production';
***REMOVED*** catch (e) {
      return false;
***REMOVED***
  ***REMOVED***();

  function bunker(fn) {
    try {
      fn();
***REMOVED*** catch (e) {
      if (!PRODUCTION) {
        throw e;
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  bunker(function () {
    if (IS_BROWSER && IS_DOM) {
      conflictDetection(window.FontAwesomeDetection.report);
***REMOVED***
  ***REMOVED***);

  exports.conflictDetection = conflictDetection;

  Object.defineProperty(exports, '__esModule', { value: true ***REMOVED***);

***REMOVED***)));
