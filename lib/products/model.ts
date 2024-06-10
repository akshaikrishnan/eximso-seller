import mongoose, { Document, Model } from 'mongoose';

interface IProduct extends Document {
    name: string;
    price: number;
    offerPrice?: number;
    brand: string;
    shortDescription: string;
    detailedDescription: string;
    stock: number;
    tags: string[];
    images: string[];
    dimensions: {
        length: number;
        width: number;
        height: number;
        weight: number;
    };
    category: mongoose.Schema.Types.ObjectId;
    subcategory?: mongoose.Schema.Types.ObjectId;
    seller: mongoose.Schema.Types.ObjectId;
    isActive: boolean;
    isDelete: boolean;
    timestamp: Date;
}

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        price: {
            type: Number,
            required: true
        },
        offerPrice: {
            type: Number
        },
        brand: {
            type: String,
            required: true
        },
        shortDescription: {
            type: String,
            required: true
        },
        detailedDescription: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        tags: {
            type: [String]
        },
        images: {
            type: [String]
        },
        dimensions: {
            length: {
                type: Number,
                required: true
            },
            width: {
                type: Number,
                required: true
            },
            height: {
                type: Number,
                required: true
            },
            weight: {
                type: Number,
                required: true
            }
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        subcategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subcategory'
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDelete: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
