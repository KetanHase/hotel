export interface Book {
    id: number;
    name: string;
    price: number;
    author: string;
    stock: number;
    category_id?: number;
    category_name: string;
    language_id?: number;
    language_name: string;
    price_category: string; 
    status: string;
    imageFile?: string;
  }
  

  