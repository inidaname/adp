import mongoose from "mongoose";
import validator from "mongoose-unique-validator";

const resetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'Member'
    },
    token: {
        type: String
    },
    requestStatus: {
        type: String,
        enum: [
            'active',
            'reset',
            'inactive'
        ],
        defualt: 'active'
    }
},
{
    timestamps: true,
    collection: 'Reset'
});

export default mongoose.model('Reset', resetSchema);