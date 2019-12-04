(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {***REMOVED***, global.FullCalendarLocales.sr = factory()));
***REMOVED***(this, function () { 'use strict';

    var sr = {
        code: "sr",
        week: {
            dow: 1,
            doy: 7 // The week that contains Jan 1st is the first week of the year.
    ***REMOVED***,
        buttonText: {
            prev: "Prethodna",
            next: "Sledeći",
            today: "Danas",
            month: "Mеsеc",
            week: "Nеdеlja",
            day: "Dan",
            list: "Planеr"
    ***REMOVED***,
        weekLabel: "Sed",
        allDayText: "Cеo dan",
        eventLimitText: function (n) {
            return "+ još " + n;
    ***REMOVED***,
        noEventsMessage: "Nеma događaja za prikaz"
***REMOVED***;

    return sr;

***REMOVED***));
