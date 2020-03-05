import { userModel } from "../../../../models";
import { Request, Response } from "express";

export async function getUserById(req: Request, res: Response): Promise<Response> {
    try {
        const { id } = req.params;
        if (!id) {
            throw { status: 404, message: `User not found` };
        }

        const findUser = await userModel
            .findById(id)
            .and([{ $or: [{ userStatus: 'active' }, { userStatus: 'inactive' }, { userStatus: 'expired' },] }])
            .lean().select('-__v').exec();

        if (!findUser) {
            throw { status: 404, message: `No user found` };
        }

        return res.status(200).json({ data: findUser, message: `User found` });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

export async function getUserByEmail(req: Request, res: Response): Promise<Response> {
    try {
        const { user } = req.params;
        if (!user) {
            throw { status: 404, message: `User not found` };
        }

        const findUser = await userModel
            .findOne({ $or: [{ email: user }, { phoneNumber: user }] })
            .and([{ $or: [{ userStatus: 'active' }, { userStatus: 'inactive' }, { userStatus: 'expired' },] }])
            .lean().select('-__v').exec();

        if (!findUser) {
            throw { status: 404, message: `No user found` };
        }

        return res.status(200).json({ data: findUser, message: `User found` });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

export async function getAllUser(req: Request, res: Response): Promise<Response> {
    try {
        const findAll = await userModel.find();

        return res.status(200).json({ data: findAll, message: `Found them all` });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

export async function updateUser(req: Request, res: Response): Promise<Response> {
    try {
        const { id } = req.params;

        if (!id) {
            throw { status: 404, message: `User not found` };
        }

        let options = req.body;
        const updates: any = {};

        delete updates.password;

        for (const option of Object.keys(options)) {
            updates[option] = options[option];
        }

        const updateU = await userModel
            .findByIdAndUpdate(id, updates, { new: true })
            .and([{ $or: [{ userStatus: 'active' }, { userStatus: 'inactive' }, { userStatus: 'expired' },] }])
            .lean().select('-__v').exec();

        if (!updates) {
            throw { status: 404, message: `User not found` };
        }

        return res.status(201).json({ data: updateU, message: `Updated successfully` });

    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

export async function deactivateUser(req: Request, res: Response): Promise<Response> {
    try {
        const { id } = req.params;

        if (!id) {
            throw { status: 404, message: `User not found` };
        }

        const deactivate = await userModel.findByIdAndUpdate(id, { userStatus: `deactivate` }, { new: true })
            .and([{ $or: [{ userStatus: 'active' }, { userStatus: 'inactive' }, { userStatus: 'expired' },] }])
            .lean().select('-__v').exec();

        if (!deactivate) {
            throw { status: 404, message: `Could not find user` };
        }

        return res.status(201).json({data: deactivate, message: `User deleted successfully`});

    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

export async function changePassword(req: Request, res: Response): Promise<Response> {
    
}