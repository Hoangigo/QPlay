"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const mongoose_1 = __importDefault(require("mongoose"));
try {
    dotenv_1.default.config();
    const app = (0, express_1.default)();
    const port = process.env.BACKEND_DOCKER_PORT;
    const localPort = process.env.BACKEND_LOCAL_PORT;
    // connect to db and check if uri is set
    if (process.env.REACT_APP_MONGO_URI) {
        mongoose_1.default.connect(process.env.REACT_APP_MONGO_URI).catch((reason) => {
            console.log("unable to connect to db: " + reason);
        });
    }
    else {
        throw new Error("Environment variable is not set!!");
    }
    app.use((0, cors_1.default)());
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    // use /api middleware for requests 
    app.use('/api', index_1.default);
    // set port and listen for requests
    app.listen(port, () => console.log(`Server is running on local port: ${localPort} and docker port: ${port}`));
}
catch (e) {
    console.log("error:" + e);
    throw e;
}
