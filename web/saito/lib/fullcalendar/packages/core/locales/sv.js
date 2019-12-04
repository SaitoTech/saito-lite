(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {***REMOVED***, global.FullCalendarLocales.sv = factory()));
***REMOVED***(this, function () { 'use strict';

    var sv = {
        code: "sv",
        week: {
            dow: 1,
            doy: 4 // The week that contains Jan 4th is the first week of the year.
    ***REMOVED***,
        buttonText: {
            prev: "Förra",
            next: "Nästa",
            today: "Idag",
            month: "Månad",
            week: "Vecka",
            day: "Dag",
            list: "Program"
    ***REMOVED***,
        weekLabel: "v.",
        allDayText: "Heldag",
        eventLimitText: "till",
        noEventsMessage: "Inga händelser att visa"
***REMOVED***;

    return sv;

***REMOVED***));
