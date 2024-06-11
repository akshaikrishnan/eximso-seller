export interface Product {
    name: string;
    price: number;
    offerPrice?: number;
    brand: string;
    shortDescription: string;
    detailedDescription: string;
    stock: number;
    tags: string;
    images: string;
    countryOfOrigin: string;
    modelNumber: string;
    minimumOrderQuantity: number;
    isPrivateLabeling: boolean;
    isSampleAvailabe: boolean;
    dimensions: {
        length: number;
        width: number;
        height: number;
        weight: number;
    };
    category: string;
    subcategory?: string;
    seller: string;
    isActive: boolean;
}
