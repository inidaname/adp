import { Document } from "mongoose";
import { User } from "./user";

export interface Admin extends Document {
    id?: string;
    userId: User;
    adminLevel: Level;
    adminStatus: AdminStatus;
}

export enum Level {
    superAdmin = 'superAdmin',
    fedAdmin = 'fedAdmin',
    stateAdmin = 'stateAdmin',
    localAdmin = 'localAdmin',
    pollAdmin = 'pollAdmin'
}

export enum AdminStatus {
    'active',
    'deactivated',
    'pending'
}