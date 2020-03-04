import {userModel} from "../model";
import { Request, Response } from "express";
export interface ReturnData {

}

export function createUser(req: Request, res: Response){
    try {
        const create = userModel.create({...req.body});

        return res.status(200).json({data: create, message: `User created`})
    } catch (error) {
        return res.status(error.status || 500).json({message: error.message});
    }
}