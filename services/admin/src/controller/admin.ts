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
      .findOne({ $or: [{ userId: id }, { id }] })
      .lean()
      .select('-__v')
      .exec();
    if (!admin) {
      throw { message: `could not find admin`, status: 404 };
    }

    return res.status(200).json({ message: ``, data: admin });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
}

export async function updateAdmin(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;

    if (!id) {
      throw { message: `Could not find admin`, status: 404 };
    }

    let options = req.body;
    const updates: any = {};

    for (const option of Object.keys(options)) {
      updates[option] = options[option];
    }

    const admin = await adminModel
      .findByIdAndUpdate(id, updates, { new: true })
      .lean()
      .select('-__v')
      .exec();

    if (!admin) {
      throw { message: `Could not find admin`, status: 404 };
    }

    return res.status(200).json({ message: `Data updated`, data: admin });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
}

export async function deactivateAdmin(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;

    if (!id) {
      throw { message: `Could not find admin`, status: 404 };
    }

    const admin = await adminModel
      .findOneAndUpdate(
        {
          $and: [
            { $or: [{ userId: id }, { id }] },
            { $not: { adminStatus: 'deactivated' } }
          ]
        },
        { adminStatus: 'deactivated' },
        { new: true }
      )
      .lean()
      .select('-__v')
      .exec();

    if (!admin) {
      throw { message: `Could not find Admin`, status: 404 };
    }

    return res.status(200).json({ message: `Admin deleted`, data: admin });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
}
