(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {***REMOVED***, global.FullCalendarLocales.ka = factory()));
***REMOVED***(this, function () { 'use strict';

    var ka = {
        code: "ka",
        week: {
            dow: 1,
            doy: 7
    ***REMOVED***,
        buttonText: {
            prev: "წინა",
            next: "შემდეგი",
            today: "დღეს",
            month: "თვე",
            week: "კვირა",
            day: "დღე",
            list: "დღის წესრიგი"
    ***REMOVED***,
        weekLabel: "კვ",
        allDayText: "მთელი დღე",
        eventLimitText: function (n) {
            return "+ კიდევ " + n;
    ***REMOVED***,
        noEventsMessage: "ღონისძიებები არ არის"
***REMOVED***;

    return ka;

***REMOVED***));
