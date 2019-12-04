(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {***REMOVED***, global.FullCalendarLocales.tr = factory()));
***REMOVED***(this, function () { 'use strict';

    var tr = {
        code: "tr",
        week: {
            dow: 1,
            doy: 7 // The week that contains Jan 1st is the first week of the year.
    ***REMOVED***,
        buttonText: {
            prev: "geri",
            next: "ileri",
            today: "bugün",
            month: "Ay",
            week: "Hafta",
            day: "Gün",
            list: "Ajanda"
    ***REMOVED***,
        weekLabel: "Hf",
        allDayText: "Tüm gün",
        eventLimitText: "daha fazla",
        noEventsMessage: "Gösterilecek etkinlik yok"
***REMOVED***;

    return tr;

***REMOVED***));
