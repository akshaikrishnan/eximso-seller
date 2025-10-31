import mongoose from 'mongoose';

const User = new mongoose.Schema(
    {
        name: { type: String },
        phone: { type: String },
        email: { type: String, required: true },
        logo: { type: String },
        about: { type: String },
        country: { type: String },
        categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
        segment: {
            type: String,
            enum: ['Manufacturer', 'Supplier', 'Importer', 'Wholesaler', 'Others']
        },
        gstNo: { type: String },
        address: { type: String },
        website: { type: String },
        authPerson: {
            name: { type: String },
            designation: { type: String },
            email: { type: String },
            phone: { type: String }
        },
        bank: {
            name: { type: String },
            accountHolderName: { type: String },
            ifsc: { type: String },
            accountNo: { type: String },
            branch: { type: String }
        },
        gstCertificate: { type: String },
        bankCheque: { type: String },
        password: { type: String },
        isPhoneVerified: { type: Boolean, default: false },
        isEmailVerified: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        isDelete: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', User);
