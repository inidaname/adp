import express from "express";
import { member } from "../controller";

const routes = express.Router();

routes.all('/', function(req, res) {
    res.status(200).json({message: `You are on ADP`});
});

routes.route('/member').post(member.createUser).get(member.getAllUser);
routes.route('/login').post(member.loginUser);

export default routes;