import * as express from "express";

const requestLoggerMiddleware = (req: express.Request, resp: express.Response, next: express.NextFunction) => {
    console.log(`${req.method} ${req.originalUrl}`);
    const start = new Date().getTime();
    resp.on('finish', () => {
        const elapsed = new Date().getTime() - start;
        console.info(`${req.method} ${req.originalUrl} ${req.statusCode} ${elapsed}ms`)
    })
    next();
};

export { requestLoggerMiddleware };