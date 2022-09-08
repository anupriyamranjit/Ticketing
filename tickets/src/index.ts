import mongoose from "mongoose";


import { app } from './app';

const start = async () => {
    if(!process.env.JWT_KEY){
        throw new Error("JWT_KEY is not defined")
    }
    try {
    if(!process.env.MONGO_URI){
        throw new Error("MONGO_URI must be defined")
    }
    console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
        console.error(err)
    }
    console.log("Connecting to tickets mongo database");
}

app.listen(3000, () => {
    console.log("Listening on Port 3000!")
})

start();