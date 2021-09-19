import { configure, getLogger } from 'log4js';
import config from '../config/config';
import { getDateTime } from '../ultils/Ultil';


// appenders
configure({
  appenders: {
    console: { type: 'stdout', layout: { type: 'colored' } },
    fileAppender: {
      type: 'file',
      keepFileExt: true,
      layout: { type: 'basic' },
      compress: true,
      filename: `${config.LogConfig.logDir}/${getDateTime().split('/').join('-').trim()}.txt`,
      daysToKeep: 5,
    }
  },
  categories: {
    default: { appenders: ['console','fileAppender'], level: 'info' }
  }
});

// fetch logger and export
export const logger = getLogger();