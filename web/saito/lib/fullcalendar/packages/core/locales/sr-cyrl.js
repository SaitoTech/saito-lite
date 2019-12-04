(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {***REMOVED***, global.FullCalendarLocales['sr-cyrl'] = factory()));
***REMOVED***(this, function () { 'use strict';

    var srCyrl = {
        code: "sr-cyrl",
        week: {
            dow: 1,
            doy: 7 // The week that contains Jan 1st is the first week of the year.
    ***REMOVED***,
        buttonText: {
            prev: "Претходна",
            next: "следећи",
            today: "Данас",
            month: "Месец",
            week: "Недеља",
            day: "Дан",
            list: "Планер"
    ***REMOVED***,
        weekLabel: "Сед",
        allDayText: "Цео дан",
        eventLimitText: function (n) {
            return "+ још " + n;
    ***REMOVED***,
        noEventsMessage: "Нема догађаја за приказ"
***REMOVED***;

    return srCyrl;

***REMOVED***));
