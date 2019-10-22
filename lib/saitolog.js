// 'use strict';
// require('winston');
// const logLevel = 'debug';

// var logger;

// let logger = winston.createLogger({
//     transports: [
//       new (winston.transports.Console)(options.console),
//       new (winston.transports.File)(options.errorFile),
//       new (winston.transports.File)(options.file)
//     ],
//     exitOnError: false, // do not exit on handled exceptions
//   });

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


module.exports = logger;