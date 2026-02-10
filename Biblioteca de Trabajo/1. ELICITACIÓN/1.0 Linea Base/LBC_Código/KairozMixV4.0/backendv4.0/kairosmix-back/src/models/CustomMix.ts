import mongoose, { Schema, Document } from 'mongoose';

// Estructura de un ingrediente dentro de la mezcla 
interface IMixIngredient {
    product: mongoose.Types.ObjectId;
    productName: string; // Guardamos el nombre por si se borra el producto original
    quantityLbs: number; // Cantidad en libras
    priceAtMoment: number; // Precio al momento de crear la mezcla
}

export interface ICustomMix extends Document {
    client: mongoose.Types.ObjectId;
    name: string;
    ingredients: IMixIngredient[];
    totalPrice: number;
    totalCalories: number; // Agregado nutricional 
    totalWeight: number;   // Peso total en libras
    isSaved: boolean;      // Si el usuario decidió guardarla en su perfil [cite: 116]
}

const CustomMixSchema: Schema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    ingredients: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        productName: { type: String },
        quantityLbs: { type: Number, required: true, min: 0.1 },
        priceAtMoment: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true },
    totalCalories: { type: Number, default: 0 },
    totalWeight: { type: Number, required: true },
    isSaved: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<ICustomMix>('CustomMix', CustomMixSchema);