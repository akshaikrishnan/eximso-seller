import mongoose, { Document, Model } from 'mongoose';

interface ICategory extends Document {
    name: string;
    description?: string;
    category: string;
}

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    description: {
        type: String
    }
});

const Category: Model<ICategory> = mongoose.models.SubCategory || mongoose.model<ICategory>('SubCategory', CategorySchema);

export default Category;
