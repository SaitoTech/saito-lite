/*!
FullCalendar RRule Plugin v4.3.0
Docs & License: https://fullcalendar.io/
(c) 2019 Adam Shaw
*/

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rrule'), require('@fullcalendar/core')) :
    typeof define === 'function' && define.amd ? define(['exports', 'rrule', '@fullcalendar/core'], factory) :
    (global = global || self, factory(global.FullCalendarRrule = {***REMOVED***, global.rrule, global.FullCalendar));
***REMOVED***(this, function (exports, rrule, core) { 'use strict';

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

    var EVENT_DEF_PROPS = {
        rrule: null,
        duration: core.createDuration
***REMOVED***;
    var recurring = {
        parse: function (rawEvent, leftoverProps, dateEnv) {
            if (rawEvent.rrule != null) {
                var props = core.refineProps(rawEvent, EVENT_DEF_PROPS, {***REMOVED***, leftoverProps);
                var parsed = parseRRule(props.rrule, dateEnv);
                if (parsed) {
                    return {
                        typeData: parsed.rrule,
                        allDayGuess: parsed.allDayGuess,
                        duration: props.duration
                ***REMOVED***;
            ***REMOVED***
        ***REMOVED***
            return null;
    ***REMOVED***,
        expand: function (rrule, framingRange) {
    ***REMOVED*** we WANT an inclusive start and in exclusive end, but the js rrule lib will only do either BOTH
    ***REMOVED*** inclusive or BOTH exclusive, which is stupid: https://github.com/jakubroztocil/rrule/issues/84
    ***REMOVED*** Workaround: make inclusive, which will generate extra occurences, and then trim.
            return rrule.between(framingRange.start, framingRange.end, true)
                .filter(function (date) {
                return date.valueOf() < framingRange.end.valueOf();
        ***REMOVED***);
    ***REMOVED***
***REMOVED***;
    var main = core.createPlugin({
        recurringTypes: [recurring]
***REMOVED***);
    function parseRRule(input, dateEnv) {
        var allDayGuess = null;
        var rrule$1;
        if (typeof input === 'string') {
            rrule$1 = rrule.rrulestr(input);
    ***REMOVED***
        else if (typeof input === 'object' && input) { // non-null object
            var refined = __assign({***REMOVED***, input); // copy
            if (typeof refined.dtstart === 'string') {
                var dtstartMeta = dateEnv.createMarkerMeta(refined.dtstart);
                if (dtstartMeta) {
                    refined.dtstart = dtstartMeta.marker;
                    allDayGuess = dtstartMeta.isTimeUnspecified;
            ***REMOVED***
                else {
                    delete refined.dtstart;
            ***REMOVED***
        ***REMOVED***
            if (typeof refined.until === 'string') {
                refined.until = dateEnv.createMarker(refined.until);
        ***REMOVED***
            if (refined.freq != null) {
                refined.freq = convertConstant(refined.freq);
        ***REMOVED***
            if (refined.wkst != null) {
                refined.wkst = convertConstant(refined.wkst);
        ***REMOVED***
            else {
                refined.wkst = (dateEnv.weekDow - 1 + 7) % 7; // convert Sunday-first to Monday-first
        ***REMOVED***
            if (refined.byweekday != null) {
                refined.byweekday = convertConstants(refined.byweekday); // the plural version
        ***REMOVED***
            rrule$1 = new rrule.RRule(refined);
    ***REMOVED***
        if (rrule$1) {
            return { rrule: rrule$1, allDayGuess: allDayGuess ***REMOVED***;
    ***REMOVED***
        return null;
***REMOVED***
    function convertConstants(input) {
        if (Array.isArray(input)) {
            return input.map(convertConstant);
    ***REMOVED***
        return convertConstant(input);
***REMOVED***
    function convertConstant(input) {
        if (typeof input === 'string') {
            return rrule.RRule[input.toUpperCase()];
    ***REMOVED***
        return input;
***REMOVED***

    exports.default = main;

    Object.defineProperty(exports, '__esModule', { value: true ***REMOVED***);

***REMOVED***));
