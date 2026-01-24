import mongoose, { Schema, Document } from 'mongoose';

interface IOrderItem {
    product?: mongoose.Types.ObjectId;    // Opcional
    customMix?: mongoose.Types.ObjectId;  // Opcional (NUEVO)
    quantity: number;      // Unidades (ej: 2 bolsas de esa mezcla)
    priceAtPurchase: number;
}

export interface IOrder extends Document {
    client: mongoose.Types.ObjectId;
    items: IOrderItem[];
    total: number;
    status: 'pendiente' | 'pagado' | 'en proceso' | 'despachado' | 'completado' | 'cancelado';
}

const OrderSchema: Schema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },   // Ya no es required true
        customMix: { type: Schema.Types.ObjectId, ref: 'CustomMix' }, // Referencia a la mezcla
        quantity: { type: Number, required: true, min: 1 },
        priceAtPurchase: { type: Number, required: true }
    }],
    total: { type: Number, required: true },
    status: { type: String, 
        // Asegúrate que el enum de Mongoose coincida con TypeScript
        enum: ['pendiente', 'pagado', 'en proceso', 'despachado', 'completado', 'cancelado'],
        default: 'pendiente' }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);