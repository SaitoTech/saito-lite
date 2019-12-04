(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {***REMOVED***, global.FullCalendarLocales.sk = factory()));
***REMOVED***(this, function () { 'use strict';

    var sk = {
        code: "sk",
        week: {
            dow: 1,
            doy: 4 // The week that contains Jan 4th is the first week of the year.
    ***REMOVED***,
        buttonText: {
            prev: "Predchádzajúci",
            next: "Nasledujúci",
            today: "Dnes",
            month: "Mesiac",
            week: "Týždeň",
            day: "Deň",
            list: "Rozvrh"
    ***REMOVED***,
        weekLabel: "Ty",
        allDayText: "Celý deň",
        eventLimitText: function (n) {
            return "+ďalšie: " + n;
    ***REMOVED***,
        noEventsMessage: "Žiadne akcie na zobrazenie"
***REMOVED***;

    return sk;

***REMOVED***));
