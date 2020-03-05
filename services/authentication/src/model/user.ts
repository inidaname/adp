import mongoose from "mongoose";
import validator from "mongoose-unique-validator";
import bcrypt from "bcrypt-nodejs";
import bcryptjs from 'bcryptjs';
import { NextFunction } from "express";
import { User } from "../../../../lib/interface/user";

const userSchema: any = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, `Please provide your Full Name`]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, `Please provide your password`],
        select: false
    },
    phoneNumber: {
        type: String,
        required: [true, `Please peovide a phone Number`]
    },
    status: {
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
    // collection: 'Member',
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

userSchema.plugin(validator);

userSchema.pre('save', function (next: NextFunction) {
    if (this.password && !this.isModified('password')) {
        return next();
    }
    bcrypt.hash(this.password, '10', (err, hash) => {
        if (err) {
            next(err);
        }
		this.password = hash;
		next();
    });
});

export default mongoose.model<User>('Member', userSchema)