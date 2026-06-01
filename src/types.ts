// Shared TypeScript definitions for the Private Son Hotpack application

export interface Inquiry {
  id: string;
  senderName: string;
  email: string;
  phone: string;
  productName: string;
  quantity: number;
  message: string;
  status: "pending" | "reviewing" | "replied" | "completed";
  createdAt: string;
  notes?: string; // Admin notes
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  duration: string;
  maxTemp: string;
  avgTemp: string;
  sizeWeight: string;
  description: string;
  tags: string[];
  features: string[];
  imageUrl: string;
}

export type MenuSection = "hero" | "brand" | "products" | "inquiry";
