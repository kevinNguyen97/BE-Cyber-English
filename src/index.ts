import 'reflect-metadata';
import { container } from 'tsyringe';
import app from './app';
import config from './config/config';
import LoggerService from './config/logger';


const logger = container.resolve(LoggerService)

app.listen(process.env.PORT || config.server.port, () => logger.info( 'app',`Example app listening at http://localhost:${process.env.PORT || config.server.port}`))

// const httpServer = http.createServer(app);

// httpServer.listen(config.server.port, () => logger.info(NAMESPACE, `Server is running ${config.server.port}`));