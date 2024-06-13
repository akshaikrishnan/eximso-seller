export interface Product {
    _id?: string;
    name: string;
    price: number;
    offerPrice?: number;
    brand: string;
    shortDescription: string;
    detailedDescription: string;
    stock: number;
    tags: string[];
    thumbnail: string;
    images: string[];
    videos: string[];
    countryOfOrigin: string;
    modelNumber: string;
    minimumOrderQuantity: number;
    isPrivateLabeling: boolean;
    isSampleAvailable: boolean;
    uom: string;
    rating?: number;
    dimensions: {
        length: number;
        width: number;
        height: number;
        weight: number;
    };
    category: string | any;
    subcategory?: string;
    seller: string;
    isActive: boolean;
}
