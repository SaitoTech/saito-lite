(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {***REMOVED***, global.FullCalendarLocales.hu = factory()));
***REMOVED***(this, function () { 'use strict';

    var hu = {
        code: "hu",
        week: {
            dow: 1,
            doy: 4 // The week that contains Jan 4th is the first week of the year.
    ***REMOVED***,
        buttonText: {
            prev: "vissza",
            next: "előre",
            today: "ma",
            month: "Hónap",
            week: "Hét",
            day: "Nap",
            list: "Napló"
    ***REMOVED***,
        weekLabel: "Hét",
        allDayText: "Egész nap",
        eventLimitText: "további",
        noEventsMessage: "Nincs megjeleníthető esemény"
***REMOVED***;

    return hu;

***REMOVED***));
