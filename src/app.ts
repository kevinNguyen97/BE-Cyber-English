import 'reflect-metadata';
import cors from 'cors';
import bodyParser from 'body-parser';
import { requestLoggerMiddleware } from './request.logger.middleware';

import express from 'express';
import { singleton } from 'tsyringe';
import VocabularyRouter from './router/vocabularies';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

@singleton()
class App {
    router = express()
    constructor(
        private vocabularyRouter: VocabularyRouter,
    ) {

        this.router.use(cors());
        /** Parse the body of the request */
        this.router.use(cors());
        this.router.use(bodyParser.urlencoded({ extended: false }));
        this.router.use(bodyParser.json({ limit: '50mb', }));
        /** Routes go here */

        this.router.use('/vocabulary', this.vocabularyRouter.router);

        this.router.use('/swagger', swaggerUi.serve);
        this.router.get('/swagger', swaggerUi.setup(swaggerDocument));


        /** Error handling */
        this.router.use((req, res, next) => {
            const error = new Error('Not found');

            res.status(404).json({
                message: error.message
            });
        });

        this.router.use(requestLoggerMiddleware)
    }
}

export default App;
