import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    code: string;
    name: string;
    description: string;
    category: string;
    // Precios
    pricePerPound: number; // REQ: Base para cálculo de mezclas 
    retailPrice: number;
    wholesalePrice: number;
    // Inventario
    currentStock: number;
    minStock: number;
    originCountry: string; // Agregado para cumplir validación anterior
    status: string;        // Agregado para cumplir validación anterior
    // Nutrición (NUEVO - Para CU-4.4) 
    nutritionalInfo: {
        calories: number;
        protein: number;
        fat: number;
        carbs: number;
    };
}

const ProductSchema: Schema = new Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'General' },
    
    pricePerPound: { type: Number, required: true }, // Clave para la mezcla
    retailPrice: { type: Number, required: true },
    wholesalePrice: { type: Number, required: true },
    
    currentStock: { type: Number, required: true, min: 0 },
    minStock: { type: Number, default: 0 },
    originCountry: { type: String, required: true },
    status: { type: String, default: 'active' },

    // Objeto incrustado para nutrición 
    nutritionalInfo: {
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 }
    }
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', ProductSchema);