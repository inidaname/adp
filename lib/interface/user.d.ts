import { Document } from "mongoose";

export interface User extends Document {
    id?: string;
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    userStatus: status;
    checkPassword? (password: string): Promise<boolean>;
}


export enum status {
    'active',
    'inactive',
    'expired',
    'deactivated'
}