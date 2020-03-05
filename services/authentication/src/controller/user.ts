import { userModel } from "../model";
import { Request, Response } from "express";
import bcrypt from "bcrypt-nodejs";
import { User } from "../../../../lib/interface/user";

export async function createUser(req: Request, res: Response): Promise<Response> {
    try {

        const create = await userModel.create({ ...req.body });

        if (!create) {
            throw {status: 400, message: `Whty`}
        }

        return res.status(200).json({ data: create, message: `User created` })
    } catch (error) {
        return res.status(error.status || 500).json({ message: error });
    }
}

export async function loginUser(req: Request, res: Response): Promise<Response> {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            throw { status: 400, message: `Please provide login details` };
        }

        const findUser = await userModel.findOne({ $or: [{ email: username }, { phoneNumber: username }] }).select('+password');

        if (!findUser) {
            throw { status: 400, message: `Login details did not match` };
        }

        const matchPassword = await bcrypt.compareSync(password, findUser.password);
        if (!matchPassword) {
            throw { status: 400, message: `Login details did not match` };
        }

        const data = findUser.toJSON();
        delete data.password
        delete data._id
        delete data.__v

        return res.status(200).json({data: data, message: `Logged in successfully`})
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

export async function getAllUser(req: Request, res: Response): Promise<Response> {
    try {
        const findAll = await userModel.find();

        return res.status(200).json({data: findAll, message: `Found them all`});
    } catch (error) {
        return res.status(error.status || 500).json({message: error.message});
    }
}