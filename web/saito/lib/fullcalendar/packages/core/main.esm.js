/*!
FullCalendar Core Package v4.3.1
Docs & License: https://fullcalendar.io/
(c) 2019 Adam Shaw
*/

// Creating
// ----------------------------------------------------------------------------------------------------------------
var elementPropHash = {
    className: true,
    colSpan: true,
    rowSpan: true
***REMOVED***;
var containerTagHash = {
    '<tr': 'tbody',
    '<td': 'tr'
***REMOVED***;
function createElement(tagName, attrs, content) {
    var el = document.createElement(tagName);
    if (attrs) {
        for (var attrName in attrs) {
            if (attrName === 'style') {
                applyStyle(el, attrs[attrName]);
        ***REMOVED***
            else if (elementPropHash[attrName]) {
                el[attrName] = attrs[attrName];
        ***REMOVED***
            else {
                el.setAttribute(attrName, attrs[attrName]);
        ***REMOVED***
    ***REMOVED***
***REMOVED***
    if (typeof content === 'string') {
        el.innerHTML = content; // shortcut. no need to process HTML in any way
***REMOVED***
    else if (content != null) {
        appendToElement(el, content);
***REMOVED***
    return el;
***REMOVED***
function htmlToElement(html) {
    html = html.trim();
    var container = document.createElement(computeContainerTag(html));
    container.innerHTML = html;
    return container.firstChild;
***REMOVED***
function htmlToElements(html) {
    return Array.prototype.slice.call(htmlToNodeList(html));
***REMOVED***
function htmlToNodeList(html) {
    html = html.trim();
    var container = document.createElement(computeContainerTag(html));
    container.innerHTML = html;
    return container.childNodes;
***REMOVED***
// assumes html already trimmed and tag names are lowercase
function computeContainerTag(html) {
    return containerTagHash[html.substr(0, 3) // faster than using regex
    ] || 'div';
***REMOVED***
function appendToElement(el, content) {
    var childNodes = normalizeContent(content);
    for (var i = 0; i < childNodes.length; i++) {
        el.appendChild(childNodes[i]);
***REMOVED***
***REMOVED***
function prependToElement(parent, content) {
    var newEls = normalizeContent(content);
    var afterEl = parent.firstChild || null; // if no firstChild, will append to end, but that's okay, b/c there were no children
    for (var i = 0; i < newEls.length; i++) {
        parent.insertBefore(newEls[i], afterEl);
***REMOVED***
***REMOVED***
function insertAfterElement(refEl, content) {
    var newEls = normalizeContent(content);
    var afterEl = refEl.nextSibling || null;
    for (var i = 0; i < newEls.length; i++) {
        refEl.parentNode.insertBefore(newEls[i], afterEl);
***REMOVED***
***REMOVED***
function normalizeContent(content) {
    var els;
    if (typeof content === 'string') {
        els = htmlToElements(content);
***REMOVED***
    else if (content instanceof Node) {
        els = [content];
***REMOVED***
    else { // Node[] or NodeList
        els = Array.prototype.slice.call(content);
***REMOVED***
    return els;
***REMOVED***
function removeElement(el) {
    if (el.parentNode) {
        el.parentNode.removeChild(el);
***REMOVED***
***REMOVED***
// Querying
// ----------------------------------------------------------------------------------------------------------------
// from https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
var matchesMethod = Element.prototype.matches ||
    Element.prototype.matchesSelector ||
    Element.prototype.msMatchesSelector;
var closestMethod = Element.prototype.closest || function (selector) {
    // polyfill
    var el = this;
    if (!document.documentElement.contains(el)) {
        return null;
***REMOVED***
    do {
        if (elementMatches(el, selector)) {
            return el;
    ***REMOVED***
        el = el.parentElement || el.parentNode;
***REMOVED*** while (el !== null && el.nodeType === 1);
    return null;
***REMOVED***;
function elementClosest(el, selector) {
    return closestMethod.call(el, selector);
***REMOVED***
function elementMatches(el, selector) {
    return matchesMethod.call(el, selector);
***REMOVED***
// accepts multiple subject els
// returns a real array. good for methods like forEach
function findElements(container, selector) {
    var containers = container instanceof HTMLElement ? [container] : container;
    var allMatches = [];
    for (var i = 0; i < containers.length; i++) {
        var matches = containers[i].querySelectorAll(selector);
        for (var j = 0; j < matches.length; j++) {
            allMatches.push(matches[j]);
    ***REMOVED***
***REMOVED***
    return allMatches;
***REMOVED***
// accepts multiple subject els
// only queries direct child elements
function findChildren(parent, selector) {
    var parents = parent instanceof HTMLElement ? [parent] : parent;
    var allMatches = [];
    for (var i = 0; i < parents.length; i++) {
        var childNodes = parents[i].children; // only ever elements
        for (var j = 0; j < childNodes.length; j++) {
            var childNode = childNodes[j];
            if (!selector || elementMatches(childNode, selector)) {
                allMatches.push(childNode);
        ***REMOVED***
    ***REMOVED***
***REMOVED***
    return allMatches;
***REMOVED***
// Attributes
// ----------------------------------------------------------------------------------------------------------------
function forceClassName(el, className, bool) {
    if (bool) {
        el.classList.add(className);
***REMOVED***
    else {
        el.classList.remove(className);
***REMOVED***
***REMOVED***
// Style
// ----------------------------------------------------------------------------------------------------------------
var PIXEL_PROP_RE = /(top|left|right|bottom|width|height)$/i;
function applyStyle(el, props) {
    for (var propName in props) {
        applyStyleProp(el, propName, props[propName]);
***REMOVED***
***REMOVED***
function applyStyleProp(el, name, val) {
    if (val == null) {
        el.style[name] = '';
***REMOVED***
    else if (typeof val === 'number' && PIXEL_PROP_RE.test(name)) {
        el.style[name] = val + 'px';
***REMOVED***
    else {
        el.style[name] = val;
***REMOVED***
***REMOVED***

function pointInsideRect(point, rect) {
    return point.left >= rect.left &&
        point.left < rect.right &&
        point.top >= rect.top &&
        point.top < rect.bottom;
***REMOVED***
// Returns a new rectangle that is the intersection of the two rectangles. If they don't intersect, returns false
function intersectRects(rect1, rect2) {
    var res = {
        left: Math.max(rect1.left, rect2.left),
        right: Math.min(rect1.right, rect2.right),
        top: Math.max(rect1.top, rect2.top),
        bottom: Math.min(rect1.bottom, rect2.bottom)
***REMOVED***;
    if (res.left < res.right && res.top < res.bottom) {
        return res;
***REMOVED***
    return false;
***REMOVED***
function translateRect(rect, deltaX, deltaY) {
    return {
        left: rect.left + deltaX,
        right: rect.right + deltaX,
        top: rect.top + deltaY,
        bottom: rect.bottom + deltaY
***REMOVED***;
***REMOVED***
// Returns a new point that will have been moved to reside within the given rectangle
function constrainPoint(point, rect) {
    return {
        left: Math.min(Math.max(point.left, rect.left), rect.right),
        top: Math.min(Math.max(point.top, rect.top), rect.bottom)
***REMOVED***;
***REMOVED***
// Returns a point that is the center of the given rectangle
function getRectCenter(rect) {
    return {
        left: (rect.left + rect.right) / 2,
        top: (rect.top + rect.bottom) / 2
***REMOVED***;
***REMOVED***
// Subtracts point2's coordinates from point1's coordinates, returning a delta
function diffPoints(point1, point2) {
    return {
        left: point1.left - point2.left,
        top: point1.top - point2.top
***REMOVED***;
***REMOVED***

// Logic for determining if, when the element is right-to-left, the scrollbar appears on the left side
var isRtlScrollbarOnLeft = null;
function getIsRtlScrollbarOnLeft() {
    if (isRtlScrollbarOnLeft === null) {
        isRtlScrollbarOnLeft = computeIsRtlScrollbarOnLeft();
***REMOVED***
    return isRtlScrollbarOnLeft;
***REMOVED***
function computeIsRtlScrollbarOnLeft() {
    var outerEl = createElement('div', {
        style: {
            position: 'absolute',
            top: -1000,
            left: 0,
            border: 0,
            padding: 0,
            overflow: 'scroll',
            direction: 'rtl'
    ***REMOVED***
***REMOVED***, '<div></div>');
    document.body.appendChild(outerEl);
    var innerEl = outerEl.firstChild;
    var res = innerEl.getBoundingClientRect().left > outerEl.getBoundingClientRect().left;
    removeElement(outerEl);
    return res;
***REMOVED***
// The scrollbar width computations in computeEdges are sometimes flawed when it comes to
// retina displays, rounding, and IE11. Massage them into a usable value.
function sanitizeScrollbarWidth(width) {
    width = Math.max(0, width); // no negatives
    width = Math.round(width);
    return width;
***REMOVED***

function computeEdges(el, getPadding) {
    if (getPadding === void 0) { getPadding = false; ***REMOVED***
    var computedStyle = window.getComputedStyle(el);
    var borderLeft = parseInt(computedStyle.borderLeftWidth, 10) || 0;
    var borderRight = parseInt(computedStyle.borderRightWidth, 10) || 0;
    var borderTop = parseInt(computedStyle.borderTopWidth, 10) || 0;
    var borderBottom = parseInt(computedStyle.borderBottomWidth, 10) || 0;
    // must use offset(Width|Height) because compatible with client(Width|Height)
    var scrollbarLeftRight = sanitizeScrollbarWidth(el.offsetWidth - el.clientWidth - borderLeft - borderRight);
    var scrollbarBottom = sanitizeScrollbarWidth(el.offsetHeight - el.clientHeight - borderTop - borderBottom);
    var res = {
        borderLeft: borderLeft,
        borderRight: borderRight,
        borderTop: borderTop,
        borderBottom: borderBottom,
        scrollbarBottom: scrollbarBottom,
        scrollbarLeft: 0,
        scrollbarRight: 0
***REMOVED***;
    if (getIsRtlScrollbarOnLeft() && computedStyle.direction === 'rtl') { // is the scrollbar on the left side?
        res.scrollbarLeft = scrollbarLeftRight;
***REMOVED***
    else {
        res.scrollbarRight = scrollbarLeftRight;
***REMOVED***
    if (getPadding) {
        res.paddingLeft = parseInt(computedStyle.paddingLeft, 10) || 0;
        res.paddingRight = parseInt(computedStyle.paddingRight, 10) || 0;
        res.paddingTop = parseInt(computedStyle.paddingTop, 10) || 0;
        res.paddingBottom = parseInt(computedStyle.paddingBottom, 10) || 0;
***REMOVED***
    return res;
***REMOVED***
function computeInnerRect(el, goWithinPadding) {
    if (goWithinPadding === void 0) { goWithinPadding = false; ***REMOVED***
    var outerRect = computeRect(el);
    var edges = computeEdges(el, goWithinPadding);
    var res = {
        left: outerRect.left + edges.borderLeft + edges.scrollbarLeft,
        right: outerRect.right - edges.borderRight - edges.scrollbarRight,
        top: outerRect.top + edges.borderTop,
        bottom: outerRect.bottom - edges.borderBottom - edges.scrollbarBottom
***REMOVED***;
    if (goWithinPadding) {
        res.left += edges.paddingLeft;
        res.right -= edges.paddingRight;
        res.top += edges.paddingTop;
        res.bottom -= edges.paddingBottom;
***REMOVED***
    return res;
***REMOVED***
function computeRect(el) {
    var rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.pageXOffset,
        top: rect.top + window.pageYOffset,
        right: rect.right + window.pageXOffset,
        bottom: rect.bottom + window.pageYOffset
***REMOVED***;
***REMOVED***
function computeViewportRect() {
    return {
        left: window.pageXOffset,
        right: window.pageXOffset + document.documentElement.clientWidth,
        top: window.pageYOffset,
        bottom: window.pageYOffset + document.documentElement.clientHeight
***REMOVED***;
***REMOVED***
function computeHeightAndMargins(el) {
    return el.getBoundingClientRect().height + computeVMargins(el);
***REMOVED***
function computeVMargins(el) {
    var computed = window.getComputedStyle(el);
    return parseInt(computed.marginTop, 10) +
        parseInt(computed.marginBottom, 10);
***REMOVED***
// does not return window
function getClippingParents(el) {
    var parents = [];
    while (el instanceof HTMLElement) { // will stop when gets to document or null
        var computedStyle = window.getComputedStyle(el);
        if (computedStyle.position === 'fixed') {
            break;
    ***REMOVED***
        if ((/(auto|scroll)/).test(computedStyle.overflow + computedStyle.overflowY + computedStyle.overflowX)) {
            parents.push(el);
    ***REMOVED***
        el = el.parentNode;
***REMOVED***
    return parents;
***REMOVED***
function computeClippingRect(el) {
    return getClippingParents(el)
        .map(function (el) {
        return computeInnerRect(el);
***REMOVED***)
        .concat(computeViewportRect())
        .reduce(function (rect0, rect1) {
        return intersectRects(rect0, rect1) || rect1; // should always intersect
***REMOVED***);
***REMOVED***

// Stops a mouse/touch event from doing it's native browser action
function preventDefault(ev) {
    ev.preventDefault();
***REMOVED***
// Event Delegation
// ----------------------------------------------------------------------------------------------------------------
function listenBySelector(container, eventType, selector, handler) {
    function realHandler(ev) {
        var matchedChild = elementClosest(ev.target, selector);
        if (matchedChild) {
            handler.call(matchedChild, ev, matchedChild);
    ***REMOVED***
***REMOVED***
    container.addEventListener(eventType, realHandler);
    return function () {
        container.removeEventListener(eventType, realHandler);
***REMOVED***;
***REMOVED***
function listenToHoverBySelector(container, selector, onMouseEnter, onMouseLeave) {
    var currentMatchedChild;
    return listenBySelector(container, 'mouseover', selector, function (ev, matchedChild) {
        if (matchedChild !== currentMatchedChild) {
            currentMatchedChild = matchedChild;
            onMouseEnter(ev, matchedChild);
            var realOnMouseLeave_1 = function (ev) {
                currentMatchedChild = null;
                onMouseLeave(ev, matchedChild);
                matchedChild.removeEventListener('mouseleave', realOnMouseLeave_1);
        ***REMOVED***;
    ***REMOVED*** listen to the next mouseleave, and then unattach
            matchedChild.addEventListener('mouseleave', realOnMouseLeave_1);
    ***REMOVED***
***REMOVED***);
***REMOVED***
// Animation
// ----------------------------------------------------------------------------------------------------------------
var transitionEventNames = [
    'webkitTransitionEnd',
    'otransitionend',
    'oTransitionEnd',
    'msTransitionEnd',
    'transitionend'
];
// triggered only when the next single subsequent transition finishes
function whenTransitionDone(el, callback) {
    var realCallback = function (ev) {
        callback(ev);
        transitionEventNames.forEach(function (eventName) {
            el.removeEventListener(eventName, realCallback);
    ***REMOVED***);
***REMOVED***;
    transitionEventNames.forEach(function (eventName) {
        el.addEventListener(eventName, realCallback); // cross-browser way to determine when the transition finishes
***REMOVED***);
***REMOVED***

var DAY_IDS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
// Adding
function addWeeks(m, n) {
    var a = dateToUtcArray(m);
    a[2] += n * 7;
    return arrayToUtcDate(a);
***REMOVED***
function addDays(m, n) {
    var a = dateToUtcArray(m);
    a[2] += n;
    return arrayToUtcDate(a);
***REMOVED***
function addMs(m, n) {
    var a = dateToUtcArray(m);
    a[6] += n;
    return arrayToUtcDate(a);
***REMOVED***
// Diffing (all return floats)
function diffWeeks(m0, m1) {
    return diffDays(m0, m1) / 7;
***REMOVED***
function diffDays(m0, m1) {
    return (m1.valueOf() - m0.valueOf()) / (1000 * 60 * 60 * 24);
***REMOVED***
function diffHours(m0, m1) {
    return (m1.valueOf() - m0.valueOf()) / (1000 * 60 * 60);
***REMOVED***
function diffMinutes(m0, m1) {
    return (m1.valueOf() - m0.valueOf()) / (1000 * 60);
***REMOVED***
function diffSeconds(m0, m1) {
    return (m1.valueOf() - m0.valueOf()) / 1000;
***REMOVED***
function diffDayAndTime(m0, m1) {
    var m0day = startOfDay(m0);
    var m1day = startOfDay(m1);
    return {
        years: 0,
        months: 0,
        days: Math.round(diffDays(m0day, m1day)),
        milliseconds: (m1.valueOf() - m1day.valueOf()) - (m0.valueOf() - m0day.valueOf())
***REMOVED***;
***REMOVED***
// Diffing Whole Units
function diffWholeWeeks(m0, m1) {
    var d = diffWholeDays(m0, m1);
    if (d !== null && d % 7 === 0) {
        return d / 7;
***REMOVED***
    return null;
***REMOVED***
function diffWholeDays(m0, m1) {
    if (timeAsMs(m0) === timeAsMs(m1)) {
        return Math.round(diffDays(m0, m1));
***REMOVED***
    return null;
***REMOVED***
// Start-Of
function startOfDay(m) {
    return arrayToUtcDate([
        m.getUTCFullYear(),
        m.getUTCMonth(),
        m.getUTCDate()
    ]);
***REMOVED***
function startOfHour(m) {
    return arrayToUtcDate([
        m.getUTCFullYear(),
        m.getUTCMonth(),
        m.getUTCDate(),
        m.getUTCHours()
    ]);
***REMOVED***
function startOfMinute(m) {
    return arrayToUtcDate([
        m.getUTCFullYear(),
        m.getUTCMonth(),
        m.getUTCDate(),
        m.getUTCHours(),
        m.getUTCMinutes()
    ]);
***REMOVED***
function startOfSecond(m) {
    return arrayToUtcDate([
        m.getUTCFullYear(),
        m.getUTCMonth(),
        m.getUTCDate(),
        m.getUTCHours(),
        m.getUTCMinutes(),
        m.getUTCSeconds()
    ]);
***REMOVED***
// Week Computation
function weekOfYear(marker, dow, doy) {
    var y = marker.getUTCFullYear();
    var w = weekOfGivenYear(marker, y, dow, doy);
    if (w < 1) {
        return weekOfGivenYear(marker, y - 1, dow, doy);
***REMOVED***
    var nextW = weekOfGivenYear(marker, y + 1, dow, doy);
    if (nextW >= 1) {
        return Math.min(w, nextW);
***REMOVED***
    return w;
***REMOVED***
function weekOfGivenYear(marker, year, dow, doy) {
    var firstWeekStart = arrayToUtcDate([year, 0, 1 + firstWeekOffset(year, dow, doy)]);
    var dayStart = startOfDay(marker);
    var days = Math.round(diffDays(firstWeekStart, dayStart));
    return Math.floor(days / 7) + 1; // zero-indexed
***REMOVED***
// start-of-first-week - start-of-year
function firstWeekOffset(year, dow, doy) {
    // first-week day -- which january is always in the first week (4 for iso, 1 for other)
    var fwd = 7 + dow - doy;
    // first-week day local weekday -- which local weekday is fwd
    var fwdlw = (7 + arrayToUtcDate([year, 0, fwd]).getUTCDay() - dow) % 7;
    return -fwdlw + fwd - 1;
***REMOVED***
// Array Conversion
function dateToLocalArray(date) {
    return [
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
    ];
***REMOVED***
function arrayToLocalDate(a) {
    return new Date(a[0], a[1] || 0, a[2] == null ? 1 : a[2], // day of month
    a[3] || 0, a[4] || 0, a[5] || 0);
***REMOVED***
function dateToUtcArray(date) {
    return [
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
        date.getUTCMilliseconds()
    ];
***REMOVED***
function arrayToUtcDate(a) {
    // according to web standards (and Safari), a month index is required.
    // massage if only given a year.
    if (a.length === 1) {
        a = a.concat([0]);
***REMOVED***
    return new Date(Date.UTC.apply(Date, a));
***REMOVED***
// Other Utils
function isValidDate(m) {
    return !isNaN(m.valueOf());
***REMOVED***
function timeAsMs(m) {
    return m.getUTCHours() * 1000 * 60 * 60 +
        m.getUTCMinutes() * 1000 * 60 +
        m.getUTCSeconds() * 1000 +
        m.getUTCMilliseconds();
***REMOVED***

var INTERNAL_UNITS = ['years', 'months', 'days', 'milliseconds'];
var PARSE_RE = /^(-?)(?:(\d+)\.)?(\d+):(\d\d)(?::(\d\d)(?:\.(\d\d\d))?)?/;
// Parsing and Creation
function createDuration(input, unit) {
    var _a;
    if (typeof input === 'string') {
        return parseString(input);
***REMOVED***
    else if (typeof input === 'object' && input) { // non-null object
        return normalizeObject(input);
***REMOVED***
    else if (typeof input === 'number') {
        return normalizeObject((_a = {***REMOVED***, _a[unit || 'milliseconds'] = input, _a));
***REMOVED***
    else {
        return null;
***REMOVED***
***REMOVED***
function parseString(s) {
    var m = PARSE_RE.exec(s);
    if (m) {
        var sign = m[1] ? -1 : 1;
        return {
            years: 0,
            months: 0,
            days: sign * (m[2] ? parseInt(m[2], 10) : 0),
            milliseconds: sign * ((m[3] ? parseInt(m[3], 10) : 0) * 60 * 60 * 1000 + // hours
                (m[4] ? parseInt(m[4], 10) : 0) * 60 * 1000 + // minutes
                (m[5] ? parseInt(m[5], 10) : 0) * 1000 + // seconds
                (m[6] ? parseInt(m[6], 10) : 0) // ms
            )
    ***REMOVED***;
***REMOVED***
    return null;
***REMOVED***
function normalizeObject(obj) {
    return {
        years: obj.years || obj.year || 0,
        months: obj.months || obj.month || 0,
        days: (obj.days || obj.day || 0) +
            getWeeksFromInput(obj) * 7,
        milliseconds: (obj.hours || obj.hour || 0) * 60 * 60 * 1000 + // hours
            (obj.minutes || obj.minute || 0) * 60 * 1000 + // minutes
            (obj.seconds || obj.second || 0) * 1000 + // seconds
            (obj.milliseconds || obj.millisecond || obj.ms || 0) // ms
***REMOVED***;
***REMOVED***
function getWeeksFromInput(obj) {
    return obj.weeks || obj.week || 0;
***REMOVED***
// Equality
function durationsEqual(d0, d1) {
    return d0.years === d1.years &&
        d0.months === d1.months &&
        d0.days === d1.days &&
        d0.milliseconds === d1.milliseconds;
***REMOVED***
function isSingleDay(dur) {
    return dur.years === 0 && dur.months === 0 && dur.days === 1 && dur.milliseconds === 0;
***REMOVED***
// Simple Math
function addDurations(d0, d1) {
    return {
        years: d0.years + d1.years,
        months: d0.months + d1.months,
        days: d0.days + d1.days,
        milliseconds: d0.milliseconds + d1.milliseconds
***REMOVED***;
***REMOVED***
function subtractDurations(d1, d0) {
    return {
        years: d1.years - d0.years,
        months: d1.months - d0.months,
        days: d1.days - d0.days,
        milliseconds: d1.milliseconds - d0.milliseconds
***REMOVED***;
***REMOVED***
function multiplyDuration(d, n) {
    return {
        years: d.years * n,
        months: d.months * n,
        days: d.days * n,
        milliseconds: d.milliseconds * n
***REMOVED***;
***REMOVED***
// Conversions
// "Rough" because they are based on average-case Gregorian months/years
function asRoughYears(dur) {
    return asRoughDays(dur) / 365;
***REMOVED***
function asRoughMonths(dur) {
    return asRoughDays(dur) / 30;
***REMOVED***
function asRoughDays(dur) {
    return asRoughMs(dur) / 864e5;
***REMOVED***
function asRoughMinutes(dur) {
    return asRoughMs(dur) / (1000 * 60);
***REMOVED***
function asRoughSeconds(dur) {
    return asRoughMs(dur) / 1000;
***REMOVED***
function asRoughMs(dur) {
    return dur.years * (365 * 864e5) +
        dur.months * (30 * 864e5) +
        dur.days * 864e5 +
        dur.milliseconds;
***REMOVED***
// Advanced Math
function wholeDivideDurations(numerator, denominator) {
    var res = null;
    for (var i = 0; i < INTERNAL_UNITS.length; i++) {
        var unit = INTERNAL_UNITS[i];
        if (denominator[unit]) {
            var localRes = numerator[unit] / denominator[unit];
            if (!isInt(localRes) || (res !== null && res !== localRes)) {
                return null;
        ***REMOVED***
            res = localRes;
    ***REMOVED***
        else if (numerator[unit]) {
    ***REMOVED*** needs to divide by something but can't!
            return null;
    ***REMOVED***
***REMOVED***
    return res;
***REMOVED***
function greatestDurationDenominator(dur, dontReturnWeeks) {
    var ms = dur.milliseconds;
    if (ms) {
        if (ms % 1000 !== 0) {
            return { unit: 'millisecond', value: ms ***REMOVED***;
    ***REMOVED***
        if (ms % (1000 * 60) !== 0) {
            return { unit: 'second', value: ms / 1000 ***REMOVED***;
    ***REMOVED***
        if (ms % (1000 * 60 * 60) !== 0) {
            return { unit: 'minute', value: ms / (1000 * 60) ***REMOVED***;
    ***REMOVED***
        if (ms) {
            return { unit: 'hour', value: ms / (1000 * 60 * 60) ***REMOVED***;
    ***REMOVED***
***REMOVED***
    if (dur.days) {
        if (!dontReturnWeeks && dur.days % 7 === 0) {
            return { unit: 'week', value: dur.days / 7 ***REMOVED***;
    ***REMOVED***
        return { unit: 'day', value: dur.days ***REMOVED***;
***REMOVED***
    if (dur.months) {
        return { unit: 'month', value: dur.months ***REMOVED***;
***REMOVED***
    if (dur.years) {
        return { unit: 'year', value: dur.years ***REMOVED***;
***REMOVED***
    return { unit: 'millisecond', value: 0 ***REMOVED***;
***REMOVED***

/* FullCalendar-specific DOM Utilities
----------------------------------------------------------------------------------------------------------------------*/
// Given the scrollbar widths of some other container, create borders/margins on rowEls in order to match the left
// and right space that was offset by the scrollbars. A 1-pixel border first, then margin beyond that.
function compensateScroll(rowEl, scrollbarWidths) {
    if (scrollbarWidths.left) {
        applyStyle(rowEl, {
            borderLeftWidth: 1,
            marginLeft: scrollbarWidths.left - 1
    ***REMOVED***);
***REMOVED***
    if (scrollbarWidths.right) {
        applyStyle(rowEl, {
            borderRightWidth: 1,
            marginRight: scrollbarWidths.right - 1
    ***REMOVED***);
***REMOVED***
***REMOVED***
// Undoes compensateScroll and restores all borders/margins
function uncompensateScroll(rowEl) {
    applyStyle(rowEl, {
        marginLeft: '',
        marginRight: '',
        borderLeftWidth: '',
        borderRightWidth: ''
***REMOVED***);
***REMOVED***
// Make the mouse cursor express that an event is not allowed in the current area
function disableCursor() {
    document.body.classList.add('fc-not-allowed');
***REMOVED***
// Returns the mouse cursor to its original look
function enableCursor() {
    document.body.classList.remove('fc-not-allowed');
***REMOVED***
// Given a total available height to fill, have `els` (essentially child rows) expand to accomodate.
// By default, all elements that are shorter than the recommended height are expanded uniformly, not considering
// any other els that are already too tall. if `shouldRedistribute` is on, it considers these tall rows and
// reduces the available height.
function distributeHeight(els, availableHeight, shouldRedistribute) {
    // *FLOORING NOTE*: we floor in certain places because zoom can give inaccurate floating-point dimensions,
    // and it is better to be shorter than taller, to avoid creating unnecessary scrollbars.
    var minOffset1 = Math.floor(availableHeight / els.length); // for non-last element
    var minOffset2 = Math.floor(availableHeight - minOffset1 * (els.length - 1)); // for last element *FLOORING NOTE*
    var flexEls = []; // elements that are allowed to expand. array of DOM nodes
    var flexOffsets = []; // amount of vertical space it takes up
    var flexHeights = []; // actual css height
    var usedHeight = 0;
    undistributeHeight(els); // give all elements their natural height
    // find elements that are below the recommended height (expandable).
    // important to query for heights in a single first pass (to avoid reflow oscillation).
    els.forEach(function (el, i) {
        var minOffset = i === els.length - 1 ? minOffset2 : minOffset1;
        var naturalHeight = el.getBoundingClientRect().height;
        var naturalOffset = naturalHeight + computeVMargins(el);
        if (naturalOffset < minOffset) {
            flexEls.push(el);
            flexOffsets.push(naturalOffset);
            flexHeights.push(naturalHeight);
    ***REMOVED***
        else {
    ***REMOVED*** this element stretches past recommended height (non-expandable). mark the space as occupied.
            usedHeight += naturalOffset;
    ***REMOVED***
***REMOVED***);
    // readjust the recommended height to only consider the height available to non-maxed-out rows.
    if (shouldRedistribute) {
        availableHeight -= usedHeight;
        minOffset1 = Math.floor(availableHeight / flexEls.length);
        minOffset2 = Math.floor(availableHeight - minOffset1 * (flexEls.length - 1)); // *FLOORING NOTE*
***REMOVED***
    // assign heights to all expandable elements
    flexEls.forEach(function (el, i) {
        var minOffset = i === flexEls.length - 1 ? minOffset2 : minOffset1;
        var naturalOffset = flexOffsets[i];
        var naturalHeight = flexHeights[i];
        var newHeight = minOffset - (naturalOffset - naturalHeight); // subtract the margin/padding
        if (naturalOffset < minOffset) { // we check this again because redistribution might have changed things
            el.style.height = newHeight + 'px';
    ***REMOVED***
***REMOVED***);
***REMOVED***
// Undoes distrubuteHeight, restoring all els to their natural height
function undistributeHeight(els) {
    els.forEach(function (el) {
        el.style.height = '';
***REMOVED***);
***REMOVED***
// Given `els`, a set of <td> cells, find the cell with the largest natural width and set the widths of all the
// cells to be that width.
// PREREQUISITE: if you want a cell to take up width, it needs to have a single inner element w/ display:inline
function matchCellWidths(els) {
    var maxInnerWidth = 0;
    els.forEach(function (el) {
        var innerEl = el.firstChild; // hopefully an element
        if (innerEl instanceof HTMLElement) {
            var innerWidth_1 = innerEl.getBoundingClientRect().width;
            if (innerWidth_1 > maxInnerWidth) {
                maxInnerWidth = innerWidth_1;
        ***REMOVED***
    ***REMOVED***
***REMOVED***);
    maxInnerWidth++; // sometimes not accurate of width the text needs to stay on one line. insurance
    els.forEach(function (el) {
        el.style.width = maxInnerWidth + 'px';
***REMOVED***);
    return maxInnerWidth;
***REMOVED***
// Given one element that resides inside another,
// Subtracts the height of the inner element from the outer element.
function subtractInnerElHeight(outerEl, innerEl) {
    // effin' IE8/9/10/11 sometimes returns 0 for dimensions. this weird hack was the only thing that worked
    var reflowStyleProps = {
        position: 'relative',
        left: -1 // ensure reflow in case the el was already relative. negative is less likely to cause new scroll
***REMOVED***;
    applyStyle(outerEl, reflowStyleProps);
    applyStyle(innerEl, reflowStyleProps);
    var diff = // grab the dimensions
     outerEl.getBoundingClientRect().height -
        innerEl.getBoundingClientRect().height;
    // undo hack
    var resetStyleProps = { position: '', left: '' ***REMOVED***;
    applyStyle(outerEl, resetStyleProps);
    applyStyle(innerEl, resetStyleProps);
    return diff;
***REMOVED***
/* Selection
----------------------------------------------------------------------------------------------------------------------*/
function preventSelection(el) {
    el.classList.add('fc-unselectable');
    el.addEventListener('selectstart', preventDefault);
***REMOVED***
function allowSelection(el) {
    el.classList.remove('fc-unselectable');
    el.removeEventListener('selectstart', preventDefault);
***REMOVED***
/* Context Menu
----------------------------------------------------------------------------------------------------------------------*/
function preventContextMenu(el) {
    el.addEventListener('contextmenu', preventDefault);
***REMOVED***
function allowContextMenu(el) {
    el.removeEventListener('contextmenu', preventDefault);
***REMOVED***
/* Object Ordering by Field
----------------------------------------------------------------------------------------------------------------------*/
function parseFieldSpecs(input) {
    var specs = [];
    var tokens = [];
    var i;
    var token;
    if (typeof input === 'string') {
        tokens = input.split(/\s*,\s*/);
***REMOVED***
    else if (typeof input === 'function') {
        tokens = [input];
***REMOVED***
    else if (Array.isArray(input)) {
        tokens = input;
***REMOVED***
    for (i = 0; i < tokens.length; i++) {
        token = tokens[i];
        if (typeof token === 'string') {
            specs.push(token.charAt(0) === '-' ?
                { field: token.substring(1), order: -1 ***REMOVED*** :
                { field: token, order: 1 ***REMOVED***);
    ***REMOVED***
        else if (typeof token === 'function') {
            specs.push({ func: token ***REMOVED***);
    ***REMOVED***
***REMOVED***
    return specs;
***REMOVED***
function compareByFieldSpecs(obj0, obj1, fieldSpecs) {
    var i;
    var cmp;
    for (i = 0; i < fieldSpecs.length; i++) {
        cmp = compareByFieldSpec(obj0, obj1, fieldSpecs[i]);
        if (cmp) {
            return cmp;
    ***REMOVED***
***REMOVED***
    return 0;
***REMOVED***
function compareByFieldSpec(obj0, obj1, fieldSpec) {
    if (fieldSpec.func) {
        return fieldSpec.func(obj0, obj1);
***REMOVED***
    return flexibleCompare(obj0[fieldSpec.field], obj1[fieldSpec.field])
        * (fieldSpec.order || 1);
***REMOVED***
function flexibleCompare(a, b) {
    if (!a && !b) {
        return 0;
***REMOVED***
    if (b == null) {
        return -1;
***REMOVED***
    if (a == null) {
        return 1;
***REMOVED***
    if (typeof a === 'string' || typeof b === 'string') {
        return String(a).localeCompare(String(b));
***REMOVED***
    return a - b;
***REMOVED***
/* String Utilities
----------------------------------------------------------------------------------------------------------------------*/
function capitaliseFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
***REMOVED***
function padStart(val, len) {
    var s = String(val);
    return '000'.substr(0, len - s.length) + s;
***REMOVED***
/* Number Utilities
----------------------------------------------------------------------------------------------------------------------*/
function compareNumbers(a, b) {
    return a - b;
***REMOVED***
function isInt(n) {
    return n % 1 === 0;
***REMOVED***
/* Weird Utilities
----------------------------------------------------------------------------------------------------------------------*/
function applyAll(functions, thisObj, args) {
    if (typeof functions === 'function') { // supplied a single function
        functions = [functions];
***REMOVED***
    if (functions) {
        var i = void 0;
        var ret = void 0;
        for (i = 0; i < functions.length; i++) {
            ret = functions[i].apply(thisObj, args) || ret;
    ***REMOVED***
        return ret;
***REMOVED***
***REMOVED***
function firstDefined() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
***REMOVED***
    for (var i = 0; i < args.length; i++) {
        if (args[i] !== undefined) {
            return args[i];
    ***REMOVED***
***REMOVED***
***REMOVED***
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// https://github.com/jashkenas/underscore/blob/1.6.0/underscore.js#L714
function debounce(func, wait) {
    var timeout;
    var args;
    var context;
    var timestamp;
    var result;
    var later = function () {
        var last = new Date().valueOf() - timestamp;
        if (last < wait) {
            timeout = setTimeout(later, wait - last);
    ***REMOVED***
        else {
            timeout = null;
            result = func.apply(context, args);
            context = args = null;
    ***REMOVED***
***REMOVED***;
    return function () {
        context = this;
        args = arguments;
        timestamp = new Date().valueOf();
        if (!timeout) {
            timeout = setTimeout(later, wait);
    ***REMOVED***
        return result;
***REMOVED***;
***REMOVED***
// Number and Boolean are only types that defaults or not computed for
// TODO: write more comments
function refineProps(rawProps, processors, defaults, leftoverProps) {
    if (defaults === void 0) { defaults = {***REMOVED***; ***REMOVED***
    var refined = {***REMOVED***;
    for (var key in processors) {
        var processor = processors[key];
        if (rawProps[key] !== undefined) {
    ***REMOVED*** found
            if (processor === Function) {
                refined[key] = typeof rawProps[key] === 'function' ? rawProps[key] : null;
        ***REMOVED***
            else if (processor) { // a refining function?
                refined[key] = processor(rawProps[key]);
        ***REMOVED***
            else {
                refined[key] = rawProps[key];
        ***REMOVED***
    ***REMOVED***
        else if (defaults[key] !== undefined) {
    ***REMOVED*** there's an explicit default
            refined[key] = defaults[key];
    ***REMOVED***
        else {
    ***REMOVED*** must compute a default
            if (processor === String) {
                refined[key] = ''; // empty string is default for String
        ***REMOVED***
            else if (!processor || processor === Number || processor === Boolean || processor === Function) {
                refined[key] = null; // assign null for other non-custom processor funcs
        ***REMOVED***
            else {
                refined[key] = processor(null); // run the custom processor func
        ***REMOVED***
    ***REMOVED***
***REMOVED***
    if (leftoverProps) {
        for (var key in rawProps) {
            if (processors[key] === undefined) {
                leftoverProps[key] = rawProps[key];
        ***REMOVED***
    ***REMOVED***
***REMOVED***
    return refined;
***REMOVED***
/* Date stuff that doesn't belong in datelib core
----------------------------------------------------------------------------------------------------------------------*/
// given a timed range, computes an all-day range that has the same exact duration,
// but whose start time is aligned with the start of the day.
function computeAlignedDayRange(timedRange) {
    var dayCnt = Math.floor(diffDays(timedRange.start, timedRange.end)) || 1;
    var start = startOfDay(timedRange.start);
    var end = addDays(start, dayCnt);
    return { start: start, end: end ***REMOVED***;
***REMOVED***
// given a timed range, computes an all-day range based on how for the end date bleeds into the next day
// TODO: give nextDayThreshold a default arg
function computeVisibleDayRange(timedRange, nextDayThreshold) {
    if (nextDayThreshold === void 0) { nextDayThreshold = createDuration(0); ***REMOVED***
    var startDay = null;
    var endDay = null;
    if (timedRange.end) {
        endDay = startOfDay(timedRange.end);
        var endTimeMS = timedRange.end.valueOf() - endDay.valueOf(); // # of milliseconds into `endDay`
***REMOVED*** If the end time is actually inclusively part of the next day and is equal to or
***REMOVED*** beyond the next day threshold, adjust the end to be the exclusive end of `endDay`.
***REMOVED*** Otherwise, leaving it as inclusive will cause it to exclude `endDay`.
        if (endTimeMS && endTimeMS >= asRoughMs(nextDayThreshold)) {
            endDay = addDays(endDay, 1);
    ***REMOVED***
***REMOVED***
    if (timedRange.start) {
        startDay = startOfDay(timedRange.start); // the beginning of the day the range starts
***REMOVED*** If end is within `startDay` but not past nextDayThreshold, assign the default duration of one day.
        if (endDay && endDay <= startDay) {
            endDay = addDays(startDay, 1);
    ***REMOVED***
***REMOVED***
    return { start: startDay, end: endDay ***REMOVED***;
***REMOVED***
// spans from one day into another?
function isMultiDayRange(range) {
    var visibleRange = computeVisibleDayRange(range);
    return diffDays(visibleRange.start, visibleRange.end) > 1;
***REMOVED***
function diffDates(date0, date1, dateEnv, largeUnit) {
    if (largeUnit === 'year') {
        return createDuration(dateEnv.diffWholeYears(date0, date1), 'year');
***REMOVED***
    else if (largeUnit === 'month') {
        return createDuration(dateEnv.diffWholeMonths(date0, date1), 'month');
***REMOVED***
    else {
        return diffDayAndTime(date0, date1); // returns a duration
***REMOVED***
***REMOVED***

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] ***REMOVED*** instanceof Array && function (d, b) { d.__proto__ = b; ***REMOVED***) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; ***REMOVED***;
    return extendStatics(d, b);
***REMOVED***;

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; ***REMOVED***
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
***REMOVED***

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    ***REMOVED***
        return t;
***REMOVED***;
    return __assign.apply(this, arguments);
***REMOVED***;

function parseRecurring(eventInput, allDayDefault, dateEnv, recurringTypes, leftovers) {
    for (var i = 0; i < recurringTypes.length; i++) {
        var localLeftovers = {***REMOVED***;
        var parsed = recurringTypes[i].parse(eventInput, localLeftovers, dateEnv);
        if (parsed) {
            var allDay = localLeftovers.allDay;
            delete localLeftovers.allDay; // remove from leftovers
            if (allDay == null) {
                allDay = allDayDefault;
                if (allDay == null) {
                    allDay = parsed.allDayGuess;
                    if (allDay == null) {
                        allDay = false;
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
            __assign(leftovers, localLeftovers);
            return {
                allDay: allDay,
                duration: parsed.duration,
                typeData: parsed.typeData,
                typeId: i
        ***REMOVED***;
    ***REMOVED***
***REMOVED***
    return null;
***REMOVED***
/*
Event MUST have a recurringDef
*/
function expandRecurringRanges(eventDef, duration, framingRange, dateEnv, recurringTypes) {
    var typeDef = recurringTypes[eventDef.recurringDef.typeId];
    var markers = typeDef.expand(eventDef.recurringDef.typeData, {
        start: dateEnv.subtract(framingRange.start, duration),
        end: framingRange.end
***REMOVED***, dateEnv);
    // the recurrence plugins don't guarantee that all-day events are start-of-day, so we have to
    if (eventDef.allDay) {
        markers = markers.map(startOfDay);
***REMOVED***
    return markers;
***REMOVED***

var hasOwnProperty = Object.prototype.hasOwnProperty;
// Merges an array of objects into a single object.
// The second argument allows for an array of property names who's object values will be merged together.
function mergeProps(propObjs, complexProps) {
    var dest = {***REMOVED***;
    var i;
    var name;
    var complexObjs;
    var j;
    var val;
    var props;
    if (complexProps) {
        for (i = 0; i < complexProps.length; i++) {
            name = complexProps[i];
            complexObjs = [];
    ***REMOVED*** collect the trailing object values, stopping when a non-object is discovered
            for (j = propObjs.length - 1; j >= 0; j--) {
                val = propObjs[j][name];
                if (typeof val === 'object' && val) { // non-null object
                    complexObjs.unshift(val);
            ***REMOVED***
                else if (val !== undefined) {
                    dest[name] = val; // if there were no objects, this value will be used
                    break;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED*** if the trailing values were objects, use the merged value
            if (complexObjs.length) {
                dest[name] = mergeProps(complexObjs);
        ***REMOVED***
    ***REMOVED***
***REMOVED***
    // copy values into the destination, going from last to first
    for (i = propObjs.length - 1; i >= 0; i--) {
        props = propObjs[i];
        for (name in props) {
            if (!(name in dest)) { // if already assigned by previous props or complex props, don't reassign
                dest[name] = props[name];
        ***REMOVED***
    ***REMOVED***
***REMOVED***
    return dest;
***REMOVED***
function filterHash(hash, func) {
    var filtered = {***REMOVED***;
    for (var key in hash) {
        if (func(hash[key], key)) {
            filtered[key] = hash[key];
    ***REMOVED***
***REMOVED***
    return filtered;
***REMOVED***
function mapHash(hash, func) {
    var newHash = {***REMOVED***;
    for (var key in hash) {
        newHash[key] = func(hash[key], key);
***REMOVED***
    return newHash;
***REMOVED***
function arrayToHash(a) {
    var hash = {***REMOVED***;
    for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
        var item = a_1[_i];
        hash[item] = true;
***REMOVED***
    return hash;
***REMOVED***
function hashValuesToArray(obj) {
    var a = [];
    for (var key in obj) {
        a.push(obj[key]);
***REMOVED***
    return a;
***REMOVED***
function isPropsEqual(obj0, obj1) {
    for (var key in obj0) {
        if (hasOwnProperty.call(obj0, key)) {
            if (!(key in obj1)) {
                return false;
        ***REMOVED***
    ***REMOVED***
***REMOVED***
    for (var key in obj1) {
        if (hasOwnProperty.call(obj1, key)) {
            if (obj0[key] !== obj1[key]) {
                return false;
        ***REMOVED***
    ***REMOVED***
***REMOVED***
    return true;
***REMOVED***

function parseEvents(rawEvents, sourceId, calendar, allowOpenRange) {
    var eventStore = createEmptyEventStore();
    for (var _i = 0, rawEvents_1 = rawEvents; _i < rawEvents_1.length; _i++) {
        var rawEvent = rawEvents_1[_i];
        var tuple = parseEvent(rawEvent, sourceId, calendar, allowOpenRange);
        if (tuple) {
            eventTupleToStore(tuple, eventStore);
    ***REMOVED***
***REMOVED***
    return eventStore;
***REMOVED***
function eventTupleToStore(tuple, eventStore) {
    if (eventStore === void 0) { eventStore = createEmptyEventStore(); ***REMOVED***
    eventStore.defs[tuple.def.defId] = tuple.def;
    if (tuple.instance) {
        eventStore.instances[tuple.instance.instanceId] = tuple.instance;
***REMOVED***
    return eventStore;
***REMOVED***
function expandRecurring(eventStore, framingRange, calendar) {
    var dateEnv = calendar.dateEnv;
    var defs = eventStore.defs, instances = eventStore.instances;
    // remove existing recurring instances
    instances = filterHash(instances, function (instance) {
        return !defs[instance.defId].recurringDef;
***REMOVED***);
    for (var defId in defs) {
        var def = defs[defId];
        if (def.recurringDef) {
            var duration = def.recurringDef.duration;
            if (!duration) {
                duration = def.allDay ?
                    calendar.defaultAllDayEventDuration :
                    calendar.defaultTimedEventDuration;
        ***REMOVED***
            var starts = expandRecurringRanges(def, duration, framingRange, calendar.dateEnv, calendar.pluginSystem.hooks.recurringTypes);
            for (var _i = 0, starts_1 = starts; _i < starts_1.length; _i++) {
                var start = starts_1[_i];
                var instance = createEventInstance(defId, {
                    start: start,
                    end: dateEnv.add(start, duration)
            ***REMOVED***);
                instances[instance.instanceId] = instance;
        ***REMOVED***
    ***REMOVED***
***REMOVED***
    return { defs: defs, instances: instances ***REMOVED***;
***REMOVED***
// retrieves events that have the same groupId as the instance specified by `instanceId`
// or they are the same as the instance.
// why might instanceId not be in the store? an event from another calendar?
function getRelevantEvents(eventStore, instanceId) {
    var instance = eventStore.instances[instanceId];
    if (instance) {
        var def_1 = eventStore.defs[instance.defId];
***REMOVED*** get events/instances with same group
        var newStore = filterEventStoreDefs(eventStore, function (lookDef) {
            return isEventDefsGrouped(def_1, lookDef);
    ***REMOVED***);
***REMOVED*** add the original
***REMOVED*** TODO: wish we could use eventTupleToStore or something like it
        newStore.defs[def_1.defId] = def_1;
        newStore.instances[instance.instanceId] = instance;
        return newStore;
***REMOVED***
    return createEmptyEventStore();
***REMOVED***
function isEventDefsGrouped(def0, def1) {
    return Boolean(def0.groupId && def0.groupId === def1.groupId);
***REMOVED***
function transformRawEvents(rawEvents, eventSource, calendar) {
    var calEachTransform = calendar.opt('eventDataTransform');
    var sourceEachTransform = eventSource ? eventSource.eventDataTransform : null;
    if (sourceEachTransform) {
        rawEvents = transformEachRawEvent(rawEvents, sourceEachTransform);
***REMOVED***
    if (calEachTransform) {
        rawEvents = transformEachRawEvent(rawEvents, calEachTransform);
***REMOVED***
    return rawEvents;
***REMOVED***
function transformEachRawEvent(rawEvents, func) {
    var refinedEvents;
    if (!func) {
        refinedEvents = rawEvents;
***REMOVED***
    else {
        refinedEvents = [];
        for (var _i = 0, rawEvents_2 = rawEvents; _i < rawEvents_2.length; _i++) {
            var rawEvent = rawEvents_2[_i];
            var refinedEvent = func(rawEvent);
            if (refinedEvent) {
                refinedEvents.push(refinedEvent);
        ***REMOVED***
            else if (refinedEvent == null) {
                refinedEvents.push(rawEvent);
        ***REMOVED*** // if a different falsy value, do nothing
    ***REMOVED***
***REMOVED***
    return refinedEvents;
***REMOVED***
function createEmptyEventStore() {
    return { defs: {***REMOVED***, instances: {***REMOVED*** ***REMOVED***;
***REMOVED***
function mergeEventStores(store0, store1) {
    return {
        defs: __assign({***REMOVED***, store0.defs, store1.defs),
        instances: __assign({***REMOVED***, store0.instances, store1.instances)
***REMOVED***;
***REMOVED***
function filterEventStoreDefs(eventStore, filterFunc) {
    var defs = filterHash(eventStore.defs, filterFunc);
    var instances = filterHash(eventStore.instances, function (instance) {
        return defs[instance.defId]; // still exists?
***REMOVED***);
    return { defs: defs, instances: instances ***REMOVED***;
***REMOVED***

function parseRange(input, dateEnv) {
    var start = null;
    var end = null;
    if (input.start) {
        start = dateEnv.createMarker(input.start);
***REMOVED***
    if (input.end) {
        end = dateEnv.createMarker(input.end);
***REMOVED***
    if (!start && !end) {
        return null;
***REMOVED***
    if (start && end && end < start) {
        return null;
***REMOVED***
    return { start: start, end: end ***REMOVED***;
***REMOVED***
// SIDE-EFFECT: will mutate ranges.
// Will return a new array result.
function invertRanges(ranges, constraintRange) {
    var invertedRanges = [];
    var start = constraintRange.start; // the end of the previous range. the start of the new range
    var i;
    var dateRange;
    // ranges need to be in order. required for our date-walking algorithm
    ranges.sort(compareRanges);
    for (i = 0; i < ranges.length; i++) {
        dateRange = ranges[i];
***REMOVED*** add the span of time before the event (if there is any)
        if (dateRange.start > start) { // compare millisecond time (skip any ambig logic)
            invertedRanges.push({ start: start, end: dateRange.start ***REMOVED***);
    ***REMOVED***
        if (dateRange.end > start) {
            start = dateRange.end;
    ***REMOVED***
***REMOVED***
    // add the span of time after the last event (if there is any)
    if (start < constraintRange.end) { // compare millisecond time (skip any ambig logic)
        invertedRanges.push({ start: start, end: constraintRange.end ***REMOVED***);
***REMOVED***
    return invertedRanges;
***REMOVED***
function compareRanges(range0, range1) {
    return range0.start.valueOf() - range1.start.valueOf(); // earlier ranges go first
***REMOVED***
function intersectRanges(range0, range1) {
    var start = range0.start;
    var end = range0.end;
    var newRange = null;
    if (range1.start !== null) {
        if (start === null) {
            start = range1.start;
    ***REMOVED***
        else {
            start = new Date(Math.max(start.valueOf(), range1.start.valueOf()));
    ***REMOVED***
***REMOVED***
    if (range1.end != null) {
        if (end === null) {
            end = range1.end;
    ***REMOVED***
        else {
            end = new Date(Math.min(end.valueOf(), range1.end.valueOf()));
    ***REMOVED***
***REMOVED***
    if (start === null || end === null || start < end) {
        newRange = { start: start, end: end ***REMOVED***;
***REMOVED***
    return newRange;
***REMOVED***
function rangesEqual(range0, range1) {
    return (range0.start === null ? null : range0.start.valueOf()) === (range1.start === null ? null : range1.start.valueOf()) &&
        (range0.end === null ? null : range0.end.valueOf()) === (range1.end === null ? null : range1.end.valueOf());
***REMOVED***
function rangesIntersect(range0, range1) {
    return (range0.end === null || range1.start === null || range0.end > range1.start) &&
        (range0.start === null || range1.end === null || range0.start < range1.end);
***REMOVED***
function rangeContainsRange(outerRange, innerRange) {
    return (outerRange.start === null || (innerRange.start !== null && innerRange.start >= outerRange.start)) &&
        (outerRange.end === null || (innerRange.end !== null && innerRange.end <= outerRange.end));
***REMOVED***
function rangeContainsMarker(range, date) {
    return (range.start === null || date >= range.start) &&
        (range.end === null || date < range.end);
***REMOVED***
// If the given date is not within the given range, move it inside.
// (If it's past the end, make it one millisecond before the end).
function constrainMarkerToRange(date, range) {
    if (range.start != null && date < range.start) {
        return range.start;
***REMOVED***
    if (range.end != null && date >= range.end) {
        return new Date(range.end.valueOf() - 1);
***REMOVED***
    return date;
***REMOVED***

function removeExact(array, exactVal) {
    var removeCnt = 0;
    var i = 0;
    while (i < array.length) {
        if (array[i] === exactVal) {
            array.splice(i, 1);
            removeCnt++;
    ***REMOVED***
        else {
            i++;
    ***REMOVED***
***REMOVED***
    return removeCnt;
***REMOVED***
function isArraysEqual(a0, a1) {
    var len = a0.length;
    var i;
    if (len !== a1.length) { // not array? or not same length?
        return false;
***REMOVED***
    for (i = 0; i < len; i++) {
        if (a0[i] !== a1[i]) {
            return false;
    ***REMOVED***
***REMOVED***
    return true;
***REMOVED***

function memoize(workerFunc) {
    var args;
    var res;
    return function () {
        if (!args || !isArraysEqual(args, arguments)) {
            args = arguments;
            res = workerFunc.apply(this, arguments);
    ***REMOVED***
        return res;
***REMOVED***;
***REMOVED***
/*
always executes the workerFunc, but if the result is equal to the previous result,
return the previous result instead.
*/
function memoizeOutput(workerFunc, equalityFunc) {
    var cachedRes = null;
    return function () {
        var newRes = workerFunc.apply(this, arguments);
        if (cachedRes === null || !(cachedRes === newRes || equalityFunc(cachedRes, newRes))) {
            cachedRes = newRes;
    ***REMOVED***
        return cachedRes;
***REMOVED***;
***REMOVED***

var EXTENDED_SETTINGS_AND_SEVERITIES = {
    week: 3,
    separator: 0,
    omitZeroMinute: 0,
    meridiem: 0,
    omitCommas: 0
***REMOVED***;
var STANDARD_DATE_PROP_SEVERITIES = {
    timeZoneName: 7,
    era: 6,
    year: 5,
    month: 4,
    day: 2,
    weekday: 2,
    hour: 1,
    minute: 1,
    second: 1
***REMOVED***;
var MERIDIEM_RE = /\s*([ap])\.?m\.?/i; // eats up leading spaces too
var COMMA_RE = /,/g; // we need re for globalness
var MULTI_SPACE_RE = /\s+/g;
var LTR_RE = /\u200e/g; // control character
var UTC_RE = /UTC|GMT/;
var NativeFormatter = /** @class */ (function () {
    function NativeFormatter(formatSettings) {
        var standardDateProps = {***REMOVED***;
        var extendedSettings = {***REMOVED***;
        var severity = 0;
        for (var name_1 in formatSettings) {
            if (name_1 in EXTENDED_SETTINGS_AND_SEVERITIES) {
                extendedSettings[name_1] = formatSettings[name_1];
                severity = Math.max(EXTENDED_SETTINGS_AND_SEVERITIES[name_1], severity);
        ***REMOVED***
            else {
                standardDateProps[name_1] = formatSettings[name_1];
                if (name_1 in STANDARD_DATE_PROP_SEVERITIES) {
                    severity = Math.max(STANDARD_DATE_PROP_SEVERITIES[name_1], severity);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
        this.standardDateProps = standardDateProps;
        this.extendedSettings = extendedSettings;
        this.severity = severity;
        this.buildFormattingFunc = memoize(buildFormattingFunc);
***REMOVED***
    NativeFormatter.prototype.format = function (date, context) {
        return this.buildFormattingFunc(this.standardDateProps, this.extendedSettings, context)(date);
***REMOVED***;
    NativeFormatter.prototype.formatRange = function (start, end, context) {
        var _a = this, standardDateProps = _a.standardDateProps, extendedSettings = _a.extendedSettings;
        var diffSeverity = computeMarkerDiffSeverity(start.marker, end.marker, context.calendarSystem);
        if (!diffSeverity) {
            return this.format(start, context);
    ***REMOVED***
        var biggestUnitForPartial = diffSeverity;
        if (biggestUnitForPartial > 1 && // the two dates are different in a way that's larger scale than time
            (standardDateProps.year === 'numeric' || standardDateProps.year === '2-digit') &&
            (standardDateProps.month === 'numeric' || standardDateProps.month === '2-digit') &&
            (standardDateProps.day === 'numeric' || standardDateProps.day === '2-digit')) {
            biggestUnitForPartial = 1; // make it look like the dates are only different in terms of time
    ***REMOVED***
        var full0 = this.format(start, context);
        var full1 = this.format(end, context);
        if (full0 === full1) {
            return full0;
    ***REMOVED***
        var partialDateProps = computePartialFormattingOptions(standardDateProps, biggestUnitForPartial);
        var partialFormattingFunc = buildFormattingFunc(partialDateProps, extendedSettings, context);
        var partial0 = partialFormattingFunc(start);
        var partial1 = partialFormattingFunc(end);
        var insertion = findCommonInsertion(full0, partial0, full1, partial1);
        var separator = extendedSettings.separator || '';
        if (insertion) {
            return insertion.before + partial0 + separator + partial1 + insertion.after;
    ***REMOVED***
        return full0 + separator + full1;
***REMOVED***;
    NativeFormatter.prototype.getLargestUnit = function () {
        switch (this.severity) {
            case 7:
            case 6:
            case 5:
                return 'year';
            case 4:
                return 'month';
            case 3:
                return 'week';
            default:
                return 'day';
    ***REMOVED***
***REMOVED***;
    return NativeFormatter;
***REMOVED***());
function buildFormattingFunc(standardDateProps, extendedSettings, context) {
    var standardDatePropCnt = Object.keys(standardDateProps).length;
    if (standardDatePropCnt === 1 && standardDateProps.timeZoneName === 'short') {
        return function (date) {
            return formatTimeZoneOffset(date.timeZoneOffset);
    ***REMOVED***;
***REMOVED***
    if (standardDatePropCnt === 0 && extendedSettings.week) {
        return function (date) {
            return formatWeekNumber(context.computeWeekNumber(date.marker), context.weekLabel, context.locale, extendedSettings.week);
    ***REMOVED***;
***REMOVED***
    return buildNativeFormattingFunc(standardDateProps, extendedSettings, context);
***REMOVED***
function buildNativeFormattingFunc(standardDateProps, extendedSettings, context) {
    standardDateProps = __assign({***REMOVED***, standardDateProps); // copy
    extendedSettings = __assign({***REMOVED***, extendedSettings); // copy
    sanitizeSettings(standardDateProps, extendedSettings);
    standardDateProps.timeZone = 'UTC'; // we leverage the only guaranteed timeZone for our UTC markers
    var normalFormat = new Intl.DateTimeFormat(context.locale.codes, standardDateProps);
    var zeroFormat; // needed?
    if (extendedSettings.omitZeroMinute) {
        var zeroProps = __assign({***REMOVED***, standardDateProps);
        delete zeroProps.minute; // seconds and ms were already considered in sanitizeSettings
        zeroFormat = new Intl.DateTimeFormat(context.locale.codes, zeroProps);
***REMOVED***
    return function (date) {
        var marker = date.marker;
        var format;
        if (zeroFormat && !marker.getUTCMinutes()) {
            format = zeroFormat;
    ***REMOVED***
        else {
            format = normalFormat;
    ***REMOVED***
        var s = format.format(marker);
        return postProcess(s, date, standardDateProps, extendedSettings, context);
***REMOVED***;
***REMOVED***
function sanitizeSettings(standardDateProps, extendedSettings) {
    // deal with a browser inconsistency where formatting the timezone
    // requires that the hour/minute be present.
    if (standardDateProps.timeZoneName) {
        if (!standardDateProps.hour) {
            standardDateProps.hour = '2-digit';
    ***REMOVED***
        if (!standardDateProps.minute) {
            standardDateProps.minute = '2-digit';
    ***REMOVED***
***REMOVED***
    // only support short timezone names
    if (standardDateProps.timeZoneName === 'long') {
        standardDateProps.timeZoneName = 'short';
***REMOVED***
    // if requesting to display seconds, MUST display minutes
    if (extendedSettings.omitZeroMinute && (standardDateProps.second || standardDateProps.millisecond)) {
        delete extendedSettings.omitZeroMinute;
***REMOVED***
***REMOVED***
function postProcess(s, date, standardDateProps, extendedSettings, context) {
    s = s.replace(LTR_RE, ''); // remove left-to-right control chars. do first. good for other regexes
    if (standardDateProps.timeZoneName === 'short') {
        s = injectTzoStr(s, (context.timeZone === 'UTC' || date.timeZoneOffset == null) ?
            'UTC' : // important to normalize for IE, which does "GMT"
            formatTimeZoneOffset(date.timeZoneOffset));
***REMOVED***
    if (extendedSettings.omitCommas) {
        s = s.replace(COMMA_RE, '').trim();
***REMOVED***
    if (extendedSettings.omitZeroMinute) {
        s = s.replace(':00', ''); // zeroFormat doesn't always achieve this
***REMOVED***
    // ^ do anything that might create adjacent spaces before this point,
    // because MERIDIEM_RE likes to eat up loading spaces
    if (extendedSettings.meridiem === false) {
        s = s.replace(MERIDIEM_RE, '').trim();
***REMOVED***
    else if (extendedSettings.meridiem === 'narrow') { // a/p
        s = s.replace(MERIDIEM_RE, function (m0, m1) {
            return m1.toLocaleLowerCase();
    ***REMOVED***);
***REMOVED***
    else if (extendedSettings.meridiem === 'short') { // am/pm
        s = s.replace(MERIDIEM_RE, function (m0, m1) {
            return m1.toLocaleLowerCase() + 'm';
    ***REMOVED***);
***REMOVED***
    else if (extendedSettings.meridiem === 'lowercase') { // other meridiem transformers already converted to lowercase
        s = s.replace(MERIDIEM_RE, function (m0) {
            return m0.toLocaleLowerCase();
    ***REMOVED***);
***REMOVED***
    s = s.replace(MULTI_SPACE_RE, ' ');
    s = s.trim();
    return s;
***REMOVED***
function injectTzoStr(s, tzoStr) {
    var replaced = false;
    s = s.replace(UTC_RE, function () {
        replaced = true;
        return tzoStr;
***REMOVED***);
    // IE11 doesn't include UTC/GMT in the original string, so append to end
    if (!replaced) {
        s += ' ' + tzoStr;
***REMOVED***
    return s;
***REMOVED***
function formatWeekNumber(num, weekLabel, locale, display) {
    var parts = [];
    if (display === 'narrow') {
        parts.push(weekLabel);
***REMOVED***
    else if (display === 'short') {
        parts.push(weekLabel, ' ');
***REMOVED***
    // otherwise, considered 'numeric'
    parts.push(locale.simpleNumberFormat.format(num));
    if (locale.options.isRtl) { // TODO: use control characters instead?
        parts.reverse();
***REMOVED***
    return parts.join('');
***REMOVED***
// Range Formatting Utils
// 0 = exactly the same
// 1 = different by time
// and bigger
function computeMarkerDiffSeverity(d0, d1, ca) {
    if (ca.getMarkerYear(d0) !== ca.getMarkerYear(d1)) {
        return 5;
***REMOVED***
    if (ca.getMarkerMonth(d0) !== ca.getMarkerMonth(d1)) {
        return 4;
***REMOVED***
    if (ca.getMarkerDay(d0) !== ca.getMarkerDay(d1)) {
        return 2;
***REMOVED***
    if (timeAsMs(d0) !== timeAsMs(d1)) {
        return 1;
***REMOVED***
    return 0;
***REMOVED***
function computePartialFormattingOptions(options, biggestUnit) {
    var partialOptions = {***REMOVED***;
    for (var name_2 in options) {
        if (!(name_2 in STANDARD_DATE_PROP_SEVERITIES) || // not a date part prop (like timeZone)
            STANDARD_DATE_PROP_SEVERITIES[name_2] <= biggestUnit) {
            partialOptions[name_2] = options[name_2];
    ***REMOVED***
***REMOVED***
    return partialOptions;
***REMOVED***
function findCommonInsertion(full0, partial0, full1, partial1) {
    var i0 = 0;
    while (i0 < full0.length) {
        var found0 = full0.indexOf(partial0, i0);
        if (found0 === -1) {
            break;
    ***REMOVED***
        var before0 = full0.substr(0, found0);
        i0 = found0 + partial0.length;
        var after0 = full0.substr(i0);
        var i1 = 0;
        while (i1 < full1.length) {
            var found1 = full1.indexOf(partial1, i1);
            if (found1 === -1) {
                break;
        ***REMOVED***
            var before1 = full1.substr(0, found1);
            i1 = found1 + partial1.length;
            var after1 = full1.substr(i1);
            if (before0 === before1 && after0 === after1) {
                return {
                    before: before0,
                    after: after0
            ***REMOVED***;
        ***REMOVED***
    ***REMOVED***
***REMOVED***
    return null;
***REMOVED***

/*
TODO: fix the terminology of "formatter" vs "formatting func"
*/
/*
At the time of instantiation, this object does not know which cmd-formatting system it will use.
It receives this at the time of formatting, as a setting.
*/
var CmdFormatter = /** @class */ (function () {
    function CmdFormatter(cmdStr, separator) {
        this.cmdStr = cmdStr;
        this.separator = separator;
***REMOVED***
    CmdFormatter.prototype.format = function (date, context) {
        return context.cmdFormatter(this.cmdStr, createVerboseFormattingArg(date, null, context, this.separator));
***REMOVED***;
    CmdFormatter.prototype.formatRange = function (start, end, context) {
        return context.cmdFormatter(this.cmdStr, createVerboseFormattingArg(start, end, context, this.separator));
***REMOVED***;
    return CmdFormatter;
***REMOVED***());

var FuncFormatter = /** @class */ (function () {
    function FuncFormatter(func) {
        this.func = func;
***REMOVED***
    FuncFormatter.prototype.format = function (date, context) {
        return this.func(createVerboseFormattingArg(date, null, context));
***REMOVED***;
    FuncFormatter.prototype.formatRange = function (start, end, context) {
        return this.func(createVerboseFormattingArg(start, end, context));
***REMOVED***;
    return FuncFormatter;
***REMOVED***());

// Formatter Object Creation
function createFormatter(input, defaultSeparator) {
    if (typeof input === 'object' && input) { // non-null object
        if (typeof defaultSeparator === 'string') {
            input = __assign({ separator: defaultSeparator ***REMOVED***, input);
    ***REMOVED***
        return new NativeFormatter(input);
***REMOVED***
    else if (typeof input === 'string') {
        return new CmdFormatter(input, defaultSeparator);
***REMOVED***
    else if (typeof input === 'function') {
        return new FuncFormatter(input);
***REMOVED***
***REMOVED***
// String Utils
// timeZoneOffset is in minutes
function buildIsoString(marker, timeZoneOffset, stripZeroTime) {
    if (stripZeroTime === void 0) { stripZeroTime = false; ***REMOVED***
    var s = marker.toISOString();
    s = s.replace('.000', '');
    if (stripZeroTime) {
        s = s.replace('T00:00:00Z', '');
***REMOVED***
    if (s.length > 10) { // time part wasn't stripped, can add timezone info
        if (timeZoneOffset == null) {
            s = s.replace('Z', '');
    ***REMOVED***
        else if (timeZoneOffset !== 0) {
            s = s.replace('Z', formatTimeZoneOffset(timeZoneOffset, true));
    ***REMOVED***
***REMOVED*** otherwise, its UTC-0 and we want to keep the Z
***REMOVED***
    return s;
***REMOVED***
function formatIsoTimeString(marker) {
    return padStart(marker.getUTCHours(), 2) + ':' +
        padStart(marker.getUTCMinutes(), 2) + ':' +
        padStart(marker.getUTCSeconds(), 2);
***REMOVED***
function formatTimeZoneOffset(minutes, doIso) {
    if (doIso === void 0) { doIso = false; ***REMOVED***
    var sign = minutes < 0 ? '-' : '+';
    var abs = Math.abs(minutes);
    var hours = Math.floor(abs / 60);
    var mins = Math.round(abs % 60);
    if (doIso) {
        return sign + padStart(hours, 2) + ':' + padStart(mins, 2);
***REMOVED***
    else {
        return 'GMT' + sign + hours + (mins ? ':' + padStart(mins, 2) : '');
***REMOVED***
***REMOVED***
// Arg Utils
function createVerboseFormattingArg(start, end, context, separator) {
    var startInfo = expandZonedMarker(start, context.calendarSystem);
    var endInfo = end ? expandZonedMarker(end, context.calendarSystem) : null;
    return {
        date: startInfo,
        start: startInfo,
        end: endInfo,
        timeZone: context.timeZone,
        localeCodes: context.locale.codes,
        separator: separator
***REMOVED***;
***REMOVED***
function expandZonedMarker(dateInfo, calendarSystem) {
    var a = calendarSystem.markerToArray(dateInfo.marker);
    return {
        marker: dateInfo.marker,
        timeZoneOffset: dateInfo.timeZoneOffset,
        array: a,
        year: a[0],
        month: a[1],
        day: a[2],
        hour: a[3],
        minute: a[4],
        second: a[5],
        millisecond: a[6]
***REMOVED***;
***REMOVED***

var EventSourceApi = /** @class */ (function () {
    function EventSourceApi(calendar, internalEventSource) {
        this.calendar = calendar;
        this.internalEventSource = internalEventSource;
***REMOVED***
    EventSourceApi.prototype.remove = function () {
        this.calendar.dispatch({
            type: 'REMOVE_EVENT_SOURCE',
            sourceId: this.internalEventSource.sourceId
    ***REMOVED***);
***REMOVED***;
    EventSourceApi.prototype.refetch = function () {
        this.calendar.dispatch({
            type: 'FETCH_EVENT_SOURCES',
            sourceIds: [this.internalEventSource.sourceId]
    ***REMOVED***);
***REMOVED***;
    Object.defineProperty(EventSourceApi.prototype, "id", {
        get: function () {
            return this.internalEventSource.publicId;
    ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(EventSourceApi.prototype, "url", {
***REMOVED*** only relevant to json-feed event sources
        get: function () {
            return this.internalEventSource.meta.url;
    ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    return EventSourceApi;
***REMOVED***());

var EventApi = /** @class */ (function () {
    function EventApi(calendar, def, instance) {
        this._calendar = calendar;
        this._def = def;
        this._instance = instance || null;
***REMOVED***
    /*
    TODO: make event struct more responsible for this
    */
    EventApi.prototype.setProp = function (name, val) {
        var _a, _b;
        if (name in DATE_PROPS) ;
        else if (name in NON_DATE_PROPS) {
            if (typeof NON_DATE_PROPS[name] === 'function') {
                val = NON_DATE_PROPS[name](val);
        ***REMOVED***
            this.mutate({
                standardProps: (_a = {***REMOVED***, _a[name] = val, _a)
        ***REMOVED***);
    ***REMOVED***
        else if (name in UNSCOPED_EVENT_UI_PROPS) {
            var ui = void 0;
            if (typeof UNSCOPED_EVENT_UI_PROPS[name] === 'function') {
                val = UNSCOPED_EVENT_UI_PROPS[name](val);
        ***REMOVED***
            if (name === 'color') {
                ui = { backgroundColor: val, borderColor: val ***REMOVED***;
        ***REMOVED***
            else if (name === 'editable') {
                ui = { startEditable: val, durationEditable: val ***REMOVED***;
        ***REMOVED***
            else {
                ui = (_b = {***REMOVED***, _b[name] = val, _b);
        ***REMOVED***
            this.mutate({
                standardProps: { ui: ui ***REMOVED***
        ***REMOVED***);
    ***REMOVED***
***REMOVED***;
    EventApi.prototype.setExtendedProp = function (name, val) {
        var _a;
        this.mutate({
            extendedProps: (_a = {***REMOVED***, _a[name] = val, _a)
    ***REMOVED***);
***REMOVED***;
    EventApi.prototype.setStart = function (startInput, options) {
        if (options === void 0) { options = {***REMOVED***; ***REMOVED***
        var dateEnv = this._calendar.dateEnv;
        var start = dateEnv.createMarker(startInput);
        if (start && this._instance) { // TODO: warning if parsed bad
            var instanceRange = this._instance.range;
            var startDelta = diffDates(instanceRange.start, start, dateEnv, options.granularity); // what if parsed bad!?
            if (options.maintainDuration) {
                this.mutate({ datesDelta: startDelta ***REMOVED***);
        ***REMOVED***
            else {
                this.mutate({ startDelta: startDelta ***REMOVED***);
        ***REMOVED***
    ***REMOVED***
***REMOVED***;
    EventApi.prototype.setEnd = function (endInput, options) {
        if (options === void 0) { options = {***REMOVED***; ***REMOVED***
        var dateEnv = this._calendar.dateEnv;
        var end;
        if (endInput != null) {
            end = dateEnv.createMarker(endInput);
            if (!end) {
                return; // TODO: warning if parsed bad
        ***REMOVED***
    ***REMOVED***
        if (this._instance) {
            if (end) {
                var endDelta = diffDates(this._instance.range.end, end, dateEnv, options.granularity);
                this.mutate({ endDelta: endDelta ***REMOVED***);
        ***REMOVED***
            else {
                this.mutate({ standardProps: { hasEnd: false ***REMOVED*** ***REMOVED***);
        ***REMOVED***
    ***REMOVED***
***REMOVED***;
    EventApi.prototype.setDates = function (startInput, endInput, options) {
        if (options === void 0) { options = {***REMOVED***; ***REMOVED***
        var dateEnv = this._calendar.dateEnv;
        var standardProps = { allDay: options.allDay ***REMOVED***;
        var start = dateEnv.createMarker(startInput);
        var end;
        if (!start) {
            return; // TODO: warning if parsed bad
    ***REMOVED***
        if (endInput != null) {
            end = dateEnv.createMarker(endInput);
            if (!end) { // TODO: warning if parsed bad
                return;
        ***REMOVED***
    ***REMOVED***
        if (this._instance) {
            var instanceRange = this._instance.range;
    ***REMOVED*** when computing the diff for an event being converted to all-day,
    ***REMOVED*** compute diff off of the all-day values the way event-mutation does.
            if (options.allDay === true) {
                instanceRange = computeAlignedDayRange(instanceRange);
        ***REMOVED***
            var startDelta = diffDates(instanceRange.start, start, dateEnv, options.granularity);
            if (end) {
                var endDelta = diffDates(instanceRange.end, end, dateEnv, options.granularity);
                if (durationsEqual(startDelta, endDelta)) {
                    this.mutate({ datesDelta: startDelta, standardProps: standardProps ***REMOVED***);
            ***REMOVED***
                else {
                    this.mutate({ startDelta: startDelta, endDelta: endDelta, standardProps: standardProps ***REMOVED***);
            ***REMOVED***
        ***REMOVED***
            else { // means "clear the end"
                standardProps.hasEnd = false;
                this.mutate({ datesDelta: startDelta, standardProps: standardProps ***REMOVED***);
        ***REMOVED***
    ***REMOVED***
***REMOVED***;
    EventApi.prototype.moveStart = function (deltaInput) {
        var delta = createDuration(deltaInput);
        if (delta) { // TODO: warning if parsed bad
            this.mutate({ startDelta: delta ***REMOVED***);
    ***REMOVED***
***REMOVED***;
    EventApi.prototype.moveEnd = function (deltaInput) {
        var delta = createDuration(deltaInput);
        if (delta) { // TODO: warning if parsed bad
            this.mutate({ endDelta: delta ***REMOVED***);
    ***REMOVED***
***REMOVED***;
    EventApi.prototype.moveDates = function (deltaInput) {
        var delta = createDuration(deltaInput);
        if (delta) { // TODO: warning if parsed bad
            this.mutate({ datesDelta: delta ***REMOVED***);
    ***REMOVED***
***REMOVED***;
    EventApi.prototype.setAllDay = function (allDay, options) {
        if (options === void 0) { options = {***REMOVED***; ***REMOVED***
        var standardProps = { allDay: allDay ***REMOVED***;
        var maintainDuration = options.maintainDuration;
        if (maintainDuration == null) {
            maintainDuration = this._calendar.opt('allDayMaintainDuration');
    ***REMOVED***
        if (this._def.allDay !== allDay) {
            standardProps.hasEnd = maintainDuration;
    ***REMOVED***
        this.mutate({ standardProps: standardProps ***REMOVED***);
***REMOVED***;
    EventApi.prototype.formatRange = function (formatInput) {
        var dateEnv = this._calendar.dateEnv;
        var instance = this._instance;
        var formatter = createFormatter(formatInput, this._calendar.opt('defaultRangeSeparator'));
        if (this._def.hasEnd) {
            return dateEnv.formatRange(instance.range.start, instance.range.end, formatter, {
                forcedStartTzo: instance.forcedStartTzo,
                forcedEndTzo: instance.forcedEndTzo
        ***REMOVED***);
    ***REMOVED***
        else {
            return dateEnv.format(instance.range.start, formatter, {
                forcedTzo: instance.forcedStartTzo
        ***REMOVED***);
    ***REMOVED***
***REMOVED***;
    EventApi.prototype.mutate = function (mutation) {
        var def = this._def;
        var instance = this._instance;
        if (instance) {
            this._calendar.dispatch({
                type: 'MUTATE_EVENTS',
                instanceId: instance.instanceId,
                mutation: mutation,
                fromApi: true
        ***REMOVED***);
            var eventStore = this._calendar.state.eventStore;
            this._def = eventStore.defs[def.defId];
            this._instance = eventStore.instances[instance.instanceId];
    ***REMOVED***
***REMOVED***;
    EventApi.prototype.remove = function () {
        this._calendar.dispatch({
            type: 'REMOVE_EVENT_DEF',
            defId: this._def.defId
    ***REMOVED***);
***REMOVED***;
    Object.defineProperty(EventApi.prototype, "source", {
        get: function () {
            var sourceId = this._def.sourceId;
            if (sourceId) {
                return new EventSourceApi(this._calendar, this._calendar.state.eventSources[sourceId]);
        ***REMOVED***
            return null;
    ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(EventApi.prototype, "start", {
        get: function () {
            return this._instance ?
                this._calendar.dateEnv.toDate(this._instance.range.start) :
                null;
    ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(EventApi.prototype, "end", {
        get: function () {
            return (this._instance && this._def.hasEnd) ?
                this._calendar.dateEnv.toDate(this._instance.range.end) :
                null;
    ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(EventApi.prototype, "id", {
***REMOVED*** computable props that all access the def
***REMOVED*** TODO: find a TypeScript-compatible way to do this at scale
        get: function () { return this._def.publicId; ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(EventApi.prototype, "groupId", {
        get: function () { return this._def.groupId; ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(EventApi.prototype, "allDay", {
        get: function () { return this._def.allDay; ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(EventApi.prototype, "title", {
        get: function () { return this._def.title; ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(EventApi.prototype, "url", {
        get: function () { return this._def.url; ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(EventApi.prototype, "rendering", {
        get: function () { return this._def.rendering; ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(EventApi.prototype, "startEditable", {
        get: function () { return this._def.ui.startEditable; ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(EventApi.prototype, "durationEditable", {
        get: function () { return this._def.ui.durationEditable; ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(EventApi.prototype, "constraint", {
        get: function () { return this._def.ui.constraints[0] || null; ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(EventApi.prototype, "overlap", {
        get: function () { return this._def.ui.overlap; ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(EventApi.prototype, "allow", {
        get: function () { return this._def.ui.allows[0] || null; ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(EventApi.prototype, "backgroundColor", {
        get: function () { return this._def.ui.backgroundColor; ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(EventApi.prototype, "borderColor", {
        get: function () { return this._def.ui.borderColor; ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(EventApi.prototype, "textColor", {
        get: function () { return this._def.ui.textColor; ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(EventApi.prototype, "classNames", {
***REMOVED*** NOTE: user can't modify these because Object.freeze was called in event-def parsing
        get: function () { return this._def.ui.classNames; ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(EventApi.prototype, "extendedProps", {
        get: function () { return this._def.extendedProps; ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    return EventApi;
***REMOVED***());

/*
Specifying nextDayThreshold signals that all-day ranges should be sliced.
*/
function sliceEventStore(eventStore, eventUiBases, framingRange, nextDayThreshold) {
    var inverseBgByGroupId = {***REMOVED***;
    var inverseBgByDefId = {***REMOVED***;
    var defByGroupId = {***REMOVED***;
    var bgRanges = [];
    var fgRanges = [];
    var eventUis = compileEventUis(eventStore.defs, eventUiBases);
    for (var defId in eventStore.defs) {
        var def = eventStore.defs[defId];
        if (def.rendering === 'inverse-background') {
            if (def.groupId) {
                inverseBgByGroupId[def.groupId] = [];
                if (!defByGroupId[def.groupId]) {
                    defByGroupId[def.groupId] = def;
            ***REMOVED***
        ***REMOVED***
            else {
                inverseBgByDefId[defId] = [];
        ***REMOVED***
    ***REMOVED***
***REMOVED***
    for (var instanceId in eventStore.instances) {
        var instance = eventStore.instances[instanceId];
        var def = eventStore.defs[instance.defId];
        var ui = eventUis[def.defId];
        var origRange = instance.range;
        var normalRange = (!def.allDay && nextDayThreshold) ?
            computeVisibleDayRange(origRange, nextDayThreshold) :
            origRange;
        var slicedRange = intersectRanges(normalRange, framingRange);
        if (slicedRange) {
            if (def.rendering === 'inverse-background') {
                if (def.groupId) {
                    inverseBgByGroupId[def.groupId].push(slicedRange);
            ***REMOVED***
                else {
                    inverseBgByDefId[instance.defId].push(slicedRange);
            ***REMOVED***
        ***REMOVED***
            else {
                (def.rendering === 'background' ? bgRanges : fgRanges).push({
                    def: def,
                    ui: ui,
                    instance: instance,
                    range: slicedRange,
                    isStart: normalRange.start && normalRange.start.valueOf() === slicedRange.start.valueOf(),
                    isEnd: normalRange.end && normalRange.end.valueOf() === slicedRange.end.valueOf()
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***
***REMOVED***
    for (var groupId in inverseBgByGroupId) { // BY GROUP
        var ranges = inverseBgByGroupId[groupId];
        var invertedRanges = invertRanges(ranges, framingRange);
        for (var _i = 0, invertedRanges_1 = invertedRanges; _i < invertedRanges_1.length; _i++) {
            var invertedRange = invertedRanges_1[_i];
            var def = defByGroupId[groupId];
            var ui = eventUis[def.defId];
            bgRanges.push({
                def: def,
                ui: ui,
                instance: null,
                range: invertedRange,
                isStart: false,
                isEnd: false
        ***REMOVED***);
    ***REMOVED***
***REMOVED***
    for (var defId in inverseBgByDefId) {
        var ranges = inverseBgByDefId[defId];
        var invertedRanges = invertRanges(ranges, framingRange);
        for (var _a = 0, invertedRanges_2 = invertedRanges; _a < invertedRanges_2.length; _a++) {
            var invertedRange = invertedRanges_2[_a];
            bgRanges.push({
                def: eventStore.defs[defId],
                ui: eventUis[defId],
                instance: null,
                range: invertedRange,
                isStart: false,
                isEnd: false
        ***REMOVED***);
    ***REMOVED***
***REMOVED***
    return { bg: bgRanges, fg: fgRanges ***REMOVED***;
***REMOVED***
function hasBgRendering(def) {
    return def.rendering === 'background' || def.rendering === 'inverse-background';
***REMOVED***
function filterSegsViaEls(view, segs, isMirror) {
    if (view.hasPublicHandlers('eventRender')) {
        segs = segs.filter(function (seg) {
            var custom = view.publiclyTrigger('eventRender', [
                {
                    event: new EventApi(view.calendar, seg.eventRange.def, seg.eventRange.instance),
                    isMirror: isMirror,
                    isStart: seg.isStart,
                    isEnd: seg.isEnd,
            ***REMOVED*** TODO: include seg.range once all components consistently generate it
                    el: seg.el,
                    view: view
            ***REMOVED***
            ]);
            if (custom === false) { // means don't render at all
                return false;
        ***REMOVED***
            else if (custom && custom !== true) {
                seg.el = custom;
        ***REMOVED***
            return true;
    ***REMOVED***);
***REMOVED***
    for (var _i = 0, segs_1 = segs; _i < segs_1.length; _i++) {
        var seg = segs_1[_i];
        setElSeg(seg.el, seg);
***REMOVED***
    return segs;
***REMOVED***
function setElSeg(el, seg) {
    el.fcSeg = seg;
***REMOVED***
function getElSeg(el) {
    return el.fcSeg || null;
***REMOVED***
// event ui computation
function compileEventUis(eventDefs, eventUiBases) {
    return mapHash(eventDefs, function (eventDef) {
        return compileEventUi(eventDef, eventUiBases);
***REMOVED***);
***REMOVED***
function compileEventUi(eventDef, eventUiBases) {
    var uis = [];
    if (eventUiBases['']) {
        uis.push(eventUiBases['']);
***REMOVED***
    if (eventUiBases[eventDef.defId]) {
        uis.push(eventUiBases[eventDef.defId]);
***REMOVED***
    uis.push(eventDef.ui);
    return combineEventUis(uis);
***REMOVED***

// applies the mutation to ALL defs/instances within the event store
function applyMutationToEventStore(eventStore, eventConfigBase, mutation, calendar) {
    var eventConfigs = compileEventUis(eventStore.defs, eventConfigBase);
    var dest = createEmptyEventStore();
    for (var defId in eventStore.defs) {
        var def = eventStore.defs[defId];
        dest.defs[defId] = applyMutationToEventDef(def, eventConfigs[defId], mutation, calendar.pluginSystem.hooks.eventDefMutationAppliers, calendar);
***REMOVED***
    for (var instanceId in eventStore.instances) {
        var instance = eventStore.instances[instanceId];
        var def = dest.defs[instance.defId]; // important to grab the newly modified def
        dest.instances[instanceId] = applyMutationToEventInstance(instance, def, eventConfigs[instance.defId], mutation, calendar);
***REMOVED***
    return dest;
***REMOVED***
function applyMutationToEventDef(eventDef, eventConfig, mutation, appliers, calendar) {
    var standardProps = mutation.standardProps || {***REMOVED***;
    // if hasEnd has not been specified, guess a good value based on deltas.
    // if duration will change, there's no way the default duration will persist,
    // and thus, we need to mark the event as having a real end
    if (standardProps.hasEnd == null &&
        eventConfig.durationEditable &&
        (mutation.startDelta || mutation.endDelta)) {
        standardProps.hasEnd = true; // TODO: is this mutation okay?
***REMOVED***
    var copy = __assign({***REMOVED***, eventDef, standardProps, { ui: __assign({***REMOVED***, eventDef.ui, standardProps.ui) ***REMOVED***);
    if (mutation.extendedProps) {
        copy.extendedProps = __assign({***REMOVED***, copy.extendedProps, mutation.extendedProps);
***REMOVED***
    for (var _i = 0, appliers_1 = appliers; _i < appliers_1.length; _i++) {
        var applier = appliers_1[_i];
        applier(copy, mutation, calendar);
***REMOVED***
    if (!copy.hasEnd && calendar.opt('forceEventDuration')) {
        copy.hasEnd = true;
***REMOVED***
    return copy;
***REMOVED***
function applyMutationToEventInstance(eventInstance, eventDef, // must first be modified by applyMutationToEventDef
eventConfig, mutation, calendar) {
    var dateEnv = calendar.dateEnv;
    var forceAllDay = mutation.standardProps && mutation.standardProps.allDay === true;
    var clearEnd = mutation.standardProps && mutation.standardProps.hasEnd === false;
    var copy = __assign({***REMOVED***, eventInstance);
    if (forceAllDay) {
        copy.range = computeAlignedDayRange(copy.range);
***REMOVED***
    if (mutation.datesDelta && eventConfig.startEditable) {
        copy.range = {
            start: dateEnv.add(copy.range.start, mutation.datesDelta),
            end: dateEnv.add(copy.range.end, mutation.datesDelta)
    ***REMOVED***;
***REMOVED***
    if (mutation.startDelta && eventConfig.durationEditable) {
        copy.range = {
            start: dateEnv.add(copy.range.start, mutation.startDelta),
            end: copy.range.end
    ***REMOVED***;
***REMOVED***
    if (mutation.endDelta && eventConfig.durationEditable) {
        copy.range = {
            start: copy.range.start,
            end: dateEnv.add(copy.range.end, mutation.endDelta)
    ***REMOVED***;
***REMOVED***
    if (clearEnd) {
        copy.range = {
            start: copy.range.start,
            end: calendar.getDefaultEventEnd(eventDef.allDay, copy.range.start)
    ***REMOVED***;
***REMOVED***
    // in case event was all-day but the supplied deltas were not
    // better util for this?
    if (eventDef.allDay) {
        copy.range = {
            start: startOfDay(copy.range.start),
            end: startOfDay(copy.range.end)
    ***REMOVED***;
***REMOVED***
    // handle invalid durations
    if (copy.range.end < copy.range.start) {
        copy.range.end = calendar.getDefaultEventEnd(eventDef.allDay, copy.range.start);
***REMOVED***
    return copy;
***REMOVED***

function reduceEventStore (eventStore, action, eventSources, dateProfile, calendar) {
    switch (action.type) {
        case 'RECEIVE_EVENTS': // raw
            return receiveRawEvents(eventStore, eventSources[action.sourceId], action.fetchId, action.fetchRange, action.rawEvents, calendar);
        case 'ADD_EVENTS': // already parsed, but not expanded
            return addEvent(eventStore, action.eventStore, // new ones
            dateProfile ? dateProfile.activeRange : null, calendar);
        case 'MERGE_EVENTS': // already parsed and expanded
            return mergeEventStores(eventStore, action.eventStore);
        case 'PREV': // TODO: how do we track all actions that affect dateProfile :(
        case 'NEXT':
        case 'SET_DATE':
        case 'SET_VIEW_TYPE':
            if (dateProfile) {
                return expandRecurring(eventStore, dateProfile.activeRange, calendar);
        ***REMOVED***
            else {
                return eventStore;
        ***REMOVED***
        case 'CHANGE_TIMEZONE':
            return rezoneDates(eventStore, action.oldDateEnv, calendar.dateEnv);
        case 'MUTATE_EVENTS':
            return applyMutationToRelated(eventStore, action.instanceId, action.mutation, action.fromApi, calendar);
        case 'REMOVE_EVENT_INSTANCES':
            return excludeInstances(eventStore, action.instances);
        case 'REMOVE_EVENT_DEF':
            return filterEventStoreDefs(eventStore, function (eventDef) {
                return eventDef.defId !== action.defId;
        ***REMOVED***);
        case 'REMOVE_EVENT_SOURCE':
            return excludeEventsBySourceId(eventStore, action.sourceId);
        case 'REMOVE_ALL_EVENT_SOURCES':
            return filterEventStoreDefs(eventStore, function (eventDef) {
                return !eventDef.sourceId; // only keep events with no source id
        ***REMOVED***);
        case 'REMOVE_ALL_EVENTS':
            return createEmptyEventStore();
        case 'RESET_EVENTS':
            return {
                defs: eventStore.defs,
                instances: eventStore.instances
        ***REMOVED***;
        default:
            return eventStore;
***REMOVED***
***REMOVED***
function receiveRawEvents(eventStore, eventSource, fetchId, fetchRange, rawEvents, calendar) {
    if (eventSource && // not already removed
        fetchId === eventSource.latestFetchId // TODO: wish this logic was always in event-sources
    ) {
        var subset = parseEvents(transformRawEvents(rawEvents, eventSource, calendar), eventSource.sourceId, calendar);
        if (fetchRange) {
            subset = expandRecurring(subset, fetchRange, calendar);
    ***REMOVED***
        return mergeEventStores(excludeEventsBySourceId(eventStore, eventSource.sourceId), subset);
***REMOVED***
    return eventStore;
***REMOVED***
function addEvent(eventStore, subset, expandRange, calendar) {
    if (expandRange) {
        subset = expandRecurring(subset, expandRange, calendar);
***REMOVED***
    return mergeEventStores(eventStore, subset);
***REMOVED***
function rezoneDates(eventStore, oldDateEnv, newDateEnv) {
    var defs = eventStore.defs;
    var instances = mapHash(eventStore.instances, function (instance) {
        var def = defs[instance.defId];
        if (def.allDay || def.recurringDef) {
            return instance; // isn't dependent on timezone
    ***REMOVED***
        else {
            return __assign({***REMOVED***, instance, { range: {
                    start: newDateEnv.createMarker(oldDateEnv.toDate(instance.range.start, instance.forcedStartTzo)),
                    end: newDateEnv.createMarker(oldDateEnv.toDate(instance.range.end, instance.forcedEndTzo))
            ***REMOVED***, forcedStartTzo: newDateEnv.canComputeOffset ? null : instance.forcedStartTzo, forcedEndTzo: newDateEnv.canComputeOffset ? null : instance.forcedEndTzo ***REMOVED***);
    ***REMOVED***
***REMOVED***);
    return { defs: defs, instances: instances ***REMOVED***;
***REMOVED***
function applyMutationToRelated(eventStore, instanceId, mutation, fromApi, calendar) {
    var relevant = getRelevantEvents(eventStore, instanceId);
    var eventConfigBase = fromApi ?
        { '': {
                startEditable: true,
                durationEditable: true,
                constraints: [],
                overlap: null,
                allows: [],
                backgroundColor: '',
                borderColor: '',
                textColor: '',
                classNames: []
        ***REMOVED*** ***REMOVED*** :
        calendar.eventUiBases;
    relevant = applyMutationToEventStore(relevant, eventConfigBase, mutation, calendar);
    return mergeEventStores(eventStore, relevant);
***REMOVED***
function excludeEventsBySourceId(eventStore, sourceId) {
    return filterEventStoreDefs(eventStore, function (eventDef) {
        return eventDef.sourceId !== sourceId;
***REMOVED***);
***REMOVED***
// QUESTION: why not just return instances? do a general object-property-exclusion util
function excludeInstances(eventStore, removals) {
    return {
        defs: eventStore.defs,
        instances: filterHash(eventStore.instances, function (instance) {
            return !removals[instance.instanceId];
    ***REMOVED***)
***REMOVED***;
***REMOVED***

// high-level segmenting-aware tester functions
// ------------------------------------------------------------------------------------------------------------------------
function isInteractionValid(interaction, calendar) {
    return isNewPropsValid({ eventDrag: interaction ***REMOVED***, calendar); // HACK: the eventDrag props is used for ALL interactions
***REMOVED***
function isDateSelectionValid(dateSelection, calendar) {
    return isNewPropsValid({ dateSelection: dateSelection ***REMOVED***, calendar);
***REMOVED***
function isNewPropsValid(newProps, calendar) {
    var view = calendar.view;
    var props = __assign({ businessHours: view ? view.props.businessHours : createEmptyEventStore(), dateSelection: '', eventStore: calendar.state.eventStore, eventUiBases: calendar.eventUiBases, eventSelection: '', eventDrag: null, eventResize: null ***REMOVED***, newProps);
    return (calendar.pluginSystem.hooks.isPropsValid || isPropsValid)(props, calendar);
***REMOVED***
function isPropsValid(state, calendar, dateSpanMeta, filterConfig) {
    if (dateSpanMeta === void 0) { dateSpanMeta = {***REMOVED***; ***REMOVED***
    if (state.eventDrag && !isInteractionPropsValid(state, calendar, dateSpanMeta, filterConfig)) {
        return false;
***REMOVED***
    if (state.dateSelection && !isDateSelectionPropsValid(state, calendar, dateSpanMeta, filterConfig)) {
        return false;
***REMOVED***
    return true;
***REMOVED***
// Moving Event Validation
// ------------------------------------------------------------------------------------------------------------------------
function isInteractionPropsValid(state, calendar, dateSpanMeta, filterConfig) {
    var interaction = state.eventDrag; // HACK: the eventDrag props is used for ALL interactions
    var subjectEventStore = interaction.mutatedEvents;
    var subjectDefs = subjectEventStore.defs;
    var subjectInstances = subjectEventStore.instances;
    var subjectConfigs = compileEventUis(subjectDefs, interaction.isEvent ?
        state.eventUiBases :
        { '': calendar.selectionConfig ***REMOVED*** // if not a real event, validate as a selection
    );
    if (filterConfig) {
        subjectConfigs = mapHash(subjectConfigs, filterConfig);
***REMOVED***
    var otherEventStore = excludeInstances(state.eventStore, interaction.affectedEvents.instances); // exclude the subject events. TODO: exclude defs too?
    var otherDefs = otherEventStore.defs;
    var otherInstances = otherEventStore.instances;
    var otherConfigs = compileEventUis(otherDefs, state.eventUiBases);
    for (var subjectInstanceId in subjectInstances) {
        var subjectInstance = subjectInstances[subjectInstanceId];
        var subjectRange = subjectInstance.range;
        var subjectConfig = subjectConfigs[subjectInstance.defId];
        var subjectDef = subjectDefs[subjectInstance.defId];
***REMOVED*** constraint
        if (!allConstraintsPass(subjectConfig.constraints, subjectRange, otherEventStore, state.businessHours, calendar)) {
            return false;
    ***REMOVED***
***REMOVED*** overlap
        var overlapFunc = calendar.opt('eventOverlap');
        if (typeof overlapFunc !== 'function') {
            overlapFunc = null;
    ***REMOVED***
        for (var otherInstanceId in otherInstances) {
            var otherInstance = otherInstances[otherInstanceId];
    ***REMOVED*** intersect! evaluate
            if (rangesIntersect(subjectRange, otherInstance.range)) {
                var otherOverlap = otherConfigs[otherInstance.defId].overlap;
        ***REMOVED*** consider the other event's overlap. only do this if the subject event is a "real" event
                if (otherOverlap === false && interaction.isEvent) {
                    return false;
            ***REMOVED***
                if (subjectConfig.overlap === false) {
                    return false;
            ***REMOVED***
                if (overlapFunc && !overlapFunc(new EventApi(calendar, otherDefs[otherInstance.defId], otherInstance), // still event
                new EventApi(calendar, subjectDef, subjectInstance) // moving event
                )) {
                    return false;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED*** allow (a function)
        var calendarEventStore = calendar.state.eventStore; // need global-to-calendar, not local to component (splittable)state
        for (var _i = 0, _a = subjectConfig.allows; _i < _a.length; _i++) {
            var subjectAllow = _a[_i];
            var subjectDateSpan = __assign({***REMOVED***, dateSpanMeta, { range: subjectInstance.range, allDay: subjectDef.allDay ***REMOVED***);
            var origDef = calendarEventStore.defs[subjectDef.defId];
            var origInstance = calendarEventStore.instances[subjectInstanceId];
            var eventApi = void 0;
            if (origDef) { // was previously in the calendar
                eventApi = new EventApi(calendar, origDef, origInstance);
        ***REMOVED***
            else { // was an external event
                eventApi = new EventApi(calendar, subjectDef); // no instance, because had no dates
        ***REMOVED***
            if (!subjectAllow(calendar.buildDateSpanApi(subjectDateSpan), eventApi)) {
                return false;
        ***REMOVED***
    ***REMOVED***
***REMOVED***
    return true;
***REMOVED***
// Date Selection Validation
// ------------------------------------------------------------------------------------------------------------------------
function isDateSelectionPropsValid(state, calendar, dateSpanMeta, filterConfig) {
    var relevantEventStore = state.eventStore;
    var relevantDefs = relevantEventStore.defs;
    var relevantInstances = relevantEventStore.instances;
    var selection = state.dateSelection;
    var selectionRange = selection.range;
    var selectionConfig = calendar.selectionConfig;
    if (filterConfig) {
        selectionConfig = filterConfig(selectionConfig);
***REMOVED***
    // constraint
    if (!allConstraintsPass(selectionConfig.constraints, selectionRange, relevantEventStore, state.businessHours, calendar)) {
        return false;
***REMOVED***
    // overlap
    var overlapFunc = calendar.opt('selectOverlap');
    if (typeof overlapFunc !== 'function') {
        overlapFunc = null;
***REMOVED***
    for (var relevantInstanceId in relevantInstances) {
        var relevantInstance = relevantInstances[relevantInstanceId];
***REMOVED*** intersect! evaluate
        if (rangesIntersect(selectionRange, relevantInstance.range)) {
            if (selectionConfig.overlap === false) {
                return false;
        ***REMOVED***
            if (overlapFunc && !overlapFunc(new EventApi(calendar, relevantDefs[relevantInstance.defId], relevantInstance))) {
                return false;
        ***REMOVED***
    ***REMOVED***
***REMOVED***
    // allow (a function)
    for (var _i = 0, _a = selectionConfig.allows; _i < _a.length; _i++) {
        var selectionAllow = _a[_i];
        var fullDateSpan = __assign({***REMOVED***, dateSpanMeta, selection);
        if (!selectionAllow(calendar.buildDateSpanApi(fullDateSpan), null)) {
            return false;
    ***REMOVED***
***REMOVED***
    return true;
***REMOVED***
// Constraint Utils
// ------------------------------------------------------------------------------------------------------------------------
function allConstraintsPass(constraints, subjectRange, otherEventStore, businessHoursUnexpanded, calendar) {
    for (var _i = 0, constraints_1 = constraints; _i < constraints_1.length; _i++) {
        var constraint = constraints_1[_i];
        if (!anyRangesContainRange(constraintToRanges(constraint, subjectRange, otherEventStore, businessHoursUnexpanded, calendar), subjectRange)) {
            return false;
    ***REMOVED***
***REMOVED***
    return true;
***REMOVED***
function constraintToRanges(constraint, subjectRange, // for expanding a recurring constraint, or expanding business hours
otherEventStore, // for if constraint is an even group ID
businessHoursUnexpanded, // for if constraint is 'businessHours'
calendar // for expanding businesshours
) {
    if (constraint === 'businessHours') {
        return eventStoreToRanges(expandRecurring(businessHoursUnexpanded, subjectRange, calendar));
***REMOVED***
    else if (typeof constraint === 'string') { // an group ID
        return eventStoreToRanges(filterEventStoreDefs(otherEventStore, function (eventDef) {
            return eventDef.groupId === constraint;
    ***REMOVED***));
***REMOVED***
    else if (typeof constraint === 'object' && constraint) { // non-null object
        return eventStoreToRanges(expandRecurring(constraint, subjectRange, calendar));
***REMOVED***
    return []; // if it's false
***REMOVED***
// TODO: move to event-store file?
function eventStoreToRanges(eventStore) {
    var instances = eventStore.instances;
    var ranges = [];
    for (var instanceId in instances) {
        ranges.push(instances[instanceId].range);
***REMOVED***
    return ranges;
***REMOVED***
// TODO: move to geom file?
function anyRangesContainRange(outerRanges, innerRange) {
    for (var _i = 0, outerRanges_1 = outerRanges; _i < outerRanges_1.length; _i++) {
        var outerRange = outerRanges_1[_i];
        if (rangeContainsRange(outerRange, innerRange)) {
            return true;
    ***REMOVED***
***REMOVED***
    return false;
***REMOVED***
// Parsing
// ------------------------------------------------------------------------------------------------------------------------
function normalizeConstraint(input, calendar) {
    if (Array.isArray(input)) {
        return parseEvents(input, '', calendar, true); // allowOpenRange=true
***REMOVED***
    else if (typeof input === 'object' && input) { // non-null object
        return parseEvents([input], '', calendar, true); // allowOpenRange=true
***REMOVED***
    else if (input != null) {
        return String(input);
***REMOVED***
    else {
        return null;
***REMOVED***
***REMOVED***

function htmlEscape(s) {
    return (s + '').replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&#039;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '<br />');
***REMOVED***
// Given a hash of CSS properties, returns a string of CSS.
// Uses property names as-is (no camel-case conversion). Will not make statements for null/undefined values.
function cssToStr(cssProps) {
    var statements = [];
    for (var name_1 in cssProps) {
        var val = cssProps[name_1];
        if (val != null && val !== '') {
            statements.push(name_1 + ':' + val);
    ***REMOVED***
***REMOVED***
    return statements.join(';');
***REMOVED***
// Given an object hash of HTML attribute names to values,
// generates a string that can be injected between < > in HTML
function attrsToStr(attrs) {
    var parts = [];
    for (var name_2 in attrs) {
        var val = attrs[name_2];
        if (val != null) {
            parts.push(name_2 + '="' + htmlEscape(val) + '"');
    ***REMOVED***
***REMOVED***
    return parts.join(' ');
***REMOVED***
function parseClassName(raw) {
    if (Array.isArray(raw)) {
        return raw;
***REMOVED***
    else if (typeof raw === 'string') {
        return raw.split(/\s+/);
***REMOVED***
    else {
        return [];
***REMOVED***
***REMOVED***

var UNSCOPED_EVENT_UI_PROPS = {
    editable: Boolean,
    startEditable: Boolean,
    durationEditable: Boolean,
    constraint: null,
    overlap: null,
    allow: null,
    className: parseClassName,
    classNames: parseClassName,
    color: String,
    backgroundColor: String,
    borderColor: String,
    textColor: String
***REMOVED***;
function processUnscopedUiProps(rawProps, calendar, leftovers) {
    var props = refineProps(rawProps, UNSCOPED_EVENT_UI_PROPS, {***REMOVED***, leftovers);
    var constraint = normalizeConstraint(props.constraint, calendar);
    return {
        startEditable: props.startEditable != null ? props.startEditable : props.editable,
        durationEditable: props.durationEditable != null ? props.durationEditable : props.editable,
        constraints: constraint != null ? [constraint] : [],
        overlap: props.overlap,
        allows: props.allow != null ? [props.allow] : [],
        backgroundColor: props.backgroundColor || props.color,
        borderColor: props.borderColor || props.color,
        textColor: props.textColor,
        classNames: props.classNames.concat(props.className)
***REMOVED***;
***REMOVED***
function processScopedUiProps(prefix, rawScoped, calendar, leftovers) {
    var rawUnscoped = {***REMOVED***;
    var wasFound = {***REMOVED***;
    for (var key in UNSCOPED_EVENT_UI_PROPS) {
        var scopedKey = prefix + capitaliseFirstLetter(key);
        rawUnscoped[key] = rawScoped[scopedKey];
        wasFound[scopedKey] = true;
***REMOVED***
    if (prefix === 'event') {
        rawUnscoped.editable = rawScoped.editable; // special case. there is no 'eventEditable', just 'editable'
***REMOVED***
    if (leftovers) {
        for (var key in rawScoped) {
            if (!wasFound[key]) {
                leftovers[key] = rawScoped[key];
        ***REMOVED***
    ***REMOVED***
***REMOVED***
    return processUnscopedUiProps(rawUnscoped, calendar);
***REMOVED***
var EMPTY_EVENT_UI = {
    startEditable: null,
    durationEditable: null,
    constraints: [],
    overlap: null,
    allows: [],
    backgroundColor: '',
    borderColor: '',
    textColor: '',
    classNames: []
***REMOVED***;
// prevent against problems with <2 args!
function combineEventUis(uis) {
    return uis.reduce(combineTwoEventUis, EMPTY_EVENT_UI);
***REMOVED***
function combineTwoEventUis(item0, item1) {
    return {
        startEditable: item1.startEditable != null ? item1.startEditable : item0.startEditable,
        durationEditable: item1.durationEditable != null ? item1.durationEditable : item0.durationEditable,
        constraints: item0.constraints.concat(item1.constraints),
        overlap: typeof item1.overlap === 'boolean' ? item1.overlap : item0.overlap,
        allows: item0.allows.concat(item1.allows),
        backgroundColor: item1.backgroundColor || item0.backgroundColor,
        borderColor: item1.borderColor || item0.borderColor,
        textColor: item1.textColor || item0.textColor,
        classNames: item0.classNames.concat(item1.classNames)
***REMOVED***;
***REMOVED***

var NON_DATE_PROPS = {
    id: String,
    groupId: String,
    title: String,
    url: String,
    rendering: String,
    extendedProps: null
***REMOVED***;
var DATE_PROPS = {
    start: null,
    date: null,
    end: null,
    allDay: null
***REMOVED***;
var uid = 0;
function parseEvent(raw, sourceId, calendar, allowOpenRange) {
    var allDayDefault = computeIsAllDayDefault(sourceId, calendar);
    var leftovers0 = {***REMOVED***;
    var recurringRes = parseRecurring(raw, // raw, but with single-event stuff stripped out
    allDayDefault, calendar.dateEnv, calendar.pluginSystem.hooks.recurringTypes, leftovers0 // will populate with non-recurring props
    );
    if (recurringRes) {
        var def = parseEventDef(leftovers0, sourceId, recurringRes.allDay, Boolean(recurringRes.duration), calendar);
        def.recurringDef = {
            typeId: recurringRes.typeId,
            typeData: recurringRes.typeData,
            duration: recurringRes.duration
    ***REMOVED***;
        return { def: def, instance: null ***REMOVED***;
***REMOVED***
    else {
        var leftovers1 = {***REMOVED***;
        var singleRes = parseSingle(raw, allDayDefault, calendar, leftovers1, allowOpenRange);
        if (singleRes) {
            var def = parseEventDef(leftovers1, sourceId, singleRes.allDay, singleRes.hasEnd, calendar);
            var instance = createEventInstance(def.defId, singleRes.range, singleRes.forcedStartTzo, singleRes.forcedEndTzo);
            return { def: def, instance: instance ***REMOVED***;
    ***REMOVED***
***REMOVED***
    return null;
***REMOVED***
/*
Will NOT populate extendedProps with the leftover properties.
Will NOT populate date-related props.
The EventNonDateInput has been normalized (id => publicId, etc).
*/
function parseEventDef(raw, sourceId, allDay, hasEnd, calendar) {
    var leftovers = {***REMOVED***;
    var def = pluckNonDateProps(raw, calendar, leftovers);
    def.defId = String(uid++);
    def.sourceId = sourceId;
    def.allDay = allDay;
    def.hasEnd = hasEnd;
    for (var _i = 0, _a = calendar.pluginSystem.hooks.eventDefParsers; _i < _a.length; _i++) {
        var eventDefParser = _a[_i];
        var newLeftovers = {***REMOVED***;
        eventDefParser(def, leftovers, newLeftovers);
        leftovers = newLeftovers;
***REMOVED***
    def.extendedProps = __assign(leftovers, def.extendedProps || {***REMOVED***);
    // help out EventApi from having user modify props
    Object.freeze(def.ui.classNames);
    Object.freeze(def.extendedProps);
    return def;
***REMOVED***
function createEventInstance(defId, range, forcedStartTzo, forcedEndTzo) {
    return {
        instanceId: String(uid++),
        defId: defId,
        range: range,
        forcedStartTzo: forcedStartTzo == null ? null : forcedStartTzo,
        forcedEndTzo: forcedEndTzo == null ? null : forcedEndTzo
***REMOVED***;
***REMOVED***
function parseSingle(raw, allDayDefault, calendar, leftovers, allowOpenRange) {
    var props = pluckDateProps(raw, leftovers);
    var allDay = props.allDay;
    var startMeta;
    var startMarker = null;
    var hasEnd = false;
    var endMeta;
    var endMarker = null;
    startMeta = calendar.dateEnv.createMarkerMeta(props.start);
    if (startMeta) {
        startMarker = startMeta.marker;
***REMOVED***
    else if (!allowOpenRange) {
        return null;
***REMOVED***
    if (props.end != null) {
        endMeta = calendar.dateEnv.createMarkerMeta(props.end);
***REMOVED***
    if (allDay == null) {
        if (allDayDefault != null) {
            allDay = allDayDefault;
    ***REMOVED***
        else {
    ***REMOVED*** fall back to the date props LAST
            allDay = (!startMeta || startMeta.isTimeUnspecified) &&
                (!endMeta || endMeta.isTimeUnspecified);
    ***REMOVED***
***REMOVED***
    if (allDay && startMarker) {
        startMarker = startOfDay(startMarker);
***REMOVED***
    if (endMeta) {
        endMarker = endMeta.marker;
        if (allDay) {
            endMarker = startOfDay(endMarker);
    ***REMOVED***
        if (startMarker && endMarker <= startMarker) {
            endMarker = null;
    ***REMOVED***
***REMOVED***
    if (endMarker) {
        hasEnd = true;
***REMOVED***
    else if (!allowOpenRange) {
        hasEnd = calendar.opt('forceEventDuration') || false;
        endMarker = calendar.dateEnv.add(startMarker, allDay ?
            calendar.defaultAllDayEventDuration :
            calendar.defaultTimedEventDuration);
***REMOVED***
    return {
        allDay: allDay,
        hasEnd: hasEnd,
        range: { start: startMarker, end: endMarker ***REMOVED***,
        forcedStartTzo: startMeta ? startMeta.forcedTzo : null,
        forcedEndTzo: endMeta ? endMeta.forcedTzo : null
***REMOVED***;
***REMOVED***
function pluckDateProps(raw, leftovers) {
    var props = refineProps(raw, DATE_PROPS, {***REMOVED***, leftovers);
    props.start = (props.start !== null) ? props.start : props.date;
    delete props.date;
    return props;
***REMOVED***
function pluckNonDateProps(raw, calendar, leftovers) {
    var preLeftovers = {***REMOVED***;
    var props = refineProps(raw, NON_DATE_PROPS, {***REMOVED***, preLeftovers);
    var ui = processUnscopedUiProps(preLeftovers, calendar, leftovers);
    props.publicId = props.id;
    delete props.id;
    props.ui = ui;
    return props;
***REMOVED***
function computeIsAllDayDefault(sourceId, calendar) {
    var res = null;
    if (sourceId) {
        var source = calendar.state.eventSources[sourceId];
        res = source.allDayDefault;
***REMOVED***
    if (res == null) {
        res = calendar.opt('allDayDefault');
***REMOVED***
    return res;
***REMOVED***

var DEF_DEFAULTS = {
    startTime: '09:00',
    endTime: '17:00',
    daysOfWeek: [1, 2, 3, 4, 5],
    rendering: 'inverse-background',
    classNames: 'fc-nonbusiness',
    groupId: '_businessHours' // so multiple defs get grouped
***REMOVED***;
/*
TODO: pass around as EventDefHash!!!
*/
function parseBusinessHours(input, calendar) {
    return parseEvents(refineInputs(input), '', calendar);
***REMOVED***
function refineInputs(input) {
    var rawDefs;
    if (input === true) {
        rawDefs = [{***REMOVED***]; // will get DEF_DEFAULTS verbatim
***REMOVED***
    else if (Array.isArray(input)) {
***REMOVED*** if specifying an array, every sub-definition NEEDS a day-of-week
        rawDefs = input.filter(function (rawDef) {
            return rawDef.daysOfWeek;
    ***REMOVED***);
***REMOVED***
    else if (typeof input === 'object' && input) { // non-null object
        rawDefs = [input];
***REMOVED***
    else { // is probably false
        rawDefs = [];
***REMOVED***
    rawDefs = rawDefs.map(function (rawDef) {
        return __assign({***REMOVED***, DEF_DEFAULTS, rawDef);
***REMOVED***);
    return rawDefs;
***REMOVED***

function memoizeRendering(renderFunc, unrenderFunc, dependencies) {
    if (dependencies === void 0) { dependencies = []; ***REMOVED***
    var dependents = [];
    var thisContext;
    var prevArgs;
    function unrender() {
        if (prevArgs) {
            for (var _i = 0, dependents_1 = dependents; _i < dependents_1.length; _i++) {
                var dependent = dependents_1[_i];
                dependent.unrender();
        ***REMOVED***
            if (unrenderFunc) {
                unrenderFunc.apply(thisContext, prevArgs);
        ***REMOVED***
            prevArgs = null;
    ***REMOVED***
***REMOVED***
    function res() {
        if (!prevArgs || !isArraysEqual(prevArgs, arguments)) {
            unrender();
            thisContext = this;
            prevArgs = arguments;
            renderFunc.apply(this, arguments);
    ***REMOVED***
***REMOVED***
    res.dependents = dependents;
    res.unrender = unrender;
    for (var _i = 0, dependencies_1 = dependencies; _i < dependencies_1.length; _i++) {
        var dependency = dependencies_1[_i];
        dependency.dependents.push(res);
***REMOVED***
    return res;
***REMOVED***

var EMPTY_EVENT_STORE = createEmptyEventStore(); // for purecomponents. TODO: keep elsewhere
var Splitter = /** @class */ (function () {
    function Splitter() {
        this.getKeysForEventDefs = memoize(this._getKeysForEventDefs);
        this.splitDateSelection = memoize(this._splitDateSpan);
        this.splitEventStore = memoize(this._splitEventStore);
        this.splitIndividualUi = memoize(this._splitIndividualUi);
        this.splitEventDrag = memoize(this._splitInteraction);
        this.splitEventResize = memoize(this._splitInteraction);
        this.eventUiBuilders = {***REMOVED***; // TODO: typescript protection
***REMOVED***
    Splitter.prototype.splitProps = function (props) {
        var _this = this;
        var keyInfos = this.getKeyInfo(props);
        var defKeys = this.getKeysForEventDefs(props.eventStore);
        var dateSelections = this.splitDateSelection(props.dateSelection);
        var individualUi = this.splitIndividualUi(props.eventUiBases, defKeys); // the individual *bases*
        var eventStores = this.splitEventStore(props.eventStore, defKeys);
        var eventDrags = this.splitEventDrag(props.eventDrag);
        var eventResizes = this.splitEventResize(props.eventResize);
        var splitProps = {***REMOVED***;
        this.eventUiBuilders = mapHash(keyInfos, function (info, key) {
            return _this.eventUiBuilders[key] || memoize(buildEventUiForKey);
    ***REMOVED***);
        for (var key in keyInfos) {
            var keyInfo = keyInfos[key];
            var eventStore = eventStores[key] || EMPTY_EVENT_STORE;
            var buildEventUi = this.eventUiBuilders[key];
            splitProps[key] = {
                businessHours: keyInfo.businessHours || props.businessHours,
                dateSelection: dateSelections[key] || null,
                eventStore: eventStore,
                eventUiBases: buildEventUi(props.eventUiBases[''], keyInfo.ui, individualUi[key]),
                eventSelection: eventStore.instances[props.eventSelection] ? props.eventSelection : '',
                eventDrag: eventDrags[key] || null,
                eventResize: eventResizes[key] || null
        ***REMOVED***;
    ***REMOVED***
        return splitProps;
***REMOVED***;
    Splitter.prototype._splitDateSpan = function (dateSpan) {
        var dateSpans = {***REMOVED***;
        if (dateSpan) {
            var keys = this.getKeysForDateSpan(dateSpan);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                dateSpans[key] = dateSpan;
        ***REMOVED***
    ***REMOVED***
        return dateSpans;
***REMOVED***;
    Splitter.prototype._getKeysForEventDefs = function (eventStore) {
        var _this = this;
        return mapHash(eventStore.defs, function (eventDef) {
            return _this.getKeysForEventDef(eventDef);
    ***REMOVED***);
***REMOVED***;
    Splitter.prototype._splitEventStore = function (eventStore, defKeys) {
        var defs = eventStore.defs, instances = eventStore.instances;
        var splitStores = {***REMOVED***;
        for (var defId in defs) {
            for (var _i = 0, _a = defKeys[defId]; _i < _a.length; _i++) {
                var key = _a[_i];
                if (!splitStores[key]) {
                    splitStores[key] = createEmptyEventStore();
            ***REMOVED***
                splitStores[key].defs[defId] = defs[defId];
        ***REMOVED***
    ***REMOVED***
        for (var instanceId in instances) {
            var instance = instances[instanceId];
            for (var _b = 0, _c = defKeys[instance.defId]; _b < _c.length; _b++) {
                var key = _c[_b];
                if (splitStores[key]) { // must have already been created
                    splitStores[key].instances[instanceId] = instance;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
        return splitStores;
***REMOVED***;
    Splitter.prototype._splitIndividualUi = function (eventUiBases, defKeys) {
        var splitHashes = {***REMOVED***;
        for (var defId in eventUiBases) {
            if (defId) { // not the '' key
                for (var _i = 0, _a = defKeys[defId]; _i < _a.length; _i++) {
                    var key = _a[_i];
                    if (!splitHashes[key]) {
                        splitHashes[key] = {***REMOVED***;
                ***REMOVED***
                    splitHashes[key][defId] = eventUiBases[defId];
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
        return splitHashes;
***REMOVED***;
    Splitter.prototype._splitInteraction = function (interaction) {
        var splitStates = {***REMOVED***;
        if (interaction) {
            var affectedStores_1 = this._splitEventStore(interaction.affectedEvents, this._getKeysForEventDefs(interaction.affectedEvents) // can't use cached. might be events from other calendar
            );
    ***REMOVED*** can't rely on defKeys because event data is mutated
            var mutatedKeysByDefId = this._getKeysForEventDefs(interaction.mutatedEvents);
            var mutatedStores_1 = this._splitEventStore(interaction.mutatedEvents, mutatedKeysByDefId);
            var populate = function (key) {
                if (!splitStates[key]) {
                    splitStates[key] = {
                        affectedEvents: affectedStores_1[key] || EMPTY_EVENT_STORE,
                        mutatedEvents: mutatedStores_1[key] || EMPTY_EVENT_STORE,
                        isEvent: interaction.isEvent,
                        origSeg: interaction.origSeg
                ***REMOVED***;
            ***REMOVED***
        ***REMOVED***;
            for (var key in affectedStores_1) {
                populate(key);
        ***REMOVED***
            for (var key in mutatedStores_1) {
                populate(key);
        ***REMOVED***
    ***REMOVED***
        return splitStates;
***REMOVED***;
    return Splitter;
***REMOVED***());
function buildEventUiForKey(allUi, eventUiForKey, individualUi) {
    var baseParts = [];
    if (allUi) {
        baseParts.push(allUi);
***REMOVED***
    if (eventUiForKey) {
        baseParts.push(eventUiForKey);
***REMOVED***
    var stuff = {
        '': combineEventUis(baseParts)
***REMOVED***;
    if (individualUi) {
        __assign(stuff, individualUi);
***REMOVED***
    return stuff;
***REMOVED***

// Generates HTML for an anchor to another view into the calendar.
// Will either generate an <a> tag or a non-clickable <span> tag, depending on enabled settings.
// `gotoOptions` can either be a DateMarker, or an object with the form:
// { date, type, forceOff ***REMOVED***
// `type` is a view-type like "day" or "week". default value is "day".
// `attrs` and `innerHtml` are use to generate the rest of the HTML tag.
function buildGotoAnchorHtml(component, gotoOptions, attrs, innerHtml) {
    var dateEnv = component.dateEnv;
    var date;
    var type;
    var forceOff;
    var finalOptions;
    if (gotoOptions instanceof Date) {
        date = gotoOptions; // a single date-like input
***REMOVED***
    else {
        date = gotoOptions.date;
        type = gotoOptions.type;
        forceOff = gotoOptions.forceOff;
***REMOVED***
    finalOptions = {
        date: dateEnv.formatIso(date, { omitTime: true ***REMOVED***),
        type: type || 'day'
***REMOVED***;
    if (typeof attrs === 'string') {
        innerHtml = attrs;
        attrs = null;
***REMOVED***
    attrs = attrs ? ' ' + attrsToStr(attrs) : ''; // will have a leading space
    innerHtml = innerHtml || '';
    if (!forceOff && component.opt('navLinks')) {
        return '<a' + attrs +
            ' data-goto="' + htmlEscape(JSON.stringify(finalOptions)) + '">' +
            innerHtml +
            '</a>';
***REMOVED***
    else {
        return '<span' + attrs + '>' +
            innerHtml +
            '</span>';
***REMOVED***
***REMOVED***
function getAllDayHtml(component) {
    return component.opt('allDayHtml') || htmlEscape(component.opt('allDayText'));
***REMOVED***
// Computes HTML classNames for a single-day element
function getDayClasses(date, dateProfile, context, noThemeHighlight) {
    var calendar = context.calendar, view = context.view, theme = context.theme, dateEnv = context.dateEnv;
    var classes = [];
    var todayStart;
    var todayEnd;
    if (!rangeContainsMarker(dateProfile.activeRange, date)) {
        classes.push('fc-disabled-day');
***REMOVED***
    else {
        classes.push('fc-' + DAY_IDS[date.getUTCDay()]);
        if (view.opt('monthMode') &&
            dateEnv.getMonth(date) !== dateEnv.getMonth(dateProfile.currentRange.start)) {
            classes.push('fc-other-month');
    ***REMOVED***
        todayStart = startOfDay(calendar.getNow());
        todayEnd = addDays(todayStart, 1);
        if (date < todayStart) {
            classes.push('fc-past');
    ***REMOVED***
        else if (date >= todayEnd) {
            classes.push('fc-future');
    ***REMOVED***
        else {
            classes.push('fc-today');
            if (noThemeHighlight !== true) {
                classes.push(theme.getClass('today'));
        ***REMOVED***
    ***REMOVED***
***REMOVED***
    return classes;
***REMOVED***

// given a function that resolves a result asynchronously.
// the function can either call passed-in success and failure callbacks,
// or it can return a promise.
// if you need to pass additional params to func, bind them first.
function unpromisify(func, success, failure) {
    // guard against success/failure callbacks being called more than once
    // and guard against a promise AND callback being used together.
    var isResolved = false;
    var wrappedSuccess = function () {
        if (!isResolved) {
            isResolved = true;
            success.apply(this, arguments);
    ***REMOVED***
***REMOVED***;
    var wrappedFailure = function () {
        if (!isResolved) {
            isResolved = true;
            if (failure) {
                failure.apply(this, arguments);
        ***REMOVED***
    ***REMOVED***
***REMOVED***;
    var res = func(wrappedSuccess, wrappedFailure);
    if (res && typeof res.then === 'function') {
        res.then(wrappedSuccess, wrappedFailure);
***REMOVED***
***REMOVED***

var Mixin = /** @class */ (function () {
    function Mixin() {
***REMOVED***
    // mix into a CLASS
    Mixin.mixInto = function (destClass) {
        this.mixIntoObj(destClass.prototype);
***REMOVED***;
    // mix into ANY object
    Mixin.mixIntoObj = function (destObj) {
        var _this = this;
        Object.getOwnPropertyNames(this.prototype).forEach(function (name) {
            if (!destObj[name]) { // if destination doesn't already define it
                destObj[name] = _this.prototype[name];
        ***REMOVED***
    ***REMOVED***);
***REMOVED***;
    /*
    will override existing methods
    TODO: remove! not used anymore
    */
    Mixin.mixOver = function (destClass) {
        var _this = this;
        Object.getOwnPropertyNames(this.prototype).forEach(function (name) {
            destClass.prototype[name] = _this.prototype[name];
    ***REMOVED***);
***REMOVED***;
    return Mixin;
***REMOVED***());

/*
USAGE:
  import { default as EmitterMixin, EmitterInterface ***REMOVED*** from './EmitterMixin'
in class:
  on: EmitterInterface['on']
  one: EmitterInterface['one']
  off: EmitterInterface['off']
  trigger: EmitterInterface['trigger']
  triggerWith: EmitterInterface['triggerWith']
  hasHandlers: EmitterInterface['hasHandlers']
after class:
  EmitterMixin.mixInto(TheClass)
*/
var EmitterMixin = /** @class */ (function (_super) {
    __extends(EmitterMixin, _super);
    function EmitterMixin() {
        return _super !== null && _super.apply(this, arguments) || this;
***REMOVED***
    EmitterMixin.prototype.on = function (type, handler) {
        addToHash(this._handlers || (this._handlers = {***REMOVED***), type, handler);
        return this; // for chaining
***REMOVED***;
    // todo: add comments
    EmitterMixin.prototype.one = function (type, handler) {
        addToHash(this._oneHandlers || (this._oneHandlers = {***REMOVED***), type, handler);
        return this; // for chaining
***REMOVED***;
    EmitterMixin.prototype.off = function (type, handler) {
        if (this._handlers) {
            removeFromHash(this._handlers, type, handler);
    ***REMOVED***
        if (this._oneHandlers) {
            removeFromHash(this._oneHandlers, type, handler);
    ***REMOVED***
        return this; // for chaining
***REMOVED***;
    EmitterMixin.prototype.trigger = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
    ***REMOVED***
        this.triggerWith(type, this, args);
        return this; // for chaining
***REMOVED***;
    EmitterMixin.prototype.triggerWith = function (type, context, args) {
        if (this._handlers) {
            applyAll(this._handlers[type], context, args);
    ***REMOVED***
        if (this._oneHandlers) {
            applyAll(this._oneHandlers[type], context, args);
            delete this._oneHandlers[type]; // will never fire again
    ***REMOVED***
        return this; // for chaining
***REMOVED***;
    EmitterMixin.prototype.hasHandlers = function (type) {
        return (this._handlers && this._handlers[type] && this._handlers[type].length) ||
            (this._oneHandlers && this._oneHandlers[type] && this._oneHandlers[type].length);
***REMOVED***;
    return EmitterMixin;
***REMOVED***(Mixin));
function addToHash(hash, type, handler) {
    (hash[type] || (hash[type] = []))
        .push(handler);
***REMOVED***
function removeFromHash(hash, type, handler) {
    if (handler) {
        if (hash[type]) {
            hash[type] = hash[type].filter(function (func) {
                return func !== handler;
        ***REMOVED***);
    ***REMOVED***
***REMOVED***
    else {
        delete hash[type]; // remove all handler funcs for this type
***REMOVED***
***REMOVED***

/*
Records offset information for a set of elements, relative to an origin element.
Can record the left/right OR the top/bottom OR both.
Provides methods for querying the cache by position.
*/
var PositionCache = /** @class */ (function () {
    function PositionCache(originEl, els, isHorizontal, isVertical) {
        this.originEl = originEl;
        this.els = els;
        this.isHorizontal = isHorizontal;
        this.isVertical = isVertical;
***REMOVED***
    // Queries the els for coordinates and stores them.
    // Call this method before using and of the get* methods below.
    PositionCache.prototype.build = function () {
        var originEl = this.originEl;
        var originClientRect = this.originClientRect =
            originEl.getBoundingClientRect(); // relative to viewport top-left
        if (this.isHorizontal) {
            this.buildElHorizontals(originClientRect.left);
    ***REMOVED***
        if (this.isVertical) {
            this.buildElVerticals(originClientRect.top);
    ***REMOVED***
***REMOVED***;
    // Populates the left/right internal coordinate arrays
    PositionCache.prototype.buildElHorizontals = function (originClientLeft) {
        var lefts = [];
        var rights = [];
        for (var _i = 0, _a = this.els; _i < _a.length; _i++) {
            var el = _a[_i];
            var rect = el.getBoundingClientRect();
            lefts.push(rect.left - originClientLeft);
            rights.push(rect.right - originClientLeft);
    ***REMOVED***
        this.lefts = lefts;
        this.rights = rights;
***REMOVED***;
    // Populates the top/bottom internal coordinate arrays
    PositionCache.prototype.buildElVerticals = function (originClientTop) {
        var tops = [];
        var bottoms = [];
        for (var _i = 0, _a = this.els; _i < _a.length; _i++) {
            var el = _a[_i];
            var rect = el.getBoundingClientRect();
            tops.push(rect.top - originClientTop);
            bottoms.push(rect.bottom - originClientTop);
    ***REMOVED***
        this.tops = tops;
        this.bottoms = bottoms;
***REMOVED***;
    // Given a left offset (from document left), returns the index of the el that it horizontally intersects.
    // If no intersection is made, returns undefined.
    PositionCache.prototype.leftToIndex = function (leftPosition) {
        var lefts = this.lefts;
        var rights = this.rights;
        var len = lefts.length;
        var i;
        for (i = 0; i < len; i++) {
            if (leftPosition >= lefts[i] && leftPosition < rights[i]) {
                return i;
        ***REMOVED***
    ***REMOVED***
***REMOVED***;
    // Given a top offset (from document top), returns the index of the el that it vertically intersects.
    // If no intersection is made, returns undefined.
    PositionCache.prototype.topToIndex = function (topPosition) {
        var tops = this.tops;
        var bottoms = this.bottoms;
        var len = tops.length;
        var i;
        for (i = 0; i < len; i++) {
            if (topPosition >= tops[i] && topPosition < bottoms[i]) {
                return i;
        ***REMOVED***
    ***REMOVED***
***REMOVED***;
    // Gets the width of the element at the given index
    PositionCache.prototype.getWidth = function (leftIndex) {
        return this.rights[leftIndex] - this.lefts[leftIndex];
***REMOVED***;
    // Gets the height of the element at the given index
    PositionCache.prototype.getHeight = function (topIndex) {
        return this.bottoms[topIndex] - this.tops[topIndex];
***REMOVED***;
    return PositionCache;
***REMOVED***());

/*
An object for getting/setting scroll-related information for an element.
Internally, this is done very differently for window versus DOM element,
so this object serves as a common interface.
*/
var ScrollController = /** @class */ (function () {
    function ScrollController() {
***REMOVED***
    ScrollController.prototype.getMaxScrollTop = function () {
        return this.getScrollHeight() - this.getClientHeight();
***REMOVED***;
    ScrollController.prototype.getMaxScrollLeft = function () {
        return this.getScrollWidth() - this.getClientWidth();
***REMOVED***;
    ScrollController.prototype.canScrollVertically = function () {
        return this.getMaxScrollTop() > 0;
***REMOVED***;
    ScrollController.prototype.canScrollHorizontally = function () {
        return this.getMaxScrollLeft() > 0;
***REMOVED***;
    ScrollController.prototype.canScrollUp = function () {
        return this.getScrollTop() > 0;
***REMOVED***;
    ScrollController.prototype.canScrollDown = function () {
        return this.getScrollTop() < this.getMaxScrollTop();
***REMOVED***;
    ScrollController.prototype.canScrollLeft = function () {
        return this.getScrollLeft() > 0;
***REMOVED***;
    ScrollController.prototype.canScrollRight = function () {
        return this.getScrollLeft() < this.getMaxScrollLeft();
***REMOVED***;
    return ScrollController;
***REMOVED***());
var ElementScrollController = /** @class */ (function (_super) {
    __extends(ElementScrollController, _super);
    function ElementScrollController(el) {
        var _this = _super.call(this) || this;
        _this.el = el;
        return _this;
***REMOVED***
    ElementScrollController.prototype.getScrollTop = function () {
        return this.el.scrollTop;
***REMOVED***;
    ElementScrollController.prototype.getScrollLeft = function () {
        return this.el.scrollLeft;
***REMOVED***;
    ElementScrollController.prototype.setScrollTop = function (top) {
        this.el.scrollTop = top;
***REMOVED***;
    ElementScrollController.prototype.setScrollLeft = function (left) {
        this.el.scrollLeft = left;
***REMOVED***;
    ElementScrollController.prototype.getScrollWidth = function () {
        return this.el.scrollWidth;
***REMOVED***;
    ElementScrollController.prototype.getScrollHeight = function () {
        return this.el.scrollHeight;
***REMOVED***;
    ElementScrollController.prototype.getClientHeight = function () {
        return this.el.clientHeight;
***REMOVED***;
    ElementScrollController.prototype.getClientWidth = function () {
        return this.el.clientWidth;
***REMOVED***;
    return ElementScrollController;
***REMOVED***(ScrollController));
var WindowScrollController = /** @class */ (function (_super) {
    __extends(WindowScrollController, _super);
    function WindowScrollController() {
        return _super !== null && _super.apply(this, arguments) || this;
***REMOVED***
    WindowScrollController.prototype.getScrollTop = function () {
        return window.pageYOffset;
***REMOVED***;
    WindowScrollController.prototype.getScrollLeft = function () {
        return window.pageXOffset;
***REMOVED***;
    WindowScrollController.prototype.setScrollTop = function (n) {
        window.scroll(window.pageXOffset, n);
***REMOVED***;
    WindowScrollController.prototype.setScrollLeft = function (n) {
        window.scroll(n, window.pageYOffset);
***REMOVED***;
    WindowScrollController.prototype.getScrollWidth = function () {
        return document.documentElement.scrollWidth;
***REMOVED***;
    WindowScrollController.prototype.getScrollHeight = function () {
        return document.documentElement.scrollHeight;
***REMOVED***;
    WindowScrollController.prototype.getClientHeight = function () {
        return document.documentElement.clientHeight;
***REMOVED***;
    WindowScrollController.prototype.getClientWidth = function () {
        return document.documentElement.clientWidth;
***REMOVED***;
    return WindowScrollController;
***REMOVED***(ScrollController));

/*
Embodies a div that has potential scrollbars
*/
var ScrollComponent = /** @class */ (function (_super) {
    __extends(ScrollComponent, _super);
    function ScrollComponent(overflowX, overflowY) {
        var _this = _super.call(this, createElement('div', {
            className: 'fc-scroller'
    ***REMOVED***)) || this;
        _this.overflowX = overflowX;
        _this.overflowY = overflowY;
        _this.applyOverflow();
        return _this;
***REMOVED***
    // sets to natural height, unlocks overflow
    ScrollComponent.prototype.clear = function () {
        this.setHeight('auto');
        this.applyOverflow();
***REMOVED***;
    ScrollComponent.prototype.destroy = function () {
        removeElement(this.el);
***REMOVED***;
    // Overflow
    // -----------------------------------------------------------------------------------------------------------------
    ScrollComponent.prototype.applyOverflow = function () {
        applyStyle(this.el, {
            overflowX: this.overflowX,
            overflowY: this.overflowY
    ***REMOVED***);
***REMOVED***;
    // Causes any 'auto' overflow values to resolves to 'scroll' or 'hidden'.
    // Useful for preserving scrollbar widths regardless of future resizes.
    // Can pass in scrollbarWidths for optimization.
    ScrollComponent.prototype.lockOverflow = function (scrollbarWidths) {
        var overflowX = this.overflowX;
        var overflowY = this.overflowY;
        scrollbarWidths = scrollbarWidths || this.getScrollbarWidths();
        if (overflowX === 'auto') {
            overflowX = (scrollbarWidths.bottom || // horizontal scrollbars?
                this.canScrollHorizontally() // OR scrolling pane with massless scrollbars?
            ) ? 'scroll' : 'hidden';
    ***REMOVED***
        if (overflowY === 'auto') {
            overflowY = (scrollbarWidths.left || scrollbarWidths.right || // horizontal scrollbars?
                this.canScrollVertically() // OR scrolling pane with massless scrollbars?
            ) ? 'scroll' : 'hidden';
    ***REMOVED***
        applyStyle(this.el, { overflowX: overflowX, overflowY: overflowY ***REMOVED***);
***REMOVED***;
    ScrollComponent.prototype.setHeight = function (height) {
        applyStyleProp(this.el, 'height', height);
***REMOVED***;
    ScrollComponent.prototype.getScrollbarWidths = function () {
        var edges = computeEdges(this.el);
        return {
            left: edges.scrollbarLeft,
            right: edges.scrollbarRight,
            bottom: edges.scrollbarBottom
    ***REMOVED***;
***REMOVED***;
    return ScrollComponent;
***REMOVED***(ElementScrollController));

var Theme = /** @class */ (function () {
    function Theme(calendarOptions) {
        this.calendarOptions = calendarOptions;
        this.processIconOverride();
***REMOVED***
    Theme.prototype.processIconOverride = function () {
        if (this.iconOverrideOption) {
            this.setIconOverride(this.calendarOptions[this.iconOverrideOption]);
    ***REMOVED***
***REMOVED***;
    Theme.prototype.setIconOverride = function (iconOverrideHash) {
        var iconClassesCopy;
        var buttonName;
        if (typeof iconOverrideHash === 'object' && iconOverrideHash) { // non-null object
            iconClassesCopy = __assign({***REMOVED***, this.iconClasses);
            for (buttonName in iconOverrideHash) {
                iconClassesCopy[buttonName] = this.applyIconOverridePrefix(iconOverrideHash[buttonName]);
        ***REMOVED***
            this.iconClasses = iconClassesCopy;
    ***REMOVED***
        else if (iconOverrideHash === false) {
            this.iconClasses = {***REMOVED***;
    ***REMOVED***
***REMOVED***;
    Theme.prototype.applyIconOverridePrefix = function (className) {
        var prefix = this.iconOverridePrefix;
        if (prefix && className.indexOf(prefix) !== 0) { // if not already present
            className = prefix + className;
    ***REMOVED***
        return className;
***REMOVED***;
    Theme.prototype.getClass = function (key) {
        return this.classes[key] || '';
***REMOVED***;
    Theme.prototype.getIconClass = function (buttonName) {
        var className = this.iconClasses[buttonName];
        if (className) {
            return this.baseIconClass + ' ' + className;
    ***REMOVED***
        return '';
***REMOVED***;
    Theme.prototype.getCustomButtonIconClass = function (customButtonProps) {
        var className;
        if (this.iconOverrideCustomButtonOption) {
            className = customButtonProps[this.iconOverrideCustomButtonOption];
            if (className) {
                return this.baseIconClass + ' ' + this.applyIconOverridePrefix(className);
        ***REMOVED***
    ***REMOVED***
        return '';
***REMOVED***;
    return Theme;
***REMOVED***());
Theme.prototype.classes = {***REMOVED***;
Theme.prototype.iconClasses = {***REMOVED***;
Theme.prototype.baseIconClass = '';
Theme.prototype.iconOverridePrefix = '';

var guid = 0;
var Component = /** @class */ (function () {
    function Component(context, isView) {
***REMOVED*** HACK to populate view at top of component instantiation call chain
        if (isView) {
            context.view = this;
    ***REMOVED***
        this.uid = String(guid++);
        this.context = context;
        this.dateEnv = context.dateEnv;
        this.theme = context.theme;
        this.view = context.view;
        this.calendar = context.calendar;
        this.isRtl = this.opt('dir') === 'rtl';
***REMOVED***
    Component.addEqualityFuncs = function (newFuncs) {
        this.prototype.equalityFuncs = __assign({***REMOVED***, this.prototype.equalityFuncs, newFuncs);
***REMOVED***;
    Component.prototype.opt = function (name) {
        return this.context.options[name];
***REMOVED***;
    Component.prototype.receiveProps = function (props) {
        var _a = recycleProps(this.props || {***REMOVED***, props, this.equalityFuncs), anyChanges = _a.anyChanges, comboProps = _a.comboProps;
        this.props = comboProps;
        if (anyChanges) {
            this.render(comboProps);
    ***REMOVED***
***REMOVED***;
    Component.prototype.render = function (props) {
***REMOVED***;
    // after destroy is called, this component won't ever be used again
    Component.prototype.destroy = function () {
***REMOVED***;
    return Component;
***REMOVED***());
Component.prototype.equalityFuncs = {***REMOVED***;
/*
Reuses old values when equal. If anything is unequal, returns newProps as-is.
Great for PureComponent, but won't be feasible with React, so just eliminate and use React's DOM diffing.
*/
function recycleProps(oldProps, newProps, equalityFuncs) {
    var comboProps = {***REMOVED***; // some old, some new
    var anyChanges = false;
    for (var key in newProps) {
        if (key in oldProps && (oldProps[key] === newProps[key] ||
            (equalityFuncs[key] && equalityFuncs[key](oldProps[key], newProps[key])))) {
    ***REMOVED*** equal to old? use old prop
            comboProps[key] = oldProps[key];
    ***REMOVED***
        else {
            comboProps[key] = newProps[key];
            anyChanges = true;
    ***REMOVED***
***REMOVED***
    for (var key in oldProps) {
        if (!(key in newProps)) {
            anyChanges = true;
            break;
    ***REMOVED***
***REMOVED***
    return { anyChanges: anyChanges, comboProps: comboProps ***REMOVED***;
***REMOVED***

/*
PURPOSES:
- hook up to fg, fill, and mirror renderers
- interface for dragging and hits
*/
var DateComponent = /** @class */ (function (_super) {
    __extends(DateComponent, _super);
    function DateComponent(context, el, isView) {
        var _this = _super.call(this, context, isView) || this;
        _this.el = el;
        return _this;
***REMOVED***
    DateComponent.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        removeElement(this.el);
***REMOVED***;
    // TODO: WHAT ABOUT (sourceSeg && sourceSeg.component.doesDragMirror)
    //
    // Event Drag-n-Drop Rendering (for both events and external elements)
    // ---------------------------------------------------------------------------------------------------------------
    /*
    renderEventDragSegs(state: EventSegUiInteractionState) {
      if (state) {
        let { isEvent, segs, sourceSeg ***REMOVED*** = state
  
        if (this.eventRenderer) {
          this.eventRenderer.hideByHash(state.affectedInstances)
    ***REMOVED***
  
***REMOVED*** if the user is dragging something that is considered an event with real event data,
***REMOVED*** and this component likes to do drag mirrors OR the component where the seg came from
***REMOVED*** likes to do drag mirrors, then render a drag mirror.
        if (isEvent && (this.doesDragMirror || sourceSeg && sourceSeg.component.doesDragMirror)) {
          if (this.mirrorRenderer) {
            this.mirrorRenderer.renderSegs(segs, { isDragging: true, sourceSeg ***REMOVED***)
      ***REMOVED***
    ***REMOVED***
  
***REMOVED*** if it would be impossible to render a drag mirror OR this component likes to render
***REMOVED*** highlights, then render a highlight.
        if (!isEvent || this.doesDragHighlight) {
          if (this.fillRenderer) {
            this.fillRenderer.renderSegs('highlight', segs)
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    */
    // Hit System
    // -----------------------------------------------------------------------------------------------------------------
    DateComponent.prototype.buildPositionCaches = function () {
***REMOVED***;
    DateComponent.prototype.queryHit = function (positionLeft, positionTop, elWidth, elHeight) {
        return null; // this should be abstract
***REMOVED***;
    // Validation
    // -----------------------------------------------------------------------------------------------------------------
    DateComponent.prototype.isInteractionValid = function (interaction) {
        var calendar = this.calendar;
        var dateProfile = this.props.dateProfile; // HACK
        var instances = interaction.mutatedEvents.instances;
        if (dateProfile) { // HACK for DayTile
            for (var instanceId in instances) {
                if (!rangeContainsRange(dateProfile.validRange, instances[instanceId].range)) {
                    return false;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
        return isInteractionValid(interaction, calendar);
***REMOVED***;
    DateComponent.prototype.isDateSelectionValid = function (selection) {
        var dateProfile = this.props.dateProfile; // HACK
        if (dateProfile && // HACK for DayTile
            !rangeContainsRange(dateProfile.validRange, selection.range)) {
            return false;
    ***REMOVED***
        return isDateSelectionValid(selection, this.calendar);
***REMOVED***;
    // Triggering
    // -----------------------------------------------------------------------------------------------------------------
    // TODO: move to Calendar
    DateComponent.prototype.publiclyTrigger = function (name, args) {
        var calendar = this.calendar;
        return calendar.publiclyTrigger(name, args);
***REMOVED***;
    DateComponent.prototype.publiclyTriggerAfterSizing = function (name, args) {
        var calendar = this.calendar;
        return calendar.publiclyTriggerAfterSizing(name, args);
***REMOVED***;
    DateComponent.prototype.hasPublicHandlers = function (name) {
        var calendar = this.calendar;
        return calendar.hasPublicHandlers(name);
***REMOVED***;
    DateComponent.prototype.triggerRenderedSegs = function (segs, isMirrors) {
        var calendar = this.calendar;
        if (this.hasPublicHandlers('eventPositioned')) {
            for (var _i = 0, segs_1 = segs; _i < segs_1.length; _i++) {
                var seg = segs_1[_i];
                this.publiclyTriggerAfterSizing('eventPositioned', [
                    {
                        event: new EventApi(calendar, seg.eventRange.def, seg.eventRange.instance),
                        isMirror: isMirrors,
                        isStart: seg.isStart,
                        isEnd: seg.isEnd,
                        el: seg.el,
                        view: this // safe to cast because this method is only called on context.view
                ***REMOVED***
                ]);
        ***REMOVED***
    ***REMOVED***
        if (!calendar.state.loadingLevel) { // avoid initial empty state while pending
            calendar.afterSizingTriggers._eventsPositioned = [null]; // fire once
    ***REMOVED***
***REMOVED***;
    DateComponent.prototype.triggerWillRemoveSegs = function (segs, isMirrors) {
        var calendar = this.calendar;
        for (var _i = 0, segs_2 = segs; _i < segs_2.length; _i++) {
            var seg = segs_2[_i];
            calendar.trigger('eventElRemove', seg.el);
    ***REMOVED***
        if (this.hasPublicHandlers('eventDestroy')) {
            for (var _a = 0, segs_3 = segs; _a < segs_3.length; _a++) {
                var seg = segs_3[_a];
                this.publiclyTrigger('eventDestroy', [
                    {
                        event: new EventApi(calendar, seg.eventRange.def, seg.eventRange.instance),
                        isMirror: isMirrors,
                        el: seg.el,
                        view: this // safe to cast because this method is only called on context.view
                ***REMOVED***
                ]);
        ***REMOVED***
    ***REMOVED***
***REMOVED***;
    // Pointer Interaction Utils
    // -----------------------------------------------------------------------------------------------------------------
    DateComponent.prototype.isValidSegDownEl = function (el) {
        return !this.props.eventDrag && // HACK
            !this.props.eventResize && // HACK
            !elementClosest(el, '.fc-mirror') &&
            (this.isPopover() || !this.isInPopover(el));
***REMOVED*** ^above line ensures we don't detect a seg interaction within a nested component.
***REMOVED*** it's a HACK because it only supports a popover as the nested component.
***REMOVED***;
    DateComponent.prototype.isValidDateDownEl = function (el) {
        var segEl = elementClosest(el, this.fgSegSelector);
        return (!segEl || segEl.classList.contains('fc-mirror')) &&
            !elementClosest(el, '.fc-more') && // a "more.." link
            !elementClosest(el, 'a[data-goto]') && // a clickable nav link
            !this.isInPopover(el);
***REMOVED***;
    DateComponent.prototype.isPopover = function () {
        return this.el.classList.contains('fc-popover');
***REMOVED***;
    DateComponent.prototype.isInPopover = function (el) {
        return Boolean(elementClosest(el, '.fc-popover'));
***REMOVED***;
    return DateComponent;
***REMOVED***(Component));
DateComponent.prototype.fgSegSelector = '.fc-event-container > *';
DateComponent.prototype.bgSegSelector = '.fc-bgevent:not(.fc-nonbusiness)';

var uid$1 = 0;
function createPlugin(input) {
    return {
        id: String(uid$1++),
        deps: input.deps || [],
        reducers: input.reducers || [],
        eventDefParsers: input.eventDefParsers || [],
        isDraggableTransformers: input.isDraggableTransformers || [],
        eventDragMutationMassagers: input.eventDragMutationMassagers || [],
        eventDefMutationAppliers: input.eventDefMutationAppliers || [],
        dateSelectionTransformers: input.dateSelectionTransformers || [],
        datePointTransforms: input.datePointTransforms || [],
        dateSpanTransforms: input.dateSpanTransforms || [],
        views: input.views || {***REMOVED***,
        viewPropsTransformers: input.viewPropsTransformers || [],
        isPropsValid: input.isPropsValid || null,
        externalDefTransforms: input.externalDefTransforms || [],
        eventResizeJoinTransforms: input.eventResizeJoinTransforms || [],
        viewContainerModifiers: input.viewContainerModifiers || [],
        eventDropTransformers: input.eventDropTransformers || [],
        componentInteractions: input.componentInteractions || [],
        calendarInteractions: input.calendarInteractions || [],
        themeClasses: input.themeClasses || {***REMOVED***,
        eventSourceDefs: input.eventSourceDefs || [],
        cmdFormatter: input.cmdFormatter,
        recurringTypes: input.recurringTypes || [],
        namedTimeZonedImpl: input.namedTimeZonedImpl,
        defaultView: input.defaultView || '',
        elementDraggingImpl: input.elementDraggingImpl,
        optionChangeHandlers: input.optionChangeHandlers || {***REMOVED***
***REMOVED***;
***REMOVED***
var PluginSystem = /** @class */ (function () {
    function PluginSystem() {
        this.hooks = {
            reducers: [],
            eventDefParsers: [],
            isDraggableTransformers: [],
            eventDragMutationMassagers: [],
            eventDefMutationAppliers: [],
            dateSelectionTransformers: [],
            datePointTransforms: [],
            dateSpanTransforms: [],
            views: {***REMOVED***,
            viewPropsTransformers: [],
            isPropsValid: null,
            externalDefTransforms: [],
            eventResizeJoinTransforms: [],
            viewContainerModifiers: [],
            eventDropTransformers: [],
            componentInteractions: [],
            calendarInteractions: [],
            themeClasses: {***REMOVED***,
            eventSourceDefs: [],
            cmdFormatter: null,
            recurringTypes: [],
            namedTimeZonedImpl: null,
            defaultView: '',
            elementDraggingImpl: null,
            optionChangeHandlers: {***REMOVED***
    ***REMOVED***;
        this.addedHash = {***REMOVED***;
***REMOVED***
    PluginSystem.prototype.add = function (plugin) {
        if (!this.addedHash[plugin.id]) {
            this.addedHash[plugin.id] = true;
            for (var _i = 0, _a = plugin.deps; _i < _a.length; _i++) {
                var dep = _a[_i];
                this.add(dep);
        ***REMOVED***
            this.hooks = combineHooks(this.hooks, plugin);
    ***REMOVED***
***REMOVED***;
    return PluginSystem;
***REMOVED***());
function combineHooks(hooks0, hooks1) {
    return {
        reducers: hooks0.reducers.concat(hooks1.reducers),
        eventDefParsers: hooks0.eventDefParsers.concat(hooks1.eventDefParsers),
        isDraggableTransformers: hooks0.isDraggableTransformers.concat(hooks1.isDraggableTransformers),
        eventDragMutationMassagers: hooks0.eventDragMutationMassagers.concat(hooks1.eventDragMutationMassagers),
        eventDefMutationAppliers: hooks0.eventDefMutationAppliers.concat(hooks1.eventDefMutationAppliers),
        dateSelectionTransformers: hooks0.dateSelectionTransformers.concat(hooks1.dateSelectionTransformers),
        datePointTransforms: hooks0.datePointTransforms.concat(hooks1.datePointTransforms),
        dateSpanTransforms: hooks0.dateSpanTransforms.concat(hooks1.dateSpanTransforms),
        views: __assign({***REMOVED***, hooks0.views, hooks1.views),
        viewPropsTransformers: hooks0.viewPropsTransformers.concat(hooks1.viewPropsTransformers),
        isPropsValid: hooks1.isPropsValid || hooks0.isPropsValid,
        externalDefTransforms: hooks0.externalDefTransforms.concat(hooks1.externalDefTransforms),
        eventResizeJoinTransforms: hooks0.eventResizeJoinTransforms.concat(hooks1.eventResizeJoinTransforms),
        viewContainerModifiers: hooks0.viewContainerModifiers.concat(hooks1.viewContainerModifiers),
        eventDropTransformers: hooks0.eventDropTransformers.concat(hooks1.eventDropTransformers),
        calendarInteractions: hooks0.calendarInteractions.concat(hooks1.calendarInteractions),
        componentInteractions: hooks0.componentInteractions.concat(hooks1.componentInteractions),
        themeClasses: __assign({***REMOVED***, hooks0.themeClasses, hooks1.themeClasses),
        eventSourceDefs: hooks0.eventSourceDefs.concat(hooks1.eventSourceDefs),
        cmdFormatter: hooks1.cmdFormatter || hooks0.cmdFormatter,
        recurringTypes: hooks0.recurringTypes.concat(hooks1.recurringTypes),
        namedTimeZonedImpl: hooks1.namedTimeZonedImpl || hooks0.namedTimeZonedImpl,
        defaultView: hooks0.defaultView || hooks1.defaultView,
        elementDraggingImpl: hooks0.elementDraggingImpl || hooks1.elementDraggingImpl,
        optionChangeHandlers: __assign({***REMOVED***, hooks0.optionChangeHandlers, hooks1.optionChangeHandlers)
***REMOVED***;
***REMOVED***

var eventSourceDef = {
    ignoreRange: true,
    parseMeta: function (raw) {
        if (Array.isArray(raw)) { // short form
            return raw;
    ***REMOVED***
        else if (Array.isArray(raw.events)) {
            return raw.events;
    ***REMOVED***
        return null;
***REMOVED***,
    fetch: function (arg, success) {
        success({
            rawEvents: arg.eventSource.meta
    ***REMOVED***);
***REMOVED***
***REMOVED***;
var ArrayEventSourcePlugin = createPlugin({
    eventSourceDefs: [eventSourceDef]
***REMOVED***);

var eventSourceDef$1 = {
    parseMeta: function (raw) {
        if (typeof raw === 'function') { // short form
            return raw;
    ***REMOVED***
        else if (typeof raw.events === 'function') {
            return raw.events;
    ***REMOVED***
        return null;
***REMOVED***,
    fetch: function (arg, success, failure) {
        var dateEnv = arg.calendar.dateEnv;
        var func = arg.eventSource.meta;
        unpromisify(func.bind(null, {
            start: dateEnv.toDate(arg.range.start),
            end: dateEnv.toDate(arg.range.end),
            startStr: dateEnv.formatIso(arg.range.start),
            endStr: dateEnv.formatIso(arg.range.end),
            timeZone: dateEnv.timeZone
    ***REMOVED***), function (rawEvents) {
            success({ rawEvents: rawEvents ***REMOVED***); // needs an object response
    ***REMOVED***, failure // send errorObj directly to failure callback
        );
***REMOVED***
***REMOVED***;
var FuncEventSourcePlugin = createPlugin({
    eventSourceDefs: [eventSourceDef$1]
***REMOVED***);

function requestJson(method, url, params, successCallback, failureCallback) {
    method = method.toUpperCase();
    var body = null;
    if (method === 'GET') {
        url = injectQueryStringParams(url, params);
***REMOVED***
    else {
        body = encodeParams(params);
***REMOVED***
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    if (method !== 'GET') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
***REMOVED***
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
    ***REMOVED***
                var res = JSON.parse(xhr.responseText);
                successCallback(res, xhr);
        ***REMOVED***
            catch (err) {
                failureCallback('Failure parsing JSON', xhr);
        ***REMOVED***
    ***REMOVED***
        else {
            failureCallback('Request failed', xhr);
    ***REMOVED***
***REMOVED***;
    xhr.onerror = function () {
        failureCallback('Request failed', xhr);
***REMOVED***;
    xhr.send(body);
***REMOVED***
function injectQueryStringParams(url, params) {
    return url +
        (url.indexOf('?') === -1 ? '?' : '&') +
        encodeParams(params);
***REMOVED***
function encodeParams(params) {
    var parts = [];
    for (var key in params) {
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
***REMOVED***
    return parts.join('&');
***REMOVED***

var eventSourceDef$2 = {
    parseMeta: function (raw) {
        if (typeof raw === 'string') { // short form
            raw = { url: raw ***REMOVED***;
    ***REMOVED***
        else if (!raw || typeof raw !== 'object' || !raw.url) {
            return null;
    ***REMOVED***
        return {
            url: raw.url,
            method: (raw.method || 'GET').toUpperCase(),
            extraParams: raw.extraParams,
            startParam: raw.startParam,
            endParam: raw.endParam,
            timeZoneParam: raw.timeZoneParam
    ***REMOVED***;
***REMOVED***,
    fetch: function (arg, success, failure) {
        var meta = arg.eventSource.meta;
        var requestParams = buildRequestParams(meta, arg.range, arg.calendar);
        requestJson(meta.method, meta.url, requestParams, function (rawEvents, xhr) {
            success({ rawEvents: rawEvents, xhr: xhr ***REMOVED***);
    ***REMOVED***, function (errorMessage, xhr) {
            failure({ message: errorMessage, xhr: xhr ***REMOVED***);
    ***REMOVED***);
***REMOVED***
***REMOVED***;
var JsonFeedEventSourcePlugin = createPlugin({
    eventSourceDefs: [eventSourceDef$2]
***REMOVED***);
function buildRequestParams(meta, range, calendar) {
    var dateEnv = calendar.dateEnv;
    var startParam;
    var endParam;
    var timeZoneParam;
    var customRequestParams;
    var params = {***REMOVED***;
    startParam = meta.startParam;
    if (startParam == null) {
        startParam = calendar.opt('startParam');
***REMOVED***
    endParam = meta.endParam;
    if (endParam == null) {
        endParam = calendar.opt('endParam');
***REMOVED***
    timeZoneParam = meta.timeZoneParam;
    if (timeZoneParam == null) {
        timeZoneParam = calendar.opt('timeZoneParam');
***REMOVED***
    // retrieve any outbound GET/POST data from the options
    if (typeof meta.extraParams === 'function') {
***REMOVED*** supplied as a function that returns a key/value object
        customRequestParams = meta.extraParams();
***REMOVED***
    else {
***REMOVED*** probably supplied as a straight key/value object
        customRequestParams = meta.extraParams || {***REMOVED***;
***REMOVED***
    __assign(params, customRequestParams);
    params[startParam] = dateEnv.formatIso(range.start);
    params[endParam] = dateEnv.formatIso(range.end);
    if (dateEnv.timeZone !== 'local') {
        params[timeZoneParam] = dateEnv.timeZone;
***REMOVED***
    return params;
***REMOVED***

var recurring = {
    parse: function (rawEvent, leftoverProps, dateEnv) {
        var createMarker = dateEnv.createMarker.bind(dateEnv);
        var processors = {
            daysOfWeek: null,
            startTime: createDuration,
            endTime: createDuration,
            startRecur: createMarker,
            endRecur: createMarker
    ***REMOVED***;
        var props = refineProps(rawEvent, processors, {***REMOVED***, leftoverProps);
        var anyValid = false;
        for (var propName in props) {
            if (props[propName] != null) {
                anyValid = true;
                break;
        ***REMOVED***
    ***REMOVED***
        if (anyValid) {
            var duration = null;
            if ('duration' in leftoverProps) {
                duration = createDuration(leftoverProps.duration);
                delete leftoverProps.duration;
        ***REMOVED***
            if (!duration && props.startTime && props.endTime) {
                duration = subtractDurations(props.endTime, props.startTime);
        ***REMOVED***
            return {
                allDayGuess: Boolean(!props.startTime && !props.endTime),
                duration: duration,
                typeData: props // doesn't need endTime anymore but oh well
        ***REMOVED***;
    ***REMOVED***
        return null;
***REMOVED***,
    expand: function (typeData, framingRange, dateEnv) {
        var clippedFramingRange = intersectRanges(framingRange, { start: typeData.startRecur, end: typeData.endRecur ***REMOVED***);
        if (clippedFramingRange) {
            return expandRanges(typeData.daysOfWeek, typeData.startTime, clippedFramingRange, dateEnv);
    ***REMOVED***
        else {
            return [];
    ***REMOVED***
***REMOVED***
***REMOVED***;
var SimpleRecurrencePlugin = createPlugin({
    recurringTypes: [recurring]
***REMOVED***);
function expandRanges(daysOfWeek, startTime, framingRange, dateEnv) {
    var dowHash = daysOfWeek ? arrayToHash(daysOfWeek) : null;
    var dayMarker = startOfDay(framingRange.start);
    var endMarker = framingRange.end;
    var instanceStarts = [];
    while (dayMarker < endMarker) {
        var instanceStart 
***REMOVED*** if everyday, or this particular day-of-week
        = void 0;
***REMOVED*** if everyday, or this particular day-of-week
        if (!dowHash || dowHash[dayMarker.getUTCDay()]) {
            if (startTime) {
                instanceStart = dateEnv.add(dayMarker, startTime);
        ***REMOVED***
            else {
                instanceStart = dayMarker;
        ***REMOVED***
            instanceStarts.push(instanceStart);
    ***REMOVED***
        dayMarker = addDays(dayMarker, 1);
***REMOVED***
    return instanceStarts;
***REMOVED***

var DefaultOptionChangeHandlers = createPlugin({
    optionChangeHandlers: {
        events: function (events, calendar, deepEqual) {
            handleEventSources([events], calendar, deepEqual);
    ***REMOVED***,
        eventSources: handleEventSources,
        plugins: handlePlugins
***REMOVED***
***REMOVED***);
function handleEventSources(inputs, calendar, deepEqual) {
    var unfoundSources = hashValuesToArray(calendar.state.eventSources);
    var newInputs = [];
    for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
        var input = inputs_1[_i];
        var inputFound = false;
        for (var i = 0; i < unfoundSources.length; i++) {
            if (deepEqual(unfoundSources[i]._raw, input)) {
                unfoundSources.splice(i, 1); // delete
                inputFound = true;
                break;
        ***REMOVED***
    ***REMOVED***
        if (!inputFound) {
            newInputs.push(input);
    ***REMOVED***
***REMOVED***
    for (var _a = 0, unfoundSources_1 = unfoundSources; _a < unfoundSources_1.length; _a++) {
        var unfoundSource = unfoundSources_1[_a];
        calendar.dispatch({
            type: 'REMOVE_EVENT_SOURCE',
            sourceId: unfoundSource.sourceId
    ***REMOVED***);
***REMOVED***
    for (var _b = 0, newInputs_1 = newInputs; _b < newInputs_1.length; _b++) {
        var newInput = newInputs_1[_b];
        calendar.addEventSource(newInput);
***REMOVED***
***REMOVED***
// shortcoming: won't remove plugins
function handlePlugins(inputs, calendar) {
    calendar.addPluginInputs(inputs); // will gracefully handle duplicates
***REMOVED***

var config = {***REMOVED***; // TODO: make these options
var globalDefaults = {
    defaultRangeSeparator: ' - ',
    titleRangeSeparator: ' \u2013 ',
    defaultTimedEventDuration: '01:00:00',
    defaultAllDayEventDuration: { day: 1 ***REMOVED***,
    forceEventDuration: false,
    nextDayThreshold: '00:00:00',
    // display
    columnHeader: true,
    defaultView: '',
    aspectRatio: 1.35,
    header: {
        left: 'title',
        center: '',
        right: 'today prev,next'
***REMOVED***,
    weekends: true,
    weekNumbers: false,
    weekNumberCalculation: 'local',
    editable: false,
    // nowIndicator: false,
    scrollTime: '06:00:00',
    minTime: '00:00:00',
    maxTime: '24:00:00',
    showNonCurrentDates: true,
    // event ajax
    lazyFetching: true,
    startParam: 'start',
    endParam: 'end',
    timeZoneParam: 'timeZone',
    timeZone: 'local',
    // allDayDefault: undefined,
    // locale
    locales: [],
    locale: '',
    // dir: will get this from the default locale
    // buttonIcons: null,
    // allows setting a min-height to the event segment to prevent short events overlapping each other
    timeGridEventMinHeight: 0,
    themeSystem: 'standard',
    // eventResizableFromStart: false,
    dragRevertDuration: 500,
    dragScroll: true,
    allDayMaintainDuration: false,
    // selectable: false,
    unselectAuto: true,
    // selectMinDistance: 0,
    dropAccept: '*',
    eventOrder: 'start,-duration,allDay,title',
    // ^ if start tie, longer events go before shorter. final tie-breaker is title text
    // rerenderDelay: null,
    eventLimit: false,
    eventLimitClick: 'popover',
    dayPopoverFormat: { month: 'long', day: 'numeric', year: 'numeric' ***REMOVED***,
    handleWindowResize: true,
    windowResizeDelay: 100,
    longPressDelay: 1000,
    eventDragMinDistance: 5 // only applies to mouse
***REMOVED***;
var rtlDefaults = {
    header: {
        left: 'next,prev today',
        center: '',
        right: 'title'
***REMOVED***,
    buttonIcons: {
***REMOVED*** TODO: make RTL support the responibility of the theme
        prev: 'fc-icon-chevron-right',
        next: 'fc-icon-chevron-left',
        prevYear: 'fc-icon-chevrons-right',
        nextYear: 'fc-icon-chevrons-left'
***REMOVED***
***REMOVED***;
var complexOptions = [
    'header',
    'footer',
    'buttonText',
    'buttonIcons'
];
// Merges an array of option objects into a single object
function mergeOptions(optionObjs) {
    return mergeProps(optionObjs, complexOptions);
***REMOVED***
// TODO: move this stuff to a "plugin"-related file...
var INTERNAL_PLUGINS = [
    ArrayEventSourcePlugin,
    FuncEventSourcePlugin,
    JsonFeedEventSourcePlugin,
    SimpleRecurrencePlugin,
    DefaultOptionChangeHandlers
];
function refinePluginDefs(pluginInputs) {
    var plugins = [];
    for (var _i = 0, pluginInputs_1 = pluginInputs; _i < pluginInputs_1.length; _i++) {
        var pluginInput = pluginInputs_1[_i];
        if (typeof pluginInput === 'string') {
            var globalName = 'FullCalendar' + capitaliseFirstLetter(pluginInput);
            if (!window[globalName]) {
                console.warn('Plugin file not loaded for ' + pluginInput);
        ***REMOVED***
            else {
                plugins.push(window[globalName].default); // is an ES6 module
        ***REMOVED***
    ***REMOVED***
        else {
            plugins.push(pluginInput);
    ***REMOVED***
***REMOVED***
    return INTERNAL_PLUGINS.concat(plugins);
***REMOVED***

var RAW_EN_LOCALE = {
    code: 'en',
    week: {
        dow: 0,
        doy: 4 // 4 days need to be within the year to be considered the first week
***REMOVED***,
    dir: 'ltr',
    buttonText: {
        prev: 'prev',
        next: 'next',
        prevYear: 'prev year',
        nextYear: 'next year',
        year: 'year',
        today: 'today',
        month: 'month',
        week: 'week',
        day: 'day',
        list: 'list'
***REMOVED***,
    weekLabel: 'W',
    allDayText: 'all-day',
    eventLimitText: 'more',
    noEventsMessage: 'No events to display'
***REMOVED***;
function parseRawLocales(explicitRawLocales) {
    var defaultCode = explicitRawLocales.length > 0 ? explicitRawLocales[0].code : 'en';
    var globalArray = window['FullCalendarLocalesAll'] || []; // from locales-all.js
    var globalObject = window['FullCalendarLocales'] || {***REMOVED***; // from locales/*.js. keys are meaningless
    var allRawLocales = globalArray.concat(// globalArray is low prio
    hashValuesToArray(globalObject), // medium prio
    explicitRawLocales // highest prio
    );
    var rawLocaleMap = {
        en: RAW_EN_LOCALE // necessary?
***REMOVED***;
    for (var _i = 0, allRawLocales_1 = allRawLocales; _i < allRawLocales_1.length; _i++) {
        var rawLocale = allRawLocales_1[_i];
        rawLocaleMap[rawLocale.code] = rawLocale;
***REMOVED***
    return {
        map: rawLocaleMap,
        defaultCode: defaultCode
***REMOVED***;
***REMOVED***
function buildLocale(inputSingular, available) {
    if (typeof inputSingular === 'object' && !Array.isArray(inputSingular)) {
        return parseLocale(inputSingular.code, [inputSingular.code], inputSingular);
***REMOVED***
    else {
        return queryLocale(inputSingular, available);
***REMOVED***
***REMOVED***
function queryLocale(codeArg, available) {
    var codes = [].concat(codeArg || []); // will convert to array
    var raw = queryRawLocale(codes, available) || RAW_EN_LOCALE;
    return parseLocale(codeArg, codes, raw);
***REMOVED***
function queryRawLocale(codes, available) {
    for (var i = 0; i < codes.length; i++) {
        var parts = codes[i].toLocaleLowerCase().split('-');
        for (var j = parts.length; j > 0; j--) {
            var simpleId = parts.slice(0, j).join('-');
            if (available[simpleId]) {
                return available[simpleId];
        ***REMOVED***
    ***REMOVED***
***REMOVED***
    return null;
***REMOVED***
function parseLocale(codeArg, codes, raw) {
    var merged = mergeProps([RAW_EN_LOCALE, raw], ['buttonText']);
    delete merged.code; // don't want this part of the options
    var week = merged.week;
    delete merged.week;
    return {
        codeArg: codeArg,
        codes: codes,
        week: week,
        simpleNumberFormat: new Intl.NumberFormat(codeArg),
        options: merged
***REMOVED***;
***REMOVED***

var OptionsManager = /** @class */ (function () {
    function OptionsManager(overrides) {
        this.overrides = __assign({***REMOVED***, overrides); // make a copy
        this.dynamicOverrides = {***REMOVED***;
        this.compute();
***REMOVED***
    OptionsManager.prototype.mutate = function (updates, removals, isDynamic) {
        var overrideHash = isDynamic ? this.dynamicOverrides : this.overrides;
        __assign(overrideHash, updates);
        for (var _i = 0, removals_1 = removals; _i < removals_1.length; _i++) {
            var propName = removals_1[_i];
            delete overrideHash[propName];
    ***REMOVED***
        this.compute();
***REMOVED***;
    // Computes the flattened options hash for the calendar and assigns to `this.options`.
    // Assumes this.overrides and this.dynamicOverrides have already been initialized.
    OptionsManager.prototype.compute = function () {
***REMOVED*** TODO: not a very efficient system
        var locales = firstDefined(// explicit locale option given?
        this.dynamicOverrides.locales, this.overrides.locales, globalDefaults.locales);
        var locale = firstDefined(// explicit locales option given?
        this.dynamicOverrides.locale, this.overrides.locale, globalDefaults.locale);
        var available = parseRawLocales(locales);
        var localeDefaults = buildLocale(locale || available.defaultCode, available.map).options;
        var dir = firstDefined(// based on options computed so far, is direction RTL?
        this.dynamicOverrides.dir, this.overrides.dir, localeDefaults.dir);
        var dirDefaults = dir === 'rtl' ? rtlDefaults : {***REMOVED***;
        this.dirDefaults = dirDefaults;
        this.localeDefaults = localeDefaults;
        this.computed = mergeOptions([
            globalDefaults,
            dirDefaults,
            localeDefaults,
            this.overrides,
            this.dynamicOverrides
        ]);
***REMOVED***;
    return OptionsManager;
***REMOVED***());

var calendarSystemClassMap = {***REMOVED***;
function registerCalendarSystem(name, theClass) {
    calendarSystemClassMap[name] = theClass;
***REMOVED***
function createCalendarSystem(name) {
    return new calendarSystemClassMap[name]();
***REMOVED***
var GregorianCalendarSystem = /** @class */ (function () {
    function GregorianCalendarSystem() {
***REMOVED***
    GregorianCalendarSystem.prototype.getMarkerYear = function (d) {
        return d.getUTCFullYear();
***REMOVED***;
    GregorianCalendarSystem.prototype.getMarkerMonth = function (d) {
        return d.getUTCMonth();
***REMOVED***;
    GregorianCalendarSystem.prototype.getMarkerDay = function (d) {
        return d.getUTCDate();
***REMOVED***;
    GregorianCalendarSystem.prototype.arrayToMarker = function (arr) {
        return arrayToUtcDate(arr);
***REMOVED***;
    GregorianCalendarSystem.prototype.markerToArray = function (marker) {
        return dateToUtcArray(marker);
***REMOVED***;
    return GregorianCalendarSystem;
***REMOVED***());
registerCalendarSystem('gregory', GregorianCalendarSystem);

var ISO_RE = /^\s*(\d{4***REMOVED***)(-(\d{2***REMOVED***)(-(\d{2***REMOVED***)([T ](\d{2***REMOVED***):(\d{2***REMOVED***)(:(\d{2***REMOVED***)(\.(\d+))?)?(Z|(([-+])(\d{2***REMOVED***)(:?(\d{2***REMOVED***))?))?)?)?)?$/;
function parse(str) {
    var m = ISO_RE.exec(str);
    if (m) {
        var marker = new Date(Date.UTC(Number(m[1]), m[3] ? Number(m[3]) - 1 : 0, Number(m[5] || 1), Number(m[7] || 0), Number(m[8] || 0), Number(m[10] || 0), m[12] ? Number('0.' + m[12]) * 1000 : 0));
        if (isValidDate(marker)) {
            var timeZoneOffset = null;
            if (m[13]) {
                timeZoneOffset = (m[15] === '-' ? -1 : 1) * (Number(m[16] || 0) * 60 +
                    Number(m[18] || 0));
        ***REMOVED***
            return {
                marker: marker,
                isTimeUnspecified: !m[6],
                timeZoneOffset: timeZoneOffset
        ***REMOVED***;
    ***REMOVED***
***REMOVED***
    return null;
***REMOVED***

var DateEnv = /** @class */ (function () {
    function DateEnv(settings) {
        var timeZone = this.timeZone = settings.timeZone;
        var isNamedTimeZone = timeZone !== 'local' && timeZone !== 'UTC';
        if (settings.namedTimeZoneImpl && isNamedTimeZone) {
            this.namedTimeZoneImpl = new settings.namedTimeZoneImpl(timeZone);
    ***REMOVED***
        this.canComputeOffset = Boolean(!isNamedTimeZone || this.namedTimeZoneImpl);
        this.calendarSystem = createCalendarSystem(settings.calendarSystem);
        this.locale = settings.locale;
        this.weekDow = settings.locale.week.dow;
        this.weekDoy = settings.locale.week.doy;
        if (settings.weekNumberCalculation === 'ISO') {
            this.weekDow = 1;
            this.weekDoy = 4;
    ***REMOVED***
        if (typeof settings.firstDay === 'number') {
            this.weekDow = settings.firstDay;
    ***REMOVED***
        if (typeof settings.weekNumberCalculation === 'function') {
            this.weekNumberFunc = settings.weekNumberCalculation;
    ***REMOVED***
        this.weekLabel = settings.weekLabel != null ? settings.weekLabel : settings.locale.options.weekLabel;
        this.cmdFormatter = settings.cmdFormatter;
***REMOVED***
    // Creating / Parsing
    DateEnv.prototype.createMarker = function (input) {
        var meta = this.createMarkerMeta(input);
        if (meta === null) {
            return null;
    ***REMOVED***
        return meta.marker;
***REMOVED***;
    DateEnv.prototype.createNowMarker = function () {
        if (this.canComputeOffset) {
            return this.timestampToMarker(new Date().valueOf());
    ***REMOVED***
        else {
    ***REMOVED*** if we can't compute the current date val for a timezone,
    ***REMOVED*** better to give the current local date vals than UTC
            return arrayToUtcDate(dateToLocalArray(new Date()));
    ***REMOVED***
***REMOVED***;
    DateEnv.prototype.createMarkerMeta = function (input) {
        if (typeof input === 'string') {
            return this.parse(input);
    ***REMOVED***
        var marker = null;
        if (typeof input === 'number') {
            marker = this.timestampToMarker(input);
    ***REMOVED***
        else if (input instanceof Date) {
            input = input.valueOf();
            if (!isNaN(input)) {
                marker = this.timestampToMarker(input);
        ***REMOVED***
    ***REMOVED***
        else if (Array.isArray(input)) {
            marker = arrayToUtcDate(input);
    ***REMOVED***
        if (marker === null || !isValidDate(marker)) {
            return null;
    ***REMOVED***
        return { marker: marker, isTimeUnspecified: false, forcedTzo: null ***REMOVED***;
***REMOVED***;
    DateEnv.prototype.parse = function (s) {
        var parts = parse(s);
        if (parts === null) {
            return null;
    ***REMOVED***
        var marker = parts.marker;
        var forcedTzo = null;
        if (parts.timeZoneOffset !== null) {
            if (this.canComputeOffset) {
                marker = this.timestampToMarker(marker.valueOf() - parts.timeZoneOffset * 60 * 1000);
        ***REMOVED***
            else {
                forcedTzo = parts.timeZoneOffset;
        ***REMOVED***
    ***REMOVED***
        return { marker: marker, isTimeUnspecified: parts.isTimeUnspecified, forcedTzo: forcedTzo ***REMOVED***;
***REMOVED***;
    // Accessors
    DateEnv.prototype.getYear = function (marker) {
        return this.calendarSystem.getMarkerYear(marker);
***REMOVED***;
    DateEnv.prototype.getMonth = function (marker) {
        return this.calendarSystem.getMarkerMonth(marker);
***REMOVED***;
    // Adding / Subtracting
    DateEnv.prototype.add = function (marker, dur) {
        var a = this.calendarSystem.markerToArray(marker);
        a[0] += dur.years;
        a[1] += dur.months;
        a[2] += dur.days;
        a[6] += dur.milliseconds;
        return this.calendarSystem.arrayToMarker(a);
***REMOVED***;
    DateEnv.prototype.subtract = function (marker, dur) {
        var a = this.calendarSystem.markerToArray(marker);
        a[0] -= dur.years;
        a[1] -= dur.months;
        a[2] -= dur.days;
        a[6] -= dur.milliseconds;
        return this.calendarSystem.arrayToMarker(a);
***REMOVED***;
    DateEnv.prototype.addYears = function (marker, n) {
        var a = this.calendarSystem.markerToArray(marker);
        a[0] += n;
        return this.calendarSystem.arrayToMarker(a);
***REMOVED***;
    DateEnv.prototype.addMonths = function (marker, n) {
        var a = this.calendarSystem.markerToArray(marker);
        a[1] += n;
        return this.calendarSystem.arrayToMarker(a);
***REMOVED***;
    // Diffing Whole Units
    DateEnv.prototype.diffWholeYears = function (m0, m1) {
        var calendarSystem = this.calendarSystem;
        if (timeAsMs(m0) === timeAsMs(m1) &&
            calendarSystem.getMarkerDay(m0) === calendarSystem.getMarkerDay(m1) &&
            calendarSystem.getMarkerMonth(m0) === calendarSystem.getMarkerMonth(m1)) {
            return calendarSystem.getMarkerYear(m1) - calendarSystem.getMarkerYear(m0);
    ***REMOVED***
        return null;
***REMOVED***;
    DateEnv.prototype.diffWholeMonths = function (m0, m1) {
        var calendarSystem = this.calendarSystem;
        if (timeAsMs(m0) === timeAsMs(m1) &&
            calendarSystem.getMarkerDay(m0) === calendarSystem.getMarkerDay(m1)) {
            return (calendarSystem.getMarkerMonth(m1) - calendarSystem.getMarkerMonth(m0)) +
                (calendarSystem.getMarkerYear(m1) - calendarSystem.getMarkerYear(m0)) * 12;
    ***REMOVED***
        return null;
***REMOVED***;
    // Range / Duration
    DateEnv.prototype.greatestWholeUnit = function (m0, m1) {
        var n = this.diffWholeYears(m0, m1);
        if (n !== null) {
            return { unit: 'year', value: n ***REMOVED***;
    ***REMOVED***
        n = this.diffWholeMonths(m0, m1);
        if (n !== null) {
            return { unit: 'month', value: n ***REMOVED***;
    ***REMOVED***
        n = diffWholeWeeks(m0, m1);
        if (n !== null) {
            return { unit: 'week', value: n ***REMOVED***;
    ***REMOVED***
        n = diffWholeDays(m0, m1);
        if (n !== null) {
            return { unit: 'day', value: n ***REMOVED***;
    ***REMOVED***
        n = diffHours(m0, m1);
        if (isInt(n)) {
            return { unit: 'hour', value: n ***REMOVED***;
    ***REMOVED***
        n = diffMinutes(m0, m1);
        if (isInt(n)) {
            return { unit: 'minute', value: n ***REMOVED***;
    ***REMOVED***
        n = diffSeconds(m0, m1);
        if (isInt(n)) {
            return { unit: 'second', value: n ***REMOVED***;
    ***REMOVED***
        return { unit: 'millisecond', value: m1.valueOf() - m0.valueOf() ***REMOVED***;
***REMOVED***;
    DateEnv.prototype.countDurationsBetween = function (m0, m1, d) {
***REMOVED*** TODO: can use greatestWholeUnit
        var diff;
        if (d.years) {
            diff = this.diffWholeYears(m0, m1);
            if (diff !== null) {
                return diff / asRoughYears(d);
        ***REMOVED***
    ***REMOVED***
        if (d.months) {
            diff = this.diffWholeMonths(m0, m1);
            if (diff !== null) {
                return diff / asRoughMonths(d);
        ***REMOVED***
    ***REMOVED***
        if (d.days) {
            diff = diffWholeDays(m0, m1);
            if (diff !== null) {
                return diff / asRoughDays(d);
        ***REMOVED***
    ***REMOVED***
        return (m1.valueOf() - m0.valueOf()) / asRoughMs(d);
***REMOVED***;
    // Start-Of
    DateEnv.prototype.startOf = function (m, unit) {
        if (unit === 'year') {
            return this.startOfYear(m);
    ***REMOVED***
        else if (unit === 'month') {
            return this.startOfMonth(m);
    ***REMOVED***
        else if (unit === 'week') {
            return this.startOfWeek(m);
    ***REMOVED***
        else if (unit === 'day') {
            return startOfDay(m);
    ***REMOVED***
        else if (unit === 'hour') {
            return startOfHour(m);
    ***REMOVED***
        else if (unit === 'minute') {
            return startOfMinute(m);
    ***REMOVED***
        else if (unit === 'second') {
            return startOfSecond(m);
    ***REMOVED***
***REMOVED***;
    DateEnv.prototype.startOfYear = function (m) {
        return this.calendarSystem.arrayToMarker([
            this.calendarSystem.getMarkerYear(m)
        ]);
***REMOVED***;
    DateEnv.prototype.startOfMonth = function (m) {
        return this.calendarSystem.arrayToMarker([
            this.calendarSystem.getMarkerYear(m),
            this.calendarSystem.getMarkerMonth(m)
        ]);
***REMOVED***;
    DateEnv.prototype.startOfWeek = function (m) {
        return this.calendarSystem.arrayToMarker([
            this.calendarSystem.getMarkerYear(m),
            this.calendarSystem.getMarkerMonth(m),
            m.getUTCDate() - ((m.getUTCDay() - this.weekDow + 7) % 7)
        ]);
***REMOVED***;
    // Week Number
    DateEnv.prototype.computeWeekNumber = function (marker) {
        if (this.weekNumberFunc) {
            return this.weekNumberFunc(this.toDate(marker));
    ***REMOVED***
        else {
            return weekOfYear(marker, this.weekDow, this.weekDoy);
    ***REMOVED***
***REMOVED***;
    // TODO: choke on timeZoneName: long
    DateEnv.prototype.format = function (marker, formatter, dateOptions) {
        if (dateOptions === void 0) { dateOptions = {***REMOVED***; ***REMOVED***
        return formatter.format({
            marker: marker,
            timeZoneOffset: dateOptions.forcedTzo != null ?
                dateOptions.forcedTzo :
                this.offsetForMarker(marker)
    ***REMOVED***, this);
***REMOVED***;
    DateEnv.prototype.formatRange = function (start, end, formatter, dateOptions) {
        if (dateOptions === void 0) { dateOptions = {***REMOVED***; ***REMOVED***
        if (dateOptions.isEndExclusive) {
            end = addMs(end, -1);
    ***REMOVED***
        return formatter.formatRange({
            marker: start,
            timeZoneOffset: dateOptions.forcedStartTzo != null ?
                dateOptions.forcedStartTzo :
                this.offsetForMarker(start)
    ***REMOVED***, {
            marker: end,
            timeZoneOffset: dateOptions.forcedEndTzo != null ?
                dateOptions.forcedEndTzo :
                this.offsetForMarker(end)
    ***REMOVED***, this);
***REMOVED***;
    DateEnv.prototype.formatIso = function (marker, extraOptions) {
        if (extraOptions === void 0) { extraOptions = {***REMOVED***; ***REMOVED***
        var timeZoneOffset = null;
        if (!extraOptions.omitTimeZoneOffset) {
            if (extraOptions.forcedTzo != null) {
                timeZoneOffset = extraOptions.forcedTzo;
        ***REMOVED***
            else {
                timeZoneOffset = this.offsetForMarker(marker);
        ***REMOVED***
    ***REMOVED***
        return buildIsoString(marker, timeZoneOffset, extraOptions.omitTime);
***REMOVED***;
    // TimeZone
    DateEnv.prototype.timestampToMarker = function (ms) {
        if (this.timeZone === 'local') {
            return arrayToUtcDate(dateToLocalArray(new Date(ms)));
    ***REMOVED***
        else if (this.timeZone === 'UTC' || !this.namedTimeZoneImpl) {
            return new Date(ms);
    ***REMOVED***
        else {
            return arrayToUtcDate(this.namedTimeZoneImpl.timestampToArray(ms));
    ***REMOVED***
***REMOVED***;
    DateEnv.prototype.offsetForMarker = function (m) {
        if (this.timeZone === 'local') {
            return -arrayToLocalDate(dateToUtcArray(m)).getTimezoneOffset(); // convert "inverse" offset to "normal" offset
    ***REMOVED***
        else if (this.timeZone === 'UTC') {
            return 0;
    ***REMOVED***
        else if (this.namedTimeZoneImpl) {
            return this.namedTimeZoneImpl.offsetForArray(dateToUtcArray(m));
    ***REMOVED***
        return null;
***REMOVED***;
    // Conversion
    DateEnv.prototype.toDate = function (m, forcedTzo) {
        if (this.timeZone === 'local') {
            return arrayToLocalDate(dateToUtcArray(m));
    ***REMOVED***
        else if (this.timeZone === 'UTC') {
            return new Date(m.valueOf()); // make sure it's a copy
    ***REMOVED***
        else if (!this.namedTimeZoneImpl) {
            return new Date(m.valueOf() - (forcedTzo || 0));
    ***REMOVED***
        else {
            return new Date(m.valueOf() -
                this.namedTimeZoneImpl.offsetForArray(dateToUtcArray(m)) * 1000 * 60 // convert minutes -> ms
            );
    ***REMOVED***
***REMOVED***;
    return DateEnv;
***REMOVED***());

var SIMPLE_SOURCE_PROPS = {
    id: String,
    allDayDefault: Boolean,
    eventDataTransform: Function,
    success: Function,
    failure: Function
***REMOVED***;
var uid$2 = 0;
function doesSourceNeedRange(eventSource, calendar) {
    var defs = calendar.pluginSystem.hooks.eventSourceDefs;
    return !defs[eventSource.sourceDefId].ignoreRange;
***REMOVED***
function parseEventSource(raw, calendar) {
    var defs = calendar.pluginSystem.hooks.eventSourceDefs;
    for (var i = defs.length - 1; i >= 0; i--) { // later-added plugins take precedence
        var def = defs[i];
        var meta = def.parseMeta(raw);
        if (meta) {
            var res = parseEventSourceProps(typeof raw === 'object' ? raw : {***REMOVED***, meta, i, calendar);
            res._raw = raw;
            return res;
    ***REMOVED***
***REMOVED***
    return null;
***REMOVED***
function parseEventSourceProps(raw, meta, sourceDefId, calendar) {
    var leftovers0 = {***REMOVED***;
    var props = refineProps(raw, SIMPLE_SOURCE_PROPS, {***REMOVED***, leftovers0);
    var leftovers1 = {***REMOVED***;
    var ui = processUnscopedUiProps(leftovers0, calendar, leftovers1);
    props.isFetching = false;
    props.latestFetchId = '';
    props.fetchRange = null;
    props.publicId = String(raw.id || '');
    props.sourceId = String(uid$2++);
    props.sourceDefId = sourceDefId;
    props.meta = meta;
    props.ui = ui;
    props.extendedProps = leftovers1;
    return props;
***REMOVED***

function reduceEventSources (eventSources, action, dateProfile, calendar) {
    switch (action.type) {
        case 'ADD_EVENT_SOURCES': // already parsed
            return addSources(eventSources, action.sources, dateProfile ? dateProfile.activeRange : null, calendar);
        case 'REMOVE_EVENT_SOURCE':
            return removeSource(eventSources, action.sourceId);
        case 'PREV': // TODO: how do we track all actions that affect dateProfile :(
        case 'NEXT':
        case 'SET_DATE':
        case 'SET_VIEW_TYPE':
            if (dateProfile) {
                return fetchDirtySources(eventSources, dateProfile.activeRange, calendar);
        ***REMOVED***
            else {
                return eventSources;
        ***REMOVED***
        case 'FETCH_EVENT_SOURCES':
        case 'CHANGE_TIMEZONE':
            return fetchSourcesByIds(eventSources, action.sourceIds ?
                arrayToHash(action.sourceIds) :
                excludeStaticSources(eventSources, calendar), dateProfile ? dateProfile.activeRange : null, calendar);
        case 'RECEIVE_EVENTS':
        case 'RECEIVE_EVENT_ERROR':
            return receiveResponse(eventSources, action.sourceId, action.fetchId, action.fetchRange);
        case 'REMOVE_ALL_EVENT_SOURCES':
            return {***REMOVED***;
        default:
            return eventSources;
***REMOVED***
***REMOVED***
var uid$3 = 0;
function addSources(eventSourceHash, sources, fetchRange, calendar) {
    var hash = {***REMOVED***;
    for (var _i = 0, sources_1 = sources; _i < sources_1.length; _i++) {
        var source = sources_1[_i];
        hash[source.sourceId] = source;
***REMOVED***
    if (fetchRange) {
        hash = fetchDirtySources(hash, fetchRange, calendar);
***REMOVED***
    return __assign({***REMOVED***, eventSourceHash, hash);
***REMOVED***
function removeSource(eventSourceHash, sourceId) {
    return filterHash(eventSourceHash, function (eventSource) {
        return eventSource.sourceId !== sourceId;
***REMOVED***);
***REMOVED***
function fetchDirtySources(sourceHash, fetchRange, calendar) {
    return fetchSourcesByIds(sourceHash, filterHash(sourceHash, function (eventSource) {
        return isSourceDirty(eventSource, fetchRange, calendar);
***REMOVED***), fetchRange, calendar);
***REMOVED***
function isSourceDirty(eventSource, fetchRange, calendar) {
    if (!doesSourceNeedRange(eventSource, calendar)) {
        return !eventSource.latestFetchId;
***REMOVED***
    else {
        return !calendar.opt('lazyFetching') ||
            !eventSource.fetchRange ||
            fetchRange.start < eventSource.fetchRange.start ||
            fetchRange.end > eventSource.fetchRange.end;
***REMOVED***
***REMOVED***
function fetchSourcesByIds(prevSources, sourceIdHash, fetchRange, calendar) {
    var nextSources = {***REMOVED***;
    for (var sourceId in prevSources) {
        var source = prevSources[sourceId];
        if (sourceIdHash[sourceId]) {
            nextSources[sourceId] = fetchSource(source, fetchRange, calendar);
    ***REMOVED***
        else {
            nextSources[sourceId] = source;
    ***REMOVED***
***REMOVED***
    return nextSources;
***REMOVED***
function fetchSource(eventSource, fetchRange, calendar) {
    var sourceDef = calendar.pluginSystem.hooks.eventSourceDefs[eventSource.sourceDefId];
    var fetchId = String(uid$3++);
    sourceDef.fetch({
        eventSource: eventSource,
        calendar: calendar,
        range: fetchRange
***REMOVED***, function (res) {
        var rawEvents = res.rawEvents;
        var calSuccess = calendar.opt('eventSourceSuccess');
        var calSuccessRes;
        var sourceSuccessRes;
        if (eventSource.success) {
            sourceSuccessRes = eventSource.success(rawEvents, res.xhr);
    ***REMOVED***
        if (calSuccess) {
            calSuccessRes = calSuccess(rawEvents, res.xhr);
    ***REMOVED***
        rawEvents = sourceSuccessRes || calSuccessRes || rawEvents;
        calendar.dispatch({
            type: 'RECEIVE_EVENTS',
            sourceId: eventSource.sourceId,
            fetchId: fetchId,
            fetchRange: fetchRange,
            rawEvents: rawEvents
    ***REMOVED***);
***REMOVED***, function (error) {
        var callFailure = calendar.opt('eventSourceFailure');
        console.warn(error.message, error);
        if (eventSource.failure) {
            eventSource.failure(error);
    ***REMOVED***
        if (callFailure) {
            callFailure(error);
    ***REMOVED***
        calendar.dispatch({
            type: 'RECEIVE_EVENT_ERROR',
            sourceId: eventSource.sourceId,
            fetchId: fetchId,
            fetchRange: fetchRange,
            error: error
    ***REMOVED***);
***REMOVED***);
    return __assign({***REMOVED***, eventSource, { isFetching: true, latestFetchId: fetchId ***REMOVED***);
***REMOVED***
function receiveResponse(sourceHash, sourceId, fetchId, fetchRange) {
    var _a;
    var eventSource = sourceHash[sourceId];
    if (eventSource && // not already removed
        fetchId === eventSource.latestFetchId) {
        return __assign({***REMOVED***, sourceHash, (_a = {***REMOVED***, _a[sourceId] = __assign({***REMOVED***, eventSource, { isFetching: false, fetchRange: fetchRange ***REMOVED***), _a));
***REMOVED***
    return sourceHash;
***REMOVED***
function excludeStaticSources(eventSources, calendar) {
    return filterHash(eventSources, function (eventSource) {
        return doesSourceNeedRange(eventSource, calendar);
***REMOVED***);
***REMOVED***

var DateProfileGenerator = /** @class */ (function () {
    function DateProfileGenerator(viewSpec, calendar) {
        this.viewSpec = viewSpec;
        this.options = viewSpec.options;
        this.dateEnv = calendar.dateEnv;
        this.calendar = calendar;
        this.initHiddenDays();
***REMOVED***
    /* Date Range Computation
    ------------------------------------------------------------------------------------------------------------------*/
    // Builds a structure with info about what the dates/ranges will be for the "prev" view.
    DateProfileGenerator.prototype.buildPrev = function (currentDateProfile, currentDate) {
        var dateEnv = this.dateEnv;
        var prevDate = dateEnv.subtract(dateEnv.startOf(currentDate, currentDateProfile.currentRangeUnit), // important for start-of-month
        currentDateProfile.dateIncrement);
        return this.build(prevDate, -1);
***REMOVED***;
    // Builds a structure with info about what the dates/ranges will be for the "next" view.
    DateProfileGenerator.prototype.buildNext = function (currentDateProfile, currentDate) {
        var dateEnv = this.dateEnv;
        var nextDate = dateEnv.add(dateEnv.startOf(currentDate, currentDateProfile.currentRangeUnit), // important for start-of-month
        currentDateProfile.dateIncrement);
        return this.build(nextDate, 1);
***REMOVED***;
    // Builds a structure holding dates/ranges for rendering around the given date.
    // Optional direction param indicates whether the date is being incremented/decremented
    // from its previous value. decremented = -1, incremented = 1 (default).
    DateProfileGenerator.prototype.build = function (currentDate, direction, forceToValid) {
        if (forceToValid === void 0) { forceToValid = false; ***REMOVED***
        var validRange;
        var minTime = null;
        var maxTime = null;
        var currentInfo;
        var isRangeAllDay;
        var renderRange;
        var activeRange;
        var isValid;
        validRange = this.buildValidRange();
        validRange = this.trimHiddenDays(validRange);
        if (forceToValid) {
            currentDate = constrainMarkerToRange(currentDate, validRange);
    ***REMOVED***
        currentInfo = this.buildCurrentRangeInfo(currentDate, direction);
        isRangeAllDay = /^(year|month|week|day)$/.test(currentInfo.unit);
        renderRange = this.buildRenderRange(this.trimHiddenDays(currentInfo.range), currentInfo.unit, isRangeAllDay);
        renderRange = this.trimHiddenDays(renderRange);
        activeRange = renderRange;
        if (!this.options.showNonCurrentDates) {
            activeRange = intersectRanges(activeRange, currentInfo.range);
    ***REMOVED***
        minTime = createDuration(this.options.minTime);
        maxTime = createDuration(this.options.maxTime);
        activeRange = this.adjustActiveRange(activeRange, minTime, maxTime);
        activeRange = intersectRanges(activeRange, validRange); // might return null
***REMOVED*** it's invalid if the originally requested date is not contained,
***REMOVED*** or if the range is completely outside of the valid range.
        isValid = rangesIntersect(currentInfo.range, validRange);
        return {
    ***REMOVED*** constraint for where prev/next operations can go and where events can be dragged/resized to.
    ***REMOVED*** an object with optional start and end properties.
            validRange: validRange,
    ***REMOVED*** range the view is formally responsible for.
    ***REMOVED*** for example, a month view might have 1st-31st, excluding padded dates
            currentRange: currentInfo.range,
    ***REMOVED*** name of largest unit being displayed, like "month" or "week"
            currentRangeUnit: currentInfo.unit,
            isRangeAllDay: isRangeAllDay,
    ***REMOVED*** dates that display events and accept drag-n-drop
    ***REMOVED*** will be `null` if no dates accept events
            activeRange: activeRange,
    ***REMOVED*** date range with a rendered skeleton
    ***REMOVED*** includes not-active days that need some sort of DOM
            renderRange: renderRange,
    ***REMOVED*** Duration object that denotes the first visible time of any given day
            minTime: minTime,
    ***REMOVED*** Duration object that denotes the exclusive visible end time of any given day
            maxTime: maxTime,
            isValid: isValid,
    ***REMOVED*** how far the current date will move for a prev/next operation
            dateIncrement: this.buildDateIncrement(currentInfo.duration)
    ***REMOVED*** pass a fallback (might be null) ^
    ***REMOVED***;
***REMOVED***;
    // Builds an object with optional start/end properties.
    // Indicates the minimum/maximum dates to display.
    // not responsible for trimming hidden days.
    DateProfileGenerator.prototype.buildValidRange = function () {
        return this.getRangeOption('validRange', this.calendar.getNow()) ||
            { start: null, end: null ***REMOVED***; // completely open-ended
***REMOVED***;
    // Builds a structure with info about the "current" range, the range that is
    // highlighted as being the current month for example.
    // See build() for a description of `direction`.
    // Guaranteed to have `range` and `unit` properties. `duration` is optional.
    DateProfileGenerator.prototype.buildCurrentRangeInfo = function (date, direction) {
        var _a = this, viewSpec = _a.viewSpec, dateEnv = _a.dateEnv;
        var duration = null;
        var unit = null;
        var range = null;
        var dayCount;
        if (viewSpec.duration) {
            duration = viewSpec.duration;
            unit = viewSpec.durationUnit;
            range = this.buildRangeFromDuration(date, direction, duration, unit);
    ***REMOVED***
        else if ((dayCount = this.options.dayCount)) {
            unit = 'day';
            range = this.buildRangeFromDayCount(date, direction, dayCount);
    ***REMOVED***
        else if ((range = this.buildCustomVisibleRange(date))) {
            unit = dateEnv.greatestWholeUnit(range.start, range.end).unit;
    ***REMOVED***
        else {
            duration = this.getFallbackDuration();
            unit = greatestDurationDenominator(duration).unit;
            range = this.buildRangeFromDuration(date, direction, duration, unit);
    ***REMOVED***
        return { duration: duration, unit: unit, range: range ***REMOVED***;
***REMOVED***;
    DateProfileGenerator.prototype.getFallbackDuration = function () {
        return createDuration({ day: 1 ***REMOVED***);
***REMOVED***;
    // Returns a new activeRange to have time values (un-ambiguate)
    // minTime or maxTime causes the range to expand.
    DateProfileGenerator.prototype.adjustActiveRange = function (range, minTime, maxTime) {
        var dateEnv = this.dateEnv;
        var start = range.start;
        var end = range.end;
        if (this.viewSpec.class.prototype.usesMinMaxTime) {
    ***REMOVED*** expand active range if minTime is negative (why not when positive?)
            if (asRoughDays(minTime) < 0) {
                start = startOfDay(start); // necessary?
                start = dateEnv.add(start, minTime);
        ***REMOVED***
    ***REMOVED*** expand active range if maxTime is beyond one day (why not when positive?)
            if (asRoughDays(maxTime) > 1) {
                end = startOfDay(end); // necessary?
                end = addDays(end, -1);
                end = dateEnv.add(end, maxTime);
        ***REMOVED***
    ***REMOVED***
        return { start: start, end: end ***REMOVED***;
***REMOVED***;
    // Builds the "current" range when it is specified as an explicit duration.
    // `unit` is the already-computed greatestDurationDenominator unit of duration.
    DateProfileGenerator.prototype.buildRangeFromDuration = function (date, direction, duration, unit) {
        var dateEnv = this.dateEnv;
        var alignment = this.options.dateAlignment;
        var dateIncrementInput;
        var dateIncrementDuration;
        var start;
        var end;
        var res;
***REMOVED*** compute what the alignment should be
        if (!alignment) {
            dateIncrementInput = this.options.dateIncrement;
            if (dateIncrementInput) {
                dateIncrementDuration = createDuration(dateIncrementInput);
        ***REMOVED*** use the smaller of the two units
                if (asRoughMs(dateIncrementDuration) < asRoughMs(duration)) {
                    alignment = greatestDurationDenominator(dateIncrementDuration, !getWeeksFromInput(dateIncrementInput)).unit;
            ***REMOVED***
                else {
                    alignment = unit;
            ***REMOVED***
        ***REMOVED***
            else {
                alignment = unit;
        ***REMOVED***
    ***REMOVED***
***REMOVED*** if the view displays a single day or smaller
        if (asRoughDays(duration) <= 1) {
            if (this.isHiddenDay(start)) {
                start = this.skipHiddenDays(start, direction);
                start = startOfDay(start);
        ***REMOVED***
    ***REMOVED***
        function computeRes() {
            start = dateEnv.startOf(date, alignment);
            end = dateEnv.add(start, duration);
            res = { start: start, end: end ***REMOVED***;
    ***REMOVED***
        computeRes();
***REMOVED*** if range is completely enveloped by hidden days, go past the hidden days
        if (!this.trimHiddenDays(res)) {
            date = this.skipHiddenDays(date, direction);
            computeRes();
    ***REMOVED***
        return res;
***REMOVED***;
    // Builds the "current" range when a dayCount is specified.
    DateProfileGenerator.prototype.buildRangeFromDayCount = function (date, direction, dayCount) {
        var dateEnv = this.dateEnv;
        var customAlignment = this.options.dateAlignment;
        var runningCount = 0;
        var start = date;
        var end;
        if (customAlignment) {
            start = dateEnv.startOf(start, customAlignment);
    ***REMOVED***
        start = startOfDay(start);
        start = this.skipHiddenDays(start, direction);
        end = start;
        do {
            end = addDays(end, 1);
            if (!this.isHiddenDay(end)) {
                runningCount++;
        ***REMOVED***
    ***REMOVED*** while (runningCount < dayCount);
        return { start: start, end: end ***REMOVED***;
***REMOVED***;
    // Builds a normalized range object for the "visible" range,
    // which is a way to define the currentRange and activeRange at the same time.
    DateProfileGenerator.prototype.buildCustomVisibleRange = function (date) {
        var dateEnv = this.dateEnv;
        var visibleRange = this.getRangeOption('visibleRange', dateEnv.toDate(date));
        if (visibleRange && (visibleRange.start == null || visibleRange.end == null)) {
            return null;
    ***REMOVED***
        return visibleRange;
***REMOVED***;
    // Computes the range that will represent the element/cells for *rendering*,
    // but which may have voided days/times.
    // not responsible for trimming hidden days.
    DateProfileGenerator.prototype.buildRenderRange = function (currentRange, currentRangeUnit, isRangeAllDay) {
        return currentRange;
***REMOVED***;
    // Compute the duration value that should be added/substracted to the current date
    // when a prev/next operation happens.
    DateProfileGenerator.prototype.buildDateIncrement = function (fallback) {
        var dateIncrementInput = this.options.dateIncrement;
        var customAlignment;
        if (dateIncrementInput) {
            return createDuration(dateIncrementInput);
    ***REMOVED***
        else if ((customAlignment = this.options.dateAlignment)) {
            return createDuration(1, customAlignment);
    ***REMOVED***
        else if (fallback) {
            return fallback;
    ***REMOVED***
        else {
            return createDuration({ days: 1 ***REMOVED***);
    ***REMOVED***
***REMOVED***;
    // Arguments after name will be forwarded to a hypothetical function value
    // WARNING: passed-in arguments will be given to generator functions as-is and can cause side-effects.
    // Always clone your objects if you fear mutation.
    DateProfileGenerator.prototype.getRangeOption = function (name) {
        var otherArgs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            otherArgs[_i - 1] = arguments[_i];
    ***REMOVED***
        var val = this.options[name];
        if (typeof val === 'function') {
            val = val.apply(null, otherArgs);
    ***REMOVED***
        if (val) {
            val = parseRange(val, this.dateEnv);
    ***REMOVED***
        if (val) {
            val = computeVisibleDayRange(val);
    ***REMOVED***
        return val;
***REMOVED***;
    /* Hidden Days
    ------------------------------------------------------------------------------------------------------------------*/
    // Initializes internal variables related to calculating hidden days-of-week
    DateProfileGenerator.prototype.initHiddenDays = function () {
        var hiddenDays = this.options.hiddenDays || []; // array of day-of-week indices that are hidden
        var isHiddenDayHash = []; // is the day-of-week hidden? (hash with day-of-week-index -> bool)
        var dayCnt = 0;
        var i;
        if (this.options.weekends === false) {
            hiddenDays.push(0, 6); // 0=sunday, 6=saturday
    ***REMOVED***
        for (i = 0; i < 7; i++) {
            if (!(isHiddenDayHash[i] = hiddenDays.indexOf(i) !== -1)) {
                dayCnt++;
        ***REMOVED***
    ***REMOVED***
        if (!dayCnt) {
            throw new Error('invalid hiddenDays'); // all days were hidden? bad.
    ***REMOVED***
        this.isHiddenDayHash = isHiddenDayHash;
***REMOVED***;
    // Remove days from the beginning and end of the range that are computed as hidden.
    // If the whole range is trimmed off, returns null
    DateProfileGenerator.prototype.trimHiddenDays = function (range) {
        var start = range.start;
        var end = range.end;
        if (start) {
            start = this.skipHiddenDays(start);
    ***REMOVED***
        if (end) {
            end = this.skipHiddenDays(end, -1, true);
    ***REMOVED***
        if (start == null || end == null || start < end) {
            return { start: start, end: end ***REMOVED***;
    ***REMOVED***
        return null;
***REMOVED***;
    // Is the current day hidden?
    // `day` is a day-of-week index (0-6), or a Date (used for UTC)
    DateProfileGenerator.prototype.isHiddenDay = function (day) {
        if (day instanceof Date) {
            day = day.getUTCDay();
    ***REMOVED***
        return this.isHiddenDayHash[day];
***REMOVED***;
    // Incrementing the current day until it is no longer a hidden day, returning a copy.
    // DOES NOT CONSIDER validRange!
    // If the initial value of `date` is not a hidden day, don't do anything.
    // Pass `isExclusive` as `true` if you are dealing with an end date.
    // `inc` defaults to `1` (increment one day forward each time)
    DateProfileGenerator.prototype.skipHiddenDays = function (date, inc, isExclusive) {
        if (inc === void 0) { inc = 1; ***REMOVED***
        if (isExclusive === void 0) { isExclusive = false; ***REMOVED***
        while (this.isHiddenDayHash[(date.getUTCDay() + (isExclusive ? inc : 0) + 7) % 7]) {
            date = addDays(date, inc);
    ***REMOVED***
        return date;
***REMOVED***;
    return DateProfileGenerator;
***REMOVED***());
// TODO: find a way to avoid comparing DateProfiles. it's tedious
function isDateProfilesEqual(p0, p1) {
    return rangesEqual(p0.validRange, p1.validRange) &&
        rangesEqual(p0.activeRange, p1.activeRange) &&
        rangesEqual(p0.renderRange, p1.renderRange) &&
        durationsEqual(p0.minTime, p1.minTime) &&
        durationsEqual(p0.maxTime, p1.maxTime);
    /*
    TODO: compare more?
      currentRange: DateRange
      currentRangeUnit: string
      isRangeAllDay: boolean
      isValid: boolean
      dateIncrement: Duration
    */
***REMOVED***

function reduce (state, action, calendar) {
    var viewType = reduceViewType(state.viewType, action);
    var dateProfile = reduceDateProfile(state.dateProfile, action, state.currentDate, viewType, calendar);
    var eventSources = reduceEventSources(state.eventSources, action, dateProfile, calendar);
    var nextState = __assign({***REMOVED***, state, { viewType: viewType,
        dateProfile: dateProfile, currentDate: reduceCurrentDate(state.currentDate, action, dateProfile), eventSources: eventSources, eventStore: reduceEventStore(state.eventStore, action, eventSources, dateProfile, calendar), dateSelection: reduceDateSelection(state.dateSelection, action, calendar), eventSelection: reduceSelectedEvent(state.eventSelection, action), eventDrag: reduceEventDrag(state.eventDrag, action, eventSources, calendar), eventResize: reduceEventResize(state.eventResize, action, eventSources, calendar), eventSourceLoadingLevel: computeLoadingLevel(eventSources), loadingLevel: computeLoadingLevel(eventSources) ***REMOVED***);
    for (var _i = 0, _a = calendar.pluginSystem.hooks.reducers; _i < _a.length; _i++) {
        var reducerFunc = _a[_i];
        nextState = reducerFunc(nextState, action, calendar);
***REMOVED***
    // console.log(action.type, nextState)
    return nextState;
***REMOVED***
function reduceViewType(currentViewType, action) {
    switch (action.type) {
        case 'SET_VIEW_TYPE':
            return action.viewType;
        default:
            return currentViewType;
***REMOVED***
***REMOVED***
function reduceDateProfile(currentDateProfile, action, currentDate, viewType, calendar) {
    var newDateProfile;
    switch (action.type) {
        case 'PREV':
            newDateProfile = calendar.dateProfileGenerators[viewType].buildPrev(currentDateProfile, currentDate);
            break;
        case 'NEXT':
            newDateProfile = calendar.dateProfileGenerators[viewType].buildNext(currentDateProfile, currentDate);
            break;
        case 'SET_DATE':
            if (!currentDateProfile.activeRange ||
                !rangeContainsMarker(currentDateProfile.currentRange, action.dateMarker)) {
                newDateProfile = calendar.dateProfileGenerators[viewType].build(action.dateMarker, undefined, true // forceToValid
                );
        ***REMOVED***
            break;
        case 'SET_VIEW_TYPE':
            var generator = calendar.dateProfileGenerators[viewType];
            if (!generator) {
                throw new Error(viewType ?
                    'The FullCalendar view "' + viewType + '" does not exist. Make sure your plugins are loaded correctly.' :
                    'No available FullCalendar view plugins.');
        ***REMOVED***
            newDateProfile = generator.build(action.dateMarker || currentDate, undefined, true // forceToValid
            );
            break;
***REMOVED***
    if (newDateProfile &&
        newDateProfile.isValid &&
        !(currentDateProfile && isDateProfilesEqual(currentDateProfile, newDateProfile))) {
        return newDateProfile;
***REMOVED***
    else {
        return currentDateProfile;
***REMOVED***
***REMOVED***
function reduceCurrentDate(currentDate, action, dateProfile) {
    switch (action.type) {
        case 'PREV':
        case 'NEXT':
            if (!rangeContainsMarker(dateProfile.currentRange, currentDate)) {
                return dateProfile.currentRange.start;
        ***REMOVED***
            else {
                return currentDate;
        ***REMOVED***
        case 'SET_DATE':
        case 'SET_VIEW_TYPE':
            var newDate = action.dateMarker || currentDate;
            if (dateProfile.activeRange && !rangeContainsMarker(dateProfile.activeRange, newDate)) {
                return dateProfile.currentRange.start;
        ***REMOVED***
            else {
                return newDate;
        ***REMOVED***
        default:
            return currentDate;
***REMOVED***
***REMOVED***
function reduceDateSelection(currentSelection, action, calendar) {
    switch (action.type) {
        case 'SELECT_DATES':
            return action.selection;
        case 'UNSELECT_DATES':
            return null;
        default:
            return currentSelection;
***REMOVED***
***REMOVED***
function reduceSelectedEvent(currentInstanceId, action) {
    switch (action.type) {
        case 'SELECT_EVENT':
            return action.eventInstanceId;
        case 'UNSELECT_EVENT':
            return '';
        default:
            return currentInstanceId;
***REMOVED***
***REMOVED***
function reduceEventDrag(currentDrag, action, sources, calendar) {
    switch (action.type) {
        case 'SET_EVENT_DRAG':
            var newDrag = action.state;
            return {
                affectedEvents: newDrag.affectedEvents,
                mutatedEvents: newDrag.mutatedEvents,
                isEvent: newDrag.isEvent,
                origSeg: newDrag.origSeg
        ***REMOVED***;
        case 'UNSET_EVENT_DRAG':
            return null;
        default:
            return currentDrag;
***REMOVED***
***REMOVED***
function reduceEventResize(currentResize, action, sources, calendar) {
    switch (action.type) {
        case 'SET_EVENT_RESIZE':
            var newResize = action.state;
            return {
                affectedEvents: newResize.affectedEvents,
                mutatedEvents: newResize.mutatedEvents,
                isEvent: newResize.isEvent,
                origSeg: newResize.origSeg
        ***REMOVED***;
        case 'UNSET_EVENT_RESIZE':
            return null;
        default:
            return currentResize;
***REMOVED***
***REMOVED***
function computeLoadingLevel(eventSources) {
    var cnt = 0;
    for (var sourceId in eventSources) {
        if (eventSources[sourceId].isFetching) {
            cnt++;
    ***REMOVED***
***REMOVED***
    return cnt;
***REMOVED***

var STANDARD_PROPS = {
    start: null,
    end: null,
    allDay: Boolean
***REMOVED***;
function parseDateSpan(raw, dateEnv, defaultDuration) {
    var span = parseOpenDateSpan(raw, dateEnv);
    var range = span.range;
    if (!range.start) {
        return null;
***REMOVED***
    if (!range.end) {
        if (defaultDuration == null) {
            return null;
    ***REMOVED***
        else {
            range.end = dateEnv.add(range.start, defaultDuration);
    ***REMOVED***
***REMOVED***
    return span;
***REMOVED***
/*
TODO: somehow combine with parseRange?
Will return null if the start/end props were present but parsed invalidly.
*/
function parseOpenDateSpan(raw, dateEnv) {
    var leftovers = {***REMOVED***;
    var standardProps = refineProps(raw, STANDARD_PROPS, {***REMOVED***, leftovers);
    var startMeta = standardProps.start ? dateEnv.createMarkerMeta(standardProps.start) : null;
    var endMeta = standardProps.end ? dateEnv.createMarkerMeta(standardProps.end) : null;
    var allDay = standardProps.allDay;
    if (allDay == null) {
        allDay = (startMeta && startMeta.isTimeUnspecified) &&
            (!endMeta || endMeta.isTimeUnspecified);
***REMOVED***
    // use this leftover object as the selection object
    leftovers.range = {
        start: startMeta ? startMeta.marker : null,
        end: endMeta ? endMeta.marker : null
***REMOVED***;
    leftovers.allDay = allDay;
    return leftovers;
***REMOVED***
function isDateSpansEqual(span0, span1) {
    return rangesEqual(span0.range, span1.range) &&
        span0.allDay === span1.allDay &&
        isSpanPropsEqual(span0, span1);
***REMOVED***
// the NON-DATE-RELATED props
function isSpanPropsEqual(span0, span1) {
    for (var propName in span1) {
        if (propName !== 'range' && propName !== 'allDay') {
            if (span0[propName] !== span1[propName]) {
                return false;
        ***REMOVED***
    ***REMOVED***
***REMOVED***
    // are there any props that span0 has that span1 DOESN'T have?
    // both have range/allDay, so no need to special-case.
    for (var propName in span0) {
        if (!(propName in span1)) {
            return false;
    ***REMOVED***
***REMOVED***
    return true;
***REMOVED***
function buildDateSpanApi(span, dateEnv) {
    return {
        start: dateEnv.toDate(span.range.start),
        end: dateEnv.toDate(span.range.end),
        startStr: dateEnv.formatIso(span.range.start, { omitTime: span.allDay ***REMOVED***),
        endStr: dateEnv.formatIso(span.range.end, { omitTime: span.allDay ***REMOVED***),
        allDay: span.allDay
***REMOVED***;
***REMOVED***
function buildDatePointApi(span, dateEnv) {
    return {
        date: dateEnv.toDate(span.range.start),
        dateStr: dateEnv.formatIso(span.range.start, { omitTime: span.allDay ***REMOVED***),
        allDay: span.allDay
***REMOVED***;
***REMOVED***
function fabricateEventRange(dateSpan, eventUiBases, calendar) {
    var def = parseEventDef({ editable: false ***REMOVED***, '', // sourceId
    dateSpan.allDay, true, // hasEnd
    calendar);
    return {
        def: def,
        ui: compileEventUi(def, eventUiBases),
        instance: createEventInstance(def.defId, dateSpan.range),
        range: dateSpan.range,
        isStart: true,
        isEnd: true
***REMOVED***;
***REMOVED***

function compileViewDefs(defaultConfigs, overrideConfigs) {
    var hash = {***REMOVED***;
    var viewType;
    for (viewType in defaultConfigs) {
        ensureViewDef(viewType, hash, defaultConfigs, overrideConfigs);
***REMOVED***
    for (viewType in overrideConfigs) {
        ensureViewDef(viewType, hash, defaultConfigs, overrideConfigs);
***REMOVED***
    return hash;
***REMOVED***
function ensureViewDef(viewType, hash, defaultConfigs, overrideConfigs) {
    if (hash[viewType]) {
        return hash[viewType];
***REMOVED***
    var viewDef = buildViewDef(viewType, hash, defaultConfigs, overrideConfigs);
    if (viewDef) {
        hash[viewType] = viewDef;
***REMOVED***
    return viewDef;
***REMOVED***
function buildViewDef(viewType, hash, defaultConfigs, overrideConfigs) {
    var defaultConfig = defaultConfigs[viewType];
    var overrideConfig = overrideConfigs[viewType];
    var queryProp = function (name) {
        return (defaultConfig && defaultConfig[name] !== null) ? defaultConfig[name] :
            ((overrideConfig && overrideConfig[name] !== null) ? overrideConfig[name] : null);
***REMOVED***;
    var theClass = queryProp('class');
    var superType = queryProp('superType');
    if (!superType && theClass) {
        superType =
            findViewNameBySubclass(theClass, overrideConfigs) ||
                findViewNameBySubclass(theClass, defaultConfigs);
***REMOVED***
    var superDef = null;
    if (superType) {
        if (superType === viewType) {
            throw new Error('Can\'t have a custom view type that references itself');
    ***REMOVED***
        superDef = ensureViewDef(superType, hash, defaultConfigs, overrideConfigs);
***REMOVED***
    if (!theClass && superDef) {
        theClass = superDef.class;
***REMOVED***
    if (!theClass) {
        return null; // don't throw a warning, might be settings for a single-unit view
***REMOVED***
    return {
        type: viewType,
        class: theClass,
        defaults: __assign({***REMOVED***, (superDef ? superDef.defaults : {***REMOVED***), (defaultConfig ? defaultConfig.options : {***REMOVED***)),
        overrides: __assign({***REMOVED***, (superDef ? superDef.overrides : {***REMOVED***), (overrideConfig ? overrideConfig.options : {***REMOVED***))
***REMOVED***;
***REMOVED***
function findViewNameBySubclass(viewSubclass, configs) {
    var superProto = Object.getPrototypeOf(viewSubclass.prototype);
    for (var viewType in configs) {
        var parsed = configs[viewType];
***REMOVED*** need DIRECT subclass, so instanceof won't do it
        if (parsed.class && parsed.class.prototype === superProto) {
            return viewType;
    ***REMOVED***
***REMOVED***
    return '';
***REMOVED***

function parseViewConfigs(inputs) {
    return mapHash(inputs, parseViewConfig);
***REMOVED***
var VIEW_DEF_PROPS = {
    type: String,
    class: null
***REMOVED***;
function parseViewConfig(input) {
    if (typeof input === 'function') {
        input = { class: input ***REMOVED***;
***REMOVED***
    var options = {***REMOVED***;
    var props = refineProps(input, VIEW_DEF_PROPS, {***REMOVED***, options);
    return {
        superType: props.type,
        class: props.class,
        options: options
***REMOVED***;
***REMOVED***

function buildViewSpecs(defaultInputs, optionsManager) {
    var defaultConfigs = parseViewConfigs(defaultInputs);
    var overrideConfigs = parseViewConfigs(optionsManager.overrides.views);
    var viewDefs = compileViewDefs(defaultConfigs, overrideConfigs);
    return mapHash(viewDefs, function (viewDef) {
        return buildViewSpec(viewDef, overrideConfigs, optionsManager);
***REMOVED***);
***REMOVED***
function buildViewSpec(viewDef, overrideConfigs, optionsManager) {
    var durationInput = viewDef.overrides.duration ||
        viewDef.defaults.duration ||
        optionsManager.dynamicOverrides.duration ||
        optionsManager.overrides.duration;
    var duration = null;
    var durationUnit = '';
    var singleUnit = '';
    var singleUnitOverrides = {***REMOVED***;
    if (durationInput) {
        duration = createDuration(durationInput);
        if (duration) { // valid?
            var denom = greatestDurationDenominator(duration, !getWeeksFromInput(durationInput));
            durationUnit = denom.unit;
            if (denom.value === 1) {
                singleUnit = durationUnit;
                singleUnitOverrides = overrideConfigs[durationUnit] ? overrideConfigs[durationUnit].options : {***REMOVED***;
        ***REMOVED***
    ***REMOVED***
***REMOVED***
    var queryButtonText = function (options) {
        var buttonTextMap = options.buttonText || {***REMOVED***;
        var buttonTextKey = viewDef.defaults.buttonTextKey;
        if (buttonTextKey != null && buttonTextMap[buttonTextKey] != null) {
            return buttonTextMap[buttonTextKey];
    ***REMOVED***
        if (buttonTextMap[viewDef.type] != null) {
            return buttonTextMap[viewDef.type];
    ***REMOVED***
        if (buttonTextMap[singleUnit] != null) {
            return buttonTextMap[singleUnit];
    ***REMOVED***
***REMOVED***;
    return {
        type: viewDef.type,
        class: viewDef.class,
        duration: duration,
        durationUnit: durationUnit,
        singleUnit: singleUnit,
        options: __assign({***REMOVED***, globalDefaults, viewDef.defaults, optionsManager.dirDefaults, optionsManager.localeDefaults, optionsManager.overrides, singleUnitOverrides, viewDef.overrides, optionsManager.dynamicOverrides),
        buttonTextOverride: queryButtonText(optionsManager.dynamicOverrides) ||
            queryButtonText(optionsManager.overrides) || // constructor-specified buttonText lookup hash takes precedence
            viewDef.overrides.buttonText,
        buttonTextDefault: queryButtonText(optionsManager.localeDefaults) ||
            queryButtonText(optionsManager.dirDefaults) ||
            viewDef.defaults.buttonText ||
            queryButtonText(globalDefaults) ||
            viewDef.type // fall back to given view name
***REMOVED***;
***REMOVED***

var Toolbar = /** @class */ (function (_super) {
    __extends(Toolbar, _super);
    function Toolbar(context, extraClassName) {
        var _this = _super.call(this, context) || this;
        _this._renderLayout = memoizeRendering(_this.renderLayout, _this.unrenderLayout);
        _this._updateTitle = memoizeRendering(_this.updateTitle, null, [_this._renderLayout]);
        _this._updateActiveButton = memoizeRendering(_this.updateActiveButton, null, [_this._renderLayout]);
        _this._updateToday = memoizeRendering(_this.updateToday, null, [_this._renderLayout]);
        _this._updatePrev = memoizeRendering(_this.updatePrev, null, [_this._renderLayout]);
        _this._updateNext = memoizeRendering(_this.updateNext, null, [_this._renderLayout]);
        _this.el = createElement('div', { className: 'fc-toolbar ' + extraClassName ***REMOVED***);
        return _this;
***REMOVED***
    Toolbar.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this._renderLayout.unrender(); // should unrender everything else
        removeElement(this.el);
***REMOVED***;
    Toolbar.prototype.render = function (props) {
        this._renderLayout(props.layout);
        this._updateTitle(props.title);
        this._updateActiveButton(props.activeButton);
        this._updateToday(props.isTodayEnabled);
        this._updatePrev(props.isPrevEnabled);
        this._updateNext(props.isNextEnabled);
***REMOVED***;
    Toolbar.prototype.renderLayout = function (layout) {
        var el = this.el;
        this.viewsWithButtons = [];
        appendToElement(el, this.renderSection('left', layout.left));
        appendToElement(el, this.renderSection('center', layout.center));
        appendToElement(el, this.renderSection('right', layout.right));
***REMOVED***;
    Toolbar.prototype.unrenderLayout = function () {
        this.el.innerHTML = '';
***REMOVED***;
    Toolbar.prototype.renderSection = function (position, buttonStr) {
        var _this = this;
        var _a = this, theme = _a.theme, calendar = _a.calendar;
        var optionsManager = calendar.optionsManager;
        var viewSpecs = calendar.viewSpecs;
        var sectionEl = createElement('div', { className: 'fc-' + position ***REMOVED***);
        var calendarCustomButtons = optionsManager.computed.customButtons || {***REMOVED***;
        var calendarButtonTextOverrides = optionsManager.overrides.buttonText || {***REMOVED***;
        var calendarButtonText = optionsManager.computed.buttonText || {***REMOVED***;
        if (buttonStr) {
            buttonStr.split(' ').forEach(function (buttonGroupStr, i) {
                var groupChildren = [];
                var isOnlyButtons = true;
                var groupEl;
                buttonGroupStr.split(',').forEach(function (buttonName, j) {
                    var customButtonProps;
                    var viewSpec;
                    var buttonClick;
                    var buttonIcon; // only one of these will be set
                    var buttonText; // "
                    var buttonInnerHtml;
                    var buttonClasses;
                    var buttonEl;
                    var buttonAriaAttr;
                    if (buttonName === 'title') {
                        groupChildren.push(htmlToElement('<h2>&nbsp;</h2>')); // we always want it to take up height
                        isOnlyButtons = false;
                ***REMOVED***
                    else {
                        if ((customButtonProps = calendarCustomButtons[buttonName])) {
                            buttonClick = function (ev) {
                                if (customButtonProps.click) {
                                    customButtonProps.click.call(buttonEl, ev);
                            ***REMOVED***
                        ***REMOVED***;
                            (buttonIcon = theme.getCustomButtonIconClass(customButtonProps)) ||
                                (buttonIcon = theme.getIconClass(buttonName)) ||
                                (buttonText = customButtonProps.text);
                    ***REMOVED***
                        else if ((viewSpec = viewSpecs[buttonName])) {
                            _this.viewsWithButtons.push(buttonName);
                            buttonClick = function () {
                                calendar.changeView(buttonName);
                        ***REMOVED***;
                            (buttonText = viewSpec.buttonTextOverride) ||
                                (buttonIcon = theme.getIconClass(buttonName)) ||
                                (buttonText = viewSpec.buttonTextDefault);
                    ***REMOVED***
                        else if (calendar[buttonName]) { // a calendar method
                            buttonClick = function () {
                                calendar[buttonName]();
                        ***REMOVED***;
                            (buttonText = calendarButtonTextOverrides[buttonName]) ||
                                (buttonIcon = theme.getIconClass(buttonName)) ||
                                (buttonText = calendarButtonText[buttonName]);
                    ***REMOVED***            ^ everything else is considered default
                    ***REMOVED***
                        if (buttonClick) {
                            buttonClasses = [
                                'fc-' + buttonName + '-button',
                                theme.getClass('button')
                            ];
                            if (buttonText) {
                                buttonInnerHtml = htmlEscape(buttonText);
                                buttonAriaAttr = '';
                        ***REMOVED***
                            else if (buttonIcon) {
                                buttonInnerHtml = "<span class='" + buttonIcon + "'></span>";
                                buttonAriaAttr = ' aria-label="' + buttonName + '"';
                        ***REMOVED***
                            buttonEl = htmlToElement(// type="button" so that it doesn't submit a form
                            '<button type="button" class="' + buttonClasses.join(' ') + '"' +
                                buttonAriaAttr +
                                '>' + buttonInnerHtml + '</button>');
                            buttonEl.addEventListener('click', buttonClick);
                            groupChildren.push(buttonEl);
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***);
                if (groupChildren.length > 1) {
                    groupEl = document.createElement('div');
                    var buttonGroupClassName = theme.getClass('buttonGroup');
                    if (isOnlyButtons && buttonGroupClassName) {
                        groupEl.classList.add(buttonGroupClassName);
                ***REMOVED***
                    appendToElement(groupEl, groupChildren);
                    sectionEl.appendChild(groupEl);
            ***REMOVED***
                else {
                    appendToElement(sectionEl, groupChildren); // 1 or 0 children
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***
        return sectionEl;
***REMOVED***;
    Toolbar.prototype.updateToday = function (isTodayEnabled) {
        this.toggleButtonEnabled('today', isTodayEnabled);
***REMOVED***;
    Toolbar.prototype.updatePrev = function (isPrevEnabled) {
        this.toggleButtonEnabled('prev', isPrevEnabled);
***REMOVED***;
    Toolbar.prototype.updateNext = function (isNextEnabled) {
        this.toggleButtonEnabled('next', isNextEnabled);
***REMOVED***;
    Toolbar.prototype.updateTitle = function (text) {
        findElements(this.el, 'h2').forEach(function (titleEl) {
            titleEl.innerText = text;
    ***REMOVED***);
***REMOVED***;
    Toolbar.prototype.updateActiveButton = function (buttonName) {
        var className = this.theme.getClass('buttonActive');
        findElements(this.el, 'button').forEach(function (buttonEl) {
            if (buttonName && buttonEl.classList.contains('fc-' + buttonName + '-button')) {
                buttonEl.classList.add(className);
        ***REMOVED***
            else {
                buttonEl.classList.remove(className);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***;
    Toolbar.prototype.toggleButtonEnabled = function (buttonName, bool) {
        findElements(this.el, '.fc-' + buttonName + '-button').forEach(function (buttonEl) {
            buttonEl.disabled = !bool;
    ***REMOVED***);
***REMOVED***;
    return Toolbar;
***REMOVED***(Component));

var CalendarComponent = /** @class */ (function (_super) {
    __extends(CalendarComponent, _super);
    function CalendarComponent(context, el) {
        var _this = _super.call(this, context) || this;
        _this._renderToolbars = memoizeRendering(_this.renderToolbars);
        _this.buildViewPropTransformers = memoize(buildViewPropTransformers);
        _this.el = el;
        prependToElement(el, _this.contentEl = createElement('div', { className: 'fc-view-container' ***REMOVED***));
        var calendar = _this.calendar;
        for (var _i = 0, _a = calendar.pluginSystem.hooks.viewContainerModifiers; _i < _a.length; _i++) {
            var modifyViewContainer = _a[_i];
            modifyViewContainer(_this.contentEl, calendar);
    ***REMOVED***
        _this.toggleElClassNames(true);
        _this.computeTitle = memoize(computeTitle);
        _this.parseBusinessHours = memoize(function (input) {
            return parseBusinessHours(input, _this.calendar);
    ***REMOVED***);
        return _this;
***REMOVED***
    CalendarComponent.prototype.destroy = function () {
        if (this.header) {
            this.header.destroy();
    ***REMOVED***
        if (this.footer) {
            this.footer.destroy();
    ***REMOVED***
        if (this.view) {
            this.view.destroy();
    ***REMOVED***
        removeElement(this.contentEl);
        this.toggleElClassNames(false);
        _super.prototype.destroy.call(this);
***REMOVED***;
    CalendarComponent.prototype.toggleElClassNames = function (bool) {
        var classList = this.el.classList;
        var dirClassName = 'fc-' + this.opt('dir');
        var themeClassName = this.theme.getClass('widget');
        if (bool) {
            classList.add('fc');
            classList.add(dirClassName);
            classList.add(themeClassName);
    ***REMOVED***
        else {
            classList.remove('fc');
            classList.remove(dirClassName);
            classList.remove(themeClassName);
    ***REMOVED***
***REMOVED***;
    CalendarComponent.prototype.render = function (props) {
        this.freezeHeight();
        var title = this.computeTitle(props.dateProfile, props.viewSpec.options);
        this._renderToolbars(props.viewSpec, props.dateProfile, props.currentDate, props.dateProfileGenerator, title);
        this.renderView(props, title);
        this.updateSize();
        this.thawHeight();
***REMOVED***;
    CalendarComponent.prototype.renderToolbars = function (viewSpec, dateProfile, currentDate, dateProfileGenerator, title) {
        var headerLayout = this.opt('header');
        var footerLayout = this.opt('footer');
        var now = this.calendar.getNow();
        var todayInfo = dateProfileGenerator.build(now);
        var prevInfo = dateProfileGenerator.buildPrev(dateProfile, currentDate);
        var nextInfo = dateProfileGenerator.buildNext(dateProfile, currentDate);
        var toolbarProps = {
            title: title,
            activeButton: viewSpec.type,
            isTodayEnabled: todayInfo.isValid && !rangeContainsMarker(dateProfile.currentRange, now),
            isPrevEnabled: prevInfo.isValid,
            isNextEnabled: nextInfo.isValid
    ***REMOVED***;
        if (headerLayout) {
            if (!this.header) {
                this.header = new Toolbar(this.context, 'fc-header-toolbar');
                prependToElement(this.el, this.header.el);
        ***REMOVED***
            this.header.receiveProps(__assign({ layout: headerLayout ***REMOVED***, toolbarProps));
    ***REMOVED***
        else if (this.header) {
            this.header.destroy();
            this.header = null;
    ***REMOVED***
        if (footerLayout) {
            if (!this.footer) {
                this.footer = new Toolbar(this.context, 'fc-footer-toolbar');
                appendToElement(this.el, this.footer.el);
        ***REMOVED***
            this.footer.receiveProps(__assign({ layout: footerLayout ***REMOVED***, toolbarProps));
    ***REMOVED***
        else if (this.footer) {
            this.footer.destroy();
            this.footer = null;
    ***REMOVED***
***REMOVED***;
    CalendarComponent.prototype.renderView = function (props, title) {
        var view = this.view;
        var viewSpec = props.viewSpec, dateProfileGenerator = props.dateProfileGenerator;
        if (!view || view.viewSpec !== viewSpec) {
            if (view) {
                view.destroy();
        ***REMOVED***
            view = this.view = new viewSpec['class']({
                calendar: this.calendar,
                view: null,
                dateEnv: this.dateEnv,
                theme: this.theme,
                options: viewSpec.options
        ***REMOVED***, viewSpec, dateProfileGenerator, this.contentEl);
    ***REMOVED***
        else {
            view.addScroll(view.queryScroll());
    ***REMOVED***
        view.title = title; // for the API
        var viewProps = {
            dateProfile: props.dateProfile,
            businessHours: this.parseBusinessHours(viewSpec.options.businessHours),
            eventStore: props.eventStore,
            eventUiBases: props.eventUiBases,
            dateSelection: props.dateSelection,
            eventSelection: props.eventSelection,
            eventDrag: props.eventDrag,
            eventResize: props.eventResize
    ***REMOVED***;
        var transformers = this.buildViewPropTransformers(this.calendar.pluginSystem.hooks.viewPropsTransformers);
        for (var _i = 0, transformers_1 = transformers; _i < transformers_1.length; _i++) {
            var transformer = transformers_1[_i];
            __assign(viewProps, transformer.transform(viewProps, viewSpec, props, view));
    ***REMOVED***
        view.receiveProps(viewProps);
***REMOVED***;
    // Sizing
    // -----------------------------------------------------------------------------------------------------------------
    CalendarComponent.prototype.updateSize = function (isResize) {
        if (isResize === void 0) { isResize = false; ***REMOVED***
        var view = this.view;
        if (isResize) {
            view.addScroll(view.queryScroll());
    ***REMOVED***
        if (isResize || this.isHeightAuto == null) {
            this.computeHeightVars();
    ***REMOVED***
        view.updateSize(isResize, this.viewHeight, this.isHeightAuto);
        view.updateNowIndicator(); // we need to guarantee this will run after updateSize
        view.popScroll(isResize);
***REMOVED***;
    CalendarComponent.prototype.computeHeightVars = function () {
        var calendar = this.calendar; // yuck. need to handle dynamic options
        var heightInput = calendar.opt('height');
        var contentHeightInput = calendar.opt('contentHeight');
        this.isHeightAuto = heightInput === 'auto' || contentHeightInput === 'auto';
        if (typeof contentHeightInput === 'number') { // exists and not 'auto'
            this.viewHeight = contentHeightInput;
    ***REMOVED***
        else if (typeof contentHeightInput === 'function') { // exists and is a function
            this.viewHeight = contentHeightInput();
    ***REMOVED***
        else if (typeof heightInput === 'number') { // exists and not 'auto'
            this.viewHeight = heightInput - this.queryToolbarsHeight();
    ***REMOVED***
        else if (typeof heightInput === 'function') { // exists and is a function
            this.viewHeight = heightInput() - this.queryToolbarsHeight();
    ***REMOVED***
        else if (heightInput === 'parent') { // set to height of parent element
            var parentEl = this.el.parentNode;
            this.viewHeight = parentEl.getBoundingClientRect().height - this.queryToolbarsHeight();
    ***REMOVED***
        else {
            this.viewHeight = Math.round(this.contentEl.getBoundingClientRect().width /
                Math.max(calendar.opt('aspectRatio'), .5));
    ***REMOVED***
***REMOVED***;
    CalendarComponent.prototype.queryToolbarsHeight = function () {
        var height = 0;
        if (this.header) {
            height += computeHeightAndMargins(this.header.el);
    ***REMOVED***
        if (this.footer) {
            height += computeHeightAndMargins(this.footer.el);
    ***REMOVED***
        return height;
***REMOVED***;
    // Height "Freezing"
    // -----------------------------------------------------------------------------------------------------------------
    CalendarComponent.prototype.freezeHeight = function () {
        applyStyle(this.el, {
            height: this.el.getBoundingClientRect().height,
            overflow: 'hidden'
    ***REMOVED***);
***REMOVED***;
    CalendarComponent.prototype.thawHeight = function () {
        applyStyle(this.el, {
            height: '',
            overflow: ''
    ***REMOVED***);
***REMOVED***;
    return CalendarComponent;
***REMOVED***(Component));
// Title and Date Formatting
// -----------------------------------------------------------------------------------------------------------------
// Computes what the title at the top of the calendar should be for this view
function computeTitle(dateProfile, viewOptions) {
    var range;
    // for views that span a large unit of time, show the proper interval, ignoring stray days before and after
    if (/^(year|month)$/.test(dateProfile.currentRangeUnit)) {
        range = dateProfile.currentRange;
***REMOVED***
    else { // for day units or smaller, use the actual day range
        range = dateProfile.activeRange;
***REMOVED***
    return this.dateEnv.formatRange(range.start, range.end, createFormatter(viewOptions.titleFormat || computeTitleFormat(dateProfile), viewOptions.titleRangeSeparator), { isEndExclusive: dateProfile.isRangeAllDay ***REMOVED***);
***REMOVED***
// Generates the format string that should be used to generate the title for the current date range.
// Attempts to compute the most appropriate format if not explicitly specified with `titleFormat`.
function computeTitleFormat(dateProfile) {
    var currentRangeUnit = dateProfile.currentRangeUnit;
    if (currentRangeUnit === 'year') {
        return { year: 'numeric' ***REMOVED***;
***REMOVED***
    else if (currentRangeUnit === 'month') {
        return { year: 'numeric', month: 'long' ***REMOVED***; // like "September 2014"
***REMOVED***
    else {
        var days = diffWholeDays(dateProfile.currentRange.start, dateProfile.currentRange.end);
        if (days !== null && days > 1) {
    ***REMOVED*** multi-day range. shorter, like "Sep 9 - 10 2014"
            return { year: 'numeric', month: 'short', day: 'numeric' ***REMOVED***;
    ***REMOVED***
        else {
    ***REMOVED*** one day. longer, like "September 9 2014"
            return { year: 'numeric', month: 'long', day: 'numeric' ***REMOVED***;
    ***REMOVED***
***REMOVED***
***REMOVED***
// Plugin
// -----------------------------------------------------------------------------------------------------------------
function buildViewPropTransformers(theClasses) {
    return theClasses.map(function (theClass) {
        return new theClass();
***REMOVED***);
***REMOVED***

var Interaction = /** @class */ (function () {
    function Interaction(settings) {
        this.component = settings.component;
***REMOVED***
    Interaction.prototype.destroy = function () {
***REMOVED***;
    return Interaction;
***REMOVED***());
function parseInteractionSettings(component, input) {
    return {
        component: component,
        el: input.el,
        useEventCenter: input.useEventCenter != null ? input.useEventCenter : true
***REMOVED***;
***REMOVED***
function interactionSettingsToStore(settings) {
    var _a;
    return _a = {***REMOVED***,
        _a[settings.component.uid] = settings,
        _a;
***REMOVED***
// global state
var interactionSettingsStore = {***REMOVED***;

/*
Detects when the user clicks on an event within a DateComponent
*/
var EventClicking = /** @class */ (function (_super) {
    __extends(EventClicking, _super);
    function EventClicking(settings) {
        var _this = _super.call(this, settings) || this;
        _this.handleSegClick = function (ev, segEl) {
            var component = _this.component;
            var seg = getElSeg(segEl);
            if (seg && // might be the <div> surrounding the more link
                component.isValidSegDownEl(ev.target)) {
        ***REMOVED*** our way to simulate a link click for elements that can't be <a> tags
        ***REMOVED*** grab before trigger fired in case trigger trashes DOM thru rerendering
                var hasUrlContainer = elementClosest(ev.target, '.fc-has-url');
                var url = hasUrlContainer ? hasUrlContainer.querySelector('a[href]').href : '';
                component.publiclyTrigger('eventClick', [
                    {
                        el: segEl,
                        event: new EventApi(component.calendar, seg.eventRange.def, seg.eventRange.instance),
                        jsEvent: ev,
                        view: component.view
                ***REMOVED***
                ]);
                if (url && !ev.defaultPrevented) {
                    window.location.href = url;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;
        var component = settings.component;
        _this.destroy = listenBySelector(component.el, 'click', component.fgSegSelector + ',' + component.bgSegSelector, _this.handleSegClick);
        return _this;
***REMOVED***
    return EventClicking;
***REMOVED***(Interaction));

/*
Triggers events and adds/removes core classNames when the user's pointer
enters/leaves event-elements of a component.
*/
var EventHovering = /** @class */ (function (_super) {
    __extends(EventHovering, _super);
    function EventHovering(settings) {
        var _this = _super.call(this, settings) || this;
***REMOVED*** for simulating an eventMouseLeave when the event el is destroyed while mouse is over it
        _this.handleEventElRemove = function (el) {
            if (el === _this.currentSegEl) {
                _this.handleSegLeave(null, _this.currentSegEl);
        ***REMOVED***
    ***REMOVED***;
        _this.handleSegEnter = function (ev, segEl) {
            if (getElSeg(segEl)) { // TODO: better way to make sure not hovering over more+ link or its wrapper
                segEl.classList.add('fc-allow-mouse-resize');
                _this.currentSegEl = segEl;
                _this.triggerEvent('eventMouseEnter', ev, segEl);
        ***REMOVED***
    ***REMOVED***;
        _this.handleSegLeave = function (ev, segEl) {
            if (_this.currentSegEl) {
                segEl.classList.remove('fc-allow-mouse-resize');
                _this.currentSegEl = null;
                _this.triggerEvent('eventMouseLeave', ev, segEl);
        ***REMOVED***
    ***REMOVED***;
        var component = settings.component;
        _this.removeHoverListeners = listenToHoverBySelector(component.el, component.fgSegSelector + ',' + component.bgSegSelector, _this.handleSegEnter, _this.handleSegLeave);
        component.calendar.on('eventElRemove', _this.handleEventElRemove);
        return _this;
***REMOVED***
    EventHovering.prototype.destroy = function () {
        this.removeHoverListeners();
        this.component.calendar.off('eventElRemove', this.handleEventElRemove);
***REMOVED***;
    EventHovering.prototype.triggerEvent = function (publicEvName, ev, segEl) {
        var component = this.component;
        var seg = getElSeg(segEl);
        if (!ev || component.isValidSegDownEl(ev.target)) {
            component.publiclyTrigger(publicEvName, [
                {
                    el: segEl,
                    event: new EventApi(this.component.calendar, seg.eventRange.def, seg.eventRange.instance),
                    jsEvent: ev,
                    view: component.view
            ***REMOVED***
            ]);
    ***REMOVED***
***REMOVED***;
    return EventHovering;
***REMOVED***(Interaction));

var StandardTheme = /** @class */ (function (_super) {
    __extends(StandardTheme, _super);
    function StandardTheme() {
        return _super !== null && _super.apply(this, arguments) || this;
***REMOVED***
    return StandardTheme;
***REMOVED***(Theme));
StandardTheme.prototype.classes = {
    widget: 'fc-unthemed',
    widgetHeader: 'fc-widget-header',
    widgetContent: 'fc-widget-content',
    buttonGroup: 'fc-button-group',
    button: 'fc-button fc-button-primary',
    buttonActive: 'fc-button-active',
    popoverHeader: 'fc-widget-header',
    popoverContent: 'fc-widget-content',
    // day grid
    headerRow: 'fc-widget-header',
    dayRow: 'fc-widget-content',
    // list view
    listView: 'fc-widget-content'
***REMOVED***;
StandardTheme.prototype.baseIconClass = 'fc-icon';
StandardTheme.prototype.iconClasses = {
    close: 'fc-icon-x',
    prev: 'fc-icon-chevron-left',
    next: 'fc-icon-chevron-right',
    prevYear: 'fc-icon-chevrons-left',
    nextYear: 'fc-icon-chevrons-right'
***REMOVED***;
StandardTheme.prototype.iconOverrideOption = 'buttonIcons';
StandardTheme.prototype.iconOverrideCustomButtonOption = 'icon';
StandardTheme.prototype.iconOverridePrefix = 'fc-icon-';

var Calendar = /** @class */ (function () {
    function Calendar(el, overrides) {
        var _this = this;
        this.parseRawLocales = memoize(parseRawLocales);
        this.buildLocale = memoize(buildLocale);
        this.buildDateEnv = memoize(buildDateEnv);
        this.buildTheme = memoize(buildTheme);
        this.buildEventUiSingleBase = memoize(this._buildEventUiSingleBase);
        this.buildSelectionConfig = memoize(this._buildSelectionConfig);
        this.buildEventUiBySource = memoizeOutput(buildEventUiBySource, isPropsEqual);
        this.buildEventUiBases = memoize(buildEventUiBases);
        this.interactionsStore = {***REMOVED***;
        this.actionQueue = [];
        this.isReducing = false;
***REMOVED*** isDisplaying: boolean = false // installed in DOM? accepting renders?
        this.needsRerender = false; // needs a render?
        this.needsFullRerender = false;
        this.isRendering = false; // currently in the executeRender function?
        this.renderingPauseDepth = 0;
        this.buildDelayedRerender = memoize(buildDelayedRerender);
        this.afterSizingTriggers = {***REMOVED***;
        this.isViewUpdated = false;
        this.isDatesUpdated = false;
        this.isEventsUpdated = false;
        this.el = el;
        this.optionsManager = new OptionsManager(overrides || {***REMOVED***);
        this.pluginSystem = new PluginSystem();
***REMOVED*** only do once. don't do in handleOptions. because can't remove plugins
        this.addPluginInputs(this.optionsManager.computed.plugins || []);
        this.handleOptions(this.optionsManager.computed);
        this.publiclyTrigger('_init'); // for tests
        this.hydrate();
        this.calendarInteractions = this.pluginSystem.hooks.calendarInteractions
            .map(function (calendarInteractionClass) {
            return new calendarInteractionClass(_this);
    ***REMOVED***);
***REMOVED***
    Calendar.prototype.addPluginInputs = function (pluginInputs) {
        var pluginDefs = refinePluginDefs(pluginInputs);
        for (var _i = 0, pluginDefs_1 = pluginDefs; _i < pluginDefs_1.length; _i++) {
            var pluginDef = pluginDefs_1[_i];
            this.pluginSystem.add(pluginDef);
    ***REMOVED***
***REMOVED***;
    Object.defineProperty(Calendar.prototype, "view", {
***REMOVED*** public API
        get: function () {
            return this.component ? this.component.view : null;
    ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    // Public API for rendering
    // -----------------------------------------------------------------------------------------------------------------
    Calendar.prototype.render = function () {
        if (!this.component) {
            this.renderableEventStore = createEmptyEventStore();
            this.bindHandlers();
            this.executeRender();
    ***REMOVED***
        else {
            this.requestRerender(true);
    ***REMOVED***
***REMOVED***;
    Calendar.prototype.destroy = function () {
        if (this.component) {
            this.unbindHandlers();
            this.component.destroy(); // don't null-out. in case API needs access
            this.component = null; // umm ???
            for (var _i = 0, _a = this.calendarInteractions; _i < _a.length; _i++) {
                var interaction = _a[_i];
                interaction.destroy();
        ***REMOVED***
            this.publiclyTrigger('_destroyed');
    ***REMOVED***
***REMOVED***;
    // Handlers
    // -----------------------------------------------------------------------------------------------------------------
    Calendar.prototype.bindHandlers = function () {
        var _this = this;
***REMOVED*** event delegation for nav links
        this.removeNavLinkListener = listenBySelector(this.el, 'click', 'a[data-goto]', function (ev, anchorEl) {
            var gotoOptions = anchorEl.getAttribute('data-goto');
            gotoOptions = gotoOptions ? JSON.parse(gotoOptions) : {***REMOVED***;
            var dateEnv = _this.dateEnv;
            var dateMarker = dateEnv.createMarker(gotoOptions.date);
            var viewType = gotoOptions.type;
    ***REMOVED*** property like "navLinkDayClick". might be a string or a function
            var customAction = _this.viewOpt('navLink' + capitaliseFirstLetter(viewType) + 'Click');
            if (typeof customAction === 'function') {
                customAction(dateEnv.toDate(dateMarker), ev);
        ***REMOVED***
            else {
                if (typeof customAction === 'string') {
                    viewType = customAction;
            ***REMOVED***
                _this.zoomTo(dateMarker, viewType);
        ***REMOVED***
    ***REMOVED***);
        if (this.opt('handleWindowResize')) {
            window.addEventListener('resize', this.windowResizeProxy = debounce(// prevents rapid calls
            this.windowResize.bind(this), this.opt('windowResizeDelay')));
    ***REMOVED***
***REMOVED***;
    Calendar.prototype.unbindHandlers = function () {
        this.removeNavLinkListener();
        if (this.windowResizeProxy) {
            window.removeEventListener('resize', this.windowResizeProxy);
            this.windowResizeProxy = null;
    ***REMOVED***
***REMOVED***;
    // Dispatcher
    // -----------------------------------------------------------------------------------------------------------------
    Calendar.prototype.hydrate = function () {
        var _this = this;
        this.state = this.buildInitialState();
        var rawSources = this.opt('eventSources') || [];
        var singleRawSource = this.opt('events');
        var sources = []; // parsed
        if (singleRawSource) {
            rawSources.unshift(singleRawSource);
    ***REMOVED***
        for (var _i = 0, rawSources_1 = rawSources; _i < rawSources_1.length; _i++) {
            var rawSource = rawSources_1[_i];
            var source = parseEventSource(rawSource, this);
            if (source) {
                sources.push(source);
        ***REMOVED***
    ***REMOVED***
        this.batchRendering(function () {
            _this.dispatch({ type: 'INIT' ***REMOVED***); // pass in sources here?
            _this.dispatch({ type: 'ADD_EVENT_SOURCES', sources: sources ***REMOVED***);
            _this.dispatch({
                type: 'SET_VIEW_TYPE',
                viewType: _this.opt('defaultView') || _this.pluginSystem.hooks.defaultView
        ***REMOVED***);
    ***REMOVED***);
***REMOVED***;
    Calendar.prototype.buildInitialState = function () {
        return {
            viewType: null,
            loadingLevel: 0,
            eventSourceLoadingLevel: 0,
            currentDate: this.getInitialDate(),
            dateProfile: null,
            eventSources: {***REMOVED***,
            eventStore: createEmptyEventStore(),
            dateSelection: null,
            eventSelection: '',
            eventDrag: null,
            eventResize: null
    ***REMOVED***;
***REMOVED***;
    Calendar.prototype.dispatch = function (action) {
        this.actionQueue.push(action);
        if (!this.isReducing) {
            this.isReducing = true;
            var oldState = this.state;
            while (this.actionQueue.length) {
                this.state = this.reduce(this.state, this.actionQueue.shift(), this);
        ***REMOVED***
            var newState = this.state;
            this.isReducing = false;
            if (!oldState.loadingLevel && newState.loadingLevel) {
                this.publiclyTrigger('loading', [true]);
        ***REMOVED***
            else if (oldState.loadingLevel && !newState.loadingLevel) {
                this.publiclyTrigger('loading', [false]);
        ***REMOVED***
            var view = this.component && this.component.view;
            if (oldState.eventStore !== newState.eventStore || this.needsFullRerender) {
                if (oldState.eventStore) {
                    this.isEventsUpdated = true;
            ***REMOVED***
        ***REMOVED***
            if (oldState.dateProfile !== newState.dateProfile || this.needsFullRerender) {
                if (oldState.dateProfile && view) { // why would view be null!?
                    this.publiclyTrigger('datesDestroy', [
                        {
                            view: view,
                            el: view.el
                    ***REMOVED***
                    ]);
            ***REMOVED***
                this.isDatesUpdated = true;
        ***REMOVED***
            if (oldState.viewType !== newState.viewType || this.needsFullRerender) {
                if (oldState.viewType && view) { // why would view be null!?
                    this.publiclyTrigger('viewSkeletonDestroy', [
                        {
                            view: view,
                            el: view.el
                    ***REMOVED***
                    ]);
            ***REMOVED***
                this.isViewUpdated = true;
        ***REMOVED***
            this.requestRerender();
    ***REMOVED***
***REMOVED***;
    Calendar.prototype.reduce = function (state, action, calendar) {
        return reduce(state, action, calendar);
***REMOVED***;
    // Render Queue
    // -----------------------------------------------------------------------------------------------------------------
    Calendar.prototype.requestRerender = function (needsFull) {
        if (needsFull === void 0) { needsFull = false; ***REMOVED***
        this.needsRerender = true;
        this.needsFullRerender = this.needsFullRerender || needsFull;
        this.delayedRerender(); // will call a debounced-version of tryRerender
***REMOVED***;
    Calendar.prototype.tryRerender = function () {
        if (this.component && // must be accepting renders
            this.needsRerender && // indicates that a rerender was requested
            !this.renderingPauseDepth && // not paused
            !this.isRendering // not currently in the render loop
        ) {
            this.executeRender();
    ***REMOVED***
***REMOVED***;
    Calendar.prototype.batchRendering = function (func) {
        this.renderingPauseDepth++;
        func();
        this.renderingPauseDepth--;
        if (this.needsRerender) {
            this.requestRerender();
    ***REMOVED***
***REMOVED***;
    // Rendering
    // -----------------------------------------------------------------------------------------------------------------
    Calendar.prototype.executeRender = function () {
        var needsFullRerender = this.needsFullRerender; // save before clearing
***REMOVED*** clear these BEFORE the render so that new values will accumulate during render
        this.needsRerender = false;
        this.needsFullRerender = false;
        this.isRendering = true;
        this.renderComponent(needsFullRerender);
        this.isRendering = false;
***REMOVED*** received a rerender request while rendering
        if (this.needsRerender) {
            this.delayedRerender();
    ***REMOVED***
***REMOVED***;
    /*
    don't call this directly. use executeRender instead
    */
    Calendar.prototype.renderComponent = function (needsFull) {
        var _a = this, state = _a.state, component = _a.component;
        var viewType = state.viewType;
        var viewSpec = this.viewSpecs[viewType];
        var savedScroll = (needsFull && component) ? component.view.queryScroll() : null;
        if (!viewSpec) {
            throw new Error("View type \"" + viewType + "\" is not valid");
    ***REMOVED***
***REMOVED*** if event sources are still loading and progressive rendering hasn't been enabled,
***REMOVED*** keep rendering the last fully loaded set of events
        var renderableEventStore = this.renderableEventStore =
            (state.eventSourceLoadingLevel && !this.opt('progressiveEventRendering')) ?
                this.renderableEventStore :
                state.eventStore;
        var eventUiSingleBase = this.buildEventUiSingleBase(viewSpec.options);
        var eventUiBySource = this.buildEventUiBySource(state.eventSources);
        var eventUiBases = this.eventUiBases = this.buildEventUiBases(renderableEventStore.defs, eventUiSingleBase, eventUiBySource);
        if (needsFull || !component) {
            if (component) {
                component.freezeHeight(); // next component will unfreeze it
                component.destroy();
        ***REMOVED***
            component = this.component = new CalendarComponent({
                calendar: this,
                view: null,
                dateEnv: this.dateEnv,
                theme: this.theme,
                options: this.optionsManager.computed
        ***REMOVED***, this.el);
            this.isViewUpdated = true;
            this.isDatesUpdated = true;
            this.isEventsUpdated = true;
    ***REMOVED***
        component.receiveProps(__assign({***REMOVED***, state, { viewSpec: viewSpec, dateProfile: state.dateProfile, dateProfileGenerator: this.dateProfileGenerators[viewType], eventStore: renderableEventStore, eventUiBases: eventUiBases, dateSelection: state.dateSelection, eventSelection: state.eventSelection, eventDrag: state.eventDrag, eventResize: state.eventResize ***REMOVED***));
        if (savedScroll) {
            component.view.applyScroll(savedScroll, false);
    ***REMOVED***
        if (this.isViewUpdated) {
            this.isViewUpdated = false;
            this.publiclyTrigger('viewSkeletonRender', [
                {
                    view: component.view,
                    el: component.view.el
            ***REMOVED***
            ]);
    ***REMOVED***
        if (this.isDatesUpdated) {
            this.isDatesUpdated = false;
            this.publiclyTrigger('datesRender', [
                {
                    view: component.view,
                    el: component.view.el
            ***REMOVED***
            ]);
    ***REMOVED***
        if (this.isEventsUpdated) {
            this.isEventsUpdated = false;
    ***REMOVED***
        this.releaseAfterSizingTriggers();
***REMOVED***;
    // Options
    // -----------------------------------------------------------------------------------------------------------------
    Calendar.prototype.setOption = function (name, val) {
        var _a;
        this.mutateOptions((_a = {***REMOVED***, _a[name] = val, _a), [], true);
***REMOVED***;
    Calendar.prototype.getOption = function (name) {
        return this.optionsManager.computed[name];
***REMOVED***;
    Calendar.prototype.opt = function (name) {
        return this.optionsManager.computed[name];
***REMOVED***;
    Calendar.prototype.viewOpt = function (name) {
        return this.viewOpts()[name];
***REMOVED***;
    Calendar.prototype.viewOpts = function () {
        return this.viewSpecs[this.state.viewType].options;
***REMOVED***;
    /*
    handles option changes (like a diff)
    */
    Calendar.prototype.mutateOptions = function (updates, removals, isDynamic, deepEqual) {
        var _this = this;
        var changeHandlers = this.pluginSystem.hooks.optionChangeHandlers;
        var normalUpdates = {***REMOVED***;
        var specialUpdates = {***REMOVED***;
        var oldDateEnv = this.dateEnv; // do this before handleOptions
        var isTimeZoneDirty = false;
        var isSizeDirty = false;
        var anyDifficultOptions = Boolean(removals.length);
        for (var name_1 in updates) {
            if (changeHandlers[name_1]) {
                specialUpdates[name_1] = updates[name_1];
        ***REMOVED***
            else {
                normalUpdates[name_1] = updates[name_1];
        ***REMOVED***
    ***REMOVED***
        for (var name_2 in normalUpdates) {
            if (/^(height|contentHeight|aspectRatio)$/.test(name_2)) {
                isSizeDirty = true;
        ***REMOVED***
            else if (/^(defaultDate|defaultView)$/.test(name_2)) ;
            else {
                anyDifficultOptions = true;
                if (name_2 === 'timeZone') {
                    isTimeZoneDirty = true;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
        this.optionsManager.mutate(normalUpdates, removals, isDynamic);
        if (anyDifficultOptions) {
            this.handleOptions(this.optionsManager.computed);
            this.needsFullRerender = true;
    ***REMOVED***
        this.batchRendering(function () {
            if (anyDifficultOptions) {
                if (isTimeZoneDirty) {
                    _this.dispatch({
                        type: 'CHANGE_TIMEZONE',
                        oldDateEnv: oldDateEnv
                ***REMOVED***);
            ***REMOVED***
                /* HACK
                has the same effect as calling this.requestRerender(true)
                but recomputes the state's dateProfile
                */
                _this.dispatch({
                    type: 'SET_VIEW_TYPE',
                    viewType: _this.state.viewType
            ***REMOVED***);
        ***REMOVED***
            else if (isSizeDirty) {
                _this.updateSize();
        ***REMOVED***
    ***REMOVED*** special updates
            if (deepEqual) {
                for (var name_3 in specialUpdates) {
                    changeHandlers[name_3](specialUpdates[name_3], _this, deepEqual);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***);
***REMOVED***;
    /*
    rebuilds things based off of a complete set of refined options
    */
    Calendar.prototype.handleOptions = function (options) {
        var _this = this;
        var pluginHooks = this.pluginSystem.hooks;
        this.defaultAllDayEventDuration = createDuration(options.defaultAllDayEventDuration);
        this.defaultTimedEventDuration = createDuration(options.defaultTimedEventDuration);
        this.delayedRerender = this.buildDelayedRerender(options.rerenderDelay);
        this.theme = this.buildTheme(options);
        var available = this.parseRawLocales(options.locales);
        this.availableRawLocales = available.map;
        var locale = this.buildLocale(options.locale || available.defaultCode, available.map);
        this.dateEnv = this.buildDateEnv(locale, options.timeZone, pluginHooks.namedTimeZonedImpl, options.firstDay, options.weekNumberCalculation, options.weekLabel, pluginHooks.cmdFormatter);
        this.selectionConfig = this.buildSelectionConfig(options); // needs dateEnv. do after :(
***REMOVED*** ineffecient to do every time?
        this.viewSpecs = buildViewSpecs(pluginHooks.views, this.optionsManager);
***REMOVED*** ineffecient to do every time?
        this.dateProfileGenerators = mapHash(this.viewSpecs, function (viewSpec) {
            return new viewSpec.class.prototype.dateProfileGeneratorClass(viewSpec, _this);
    ***REMOVED***);
***REMOVED***;
    Calendar.prototype.getAvailableLocaleCodes = function () {
        return Object.keys(this.availableRawLocales);
***REMOVED***;
    Calendar.prototype._buildSelectionConfig = function (rawOpts) {
        return processScopedUiProps('select', rawOpts, this);
***REMOVED***;
    Calendar.prototype._buildEventUiSingleBase = function (rawOpts) {
        if (rawOpts.editable) { // so 'editable' affected events
            rawOpts = __assign({***REMOVED***, rawOpts, { eventEditable: true ***REMOVED***);
    ***REMOVED***
        return processScopedUiProps('event', rawOpts, this);
***REMOVED***;
    // Trigger
    // -----------------------------------------------------------------------------------------------------------------
    Calendar.prototype.hasPublicHandlers = function (name) {
        return this.hasHandlers(name) ||
            this.opt(name); // handler specified in options
***REMOVED***;
    Calendar.prototype.publiclyTrigger = function (name, args) {
        var optHandler = this.opt(name);
        this.triggerWith(name, this, args);
        if (optHandler) {
            return optHandler.apply(this, args);
    ***REMOVED***
***REMOVED***;
    Calendar.prototype.publiclyTriggerAfterSizing = function (name, args) {
        var afterSizingTriggers = this.afterSizingTriggers;
        (afterSizingTriggers[name] || (afterSizingTriggers[name] = [])).push(args);
***REMOVED***;
    Calendar.prototype.releaseAfterSizingTriggers = function () {
        var afterSizingTriggers = this.afterSizingTriggers;
        for (var name_4 in afterSizingTriggers) {
            for (var _i = 0, _a = afterSizingTriggers[name_4]; _i < _a.length; _i++) {
                var args = _a[_i];
                this.publiclyTrigger(name_4, args);
        ***REMOVED***
    ***REMOVED***
        this.afterSizingTriggers = {***REMOVED***;
***REMOVED***;
    // View
    // -----------------------------------------------------------------------------------------------------------------
    // Returns a boolean about whether the view is okay to instantiate at some point
    Calendar.prototype.isValidViewType = function (viewType) {
        return Boolean(this.viewSpecs[viewType]);
***REMOVED***;
    Calendar.prototype.changeView = function (viewType, dateOrRange) {
        var dateMarker = null;
        if (dateOrRange) {
            if (dateOrRange.start && dateOrRange.end) { // a range
                this.optionsManager.mutate({ visibleRange: dateOrRange ***REMOVED***, []); // will not rerender
                this.handleOptions(this.optionsManager.computed); // ...but yuck
        ***REMOVED***
            else { // a date
                dateMarker = this.dateEnv.createMarker(dateOrRange); // just like gotoDate
        ***REMOVED***
    ***REMOVED***
        this.unselect();
        this.dispatch({
            type: 'SET_VIEW_TYPE',
            viewType: viewType,
            dateMarker: dateMarker
    ***REMOVED***);
***REMOVED***;
    // Forces navigation to a view for the given date.
    // `viewType` can be a specific view name or a generic one like "week" or "day".
    // needs to change
    Calendar.prototype.zoomTo = function (dateMarker, viewType) {
        var spec;
        viewType = viewType || 'day'; // day is default zoom
        spec = this.viewSpecs[viewType] ||
            this.getUnitViewSpec(viewType);
        this.unselect();
        if (spec) {
            this.dispatch({
                type: 'SET_VIEW_TYPE',
                viewType: spec.type,
                dateMarker: dateMarker
        ***REMOVED***);
    ***REMOVED***
        else {
            this.dispatch({
                type: 'SET_DATE',
                dateMarker: dateMarker
        ***REMOVED***);
    ***REMOVED***
***REMOVED***;
    // Given a duration singular unit, like "week" or "day", finds a matching view spec.
    // Preference is given to views that have corresponding buttons.
    Calendar.prototype.getUnitViewSpec = function (unit) {
        var component = this.component;
        var viewTypes = [];
        var i;
        var spec;
***REMOVED*** put views that have buttons first. there will be duplicates, but oh
        if (component.header) {
            viewTypes.push.apply(viewTypes, component.header.viewsWithButtons);
    ***REMOVED***
        if (component.footer) {
            viewTypes.push.apply(viewTypes, component.footer.viewsWithButtons);
    ***REMOVED***
        for (var viewType in this.viewSpecs) {
            viewTypes.push(viewType);
    ***REMOVED***
        for (i = 0; i < viewTypes.length; i++) {
            spec = this.viewSpecs[viewTypes[i]];
            if (spec) {
                if (spec.singleUnit === unit) {
                    return spec;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***;
    // Current Date
    // -----------------------------------------------------------------------------------------------------------------
    Calendar.prototype.getInitialDate = function () {
        var defaultDateInput = this.opt('defaultDate');
***REMOVED*** compute the initial ambig-timezone date
        if (defaultDateInput != null) {
            return this.dateEnv.createMarker(defaultDateInput);
    ***REMOVED***
        else {
            return this.getNow(); // getNow already returns unzoned
    ***REMOVED***
***REMOVED***;
    Calendar.prototype.prev = function () {
        this.unselect();
        this.dispatch({ type: 'PREV' ***REMOVED***);
***REMOVED***;
    Calendar.prototype.next = function () {
        this.unselect();
        this.dispatch({ type: 'NEXT' ***REMOVED***);
***REMOVED***;
    Calendar.prototype.prevYear = function () {
        this.unselect();
        this.dispatch({
            type: 'SET_DATE',
            dateMarker: this.dateEnv.addYears(this.state.currentDate, -1)
    ***REMOVED***);
***REMOVED***;
    Calendar.prototype.nextYear = function () {
        this.unselect();
        this.dispatch({
            type: 'SET_DATE',
            dateMarker: this.dateEnv.addYears(this.state.currentDate, 1)
    ***REMOVED***);
***REMOVED***;
    Calendar.prototype.today = function () {
        this.unselect();
        this.dispatch({
            type: 'SET_DATE',
            dateMarker: this.getNow()
    ***REMOVED***);
***REMOVED***;
    Calendar.prototype.gotoDate = function (zonedDateInput) {
        this.unselect();
        this.dispatch({
            type: 'SET_DATE',
            dateMarker: this.dateEnv.createMarker(zonedDateInput)
    ***REMOVED***);
***REMOVED***;
    Calendar.prototype.incrementDate = function (deltaInput) {
        var delta = createDuration(deltaInput);
        if (delta) { // else, warn about invalid input?
            this.unselect();
            this.dispatch({
                type: 'SET_DATE',
                dateMarker: this.dateEnv.add(this.state.currentDate, delta)
        ***REMOVED***);
    ***REMOVED***
***REMOVED***;
    // for external API
    Calendar.prototype.getDate = function () {
        return this.dateEnv.toDate(this.state.currentDate);
***REMOVED***;
    // Date Formatting Utils
    // -----------------------------------------------------------------------------------------------------------------
    Calendar.prototype.formatDate = function (d, formatter) {
        var dateEnv = this.dateEnv;
        return dateEnv.format(dateEnv.createMarker(d), createFormatter(formatter));
***REMOVED***;
    // `settings` is for formatter AND isEndExclusive
    Calendar.prototype.formatRange = function (d0, d1, settings) {
        var dateEnv = this.dateEnv;
        return dateEnv.formatRange(dateEnv.createMarker(d0), dateEnv.createMarker(d1), createFormatter(settings, this.opt('defaultRangeSeparator')), settings);
***REMOVED***;
    Calendar.prototype.formatIso = function (d, omitTime) {
        var dateEnv = this.dateEnv;
        return dateEnv.formatIso(dateEnv.createMarker(d), { omitTime: omitTime ***REMOVED***);
***REMOVED***;
    // Sizing
    // -----------------------------------------------------------------------------------------------------------------
    Calendar.prototype.windowResize = function (ev) {
        if (!this.isHandlingWindowResize &&
            this.component && // why?
            ev.target === window // not a jqui resize event
        ) {
            this.isHandlingWindowResize = true;
            this.updateSize();
            this.publiclyTrigger('windowResize', [this.view]);
            this.isHandlingWindowResize = false;
    ***REMOVED***
***REMOVED***;
    Calendar.prototype.updateSize = function () {
        if (this.component) { // when?
            this.component.updateSize(true);
    ***REMOVED***
***REMOVED***;
    // Component Registration
    // -----------------------------------------------------------------------------------------------------------------
    Calendar.prototype.registerInteractiveComponent = function (component, settingsInput) {
        var settings = parseInteractionSettings(component, settingsInput);
        var DEFAULT_INTERACTIONS = [
            EventClicking,
            EventHovering
        ];
        var interactionClasses = DEFAULT_INTERACTIONS.concat(this.pluginSystem.hooks.componentInteractions);
        var interactions = interactionClasses.map(function (interactionClass) {
            return new interactionClass(settings);
    ***REMOVED***);
        this.interactionsStore[component.uid] = interactions;
        interactionSettingsStore[component.uid] = settings;
***REMOVED***;
    Calendar.prototype.unregisterInteractiveComponent = function (component) {
        for (var _i = 0, _a = this.interactionsStore[component.uid]; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener.destroy();
    ***REMOVED***
        delete this.interactionsStore[component.uid];
        delete interactionSettingsStore[component.uid];
***REMOVED***;
    // Date Selection / Event Selection / DayClick
    // -----------------------------------------------------------------------------------------------------------------
    // this public method receives start/end dates in any format, with any timezone
    // NOTE: args were changed from v3
    Calendar.prototype.select = function (dateOrObj, endDate) {
        var selectionInput;
        if (endDate == null) {
            if (dateOrObj.start != null) {
                selectionInput = dateOrObj;
        ***REMOVED***
            else {
                selectionInput = {
                    start: dateOrObj,
                    end: null
            ***REMOVED***;
        ***REMOVED***
    ***REMOVED***
        else {
            selectionInput = {
                start: dateOrObj,
                end: endDate
        ***REMOVED***;
    ***REMOVED***
        var selection = parseDateSpan(selectionInput, this.dateEnv, createDuration({ days: 1 ***REMOVED***) // TODO: cache this?
        );
        if (selection) { // throw parse error otherwise?
            this.dispatch({ type: 'SELECT_DATES', selection: selection ***REMOVED***);
            this.triggerDateSelect(selection);
    ***REMOVED***
***REMOVED***;
    // public method
    Calendar.prototype.unselect = function (pev) {
        if (this.state.dateSelection) {
            this.dispatch({ type: 'UNSELECT_DATES' ***REMOVED***);
            this.triggerDateUnselect(pev);
    ***REMOVED***
***REMOVED***;
    Calendar.prototype.triggerDateSelect = function (selection, pev) {
        var arg = __assign({***REMOVED***, this.buildDateSpanApi(selection), { jsEvent: pev ? pev.origEvent : null, view: this.view ***REMOVED***);
        this.publiclyTrigger('select', [arg]);
***REMOVED***;
    Calendar.prototype.triggerDateUnselect = function (pev) {
        this.publiclyTrigger('unselect', [
            {
                jsEvent: pev ? pev.origEvent : null,
                view: this.view
        ***REMOVED***
        ]);
***REMOVED***;
    // TODO: receive pev?
    Calendar.prototype.triggerDateClick = function (dateSpan, dayEl, view, ev) {
        var arg = __assign({***REMOVED***, this.buildDatePointApi(dateSpan), { dayEl: dayEl, jsEvent: ev, // Is this always a mouse event? See #4655
            view: view ***REMOVED***);
        this.publiclyTrigger('dateClick', [arg]);
***REMOVED***;
    Calendar.prototype.buildDatePointApi = function (dateSpan) {
        var props = {***REMOVED***;
        for (var _i = 0, _a = this.pluginSystem.hooks.datePointTransforms; _i < _a.length; _i++) {
            var transform = _a[_i];
            __assign(props, transform(dateSpan, this));
    ***REMOVED***
        __assign(props, buildDatePointApi(dateSpan, this.dateEnv));
        return props;
***REMOVED***;
    Calendar.prototype.buildDateSpanApi = function (dateSpan) {
        var props = {***REMOVED***;
        for (var _i = 0, _a = this.pluginSystem.hooks.dateSpanTransforms; _i < _a.length; _i++) {
            var transform = _a[_i];
            __assign(props, transform(dateSpan, this));
    ***REMOVED***
        __assign(props, buildDateSpanApi(dateSpan, this.dateEnv));
        return props;
***REMOVED***;
    // Date Utils
    // -----------------------------------------------------------------------------------------------------------------
    // Returns a DateMarker for the current date, as defined by the client's computer or from the `now` option
    Calendar.prototype.getNow = function () {
        var now = this.opt('now');
        if (typeof now === 'function') {
            now = now();
    ***REMOVED***
        if (now == null) {
            return this.dateEnv.createNowMarker();
    ***REMOVED***
        return this.dateEnv.createMarker(now);
***REMOVED***;
    // Event-Date Utilities
    // -----------------------------------------------------------------------------------------------------------------
    // Given an event's allDay status and start date, return what its fallback end date should be.
    // TODO: rename to computeDefaultEventEnd
    Calendar.prototype.getDefaultEventEnd = function (allDay, marker) {
        var end = marker;
        if (allDay) {
            end = startOfDay(end);
            end = this.dateEnv.add(end, this.defaultAllDayEventDuration);
    ***REMOVED***
        else {
            end = this.dateEnv.add(end, this.defaultTimedEventDuration);
    ***REMOVED***
        return end;
***REMOVED***;
    // Public Events API
    // -----------------------------------------------------------------------------------------------------------------
    Calendar.prototype.addEvent = function (eventInput, sourceInput) {
        if (eventInput instanceof EventApi) {
            var def = eventInput._def;
            var instance = eventInput._instance;
    ***REMOVED*** not already present? don't want to add an old snapshot
            if (!this.state.eventStore.defs[def.defId]) {
                this.dispatch({
                    type: 'ADD_EVENTS',
                    eventStore: eventTupleToStore({ def: def, instance: instance ***REMOVED***) // TODO: better util for two args?
            ***REMOVED***);
        ***REMOVED***
            return eventInput;
    ***REMOVED***
        var sourceId;
        if (sourceInput instanceof EventSourceApi) {
            sourceId = sourceInput.internalEventSource.sourceId;
    ***REMOVED***
        else if (sourceInput != null) {
            var sourceApi = this.getEventSourceById(sourceInput); // TODO: use an internal function
            if (!sourceApi) {
                console.warn('Could not find an event source with ID "' + sourceInput + '"'); // TODO: test
                return null;
        ***REMOVED***
            else {
                sourceId = sourceApi.internalEventSource.sourceId;
        ***REMOVED***
    ***REMOVED***
        var tuple = parseEvent(eventInput, sourceId, this);
        if (tuple) {
            this.dispatch({
                type: 'ADD_EVENTS',
                eventStore: eventTupleToStore(tuple)
        ***REMOVED***);
            return new EventApi(this, tuple.def, tuple.def.recurringDef ? null : tuple.instance);
    ***REMOVED***
        return null;
***REMOVED***;
    // TODO: optimize
    Calendar.prototype.getEventById = function (id) {
        var _a = this.state.eventStore, defs = _a.defs, instances = _a.instances;
        id = String(id);
        for (var defId in defs) {
            var def = defs[defId];
            if (def.publicId === id) {
                if (def.recurringDef) {
                    return new EventApi(this, def, null);
            ***REMOVED***
                else {
                    for (var instanceId in instances) {
                        var instance = instances[instanceId];
                        if (instance.defId === def.defId) {
                            return new EventApi(this, def, instance);
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
        return null;
***REMOVED***;
    Calendar.prototype.getEvents = function () {
        var _a = this.state.eventStore, defs = _a.defs, instances = _a.instances;
        var eventApis = [];
        for (var id in instances) {
            var instance = instances[id];
            var def = defs[instance.defId];
            eventApis.push(new EventApi(this, def, instance));
    ***REMOVED***
        return eventApis;
***REMOVED***;
    Calendar.prototype.removeAllEvents = function () {
        this.dispatch({ type: 'REMOVE_ALL_EVENTS' ***REMOVED***);
***REMOVED***;
    Calendar.prototype.rerenderEvents = function () {
        this.dispatch({ type: 'RESET_EVENTS' ***REMOVED***);
***REMOVED***;
    // Public Event Sources API
    // -----------------------------------------------------------------------------------------------------------------
    Calendar.prototype.getEventSources = function () {
        var sourceHash = this.state.eventSources;
        var sourceApis = [];
        for (var internalId in sourceHash) {
            sourceApis.push(new EventSourceApi(this, sourceHash[internalId]));
    ***REMOVED***
        return sourceApis;
***REMOVED***;
    Calendar.prototype.getEventSourceById = function (id) {
        var sourceHash = this.state.eventSources;
        id = String(id);
        for (var sourceId in sourceHash) {
            if (sourceHash[sourceId].publicId === id) {
                return new EventSourceApi(this, sourceHash[sourceId]);
        ***REMOVED***
    ***REMOVED***
        return null;
***REMOVED***;
    Calendar.prototype.addEventSource = function (sourceInput) {
        if (sourceInput instanceof EventSourceApi) {
    ***REMOVED*** not already present? don't want to add an old snapshot
            if (!this.state.eventSources[sourceInput.internalEventSource.sourceId]) {
                this.dispatch({
                    type: 'ADD_EVENT_SOURCES',
                    sources: [sourceInput.internalEventSource]
            ***REMOVED***);
        ***REMOVED***
            return sourceInput;
    ***REMOVED***
        var eventSource = parseEventSource(sourceInput, this);
        if (eventSource) { // TODO: error otherwise?
            this.dispatch({ type: 'ADD_EVENT_SOURCES', sources: [eventSource] ***REMOVED***);
            return new EventSourceApi(this, eventSource);
    ***REMOVED***
        return null;
***REMOVED***;
    Calendar.prototype.removeAllEventSources = function () {
        this.dispatch({ type: 'REMOVE_ALL_EVENT_SOURCES' ***REMOVED***);
***REMOVED***;
    Calendar.prototype.refetchEvents = function () {
        this.dispatch({ type: 'FETCH_EVENT_SOURCES' ***REMOVED***);
***REMOVED***;
    // Scroll
    // -----------------------------------------------------------------------------------------------------------------
    Calendar.prototype.scrollToTime = function (timeInput) {
        var duration = createDuration(timeInput);
        if (duration) {
            this.component.view.scrollToDuration(duration);
    ***REMOVED***
***REMOVED***;
    return Calendar;
***REMOVED***());
EmitterMixin.mixInto(Calendar);
// for memoizers
// -----------------------------------------------------------------------------------------------------------------
function buildDateEnv(locale, timeZone, namedTimeZoneImpl, firstDay, weekNumberCalculation, weekLabel, cmdFormatter) {
    return new DateEnv({
        calendarSystem: 'gregory',
        timeZone: timeZone,
        namedTimeZoneImpl: namedTimeZoneImpl,
        locale: locale,
        weekNumberCalculation: weekNumberCalculation,
        firstDay: firstDay,
        weekLabel: weekLabel,
        cmdFormatter: cmdFormatter
***REMOVED***);
***REMOVED***
function buildTheme(calendarOptions) {
    var themeClass = this.pluginSystem.hooks.themeClasses[calendarOptions.themeSystem] || StandardTheme;
    return new themeClass(calendarOptions);
***REMOVED***
function buildDelayedRerender(wait) {
    var func = this.tryRerender.bind(this);
    if (wait != null) {
        func = debounce(func, wait);
***REMOVED***
    return func;
***REMOVED***
function buildEventUiBySource(eventSources) {
    return mapHash(eventSources, function (eventSource) {
        return eventSource.ui;
***REMOVED***);
***REMOVED***
function buildEventUiBases(eventDefs, eventUiSingleBase, eventUiBySource) {
    var eventUiBases = { '': eventUiSingleBase ***REMOVED***;
    for (var defId in eventDefs) {
        var def = eventDefs[defId];
        if (def.sourceId && eventUiBySource[def.sourceId]) {
            eventUiBases[defId] = eventUiBySource[def.sourceId];
    ***REMOVED***
***REMOVED***
    return eventUiBases;
***REMOVED***

var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(context, viewSpec, dateProfileGenerator, parentEl) {
        var _this = _super.call(this, context, createElement('div', { className: 'fc-view fc-' + viewSpec.type + '-view' ***REMOVED***), true // isView (HACK)
        ) || this;
        _this.renderDatesMem = memoizeRendering(_this.renderDatesWrap, _this.unrenderDatesWrap);
        _this.renderBusinessHoursMem = memoizeRendering(_this.renderBusinessHours, _this.unrenderBusinessHours, [_this.renderDatesMem]);
        _this.renderDateSelectionMem = memoizeRendering(_this.renderDateSelectionWrap, _this.unrenderDateSelectionWrap, [_this.renderDatesMem]);
        _this.renderEventsMem = memoizeRendering(_this.renderEvents, _this.unrenderEvents, [_this.renderDatesMem]);
        _this.renderEventSelectionMem = memoizeRendering(_this.renderEventSelectionWrap, _this.unrenderEventSelectionWrap, [_this.renderEventsMem]);
        _this.renderEventDragMem = memoizeRendering(_this.renderEventDragWrap, _this.unrenderEventDragWrap, [_this.renderDatesMem]);
        _this.renderEventResizeMem = memoizeRendering(_this.renderEventResizeWrap, _this.unrenderEventResizeWrap, [_this.renderDatesMem]);
        _this.viewSpec = viewSpec;
        _this.dateProfileGenerator = dateProfileGenerator;
        _this.type = viewSpec.type;
        _this.eventOrderSpecs = parseFieldSpecs(_this.opt('eventOrder'));
        _this.nextDayThreshold = createDuration(_this.opt('nextDayThreshold'));
        parentEl.appendChild(_this.el);
        _this.initialize();
        return _this;
***REMOVED***
    View.prototype.initialize = function () {
***REMOVED***;
    Object.defineProperty(View.prototype, "activeStart", {
***REMOVED*** Date Setting/Unsetting
***REMOVED*** -----------------------------------------------------------------------------------------------------------------
        get: function () {
            return this.dateEnv.toDate(this.props.dateProfile.activeRange.start);
    ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(View.prototype, "activeEnd", {
        get: function () {
            return this.dateEnv.toDate(this.props.dateProfile.activeRange.end);
    ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(View.prototype, "currentStart", {
        get: function () {
            return this.dateEnv.toDate(this.props.dateProfile.currentRange.start);
    ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    Object.defineProperty(View.prototype, "currentEnd", {
        get: function () {
            return this.dateEnv.toDate(this.props.dateProfile.currentRange.end);
    ***REMOVED***,
        enumerable: true,
        configurable: true
***REMOVED***);
    // General Rendering
    // -----------------------------------------------------------------------------------------------------------------
    View.prototype.render = function (props) {
        this.renderDatesMem(props.dateProfile);
        this.renderBusinessHoursMem(props.businessHours);
        this.renderDateSelectionMem(props.dateSelection);
        this.renderEventsMem(props.eventStore);
        this.renderEventSelectionMem(props.eventSelection);
        this.renderEventDragMem(props.eventDrag);
        this.renderEventResizeMem(props.eventResize);
***REMOVED***;
    View.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.renderDatesMem.unrender(); // should unrender everything else
***REMOVED***;
    // Sizing
    // -----------------------------------------------------------------------------------------------------------------
    View.prototype.updateSize = function (isResize, viewHeight, isAuto) {
        var calendar = this.calendar;
        if (isResize || // HACKS...
            calendar.isViewUpdated ||
            calendar.isDatesUpdated ||
            calendar.isEventsUpdated) {
    ***REMOVED*** sort of the catch-all sizing
    ***REMOVED*** anything that might cause dimension changes
            this.updateBaseSize(isResize, viewHeight, isAuto);
    ***REMOVED***
***REMOVED***;
    View.prototype.updateBaseSize = function (isResize, viewHeight, isAuto) {
***REMOVED***;
    // Date Rendering
    // -----------------------------------------------------------------------------------------------------------------
    View.prototype.renderDatesWrap = function (dateProfile) {
        this.renderDates(dateProfile);
        this.addScroll({
            duration: createDuration(this.opt('scrollTime'))
    ***REMOVED***);
        this.startNowIndicator(dateProfile); // shouldn't render yet because updateSize will be called soon
***REMOVED***;
    View.prototype.unrenderDatesWrap = function () {
        this.stopNowIndicator();
        this.unrenderDates();
***REMOVED***;
    View.prototype.renderDates = function (dateProfile) { ***REMOVED***;
    View.prototype.unrenderDates = function () { ***REMOVED***;
    // Business Hours
    // -----------------------------------------------------------------------------------------------------------------
    View.prototype.renderBusinessHours = function (businessHours) { ***REMOVED***;
    View.prototype.unrenderBusinessHours = function () { ***REMOVED***;
    // Date Selection
    // -----------------------------------------------------------------------------------------------------------------
    View.prototype.renderDateSelectionWrap = function (selection) {
        if (selection) {
            this.renderDateSelection(selection);
    ***REMOVED***
***REMOVED***;
    View.prototype.unrenderDateSelectionWrap = function (selection) {
        if (selection) {
            this.unrenderDateSelection(selection);
    ***REMOVED***
***REMOVED***;
    View.prototype.renderDateSelection = function (selection) { ***REMOVED***;
    View.prototype.unrenderDateSelection = function (selection) { ***REMOVED***;
    // Event Rendering
    // -----------------------------------------------------------------------------------------------------------------
    View.prototype.renderEvents = function (eventStore) { ***REMOVED***;
    View.prototype.unrenderEvents = function () { ***REMOVED***;
    // util for subclasses
    View.prototype.sliceEvents = function (eventStore, allDay) {
        var props = this.props;
        return sliceEventStore(eventStore, props.eventUiBases, props.dateProfile.activeRange, allDay ? this.nextDayThreshold : null).fg;
***REMOVED***;
    View.prototype.computeEventDraggable = function (eventDef, eventUi) {
        var transformers = this.calendar.pluginSystem.hooks.isDraggableTransformers;
        var val = eventUi.startEditable;
        for (var _i = 0, transformers_1 = transformers; _i < transformers_1.length; _i++) {
            var transformer = transformers_1[_i];
            val = transformer(val, eventDef, eventUi, this);
    ***REMOVED***
        return val;
***REMOVED***;
    View.prototype.computeEventStartResizable = function (eventDef, eventUi) {
        return eventUi.durationEditable && this.opt('eventResizableFromStart');
***REMOVED***;
    View.prototype.computeEventEndResizable = function (eventDef, eventUi) {
        return eventUi.durationEditable;
***REMOVED***;
    // Event Selection
    // -----------------------------------------------------------------------------------------------------------------
    View.prototype.renderEventSelectionWrap = function (instanceId) {
        if (instanceId) {
            this.renderEventSelection(instanceId);
    ***REMOVED***
***REMOVED***;
    View.prototype.unrenderEventSelectionWrap = function (instanceId) {
        if (instanceId) {
            this.unrenderEventSelection(instanceId);
    ***REMOVED***
***REMOVED***;
    View.prototype.renderEventSelection = function (instanceId) { ***REMOVED***;
    View.prototype.unrenderEventSelection = function (instanceId) { ***REMOVED***;
    // Event Drag
    // -----------------------------------------------------------------------------------------------------------------
    View.prototype.renderEventDragWrap = function (state) {
        if (state) {
            this.renderEventDrag(state);
    ***REMOVED***
***REMOVED***;
    View.prototype.unrenderEventDragWrap = function (state) {
        if (state) {
            this.unrenderEventDrag(state);
    ***REMOVED***
***REMOVED***;
    View.prototype.renderEventDrag = function (state) { ***REMOVED***;
    View.prototype.unrenderEventDrag = function (state) { ***REMOVED***;
    // Event Resize
    // -----------------------------------------------------------------------------------------------------------------
    View.prototype.renderEventResizeWrap = function (state) {
        if (state) {
            this.renderEventResize(state);
    ***REMOVED***
***REMOVED***;
    View.prototype.unrenderEventResizeWrap = function (state) {
        if (state) {
            this.unrenderEventResize(state);
    ***REMOVED***
***REMOVED***;
    View.prototype.renderEventResize = function (state) { ***REMOVED***;
    View.prototype.unrenderEventResize = function (state) { ***REMOVED***;
    /* Now Indicator
    ------------------------------------------------------------------------------------------------------------------*/
    // Immediately render the current time indicator and begins re-rendering it at an interval,
    // which is defined by this.getNowIndicatorUnit().
    // TODO: somehow do this for the current whole day's background too
    View.prototype.startNowIndicator = function (dateProfile) {
        var _this = this;
        var dateEnv = this.dateEnv;
        var unit;
        var update;
        var delay; // ms wait value
        if (this.opt('nowIndicator')) {
            unit = this.getNowIndicatorUnit(dateProfile);
            if (unit) {
                update = this.updateNowIndicator.bind(this);
                this.initialNowDate = this.calendar.getNow();
                this.initialNowQueriedMs = new Date().valueOf();
        ***REMOVED*** wait until the beginning of the next interval
                delay = dateEnv.add(dateEnv.startOf(this.initialNowDate, unit), createDuration(1, unit)).valueOf() - this.initialNowDate.valueOf();
        ***REMOVED*** TODO: maybe always use setTimeout, waiting until start of next unit
                this.nowIndicatorTimeoutID = setTimeout(function () {
                    _this.nowIndicatorTimeoutID = null;
                    update();
                    if (unit === 'second') {
                        delay = 1000; // every second
                ***REMOVED***
                    else {
                        delay = 1000 * 60; // otherwise, every minute
                ***REMOVED***
                    _this.nowIndicatorIntervalID = setInterval(update, delay); // update every interval
            ***REMOVED***, delay);
        ***REMOVED***
    ***REMOVED*** rendering will be initiated in updateSize
    ***REMOVED***
***REMOVED***;
    // rerenders the now indicator, computing the new current time from the amount of time that has passed
    // since the initial getNow call.
    View.prototype.updateNowIndicator = function () {
        if (this.props.dateProfile && // a way to determine if dates were rendered yet
            this.initialNowDate // activated before?
        ) {
            this.unrenderNowIndicator(); // won't unrender if unnecessary
            this.renderNowIndicator(addMs(this.initialNowDate, new Date().valueOf() - this.initialNowQueriedMs));
            this.isNowIndicatorRendered = true;
    ***REMOVED***
***REMOVED***;
    // Immediately unrenders the view's current time indicator and stops any re-rendering timers.
    // Won't cause side effects if indicator isn't rendered.
    View.prototype.stopNowIndicator = function () {
        if (this.isNowIndicatorRendered) {
            if (this.nowIndicatorTimeoutID) {
                clearTimeout(this.nowIndicatorTimeoutID);
                this.nowIndicatorTimeoutID = null;
        ***REMOVED***
            if (this.nowIndicatorIntervalID) {
                clearInterval(this.nowIndicatorIntervalID);
                this.nowIndicatorIntervalID = null;
        ***REMOVED***
            this.unrenderNowIndicator();
            this.isNowIndicatorRendered = false;
    ***REMOVED***
***REMOVED***;
    View.prototype.getNowIndicatorUnit = function (dateProfile) {
***REMOVED*** subclasses should implement
***REMOVED***;
    // Renders a current time indicator at the given datetime
    View.prototype.renderNowIndicator = function (date) {
***REMOVED*** SUBCLASSES MUST PASS TO CHILDREN!
***REMOVED***;
    // Undoes the rendering actions from renderNowIndicator
    View.prototype.unrenderNowIndicator = function () {
***REMOVED*** SUBCLASSES MUST PASS TO CHILDREN!
***REMOVED***;
    /* Scroller
    ------------------------------------------------------------------------------------------------------------------*/
    View.prototype.addScroll = function (scroll) {
        var queuedScroll = this.queuedScroll || (this.queuedScroll = {***REMOVED***);
        __assign(queuedScroll, scroll);
***REMOVED***;
    View.prototype.popScroll = function (isResize) {
        this.applyQueuedScroll(isResize);
        this.queuedScroll = null;
***REMOVED***;
    View.prototype.applyQueuedScroll = function (isResize) {
        this.applyScroll(this.queuedScroll || {***REMOVED***, isResize);
***REMOVED***;
    View.prototype.queryScroll = function () {
        var scroll = {***REMOVED***;
        if (this.props.dateProfile) { // dates rendered yet?
            __assign(scroll, this.queryDateScroll());
    ***REMOVED***
        return scroll;
***REMOVED***;
    View.prototype.applyScroll = function (scroll, isResize) {
        var duration = scroll.duration;
        if (duration != null) {
            delete scroll.duration;
            if (this.props.dateProfile) { // dates rendered yet?
                __assign(scroll, this.computeDateScroll(duration));
        ***REMOVED***
    ***REMOVED***
        if (this.props.dateProfile) { // dates rendered yet?
            this.applyDateScroll(scroll);
    ***REMOVED***
***REMOVED***;
    View.prototype.computeDateScroll = function (duration) {
        return {***REMOVED***; // subclasses must implement
***REMOVED***;
    View.prototype.queryDateScroll = function () {
        return {***REMOVED***; // subclasses must implement
***REMOVED***;
    View.prototype.applyDateScroll = function (scroll) {
***REMOVED*** subclasses must implement
***REMOVED***;
    // for API
    View.prototype.scrollToDuration = function (duration) {
        this.applyScroll({ duration: duration ***REMOVED***, false);
***REMOVED***;
    return View;
***REMOVED***(DateComponent));
EmitterMixin.mixInto(View);
View.prototype.usesMinMaxTime = false;
View.prototype.dateProfileGeneratorClass = DateProfileGenerator;

var FgEventRenderer = /** @class */ (function () {
    function FgEventRenderer(context) {
        this.segs = [];
        this.isSizeDirty = false;
        this.context = context;
***REMOVED***
    FgEventRenderer.prototype.renderSegs = function (segs, mirrorInfo) {
        this.rangeUpdated(); // called too frequently :(
***REMOVED*** render an `.el` on each seg
***REMOVED*** returns a subset of the segs. segs that were actually rendered
        segs = this.renderSegEls(segs, mirrorInfo);
        this.segs = segs;
        this.attachSegs(segs, mirrorInfo);
        this.isSizeDirty = true;
        this.context.view.triggerRenderedSegs(this.segs, Boolean(mirrorInfo));
***REMOVED***;
    FgEventRenderer.prototype.unrender = function (_segs, mirrorInfo) {
        this.context.view.triggerWillRemoveSegs(this.segs, Boolean(mirrorInfo));
        this.detachSegs(this.segs);
        this.segs = [];
***REMOVED***;
    // Updates values that rely on options and also relate to range
    FgEventRenderer.prototype.rangeUpdated = function () {
        var options = this.context.options;
        var displayEventTime;
        var displayEventEnd;
        this.eventTimeFormat = createFormatter(options.eventTimeFormat || this.computeEventTimeFormat(), options.defaultRangeSeparator);
        displayEventTime = options.displayEventTime;
        if (displayEventTime == null) {
            displayEventTime = this.computeDisplayEventTime(); // might be based off of range
    ***REMOVED***
        displayEventEnd = options.displayEventEnd;
        if (displayEventEnd == null) {
            displayEventEnd = this.computeDisplayEventEnd(); // might be based off of range
    ***REMOVED***
        this.displayEventTime = displayEventTime;
        this.displayEventEnd = displayEventEnd;
***REMOVED***;
    // Renders and assigns an `el` property for each foreground event segment.
    // Only returns segments that successfully rendered.
    FgEventRenderer.prototype.renderSegEls = function (segs, mirrorInfo) {
        var html = '';
        var i;
        if (segs.length) { // don't build an empty html string
    ***REMOVED*** build a large concatenation of event segment HTML
            for (i = 0; i < segs.length; i++) {
                html += this.renderSegHtml(segs[i], mirrorInfo);
        ***REMOVED***
    ***REMOVED*** Grab individual elements from the combined HTML string. Use each as the default rendering.
    ***REMOVED*** Then, compute the 'el' for each segment. An el might be null if the eventRender callback returned false.
            htmlToElements(html).forEach(function (el, i) {
                var seg = segs[i];
                if (el) {
                    seg.el = el;
            ***REMOVED***
        ***REMOVED***);
            segs = filterSegsViaEls(this.context.view, segs, Boolean(mirrorInfo));
    ***REMOVED***
        return segs;
***REMOVED***;
    // Generic utility for generating the HTML classNames for an event segment's element
    FgEventRenderer.prototype.getSegClasses = function (seg, isDraggable, isResizable, mirrorInfo) {
        var classes = [
            'fc-event',
            seg.isStart ? 'fc-start' : 'fc-not-start',
            seg.isEnd ? 'fc-end' : 'fc-not-end'
        ].concat(seg.eventRange.ui.classNames);
        if (isDraggable) {
            classes.push('fc-draggable');
    ***REMOVED***
        if (isResizable) {
            classes.push('fc-resizable');
    ***REMOVED***
        if (mirrorInfo) {
            classes.push('fc-mirror');
            if (mirrorInfo.isDragging) {
                classes.push('fc-dragging');
        ***REMOVED***
            if (mirrorInfo.isResizing) {
                classes.push('fc-resizing');
        ***REMOVED***
    ***REMOVED***
        return classes;
***REMOVED***;
    // Compute the text that should be displayed on an event's element.
    // `range` can be the Event object itself, or something range-like, with at least a `start`.
    // If event times are disabled, or the event has no time, will return a blank string.
    // If not specified, formatter will default to the eventTimeFormat setting,
    // and displayEnd will default to the displayEventEnd setting.
    FgEventRenderer.prototype.getTimeText = function (eventRange, formatter, displayEnd) {
        var def = eventRange.def, instance = eventRange.instance;
        return this._getTimeText(instance.range.start, def.hasEnd ? instance.range.end : null, def.allDay, formatter, displayEnd, instance.forcedStartTzo, instance.forcedEndTzo);
***REMOVED***;
    FgEventRenderer.prototype._getTimeText = function (start, end, allDay, formatter, displayEnd, forcedStartTzo, forcedEndTzo) {
        var dateEnv = this.context.dateEnv;
        if (formatter == null) {
            formatter = this.eventTimeFormat;
    ***REMOVED***
        if (displayEnd == null) {
            displayEnd = this.displayEventEnd;
    ***REMOVED***
        if (this.displayEventTime && !allDay) {
            if (displayEnd && end) {
                return dateEnv.formatRange(start, end, formatter, {
                    forcedStartTzo: forcedStartTzo,
                    forcedEndTzo: forcedEndTzo
            ***REMOVED***);
        ***REMOVED***
            else {
                return dateEnv.format(start, formatter, {
                    forcedTzo: forcedStartTzo
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***
        return '';
***REMOVED***;
    FgEventRenderer.prototype.computeEventTimeFormat = function () {
        return {
            hour: 'numeric',
            minute: '2-digit',
            omitZeroMinute: true
    ***REMOVED***;
***REMOVED***;
    FgEventRenderer.prototype.computeDisplayEventTime = function () {
        return true;
***REMOVED***;
    FgEventRenderer.prototype.computeDisplayEventEnd = function () {
        return true;
***REMOVED***;
    // Utility for generating event skin-related CSS properties
    FgEventRenderer.prototype.getSkinCss = function (ui) {
        return {
            'background-color': ui.backgroundColor,
            'border-color': ui.borderColor,
            color: ui.textColor
    ***REMOVED***;
***REMOVED***;
    FgEventRenderer.prototype.sortEventSegs = function (segs) {
        var specs = this.context.view.eventOrderSpecs;
        var objs = segs.map(buildSegCompareObj);
        objs.sort(function (obj0, obj1) {
            return compareByFieldSpecs(obj0, obj1, specs);
    ***REMOVED***);
        return objs.map(function (c) {
            return c._seg;
    ***REMOVED***);
***REMOVED***;
    FgEventRenderer.prototype.computeSizes = function (force) {
        if (force || this.isSizeDirty) {
            this.computeSegSizes(this.segs);
    ***REMOVED***
***REMOVED***;
    FgEventRenderer.prototype.assignSizes = function (force) {
        if (force || this.isSizeDirty) {
            this.assignSegSizes(this.segs);
            this.isSizeDirty = false;
    ***REMOVED***
***REMOVED***;
    FgEventRenderer.prototype.computeSegSizes = function (segs) {
***REMOVED***;
    FgEventRenderer.prototype.assignSegSizes = function (segs) {
***REMOVED***;
    // Manipulation on rendered segs
    FgEventRenderer.prototype.hideByHash = function (hash) {
        if (hash) {
            for (var _i = 0, _a = this.segs; _i < _a.length; _i++) {
                var seg = _a[_i];
                if (hash[seg.eventRange.instance.instanceId]) {
                    seg.el.style.visibility = 'hidden';
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***;
    FgEventRenderer.prototype.showByHash = function (hash) {
        if (hash) {
            for (var _i = 0, _a = this.segs; _i < _a.length; _i++) {
                var seg = _a[_i];
                if (hash[seg.eventRange.instance.instanceId]) {
                    seg.el.style.visibility = '';
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***;
    FgEventRenderer.prototype.selectByInstanceId = function (instanceId) {
        if (instanceId) {
            for (var _i = 0, _a = this.segs; _i < _a.length; _i++) {
                var seg = _a[_i];
                var eventInstance = seg.eventRange.instance;
                if (eventInstance && eventInstance.instanceId === instanceId &&
                    seg.el // necessary?
                ) {
                    seg.el.classList.add('fc-selected');
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***;
    FgEventRenderer.prototype.unselectByInstanceId = function (instanceId) {
        if (instanceId) {
            for (var _i = 0, _a = this.segs; _i < _a.length; _i++) {
                var seg = _a[_i];
                if (seg.el) { // necessary?
                    seg.el.classList.remove('fc-selected');
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***;
    return FgEventRenderer;
***REMOVED***());
// returns a object with all primitive props that can be compared
function buildSegCompareObj(seg) {
    var eventDef = seg.eventRange.def;
    var range = seg.eventRange.instance.range;
    var start = range.start ? range.start.valueOf() : 0; // TODO: better support for open-range events
    var end = range.end ? range.end.valueOf() : 0; // "
    return __assign({***REMOVED***, eventDef.extendedProps, eventDef, { id: eventDef.publicId, start: start,
        end: end, duration: end - start, allDay: Number(eventDef.allDay), _seg: seg // for later retrieval
 ***REMOVED***);
***REMOVED***

var FillRenderer = /** @class */ (function () {
    function FillRenderer(context) {
        this.fillSegTag = 'div';
        this.dirtySizeFlags = {***REMOVED***;
        this.context = context;
        this.containerElsByType = {***REMOVED***;
        this.segsByType = {***REMOVED***;
***REMOVED***
    FillRenderer.prototype.getSegsByType = function (type) {
        return this.segsByType[type] || [];
***REMOVED***;
    FillRenderer.prototype.renderSegs = function (type, segs) {
        var _a;
        var renderedSegs = this.renderSegEls(type, segs); // assignes `.el` to each seg. returns successfully rendered segs
        var containerEls = this.attachSegs(type, renderedSegs);
        if (containerEls) {
            (_a = (this.containerElsByType[type] || (this.containerElsByType[type] = []))).push.apply(_a, containerEls);
    ***REMOVED***
        this.segsByType[type] = renderedSegs;
        if (type === 'bgEvent') {
            this.context.view.triggerRenderedSegs(renderedSegs, false); // isMirror=false
    ***REMOVED***
        this.dirtySizeFlags[type] = true;
***REMOVED***;
    // Unrenders a specific type of fill that is currently rendered on the grid
    FillRenderer.prototype.unrender = function (type) {
        var segs = this.segsByType[type];
        if (segs) {
            if (type === 'bgEvent') {
                this.context.view.triggerWillRemoveSegs(segs, false); // isMirror=false
        ***REMOVED***
            this.detachSegs(type, segs);
    ***REMOVED***
***REMOVED***;
    // Renders and assigns an `el` property for each fill segment. Generic enough to work with different types.
    // Only returns segments that successfully rendered.
    FillRenderer.prototype.renderSegEls = function (type, segs) {
        var _this = this;
        var html = '';
        var i;
        if (segs.length) {
    ***REMOVED*** build a large concatenation of segment HTML
            for (i = 0; i < segs.length; i++) {
                html += this.renderSegHtml(type, segs[i]);
        ***REMOVED***
    ***REMOVED*** Grab individual elements from the combined HTML string. Use each as the default rendering.
    ***REMOVED*** Then, compute the 'el' for each segment.
            htmlToElements(html).forEach(function (el, i) {
                var seg = segs[i];
                if (el) {
                    seg.el = el;
            ***REMOVED***
        ***REMOVED***);
            if (type === 'bgEvent') {
                segs = filterSegsViaEls(this.context.view, segs, false // isMirror. background events can never be mirror elements
                );
        ***REMOVED***
    ***REMOVED*** correct element type? (would be bad if a non-TD were inserted into a table for example)
            segs = segs.filter(function (seg) {
                return elementMatches(seg.el, _this.fillSegTag);
        ***REMOVED***);
    ***REMOVED***
        return segs;
***REMOVED***;
    // Builds the HTML needed for one fill segment. Generic enough to work with different types.
    FillRenderer.prototype.renderSegHtml = function (type, seg) {
        var css = null;
        var classNames = [];
        if (type !== 'highlight' && type !== 'businessHours') {
            css = {
                'background-color': seg.eventRange.ui.backgroundColor
        ***REMOVED***;
    ***REMOVED***
        if (type !== 'highlight') {
            classNames = classNames.concat(seg.eventRange.ui.classNames);
    ***REMOVED***
        if (type === 'businessHours') {
            classNames.push('fc-bgevent');
    ***REMOVED***
        else {
            classNames.push('fc-' + type.toLowerCase());
    ***REMOVED***
        return '<' + this.fillSegTag +
            (classNames.length ? ' class="' + classNames.join(' ') + '"' : '') +
            (css ? ' style="' + cssToStr(css) + '"' : '') +
            '></' + this.fillSegTag + '>';
***REMOVED***;
    FillRenderer.prototype.detachSegs = function (type, segs) {
        var containerEls = this.containerElsByType[type];
        if (containerEls) {
            containerEls.forEach(removeElement);
            delete this.containerElsByType[type];
    ***REMOVED***
***REMOVED***;
    FillRenderer.prototype.computeSizes = function (force) {
        for (var type in this.segsByType) {
            if (force || this.dirtySizeFlags[type]) {
                this.computeSegSizes(this.segsByType[type]);
        ***REMOVED***
    ***REMOVED***
***REMOVED***;
    FillRenderer.prototype.assignSizes = function (force) {
        for (var type in this.segsByType) {
            if (force || this.dirtySizeFlags[type]) {
                this.assignSegSizes(this.segsByType[type]);
        ***REMOVED***
    ***REMOVED***
        this.dirtySizeFlags = {***REMOVED***;
***REMOVED***;
    FillRenderer.prototype.computeSegSizes = function (segs) {
***REMOVED***;
    FillRenderer.prototype.assignSegSizes = function (segs) {
***REMOVED***;
    return FillRenderer;
***REMOVED***());

var NamedTimeZoneImpl = /** @class */ (function () {
    function NamedTimeZoneImpl(timeZoneName) {
        this.timeZoneName = timeZoneName;
***REMOVED***
    return NamedTimeZoneImpl;
***REMOVED***());

/*
An abstraction for a dragging interaction originating on an event.
Does higher-level things than PointerDragger, such as possibly:
- a "mirror" that moves with the pointer
- a minimum number of pixels or other criteria for a true drag to begin

subclasses must emit:
- pointerdown
- dragstart
- dragmove
- pointerup
- dragend
*/
var ElementDragging = /** @class */ (function () {
    function ElementDragging(el) {
        this.emitter = new EmitterMixin();
***REMOVED***
    ElementDragging.prototype.destroy = function () {
***REMOVED***;
    ElementDragging.prototype.setMirrorIsVisible = function (bool) {
***REMOVED*** optional if subclass doesn't want to support a mirror
***REMOVED***;
    ElementDragging.prototype.setMirrorNeedsRevert = function (bool) {
***REMOVED*** optional if subclass doesn't want to support a mirror
***REMOVED***;
    ElementDragging.prototype.setAutoScrollEnabled = function (bool) {
***REMOVED*** optional
***REMOVED***;
    return ElementDragging;
***REMOVED***());

function formatDate(dateInput, settings) {
    if (settings === void 0) { settings = {***REMOVED***; ***REMOVED***
    var dateEnv = buildDateEnv$1(settings);
    var formatter = createFormatter(settings);
    var dateMeta = dateEnv.createMarkerMeta(dateInput);
    if (!dateMeta) { // TODO: warning?
        return '';
***REMOVED***
    return dateEnv.format(dateMeta.marker, formatter, {
        forcedTzo: dateMeta.forcedTzo
***REMOVED***);
***REMOVED***
function formatRange(startInput, endInput, settings // mixture of env and formatter settings
) {
    var dateEnv = buildDateEnv$1(typeof settings === 'object' && settings ? settings : {***REMOVED***); // pass in if non-null object
    var formatter = createFormatter(settings, globalDefaults.defaultRangeSeparator);
    var startMeta = dateEnv.createMarkerMeta(startInput);
    var endMeta = dateEnv.createMarkerMeta(endInput);
    if (!startMeta || !endMeta) { // TODO: warning?
        return '';
***REMOVED***
    return dateEnv.formatRange(startMeta.marker, endMeta.marker, formatter, {
        forcedStartTzo: startMeta.forcedTzo,
        forcedEndTzo: endMeta.forcedTzo,
        isEndExclusive: settings.isEndExclusive
***REMOVED***);
***REMOVED***
// TODO: more DRY and optimized
function buildDateEnv$1(settings) {
    var locale = buildLocale(settings.locale || 'en', parseRawLocales([]).map); // TODO: don't hardcode 'en' everywhere
    // ensure required settings
    settings = __assign({ timeZone: globalDefaults.timeZone, calendarSystem: 'gregory' ***REMOVED***, settings, { locale: locale ***REMOVED***);
    return new DateEnv(settings);
***REMOVED***

var DRAG_META_PROPS = {
    startTime: createDuration,
    duration: createDuration,
    create: Boolean,
    sourceId: String
***REMOVED***;
var DRAG_META_DEFAULTS = {
    create: true
***REMOVED***;
function parseDragMeta(raw) {
    var leftoverProps = {***REMOVED***;
    var refined = refineProps(raw, DRAG_META_PROPS, DRAG_META_DEFAULTS, leftoverProps);
    refined.leftoverProps = leftoverProps;
    return refined;
***REMOVED***

// Computes a default column header formatting string if `colFormat` is not explicitly defined
function computeFallbackHeaderFormat(datesRepDistinctDays, dayCnt) {
    // if more than one week row, or if there are a lot of columns with not much space,
    // put just the day numbers will be in each cell
    if (!datesRepDistinctDays || dayCnt > 10) {
        return { weekday: 'short' ***REMOVED***; // "Sat"
***REMOVED***
    else if (dayCnt > 1) {
        return { weekday: 'short', month: 'numeric', day: 'numeric', omitCommas: true ***REMOVED***; // "Sat 11/12"
***REMOVED***
    else {
        return { weekday: 'long' ***REMOVED***; // "Saturday"
***REMOVED***
***REMOVED***
function renderDateCell(dateMarker, dateProfile, datesRepDistinctDays, colCnt, colHeadFormat, context, colspan, otherAttrs) {
    var view = context.view, dateEnv = context.dateEnv, theme = context.theme, options = context.options;
    var isDateValid = rangeContainsMarker(dateProfile.activeRange, dateMarker); // TODO: called too frequently. cache somehow.
    var classNames = [
        'fc-day-header',
        theme.getClass('widgetHeader')
    ];
    var innerHtml;
    if (typeof options.columnHeaderHtml === 'function') {
        innerHtml = options.columnHeaderHtml(dateEnv.toDate(dateMarker));
***REMOVED***
    else if (typeof options.columnHeaderText === 'function') {
        innerHtml = htmlEscape(options.columnHeaderText(dateEnv.toDate(dateMarker)));
***REMOVED***
    else {
        innerHtml = htmlEscape(dateEnv.format(dateMarker, colHeadFormat));
***REMOVED***
    // if only one row of days, the classNames on the header can represent the specific days beneath
    if (datesRepDistinctDays) {
        classNames = classNames.concat(
***REMOVED*** includes the day-of-week class
***REMOVED*** noThemeHighlight=true (don't highlight the header)
        getDayClasses(dateMarker, dateProfile, context, true));
***REMOVED***
    else {
        classNames.push('fc-' + DAY_IDS[dateMarker.getUTCDay()]); // only add the day-of-week class
***REMOVED***
    return '' +
        '<th class="' + classNames.join(' ') + '"' +
        ((isDateValid && datesRepDistinctDays) ?
            ' data-date="' + dateEnv.formatIso(dateMarker, { omitTime: true ***REMOVED***) + '"' :
            '') +
        (colspan > 1 ?
            ' colspan="' + colspan + '"' :
            '') +
        (otherAttrs ?
            ' ' + otherAttrs :
            '') +
        '>' +
        (isDateValid ?
    ***REMOVED*** don't make a link if the heading could represent multiple days, or if there's only one day (forceOff)
            buildGotoAnchorHtml(view, { date: dateMarker, forceOff: !datesRepDistinctDays || colCnt === 1 ***REMOVED***, innerHtml) :
    ***REMOVED*** if not valid, display text, but no link
            innerHtml) +
        '</th>';
***REMOVED***

var DayHeader = /** @class */ (function (_super) {
    __extends(DayHeader, _super);
    function DayHeader(context, parentEl) {
        var _this = _super.call(this, context) || this;
        parentEl.innerHTML = ''; // because might be nbsp
        parentEl.appendChild(_this.el = htmlToElement('<div class="fc-row ' + _this.theme.getClass('headerRow') + '">' +
            '<table class="' + _this.theme.getClass('tableGrid') + '">' +
            '<thead></thead>' +
            '</table>' +
            '</div>'));
        _this.thead = _this.el.querySelector('thead');
        return _this;
***REMOVED***
    DayHeader.prototype.destroy = function () {
        removeElement(this.el);
***REMOVED***;
    DayHeader.prototype.render = function (props) {
        var dates = props.dates, datesRepDistinctDays = props.datesRepDistinctDays;
        var parts = [];
        if (props.renderIntroHtml) {
            parts.push(props.renderIntroHtml());
    ***REMOVED***
        var colHeadFormat = createFormatter(this.opt('columnHeaderFormat') ||
            computeFallbackHeaderFormat(datesRepDistinctDays, dates.length));
        for (var _i = 0, dates_1 = dates; _i < dates_1.length; _i++) {
            var date = dates_1[_i];
            parts.push(renderDateCell(date, props.dateProfile, datesRepDistinctDays, dates.length, colHeadFormat, this.context));
    ***REMOVED***
        if (this.isRtl) {
            parts.reverse();
    ***REMOVED***
        this.thead.innerHTML = '<tr>' + parts.join('') + '</tr>';
***REMOVED***;
    return DayHeader;
***REMOVED***(Component));

var DaySeries = /** @class */ (function () {
    function DaySeries(range, dateProfileGenerator) {
        var date = range.start;
        var end = range.end;
        var indices = [];
        var dates = [];
        var dayIndex = -1;
        while (date < end) { // loop each day from start to end
            if (dateProfileGenerator.isHiddenDay(date)) {
                indices.push(dayIndex + 0.5); // mark that it's between indices
        ***REMOVED***
            else {
                dayIndex++;
                indices.push(dayIndex);
                dates.push(date);
        ***REMOVED***
            date = addDays(date, 1);
    ***REMOVED***
        this.dates = dates;
        this.indices = indices;
        this.cnt = dates.length;
***REMOVED***
    DaySeries.prototype.sliceRange = function (range) {
        var firstIndex = this.getDateDayIndex(range.start); // inclusive first index
        var lastIndex = this.getDateDayIndex(addDays(range.end, -1)); // inclusive last index
        var clippedFirstIndex = Math.max(0, firstIndex);
        var clippedLastIndex = Math.min(this.cnt - 1, lastIndex);
***REMOVED*** deal with in-between indices
        clippedFirstIndex = Math.ceil(clippedFirstIndex); // in-between starts round to next cell
        clippedLastIndex = Math.floor(clippedLastIndex); // in-between ends round to prev cell
        if (clippedFirstIndex <= clippedLastIndex) {
            return {
                firstIndex: clippedFirstIndex,
                lastIndex: clippedLastIndex,
                isStart: firstIndex === clippedFirstIndex,
                isEnd: lastIndex === clippedLastIndex
        ***REMOVED***;
    ***REMOVED***
        else {
            return null;
    ***REMOVED***
***REMOVED***;
    // Given a date, returns its chronolocial cell-index from the first cell of the grid.
    // If the date lies between cells (because of hiddenDays), returns a floating-point value between offsets.
    // If before the first offset, returns a negative number.
    // If after the last offset, returns an offset past the last cell offset.
    // Only works for *start* dates of cells. Will not work for exclusive end dates for cells.
    DaySeries.prototype.getDateDayIndex = function (date) {
        var indices = this.indices;
        var dayOffset = Math.floor(diffDays(this.dates[0], date));
        if (dayOffset < 0) {
            return indices[0] - 1;
    ***REMOVED***
        else if (dayOffset >= indices.length) {
            return indices[indices.length - 1] + 1;
    ***REMOVED***
        else {
            return indices[dayOffset];
    ***REMOVED***
***REMOVED***;
    return DaySeries;
***REMOVED***());

var DayTable = /** @class */ (function () {
    function DayTable(daySeries, breakOnWeeks) {
        var dates = daySeries.dates;
        var daysPerRow;
        var firstDay;
        var rowCnt;
        if (breakOnWeeks) {
    ***REMOVED*** count columns until the day-of-week repeats
            firstDay = dates[0].getUTCDay();
            for (daysPerRow = 1; daysPerRow < dates.length; daysPerRow++) {
                if (dates[daysPerRow].getUTCDay() === firstDay) {
                    break;
            ***REMOVED***
        ***REMOVED***
            rowCnt = Math.ceil(dates.length / daysPerRow);
    ***REMOVED***
        else {
            rowCnt = 1;
            daysPerRow = dates.length;
    ***REMOVED***
        this.rowCnt = rowCnt;
        this.colCnt = daysPerRow;
        this.daySeries = daySeries;
        this.cells = this.buildCells();
        this.headerDates = this.buildHeaderDates();
***REMOVED***
    DayTable.prototype.buildCells = function () {
        var rows = [];
        for (var row = 0; row < this.rowCnt; row++) {
            var cells = [];
            for (var col = 0; col < this.colCnt; col++) {
                cells.push(this.buildCell(row, col));
        ***REMOVED***
            rows.push(cells);
    ***REMOVED***
        return rows;
***REMOVED***;
    DayTable.prototype.buildCell = function (row, col) {
        return {
            date: this.daySeries.dates[row * this.colCnt + col]
    ***REMOVED***;
***REMOVED***;
    DayTable.prototype.buildHeaderDates = function () {
        var dates = [];
        for (var col = 0; col < this.colCnt; col++) {
            dates.push(this.cells[0][col].date);
    ***REMOVED***
        return dates;
***REMOVED***;
    DayTable.prototype.sliceRange = function (range) {
        var colCnt = this.colCnt;
        var seriesSeg = this.daySeries.sliceRange(range);
        var segs = [];
        if (seriesSeg) {
            var firstIndex = seriesSeg.firstIndex, lastIndex = seriesSeg.lastIndex;
            var index = firstIndex;
            while (index <= lastIndex) {
                var row = Math.floor(index / colCnt);
                var nextIndex = Math.min((row + 1) * colCnt, lastIndex + 1);
                segs.push({
                    row: row,
                    firstCol: index % colCnt,
                    lastCol: (nextIndex - 1) % colCnt,
                    isStart: seriesSeg.isStart && index === firstIndex,
                    isEnd: seriesSeg.isEnd && (nextIndex - 1) === lastIndex
            ***REMOVED***);
                index = nextIndex;
        ***REMOVED***
    ***REMOVED***
        return segs;
***REMOVED***;
    return DayTable;
***REMOVED***());

var Slicer = /** @class */ (function () {
    function Slicer() {
        this.sliceBusinessHours = memoize(this._sliceBusinessHours);
        this.sliceDateSelection = memoize(this._sliceDateSpan);
        this.sliceEventStore = memoize(this._sliceEventStore);
        this.sliceEventDrag = memoize(this._sliceInteraction);
        this.sliceEventResize = memoize(this._sliceInteraction);
***REMOVED***
    Slicer.prototype.sliceProps = function (props, dateProfile, nextDayThreshold, component) {
        var extraArgs = [];
        for (var _i = 4; _i < arguments.length; _i++) {
            extraArgs[_i - 4] = arguments[_i];
    ***REMOVED***
        var eventUiBases = props.eventUiBases;
        var eventSegs = this.sliceEventStore.apply(this, [props.eventStore, eventUiBases, dateProfile, nextDayThreshold, component].concat(extraArgs));
        return {
            dateSelectionSegs: this.sliceDateSelection.apply(this, [props.dateSelection, eventUiBases, component].concat(extraArgs)),
            businessHourSegs: this.sliceBusinessHours.apply(this, [props.businessHours, dateProfile, nextDayThreshold, component].concat(extraArgs)),
            fgEventSegs: eventSegs.fg,
            bgEventSegs: eventSegs.bg,
            eventDrag: this.sliceEventDrag.apply(this, [props.eventDrag, eventUiBases, dateProfile, nextDayThreshold, component].concat(extraArgs)),
            eventResize: this.sliceEventResize.apply(this, [props.eventResize, eventUiBases, dateProfile, nextDayThreshold, component].concat(extraArgs)),
            eventSelection: props.eventSelection
    ***REMOVED***; // TODO: give interactionSegs?
***REMOVED***;
    Slicer.prototype.sliceNowDate = function (// does not memoize
    date, component) {
        var extraArgs = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            extraArgs[_i - 2] = arguments[_i];
    ***REMOVED***
        return this._sliceDateSpan.apply(this, [{ range: { start: date, end: addMs(date, 1) ***REMOVED***, allDay: false ***REMOVED***,
            {***REMOVED***,
            component].concat(extraArgs));
***REMOVED***;
    Slicer.prototype._sliceBusinessHours = function (businessHours, dateProfile, nextDayThreshold, component) {
        var extraArgs = [];
        for (var _i = 4; _i < arguments.length; _i++) {
            extraArgs[_i - 4] = arguments[_i];
    ***REMOVED***
        if (!businessHours) {
            return [];
    ***REMOVED***
        return this._sliceEventStore.apply(this, [expandRecurring(businessHours, computeActiveRange(dateProfile, Boolean(nextDayThreshold)), component.calendar),
            {***REMOVED***,
            dateProfile,
            nextDayThreshold,
            component].concat(extraArgs)).bg;
***REMOVED***;
    Slicer.prototype._sliceEventStore = function (eventStore, eventUiBases, dateProfile, nextDayThreshold, component) {
        var extraArgs = [];
        for (var _i = 5; _i < arguments.length; _i++) {
            extraArgs[_i - 5] = arguments[_i];
    ***REMOVED***
        if (eventStore) {
            var rangeRes = sliceEventStore(eventStore, eventUiBases, computeActiveRange(dateProfile, Boolean(nextDayThreshold)), nextDayThreshold);
            return {
                bg: this.sliceEventRanges(rangeRes.bg, component, extraArgs),
                fg: this.sliceEventRanges(rangeRes.fg, component, extraArgs)
        ***REMOVED***;
    ***REMOVED***
        else {
            return { bg: [], fg: [] ***REMOVED***;
    ***REMOVED***
***REMOVED***;
    Slicer.prototype._sliceInteraction = function (interaction, eventUiBases, dateProfile, nextDayThreshold, component) {
        var extraArgs = [];
        for (var _i = 5; _i < arguments.length; _i++) {
            extraArgs[_i - 5] = arguments[_i];
    ***REMOVED***
        if (!interaction) {
            return null;
    ***REMOVED***
        var rangeRes = sliceEventStore(interaction.mutatedEvents, eventUiBases, computeActiveRange(dateProfile, Boolean(nextDayThreshold)), nextDayThreshold);
        return {
            segs: this.sliceEventRanges(rangeRes.fg, component, extraArgs),
            affectedInstances: interaction.affectedEvents.instances,
            isEvent: interaction.isEvent,
            sourceSeg: interaction.origSeg
    ***REMOVED***;
***REMOVED***;
    Slicer.prototype._sliceDateSpan = function (dateSpan, eventUiBases, component) {
        var extraArgs = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            extraArgs[_i - 3] = arguments[_i];
    ***REMOVED***
        if (!dateSpan) {
            return [];
    ***REMOVED***
        var eventRange = fabricateEventRange(dateSpan, eventUiBases, component.calendar);
        var segs = this.sliceRange.apply(this, [dateSpan.range].concat(extraArgs));
        for (var _a = 0, segs_1 = segs; _a < segs_1.length; _a++) {
            var seg = segs_1[_a];
            seg.component = component;
            seg.eventRange = eventRange;
    ***REMOVED***
        return segs;
***REMOVED***;
    /*
    "complete" seg means it has component and eventRange
    */
    Slicer.prototype.sliceEventRanges = function (eventRanges, component, // TODO: kill
    extraArgs) {
        var segs = [];
        for (var _i = 0, eventRanges_1 = eventRanges; _i < eventRanges_1.length; _i++) {
            var eventRange = eventRanges_1[_i];
            segs.push.apply(segs, this.sliceEventRange(eventRange, component, extraArgs));
    ***REMOVED***
        return segs;
***REMOVED***;
    /*
    "complete" seg means it has component and eventRange
    */
    Slicer.prototype.sliceEventRange = function (eventRange, component, // TODO: kill
    extraArgs) {
        var segs = this.sliceRange.apply(this, [eventRange.range].concat(extraArgs));
        for (var _i = 0, segs_2 = segs; _i < segs_2.length; _i++) {
            var seg = segs_2[_i];
            seg.component = component;
            seg.eventRange = eventRange;
            seg.isStart = eventRange.isStart && seg.isStart;
            seg.isEnd = eventRange.isEnd && seg.isEnd;
    ***REMOVED***
        return segs;
***REMOVED***;
    return Slicer;
***REMOVED***());
/*
for incorporating minTime/maxTime if appropriate
TODO: should be part of DateProfile!
TimelineDateProfile already does this btw
*/
function computeActiveRange(dateProfile, isComponentAllDay) {
    var range = dateProfile.activeRange;
    if (isComponentAllDay) {
        return range;
***REMOVED***
    return {
        start: addMs(range.start, dateProfile.minTime.milliseconds),
        end: addMs(range.end, dateProfile.maxTime.milliseconds - 864e5) // 864e5 = ms in a day
***REMOVED***;
***REMOVED***

// exports
// --------------------------------------------------------------------------------------------------
var version = '4.3.1';

export { Calendar, Component, DateComponent, DateEnv, DateProfileGenerator, DayHeader, DaySeries, DayTable, ElementDragging, ElementScrollController, EmitterMixin, EventApi, FgEventRenderer, FillRenderer, Interaction, Mixin, NamedTimeZoneImpl, PositionCache, ScrollComponent, ScrollController, Slicer, Splitter, Theme, View, WindowScrollController, addDays, addDurations, addMs, addWeeks, allowContextMenu, allowSelection, appendToElement, applyAll, applyMutationToEventStore, applyStyle, applyStyleProp, asRoughMinutes, asRoughMs, asRoughSeconds, buildGotoAnchorHtml, buildSegCompareObj, capitaliseFirstLetter, combineEventUis, compareByFieldSpec, compareByFieldSpecs, compareNumbers, compensateScroll, computeClippingRect, computeEdges, computeFallbackHeaderFormat, computeHeightAndMargins, computeInnerRect, computeRect, computeVisibleDayRange, config, constrainPoint, createDuration, createElement, createEmptyEventStore, createEventInstance, createFormatter, createPlugin, cssToStr, debounce, diffDates, diffDayAndTime, diffDays, diffPoints, diffWeeks, diffWholeDays, diffWholeWeeks, disableCursor, distributeHeight, elementClosest, elementMatches, enableCursor, eventTupleToStore, filterEventStoreDefs, filterHash, findChildren, findElements, flexibleCompare, forceClassName, formatDate, formatIsoTimeString, formatRange, getAllDayHtml, getClippingParents, getDayClasses, getElSeg, getRectCenter, getRelevantEvents, globalDefaults, greatestDurationDenominator, hasBgRendering, htmlEscape, htmlToElement, insertAfterElement, interactionSettingsStore, interactionSettingsToStore, intersectRanges, intersectRects, isArraysEqual, isDateSpansEqual, isInt, isInteractionValid, isMultiDayRange, isPropsEqual, isPropsValid, isSingleDay, isValidDate, listenBySelector, mapHash, matchCellWidths, memoize, memoizeOutput, memoizeRendering, mergeEventStores, multiplyDuration, padStart, parseBusinessHours, parseDragMeta, parseEventDef, parseFieldSpecs, parse as parseMarker, pointInsideRect, prependToElement, preventContextMenu, preventDefault, preventSelection, processScopedUiProps, rangeContainsMarker, rangeContainsRange, rangesEqual, rangesIntersect, refineProps, removeElement, removeExact, renderDateCell, requestJson, sliceEventStore, startOfDay, subtractInnerElHeight, translateRect, uncompensateScroll, undistributeHeight, unpromisify, version, whenTransitionDone, wholeDivideDurations ***REMOVED***;
