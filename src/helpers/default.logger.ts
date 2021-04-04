import { configure, getLogger } from 'log4js';
import config from '../config/config';


// appenders
configure({
  appenders: {
    console: { type: 'stdout', layout: { type: 'colored' } },
    dateFile: {
      type: 'dateFile',
      filename: `${config.LogConfig.logDir}/${config.LogConfig.logFile}`,
      layout: { type: 'basic' },
      compress: true,
      daysToKeep: 14,
      keepFileExt: true
    }
  },
  categories: {
    default: { appenders: ['console', 'dateFile'], level: config.LogConfig.logLevel }
  }
});

// fetch logger and export
export const logger = getLogger();