import express from 'express';
export interface IBaseFlow{
    bodyInputIsInvaild: (req: express.Request, resp: express.Response) => boolean;
}