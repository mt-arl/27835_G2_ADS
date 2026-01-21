import mongoose, { Schema, Document } from 'mongoose';

// Sub-interfaz para los items
interface IOrderItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
    priceAtPurchase: number;
}

// Interfaz Principal
export interface IOrder extends Document {
    client: mongoose.Types.ObjectId;
    items: IOrderItem[];
    total: number;
    status: 'pendiente' | 'pagado' | 'despachado' | 'cancelado';
}

const OrderSchema: Schema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    items: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        priceAtPurchase: { type: Number, required: true }
    }],
    total: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pendiente', 'pagado', 'despachado', 'cancelado'], 
        default: 'pendiente' 
    }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);