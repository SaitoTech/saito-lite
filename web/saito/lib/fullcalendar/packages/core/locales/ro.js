(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {***REMOVED***, global.FullCalendarLocales.ro = factory()));
***REMOVED***(this, function () { 'use strict';

    var ro = {
        code: "ro",
        week: {
            dow: 1,
            doy: 7 // The week that contains Jan 1st is the first week of the year.
    ***REMOVED***,
        buttonText: {
            prev: "precedentă",
            next: "următoare",
            today: "Azi",
            month: "Lună",
            week: "Săptămână",
            day: "Zi",
            list: "Agendă"
    ***REMOVED***,
        weekLabel: "Săpt",
        allDayText: "Toată ziua",
        eventLimitText: function (n) {
            return "+alte " + n;
    ***REMOVED***,
        noEventsMessage: "Nu există evenimente de afișat"
***REMOVED***;

    return ro;

***REMOVED***));
