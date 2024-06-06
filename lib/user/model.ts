import mongoose from 'mongoose';

const User = new mongoose.Schema(
    {
        name: { type: String },
        phone: { type: String },
        email: { type: String, required: true },
        logo: { type: String },
        about: { type: String },
        categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
        password: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        isDelete: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', User);
