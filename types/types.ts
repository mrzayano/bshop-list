// types/types.ts

export interface Price {
  amount: number;
  unit: string;
  quantity?: number; // Optional quantity for the price
}

export interface Product {
  id: number;
  names: string[]; // An array of names in different languages
  prices: Price[];  // An array of price objects
  imageurl: string; // An array of image URLs
}


