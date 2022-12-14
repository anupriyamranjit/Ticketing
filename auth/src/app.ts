import express from 'express';
import { json } from 'body-parser'
import cookieSession from "cookie-session"
import 'express-async-errors';
import { errorHandler, NotFoundError } from '@aranjit_ticketing/common';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';



const app = express();
app.enable('trust proxy');
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: true
}))
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async(req,res,next) => {
    throw new NotFoundError()
})

app.use(errorHandler);

export { app }