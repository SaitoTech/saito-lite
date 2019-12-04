(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {***REMOVED***, global.FullCalendarLocales['pt-br'] = factory()));
***REMOVED***(this, function () { 'use strict';

    var ptBr = {
        code: "pt-br",
        buttonText: {
            prev: "Anterior",
            next: "Próximo",
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
            list: "Compromissos"
    ***REMOVED***,
        weekLabel: "Sm",
        allDayText: "dia inteiro",
        eventLimitText: function (n) {
            return "mais +" + n;
    ***REMOVED***,
        noEventsMessage: "Não há eventos para mostrar"
***REMOVED***;

    return ptBr;

***REMOVED***));
