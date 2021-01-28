import express from "express";
import supertest from "supertest";
import routes from "../server/";

const app = express();
// Link to your server file
const request = supertest(app);
app.use(routes);
export { app, request };
