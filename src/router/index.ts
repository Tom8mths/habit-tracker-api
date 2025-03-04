import express from "express";
import authentication from "./authentication";
import users from "./users";
import tasks from "./tasks";
import ai from "./ai"

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    users(router);
    tasks(router);
    ai(router)

    return router;
}