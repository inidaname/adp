import { Document } from "mongoose";
import { User } from "./user";

export interface ResetInterface extends Document {
    userId: User;
    token: string
    requestStatus: request;
}

export enum request {
    'active',
    'touched',
    'done',
    'inactive'
}