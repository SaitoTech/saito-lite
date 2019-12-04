(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {***REMOVED***, global.FullCalendarLocales.kk = factory()));
***REMOVED***(this, function () { 'use strict';

    var kk = {
        code: "kk",
        week: {
            dow: 1,
            doy: 7 // The week that contains Jan 1st is the first week of the year.
    ***REMOVED***,
        buttonText: {
            prev: "Алдыңғы",
            next: "Келесі",
            today: "Бүгін",
            month: "Ай",
            week: "Апта",
            day: "Күн",
            list: "Күн тәртібі"
    ***REMOVED***,
        weekLabel: "Не",
        allDayText: "Күні бойы",
        eventLimitText: function (n) {
            return "+ тағы " + n;
    ***REMOVED***,
        noEventsMessage: "Көрсету үшін оқиғалар жоқ"
***REMOVED***;

    return kk;

***REMOVED***));
