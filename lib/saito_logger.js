'use strict';

const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp(),
    format.simple(),
    format.printf(info => `${info.timestamp} - ${info.level}: ${info.message}`),
    format.colorize({ all: true })
  ),
  transports: [
    new transports.Console(),
  ]
});


// (function createLogger() {

//     logger = new(Winston.Logger)({
//         transports: [
//             new(Winston.transports.Console)({
//                 level: logLevel,
//                 colorize: true,
//                 timestamp: function () {
//                     return (new Date()).toLocaleTimeString();
//                 },
//                 prettyPrint: true
//             })
//         ]
//     });

//     Winston.addColors({
//         error: 'red',
//         warn: 'yellow',
//         info: 'cyan',
//         debug: 'green'
//     });
// })();

module.exports = logger;