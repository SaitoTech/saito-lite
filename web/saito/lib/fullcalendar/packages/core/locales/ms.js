(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {***REMOVED***, global.FullCalendarLocales.ms = factory()));
***REMOVED***(this, function () { 'use strict';

    var ms = {
        code: "ms",
        week: {
            dow: 1,
            doy: 7 // The week that contains Jan 1st is the first week of the year.
    ***REMOVED***,
        buttonText: {
            prev: "Sebelum",
            next: "Selepas",
            today: "hari ini",
            month: "Bulan",
            week: "Minggu",
            day: "Hari",
            list: "Agenda"
    ***REMOVED***,
        weekLabel: "Mg",
        allDayText: "Sepanjang hari",
        eventLimitText: function (n) {
            return "masih ada " + n + " acara";
    ***REMOVED***,
        noEventsMessage: "Tiada peristiwa untuk dipaparkan"
***REMOVED***;

    return ms;

***REMOVED***));
