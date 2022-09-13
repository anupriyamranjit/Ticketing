import express from 'express';
import { json } from 'body-parser'
import cookieSession from "cookie-session"
import 'express-async-errors';
import { errorHandler, NotFoundError, currentUser } from '@aranjit_ticketing/common';




const app = express();
app.enable('trust proxy');
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))

app.use(currentUser)


app.all("*", async(req,res,next) => {
    throw new NotFoundError()
})

app.use(errorHandler);

export { app }