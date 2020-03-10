import mongoose, { Schema } from "mongoose";
import validator from "mongoose-unique-validator";

const adminSchema: Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        unique: true
    },
    adminLevel: {
        type: String,
        enum: [
            'superAdmin',
            'fedAdmin',
            'stateAdmin',
            'localAdmin',
            'pollAdmin'
        ]
    },
    adminStatus: {
        type: String,
        enum: [
            'active',
            'deactivated',
            'pending'
        ],
        default: 'pending'
    }
}, {
    timestamps: true,
    collection: 'Admin',
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

adminSchema.plugin(validator);

export default mongoose.model('Admin', adminSchema);
