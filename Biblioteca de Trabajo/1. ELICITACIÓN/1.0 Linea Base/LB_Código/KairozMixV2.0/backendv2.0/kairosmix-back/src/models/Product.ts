import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    code: string;
    name: string;
    pricePerPound: number;
    wholesalePrice: number;
    retailPrice: number;
    originCountry: string;
    initialStock: number;
    currentStock: number;
    imageUrl?: string;
    isActive: boolean;
}

const ProductSchema: Schema = new Schema({
    code: { type: String, unique: true },
    name: { type: String, required: true },
    pricePerPound: { type: Number, required: true },
    wholesalePrice: { type: Number, required: true },
    retailPrice: { type: Number, required: true },
    originCountry: { type: String, required: true },
    initialStock: { type: Number, required: true },
    currentStock: { type: Number, required: true },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema);