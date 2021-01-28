import express  from "express";
import apiRouter from "./routes/";

const server = express();
import {App} from "./middleware";

// setup global middleware
App(server);


// api router
server.use("/", apiRouter);

export default server;
