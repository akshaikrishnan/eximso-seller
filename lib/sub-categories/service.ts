import connectDB from '../utils/db';
import model from './model';

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
    return model.find({ ...params, isDelete: false, isActive: true });
};
