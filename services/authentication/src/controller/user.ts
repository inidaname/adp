import { userModel } from "../../../../models";
import { Request, Response } from "express";
import bcrypt from "bcrypt-nodejs";
import {createToken} from "../../../../lib/helpers";
import { User } from "../../../../lib/interface/user";

export async function createUser(req: Request, res: Response): Promise<Response> {
    try {

        const create = await userModel.create({ ...req.body });

        if (!create) {
            throw {status: 400, message: `Whty`}
        }

        const data: User = create.toJSON();
        delete data.password;
        delete data.__v;
        delete data._id;

        const token = await createToken(data);

        return res.status(201).json({ data, token, message: `User created` })
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

        const findUser = await userModel
        .findOne({ $or: [{ email: username }, { phoneNumber: username }] })
        .and([{ $or: [{ userStatus: 'active' }, { userStatus: 'inactive' }, {userStatus: 'expired'},] }])
        .select('+password');

        if (!findUser) {
            throw { status: 400, message: `Login details did not match` };
        }

        const matchPassword = await findUser.checkPassword(password)
        if (!matchPassword) {
            throw { status: 400, message: `Login details did not match` };
        }

        const data: User = findUser.toJSON();
        delete data.password;
        delete data._id;
        delete data.__v;

        const token = await createToken(data);

        return res.status(200).json({data, token, message: `Logged in successfully`})
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}