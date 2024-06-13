import connectDB from '../utils/db';
import model from './model';
import Category from '../categories/model';

export const findOne = async (params: any) => {
    await connectDB();
    console.log({ ...params, isDelete: false, isActive: true });
    return model.findOne({ ...params, isDelete: false, isActive: true });
};

export const findById = async (id: string) => {
    await connectDB();
    return model.findById(id);
};

export const create = async (data: any) => {
    await connectDB();
    return model.create(data);
};

export const update = async (id: string, data: any) => {
    await connectDB();
    return model.findByIdAndUpdate(id, data, { new: true });
};

export const findDetail = async (id: string) => {
    await connectDB();
    return model.findById(id).populate({ path: 'categories', model: Category });
};
