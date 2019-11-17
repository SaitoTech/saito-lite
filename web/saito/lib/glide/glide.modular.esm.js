/*!
 * Glide.js v3.4.1
 * (c) 2013-2019 Jędrzej Chałubek <jedrzej.chalubek@gmail.com> (http://jedrzejchalubek.com/)
 * Released under the MIT License.
 */

var defaults = {
  /**
   * Type of the movement.
   *
   * Available types:
   * `slider` - Rewinds slider to the start/end when it reaches the first or last slide.
   * `carousel` - Changes slides without starting over when it reaches the first or last slide.
   *
   * @type {String***REMOVED***
   */
  type: 'slider',

  /**
   * Start at specific slide number defined with zero-based index.
   *
   * @type {Number***REMOVED***
   */
  startAt: 0,

  /**
   * A number of slides visible on the single viewport.
   *
   * @type {Number***REMOVED***
   */
  perView: 1,

  /**
   * Focus currently active slide at a specified position in the track.
   *
   * Available inputs:
   * `center` - Current slide will be always focused at the center of a track.
   * `0,1,2,3...` - Current slide will be focused on the specified zero-based index.
   *
   * @type {String|Number***REMOVED***
   */
  focusAt: 0,

  /**
   * A size of the gap added between slides.
   *
   * @type {Number***REMOVED***
   */
  gap: 10,

  /**
   * Change slides after a specified interval. Use `false` for turning off autoplay.
   *
   * @type {Number|Boolean***REMOVED***
   */
  autoplay: false,

  /**
   * Stop autoplay on mouseover event.
   *
   * @type {Boolean***REMOVED***
   */
  hoverpause: true,

  /**
   * Allow for changing slides with left and right keyboard arrows.
   *
   * @type {Boolean***REMOVED***
   */
  keyboard: true,

  /**
   * Stop running `perView` number of slides from the end. Use this
   * option if you don't want to have an empty space after
   * a slider. Works only with `slider` type and a
   * non-centered `focusAt` setting.
   *
   * @type {Boolean***REMOVED***
   */
  bound: false,

  /**
   * Minimal swipe distance needed to change the slide. Use `false` for turning off a swiping.
   *
   * @type {Number|Boolean***REMOVED***
   */
  swipeThreshold: 80,

  /**
   * Minimal mouse drag distance needed to change the slide. Use `false` for turning off a dragging.
   *
   * @type {Number|Boolean***REMOVED***
   */
  dragThreshold: 120,

  /**
   * A maximum number of slides to which movement will be made on swiping or dragging. Use `false` for unlimited.
   *
   * @type {Number|Boolean***REMOVED***
   */
  perTouch: false,

  /**
   * Moving distance ratio of the slides on a swiping and dragging.
   *
   * @type {Number***REMOVED***
   */
  touchRatio: 0.5,

  /**
   * Angle required to activate slides moving on swiping or dragging.
   *
   * @type {Number***REMOVED***
   */
  touchAngle: 45,

  /**
   * Duration of the animation in milliseconds.
   *
   * @type {Number***REMOVED***
   */
  animationDuration: 400,

  /**
   * Allows looping the `slider` type. Slider will rewind to the first/last slide when it's at the start/end.
   *
   * @type {Boolean***REMOVED***
   */
  rewind: true,

  /**
   * Duration of the rewinding animation of the `slider` type in milliseconds.
   *
   * @type {Number***REMOVED***
   */
  rewindDuration: 800,

  /**
   * Easing function for the animation.
   *
   * @type {String***REMOVED***
   */
  animationTimingFunc: 'cubic-bezier(.165, .840, .440, 1)',

  /**
   * Throttle costly events at most once per every wait milliseconds.
   *
   * @type {Number***REMOVED***
   */
  throttle: 10,

  /**
   * Moving direction mode.
   *
   * Available inputs:
   * - 'ltr' - left to right movement,
   * - 'rtl' - right to left movement.
   *
   * @type {String***REMOVED***
   */
  direction: 'ltr',

  /**
   * The distance value of the next and previous viewports which
   * have to peek in the current view. Accepts number and
   * pixels as a string. Left and right peeking can be
   * set up separately with a directions object.
   *
   * For example:
   * `100` - Peek 100px on the both sides.
   * { before: 100, after: 50 ***REMOVED***` - Peek 100px on the left side and 50px on the right side.
   *
   * @type {Number|String|Object***REMOVED***
   */
  peek: 0,

  /**
   * Collection of options applied at specified media breakpoints.
   * For example: display two slides per view under 800px.
   * `{
   *   '800px': {
   *     perView: 2
   *   ***REMOVED***
   * ***REMOVED***`
   */
  breakpoints: {***REMOVED***,

  /**
   * Collection of internally used HTML classes.
   *
   * @todo Refactor `slider` and `carousel` properties to single `type: { slider: '', carousel: '' ***REMOVED***` object
   * @type {Object***REMOVED***
   */
  classes: {
    direction: {
      ltr: 'glide--ltr',
      rtl: 'glide--rtl'
***REMOVED***,
    slider: 'glide--slider',
    carousel: 'glide--carousel',
    swipeable: 'glide--swipeable',
    dragging: 'glide--dragging',
    cloneSlide: 'glide__slide--clone',
    activeNav: 'glide__bullet--active',
    activeSlide: 'glide__slide--active',
    disabledArrow: 'glide__arrow--disabled'
  ***REMOVED***
***REMOVED***;

/**
 * Outputs warning message to the bowser console.
 *
 * @param  {String***REMOVED*** msg
 * @return {Void***REMOVED***
 */
function warn(msg) {
  console.error("[Glide warn]: " + msg);
***REMOVED***

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
***REMOVED*** : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
***REMOVED***;

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  ***REMOVED***
***REMOVED***;

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
***REMOVED***
  ***REMOVED***

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  ***REMOVED***;
***REMOVED***();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  return target;
***REMOVED***;

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
***REMOVED*** else {
      return get(parent, property, receiver);
***REMOVED***
  ***REMOVED*** else if ("value" in desc) {
    return desc.value;
  ***REMOVED*** else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
***REMOVED***

    return getter.call(receiver);
  ***REMOVED***
***REMOVED***;

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  ***REMOVED***

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
***REMOVED***
  ***REMOVED***);
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
***REMOVED***;

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  ***REMOVED***

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
***REMOVED***;

/**
 * Converts value entered as number
 * or string to integer value.
 *
 * @param {String***REMOVED*** value
 * @returns {Number***REMOVED***
 */
function toInt(value) {
  return parseInt(value);
***REMOVED***

/**
 * Converts value entered as number
 * or string to flat value.
 *
 * @param {String***REMOVED*** value
 * @returns {Number***REMOVED***
 */
function toFloat(value) {
  return parseFloat(value);
***REMOVED***

/**
 * Indicates whether the specified value is a string.
 *
 * @param  {****REMOVED***   value
 * @return {Boolean***REMOVED***
 */
function isString(value) {
  return typeof value === 'string';
***REMOVED***

/**
 * Indicates whether the specified value is an object.
 *
 * @param  {****REMOVED*** value
 * @return {Boolean***REMOVED***
 *
 * @see https://github.com/jashkenas/underscore
 */
function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);

  return type === 'function' || type === 'object' && !!value; // eslint-disable-line no-mixed-operators
***REMOVED***

/**
 * Indicates whether the specified value is a number.
 *
 * @param  {****REMOVED*** value
 * @return {Boolean***REMOVED***
 */
function isNumber(value) {
  return typeof value === 'number';
***REMOVED***

/**
 * Indicates whether the specified value is a function.
 *
 * @param  {****REMOVED*** value
 * @return {Boolean***REMOVED***
 */
function isFunction(value) {
  return typeof value === 'function';
***REMOVED***

/**
 * Indicates whether the specified value is undefined.
 *
 * @param  {****REMOVED*** value
 * @return {Boolean***REMOVED***
 */
function isUndefined(value) {
  return typeof value === 'undefined';
***REMOVED***

/**
 * Indicates whether the specified value is an array.
 *
 * @param  {****REMOVED*** value
 * @return {Boolean***REMOVED***
 */
function isArray(value) {
  return value.constructor === Array;
***REMOVED***

/**
 * Creates and initializes specified collection of extensions.
 * Each extension receives access to instance of glide and rest of components.
 *
 * @param {Object***REMOVED*** glide
 * @param {Object***REMOVED*** extensions
 *
 * @returns {Object***REMOVED***
 */
function mount(glide, extensions, events) {
  var components = {***REMOVED***;

  for (var name in extensions) {
    if (isFunction(extensions[name])) {
      components[name] = extensions[name](glide, components, events);
***REMOVED*** else {
      warn('Extension must be a function');
***REMOVED***
  ***REMOVED***

  for (var _name in components) {
    if (isFunction(components[_name].mount)) {
      components[_name].mount();
***REMOVED***
  ***REMOVED***

  return components;
***REMOVED***

/**
 * Defines getter and setter property on the specified object.
 *
 * @param  {Object***REMOVED*** obj         Object where property has to be defined.
 * @param  {String***REMOVED*** prop        Name of the defined property.
 * @param  {Object***REMOVED*** definition  Get and set definitions for the property.
 * @return {Void***REMOVED***
 */
function define(obj, prop, definition) {
  Object.defineProperty(obj, prop, definition);
***REMOVED***

/**
 * Sorts aphabetically object keys.
 *
 * @param  {Object***REMOVED*** obj
 * @return {Object***REMOVED***
 */
function sortKeys(obj) {
  return Object.keys(obj).sort().reduce(function (r, k) {
    r[k] = obj[k];

    return r[k], r;
  ***REMOVED***, {***REMOVED***);
***REMOVED***

/**
 * Merges passed settings object with default options.
 *
 * @param  {Object***REMOVED*** defaults
 * @param  {Object***REMOVED*** settings
 * @return {Object***REMOVED***
 */
function mergeOptions(defaults, settings) {
  var options = _extends({***REMOVED***, defaults, settings);

  // `Object.assign` do not deeply merge objects, so we
  // have to do it manually for every nested object
  // in options. Although it does not look smart,
  // it's smaller and faster than some fancy
  // merging deep-merge algorithm script.
  if (settings.hasOwnProperty('classes')) {
    options.classes = _extends({***REMOVED***, defaults.classes, settings.classes);

    if (settings.classes.hasOwnProperty('direction')) {
      options.classes.direction = _extends({***REMOVED***, defaults.classes.direction, settings.classes.direction);
***REMOVED***
  ***REMOVED***

  if (settings.hasOwnProperty('breakpoints')) {
    options.breakpoints = _extends({***REMOVED***, defaults.breakpoints, settings.breakpoints);
  ***REMOVED***

  return options;
***REMOVED***

var EventsBus = function () {
  /**
   * Construct a EventBus instance.
   *
   * @param {Object***REMOVED*** events
   */
  function EventsBus() {
    var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {***REMOVED***;
    classCallCheck(this, EventsBus);

    this.events = events;
    this.hop = events.hasOwnProperty;
  ***REMOVED***

  /**
   * Adds listener to the specifed event.
   *
   * @param {String|Array***REMOVED*** event
   * @param {Function***REMOVED*** handler
   */


  createClass(EventsBus, [{
    key: 'on',
    value: function on(event, handler) {
      if (isArray(event)) {
        for (var i = 0; i < event.length; i++) {
          this.on(event[i], handler);
    ***REMOVED***
  ***REMOVED***

      // Create the event's object if not yet created
      if (!this.hop.call(this.events, event)) {
        this.events[event] = [];
  ***REMOVED***

      // Add the handler to queue
      var index = this.events[event].push(handler) - 1;

      // Provide handle back for removal of event
      return {
        remove: function remove() {
          delete this.events[event][index];
    ***REMOVED***
  ***REMOVED***;
***REMOVED***

    /**
     * Runs registered handlers for specified event.
     *
     * @param {String|Array***REMOVED*** event
     * @param {Object=***REMOVED*** context
     */

  ***REMOVED***, {
    key: 'emit',
    value: function emit(event, context) {
      if (isArray(event)) {
        for (var i = 0; i < event.length; i++) {
          this.emit(event[i], context);
    ***REMOVED***
  ***REMOVED***

      // If the event doesn't exist, or there's no handlers in queue, just leave
      if (!this.hop.call(this.events, event)) {
        return;
  ***REMOVED***

      // Cycle through events queue, fire!
      this.events[event].forEach(function (item) {
        item(context || {***REMOVED***);
  ***REMOVED***);
***REMOVED***
  ***REMOVED***]);
  return EventsBus;
***REMOVED***();

var Glide = function () {
  /**
   * Construct glide.
   *
   * @param  {String***REMOVED*** selector
   * @param  {Object***REMOVED*** options
   */
  function Glide(selector) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {***REMOVED***;
    classCallCheck(this, Glide);

    this._c = {***REMOVED***;
    this._t = [];
    this._e = new EventsBus();

    this.disabled = false;
    this.selector = selector;
    this.settings = mergeOptions(defaults, options);
    this.index = this.settings.startAt;
  ***REMOVED***

  /**
   * Initializes glide.
   *
   * @param {Object***REMOVED*** extensions Collection of extensions to initialize.
   * @return {Glide***REMOVED***
   */


  createClass(Glide, [{
    key: 'mount',
    value: function mount$$1() {
      var extensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {***REMOVED***;

      this._e.emit('mount.before');

      if (isObject(extensions)) {
        this._c = mount(this, extensions, this._e);
  ***REMOVED*** else {
        warn('You need to provide a object on `mount()`');
  ***REMOVED***

      this._e.emit('mount.after');

      return this;
***REMOVED***

    /**
     * Collects an instance `translate` transformers.
     *
     * @param  {Array***REMOVED*** transformers Collection of transformers.
     * @return {Void***REMOVED***
     */

  ***REMOVED***, {
    key: 'mutate',
    value: function mutate() {
      var transformers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (isArray(transformers)) {
        this._t = transformers;
  ***REMOVED*** else {
        warn('You need to provide a array on `mutate()`');
  ***REMOVED***

      return this;
***REMOVED***

    /**
     * Updates glide with specified settings.
     *
     * @param {Object***REMOVED*** settings
     * @return {Glide***REMOVED***
     */

  ***REMOVED***, {
    key: 'update',
    value: function update() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {***REMOVED***;

      this.settings = mergeOptions(this.settings, settings);

      if (settings.hasOwnProperty('startAt')) {
        this.index = settings.startAt;
  ***REMOVED***

      this._e.emit('update');

      return this;
***REMOVED***

    /**
     * Change slide with specified pattern. A pattern must be in the special format:
     * `>` - Move one forward
     * `<` - Move one backward
     * `={i***REMOVED***` - Go to {i***REMOVED*** zero-based slide (eq. '=1', will go to second slide)
     * `>>` - Rewinds to end (last slide)
     * `<<` - Rewinds to start (first slide)
     *
     * @param {String***REMOVED*** pattern
     * @return {Glide***REMOVED***
     */

  ***REMOVED***, {
    key: 'go',
    value: function go(pattern) {
      this._c.Run.make(pattern);

      return this;
***REMOVED***

    /**
     * Move track by specified distance.
     *
     * @param {String***REMOVED*** distance
     * @return {Glide***REMOVED***
     */

  ***REMOVED***, {
    key: 'move',
    value: function move(distance) {
      this._c.Transition.disable();
      this._c.Move.make(distance);

      return this;
***REMOVED***

    /**
     * Destroy instance and revert all changes done by this._c.
     *
     * @return {Glide***REMOVED***
     */

  ***REMOVED***, {
    key: 'destroy',
    value: function destroy() {
      this._e.emit('destroy');

      return this;
***REMOVED***

    /**
     * Start instance autoplaying.
     *
     * @param {Boolean|Number***REMOVED*** interval Run autoplaying with passed interval regardless of `autoplay` settings
     * @return {Glide***REMOVED***
     */

  ***REMOVED***, {
    key: 'play',
    value: function play() {
      var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (interval) {
        this.settings.autoplay = interval;
  ***REMOVED***

      this._e.emit('play');

      return this;
***REMOVED***

    /**
     * Stop instance autoplaying.
     *
     * @return {Glide***REMOVED***
     */

  ***REMOVED***, {
    key: 'pause',
    value: function pause() {
      this._e.emit('pause');

      return this;
***REMOVED***

    /**
     * Sets glide into a idle status.
     *
     * @return {Glide***REMOVED***
     */

  ***REMOVED***, {
    key: 'disable',
    value: function disable() {
      this.disabled = true;

      return this;
***REMOVED***

    /**
     * Sets glide into a active status.
     *
     * @return {Glide***REMOVED***
     */

  ***REMOVED***, {
    key: 'enable',
    value: function enable() {
      this.disabled = false;

      return this;
***REMOVED***

    /**
     * Adds cuutom event listener with handler.
     *
     * @param  {String|Array***REMOVED*** event
     * @param  {Function***REMOVED*** handler
     * @return {Glide***REMOVED***
     */

  ***REMOVED***, {
    key: 'on',
    value: function on(event, handler) {
      this._e.on(event, handler);

      return this;
***REMOVED***

    /**
     * Checks if glide is a precised type.
     *
     * @param  {String***REMOVED*** name
     * @return {Boolean***REMOVED***
     */

  ***REMOVED***, {
    key: 'isType',
    value: function isType(name) {
      return this.settings.type === name;
***REMOVED***

    /**
     * Gets value of the core options.
     *
     * @return {Object***REMOVED***
     */

  ***REMOVED***, {
    key: 'settings',
    get: function get$$1() {
      return this._o;
***REMOVED***

    /**
     * Sets value of the core options.
     *
     * @param  {Object***REMOVED*** o
     * @return {Void***REMOVED***
     */
    ,
    set: function set$$1(o) {
      if (isObject(o)) {
        this._o = o;
  ***REMOVED*** else {
        warn('Options must be an `object` instance.');
  ***REMOVED***
***REMOVED***

    /**
     * Gets current index of the slider.
     *
     * @return {Object***REMOVED***
     */

  ***REMOVED***, {
    key: 'index',
    get: function get$$1() {
      return this._i;
***REMOVED***

    /**
     * Sets current index a slider.
     *
     * @return {Object***REMOVED***
     */
    ,
    set: function set$$1(i) {
      this._i = toInt(i);
***REMOVED***

    /**
     * Gets type name of the slider.
     *
     * @return {String***REMOVED***
     */

  ***REMOVED***, {
    key: 'type',
    get: function get$$1() {
      return this.settings.type;
***REMOVED***

    /**
     * Gets value of the idle status.
     *
     * @return {Boolean***REMOVED***
     */

  ***REMOVED***, {
    key: 'disabled',
    get: function get$$1() {
      return this._d;
***REMOVED***

    /**
     * Sets value of the idle status.
     *
     * @return {Boolean***REMOVED***
     */
    ,
    set: function set$$1(status) {
      this._d = !!status;
***REMOVED***
  ***REMOVED***]);
  return Glide;
***REMOVED***();

function Run (Glide, Components, Events) {
  var Run = {
    /**
     * Initializes autorunning of the glide.
     *
     * @return {Void***REMOVED***
     */
    mount: function mount() {
      this._o = false;
***REMOVED***,


    /**
     * Makes glides running based on the passed moving schema.
     *
     * @param {String***REMOVED*** move
     */
    make: function make(move) {
      var _this = this;

      if (!Glide.disabled) {
        Glide.disable();

        this.move = move;

        Events.emit('run.before', this.move);

        this.calculate();

        Events.emit('run', this.move);

        Components.Transition.after(function () {
          if (_this.isStart()) {
            Events.emit('run.start', _this.move);
      ***REMOVED***

          if (_this.isEnd()) {
            Events.emit('run.end', _this.move);
      ***REMOVED***

          if (_this.isOffset('<') || _this.isOffset('>')) {
            _this._o = false;

            Events.emit('run.offset', _this.move);
      ***REMOVED***

          Events.emit('run.after', _this.move);

          Glide.enable();
    ***REMOVED***);
  ***REMOVED***
***REMOVED***,


    /**
     * Calculates current index based on defined move.
     *
     * @return {Void***REMOVED***
     */
    calculate: function calculate() {
      var move = this.move,
          length = this.length;
      var steps = move.steps,
          direction = move.direction;


      var countableSteps = isNumber(toInt(steps)) && toInt(steps) !== 0;

      switch (direction) {
        case '>':
          if (steps === '>') {
            Glide.index = length;
      ***REMOVED*** else if (this.isEnd()) {
            if (!(Glide.isType('slider') && !Glide.settings.rewind)) {
              this._o = true;

              Glide.index = 0;
        ***REMOVED***
      ***REMOVED*** else if (countableSteps) {
            Glide.index += Math.min(length - Glide.index, -toInt(steps));
      ***REMOVED*** else {
            Glide.index++;
      ***REMOVED***
          break;

        case '<':
          if (steps === '<') {
            Glide.index = 0;
      ***REMOVED*** else if (this.isStart()) {
            if (!(Glide.isType('slider') && !Glide.settings.rewind)) {
              this._o = true;

              Glide.index = length;
        ***REMOVED***
      ***REMOVED*** else if (countableSteps) {
            Glide.index -= Math.min(Glide.index, toInt(steps));
      ***REMOVED*** else {
            Glide.index--;
      ***REMOVED***
          break;

        case '=':
          Glide.index = steps;
          break;

        default:
          warn('Invalid direction pattern [' + direction + steps + '] has been used');
          break;
  ***REMOVED***
***REMOVED***,


    /**
     * Checks if we are on the first slide.
     *
     * @return {Boolean***REMOVED***
     */
    isStart: function isStart() {
      return Glide.index === 0;
***REMOVED***,


    /**
     * Checks if we are on the last slide.
     *
     * @return {Boolean***REMOVED***
     */
    isEnd: function isEnd() {
      return Glide.index === this.length;
***REMOVED***,


    /**
     * Checks if we are making a offset run.
     *
     * @param {String***REMOVED*** direction
     * @return {Boolean***REMOVED***
     */
    isOffset: function isOffset(direction) {
      return this._o && this.move.direction === direction;
***REMOVED***
  ***REMOVED***;

  define(Run, 'move', {
    /**
     * Gets value of the move schema.
     *
     * @returns {Object***REMOVED***
     */
    get: function get() {
      return this._m;
***REMOVED***,


    /**
     * Sets value of the move schema.
     *
     * @returns {Object***REMOVED***
     */
    set: function set(value) {
      var step = value.substr(1);

      this._m = {
        direction: value.substr(0, 1),
        steps: step ? toInt(step) ? toInt(step) : step : 0
  ***REMOVED***;
***REMOVED***
  ***REMOVED***);

  define(Run, 'length', {
    /**
     * Gets value of the running distance based
     * on zero-indexing number of slides.
     *
     * @return {Number***REMOVED***
     */
    get: function get() {
      var settings = Glide.settings;
      var length = Components.Html.slides.length;

      // If the `bound` option is acitve, a maximum running distance should be
      // reduced by `perView` and `focusAt` settings. Running distance
      // should end before creating an empty space after instance.

      if (Glide.isType('slider') && settings.focusAt !== 'center' && settings.bound) {
        return length - 1 - (toInt(settings.perView) - 1) + toInt(settings.focusAt);
  ***REMOVED***

      return length - 1;
***REMOVED***
  ***REMOVED***);

  define(Run, 'offset', {
    /**
     * Gets status of the offsetting flag.
     *
     * @return {Boolean***REMOVED***
     */
    get: function get() {
      return this._o;
***REMOVED***
  ***REMOVED***);

  return Run;
***REMOVED***

/**
 * Returns a current time.
 *
 * @return {Number***REMOVED***
 */
function now() {
  return new Date().getTime();
***REMOVED***

/**
 * Returns a function, that, when invoked, will only be triggered
 * at most once during a given window of time.
 *
 * @param {Function***REMOVED*** func
 * @param {Number***REMOVED*** wait
 * @param {Object=***REMOVED*** options
 * @return {Function***REMOVED***
 *
 * @see https://github.com/jashkenas/underscore
 */
function throttle(func, wait, options) {
  var timeout = void 0,
      context = void 0,
      args = void 0,
      result = void 0;
  var previous = 0;
  if (!options) options = {***REMOVED***;

  var later = function later() {
    previous = options.leading === false ? 0 : now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  ***REMOVED***;

  var throttled = function throttled() {
    var at = now();
    if (!previous && options.leading === false) previous = at;
    var remaining = wait - (at - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
  ***REMOVED***
      previous = at;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
***REMOVED*** else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
***REMOVED***
    return result;
  ***REMOVED***;

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  ***REMOVED***;

  return throttled;
***REMOVED***

var MARGIN_TYPE = {
  ltr: ['marginLeft', 'marginRight'],
  rtl: ['marginRight', 'marginLeft']
***REMOVED***;

function Gaps (Glide, Components, Events) {
  var Gaps = {
    /**
     * Applies gaps between slides. First and last
     * slides do not receive it's edge margins.
     *
     * @param {HTMLCollection***REMOVED*** slides
     * @return {Void***REMOVED***
     */
    apply: function apply(slides) {
      for (var i = 0, len = slides.length; i < len; i++) {
        var style = slides[i].style;
        var direction = Components.Direction.value;

        if (i !== 0) {
          style[MARGIN_TYPE[direction][0]] = this.value / 2 + 'px';
    ***REMOVED*** else {
          style[MARGIN_TYPE[direction][0]] = '';
    ***REMOVED***

        if (i !== slides.length - 1) {
          style[MARGIN_TYPE[direction][1]] = this.value / 2 + 'px';
    ***REMOVED*** else {
          style[MARGIN_TYPE[direction][1]] = '';
    ***REMOVED***
  ***REMOVED***
***REMOVED***,


    /**
     * Removes gaps from the slides.
     *
     * @param {HTMLCollection***REMOVED*** slides
     * @returns {Void***REMOVED***
    */
    remove: function remove(slides) {
      for (var i = 0, len = slides.length; i < len; i++) {
        var style = slides[i].style;

        style.marginLeft = '';
        style.marginRight = '';
  ***REMOVED***
***REMOVED***
  ***REMOVED***;

  define(Gaps, 'value', {
    /**
     * Gets value of the gap.
     *
     * @returns {Number***REMOVED***
     */
    get: function get() {
      return toInt(Glide.settings.gap);
***REMOVED***
  ***REMOVED***);

  define(Gaps, 'grow', {
    /**
     * Gets additional dimentions value caused by gaps.
     * Used to increase width of the slides wrapper.
     *
     * @returns {Number***REMOVED***
     */
    get: function get() {
      return Gaps.value * (Components.Sizes.length - 1);
***REMOVED***
  ***REMOVED***);

  define(Gaps, 'reductor', {
    /**
     * Gets reduction value caused by gaps.
     * Used to subtract width of the slides.
     *
     * @returns {Number***REMOVED***
     */
    get: function get() {
      var perView = Glide.settings.perView;

      return Gaps.value * (perView - 1) / perView;
***REMOVED***
  ***REMOVED***);

  /**
   * Apply calculated gaps:
   * - after building, so slides (including clones) will receive proper margins
   * - on updating via API, to recalculate gaps with new options
   */
  Events.on(['build.after', 'update'], throttle(function () {
    Gaps.apply(Components.Html.wrapper.children);
  ***REMOVED***, 30));

  /**
   * Remove gaps:
   * - on destroying to bring markup to its inital state
   */
  Events.on('destroy', function () {
    Gaps.remove(Components.Html.wrapper.children);
  ***REMOVED***);

  return Gaps;
***REMOVED***

/**
 * Finds siblings nodes of the passed node.
 *
 * @param  {Element***REMOVED*** node
 * @return {Array***REMOVED***
 */
function siblings(node) {
  if (node && node.parentNode) {
    var n = node.parentNode.firstChild;
    var matched = [];

    for (; n; n = n.nextSibling) {
      if (n.nodeType === 1 && n !== node) {
        matched.push(n);
  ***REMOVED***
***REMOVED***

    return matched;
  ***REMOVED***

  return [];
***REMOVED***

/**
 * Checks if passed node exist and is a valid element.
 *
 * @param  {Element***REMOVED*** node
 * @return {Boolean***REMOVED***
 */
function exist(node) {
  if (node && node instanceof window.HTMLElement) {
    return true;
  ***REMOVED***

  return false;
***REMOVED***

var TRACK_SELECTOR = '[data-glide-el="track"]';

function Html (Glide, Components) {
  var Html = {
    /**
     * Setup slider HTML nodes.
     *
     * @param {Glide***REMOVED*** glide
     */
    mount: function mount() {
      this.root = Glide.selector;
      this.track = this.root.querySelector(TRACK_SELECTOR);
      this.slides = Array.prototype.slice.call(this.wrapper.children).filter(function (slide) {
        return !slide.classList.contains(Glide.settings.classes.cloneSlide);
  ***REMOVED***);
***REMOVED***
  ***REMOVED***;

  define(Html, 'root', {
    /**
     * Gets node of the glide main element.
     *
     * @return {Object***REMOVED***
     */
    get: function get() {
      return Html._r;
***REMOVED***,


    /**
     * Sets node of the glide main element.
     *
     * @return {Object***REMOVED***
     */
    set: function set(r) {
      if (isString(r)) {
        r = document.querySelector(r);
  ***REMOVED***

      if (exist(r)) {
        Html._r = r;
  ***REMOVED*** else {
        warn('Root element must be a existing Html node');
  ***REMOVED***
***REMOVED***
  ***REMOVED***);

  define(Html, 'track', {
    /**
     * Gets node of the glide track with slides.
     *
     * @return {Object***REMOVED***
     */
    get: function get() {
      return Html._t;
***REMOVED***,


    /**
     * Sets node of the glide track with slides.
     *
     * @return {Object***REMOVED***
     */
    set: function set(t) {
      if (exist(t)) {
        Html._t = t;
  ***REMOVED*** else {
        warn('Could not find track element. Please use ' + TRACK_SELECTOR + ' attribute.');
  ***REMOVED***
***REMOVED***
  ***REMOVED***);

  define(Html, 'wrapper', {
    /**
     * Gets node of the slides wrapper.
     *
     * @return {Object***REMOVED***
     */
    get: function get() {
      return Html.track.children[0];
***REMOVED***
  ***REMOVED***);

  return Html;
***REMOVED***

function Peek (Glide, Components, Events) {
  var Peek = {
    /**
     * Setups how much to peek based on settings.
     *
     * @return {Void***REMOVED***
     */
    mount: function mount() {
      this.value = Glide.settings.peek;
***REMOVED***
  ***REMOVED***;

  define(Peek, 'value', {
    /**
     * Gets value of the peek.
     *
     * @returns {Number|Object***REMOVED***
     */
    get: function get() {
      return Peek._v;
***REMOVED***,


    /**
     * Sets value of the peek.
     *
     * @param {Number|Object***REMOVED*** value
     * @return {Void***REMOVED***
     */
    set: function set(value) {
      if (isObject(value)) {
        value.before = toInt(value.before);
        value.after = toInt(value.after);
  ***REMOVED*** else {
        value = toInt(value);
  ***REMOVED***

      Peek._v = value;
***REMOVED***
  ***REMOVED***);

  define(Peek, 'reductor', {
    /**
     * Gets reduction value caused by peek.
     *
     * @returns {Number***REMOVED***
     */
    get: function get() {
      var value = Peek.value;
      var perView = Glide.settings.perView;

      if (isObject(value)) {
        return value.before / perView + value.after / perView;
  ***REMOVED***

      return value * 2 / perView;
***REMOVED***
  ***REMOVED***);

  /**
   * Recalculate peeking sizes on:
   * - when resizing window to update to proper percents
   */
  Events.on(['resize', 'update'], function () {
    Peek.mount();
  ***REMOVED***);

  return Peek;
***REMOVED***

function Move (Glide, Components, Events) {
  var Move = {
    /**
     * Constructs move component.
     *
     * @returns {Void***REMOVED***
     */
    mount: function mount() {
      this._o = 0;
***REMOVED***,


    /**
     * Calculates a movement value based on passed offset and currently active index.
     *
     * @param  {Number***REMOVED*** offset
     * @return {Void***REMOVED***
     */
    make: function make() {
      var _this = this;

      var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      this.offset = offset;

      Events.emit('move', {
        movement: this.value
  ***REMOVED***);

      Components.Transition.after(function () {
        Events.emit('move.after', {
          movement: _this.value
    ***REMOVED***);
  ***REMOVED***);
***REMOVED***
  ***REMOVED***;

  define(Move, 'offset', {
    /**
     * Gets an offset value used to modify current translate.
     *
     * @return {Object***REMOVED***
     */
    get: function get() {
      return Move._o;
***REMOVED***,


    /**
     * Sets an offset value used to modify current translate.
     *
     * @return {Object***REMOVED***
     */
    set: function set(value) {
      Move._o = !isUndefined(value) ? toInt(value) : 0;
***REMOVED***
  ***REMOVED***);

  define(Move, 'translate', {
    /**
     * Gets a raw movement value.
     *
     * @return {Number***REMOVED***
     */
    get: function get() {
      return Components.Sizes.slideWidth * Glide.index;
***REMOVED***
  ***REMOVED***);

  define(Move, 'value', {
    /**
     * Gets an actual movement value corrected by offset.
     *
     * @return {Number***REMOVED***
     */
    get: function get() {
      var offset = this.offset;
      var translate = this.translate;

      if (Components.Direction.is('rtl')) {
        return translate + offset;
  ***REMOVED***

      return translate - offset;
***REMOVED***
  ***REMOVED***);

  /**
   * Make movement to proper slide on:
   * - before build, so glide will start at `startAt` index
   * - on each standard run to move to newly calculated index
   */
  Events.on(['build.before', 'run'], function () {
    Move.make();
  ***REMOVED***);

  return Move;
***REMOVED***

function Sizes (Glide, Components, Events) {
  var Sizes = {
    /**
     * Setups dimentions of slides.
     *
     * @return {Void***REMOVED***
     */
    setupSlides: function setupSlides() {
      var width = this.slideWidth + 'px';
      var slides = Components.Html.slides;

      for (var i = 0; i < slides.length; i++) {
        slides[i].style.width = width;
  ***REMOVED***
***REMOVED***,


    /**
     * Setups dimentions of slides wrapper.
     *
     * @return {Void***REMOVED***
     */
    setupWrapper: function setupWrapper(dimention) {
      Components.Html.wrapper.style.width = this.wrapperSize + 'px';
***REMOVED***,


    /**
     * Removes applied styles from HTML elements.
     *
     * @returns {Void***REMOVED***
     */
    remove: function remove() {
      var slides = Components.Html.slides;

      for (var i = 0; i < slides.length; i++) {
        slides[i].style.width = '';
  ***REMOVED***

      Components.Html.wrapper.style.width = '';
***REMOVED***
  ***REMOVED***;

  define(Sizes, 'length', {
    /**
     * Gets count number of the slides.
     *
     * @return {Number***REMOVED***
     */
    get: function get() {
      return Components.Html.slides.length;
***REMOVED***
  ***REMOVED***);

  define(Sizes, 'width', {
    /**
     * Gets width value of the glide.
     *
     * @return {Number***REMOVED***
     */
    get: function get() {
      return Components.Html.root.offsetWidth;
***REMOVED***
  ***REMOVED***);

  define(Sizes, 'wrapperSize', {
    /**
     * Gets size of the slides wrapper.
     *
     * @return {Number***REMOVED***
     */
    get: function get() {
      return Sizes.slideWidth * Sizes.length + Components.Gaps.grow + Components.Clones.grow;
***REMOVED***
  ***REMOVED***);

  define(Sizes, 'slideWidth', {
    /**
     * Gets width value of the single slide.
     *
     * @return {Number***REMOVED***
     */
    get: function get() {
      return Sizes.width / Glide.settings.perView - Components.Peek.reductor - Components.Gaps.reductor;
***REMOVED***
  ***REMOVED***);

  /**
   * Apply calculated glide's dimensions:
   * - before building, so other dimentions (e.g. translate) will be calculated propertly
   * - when resizing window to recalculate sildes dimensions
   * - on updating via API, to calculate dimensions based on new options
   */
  Events.on(['build.before', 'resize', 'update'], function () {
    Sizes.setupSlides();
    Sizes.setupWrapper();
  ***REMOVED***);

  /**
   * Remove calculated glide's dimensions:
   * - on destoting to bring markup to its inital state
   */
  Events.on('destroy', function () {
    Sizes.remove();
  ***REMOVED***);

  return Sizes;
***REMOVED***

function Build (Glide, Components, Events) {
  var Build = {
    /**
     * Init glide building. Adds classes, sets
     * dimensions and setups initial state.
     *
     * @return {Void***REMOVED***
     */
    mount: function mount() {
      Events.emit('build.before');

      this.typeClass();
      this.activeClass();

      Events.emit('build.after');
***REMOVED***,


    /**
     * Adds `type` class to the glide element.
     *
     * @return {Void***REMOVED***
     */
    typeClass: function typeClass() {
      Components.Html.root.classList.add(Glide.settings.classes[Glide.settings.type]);
***REMOVED***,


    /**
     * Sets active class to current slide.
     *
     * @return {Void***REMOVED***
     */
    activeClass: function activeClass() {
      var classes = Glide.settings.classes;
      var slide = Components.Html.slides[Glide.index];

      if (slide) {
        slide.classList.add(classes.activeSlide);

        siblings(slide).forEach(function (sibling) {
          sibling.classList.remove(classes.activeSlide);
    ***REMOVED***);
  ***REMOVED***
***REMOVED***,


    /**
     * Removes HTML classes applied at building.
     *
     * @return {Void***REMOVED***
     */
    removeClasses: function removeClasses() {
      var classes = Glide.settings.classes;

      Components.Html.root.classList.remove(classes[Glide.settings.type]);

      Components.Html.slides.forEach(function (sibling) {
        sibling.classList.remove(classes.activeSlide);
  ***REMOVED***);
***REMOVED***
  ***REMOVED***;

  /**
   * Clear building classes:
   * - on destroying to bring HTML to its initial state
   * - on updating to remove classes before remounting component
   */
  Events.on(['destroy', 'update'], function () {
    Build.removeClasses();
  ***REMOVED***);

  /**
   * Remount component:
   * - on resizing of the window to calculate new dimentions
   * - on updating settings via API
   */
  Events.on(['resize', 'update'], function () {
    Build.mount();
  ***REMOVED***);

  /**
   * Swap active class of current slide:
   * - after each move to the new index
   */
  Events.on('move.after', function () {
    Build.activeClass();
  ***REMOVED***);

  return Build;
***REMOVED***

function Clones (Glide, Components, Events) {
  var Clones = {
    /**
     * Create pattern map and collect slides to be cloned.
     */
    mount: function mount() {
      this.items = [];

      if (Glide.isType('carousel')) {
        this.items = this.collect();
  ***REMOVED***
***REMOVED***,


    /**
     * Collect clones with pattern.
     *
     * @return {Void***REMOVED***
     */
    collect: function collect() {
      var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var slides = Components.Html.slides;
      var _Glide$settings = Glide.settings,
          perView = _Glide$settings.perView,
          classes = _Glide$settings.classes;


      var peekIncrementer = +!!Glide.settings.peek;
      var part = perView + peekIncrementer;
      var start = slides.slice(0, part);
      var end = slides.slice(-part);

      for (var r = 0; r < Math.max(1, Math.floor(perView / slides.length)); r++) {
        for (var i = 0; i < start.length; i++) {
          var clone = start[i].cloneNode(true);

          clone.classList.add(classes.cloneSlide);

          items.push(clone);
    ***REMOVED***

        for (var _i = 0; _i < end.length; _i++) {
          var _clone = end[_i].cloneNode(true);

          _clone.classList.add(classes.cloneSlide);

          items.unshift(_clone);
    ***REMOVED***
  ***REMOVED***

      return items;
***REMOVED***,


    /**
     * Append cloned slides with generated pattern.
     *
     * @return {Void***REMOVED***
     */
    append: function append() {
      var items = this.items;
      var _Components$Html = Components.Html,
          wrapper = _Components$Html.wrapper,
          slides = _Components$Html.slides;


      var half = Math.floor(items.length / 2);
      var prepend = items.slice(0, half).reverse();
      var append = items.slice(half, items.length);
      var width = Components.Sizes.slideWidth + 'px';

      for (var i = 0; i < append.length; i++) {
        wrapper.appendChild(append[i]);
  ***REMOVED***

      for (var _i2 = 0; _i2 < prepend.length; _i2++) {
        wrapper.insertBefore(prepend[_i2], slides[0]);
  ***REMOVED***

      for (var _i3 = 0; _i3 < items.length; _i3++) {
        items[_i3].style.width = width;
  ***REMOVED***
***REMOVED***,


    /**
     * Remove all cloned slides.
     *
     * @return {Void***REMOVED***
     */
    remove: function remove() {
      var items = this.items;


      for (var i = 0; i < items.length; i++) {
        Components.Html.wrapper.removeChild(items[i]);
  ***REMOVED***
***REMOVED***
  ***REMOVED***;

  define(Clones, 'grow', {
    /**
     * Gets additional dimentions value caused by clones.
     *
     * @return {Number***REMOVED***
     */
    get: function get() {
      return (Components.Sizes.slideWidth + Components.Gaps.value) * Clones.items.length;
***REMOVED***
  ***REMOVED***);

  /**
   * Append additional slide's clones:
   * - while glide's type is `carousel`
   */
  Events.on('update', function () {
    Clones.remove();
    Clones.mount();
    Clones.append();
  ***REMOVED***);

  /**
   * Append additional slide's clones:
   * - while glide's type is `carousel`
   */
  Events.on('build.before', function () {
    if (Glide.isType('carousel')) {
      Clones.append();
***REMOVED***
  ***REMOVED***);

  /**
   * Remove clones HTMLElements:
   * - on destroying, to bring HTML to its initial state
   */
  Events.on('destroy', function () {
    Clones.remove();
  ***REMOVED***);

  return Clones;
***REMOVED***

var EventsBinder = function () {
  /**
   * Construct a EventsBinder instance.
   */
  function EventsBinder() {
    var listeners = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {***REMOVED***;
    classCallCheck(this, EventsBinder);

    this.listeners = listeners;
  ***REMOVED***

  /**
   * Adds events listeners to arrows HTML elements.
   *
   * @param  {String|Array***REMOVED*** events
   * @param  {Element|Window|Document***REMOVED*** el
   * @param  {Function***REMOVED*** closure
   * @param  {Boolean|Object***REMOVED*** capture
   * @return {Void***REMOVED***
   */


  createClass(EventsBinder, [{
    key: 'on',
    value: function on(events, el, closure) {
      var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      if (isString(events)) {
        events = [events];
  ***REMOVED***

      for (var i = 0; i < events.length; i++) {
        this.listeners[events[i]] = closure;

        el.addEventListener(events[i], this.listeners[events[i]], capture);
  ***REMOVED***
***REMOVED***

    /**
     * Removes event listeners from arrows HTML elements.
     *
     * @param  {String|Array***REMOVED*** events
     * @param  {Element|Window|Document***REMOVED*** el
     * @param  {Boolean|Object***REMOVED*** capture
     * @return {Void***REMOVED***
     */

  ***REMOVED***, {
    key: 'off',
    value: function off(events, el) {
      var capture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (isString(events)) {
        events = [events];
  ***REMOVED***

      for (var i = 0; i < events.length; i++) {
        el.removeEventListener(events[i], this.listeners[events[i]], capture);
  ***REMOVED***
***REMOVED***

    /**
     * Destroy collected listeners.
     *
     * @returns {Void***REMOVED***
     */

  ***REMOVED***, {
    key: 'destroy',
    value: function destroy() {
      delete this.listeners;
***REMOVED***
  ***REMOVED***]);
  return EventsBinder;
***REMOVED***();

function Resize (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder***REMOVED***
   */
  var Binder = new EventsBinder();

  var Resize = {
    /**
     * Initializes window bindings.
     */
    mount: function mount() {
      this.bind();
***REMOVED***,


    /**
     * Binds `rezsize` listener to the window.
     * It's a costly event, so we are debouncing it.
     *
     * @return {Void***REMOVED***
     */
    bind: function bind() {
      Binder.on('resize', window, throttle(function () {
        Events.emit('resize');
  ***REMOVED***, Glide.settings.throttle));
***REMOVED***,


    /**
     * Unbinds listeners from the window.
     *
     * @return {Void***REMOVED***
     */
    unbind: function unbind() {
      Binder.off('resize', window);
***REMOVED***
  ***REMOVED***;

  /**
   * Remove bindings from window:
   * - on destroying, to remove added EventListener
   */
  Events.on('destroy', function () {
    Resize.unbind();
    Binder.destroy();
  ***REMOVED***);

  return Resize;
***REMOVED***

var VALID_DIRECTIONS = ['ltr', 'rtl'];
var FLIPED_MOVEMENTS = {
  '>': '<',
  '<': '>',
  '=': '='
***REMOVED***;

function Direction (Glide, Components, Events) {
  var Direction = {
    /**
     * Setups gap value based on settings.
     *
     * @return {Void***REMOVED***
     */
    mount: function mount() {
      this.value = Glide.settings.direction;
***REMOVED***,


    /**
     * Resolves pattern based on direction value
     *
     * @param {String***REMOVED*** pattern
     * @returns {String***REMOVED***
     */
    resolve: function resolve(pattern) {
      var token = pattern.slice(0, 1);

      if (this.is('rtl')) {
        return pattern.split(token).join(FLIPED_MOVEMENTS[token]);
  ***REMOVED***

      return pattern;
***REMOVED***,


    /**
     * Checks value of direction mode.
     *
     * @param {String***REMOVED*** direction
     * @returns {Boolean***REMOVED***
     */
    is: function is(direction) {
      return this.value === direction;
***REMOVED***,


    /**
     * Applies direction class to the root HTML element.
     *
     * @return {Void***REMOVED***
     */
    addClass: function addClass() {
      Components.Html.root.classList.add(Glide.settings.classes.direction[this.value]);
***REMOVED***,


    /**
     * Removes direction class from the root HTML element.
     *
     * @return {Void***REMOVED***
     */
    removeClass: function removeClass() {
      Components.Html.root.classList.remove(Glide.settings.classes.direction[this.value]);
***REMOVED***
  ***REMOVED***;

  define(Direction, 'value', {
    /**
     * Gets value of the direction.
     *
     * @returns {Number***REMOVED***
     */
    get: function get() {
      return Direction._v;
***REMOVED***,


    /**
     * Sets value of the direction.
     *
     * @param {String***REMOVED*** value
     * @return {Void***REMOVED***
     */
    set: function set(value) {
      if (VALID_DIRECTIONS.indexOf(value) > -1) {
        Direction._v = value;
  ***REMOVED*** else {
        warn('Direction value must be `ltr` or `rtl`');
  ***REMOVED***
***REMOVED***
  ***REMOVED***);

  /**
   * Clear direction class:
   * - on destroy to bring HTML to its initial state
   * - on update to remove class before reappling bellow
   */
  Events.on(['destroy', 'update'], function () {
    Direction.removeClass();
  ***REMOVED***);

  /**
   * Remount component:
   * - on update to reflect changes in direction value
   */
  Events.on('update', function () {
    Direction.mount();
  ***REMOVED***);

  /**
   * Apply direction class:
   * - before building to apply class for the first time
   * - on updating to reapply direction class that may changed
   */
  Events.on(['build.before', 'update'], function () {
    Direction.addClass();
  ***REMOVED***);

  return Direction;
***REMOVED***

/**
 * Reflects value of glide movement.
 *
 * @param  {Object***REMOVED*** Glide
 * @param  {Object***REMOVED*** Components
 * @return {Object***REMOVED***
 */
function Rtl (Glide, Components) {
  return {
    /**
     * Negates the passed translate if glide is in RTL option.
     *
     * @param  {Number***REMOVED*** translate
     * @return {Number***REMOVED***
     */
    modify: function modify(translate) {
      if (Components.Direction.is('rtl')) {
        return -translate;
  ***REMOVED***

      return translate;
***REMOVED***
  ***REMOVED***;
***REMOVED***

/**
 * Updates glide movement with a `gap` settings.
 *
 * @param  {Object***REMOVED*** Glide
 * @param  {Object***REMOVED*** Components
 * @return {Object***REMOVED***
 */
function Gap (Glide, Components) {
  return {
    /**
     * Modifies passed translate value with number in the `gap` settings.
     *
     * @param  {Number***REMOVED*** translate
     * @return {Number***REMOVED***
     */
    modify: function modify(translate) {
      return translate + Components.Gaps.value * Glide.index;
***REMOVED***
  ***REMOVED***;
***REMOVED***

/**
 * Updates glide movement with width of additional clones width.
 *
 * @param  {Object***REMOVED*** Glide
 * @param  {Object***REMOVED*** Components
 * @return {Object***REMOVED***
 */
function Grow (Glide, Components) {
  return {
    /**
     * Adds to the passed translate width of the half of clones.
     *
     * @param  {Number***REMOVED*** translate
     * @return {Number***REMOVED***
     */
    modify: function modify(translate) {
      return translate + Components.Clones.grow / 2;
***REMOVED***
  ***REMOVED***;
***REMOVED***

/**
 * Updates glide movement with a `peek` settings.
 *
 * @param  {Object***REMOVED*** Glide
 * @param  {Object***REMOVED*** Components
 * @return {Object***REMOVED***
 */
function Peeking (Glide, Components) {
  return {
    /**
     * Modifies passed translate value with a `peek` setting.
     *
     * @param  {Number***REMOVED*** translate
     * @return {Number***REMOVED***
     */
    modify: function modify(translate) {
      if (Glide.settings.focusAt >= 0) {
        var peek = Components.Peek.value;

        if (isObject(peek)) {
          return translate - peek.before;
    ***REMOVED***

        return translate - peek;
  ***REMOVED***

      return translate;
***REMOVED***
  ***REMOVED***;
***REMOVED***

/**
 * Updates glide movement with a `focusAt` settings.
 *
 * @param  {Object***REMOVED*** Glide
 * @param  {Object***REMOVED*** Components
 * @return {Object***REMOVED***
 */
function Focusing (Glide, Components) {
  return {
    /**
     * Modifies passed translate value with index in the `focusAt` setting.
     *
     * @param  {Number***REMOVED*** translate
     * @return {Number***REMOVED***
     */
    modify: function modify(translate) {
      var gap = Components.Gaps.value;
      var width = Components.Sizes.width;
      var focusAt = Glide.settings.focusAt;
      var slideWidth = Components.Sizes.slideWidth;

      if (focusAt === 'center') {
        return translate - (width / 2 - slideWidth / 2);
  ***REMOVED***

      return translate - slideWidth * focusAt - gap * focusAt;
***REMOVED***
  ***REMOVED***;
***REMOVED***

/**
 * Applies diffrent transformers on translate value.
 *
 * @param  {Object***REMOVED*** Glide
 * @param  {Object***REMOVED*** Components
 * @return {Object***REMOVED***
 */
function mutator (Glide, Components, Events) {
  /**
   * Merge instance transformers with collection of default transformers.
   * It's important that the Rtl component be last on the list,
   * so it reflects all previous transformations.
   *
   * @type {Array***REMOVED***
   */
  var TRANSFORMERS = [Gap, Grow, Peeking, Focusing].concat(Glide._t, [Rtl]);

  return {
    /**
     * Piplines translate value with registered transformers.
     *
     * @param  {Number***REMOVED*** translate
     * @return {Number***REMOVED***
     */
    mutate: function mutate(translate) {
      for (var i = 0; i < TRANSFORMERS.length; i++) {
        var transformer = TRANSFORMERS[i];

        if (isFunction(transformer) && isFunction(transformer().modify)) {
          translate = transformer(Glide, Components, Events).modify(translate);
    ***REMOVED*** else {
          warn('Transformer should be a function that returns an object with `modify()` method');
    ***REMOVED***
  ***REMOVED***

      return translate;
***REMOVED***
  ***REMOVED***;
***REMOVED***

function Translate (Glide, Components, Events) {
  var Translate = {
    /**
     * Sets value of translate on HTML element.
     *
     * @param {Number***REMOVED*** value
     * @return {Void***REMOVED***
     */
    set: function set(value) {
      var transform = mutator(Glide, Components).mutate(value);

      Components.Html.wrapper.style.transform = 'translate3d(' + -1 * transform + 'px, 0px, 0px)';
***REMOVED***,


    /**
     * Removes value of translate from HTML element.
     *
     * @return {Void***REMOVED***
     */
    remove: function remove() {
      Components.Html.wrapper.style.transform = '';
***REMOVED***
  ***REMOVED***;

  /**
   * Set new translate value:
   * - on move to reflect index change
   * - on updating via API to reflect possible changes in options
   */
  Events.on('move', function (context) {
    var gap = Components.Gaps.value;
    var length = Components.Sizes.length;
    var width = Components.Sizes.slideWidth;

    if (Glide.isType('carousel') && Components.Run.isOffset('<')) {
      Components.Transition.after(function () {
        Events.emit('translate.jump');

        Translate.set(width * (length - 1));
  ***REMOVED***);

      return Translate.set(-width - gap * length);
***REMOVED***

    if (Glide.isType('carousel') && Components.Run.isOffset('>')) {
      Components.Transition.after(function () {
        Events.emit('translate.jump');

        Translate.set(0);
  ***REMOVED***);

      return Translate.set(width * length + gap * length);
***REMOVED***

    return Translate.set(context.movement);
  ***REMOVED***);

  /**
   * Remove translate:
   * - on destroying to bring markup to its inital state
   */
  Events.on('destroy', function () {
    Translate.remove();
  ***REMOVED***);

  return Translate;
***REMOVED***

function Transition (Glide, Components, Events) {
  /**
   * Holds inactivity status of transition.
   * When true transition is not applied.
   *
   * @type {Boolean***REMOVED***
   */
  var disabled = false;

  var Transition = {
    /**
     * Composes string of the CSS transition.
     *
     * @param {String***REMOVED*** property
     * @return {String***REMOVED***
     */
    compose: function compose(property) {
      var settings = Glide.settings;

      if (!disabled) {
        return property + ' ' + this.duration + 'ms ' + settings.animationTimingFunc;
  ***REMOVED***

      return property + ' 0ms ' + settings.animationTimingFunc;
***REMOVED***,


    /**
     * Sets value of transition on HTML element.
     *
     * @param {String=***REMOVED*** property
     * @return {Void***REMOVED***
     */
    set: function set() {
      var property = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'transform';

      Components.Html.wrapper.style.transition = this.compose(property);
***REMOVED***,


    /**
     * Removes value of transition from HTML element.
     *
     * @return {Void***REMOVED***
     */
    remove: function remove() {
      Components.Html.wrapper.style.transition = '';
***REMOVED***,


    /**
     * Runs callback after animation.
     *
     * @param  {Function***REMOVED*** callback
     * @return {Void***REMOVED***
     */
    after: function after(callback) {
      setTimeout(function () {
        callback();
  ***REMOVED***, this.duration);
***REMOVED***,


    /**
     * Enable transition.
     *
     * @return {Void***REMOVED***
     */
    enable: function enable() {
      disabled = false;

      this.set();
***REMOVED***,


    /**
     * Disable transition.
     *
     * @return {Void***REMOVED***
     */
    disable: function disable() {
      disabled = true;

      this.set();
***REMOVED***
  ***REMOVED***;

  define(Transition, 'duration', {
    /**
     * Gets duration of the transition based
     * on currently running animation type.
     *
     * @return {Number***REMOVED***
     */
    get: function get() {
      var settings = Glide.settings;

      if (Glide.isType('slider') && Components.Run.offset) {
        return settings.rewindDuration;
  ***REMOVED***

      return settings.animationDuration;
***REMOVED***
  ***REMOVED***);

  /**
   * Set transition `style` value:
   * - on each moving, because it may be cleared by offset move
   */
  Events.on('move', function () {
    Transition.set();
  ***REMOVED***);

  /**
   * Disable transition:
   * - before initial build to avoid transitioning from `0` to `startAt` index
   * - while resizing window and recalculating dimentions
   * - on jumping from offset transition at start and end edges in `carousel` type
   */
  Events.on(['build.before', 'resize', 'translate.jump'], function () {
    Transition.disable();
  ***REMOVED***);

  /**
   * Enable transition:
   * - on each running, because it may be disabled by offset move
   */
  Events.on('run', function () {
    Transition.enable();
  ***REMOVED***);

  /**
   * Remove transition:
   * - on destroying to bring markup to its inital state
   */
  Events.on('destroy', function () {
    Transition.remove();
  ***REMOVED***);

  return Transition;
***REMOVED***

/**
 * Test via a getter in the options object to see
 * if the passive property is accessed.
 *
 * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
 */

var supportsPassive = false;

try {
  var opts = Object.defineProperty({***REMOVED***, 'passive', {
    get: function get() {
      supportsPassive = true;
***REMOVED***
  ***REMOVED***);

  window.addEventListener('testPassive', null, opts);
  window.removeEventListener('testPassive', null, opts);
***REMOVED*** catch (e) {***REMOVED***

var supportsPassive$1 = supportsPassive;

var START_EVENTS = ['touchstart', 'mousedown'];
var MOVE_EVENTS = ['touchmove', 'mousemove'];
var END_EVENTS = ['touchend', 'touchcancel', 'mouseup', 'mouseleave'];
var MOUSE_EVENTS = ['mousedown', 'mousemove', 'mouseup', 'mouseleave'];

function swipe (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder***REMOVED***
   */
  var Binder = new EventsBinder();

  var swipeSin = 0;
  var swipeStartX = 0;
  var swipeStartY = 0;
  var disabled = false;
  var capture = supportsPassive$1 ? { passive: true ***REMOVED*** : false;

  var Swipe = {
    /**
     * Initializes swipe bindings.
     *
     * @return {Void***REMOVED***
     */
    mount: function mount() {
      this.bindSwipeStart();
***REMOVED***,


    /**
     * Handler for `swipestart` event. Calculates entry points of the user's tap.
     *
     * @param {Object***REMOVED*** event
     * @return {Void***REMOVED***
     */
    start: function start(event) {
      if (!disabled && !Glide.disabled) {
        this.disable();

        var swipe = this.touches(event);

        swipeSin = null;
        swipeStartX = toInt(swipe.pageX);
        swipeStartY = toInt(swipe.pageY);

        this.bindSwipeMove();
        this.bindSwipeEnd();

        Events.emit('swipe.start');
  ***REMOVED***
***REMOVED***,


    /**
     * Handler for `swipemove` event. Calculates user's tap angle and distance.
     *
     * @param {Object***REMOVED*** event
     */
    move: function move(event) {
      if (!Glide.disabled) {
        var _Glide$settings = Glide.settings,
            touchAngle = _Glide$settings.touchAngle,
            touchRatio = _Glide$settings.touchRatio,
            classes = _Glide$settings.classes;


        var swipe = this.touches(event);

        var subExSx = toInt(swipe.pageX) - swipeStartX;
        var subEySy = toInt(swipe.pageY) - swipeStartY;
        var powEX = Math.abs(subExSx << 2);
        var powEY = Math.abs(subEySy << 2);
        var swipeHypotenuse = Math.sqrt(powEX + powEY);
        var swipeCathetus = Math.sqrt(powEY);

        swipeSin = Math.asin(swipeCathetus / swipeHypotenuse);

        if (swipeSin * 180 / Math.PI < touchAngle) {
          event.stopPropagation();

          Components.Move.make(subExSx * toFloat(touchRatio));

          Components.Html.root.classList.add(classes.dragging);

          Events.emit('swipe.move');
    ***REMOVED*** else {
          return false;
    ***REMOVED***
  ***REMOVED***
***REMOVED***,


    /**
     * Handler for `swipeend` event. Finitializes user's tap and decides about glide move.
     *
     * @param {Object***REMOVED*** event
     * @return {Void***REMOVED***
     */
    end: function end(event) {
      if (!Glide.disabled) {
        var settings = Glide.settings;

        var swipe = this.touches(event);
        var threshold = this.threshold(event);

        var swipeDistance = swipe.pageX - swipeStartX;
        var swipeDeg = swipeSin * 180 / Math.PI;
        var steps = Math.round(swipeDistance / Components.Sizes.slideWidth);

        this.enable();

        if (swipeDistance > threshold && swipeDeg < settings.touchAngle) {
  ***REMOVED*** While swipe is positive and greater than threshold move backward.
          if (settings.perTouch) {
            steps = Math.min(steps, toInt(settings.perTouch));
      ***REMOVED***

          if (Components.Direction.is('rtl')) {
            steps = -steps;
      ***REMOVED***

          Components.Run.make(Components.Direction.resolve('<' + steps));
    ***REMOVED*** else if (swipeDistance < -threshold && swipeDeg < settings.touchAngle) {
  ***REMOVED*** While swipe is negative and lower than negative threshold move forward.
          if (settings.perTouch) {
            steps = Math.max(steps, -toInt(settings.perTouch));
      ***REMOVED***

          if (Components.Direction.is('rtl')) {
            steps = -steps;
      ***REMOVED***

          Components.Run.make(Components.Direction.resolve('>' + steps));
    ***REMOVED*** else {
  ***REMOVED*** While swipe don't reach distance apply previous transform.
          Components.Move.make();
    ***REMOVED***

        Components.Html.root.classList.remove(settings.classes.dragging);

        this.unbindSwipeMove();
        this.unbindSwipeEnd();

        Events.emit('swipe.end');
  ***REMOVED***
***REMOVED***,


    /**
     * Binds swipe's starting event.
     *
     * @return {Void***REMOVED***
     */
    bindSwipeStart: function bindSwipeStart() {
      var _this = this;

      var settings = Glide.settings;

      if (settings.swipeThreshold) {
        Binder.on(START_EVENTS[0], Components.Html.wrapper, function (event) {
          _this.start(event);
    ***REMOVED***, capture);
  ***REMOVED***

      if (settings.dragThreshold) {
        Binder.on(START_EVENTS[1], Components.Html.wrapper, function (event) {
          _this.start(event);
    ***REMOVED***, capture);
  ***REMOVED***
***REMOVED***,


    /**
     * Unbinds swipe's starting event.
     *
     * @return {Void***REMOVED***
     */
    unbindSwipeStart: function unbindSwipeStart() {
      Binder.off(START_EVENTS[0], Components.Html.wrapper, capture);
      Binder.off(START_EVENTS[1], Components.Html.wrapper, capture);
***REMOVED***,


    /**
     * Binds swipe's moving event.
     *
     * @return {Void***REMOVED***
     */
    bindSwipeMove: function bindSwipeMove() {
      var _this2 = this;

      Binder.on(MOVE_EVENTS, Components.Html.wrapper, throttle(function (event) {
        _this2.move(event);
  ***REMOVED***, Glide.settings.throttle), capture);
***REMOVED***,


    /**
     * Unbinds swipe's moving event.
     *
     * @return {Void***REMOVED***
     */
    unbindSwipeMove: function unbindSwipeMove() {
      Binder.off(MOVE_EVENTS, Components.Html.wrapper, capture);
***REMOVED***,


    /**
     * Binds swipe's ending event.
     *
     * @return {Void***REMOVED***
     */
    bindSwipeEnd: function bindSwipeEnd() {
      var _this3 = this;

      Binder.on(END_EVENTS, Components.Html.wrapper, function (event) {
        _this3.end(event);
  ***REMOVED***);
***REMOVED***,


    /**
     * Unbinds swipe's ending event.
     *
     * @return {Void***REMOVED***
     */
    unbindSwipeEnd: function unbindSwipeEnd() {
      Binder.off(END_EVENTS, Components.Html.wrapper);
***REMOVED***,


    /**
     * Normalizes event touches points accorting to different types.
     *
     * @param {Object***REMOVED*** event
     */
    touches: function touches(event) {
      if (MOUSE_EVENTS.indexOf(event.type) > -1) {
        return event;
  ***REMOVED***

      return event.touches[0] || event.changedTouches[0];
***REMOVED***,


    /**
     * Gets value of minimum swipe distance settings based on event type.
     *
     * @return {Number***REMOVED***
     */
    threshold: function threshold(event) {
      var settings = Glide.settings;

      if (MOUSE_EVENTS.indexOf(event.type) > -1) {
        return settings.dragThreshold;
  ***REMOVED***

      return settings.swipeThreshold;
***REMOVED***,


    /**
     * Enables swipe event.
     *
     * @return {self***REMOVED***
     */
    enable: function enable() {
      disabled = false;

      Components.Transition.enable();

      return this;
***REMOVED***,


    /**
     * Disables swipe event.
     *
     * @return {self***REMOVED***
     */
    disable: function disable() {
      disabled = true;

      Components.Transition.disable();

      return this;
***REMOVED***
  ***REMOVED***;

  /**
   * Add component class:
   * - after initial building
   */
  Events.on('build.after', function () {
    Components.Html.root.classList.add(Glide.settings.classes.swipeable);
  ***REMOVED***);

  /**
   * Remove swiping bindings:
   * - on destroying, to remove added EventListeners
   */
  Events.on('destroy', function () {
    Swipe.unbindSwipeStart();
    Swipe.unbindSwipeMove();
    Swipe.unbindSwipeEnd();
    Binder.destroy();
  ***REMOVED***);

  return Swipe;
***REMOVED***

function images (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder***REMOVED***
   */
  var Binder = new EventsBinder();

  var Images = {
    /**
     * Binds listener to glide wrapper.
     *
     * @return {Void***REMOVED***
     */
    mount: function mount() {
      this.bind();
***REMOVED***,


    /**
     * Binds `dragstart` event on wrapper to prevent dragging images.
     *
     * @return {Void***REMOVED***
     */
    bind: function bind() {
      Binder.on('dragstart', Components.Html.wrapper, this.dragstart);
***REMOVED***,


    /**
     * Unbinds `dragstart` event on wrapper.
     *
     * @return {Void***REMOVED***
     */
    unbind: function unbind() {
      Binder.off('dragstart', Components.Html.wrapper);
***REMOVED***,


    /**
     * Event handler. Prevents dragging.
     *
     * @return {Void***REMOVED***
     */
    dragstart: function dragstart(event) {
      event.preventDefault();
***REMOVED***
  ***REMOVED***;

  /**
   * Remove bindings from images:
   * - on destroying, to remove added EventListeners
   */
  Events.on('destroy', function () {
    Images.unbind();
    Binder.destroy();
  ***REMOVED***);

  return Images;
***REMOVED***

function anchors (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder***REMOVED***
   */
  var Binder = new EventsBinder();

  /**
   * Holds detaching status of anchors.
   * Prevents detaching of already detached anchors.
   *
   * @private
   * @type {Boolean***REMOVED***
   */
  var detached = false;

  /**
   * Holds preventing status of anchors.
   * If `true` redirection after click will be disabled.
   *
   * @private
   * @type {Boolean***REMOVED***
   */
  var prevented = false;

  var Anchors = {
    /**
     * Setups a initial state of anchors component.
     *
     * @returns {Void***REMOVED***
     */
    mount: function mount() {
      /**
       * Holds collection of anchors elements.
       *
       * @private
       * @type {HTMLCollection***REMOVED***
       */
      this._a = Components.Html.wrapper.querySelectorAll('a');

      this.bind();
***REMOVED***,


    /**
     * Binds events to anchors inside a track.
     *
     * @return {Void***REMOVED***
     */
    bind: function bind() {
      Binder.on('click', Components.Html.wrapper, this.click);
***REMOVED***,


    /**
     * Unbinds events attached to anchors inside a track.
     *
     * @return {Void***REMOVED***
     */
    unbind: function unbind() {
      Binder.off('click', Components.Html.wrapper);
***REMOVED***,


    /**
     * Handler for click event. Prevents clicks when glide is in `prevent` status.
     *
     * @param  {Object***REMOVED*** event
     * @return {Void***REMOVED***
     */
    click: function click(event) {
      if (prevented) {
        event.stopPropagation();
        event.preventDefault();
  ***REMOVED***
***REMOVED***,


    /**
     * Detaches anchors click event inside glide.
     *
     * @return {self***REMOVED***
     */
    detach: function detach() {
      prevented = true;

      if (!detached) {
        for (var i = 0; i < this.items.length; i++) {
          this.items[i].draggable = false;

          this.items[i].setAttribute('data-href', this.items[i].getAttribute('href'));

          this.items[i].removeAttribute('href');
    ***REMOVED***

        detached = true;
  ***REMOVED***

      return this;
***REMOVED***,


    /**
     * Attaches anchors click events inside glide.
     *
     * @return {self***REMOVED***
     */
    attach: function attach() {
      prevented = false;

      if (detached) {
        for (var i = 0; i < this.items.length; i++) {
          this.items[i].draggable = true;

          this.items[i].setAttribute('href', this.items[i].getAttribute('data-href'));
    ***REMOVED***

        detached = false;
  ***REMOVED***

      return this;
***REMOVED***
  ***REMOVED***;

  define(Anchors, 'items', {
    /**
     * Gets collection of the arrows HTML elements.
     *
     * @return {HTMLElement[]***REMOVED***
     */
    get: function get() {
      return Anchors._a;
***REMOVED***
  ***REMOVED***);

  /**
   * Detach anchors inside slides:
   * - on swiping, so they won't redirect to its `href` attributes
   */
  Events.on('swipe.move', function () {
    Anchors.detach();
  ***REMOVED***);

  /**
   * Attach anchors inside slides:
   * - after swiping and transitions ends, so they can redirect after click again
   */
  Events.on('swipe.end', function () {
    Components.Transition.after(function () {
      Anchors.attach();
***REMOVED***);
  ***REMOVED***);

  /**
   * Unbind anchors inside slides:
   * - on destroying, to bring anchors to its initial state
   */
  Events.on('destroy', function () {
    Anchors.attach();
    Anchors.unbind();
    Binder.destroy();
  ***REMOVED***);

  return Anchors;
***REMOVED***

var NAV_SELECTOR = '[data-glide-el="controls[nav]"]';
var CONTROLS_SELECTOR = '[data-glide-el^="controls"]';

function controls (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder***REMOVED***
   */
  var Binder = new EventsBinder();

  var capture = supportsPassive$1 ? { passive: true ***REMOVED*** : false;

  var Controls = {
    /**
     * Inits arrows. Binds events listeners
     * to the arrows HTML elements.
     *
     * @return {Void***REMOVED***
     */
    mount: function mount() {
      /**
       * Collection of navigation HTML elements.
       *
       * @private
       * @type {HTMLCollection***REMOVED***
       */
      this._n = Components.Html.root.querySelectorAll(NAV_SELECTOR);

      /**
       * Collection of controls HTML elements.
       *
       * @private
       * @type {HTMLCollection***REMOVED***
       */
      this._c = Components.Html.root.querySelectorAll(CONTROLS_SELECTOR);

      this.addBindings();
***REMOVED***,


    /**
     * Sets active class to current slide.
     *
     * @return {Void***REMOVED***
     */
    setActive: function setActive() {
      for (var i = 0; i < this._n.length; i++) {
        this.addClass(this._n[i].children);
  ***REMOVED***
***REMOVED***,


    /**
     * Removes active class to current slide.
     *
     * @return {Void***REMOVED***
     */
    removeActive: function removeActive() {
      for (var i = 0; i < this._n.length; i++) {
        this.removeClass(this._n[i].children);
  ***REMOVED***
***REMOVED***,


    /**
     * Toggles active class on items inside navigation.
     *
     * @param  {HTMLElement***REMOVED*** controls
     * @return {Void***REMOVED***
     */
    addClass: function addClass(controls) {
      var settings = Glide.settings;
      var item = controls[Glide.index];

      if (item) {
        item.classList.add(settings.classes.activeNav);

        siblings(item).forEach(function (sibling) {
          sibling.classList.remove(settings.classes.activeNav);
    ***REMOVED***);
  ***REMOVED***
***REMOVED***,


    /**
     * Removes active class from active control.
     *
     * @param  {HTMLElement***REMOVED*** controls
     * @return {Void***REMOVED***
     */
    removeClass: function removeClass(controls) {
      var item = controls[Glide.index];

      if (item) {
        item.classList.remove(Glide.settings.classes.activeNav);
  ***REMOVED***
***REMOVED***,


    /**
     * Adds handles to the each group of controls.
     *
     * @return {Void***REMOVED***
     */
    addBindings: function addBindings() {
      for (var i = 0; i < this._c.length; i++) {
        this.bind(this._c[i].children);
  ***REMOVED***
***REMOVED***,


    /**
     * Removes handles from the each group of controls.
     *
     * @return {Void***REMOVED***
     */
    removeBindings: function removeBindings() {
      for (var i = 0; i < this._c.length; i++) {
        this.unbind(this._c[i].children);
  ***REMOVED***
***REMOVED***,


    /**
     * Binds events to arrows HTML elements.
     *
     * @param {HTMLCollection***REMOVED*** elements
     * @return {Void***REMOVED***
     */
    bind: function bind(elements) {
      for (var i = 0; i < elements.length; i++) {
        Binder.on('click', elements[i], this.click);
        Binder.on('touchstart', elements[i], this.click, capture);
  ***REMOVED***
***REMOVED***,


    /**
     * Unbinds events binded to the arrows HTML elements.
     *
     * @param {HTMLCollection***REMOVED*** elements
     * @return {Void***REMOVED***
     */
    unbind: function unbind(elements) {
      for (var i = 0; i < elements.length; i++) {
        Binder.off(['click', 'touchstart'], elements[i]);
  ***REMOVED***
***REMOVED***,


    /**
     * Handles `click` event on the arrows HTML elements.
     * Moves slider in driection precised in
     * `data-glide-dir` attribute.
     *
     * @param {Object***REMOVED*** event
     * @return {Void***REMOVED***
     */
    click: function click(event) {
      event.preventDefault();

      Components.Run.make(Components.Direction.resolve(event.currentTarget.getAttribute('data-glide-dir')));
***REMOVED***
  ***REMOVED***;

  define(Controls, 'items', {
    /**
     * Gets collection of the controls HTML elements.
     *
     * @return {HTMLElement[]***REMOVED***
     */
    get: function get() {
      return Controls._c;
***REMOVED***
  ***REMOVED***);

  /**
   * Swap active class of current navigation item:
   * - after mounting to set it to initial index
   * - after each move to the new index
   */
  Events.on(['mount.after', 'move.after'], function () {
    Controls.setActive();
  ***REMOVED***);

  /**
   * Remove bindings and HTML Classes:
   * - on destroying, to bring markup to its initial state
   */
  Events.on('destroy', function () {
    Controls.removeBindings();
    Controls.removeActive();
    Binder.destroy();
  ***REMOVED***);

  return Controls;
***REMOVED***

function keyboard (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder***REMOVED***
   */
  var Binder = new EventsBinder();

  var Keyboard = {
    /**
     * Binds keyboard events on component mount.
     *
     * @return {Void***REMOVED***
     */
    mount: function mount() {
      if (Glide.settings.keyboard) {
        this.bind();
  ***REMOVED***
***REMOVED***,


    /**
     * Adds keyboard press events.
     *
     * @return {Void***REMOVED***
     */
    bind: function bind() {
      Binder.on('keyup', document, this.press);
***REMOVED***,


    /**
     * Removes keyboard press events.
     *
     * @return {Void***REMOVED***
     */
    unbind: function unbind() {
      Binder.off('keyup', document);
***REMOVED***,


    /**
     * Handles keyboard's arrows press and moving glide foward and backward.
     *
     * @param  {Object***REMOVED*** event
     * @return {Void***REMOVED***
     */
    press: function press(event) {
      if (event.keyCode === 39) {
        Components.Run.make(Components.Direction.resolve('>'));
  ***REMOVED***

      if (event.keyCode === 37) {
        Components.Run.make(Components.Direction.resolve('<'));
  ***REMOVED***
***REMOVED***
  ***REMOVED***;

  /**
   * Remove bindings from keyboard:
   * - on destroying to remove added events
   * - on updating to remove events before remounting
   */
  Events.on(['destroy', 'update'], function () {
    Keyboard.unbind();
  ***REMOVED***);

  /**
   * Remount component
   * - on updating to reflect potential changes in settings
   */
  Events.on('update', function () {
    Keyboard.mount();
  ***REMOVED***);

  /**
   * Destroy binder:
   * - on destroying to remove listeners
   */
  Events.on('destroy', function () {
    Binder.destroy();
  ***REMOVED***);

  return Keyboard;
***REMOVED***

function autoplay (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder***REMOVED***
   */
  var Binder = new EventsBinder();

  var Autoplay = {
    /**
     * Initializes autoplaying and events.
     *
     * @return {Void***REMOVED***
     */
    mount: function mount() {
      this.start();

      if (Glide.settings.hoverpause) {
        this.bind();
  ***REMOVED***
***REMOVED***,


    /**
     * Starts autoplaying in configured interval.
     *
     * @param {Boolean|Number***REMOVED*** force Run autoplaying with passed interval regardless of `autoplay` settings
     * @return {Void***REMOVED***
     */
    start: function start() {
      var _this = this;

      if (Glide.settings.autoplay) {
        if (isUndefined(this._i)) {
          this._i = setInterval(function () {
            _this.stop();

            Components.Run.make('>');

            _this.start();
      ***REMOVED***, this.time);
    ***REMOVED***
  ***REMOVED***
***REMOVED***,


    /**
     * Stops autorunning of the glide.
     *
     * @return {Void***REMOVED***
     */
    stop: function stop() {
      this._i = clearInterval(this._i);
***REMOVED***,


    /**
     * Stops autoplaying while mouse is over glide's area.
     *
     * @return {Void***REMOVED***
     */
    bind: function bind() {
      var _this2 = this;

      Binder.on('mouseover', Components.Html.root, function () {
        _this2.stop();
  ***REMOVED***);

      Binder.on('mouseout', Components.Html.root, function () {
        _this2.start();
  ***REMOVED***);
***REMOVED***,


    /**
     * Unbind mouseover events.
     *
     * @returns {Void***REMOVED***
     */
    unbind: function unbind() {
      Binder.off(['mouseover', 'mouseout'], Components.Html.root);
***REMOVED***
  ***REMOVED***;

  define(Autoplay, 'time', {
    /**
     * Gets time period value for the autoplay interval. Prioritizes
     * times in `data-glide-autoplay` attrubutes over options.
     *
     * @return {Number***REMOVED***
     */
    get: function get() {
      var autoplay = Components.Html.slides[Glide.index].getAttribute('data-glide-autoplay');

      if (autoplay) {
        return toInt(autoplay);
  ***REMOVED***

      return toInt(Glide.settings.autoplay);
***REMOVED***
  ***REMOVED***);

  /**
   * Stop autoplaying and unbind events:
   * - on destroying, to clear defined interval
   * - on updating via API to reset interval that may changed
   */
  Events.on(['destroy', 'update'], function () {
    Autoplay.unbind();
  ***REMOVED***);

  /**
   * Stop autoplaying:
   * - before each run, to restart autoplaying
   * - on pausing via API
   * - on destroying, to clear defined interval
   * - while starting a swipe
   * - on updating via API to reset interval that may changed
   */
  Events.on(['run.before', 'pause', 'destroy', 'swipe.start', 'update'], function () {
    Autoplay.stop();
  ***REMOVED***);

  /**
   * Start autoplaying:
   * - after each run, to restart autoplaying
   * - on playing via API
   * - while ending a swipe
   */
  Events.on(['run.after', 'play', 'swipe.end'], function () {
    Autoplay.start();
  ***REMOVED***);

  /**
   * Remount autoplaying:
   * - on updating via API to reset interval that may changed
   */
  Events.on('update', function () {
    Autoplay.mount();
  ***REMOVED***);

  /**
   * Destroy a binder:
   * - on destroying glide instance to clearup listeners
   */
  Events.on('destroy', function () {
    Binder.destroy();
  ***REMOVED***);

  return Autoplay;
***REMOVED***

/**
 * Sorts keys of breakpoint object so they will be ordered from lower to bigger.
 *
 * @param {Object***REMOVED*** points
 * @returns {Object***REMOVED***
 */
function sortBreakpoints(points) {
  if (isObject(points)) {
    return sortKeys(points);
  ***REMOVED*** else {
    warn('Breakpoints option must be an object');
  ***REMOVED***

  return {***REMOVED***;
***REMOVED***

function breakpoints (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder***REMOVED***
   */
  var Binder = new EventsBinder();

  /**
   * Holds reference to settings.
   *
   * @type {Object***REMOVED***
   */
  var settings = Glide.settings;

  /**
   * Holds reference to breakpoints object in settings. Sorts breakpoints
   * from smaller to larger. It is required in order to proper
   * matching currently active breakpoint settings.
   *
   * @type {Object***REMOVED***
   */
  var points = sortBreakpoints(settings.breakpoints);

  /**
   * Cache initial settings before overwritting.
   *
   * @type {Object***REMOVED***
   */
  var defaults = _extends({***REMOVED***, settings);

  var Breakpoints = {
    /**
     * Matches settings for currectly matching media breakpoint.
     *
     * @param {Object***REMOVED*** points
     * @returns {Object***REMOVED***
     */
    match: function match(points) {
      if (typeof window.matchMedia !== 'undefined') {
        for (var point in points) {
          if (points.hasOwnProperty(point)) {
            if (window.matchMedia('(max-width: ' + point + 'px)').matches) {
              return points[point];
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***

      return defaults;
***REMOVED***
  ***REMOVED***;

  /**
   * Overwrite instance settings with currently matching breakpoint settings.
   * This happens right after component initialization.
   */
  _extends(settings, Breakpoints.match(points));

  /**
   * Update glide with settings of matched brekpoint:
   * - window resize to update slider
   */
  Binder.on('resize', window, throttle(function () {
    Glide.settings = mergeOptions(settings, Breakpoints.match(points));
  ***REMOVED***, Glide.settings.throttle));

  /**
   * Resort and update default settings:
   * - on reinit via API, so breakpoint matching will be performed with options
   */
  Events.on('update', function () {
    points = sortBreakpoints(points);

    defaults = _extends({***REMOVED***, settings);
  ***REMOVED***);

  /**
   * Unbind resize listener:
   * - on destroying, to bring markup to its initial state
   */
  Events.on('destroy', function () {
    Binder.off('resize', window);
  ***REMOVED***);

  return Breakpoints;
***REMOVED***

var COMPONENTS = {
  Html: Html,
  Translate: Translate,
  Transition: Transition,
  Direction: Direction,
  Peek: Peek,
  Sizes: Sizes,
  Gaps: Gaps,
  Move: Move,
  Clones: Clones,
  Resize: Resize,
  Build: Build,
  Run: Run
***REMOVED***;

var Glide$1 = function (_Core) {
  inherits(Glide$$1, _Core);

  function Glide$$1() {
    classCallCheck(this, Glide$$1);
    return possibleConstructorReturn(this, (Glide$$1.__proto__ || Object.getPrototypeOf(Glide$$1)).apply(this, arguments));
  ***REMOVED***

  createClass(Glide$$1, [{
    key: 'mount',
    value: function mount() {
      var extensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {***REMOVED***;

      return get(Glide$$1.prototype.__proto__ || Object.getPrototypeOf(Glide$$1.prototype), 'mount', this).call(this, _extends({***REMOVED***, COMPONENTS, extensions));
***REMOVED***
  ***REMOVED***]);
  return Glide$$1;
***REMOVED***(Glide);

export default Glide$1;
export { swipe as Swipe, images as Images, anchors as Anchors, controls as Controls, keyboard as Keyboard, autoplay as Autoplay, breakpoints as Breakpoints ***REMOVED***;
