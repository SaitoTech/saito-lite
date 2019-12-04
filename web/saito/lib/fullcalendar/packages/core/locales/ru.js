(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {***REMOVED***, global.FullCalendarLocales.ru = factory()));
***REMOVED***(this, function () { 'use strict';

    var ru = {
        code: "ru",
        week: {
            dow: 1,
            doy: 4 // The week that contains Jan 4th is the first week of the year.
    ***REMOVED***,
        buttonText: {
            prev: "Пред",
            next: "След",
            today: "Сегодня",
            month: "Месяц",
            week: "Неделя",
            day: "День",
            list: "Повестка дня"
    ***REMOVED***,
        weekLabel: "Нед",
        allDayText: "Весь день",
        eventLimitText: function (n) {
            return "+ ещё " + n;
    ***REMOVED***,
        noEventsMessage: "Нет событий для отображения"
***REMOVED***;

    return ru;

***REMOVED***));
