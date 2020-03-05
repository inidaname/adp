import express from "express";
// import { member } from "../controller";

const routes = express.Router();

routes.all('/', function(req, res) {
    res.status(200).json({message: `You are on User Service ADP`});
});
export default routes;