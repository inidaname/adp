import mongoose, { Schema } from "mongoose";
import validator from "mongoose-unique-validator";
import bcrypt from "bcrypt-nodejs";
import bcryptjs from 'bcryptjs';
import { NextFunction } from "express";
import { User } from "../lib/interface/user";

const userSchema: Schema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, `Please provide your Full Name`]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, `Please provide your password`],
        select: false
    },
    phoneNumber: {
        type: String,
        required: [true, `Please peovide a phone Number`],
        unique: true
    },
    userStatus: {
        type: String,
        enum: [
            'active',
            'inactive',
            'expired',
            'deactivated'
        ],
        default: 'inactive'
    }
}, {
    timestamps: true,
    collection: 'Member',
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

userSchema.plugin(validator);

userSchema.pre<mongoose.Query<any>>('save', async function (next: NextFunction) {
    const query: any = this;
    if (query.password && !query.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSaltSync(10)
    if (!salt) {
        next('failed to salt');
    }
    const hash = await bcrypt.hashSync(query.password, salt);
    if (!hash) {
        next('failed to hash')
    }

    query.password = hash;
    next();
});

userSchema.methods.checkPassword = function (password: string): Promise<boolean> {
    const passwordHash = this.password;
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, passwordHash, (err, same) => {
            if (err) {
              return reject(err);
            }
            resolve(same);
          });
    })
}

userSchema.pre<mongoose.Query<any>>('updateOne', async function (next: NextFunction) {
    const query: any = this;
    if (query.password && !query.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSaltSync(10)
    if (!salt) {
        next('failed to salt');
    }
    const hash = await bcrypt.hashSync(query.password, salt);
    if (!hash) {
        next('failed to hash')
    }

    query.password = hash;
    next();
});

export default mongoose.model<User>('Member', userSchema)