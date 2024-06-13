import Category from '../categories/model';
import connectDB from '../utils/db';
import model, { IPostRequirement } from './model';

export const findOne = async (params: any) => {
    await connectDB();
    console.log({ ...params, isDelete: false, isActive: true });
    return model.findOne({ ...params, isDelete: false, isActive: true });
};

export const create = async (data: any) => {
    await connectDB();
    return model.create(data);
};

export const findAll = async () => {
    await connectDB();
    return model.find({ isDelete: false, isActive: true });
};

export const find = async (params: any) => {
    await connectDB();
    return model.find({ ...params, isDelete: false, isActive: true, isApproved: true });
};

export const getDocumentsByCategoryIds = async (
    categoryIds: string[]
): Promise<IPostRequirement[]> => {
    await connectDB(); // Ensure you're connected to the database

    // Query to find documents where the category field matches any ID in the array
    const documents = await model
        .find({ category: { $in: categoryIds }, isApproved: true })
        .populate({
            path: 'category',
            model: Category
        });

    return documents;
};
