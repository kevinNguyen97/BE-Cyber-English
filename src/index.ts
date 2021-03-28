import 'reflect-metadata';
import { container } from 'tsyringe';
import AppRouter from './app';
import config from './config/config';
import LoggerService from './config/logger';

const appRouter = container.resolve(AppRouter);
const logger = container.resolve(LoggerService)


appRouter.appRouter.listen(process.env.SERVER_PORT || config.server.port, () => logger.info( 'app',`Example app listening at http://localhost:${process.env.PORT || config.server.port}`))
