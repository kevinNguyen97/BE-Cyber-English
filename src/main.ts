import 'reflect-metadata';
import * as http from 'http'
import { container } from 'tsyringe';
import App from './app';
import config from './config/config';
import LoggerService from './config/logger';

const app = container.resolve(App).router;
const logger = container.resolve(LoggerService)
const NAMESPACE = 'Server';
const httpServer = http.createServer(app);

httpServer.listen(config.server.port, () => logger.info(NAMESPACE, `Server is running ${config.server.port}:${config.server.port}`));