import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import { app } from "../app"


let mongo: MongoMemoryServer;
beforeAll(async () => {
    console.log("Here")
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();
    const result = await mongoose.connect(mongoUri)
    console.log(mongo)
    console.log(mongoUri)
    console.log(result)

})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections){
        await collection.deleteMany({})
    }
})

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
})