import express, { Router } from "express";
import { member } from "../controller";

const routes: Router = express.Router();

routes.all('/', function (req, res) {
    res.status(200).json({ message: `You are on User Service ADP` });
});

// Get all User
routes.route('/user')
    .get(member.getAllUser);

// User by ID
routes.route('/user/:id')
    .get(member.getUserById)
    .put(member.updateUser)
    .delete(member.deactivateUser);

// Get user by Email
routes.route('/user/email/:user')
    .get(member.getUserByEmail);

// Reset user password
routes.route('/reset/:id')
    .get(member.requestPassword)
    .put(member.checkReset)
    .post(member.confirmReset);

export default routes;