(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {***REMOVED***, global.FullCalendarLocales.el = factory()));
***REMOVED***(this, function () { 'use strict';

    var el = {
        code: "el",
        week: {
            dow: 1,
            doy: 4 // The week that contains Jan 4st is the first week of the year.
    ***REMOVED***,
        buttonText: {
            prev: "Προηγούμενος",
            next: "Επόμενος",
            today: "Σήμερα",
            month: "Μήνας",
            week: "Εβδομάδα",
            day: "Ημέρα",
            list: "Ατζέντα"
    ***REMOVED***,
        weekLabel: "Εβδ",
        allDayText: "Ολοήμερο",
        eventLimitText: "περισσότερα",
        noEventsMessage: "Δεν υπάρχουν γεγονότα για να εμφανιστεί"
***REMOVED***;

    return el;

***REMOVED***));
