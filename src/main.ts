import 'reflect-metadata';
import * as http from 'http'
import { container } from 'tsyringe';
import app from './app';
import config from './config/config';
import LoggerService from './config/logger';


const logger = container.resolve(LoggerService)
const NAMESPACE = 'Server';

app.listen(config.server.port)
console.log(`listening on http://localhost:${config.server.port}`)

// const httpServer = http.createServer(app);

// httpServer.listen(config.server.port, () => logger.info(NAMESPACE, `Server is running ${config.server.port}`));