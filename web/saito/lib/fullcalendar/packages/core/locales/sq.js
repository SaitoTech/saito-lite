(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {***REMOVED***, global.FullCalendarLocales.sq = factory()));
***REMOVED***(this, function () { 'use strict';

    var sq = {
        code: "sq",
        week: {
            dow: 1,
            doy: 4 // The week that contains Jan 4th is the first week of the year.
    ***REMOVED***,
        buttonText: {
            prev: "mbrapa",
            next: "Përpara",
            today: "sot",
            month: "Muaj",
            week: "Javë",
            day: "Ditë",
            list: "Listë"
    ***REMOVED***,
        weekLabel: "Ja",
        allDayHtml: "Gjithë<br/>ditën",
        eventLimitText: function (n) {
            return "+më tepër " + n;
    ***REMOVED***,
        noEventsMessage: "Nuk ka evente për të shfaqur"
***REMOVED***;

    return sq;

***REMOVED***));
