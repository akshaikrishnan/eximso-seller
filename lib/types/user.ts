import { Types } from 'mongoose';

export type UserSegment =
    | 'Manufacturer'
    | 'Supplier'
    | 'Importer'
    | 'Wholesaler'
    | 'Others';

export interface Profile {
    name?: string;
    phone?: string;
    mobile?: string;
    email: string;
    logo?: string;
    about?: string;
    categories?: Types.ObjectId[];
    segment?: UserSegment;
    gstNo?: string;
    address?: string;
    website?: string;
    authPerson?: {
        name?: string;
        phone?: string;
        email?: string;
        designation?: string;
    };
    designation?: string;
    country: string;
    bank?: {
        name?: string;
        accountHolderName?: string;
        ifsc?: string;
        accountNo?: string;
        branch?: string;
    };
    gstCertificate?: string;
    bankCheque?: string;
    password: string;
    isActive?: boolean;
    isDelete?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
