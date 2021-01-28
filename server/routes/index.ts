import express from "express";
import  Rule from "../controller";
// import {App} from "../middleware";

const apiRouter = express.Router();


apiRouter.get("/", Rule.get).post("/validate-rule", Rule.validate);

// // send all remaining request to the default router
// apiRouter.use(Middleware.Four04Handler);
// // handle all unhandled error
// apiRouter.use(Middleware.ErrorHandler);

export default apiRouter;
