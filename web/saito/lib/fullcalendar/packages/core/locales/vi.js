(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {***REMOVED***, global.FullCalendarLocales.vi = factory()));
***REMOVED***(this, function () { 'use strict';

    var vi = {
        code: "vi",
        week: {
            dow: 1,
            doy: 4 // The week that contains Jan 4th is the first week of the year.
    ***REMOVED***,
        buttonText: {
            prev: "Trước",
            next: "Tiếp",
            today: "Hôm nay",
            month: "Tháng",
            week: "Tuần",
            day: "Ngày",
            list: "Lịch biểu"
    ***REMOVED***,
        weekLabel: "Tu",
        allDayText: "Cả ngày",
        eventLimitText: function (n) {
            return "+ thêm " + n;
    ***REMOVED***,
        noEventsMessage: "Không có sự kiện để hiển thị"
***REMOVED***;

    return vi;

***REMOVED***));
