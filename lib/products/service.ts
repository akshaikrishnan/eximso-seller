import slugify from 'slugify';
import connectDB from '../utils/db';
import model from './model';
import Category from '../categories/model';
import SubCategory from '../sub-categories/model';

export const generateUniqueSlug = async (name: string) => {
    let slug = slugify(name, { lower: true });
    let slugExists = await model.findOne({ slug });
    let count = 1;

    while (slugExists) {
        slug = `${slugify(name, { lower: true })}-${count}`;
        slugExists = await model.findOne({ slug });
        count++;
    }

    return slug;
};

export const findOne = async (params: any) => {
    await connectDB();
    console.log({ ...params, isDelete: false, isActive: true });
    return model.findOne({ ...params, isDelete: false });
};

export const create = async (data: any) => {
    await connectDB();
    const slug = await generateUniqueSlug(data.name);
    return model.create({ ...data, slug });
};

export const findAll = async (params: any = {}) => {
    await connectDB();
    return model
        .find({ ...params, isDelete: false })
        .populate({ path: 'category', model: Category })
        .populate({ path: 'subcategory', model: SubCategory });
};

export const update = async (id: string, data: any) => {
    await connectDB();
    return model.findByIdAndUpdate(id, data);
};

export const findById = async (id: string) => {
    await connectDB();
    return model.findById(id);
};
