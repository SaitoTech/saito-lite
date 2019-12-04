(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {***REMOVED***, global.FullCalendarLocales.fa = factory()));
***REMOVED***(this, function () { 'use strict';

    var fa = {
        code: "fa",
        week: {
            dow: 6,
            doy: 12 // The week that contains Jan 1st is the first week of the year.
    ***REMOVED***,
        dir: 'rtl',
        buttonText: {
            prev: "قبلی",
            next: "بعدی",
            today: "امروز",
            month: "ماه",
            week: "هفته",
            day: "روز",
            list: "برنامه"
    ***REMOVED***,
        weekLabel: "هف",
        allDayText: "تمام روز",
        eventLimitText: function (n) {
            return "بیش از " + n;
    ***REMOVED***,
        noEventsMessage: "هیچ رویدادی به نمایش"
***REMOVED***;

    return fa;

***REMOVED***));
