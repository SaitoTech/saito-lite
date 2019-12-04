/*!
FullCalendar Interaction Plugin v4.3.0
Docs & License: https://fullcalendar.io/
(c) 2019 Adam Shaw
*/

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@fullcalendar/core')) :
    typeof define === 'function' && define.amd ? define(['exports', '@fullcalendar/core'], factory) :
    (global = global || self, factory(global.FullCalendarInteraction = {***REMOVED***, global.FullCalendar));
***REMOVED***(this, function (exports, core) { 'use strict';

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

    core.config.touchMouseIgnoreWait = 500;
    var ignoreMouseDepth = 0;
    var listenerCnt = 0;
    var isWindowTouchMoveCancelled = false;
    /*
    Uses a "pointer" abstraction, which monitors UI events for both mouse and touch.
    Tracks when the pointer "drags" on a certain element, meaning down+move+up.

    Also, tracks if there was touch-scrolling.
    Also, can prevent touch-scrolling from happening.
    Also, can fire pointermove events when scrolling happens underneath, even when no real pointer movement.

    emits:
    - pointerdown
    - pointermove
    - pointerup
    */
    var PointerDragging = /** @class */ (function () {
        function PointerDragging(containerEl) {
            var _this = this;
            this.subjectEl = null;
            this.downEl = null;
    ***REMOVED*** options that can be directly assigned by caller
            this.selector = ''; // will cause subjectEl in all emitted events to be this element
            this.handleSelector = '';
            this.shouldIgnoreMove = false;
            this.shouldWatchScroll = true; // for simulating pointermove on scroll
    ***REMOVED*** internal states
            this.isDragging = false;
            this.isTouchDragging = false;
            this.wasTouchScroll = false;
    ***REMOVED*** Mouse
    ***REMOVED*** ----------------------------------------------------------------------------------------------------
            this.handleMouseDown = function (ev) {
                if (!_this.shouldIgnoreMouse() &&
                    isPrimaryMouseButton(ev) &&
                    _this.tryStart(ev)) {
                    var pev = _this.createEventFromMouse(ev, true);
                    _this.emitter.trigger('pointerdown', pev);
                    _this.initScrollWatch(pev);
                    if (!_this.shouldIgnoreMove) {
                        document.addEventListener('mousemove', _this.handleMouseMove);
                ***REMOVED***
                    document.addEventListener('mouseup', _this.handleMouseUp);
            ***REMOVED***
        ***REMOVED***;
            this.handleMouseMove = function (ev) {
                var pev = _this.createEventFromMouse(ev);
                _this.recordCoords(pev);
                _this.emitter.trigger('pointermove', pev);
        ***REMOVED***;
            this.handleMouseUp = function (ev) {
                document.removeEventListener('mousemove', _this.handleMouseMove);
                document.removeEventListener('mouseup', _this.handleMouseUp);
                _this.emitter.trigger('pointerup', _this.createEventFromMouse(ev));
                _this.cleanup(); // call last so that pointerup has access to props
        ***REMOVED***;
    ***REMOVED*** Touch
    ***REMOVED*** ----------------------------------------------------------------------------------------------------
            this.handleTouchStart = function (ev) {
                if (_this.tryStart(ev)) {
                    _this.isTouchDragging = true;
                    var pev = _this.createEventFromTouch(ev, true);
                    _this.emitter.trigger('pointerdown', pev);
                    _this.initScrollWatch(pev);
            ***REMOVED*** unlike mouse, need to attach to target, not document
            ***REMOVED*** https://stackoverflow.com/a/45760014
                    var target = ev.target;
                    if (!_this.shouldIgnoreMove) {
                        target.addEventListener('touchmove', _this.handleTouchMove);
                ***REMOVED***
                    target.addEventListener('touchend', _this.handleTouchEnd);
                    target.addEventListener('touchcancel', _this.handleTouchEnd); // treat it as a touch end
            ***REMOVED*** attach a handler to get called when ANY scroll action happens on the page.
            ***REMOVED*** this was impossible to do with normal on/off because 'scroll' doesn't bubble.
            ***REMOVED*** http://stackoverflow.com/a/32954565/96342
                    window.addEventListener('scroll', _this.handleTouchScroll, true // useCapture
                    );
            ***REMOVED***
        ***REMOVED***;
            this.handleTouchMove = function (ev) {
                var pev = _this.createEventFromTouch(ev);
                _this.recordCoords(pev);
                _this.emitter.trigger('pointermove', pev);
        ***REMOVED***;
            this.handleTouchEnd = function (ev) {
                if (_this.isDragging) { // done to guard against touchend followed by touchcancel
                    var target = ev.target;
                    target.removeEventListener('touchmove', _this.handleTouchMove);
                    target.removeEventListener('touchend', _this.handleTouchEnd);
                    target.removeEventListener('touchcancel', _this.handleTouchEnd);
                    window.removeEventListener('scroll', _this.handleTouchScroll, true); // useCaptured=true
                    _this.emitter.trigger('pointerup', _this.createEventFromTouch(ev));
                    _this.cleanup(); // call last so that pointerup has access to props
                    _this.isTouchDragging = false;
                    startIgnoringMouse();
            ***REMOVED***
        ***REMOVED***;
            this.handleTouchScroll = function () {
                _this.wasTouchScroll = true;
        ***REMOVED***;
            this.handleScroll = function (ev) {
                if (!_this.shouldIgnoreMove) {
                    var pageX = (window.pageXOffset - _this.prevScrollX) + _this.prevPageX;
                    var pageY = (window.pageYOffset - _this.prevScrollY) + _this.prevPageY;
                    _this.emitter.trigger('pointermove', {
                        origEvent: ev,
                        isTouch: _this.isTouchDragging,
                        subjectEl: _this.subjectEl,
                        pageX: pageX,
                        pageY: pageY,
                        deltaX: pageX - _this.origPageX,
                        deltaY: pageY - _this.origPageY
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***;
            this.containerEl = containerEl;
            this.emitter = new core.EmitterMixin();
            containerEl.addEventListener('mousedown', this.handleMouseDown);
            containerEl.addEventListener('touchstart', this.handleTouchStart, { passive: true ***REMOVED***);
            listenerCreated();
    ***REMOVED***
        PointerDragging.prototype.destroy = function () {
            this.containerEl.removeEventListener('mousedown', this.handleMouseDown);
            this.containerEl.removeEventListener('touchstart', this.handleTouchStart, { passive: true ***REMOVED***);
            listenerDestroyed();
    ***REMOVED***;
        PointerDragging.prototype.tryStart = function (ev) {
            var subjectEl = this.querySubjectEl(ev);
            var downEl = ev.target;
            if (subjectEl &&
                (!this.handleSelector || core.elementClosest(downEl, this.handleSelector))) {
                this.subjectEl = subjectEl;
                this.downEl = downEl;
                this.isDragging = true; // do this first so cancelTouchScroll will work
                this.wasTouchScroll = false;
                return true;
        ***REMOVED***
            return false;
    ***REMOVED***;
        PointerDragging.prototype.cleanup = function () {
            isWindowTouchMoveCancelled = false;
            this.isDragging = false;
            this.subjectEl = null;
            this.downEl = null;
    ***REMOVED*** keep wasTouchScroll around for later access
            this.destroyScrollWatch();
    ***REMOVED***;
        PointerDragging.prototype.querySubjectEl = function (ev) {
            if (this.selector) {
                return core.elementClosest(ev.target, this.selector);
        ***REMOVED***
            else {
                return this.containerEl;
        ***REMOVED***
    ***REMOVED***;
        PointerDragging.prototype.shouldIgnoreMouse = function () {
            return ignoreMouseDepth || this.isTouchDragging;
    ***REMOVED***;
***REMOVED*** can be called by user of this class, to cancel touch-based scrolling for the current drag
        PointerDragging.prototype.cancelTouchScroll = function () {
            if (this.isDragging) {
                isWindowTouchMoveCancelled = true;
        ***REMOVED***
    ***REMOVED***;
***REMOVED*** Scrolling that simulates pointermoves
***REMOVED*** ----------------------------------------------------------------------------------------------------
        PointerDragging.prototype.initScrollWatch = function (ev) {
            if (this.shouldWatchScroll) {
                this.recordCoords(ev);
                window.addEventListener('scroll', this.handleScroll, true); // useCapture=true
        ***REMOVED***
    ***REMOVED***;
        PointerDragging.prototype.recordCoords = function (ev) {
            if (this.shouldWatchScroll) {
                this.prevPageX = ev.pageX;
                this.prevPageY = ev.pageY;
                this.prevScrollX = window.pageXOffset;
                this.prevScrollY = window.pageYOffset;
        ***REMOVED***
    ***REMOVED***;
        PointerDragging.prototype.destroyScrollWatch = function () {
            if (this.shouldWatchScroll) {
                window.removeEventListener('scroll', this.handleScroll, true); // useCaptured=true
        ***REMOVED***
    ***REMOVED***;
***REMOVED*** Event Normalization
***REMOVED*** ----------------------------------------------------------------------------------------------------
        PointerDragging.prototype.createEventFromMouse = function (ev, isFirst) {
            var deltaX = 0;
            var deltaY = 0;
    ***REMOVED*** TODO: repeat code
            if (isFirst) {
                this.origPageX = ev.pageX;
                this.origPageY = ev.pageY;
        ***REMOVED***
            else {
                deltaX = ev.pageX - this.origPageX;
                deltaY = ev.pageY - this.origPageY;
        ***REMOVED***
            return {
                origEvent: ev,
                isTouch: false,
                subjectEl: this.subjectEl,
                pageX: ev.pageX,
                pageY: ev.pageY,
                deltaX: deltaX,
                deltaY: deltaY
        ***REMOVED***;
    ***REMOVED***;
        PointerDragging.prototype.createEventFromTouch = function (ev, isFirst) {
            var touches = ev.touches;
            var pageX;
            var pageY;
            var deltaX = 0;
            var deltaY = 0;
    ***REMOVED*** if touch coords available, prefer,
    ***REMOVED*** because FF would give bad ev.pageX ev.pageY
            if (touches && touches.length) {
                pageX = touches[0].pageX;
                pageY = touches[0].pageY;
        ***REMOVED***
            else {
                pageX = ev.pageX;
                pageY = ev.pageY;
        ***REMOVED***
    ***REMOVED*** TODO: repeat code
            if (isFirst) {
                this.origPageX = pageX;
                this.origPageY = pageY;
        ***REMOVED***
            else {
                deltaX = pageX - this.origPageX;
                deltaY = pageY - this.origPageY;
        ***REMOVED***
            return {
                origEvent: ev,
                isTouch: true,
                subjectEl: this.subjectEl,
                pageX: pageX,
                pageY: pageY,
                deltaX: deltaX,
                deltaY: deltaY
        ***REMOVED***;
    ***REMOVED***;
        return PointerDragging;
***REMOVED***());
    // Returns a boolean whether this was a left mouse click and no ctrl key (which means right click on Mac)
    function isPrimaryMouseButton(ev) {
        return ev.button === 0 && !ev.ctrlKey;
***REMOVED***
    // Ignoring fake mouse events generated by touch
    // ----------------------------------------------------------------------------------------------------
    function startIgnoringMouse() {
        ignoreMouseDepth++;
        setTimeout(function () {
            ignoreMouseDepth--;
    ***REMOVED***, core.config.touchMouseIgnoreWait);
***REMOVED***
    // We want to attach touchmove as early as possible for Safari
    // ----------------------------------------------------------------------------------------------------
    function listenerCreated() {
        if (!(listenerCnt++)) {
            window.addEventListener('touchmove', onWindowTouchMove, { passive: false ***REMOVED***);
    ***REMOVED***
***REMOVED***
    function listenerDestroyed() {
        if (!(--listenerCnt)) {
            window.removeEventListener('touchmove', onWindowTouchMove, { passive: false ***REMOVED***);
    ***REMOVED***
***REMOVED***
    function onWindowTouchMove(ev) {
        if (isWindowTouchMoveCancelled) {
            ev.preventDefault();
    ***REMOVED***
***REMOVED***

    /*
    An effect in which an element follows the movement of a pointer across the screen.
    The moving element is a clone of some other element.
    Must call start + handleMove + stop.
    */
    var ElementMirror = /** @class */ (function () {
        function ElementMirror() {
            this.isVisible = false; // must be explicitly enabled
            this.sourceEl = null;
            this.mirrorEl = null;
            this.sourceElRect = null; // screen coords relative to viewport
    ***REMOVED*** options that can be set directly by caller
            this.parentNode = document.body;
            this.zIndex = 9999;
            this.revertDuration = 0;
    ***REMOVED***
        ElementMirror.prototype.start = function (sourceEl, pageX, pageY) {
            this.sourceEl = sourceEl;
            this.sourceElRect = this.sourceEl.getBoundingClientRect();
            this.origScreenX = pageX - window.pageXOffset;
            this.origScreenY = pageY - window.pageYOffset;
            this.deltaX = 0;
            this.deltaY = 0;
            this.updateElPosition();
    ***REMOVED***;
        ElementMirror.prototype.handleMove = function (pageX, pageY) {
            this.deltaX = (pageX - window.pageXOffset) - this.origScreenX;
            this.deltaY = (pageY - window.pageYOffset) - this.origScreenY;
            this.updateElPosition();
    ***REMOVED***;
***REMOVED*** can be called before start
        ElementMirror.prototype.setIsVisible = function (bool) {
            if (bool) {
                if (!this.isVisible) {
                    if (this.mirrorEl) {
                        this.mirrorEl.style.display = '';
                ***REMOVED***
                    this.isVisible = bool; // needs to happen before updateElPosition
                    this.updateElPosition(); // because was not updating the position while invisible
            ***REMOVED***
        ***REMOVED***
            else {
                if (this.isVisible) {
                    if (this.mirrorEl) {
                        this.mirrorEl.style.display = 'none';
                ***REMOVED***
                    this.isVisible = bool;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;
***REMOVED*** always async
        ElementMirror.prototype.stop = function (needsRevertAnimation, callback) {
            var _this = this;
            var done = function () {
                _this.cleanup();
                callback();
        ***REMOVED***;
            if (needsRevertAnimation &&
                this.mirrorEl &&
                this.isVisible &&
                this.revertDuration && // if 0, transition won't work
                (this.deltaX || this.deltaY) // if same coords, transition won't work
            ) {
                this.doRevertAnimation(done, this.revertDuration);
        ***REMOVED***
            else {
                setTimeout(done, 0);
        ***REMOVED***
    ***REMOVED***;
        ElementMirror.prototype.doRevertAnimation = function (callback, revertDuration) {
            var mirrorEl = this.mirrorEl;
            var finalSourceElRect = this.sourceEl.getBoundingClientRect(); // because autoscrolling might have happened
            mirrorEl.style.transition =
                'top ' + revertDuration + 'ms,' +
                    'left ' + revertDuration + 'ms';
            core.applyStyle(mirrorEl, {
                left: finalSourceElRect.left,
                top: finalSourceElRect.top
        ***REMOVED***);
            core.whenTransitionDone(mirrorEl, function () {
                mirrorEl.style.transition = '';
                callback();
        ***REMOVED***);
    ***REMOVED***;
        ElementMirror.prototype.cleanup = function () {
            if (this.mirrorEl) {
                core.removeElement(this.mirrorEl);
                this.mirrorEl = null;
        ***REMOVED***
            this.sourceEl = null;
    ***REMOVED***;
        ElementMirror.prototype.updateElPosition = function () {
            if (this.sourceEl && this.isVisible) {
                core.applyStyle(this.getMirrorEl(), {
                    left: this.sourceElRect.left + this.deltaX,
                    top: this.sourceElRect.top + this.deltaY
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***;
        ElementMirror.prototype.getMirrorEl = function () {
            var sourceElRect = this.sourceElRect;
            var mirrorEl = this.mirrorEl;
            if (!mirrorEl) {
                mirrorEl = this.mirrorEl = this.sourceEl.cloneNode(true); // cloneChildren=true
        ***REMOVED*** we don't want long taps or any mouse interaction causing selection/menus.
        ***REMOVED*** would use preventSelection(), but that prevents selectstart, causing problems.
                mirrorEl.classList.add('fc-unselectable');
                mirrorEl.classList.add('fc-dragging');
                core.applyStyle(mirrorEl, {
                    position: 'fixed',
                    zIndex: this.zIndex,
                    visibility: '',
                    boxSizing: 'border-box',
                    width: sourceElRect.right - sourceElRect.left,
                    height: sourceElRect.bottom - sourceElRect.top,
                    right: 'auto',
                    bottom: 'auto',
                    margin: 0
            ***REMOVED***);
                this.parentNode.appendChild(mirrorEl);
        ***REMOVED***
            return mirrorEl;
    ***REMOVED***;
        return ElementMirror;
***REMOVED***());

    /*
    Is a cache for a given element's scroll information (all the info that ScrollController stores)
    in addition the "client rectangle" of the element.. the area within the scrollbars.

    The cache can be in one of two modes:
    - doesListening:false - ignores when the container is scrolled by someone else
    - doesListening:true - watch for scrolling and update the cache
    */
    var ScrollGeomCache = /** @class */ (function (_super) {
        __extends(ScrollGeomCache, _super);
        function ScrollGeomCache(scrollController, doesListening) {
            var _this = _super.call(this) || this;
            _this.handleScroll = function () {
                _this.scrollTop = _this.scrollController.getScrollTop();
                _this.scrollLeft = _this.scrollController.getScrollLeft();
                _this.handleScrollChange();
        ***REMOVED***;
            _this.scrollController = scrollController;
            _this.doesListening = doesListening;
            _this.scrollTop = _this.origScrollTop = scrollController.getScrollTop();
            _this.scrollLeft = _this.origScrollLeft = scrollController.getScrollLeft();
            _this.scrollWidth = scrollController.getScrollWidth();
            _this.scrollHeight = scrollController.getScrollHeight();
            _this.clientWidth = scrollController.getClientWidth();
            _this.clientHeight = scrollController.getClientHeight();
            _this.clientRect = _this.computeClientRect(); // do last in case it needs cached values
            if (_this.doesListening) {
                _this.getEventTarget().addEventListener('scroll', _this.handleScroll);
        ***REMOVED***
            return _this;
    ***REMOVED***
        ScrollGeomCache.prototype.destroy = function () {
            if (this.doesListening) {
                this.getEventTarget().removeEventListener('scroll', this.handleScroll);
        ***REMOVED***
    ***REMOVED***;
        ScrollGeomCache.prototype.getScrollTop = function () {
            return this.scrollTop;
    ***REMOVED***;
        ScrollGeomCache.prototype.getScrollLeft = function () {
            return this.scrollLeft;
    ***REMOVED***;
        ScrollGeomCache.prototype.setScrollTop = function (top) {
            this.scrollController.setScrollTop(top);
            if (!this.doesListening) {
        ***REMOVED*** we are not relying on the element to normalize out-of-bounds scroll values
        ***REMOVED*** so we need to sanitize ourselves
                this.scrollTop = Math.max(Math.min(top, this.getMaxScrollTop()), 0);
                this.handleScrollChange();
        ***REMOVED***
    ***REMOVED***;
        ScrollGeomCache.prototype.setScrollLeft = function (top) {
            this.scrollController.setScrollLeft(top);
            if (!this.doesListening) {
        ***REMOVED*** we are not relying on the element to normalize out-of-bounds scroll values
        ***REMOVED*** so we need to sanitize ourselves
                this.scrollLeft = Math.max(Math.min(top, this.getMaxScrollLeft()), 0);
                this.handleScrollChange();
        ***REMOVED***
    ***REMOVED***;
        ScrollGeomCache.prototype.getClientWidth = function () {
            return this.clientWidth;
    ***REMOVED***;
        ScrollGeomCache.prototype.getClientHeight = function () {
            return this.clientHeight;
    ***REMOVED***;
        ScrollGeomCache.prototype.getScrollWidth = function () {
            return this.scrollWidth;
    ***REMOVED***;
        ScrollGeomCache.prototype.getScrollHeight = function () {
            return this.scrollHeight;
    ***REMOVED***;
        ScrollGeomCache.prototype.handleScrollChange = function () {
    ***REMOVED***;
        return ScrollGeomCache;
***REMOVED***(core.ScrollController));
    var ElementScrollGeomCache = /** @class */ (function (_super) {
        __extends(ElementScrollGeomCache, _super);
        function ElementScrollGeomCache(el, doesListening) {
            return _super.call(this, new core.ElementScrollController(el), doesListening) || this;
    ***REMOVED***
        ElementScrollGeomCache.prototype.getEventTarget = function () {
            return this.scrollController.el;
    ***REMOVED***;
        ElementScrollGeomCache.prototype.computeClientRect = function () {
            return core.computeInnerRect(this.scrollController.el);
    ***REMOVED***;
        return ElementScrollGeomCache;
***REMOVED***(ScrollGeomCache));
    var WindowScrollGeomCache = /** @class */ (function (_super) {
        __extends(WindowScrollGeomCache, _super);
        function WindowScrollGeomCache(doesListening) {
            return _super.call(this, new core.WindowScrollController(), doesListening) || this;
    ***REMOVED***
        WindowScrollGeomCache.prototype.getEventTarget = function () {
            return window;
    ***REMOVED***;
        WindowScrollGeomCache.prototype.computeClientRect = function () {
            return {
                left: this.scrollLeft,
                right: this.scrollLeft + this.clientWidth,
                top: this.scrollTop,
                bottom: this.scrollTop + this.clientHeight
        ***REMOVED***;
    ***REMOVED***;
***REMOVED*** the window is the only scroll object that changes it's rectangle relative
***REMOVED*** to the document's topleft as it scrolls
        WindowScrollGeomCache.prototype.handleScrollChange = function () {
            this.clientRect = this.computeClientRect();
    ***REMOVED***;
        return WindowScrollGeomCache;
***REMOVED***(ScrollGeomCache));

    // If available we are using native "performance" API instead of "Date"
    // Read more about it on MDN:
    // https://developer.mozilla.org/en-US/docs/Web/API/Performance
    var getTime = typeof performance === 'function' ? performance.now : Date.now;
    /*
    For a pointer interaction, automatically scrolls certain scroll containers when the pointer
    approaches the edge.

    The caller must call start + handleMove + stop.
    */
    var AutoScroller = /** @class */ (function () {
        function AutoScroller() {
            var _this = this;
    ***REMOVED*** options that can be set by caller
            this.isEnabled = true;
            this.scrollQuery = [window, '.fc-scroller'];
            this.edgeThreshold = 50; // pixels
            this.maxVelocity = 300; // pixels per second
    ***REMOVED*** internal state
            this.pointerScreenX = null;
            this.pointerScreenY = null;
            this.isAnimating = false;
            this.scrollCaches = null;
    ***REMOVED*** protect against the initial pointerdown being too close to an edge and starting the scroll
            this.everMovedUp = false;
            this.everMovedDown = false;
            this.everMovedLeft = false;
            this.everMovedRight = false;
            this.animate = function () {
                if (_this.isAnimating) { // wasn't cancelled between animation calls
                    var edge = _this.computeBestEdge(_this.pointerScreenX + window.pageXOffset, _this.pointerScreenY + window.pageYOffset);
                    if (edge) {
                        var now = getTime();
                        _this.handleSide(edge, (now - _this.msSinceRequest) / 1000);
                        _this.requestAnimation(now);
                ***REMOVED***
                    else {
                        _this.isAnimating = false; // will stop animation
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***;
    ***REMOVED***
        AutoScroller.prototype.start = function (pageX, pageY) {
            if (this.isEnabled) {
                this.scrollCaches = this.buildCaches();
                this.pointerScreenX = null;
                this.pointerScreenY = null;
                this.everMovedUp = false;
                this.everMovedDown = false;
                this.everMovedLeft = false;
                this.everMovedRight = false;
                this.handleMove(pageX, pageY);
        ***REMOVED***
    ***REMOVED***;
        AutoScroller.prototype.handleMove = function (pageX, pageY) {
            if (this.isEnabled) {
                var pointerScreenX = pageX - window.pageXOffset;
                var pointerScreenY = pageY - window.pageYOffset;
                var yDelta = this.pointerScreenY === null ? 0 : pointerScreenY - this.pointerScreenY;
                var xDelta = this.pointerScreenX === null ? 0 : pointerScreenX - this.pointerScreenX;
                if (yDelta < 0) {
                    this.everMovedUp = true;
            ***REMOVED***
                else if (yDelta > 0) {
                    this.everMovedDown = true;
            ***REMOVED***
                if (xDelta < 0) {
                    this.everMovedLeft = true;
            ***REMOVED***
                else if (xDelta > 0) {
                    this.everMovedRight = true;
            ***REMOVED***
                this.pointerScreenX = pointerScreenX;
                this.pointerScreenY = pointerScreenY;
                if (!this.isAnimating) {
                    this.isAnimating = true;
                    this.requestAnimation(getTime());
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;
        AutoScroller.prototype.stop = function () {
            if (this.isEnabled) {
                this.isAnimating = false; // will stop animation
                for (var _i = 0, _a = this.scrollCaches; _i < _a.length; _i++) {
                    var scrollCache = _a[_i];
                    scrollCache.destroy();
            ***REMOVED***
                this.scrollCaches = null;
        ***REMOVED***
    ***REMOVED***;
        AutoScroller.prototype.requestAnimation = function (now) {
            this.msSinceRequest = now;
            requestAnimationFrame(this.animate);
    ***REMOVED***;
        AutoScroller.prototype.handleSide = function (edge, seconds) {
            var scrollCache = edge.scrollCache;
            var edgeThreshold = this.edgeThreshold;
            var invDistance = edgeThreshold - edge.distance;
            var velocity = // the closer to the edge, the faster we scroll
             (invDistance * invDistance) / (edgeThreshold * edgeThreshold) * // quadratic
                this.maxVelocity * seconds;
            var sign = 1;
            switch (edge.name) {
                case 'left':
                    sign = -1;
        ***REMOVED*** falls through
                case 'right':
                    scrollCache.setScrollLeft(scrollCache.getScrollLeft() + velocity * sign);
                    break;
                case 'top':
                    sign = -1;
        ***REMOVED*** falls through
                case 'bottom':
                    scrollCache.setScrollTop(scrollCache.getScrollTop() + velocity * sign);
                    break;
        ***REMOVED***
    ***REMOVED***;
***REMOVED*** left/top are relative to document topleft
        AutoScroller.prototype.computeBestEdge = function (left, top) {
            var edgeThreshold = this.edgeThreshold;
            var bestSide = null;
            for (var _i = 0, _a = this.scrollCaches; _i < _a.length; _i++) {
                var scrollCache = _a[_i];
                var rect = scrollCache.clientRect;
                var leftDist = left - rect.left;
                var rightDist = rect.right - left;
                var topDist = top - rect.top;
                var bottomDist = rect.bottom - top;
        ***REMOVED*** completely within the rect?
                if (leftDist >= 0 && rightDist >= 0 && topDist >= 0 && bottomDist >= 0) {
                    if (topDist <= edgeThreshold && this.everMovedUp && scrollCache.canScrollUp() &&
                        (!bestSide || bestSide.distance > topDist)) {
                        bestSide = { scrollCache: scrollCache, name: 'top', distance: topDist ***REMOVED***;
                ***REMOVED***
                    if (bottomDist <= edgeThreshold && this.everMovedDown && scrollCache.canScrollDown() &&
                        (!bestSide || bestSide.distance > bottomDist)) {
                        bestSide = { scrollCache: scrollCache, name: 'bottom', distance: bottomDist ***REMOVED***;
                ***REMOVED***
                    if (leftDist <= edgeThreshold && this.everMovedLeft && scrollCache.canScrollLeft() &&
                        (!bestSide || bestSide.distance > leftDist)) {
                        bestSide = { scrollCache: scrollCache, name: 'left', distance: leftDist ***REMOVED***;
                ***REMOVED***
                    if (rightDist <= edgeThreshold && this.everMovedRight && scrollCache.canScrollRight() &&
                        (!bestSide || bestSide.distance > rightDist)) {
                        bestSide = { scrollCache: scrollCache, name: 'right', distance: rightDist ***REMOVED***;
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
            return bestSide;
    ***REMOVED***;
        AutoScroller.prototype.buildCaches = function () {
            return this.queryScrollEls().map(function (el) {
                if (el === window) {
                    return new WindowScrollGeomCache(false); // false = don't listen to user-generated scrolls
            ***REMOVED***
                else {
                    return new ElementScrollGeomCache(el, false); // false = don't listen to user-generated scrolls
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***;
        AutoScroller.prototype.queryScrollEls = function () {
            var els = [];
            for (var _i = 0, _a = this.scrollQuery; _i < _a.length; _i++) {
                var query = _a[_i];
                if (typeof query === 'object') {
                    els.push(query);
            ***REMOVED***
                else {
                    els.push.apply(els, Array.prototype.slice.call(document.querySelectorAll(query)));
            ***REMOVED***
        ***REMOVED***
            return els;
    ***REMOVED***;
        return AutoScroller;
***REMOVED***());

    /*
    Monitors dragging on an element. Has a number of high-level features:
    - minimum distance required before dragging
    - minimum wait time ("delay") before dragging
    - a mirror element that follows the pointer
    */
    var FeaturefulElementDragging = /** @class */ (function (_super) {
        __extends(FeaturefulElementDragging, _super);
        function FeaturefulElementDragging(containerEl) {
            var _this = _super.call(this, containerEl) || this;
    ***REMOVED*** options that can be directly set by caller
    ***REMOVED*** the caller can also set the PointerDragging's options as well
            _this.delay = null;
            _this.minDistance = 0;
            _this.touchScrollAllowed = true; // prevents drag from starting and blocks scrolling during drag
            _this.mirrorNeedsRevert = false;
            _this.isInteracting = false; // is the user validly moving the pointer? lasts until pointerup
            _this.isDragging = false; // is it INTENTFULLY dragging? lasts until after revert animation
            _this.isDelayEnded = false;
            _this.isDistanceSurpassed = false;
            _this.delayTimeoutId = null;
            _this.onPointerDown = function (ev) {
                if (!_this.isDragging) { // so new drag doesn't happen while revert animation is going
                    _this.isInteracting = true;
                    _this.isDelayEnded = false;
                    _this.isDistanceSurpassed = false;
                    core.preventSelection(document.body);
                    core.preventContextMenu(document.body);
            ***REMOVED*** prevent links from being visited if there's an eventual drag.
            ***REMOVED*** also prevents selection in older browsers (maybe?).
            ***REMOVED*** not necessary for touch, besides, browser would complain about passiveness.
                    if (!ev.isTouch) {
                        ev.origEvent.preventDefault();
                ***REMOVED***
                    _this.emitter.trigger('pointerdown', ev);
                    if (!_this.pointer.shouldIgnoreMove) {
                ***REMOVED*** actions related to initiating dragstart+dragmove+dragend...
                        _this.mirror.setIsVisible(false); // reset. caller must set-visible
                        _this.mirror.start(ev.subjectEl, ev.pageX, ev.pageY); // must happen on first pointer down
                        _this.startDelay(ev);
                        if (!_this.minDistance) {
                            _this.handleDistanceSurpassed(ev);
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***;
            _this.onPointerMove = function (ev) {
                if (_this.isInteracting) { // if false, still waiting for previous drag's revert
                    _this.emitter.trigger('pointermove', ev);
                    if (!_this.isDistanceSurpassed) {
                        var minDistance = _this.minDistance;
                        var distanceSq = void 0; // current distance from the origin, squared
                        var deltaX = ev.deltaX, deltaY = ev.deltaY;
                        distanceSq = deltaX * deltaX + deltaY * deltaY;
                        if (distanceSq >= minDistance * minDistance) { // use pythagorean theorem
                            _this.handleDistanceSurpassed(ev);
                    ***REMOVED***
                ***REMOVED***
                    if (_this.isDragging) {
                ***REMOVED*** a real pointer move? (not one simulated by scrolling)
                        if (ev.origEvent.type !== 'scroll') {
                            _this.mirror.handleMove(ev.pageX, ev.pageY);
                            _this.autoScroller.handleMove(ev.pageX, ev.pageY);
                    ***REMOVED***
                        _this.emitter.trigger('dragmove', ev);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***;
            _this.onPointerUp = function (ev) {
                if (_this.isInteracting) { // if false, still waiting for previous drag's revert
                    _this.isInteracting = false;
                    core.allowSelection(document.body);
                    core.allowContextMenu(document.body);
                    _this.emitter.trigger('pointerup', ev); // can potentially set mirrorNeedsRevert
                    if (_this.isDragging) {
                        _this.autoScroller.stop();
                        _this.tryStopDrag(ev); // which will stop the mirror
                ***REMOVED***
                    if (_this.delayTimeoutId) {
                        clearTimeout(_this.delayTimeoutId);
                        _this.delayTimeoutId = null;
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***;
            var pointer = _this.pointer = new PointerDragging(containerEl);
            pointer.emitter.on('pointerdown', _this.onPointerDown);
            pointer.emitter.on('pointermove', _this.onPointerMove);
            pointer.emitter.on('pointerup', _this.onPointerUp);
            _this.mirror = new ElementMirror();
            _this.autoScroller = new AutoScroller();
            return _this;
    ***REMOVED***
        FeaturefulElementDragging.prototype.destroy = function () {
            this.pointer.destroy();
    ***REMOVED***;
        FeaturefulElementDragging.prototype.startDelay = function (ev) {
            var _this = this;
            if (typeof this.delay === 'number') {
                this.delayTimeoutId = setTimeout(function () {
                    _this.delayTimeoutId = null;
                    _this.handleDelayEnd(ev);
            ***REMOVED***, this.delay); // not assignable to number!
        ***REMOVED***
            else {
                this.handleDelayEnd(ev);
        ***REMOVED***
    ***REMOVED***;
        FeaturefulElementDragging.prototype.handleDelayEnd = function (ev) {
            this.isDelayEnded = true;
            this.tryStartDrag(ev);
    ***REMOVED***;
        FeaturefulElementDragging.prototype.handleDistanceSurpassed = function (ev) {
            this.isDistanceSurpassed = true;
            this.tryStartDrag(ev);
    ***REMOVED***;
        FeaturefulElementDragging.prototype.tryStartDrag = function (ev) {
            if (this.isDelayEnded && this.isDistanceSurpassed) {
                if (!this.pointer.wasTouchScroll || this.touchScrollAllowed) {
                    this.isDragging = true;
                    this.mirrorNeedsRevert = false;
                    this.autoScroller.start(ev.pageX, ev.pageY);
                    this.emitter.trigger('dragstart', ev);
                    if (this.touchScrollAllowed === false) {
                        this.pointer.cancelTouchScroll();
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;
        FeaturefulElementDragging.prototype.tryStopDrag = function (ev) {
    ***REMOVED*** .stop() is ALWAYS asynchronous, which we NEED because we want all pointerup events
    ***REMOVED*** that come from the document to fire beforehand. much more convenient this way.
            this.mirror.stop(this.mirrorNeedsRevert, this.stopDrag.bind(this, ev) // bound with args
            );
    ***REMOVED***;
        FeaturefulElementDragging.prototype.stopDrag = function (ev) {
            this.isDragging = false;
            this.emitter.trigger('dragend', ev);
    ***REMOVED***;
***REMOVED*** fill in the implementations...
        FeaturefulElementDragging.prototype.setIgnoreMove = function (bool) {
            this.pointer.shouldIgnoreMove = bool;
    ***REMOVED***;
        FeaturefulElementDragging.prototype.setMirrorIsVisible = function (bool) {
            this.mirror.setIsVisible(bool);
    ***REMOVED***;
        FeaturefulElementDragging.prototype.setMirrorNeedsRevert = function (bool) {
            this.mirrorNeedsRevert = bool;
    ***REMOVED***;
        FeaturefulElementDragging.prototype.setAutoScrollEnabled = function (bool) {
            this.autoScroller.isEnabled = bool;
    ***REMOVED***;
        return FeaturefulElementDragging;
***REMOVED***(core.ElementDragging));

    /*
    When this class is instantiated, it records the offset of an element (relative to the document topleft),
    and continues to monitor scrolling, updating the cached coordinates if it needs to.
    Does not access the DOM after instantiation, so highly performant.

    Also keeps track of all scrolling/overflow:hidden containers that are parents of the given element
    and an determine if a given point is inside the combined clipping rectangle.
    */
    var OffsetTracker = /** @class */ (function () {
        function OffsetTracker(el) {
            this.origRect = core.computeRect(el);
    ***REMOVED*** will work fine for divs that have overflow:hidden
            this.scrollCaches = core.getClippingParents(el).map(function (el) {
                return new ElementScrollGeomCache(el, true); // listen=true
        ***REMOVED***);
    ***REMOVED***
        OffsetTracker.prototype.destroy = function () {
            for (var _i = 0, _a = this.scrollCaches; _i < _a.length; _i++) {
                var scrollCache = _a[_i];
                scrollCache.destroy();
        ***REMOVED***
    ***REMOVED***;
        OffsetTracker.prototype.computeLeft = function () {
            var left = this.origRect.left;
            for (var _i = 0, _a = this.scrollCaches; _i < _a.length; _i++) {
                var scrollCache = _a[_i];
                left += scrollCache.origScrollLeft - scrollCache.getScrollLeft();
        ***REMOVED***
            return left;
    ***REMOVED***;
        OffsetTracker.prototype.computeTop = function () {
            var top = this.origRect.top;
            for (var _i = 0, _a = this.scrollCaches; _i < _a.length; _i++) {
                var scrollCache = _a[_i];
                top += scrollCache.origScrollTop - scrollCache.getScrollTop();
        ***REMOVED***
            return top;
    ***REMOVED***;
        OffsetTracker.prototype.isWithinClipping = function (pageX, pageY) {
            var point = { left: pageX, top: pageY ***REMOVED***;
            for (var _i = 0, _a = this.scrollCaches; _i < _a.length; _i++) {
                var scrollCache = _a[_i];
                if (!isIgnoredClipping(scrollCache.getEventTarget()) &&
                    !core.pointInsideRect(point, scrollCache.clientRect)) {
                    return false;
            ***REMOVED***
        ***REMOVED***
            return true;
    ***REMOVED***;
        return OffsetTracker;
***REMOVED***());
    // certain clipping containers should never constrain interactions, like <html> and <body>
    // https://github.com/fullcalendar/fullcalendar/issues/3615
    function isIgnoredClipping(node) {
        var tagName = node.tagName;
        return tagName === 'HTML' || tagName === 'BODY';
***REMOVED***

    /*
    Tracks movement over multiple droppable areas (aka "hits")
    that exist in one or more DateComponents.
    Relies on an existing draggable.

    emits:
    - pointerdown
    - dragstart
    - hitchange - fires initially, even if not over a hit
    - pointerup
    - (hitchange - again, to null, if ended over a hit)
    - dragend
    */
    var HitDragging = /** @class */ (function () {
        function HitDragging(dragging, droppableStore) {
            var _this = this;
    ***REMOVED*** options that can be set by caller
            this.useSubjectCenter = false;
            this.requireInitial = true; // if doesn't start out on a hit, won't emit any events
            this.initialHit = null;
            this.movingHit = null;
            this.finalHit = null; // won't ever be populated if shouldIgnoreMove
            this.handlePointerDown = function (ev) {
                var dragging = _this.dragging;
                _this.initialHit = null;
                _this.movingHit = null;
                _this.finalHit = null;
                _this.prepareHits();
                _this.processFirstCoord(ev);
                if (_this.initialHit || !_this.requireInitial) {
                    dragging.setIgnoreMove(false);
                    _this.emitter.trigger('pointerdown', ev); // TODO: fire this before computing processFirstCoord, so listeners can cancel. this gets fired by almost every handler :(
            ***REMOVED***
                else {
                    dragging.setIgnoreMove(true);
            ***REMOVED***
        ***REMOVED***;
            this.handleDragStart = function (ev) {
                _this.emitter.trigger('dragstart', ev);
                _this.handleMove(ev, true); // force = fire even if initially null
        ***REMOVED***;
            this.handleDragMove = function (ev) {
                _this.emitter.trigger('dragmove', ev);
                _this.handleMove(ev);
        ***REMOVED***;
            this.handlePointerUp = function (ev) {
                _this.releaseHits();
                _this.emitter.trigger('pointerup', ev);
        ***REMOVED***;
            this.handleDragEnd = function (ev) {
                if (_this.movingHit) {
                    _this.emitter.trigger('hitupdate', null, true, ev);
            ***REMOVED***
                _this.finalHit = _this.movingHit;
                _this.movingHit = null;
                _this.emitter.trigger('dragend', ev);
        ***REMOVED***;
            this.droppableStore = droppableStore;
            dragging.emitter.on('pointerdown', this.handlePointerDown);
            dragging.emitter.on('dragstart', this.handleDragStart);
            dragging.emitter.on('dragmove', this.handleDragMove);
            dragging.emitter.on('pointerup', this.handlePointerUp);
            dragging.emitter.on('dragend', this.handleDragEnd);
            this.dragging = dragging;
            this.emitter = new core.EmitterMixin();
    ***REMOVED***
***REMOVED*** sets initialHit
***REMOVED*** sets coordAdjust
        HitDragging.prototype.processFirstCoord = function (ev) {
            var origPoint = { left: ev.pageX, top: ev.pageY ***REMOVED***;
            var adjustedPoint = origPoint;
            var subjectEl = ev.subjectEl;
            var subjectRect;
            if (subjectEl !== document) {
                subjectRect = core.computeRect(subjectEl);
                adjustedPoint = core.constrainPoint(adjustedPoint, subjectRect);
        ***REMOVED***
            var initialHit = this.initialHit = this.queryHitForOffset(adjustedPoint.left, adjustedPoint.top);
            if (initialHit) {
                if (this.useSubjectCenter && subjectRect) {
                    var slicedSubjectRect = core.intersectRects(subjectRect, initialHit.rect);
                    if (slicedSubjectRect) {
                        adjustedPoint = core.getRectCenter(slicedSubjectRect);
                ***REMOVED***
            ***REMOVED***
                this.coordAdjust = core.diffPoints(adjustedPoint, origPoint);
        ***REMOVED***
            else {
                this.coordAdjust = { left: 0, top: 0 ***REMOVED***;
        ***REMOVED***
    ***REMOVED***;
        HitDragging.prototype.handleMove = function (ev, forceHandle) {
            var hit = this.queryHitForOffset(ev.pageX + this.coordAdjust.left, ev.pageY + this.coordAdjust.top);
            if (forceHandle || !isHitsEqual(this.movingHit, hit)) {
                this.movingHit = hit;
                this.emitter.trigger('hitupdate', hit, false, ev);
        ***REMOVED***
    ***REMOVED***;
        HitDragging.prototype.prepareHits = function () {
            this.offsetTrackers = core.mapHash(this.droppableStore, function (interactionSettings) {
                interactionSettings.component.buildPositionCaches();
                return new OffsetTracker(interactionSettings.el);
        ***REMOVED***);
    ***REMOVED***;
        HitDragging.prototype.releaseHits = function () {
            var offsetTrackers = this.offsetTrackers;
            for (var id in offsetTrackers) {
                offsetTrackers[id].destroy();
        ***REMOVED***
            this.offsetTrackers = {***REMOVED***;
    ***REMOVED***;
        HitDragging.prototype.queryHitForOffset = function (offsetLeft, offsetTop) {
            var _a = this, droppableStore = _a.droppableStore, offsetTrackers = _a.offsetTrackers;
            var bestHit = null;
            for (var id in droppableStore) {
                var component = droppableStore[id].component;
                var offsetTracker = offsetTrackers[id];
                if (offsetTracker.isWithinClipping(offsetLeft, offsetTop)) {
                    var originLeft = offsetTracker.computeLeft();
                    var originTop = offsetTracker.computeTop();
                    var positionLeft = offsetLeft - originLeft;
                    var positionTop = offsetTop - originTop;
                    var origRect = offsetTracker.origRect;
                    var width = origRect.right - origRect.left;
                    var height = origRect.bottom - origRect.top;
                    if (
            ***REMOVED*** must be within the element's bounds
                    positionLeft >= 0 && positionLeft < width &&
                        positionTop >= 0 && positionTop < height) {
                        var hit = component.queryHit(positionLeft, positionTop, width, height);
                        if (hit &&
                            (
                    ***REMOVED*** make sure the hit is within activeRange, meaning it's not a deal cell
                            !component.props.dateProfile || // hack for DayTile
                                core.rangeContainsRange(component.props.dateProfile.activeRange, hit.dateSpan.range)) &&
                            (!bestHit || hit.layer > bestHit.layer)) {
                    ***REMOVED*** TODO: better way to re-orient rectangle
                            hit.rect.left += originLeft;
                            hit.rect.right += originLeft;
                            hit.rect.top += originTop;
                            hit.rect.bottom += originTop;
                            bestHit = hit;
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
            return bestHit;
    ***REMOVED***;
        return HitDragging;
***REMOVED***());
    function isHitsEqual(hit0, hit1) {
        if (!hit0 && !hit1) {
            return true;
    ***REMOVED***
        if (Boolean(hit0) !== Boolean(hit1)) {
            return false;
    ***REMOVED***
        return core.isDateSpansEqual(hit0.dateSpan, hit1.dateSpan);
***REMOVED***

    /*
    Monitors when the user clicks on a specific date/time of a component.
    A pointerdown+pointerup on the same "hit" constitutes a click.
    */
    var DateClicking = /** @class */ (function (_super) {
        __extends(DateClicking, _super);
        function DateClicking(settings) {
            var _this = _super.call(this, settings) || this;
            _this.handlePointerDown = function (ev) {
                var dragging = _this.dragging;
        ***REMOVED*** do this in pointerdown (not dragend) because DOM might be mutated by the time dragend is fired
                dragging.setIgnoreMove(!_this.component.isValidDateDownEl(dragging.pointer.downEl));
        ***REMOVED***;
    ***REMOVED*** won't even fire if moving was ignored
            _this.handleDragEnd = function (ev) {
                var component = _this.component;
                var pointer = _this.dragging.pointer;
                if (!pointer.wasTouchScroll) {
                    var _a = _this.hitDragging, initialHit = _a.initialHit, finalHit = _a.finalHit;
                    if (initialHit && finalHit && isHitsEqual(initialHit, finalHit)) {
                        component.calendar.triggerDateClick(initialHit.dateSpan, initialHit.dayEl, component.view, ev.origEvent);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***;
            var component = settings.component;
    ***REMOVED*** we DO want to watch pointer moves because otherwise finalHit won't get populated
            _this.dragging = new FeaturefulElementDragging(component.el);
            _this.dragging.autoScroller.isEnabled = false;
            var hitDragging = _this.hitDragging = new HitDragging(_this.dragging, core.interactionSettingsToStore(settings));
            hitDragging.emitter.on('pointerdown', _this.handlePointerDown);
            hitDragging.emitter.on('dragend', _this.handleDragEnd);
            return _this;
    ***REMOVED***
        DateClicking.prototype.destroy = function () {
            this.dragging.destroy();
    ***REMOVED***;
        return DateClicking;
***REMOVED***(core.Interaction));

    /*
    Tracks when the user selects a portion of time of a component,
    constituted by a drag over date cells, with a possible delay at the beginning of the drag.
    */
    var DateSelecting = /** @class */ (function (_super) {
        __extends(DateSelecting, _super);
        function DateSelecting(settings) {
            var _this = _super.call(this, settings) || this;
            _this.dragSelection = null;
            _this.handlePointerDown = function (ev) {
                var _a = _this, component = _a.component, dragging = _a.dragging;
                var canSelect = component.opt('selectable') &&
                    component.isValidDateDownEl(ev.origEvent.target);
        ***REMOVED*** don't bother to watch expensive moves if component won't do selection
                dragging.setIgnoreMove(!canSelect);
        ***REMOVED*** if touch, require user to hold down
                dragging.delay = ev.isTouch ? getComponentTouchDelay(component) : null;
        ***REMOVED***;
            _this.handleDragStart = function (ev) {
                _this.component.calendar.unselect(ev); // unselect previous selections
        ***REMOVED***;
            _this.handleHitUpdate = function (hit, isFinal) {
                var calendar = _this.component.calendar;
                var dragSelection = null;
                var isInvalid = false;
                if (hit) {
                    dragSelection = joinHitsIntoSelection(_this.hitDragging.initialHit, hit, calendar.pluginSystem.hooks.dateSelectionTransformers);
                    if (!dragSelection || !_this.component.isDateSelectionValid(dragSelection)) {
                        isInvalid = true;
                        dragSelection = null;
                ***REMOVED***
            ***REMOVED***
                if (dragSelection) {
                    calendar.dispatch({ type: 'SELECT_DATES', selection: dragSelection ***REMOVED***);
            ***REMOVED***
                else if (!isFinal) { // only unselect if moved away while dragging
                    calendar.dispatch({ type: 'UNSELECT_DATES' ***REMOVED***);
            ***REMOVED***
                if (!isInvalid) {
                    core.enableCursor();
            ***REMOVED***
                else {
                    core.disableCursor();
            ***REMOVED***
                if (!isFinal) {
                    _this.dragSelection = dragSelection; // only clear if moved away from all hits while dragging
            ***REMOVED***
        ***REMOVED***;
            _this.handlePointerUp = function (pev) {
                if (_this.dragSelection) {
            ***REMOVED*** selection is already rendered, so just need to report selection
                    _this.component.calendar.triggerDateSelect(_this.dragSelection, pev);
                    _this.dragSelection = null;
            ***REMOVED***
        ***REMOVED***;
            var component = settings.component;
            var dragging = _this.dragging = new FeaturefulElementDragging(component.el);
            dragging.touchScrollAllowed = false;
            dragging.minDistance = component.opt('selectMinDistance') || 0;
            dragging.autoScroller.isEnabled = component.opt('dragScroll');
            var hitDragging = _this.hitDragging = new HitDragging(_this.dragging, core.interactionSettingsToStore(settings));
            hitDragging.emitter.on('pointerdown', _this.handlePointerDown);
            hitDragging.emitter.on('dragstart', _this.handleDragStart);
            hitDragging.emitter.on('hitupdate', _this.handleHitUpdate);
            hitDragging.emitter.on('pointerup', _this.handlePointerUp);
            return _this;
    ***REMOVED***
        DateSelecting.prototype.destroy = function () {
            this.dragging.destroy();
    ***REMOVED***;
        return DateSelecting;
***REMOVED***(core.Interaction));
    function getComponentTouchDelay(component) {
        var delay = component.opt('selectLongPressDelay');
        if (delay == null) {
            delay = component.opt('longPressDelay');
    ***REMOVED***
        return delay;
***REMOVED***
    function joinHitsIntoSelection(hit0, hit1, dateSelectionTransformers) {
        var dateSpan0 = hit0.dateSpan;
        var dateSpan1 = hit1.dateSpan;
        var ms = [
            dateSpan0.range.start,
            dateSpan0.range.end,
            dateSpan1.range.start,
            dateSpan1.range.end
        ];
        ms.sort(core.compareNumbers);
        var props = {***REMOVED***;
        for (var _i = 0, dateSelectionTransformers_1 = dateSelectionTransformers; _i < dateSelectionTransformers_1.length; _i++) {
            var transformer = dateSelectionTransformers_1[_i];
            var res = transformer(hit0, hit1);
            if (res === false) {
                return null;
        ***REMOVED***
            else if (res) {
                __assign(props, res);
        ***REMOVED***
    ***REMOVED***
        props.range = { start: ms[0], end: ms[3] ***REMOVED***;
        props.allDay = dateSpan0.allDay;
        return props;
***REMOVED***

    var EventDragging = /** @class */ (function (_super) {
        __extends(EventDragging, _super);
        function EventDragging(settings) {
            var _this = _super.call(this, settings) || this;
    ***REMOVED*** internal state
            _this.subjectSeg = null; // the seg being selected/dragged
            _this.isDragging = false;
            _this.eventRange = null;
            _this.relevantEvents = null; // the events being dragged
            _this.receivingCalendar = null;
            _this.validMutation = null;
            _this.mutatedRelevantEvents = null;
            _this.handlePointerDown = function (ev) {
                var origTarget = ev.origEvent.target;
                var _a = _this, component = _a.component, dragging = _a.dragging;
                var mirror = dragging.mirror;
                var initialCalendar = component.calendar;
                var subjectSeg = _this.subjectSeg = core.getElSeg(ev.subjectEl);
                var eventRange = _this.eventRange = subjectSeg.eventRange;
                var eventInstanceId = eventRange.instance.instanceId;
                _this.relevantEvents = core.getRelevantEvents(initialCalendar.state.eventStore, eventInstanceId);
                dragging.minDistance = ev.isTouch ? 0 : component.opt('eventDragMinDistance');
                dragging.delay =
            ***REMOVED*** only do a touch delay if touch and this event hasn't been selected yet
                    (ev.isTouch && eventInstanceId !== component.props.eventSelection) ?
                        getComponentTouchDelay$1(component) :
                        null;
                mirror.parentNode = initialCalendar.el;
                mirror.revertDuration = component.opt('dragRevertDuration');
                var isValid = component.isValidSegDownEl(origTarget) &&
                    !core.elementClosest(origTarget, '.fc-resizer'); // NOT on a resizer
                dragging.setIgnoreMove(!isValid);
        ***REMOVED*** disable dragging for elements that are resizable (ie, selectable)
        ***REMOVED*** but are not draggable
                _this.isDragging = isValid &&
                    ev.subjectEl.classList.contains('fc-draggable');
        ***REMOVED***;
            _this.handleDragStart = function (ev) {
                var initialCalendar = _this.component.calendar;
                var eventRange = _this.eventRange;
                var eventInstanceId = eventRange.instance.instanceId;
                if (ev.isTouch) {
            ***REMOVED*** need to select a different event?
                    if (eventInstanceId !== _this.component.props.eventSelection) {
                        initialCalendar.dispatch({ type: 'SELECT_EVENT', eventInstanceId: eventInstanceId ***REMOVED***);
                ***REMOVED***
            ***REMOVED***
                else {
            ***REMOVED*** if now using mouse, but was previous touch interaction, clear selected event
                    initialCalendar.dispatch({ type: 'UNSELECT_EVENT' ***REMOVED***);
            ***REMOVED***
                if (_this.isDragging) {
                    initialCalendar.unselect(ev); // unselect *date* selection
                    initialCalendar.publiclyTrigger('eventDragStart', [
                        {
                            el: _this.subjectSeg.el,
                            event: new core.EventApi(initialCalendar, eventRange.def, eventRange.instance),
                            jsEvent: ev.origEvent,
                            view: _this.component.view
                    ***REMOVED***
                    ]);
            ***REMOVED***
        ***REMOVED***;
            _this.handleHitUpdate = function (hit, isFinal) {
                if (!_this.isDragging) {
                    return;
            ***REMOVED***
                var relevantEvents = _this.relevantEvents;
                var initialHit = _this.hitDragging.initialHit;
                var initialCalendar = _this.component.calendar;
        ***REMOVED*** states based on new hit
                var receivingCalendar = null;
                var mutation = null;
                var mutatedRelevantEvents = null;
                var isInvalid = false;
                var interaction = {
                    affectedEvents: relevantEvents,
                    mutatedEvents: core.createEmptyEventStore(),
                    isEvent: true,
                    origSeg: _this.subjectSeg
            ***REMOVED***;
                if (hit) {
                    var receivingComponent = hit.component;
                    receivingCalendar = receivingComponent.calendar;
                    if (initialCalendar === receivingCalendar ||
                        receivingComponent.opt('editable') && receivingComponent.opt('droppable')) {
                        mutation = computeEventMutation(initialHit, hit, receivingCalendar.pluginSystem.hooks.eventDragMutationMassagers);
                        if (mutation) {
                            mutatedRelevantEvents = core.applyMutationToEventStore(relevantEvents, receivingCalendar.eventUiBases, mutation, receivingCalendar);
                            interaction.mutatedEvents = mutatedRelevantEvents;
                            if (!receivingComponent.isInteractionValid(interaction)) {
                                isInvalid = true;
                                mutation = null;
                                mutatedRelevantEvents = null;
                                interaction.mutatedEvents = core.createEmptyEventStore();
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED***
                    else {
                        receivingCalendar = null;
                ***REMOVED***
            ***REMOVED***
                _this.displayDrag(receivingCalendar, interaction);
                if (!isInvalid) {
                    core.enableCursor();
            ***REMOVED***
                else {
                    core.disableCursor();
            ***REMOVED***
                if (!isFinal) {
                    if (initialCalendar === receivingCalendar && // TODO: write test for this
                        isHitsEqual(initialHit, hit)) {
                        mutation = null;
                ***REMOVED***
                    _this.dragging.setMirrorNeedsRevert(!mutation);
            ***REMOVED*** render the mirror if no already-rendered mirror
            ***REMOVED*** TODO: wish we could somehow wait for dispatch to guarantee render
                    _this.dragging.setMirrorIsVisible(!hit || !document.querySelector('.fc-mirror'));
            ***REMOVED*** assign states based on new hit
                    _this.receivingCalendar = receivingCalendar;
                    _this.validMutation = mutation;
                    _this.mutatedRelevantEvents = mutatedRelevantEvents;
            ***REMOVED***
        ***REMOVED***;
            _this.handlePointerUp = function () {
                if (!_this.isDragging) {
                    _this.cleanup(); // because handleDragEnd won't fire
            ***REMOVED***
        ***REMOVED***;
            _this.handleDragEnd = function (ev) {
                if (_this.isDragging) {
                    var initialCalendar_1 = _this.component.calendar;
                    var initialView = _this.component.view;
                    var _a = _this, receivingCalendar = _a.receivingCalendar, validMutation = _a.validMutation;
                    var eventDef = _this.eventRange.def;
                    var eventInstance = _this.eventRange.instance;
                    var eventApi = new core.EventApi(initialCalendar_1, eventDef, eventInstance);
                    var relevantEvents_1 = _this.relevantEvents;
                    var mutatedRelevantEvents = _this.mutatedRelevantEvents;
                    var finalHit = _this.hitDragging.finalHit;
                    _this.clearDrag(); // must happen after revert animation
                    initialCalendar_1.publiclyTrigger('eventDragStop', [
                        {
                            el: _this.subjectSeg.el,
                            event: eventApi,
                            jsEvent: ev.origEvent,
                            view: initialView
                    ***REMOVED***
                    ]);
                    if (validMutation) {
                ***REMOVED*** dropped within same calendar
                        if (receivingCalendar === initialCalendar_1) {
                            initialCalendar_1.dispatch({
                                type: 'MERGE_EVENTS',
                                eventStore: mutatedRelevantEvents
                        ***REMOVED***);
                            var transformed = {***REMOVED***;
                            for (var _i = 0, _b = initialCalendar_1.pluginSystem.hooks.eventDropTransformers; _i < _b.length; _i++) {
                                var transformer = _b[_i];
                                __assign(transformed, transformer(validMutation, initialCalendar_1));
                        ***REMOVED***
                            var eventDropArg = __assign({***REMOVED***, transformed, { el: ev.subjectEl, delta: validMutation.datesDelta, oldEvent: eventApi, event: new core.EventApi(// the data AFTER the mutation
                                initialCalendar_1, mutatedRelevantEvents.defs[eventDef.defId], eventInstance ? mutatedRelevantEvents.instances[eventInstance.instanceId] : null), revert: function () {
                                    initialCalendar_1.dispatch({
                                        type: 'MERGE_EVENTS',
                                        eventStore: relevantEvents_1
                                ***REMOVED***);
                            ***REMOVED***, jsEvent: ev.origEvent, view: initialView ***REMOVED***);
                            initialCalendar_1.publiclyTrigger('eventDrop', [eventDropArg]);
                    ***REMOVED*** dropped in different calendar
                    ***REMOVED***
                        else if (receivingCalendar) {
                            initialCalendar_1.publiclyTrigger('eventLeave', [
                                {
                                    draggedEl: ev.subjectEl,
                                    event: eventApi,
                                    view: initialView
                            ***REMOVED***
                            ]);
                            initialCalendar_1.dispatch({
                                type: 'REMOVE_EVENT_INSTANCES',
                                instances: _this.mutatedRelevantEvents.instances
                        ***REMOVED***);
                            receivingCalendar.dispatch({
                                type: 'MERGE_EVENTS',
                                eventStore: _this.mutatedRelevantEvents
                        ***REMOVED***);
                            if (ev.isTouch) {
                                receivingCalendar.dispatch({
                                    type: 'SELECT_EVENT',
                                    eventInstanceId: eventInstance.instanceId
                            ***REMOVED***);
                        ***REMOVED***
                            var dropArg = __assign({***REMOVED***, receivingCalendar.buildDatePointApi(finalHit.dateSpan), { draggedEl: ev.subjectEl, jsEvent: ev.origEvent, view: finalHit.component // should this be finalHit.component.view? See #4644
                         ***REMOVED***);
                            receivingCalendar.publiclyTrigger('drop', [dropArg]);
                            receivingCalendar.publiclyTrigger('eventReceive', [
                                {
                                    draggedEl: ev.subjectEl,
                                    event: new core.EventApi(// the data AFTER the mutation
                                    receivingCalendar, mutatedRelevantEvents.defs[eventDef.defId], mutatedRelevantEvents.instances[eventInstance.instanceId]),
                                    view: finalHit.component // should this be finalHit.component.view? See #4644
                            ***REMOVED***
                            ]);
                    ***REMOVED***
                ***REMOVED***
                    else {
                        initialCalendar_1.publiclyTrigger('_noEventDrop');
                ***REMOVED***
            ***REMOVED***
                _this.cleanup();
        ***REMOVED***;
            var component = _this.component;
            var dragging = _this.dragging = new FeaturefulElementDragging(component.el);
            dragging.pointer.selector = EventDragging.SELECTOR;
            dragging.touchScrollAllowed = false;
            dragging.autoScroller.isEnabled = component.opt('dragScroll');
            var hitDragging = _this.hitDragging = new HitDragging(_this.dragging, core.interactionSettingsStore);
            hitDragging.useSubjectCenter = settings.useEventCenter;
            hitDragging.emitter.on('pointerdown', _this.handlePointerDown);
            hitDragging.emitter.on('dragstart', _this.handleDragStart);
            hitDragging.emitter.on('hitupdate', _this.handleHitUpdate);
            hitDragging.emitter.on('pointerup', _this.handlePointerUp);
            hitDragging.emitter.on('dragend', _this.handleDragEnd);
            return _this;
    ***REMOVED***
        EventDragging.prototype.destroy = function () {
            this.dragging.destroy();
    ***REMOVED***;
***REMOVED*** render a drag state on the next receivingCalendar
        EventDragging.prototype.displayDrag = function (nextCalendar, state) {
            var initialCalendar = this.component.calendar;
            var prevCalendar = this.receivingCalendar;
    ***REMOVED*** does the previous calendar need to be cleared?
            if (prevCalendar && prevCalendar !== nextCalendar) {
        ***REMOVED*** does the initial calendar need to be cleared?
        ***REMOVED*** if so, don't clear all the way. we still need to to hide the affectedEvents
                if (prevCalendar === initialCalendar) {
                    prevCalendar.dispatch({
                        type: 'SET_EVENT_DRAG',
                        state: {
                            affectedEvents: state.affectedEvents,
                            mutatedEvents: core.createEmptyEventStore(),
                            isEvent: true,
                            origSeg: state.origSeg
                    ***REMOVED***
                ***REMOVED***);
            ***REMOVED*** completely clear the old calendar if it wasn't the initial
            ***REMOVED***
                else {
                    prevCalendar.dispatch({ type: 'UNSET_EVENT_DRAG' ***REMOVED***);
            ***REMOVED***
        ***REMOVED***
            if (nextCalendar) {
                nextCalendar.dispatch({ type: 'SET_EVENT_DRAG', state: state ***REMOVED***);
        ***REMOVED***
    ***REMOVED***;
        EventDragging.prototype.clearDrag = function () {
            var initialCalendar = this.component.calendar;
            var receivingCalendar = this.receivingCalendar;
            if (receivingCalendar) {
                receivingCalendar.dispatch({ type: 'UNSET_EVENT_DRAG' ***REMOVED***);
        ***REMOVED***
    ***REMOVED*** the initial calendar might have an dummy drag state from displayDrag
            if (initialCalendar !== receivingCalendar) {
                initialCalendar.dispatch({ type: 'UNSET_EVENT_DRAG' ***REMOVED***);
        ***REMOVED***
    ***REMOVED***;
        EventDragging.prototype.cleanup = function () {
            this.subjectSeg = null;
            this.isDragging = false;
            this.eventRange = null;
            this.relevantEvents = null;
            this.receivingCalendar = null;
            this.validMutation = null;
            this.mutatedRelevantEvents = null;
    ***REMOVED***;
        EventDragging.SELECTOR = '.fc-draggable, .fc-resizable'; // TODO: test this in IE11
        return EventDragging;
***REMOVED***(core.Interaction));
    function computeEventMutation(hit0, hit1, massagers) {
        var dateSpan0 = hit0.dateSpan;
        var dateSpan1 = hit1.dateSpan;
        var date0 = dateSpan0.range.start;
        var date1 = dateSpan1.range.start;
        var standardProps = {***REMOVED***;
        if (dateSpan0.allDay !== dateSpan1.allDay) {
            standardProps.allDay = dateSpan1.allDay;
            standardProps.hasEnd = hit1.component.opt('allDayMaintainDuration');
            if (dateSpan1.allDay) {
        ***REMOVED*** means date1 is already start-of-day,
        ***REMOVED*** but date0 needs to be converted
                date0 = core.startOfDay(date0);
        ***REMOVED***
    ***REMOVED***
        var delta = core.diffDates(date0, date1, hit0.component.dateEnv, hit0.component === hit1.component ?
            hit0.component.largeUnit :
            null);
        if (delta.milliseconds) { // has hours/minutes/seconds
            standardProps.allDay = false;
    ***REMOVED***
        var mutation = {
            datesDelta: delta,
            standardProps: standardProps
    ***REMOVED***;
        for (var _i = 0, massagers_1 = massagers; _i < massagers_1.length; _i++) {
            var massager = massagers_1[_i];
            massager(mutation, hit0, hit1);
    ***REMOVED***
        return mutation;
***REMOVED***
    function getComponentTouchDelay$1(component) {
        var delay = component.opt('eventLongPressDelay');
        if (delay == null) {
            delay = component.opt('longPressDelay');
    ***REMOVED***
        return delay;
***REMOVED***

    var EventDragging$1 = /** @class */ (function (_super) {
        __extends(EventDragging, _super);
        function EventDragging(settings) {
            var _this = _super.call(this, settings) || this;
    ***REMOVED*** internal state
            _this.draggingSeg = null; // TODO: rename to resizingSeg? subjectSeg?
            _this.eventRange = null;
            _this.relevantEvents = null;
            _this.validMutation = null;
            _this.mutatedRelevantEvents = null;
            _this.handlePointerDown = function (ev) {
                var component = _this.component;
                var seg = _this.querySeg(ev);
                var eventRange = _this.eventRange = seg.eventRange;
                _this.dragging.minDistance = component.opt('eventDragMinDistance');
        ***REMOVED*** if touch, need to be working with a selected event
                _this.dragging.setIgnoreMove(!_this.component.isValidSegDownEl(ev.origEvent.target) ||
                    (ev.isTouch && _this.component.props.eventSelection !== eventRange.instance.instanceId));
        ***REMOVED***;
            _this.handleDragStart = function (ev) {
                var calendar = _this.component.calendar;
                var eventRange = _this.eventRange;
                _this.relevantEvents = core.getRelevantEvents(calendar.state.eventStore, _this.eventRange.instance.instanceId);
                _this.draggingSeg = _this.querySeg(ev);
                calendar.unselect();
                calendar.publiclyTrigger('eventResizeStart', [
                    {
                        el: _this.draggingSeg.el,
                        event: new core.EventApi(calendar, eventRange.def, eventRange.instance),
                        jsEvent: ev.origEvent,
                        view: _this.component.view
                ***REMOVED***
                ]);
        ***REMOVED***;
            _this.handleHitUpdate = function (hit, isFinal, ev) {
                var calendar = _this.component.calendar;
                var relevantEvents = _this.relevantEvents;
                var initialHit = _this.hitDragging.initialHit;
                var eventInstance = _this.eventRange.instance;
                var mutation = null;
                var mutatedRelevantEvents = null;
                var isInvalid = false;
                var interaction = {
                    affectedEvents: relevantEvents,
                    mutatedEvents: core.createEmptyEventStore(),
                    isEvent: true,
                    origSeg: _this.draggingSeg
            ***REMOVED***;
                if (hit) {
                    mutation = computeMutation(initialHit, hit, ev.subjectEl.classList.contains('fc-start-resizer'), eventInstance.range, calendar.pluginSystem.hooks.eventResizeJoinTransforms);
            ***REMOVED***
                if (mutation) {
                    mutatedRelevantEvents = core.applyMutationToEventStore(relevantEvents, calendar.eventUiBases, mutation, calendar);
                    interaction.mutatedEvents = mutatedRelevantEvents;
                    if (!_this.component.isInteractionValid(interaction)) {
                        isInvalid = true;
                        mutation = null;
                        mutatedRelevantEvents = null;
                        interaction.mutatedEvents = null;
                ***REMOVED***
            ***REMOVED***
                if (mutatedRelevantEvents) {
                    calendar.dispatch({
                        type: 'SET_EVENT_RESIZE',
                        state: interaction
                ***REMOVED***);
            ***REMOVED***
                else {
                    calendar.dispatch({ type: 'UNSET_EVENT_RESIZE' ***REMOVED***);
            ***REMOVED***
                if (!isInvalid) {
                    core.enableCursor();
            ***REMOVED***
                else {
                    core.disableCursor();
            ***REMOVED***
                if (!isFinal) {
                    if (mutation && isHitsEqual(initialHit, hit)) {
                        mutation = null;
                ***REMOVED***
                    _this.validMutation = mutation;
                    _this.mutatedRelevantEvents = mutatedRelevantEvents;
            ***REMOVED***
        ***REMOVED***;
            _this.handleDragEnd = function (ev) {
                var calendar = _this.component.calendar;
                var view = _this.component.view;
                var eventDef = _this.eventRange.def;
                var eventInstance = _this.eventRange.instance;
                var eventApi = new core.EventApi(calendar, eventDef, eventInstance);
                var relevantEvents = _this.relevantEvents;
                var mutatedRelevantEvents = _this.mutatedRelevantEvents;
                calendar.publiclyTrigger('eventResizeStop', [
                    {
                        el: _this.draggingSeg.el,
                        event: eventApi,
                        jsEvent: ev.origEvent,
                        view: view
                ***REMOVED***
                ]);
                if (_this.validMutation) {
                    calendar.dispatch({
                        type: 'MERGE_EVENTS',
                        eventStore: mutatedRelevantEvents
                ***REMOVED***);
                    calendar.publiclyTrigger('eventResize', [
                        {
                            el: _this.draggingSeg.el,
                            startDelta: _this.validMutation.startDelta || core.createDuration(0),
                            endDelta: _this.validMutation.endDelta || core.createDuration(0),
                            prevEvent: eventApi,
                            event: new core.EventApi(// the data AFTER the mutation
                            calendar, mutatedRelevantEvents.defs[eventDef.defId], eventInstance ? mutatedRelevantEvents.instances[eventInstance.instanceId] : null),
                            revert: function () {
                                calendar.dispatch({
                                    type: 'MERGE_EVENTS',
                                    eventStore: relevantEvents
                            ***REMOVED***);
                        ***REMOVED***,
                            jsEvent: ev.origEvent,
                            view: view
                    ***REMOVED***
                    ]);
            ***REMOVED***
                else {
                    calendar.publiclyTrigger('_noEventResize');
            ***REMOVED***
        ***REMOVED*** reset all internal state
                _this.draggingSeg = null;
                _this.relevantEvents = null;
                _this.validMutation = null;
        ***REMOVED*** okay to keep eventInstance around. useful to set it in handlePointerDown
        ***REMOVED***;
            var component = settings.component;
            var dragging = _this.dragging = new FeaturefulElementDragging(component.el);
            dragging.pointer.selector = '.fc-resizer';
            dragging.touchScrollAllowed = false;
            dragging.autoScroller.isEnabled = component.opt('dragScroll');
            var hitDragging = _this.hitDragging = new HitDragging(_this.dragging, core.interactionSettingsToStore(settings));
            hitDragging.emitter.on('pointerdown', _this.handlePointerDown);
            hitDragging.emitter.on('dragstart', _this.handleDragStart);
            hitDragging.emitter.on('hitupdate', _this.handleHitUpdate);
            hitDragging.emitter.on('dragend', _this.handleDragEnd);
            return _this;
    ***REMOVED***
        EventDragging.prototype.destroy = function () {
            this.dragging.destroy();
    ***REMOVED***;
        EventDragging.prototype.querySeg = function (ev) {
            return core.getElSeg(core.elementClosest(ev.subjectEl, this.component.fgSegSelector));
    ***REMOVED***;
        return EventDragging;
***REMOVED***(core.Interaction));
    function computeMutation(hit0, hit1, isFromStart, instanceRange, transforms) {
        var dateEnv = hit0.component.dateEnv;
        var date0 = hit0.dateSpan.range.start;
        var date1 = hit1.dateSpan.range.start;
        var delta = core.diffDates(date0, date1, dateEnv, hit0.component.largeUnit);
        var props = {***REMOVED***;
        for (var _i = 0, transforms_1 = transforms; _i < transforms_1.length; _i++) {
            var transform = transforms_1[_i];
            var res = transform(hit0, hit1);
            if (res === false) {
                return null;
        ***REMOVED***
            else if (res) {
                __assign(props, res);
        ***REMOVED***
    ***REMOVED***
        if (isFromStart) {
            if (dateEnv.add(instanceRange.start, delta) < instanceRange.end) {
                props.startDelta = delta;
                return props;
        ***REMOVED***
    ***REMOVED***
        else {
            if (dateEnv.add(instanceRange.end, delta) > instanceRange.start) {
                props.endDelta = delta;
                return props;
        ***REMOVED***
    ***REMOVED***
        return null;
***REMOVED***

    var UnselectAuto = /** @class */ (function () {
        function UnselectAuto(calendar) {
            var _this = this;
            this.isRecentPointerDateSelect = false; // wish we could use a selector to detect date selection, but uses hit system
            this.onSelect = function (selectInfo) {
                if (selectInfo.jsEvent) {
                    _this.isRecentPointerDateSelect = true;
            ***REMOVED***
        ***REMOVED***;
            this.onDocumentPointerUp = function (pev) {
                var _a = _this, calendar = _a.calendar, documentPointer = _a.documentPointer;
                var state = calendar.state;
        ***REMOVED*** touch-scrolling should never unfocus any type of selection
                if (!documentPointer.wasTouchScroll) {
                    if (state.dateSelection && // an existing date selection?
                        !_this.isRecentPointerDateSelect // a new pointer-initiated date selection since last onDocumentPointerUp?
                    ) {
                        var unselectAuto = calendar.viewOpt('unselectAuto');
                        var unselectCancel = calendar.viewOpt('unselectCancel');
                        if (unselectAuto && (!unselectAuto || !core.elementClosest(documentPointer.downEl, unselectCancel))) {
                            calendar.unselect(pev);
                    ***REMOVED***
                ***REMOVED***
                    if (state.eventSelection && // an existing event selected?
                        !core.elementClosest(documentPointer.downEl, EventDragging.SELECTOR) // interaction DIDN'T start on an event
                    ) {
                        calendar.dispatch({ type: 'UNSELECT_EVENT' ***REMOVED***);
                ***REMOVED***
            ***REMOVED***
                _this.isRecentPointerDateSelect = false;
        ***REMOVED***;
            this.calendar = calendar;
            var documentPointer = this.documentPointer = new PointerDragging(document);
            documentPointer.shouldIgnoreMove = true;
            documentPointer.shouldWatchScroll = false;
            documentPointer.emitter.on('pointerup', this.onDocumentPointerUp);
            /*
            TODO: better way to know about whether there was a selection with the pointer
            */
            calendar.on('select', this.onSelect);
    ***REMOVED***
        UnselectAuto.prototype.destroy = function () {
            this.calendar.off('select', this.onSelect);
            this.documentPointer.destroy();
    ***REMOVED***;
        return UnselectAuto;
***REMOVED***());

    /*
    Given an already instantiated draggable object for one-or-more elements,
    Interprets any dragging as an attempt to drag an events that lives outside
    of a calendar onto a calendar.
    */
    var ExternalElementDragging = /** @class */ (function () {
        function ExternalElementDragging(dragging, suppliedDragMeta) {
            var _this = this;
            this.receivingCalendar = null;
            this.droppableEvent = null; // will exist for all drags, even if create:false
            this.suppliedDragMeta = null;
            this.dragMeta = null;
            this.handleDragStart = function (ev) {
                _this.dragMeta = _this.buildDragMeta(ev.subjectEl);
        ***REMOVED***;
            this.handleHitUpdate = function (hit, isFinal, ev) {
                var dragging = _this.hitDragging.dragging;
                var receivingCalendar = null;
                var droppableEvent = null;
                var isInvalid = false;
                var interaction = {
                    affectedEvents: core.createEmptyEventStore(),
                    mutatedEvents: core.createEmptyEventStore(),
                    isEvent: _this.dragMeta.create,
                    origSeg: null
            ***REMOVED***;
                if (hit) {
                    receivingCalendar = hit.component.calendar;
                    if (_this.canDropElOnCalendar(ev.subjectEl, receivingCalendar)) {
                        droppableEvent = computeEventForDateSpan(hit.dateSpan, _this.dragMeta, receivingCalendar);
                        interaction.mutatedEvents = core.eventTupleToStore(droppableEvent);
                        isInvalid = !core.isInteractionValid(interaction, receivingCalendar);
                        if (isInvalid) {
                            interaction.mutatedEvents = core.createEmptyEventStore();
                            droppableEvent = null;
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
                _this.displayDrag(receivingCalendar, interaction);
        ***REMOVED*** show mirror if no already-rendered mirror element OR if we are shutting down the mirror (?)
        ***REMOVED*** TODO: wish we could somehow wait for dispatch to guarantee render
                dragging.setMirrorIsVisible(isFinal || !droppableEvent || !document.querySelector('.fc-mirror'));
                if (!isInvalid) {
                    core.enableCursor();
            ***REMOVED***
                else {
                    core.disableCursor();
            ***REMOVED***
                if (!isFinal) {
                    dragging.setMirrorNeedsRevert(!droppableEvent);
                    _this.receivingCalendar = receivingCalendar;
                    _this.droppableEvent = droppableEvent;
            ***REMOVED***
        ***REMOVED***;
            this.handleDragEnd = function (pev) {
                var _a = _this, receivingCalendar = _a.receivingCalendar, droppableEvent = _a.droppableEvent;
                _this.clearDrag();
                if (receivingCalendar && droppableEvent) {
                    var finalHit = _this.hitDragging.finalHit;
                    var finalView = finalHit.component.view;
                    var dragMeta = _this.dragMeta;
                    var arg = __assign({***REMOVED***, receivingCalendar.buildDatePointApi(finalHit.dateSpan), { draggedEl: pev.subjectEl, jsEvent: pev.origEvent, view: finalView ***REMOVED***);
                    receivingCalendar.publiclyTrigger('drop', [arg]);
                    if (dragMeta.create) {
                        receivingCalendar.dispatch({
                            type: 'MERGE_EVENTS',
                            eventStore: core.eventTupleToStore(droppableEvent)
                    ***REMOVED***);
                        if (pev.isTouch) {
                            receivingCalendar.dispatch({
                                type: 'SELECT_EVENT',
                                eventInstanceId: droppableEvent.instance.instanceId
                        ***REMOVED***);
                    ***REMOVED***
                ***REMOVED*** signal that an external event landed
                        receivingCalendar.publiclyTrigger('eventReceive', [
                            {
                                draggedEl: pev.subjectEl,
                                event: new core.EventApi(receivingCalendar, droppableEvent.def, droppableEvent.instance),
                                view: finalView
                        ***REMOVED***
                        ]);
                ***REMOVED***
            ***REMOVED***
                _this.receivingCalendar = null;
                _this.droppableEvent = null;
        ***REMOVED***;
            var hitDragging = this.hitDragging = new HitDragging(dragging, core.interactionSettingsStore);
            hitDragging.requireInitial = false; // will start outside of a component
            hitDragging.emitter.on('dragstart', this.handleDragStart);
            hitDragging.emitter.on('hitupdate', this.handleHitUpdate);
            hitDragging.emitter.on('dragend', this.handleDragEnd);
            this.suppliedDragMeta = suppliedDragMeta;
    ***REMOVED***
        ExternalElementDragging.prototype.buildDragMeta = function (subjectEl) {
            if (typeof this.suppliedDragMeta === 'object') {
                return core.parseDragMeta(this.suppliedDragMeta);
        ***REMOVED***
            else if (typeof this.suppliedDragMeta === 'function') {
                return core.parseDragMeta(this.suppliedDragMeta(subjectEl));
        ***REMOVED***
            else {
                return getDragMetaFromEl(subjectEl);
        ***REMOVED***
    ***REMOVED***;
        ExternalElementDragging.prototype.displayDrag = function (nextCalendar, state) {
            var prevCalendar = this.receivingCalendar;
            if (prevCalendar && prevCalendar !== nextCalendar) {
                prevCalendar.dispatch({ type: 'UNSET_EVENT_DRAG' ***REMOVED***);
        ***REMOVED***
            if (nextCalendar) {
                nextCalendar.dispatch({ type: 'SET_EVENT_DRAG', state: state ***REMOVED***);
        ***REMOVED***
    ***REMOVED***;
        ExternalElementDragging.prototype.clearDrag = function () {
            if (this.receivingCalendar) {
                this.receivingCalendar.dispatch({ type: 'UNSET_EVENT_DRAG' ***REMOVED***);
        ***REMOVED***
    ***REMOVED***;
        ExternalElementDragging.prototype.canDropElOnCalendar = function (el, receivingCalendar) {
            var dropAccept = receivingCalendar.opt('dropAccept');
            if (typeof dropAccept === 'function') {
                return dropAccept(el);
        ***REMOVED***
            else if (typeof dropAccept === 'string' && dropAccept) {
                return Boolean(core.elementMatches(el, dropAccept));
        ***REMOVED***
            return true;
    ***REMOVED***;
        return ExternalElementDragging;
***REMOVED***());
    // Utils for computing event store from the DragMeta
    // ----------------------------------------------------------------------------------------------------
    function computeEventForDateSpan(dateSpan, dragMeta, calendar) {
        var defProps = __assign({***REMOVED***, dragMeta.leftoverProps);
        for (var _i = 0, _a = calendar.pluginSystem.hooks.externalDefTransforms; _i < _a.length; _i++) {
            var transform = _a[_i];
            __assign(defProps, transform(dateSpan, dragMeta));
    ***REMOVED***
        var def = core.parseEventDef(defProps, dragMeta.sourceId, dateSpan.allDay, calendar.opt('forceEventDuration') || Boolean(dragMeta.duration), // hasEnd
        calendar);
        var start = dateSpan.range.start;
***REMOVED*** only rely on time info if drop zone is all-day,
***REMOVED*** otherwise, we already know the time
        if (dateSpan.allDay && dragMeta.startTime) {
            start = calendar.dateEnv.add(start, dragMeta.startTime);
    ***REMOVED***
        var end = dragMeta.duration ?
            calendar.dateEnv.add(start, dragMeta.duration) :
            calendar.getDefaultEventEnd(dateSpan.allDay, start);
        var instance = core.createEventInstance(def.defId, { start: start, end: end ***REMOVED***);
        return { def: def, instance: instance ***REMOVED***;
***REMOVED***
    // Utils for extracting data from element
    // ----------------------------------------------------------------------------------------------------
    function getDragMetaFromEl(el) {
        var str = getEmbeddedElData(el, 'event');
        var obj = str ?
            JSON.parse(str) :
            { create: false ***REMOVED***; // if no embedded data, assume no event creation
        return core.parseDragMeta(obj);
***REMOVED***
    core.config.dataAttrPrefix = '';
    function getEmbeddedElData(el, name) {
        var prefix = core.config.dataAttrPrefix;
        var prefixedName = (prefix ? prefix + '-' : '') + name;
        return el.getAttribute('data-' + prefixedName) || '';
***REMOVED***

    /*
    Makes an element (that is *external* to any calendar) draggable.
    Can pass in data that determines how an event will be created when dropped onto a calendar.
    Leverages FullCalendar's internal drag-n-drop functionality WITHOUT a third-party drag system.
    */
    var ExternalDraggable = /** @class */ (function () {
        function ExternalDraggable(el, settings) {
            var _this = this;
            if (settings === void 0) { settings = {***REMOVED***; ***REMOVED***
            this.handlePointerDown = function (ev) {
                var dragging = _this.dragging;
                var _a = _this.settings, minDistance = _a.minDistance, longPressDelay = _a.longPressDelay;
                dragging.minDistance =
                    minDistance != null ?
                        minDistance :
                        (ev.isTouch ? 0 : core.globalDefaults.eventDragMinDistance);
                dragging.delay =
                    ev.isTouch ? // TODO: eventually read eventLongPressDelay instead vvv
                        (longPressDelay != null ? longPressDelay : core.globalDefaults.longPressDelay) :
                        0;
        ***REMOVED***;
            this.handleDragStart = function (ev) {
                if (ev.isTouch &&
                    _this.dragging.delay &&
                    ev.subjectEl.classList.contains('fc-event')) {
                    _this.dragging.mirror.getMirrorEl().classList.add('fc-selected');
            ***REMOVED***
        ***REMOVED***;
            this.settings = settings;
            var dragging = this.dragging = new FeaturefulElementDragging(el);
            dragging.touchScrollAllowed = false;
            if (settings.itemSelector != null) {
                dragging.pointer.selector = settings.itemSelector;
        ***REMOVED***
            if (settings.appendTo != null) {
                dragging.mirror.parentNode = settings.appendTo; // TODO: write tests
        ***REMOVED***
            dragging.emitter.on('pointerdown', this.handlePointerDown);
            dragging.emitter.on('dragstart', this.handleDragStart);
            new ExternalElementDragging(dragging, settings.eventData);
    ***REMOVED***
        ExternalDraggable.prototype.destroy = function () {
            this.dragging.destroy();
    ***REMOVED***;
        return ExternalDraggable;
***REMOVED***());

    /*
    Detects when a *THIRD-PARTY* drag-n-drop system interacts with elements.
    The third-party system is responsible for drawing the visuals effects of the drag.
    This class simply monitors for pointer movements and fires events.
    It also has the ability to hide the moving element (the "mirror") during the drag.
    */
    var InferredElementDragging = /** @class */ (function (_super) {
        __extends(InferredElementDragging, _super);
        function InferredElementDragging(containerEl) {
            var _this = _super.call(this, containerEl) || this;
            _this.shouldIgnoreMove = false;
            _this.mirrorSelector = '';
            _this.currentMirrorEl = null;
            _this.handlePointerDown = function (ev) {
                _this.emitter.trigger('pointerdown', ev);
                if (!_this.shouldIgnoreMove) {
            ***REMOVED*** fire dragstart right away. does not support delay or min-distance
                    _this.emitter.trigger('dragstart', ev);
            ***REMOVED***
        ***REMOVED***;
            _this.handlePointerMove = function (ev) {
                if (!_this.shouldIgnoreMove) {
                    _this.emitter.trigger('dragmove', ev);
            ***REMOVED***
        ***REMOVED***;
            _this.handlePointerUp = function (ev) {
                _this.emitter.trigger('pointerup', ev);
                if (!_this.shouldIgnoreMove) {
            ***REMOVED*** fire dragend right away. does not support a revert animation
                    _this.emitter.trigger('dragend', ev);
            ***REMOVED***
        ***REMOVED***;
            var pointer = _this.pointer = new PointerDragging(containerEl);
            pointer.emitter.on('pointerdown', _this.handlePointerDown);
            pointer.emitter.on('pointermove', _this.handlePointerMove);
            pointer.emitter.on('pointerup', _this.handlePointerUp);
            return _this;
    ***REMOVED***
        InferredElementDragging.prototype.destroy = function () {
            this.pointer.destroy();
    ***REMOVED***;
        InferredElementDragging.prototype.setIgnoreMove = function (bool) {
            this.shouldIgnoreMove = bool;
    ***REMOVED***;
        InferredElementDragging.prototype.setMirrorIsVisible = function (bool) {
            if (bool) {
        ***REMOVED*** restore a previously hidden element.
        ***REMOVED*** use the reference in case the selector class has already been removed.
                if (this.currentMirrorEl) {
                    this.currentMirrorEl.style.visibility = '';
                    this.currentMirrorEl = null;
            ***REMOVED***
        ***REMOVED***
            else {
                var mirrorEl = this.mirrorSelector ?
                    document.querySelector(this.mirrorSelector) :
                    null;
                if (mirrorEl) {
                    this.currentMirrorEl = mirrorEl;
                    mirrorEl.style.visibility = 'hidden';
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;
        return InferredElementDragging;
***REMOVED***(core.ElementDragging));

    /*
    Bridges third-party drag-n-drop systems with FullCalendar.
    Must be instantiated and destroyed by caller.
    */
    var ThirdPartyDraggable = /** @class */ (function () {
        function ThirdPartyDraggable(containerOrSettings, settings) {
            var containerEl = document;
            if (
    ***REMOVED*** wish we could just test instanceof EventTarget, but doesn't work in IE11
            containerOrSettings === document ||
                containerOrSettings instanceof Element) {
                containerEl = containerOrSettings;
                settings = settings || {***REMOVED***;
        ***REMOVED***
            else {
                settings = (containerOrSettings || {***REMOVED***);
        ***REMOVED***
            var dragging = this.dragging = new InferredElementDragging(containerEl);
            if (typeof settings.itemSelector === 'string') {
                dragging.pointer.selector = settings.itemSelector;
        ***REMOVED***
            else if (containerEl === document) {
                dragging.pointer.selector = '[data-event]';
        ***REMOVED***
            if (typeof settings.mirrorSelector === 'string') {
                dragging.mirrorSelector = settings.mirrorSelector;
        ***REMOVED***
            new ExternalElementDragging(dragging, settings.eventData);
    ***REMOVED***
        ThirdPartyDraggable.prototype.destroy = function () {
            this.dragging.destroy();
    ***REMOVED***;
        return ThirdPartyDraggable;
***REMOVED***());

    var main = core.createPlugin({
        componentInteractions: [DateClicking, DateSelecting, EventDragging, EventDragging$1],
        calendarInteractions: [UnselectAuto],
        elementDraggingImpl: FeaturefulElementDragging
***REMOVED***);

    exports.Draggable = ExternalDraggable;
    exports.FeaturefulElementDragging = FeaturefulElementDragging;
    exports.PointerDragging = PointerDragging;
    exports.ThirdPartyDraggable = ThirdPartyDraggable;
    exports.default = main;

    Object.defineProperty(exports, '__esModule', { value: true ***REMOVED***);

***REMOVED***));
