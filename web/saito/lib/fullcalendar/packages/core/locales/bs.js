(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {***REMOVED***, global.FullCalendarLocales.bs = factory()));
***REMOVED***(this, function () { 'use strict';

    var bs = {
        code: "bs",
        week: {
            dow: 1,
            doy: 7 // The week that contains Jan 1st is the first week of the year.
    ***REMOVED***,
        buttonText: {
            prev: "Prošli",
            next: "Sljedeći",
            today: "Danas",
            month: "Mjesec",
            week: "Sedmica",
            day: "Dan",
            list: "Raspored"
    ***REMOVED***,
        weekLabel: "Sed",
        allDayText: "Cijeli dan",
        eventLimitText: function (n) {
            return "+ još " + n;
    ***REMOVED***,
        noEventsMessage: "Nema događaja za prikazivanje"
***REMOVED***;

    return bs;

***REMOVED***));
