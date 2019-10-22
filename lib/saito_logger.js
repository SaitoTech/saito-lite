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
    new (transports.File)({filename: "saito.log"})
  ]
});

//       new (winston.transports.File)(options.errorFile),
//     exitOnError: false, // do not exit on handled exceptions

module.exports = logger;
