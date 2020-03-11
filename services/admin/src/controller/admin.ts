import { Request, Response } from 'express';
import { sendMail, createToken } from '../../../../lib/helpers';
import { adminModel } from '../../../../models';

export async function createAdmin(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const admin = await adminModel.create({ ...req.body });
    return res
      .status(201)
      .json({ message: `Admin created Successfully`, data: admin });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
}

export async function getAdminByUserId(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;
    if (!id) {
      throw { status: 404, message: `Admin does not exist` };
    }

    const admin = await adminModel
      .findOne({ userId: id })
      .lean()
      .select('-__v')
      .exec();
    if (!admin) {
      throw { message: `could not find admin`, status: 404 };
    }

    return res.status(200).json({ message: `` });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
}
