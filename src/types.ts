export type ProductCategory = 'DRUG' | 'FOOD' | 'DEVICE' | 'DAILY' | 'FAVORITES' | 'HISTORY' | 'ALL';

export interface Product {
    id: string;
    name: string;
    category: ProductCategory;
    categoryLabel: string;
    permitNumber?: string;
    barcode?: string;
    description?: string;
    imageUrl?: string;
    price: number;
    isFavorite?: boolean;
    productUrl?: string;
    dmImageUrl?: string;
    manualUrl?: string;
    origin?: string;
    details?: {
        ingredients?: string;
        origin?: string;
        packSize?: string;
        usage?: string;
        precautions?: string;
        [key: string]: any;
    };
    created_at?: string;
}

export interface CompanyInfo {
    name: string;
    slogan: string;
    address: string;
    phone: string;
    email: string;
    serviceHours: string;
    lineUrl: string;
}
