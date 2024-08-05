import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/index';
import mongoose from 'mongoose';

try {
    dotenv.config();
    const app = express();
    const port = process.env.BACKEND_DOCKER_PORT;
    const localPort = process.env.BACKEND_LOCAL_PORT;

    // connect to db and check if uri is set
    if (process.env.REACT_APP_MONGO_URI) {
        mongoose.connect(process.env.REACT_APP_MONGO_URI).catch((reason) => {
            console.log("unable to connect to db: " + reason);
        })
    } else {
        throw new Error("Environment variable is not set!!");
    }

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // use /api middleware for requests 
    app.use('/api', routes);

    // set port and listen for requests
    app.listen(port, () => console.log(`Server is running on local port: ${localPort} and docker port: ${port}`));

} catch (e) {
    console.log("error:" + e);
    throw e;
}