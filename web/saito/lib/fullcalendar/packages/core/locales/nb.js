(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {***REMOVED***, global.FullCalendarLocales.nb = factory()));
***REMOVED***(this, function () { 'use strict';

    var nb = {
        code: "nb",
        week: {
            dow: 1,
            doy: 4 // The week that contains Jan 4th is the first week of the year.
    ***REMOVED***,
        buttonText: {
            prev: "Forrige",
            next: "Neste",
            today: "I dag",
            month: "Måned",
            week: "Uke",
            day: "Dag",
            list: "Agenda"
    ***REMOVED***,
        weekLabel: "Uke",
        allDayText: "Hele dagen",
        eventLimitText: "til",
        noEventsMessage: "Ingen hendelser å vise"
***REMOVED***;

    return nb;

***REMOVED***));
