(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {***REMOVED***, global.FullCalendarLocales.uk = factory()));
***REMOVED***(this, function () { 'use strict';

    var uk = {
        code: "uk",
        week: {
            dow: 1,
            doy: 7 // The week that contains Jan 1st is the first week of the year.
    ***REMOVED***,
        buttonText: {
            prev: "Попередній",
            next: "далі",
            today: "Сьогодні",
            month: "Місяць",
            week: "Тиждень",
            day: "День",
            list: "Порядок денний"
    ***REMOVED***,
        weekLabel: "Тиж",
        allDayText: "Увесь день",
        eventLimitText: function (n) {
            return "+ще " + n + "...";
    ***REMOVED***,
        noEventsMessage: "Немає подій для відображення"
***REMOVED***;

    return uk;

***REMOVED***));
