import mongoose, { Document, Model, Schema } from 'mongoose';
// Assuming the Category model is in the categories directory

// Define the TypeScript interface for PostRequirement
interface IPostRequirement extends Document {
    name: string;
    email: string;
    phone: string;
    image?: string;
    specifications: string;
    isActive: boolean;
    isDelete: boolean;
    isApproved: boolean;
    category?: mongoose.Schema.Types.ObjectId | any;
    updatedAt?: string;
}

// Define the schema
const postRequirementSchema: Schema<IPostRequirement> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    image: { type: String },
    specifications: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});

// Export the model
const PostRequirement: Model<IPostRequirement> =
    mongoose.models.PostRequirement ||
    mongoose.model<IPostRequirement>('PostRequirement', postRequirementSchema);

export default PostRequirement;
export type { IPostRequirement };
