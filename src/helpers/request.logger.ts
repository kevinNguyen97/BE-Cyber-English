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
      filename: `logs/${getDateTime().split(' ').join('-').trim()}.txt`,
      daysToKeep: 14,
    }
  },
  categories: {
    default: { appenders: ['console','fileAppender'], level: 'info' }
  }
});

// fetch logger and export
export const loggerRequest = getLogger();