import express from 'express';
import { json } from 'body-parser'
import mongoose from "mongoose";
import cookieSession from "cookie-session"

import 'express-async-errors';
import { currentUserRouter } from "./routes/current-user"
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from '../middlewares/error-handler';
import { NotFoundError } from '../errors/not-found-error';



const app = express();
app.settings('trust proxy', true);
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: true
}))


app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all("*", async(req,res,next) => {
    throw new NotFoundError()
})

app.use(errorHandler);

const start = async () => {
    try {
    
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    } catch (err) {
        console.error(err)
    }
    console.log("Connecting to auth mongo database");
}

app.listen(3000, () => {
    console.log("Listening on Port 3000!")
})

start();