import { userModel, resetModel } from "../../../../models";
import { Request, Response } from "express";
import { sendMail, createToken } from "../../../../lib/helpers";
import { User } from "../../../../lib/interface/user";
import { ResetInterface } from "../../../../lib/interface/reset";

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

        return res.status(201).json({ data: deactivate, message: `User deleted successfully` });

    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

export async function requestPassword(req: Request, res: Response): Promise<Response> {
    try {
        const { id } = req.params;

        if (!id) {
            throw { status: 404, message: `User with provided details does not exist` };
        }


        const findEmail = [await userModel.findOne({ $or: [{ email: id }, { phoneNumber: id }] })
            .and([{ $or: [{ userStatus: 'active' }, { userStatus: 'inactive' }, { userStatus: 'expired' },] }]),
        await userModel.findById(id)
            .and([{ $or: [{ userStatus: 'active' }, { userStatus: 'inactive' }, { userStatus: 'expired' },] }])];

        Promise.all(findEmail)
            .then(
                (value) => {
                    value.map(async (user, i, a) => {
                        if (user) {
                            const token = await createToken(user);
                            const createReset = await resetModel.create({ userId: user._id, token });
                            if (createReset) {
                                const msgBody = `
                                    <p>Hello ${user.fullName},</p>
                                    <p>Here is a link to reset your email https://adp.ng/r/${token}</p>
                                    <p> Thank You</p>
                                `
                                await sendMail('Password reset', msgBody, user.email);


                                return res.status(200).json({ message: `Email for change of password sent`, token });
                            }
                        }
                    })
                },
                (err) => {
                    throw { status: 400, message: err }
                }
            )
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

export async function checkReset(req: Request, res: Response): Promise<Response> {
    try {
        const { token } = req.params;

        if (!token) {
            throw { status: 404, message: `Password renewal does not exist` };
        }

        const check: ResetInterface = await resetModel
            .findOneAndUpdate({ $and: [{ requestStatus: 'active' }, { token }] }, { requestStatus: 'touched' }, { new: true })
            .lean().select('-__v').exec();

        if (!check) {
            throw { status: 404, message: `Password renewal does not exist` };
        }

        return res.status(200).json({ message: `Reset found`, data: check });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

export async function confirmReset(req: Request, res: Response): Promise<Response> {
    try {
        const { token } = req.params;

        if (!token) {
            throw { status: 404, message: `Password renewal does not exist` };
        }

        const check: ResetInterface = await resetModel
            .findOneAndUpdate({ $and: [{ requestStatus: 'touched' }, { token }] }, { requestStatus: 'done' }, { new: true })
            .lean().select('-__v').exec();

        if (!check) {
            throw { status: 404, message: `Password renewal does not exist` };
        }

        const changePass: User = await userModel
            .findByIdAndUpdate({ id: check.id }, { password: req.body.password })
            .lean().select('-__v').exec();

        if (!changePass) {
            throw { status: 404, message: `User does not exist` };
        }

        await sendMail('Password Changed', 'Your password was changed successfully', changePass.email);

        return res.status(200).json({ message: `Reset found`, changed: check, data: changePass });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

