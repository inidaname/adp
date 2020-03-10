import { Document } from "mongoose";

export interface User extends Document {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    status: string;
    checkPassword? (password: string): Promise<boolean>;
}