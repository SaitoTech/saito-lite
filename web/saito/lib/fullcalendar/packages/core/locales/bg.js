(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {***REMOVED***, global.FullCalendarLocales.bg = factory()));
***REMOVED***(this, function () { 'use strict';

    var bg = {
        code: "bg",
        week: {
            dow: 1,
            doy: 7 // The week that contains Jan 1st is the first week of the year.
    ***REMOVED***,
        buttonText: {
            prev: "назад",
            next: "напред",
            today: "днес",
            month: "Месец",
            week: "Седмица",
            day: "Ден",
            list: "График"
    ***REMOVED***,
        allDayText: "Цял ден",
        eventLimitText: function (n) {
            return "+още " + n;
    ***REMOVED***,
        noEventsMessage: "Няма събития за показване"
***REMOVED***;

    return bg;

***REMOVED***));
