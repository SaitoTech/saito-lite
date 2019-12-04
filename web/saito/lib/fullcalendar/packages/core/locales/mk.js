(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {***REMOVED***, global.FullCalendarLocales.mk = factory()));
***REMOVED***(this, function () { 'use strict';

    var mk = {
        code: "mk",
        buttonText: {
            prev: "претходно",
            next: "следно",
            today: "Денес",
            month: "Месец",
            week: "Недела",
            day: "Ден",
            list: "График"
    ***REMOVED***,
        weekLabel: "Сед",
        allDayText: "Цел ден",
        eventLimitText: function (n) {
            return "+повеќе " + n;
    ***REMOVED***,
        noEventsMessage: "Нема настани за прикажување"
***REMOVED***;

    return mk;

***REMOVED***));
