import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
    cedula: string;
    nombre: string;
    correo: string;
    telefono: string;
    direccion: string;
    isActive: boolean;
}

const ClientSchema: Schema = new Schema({
    cedula: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },
    nombre: { 
        type: String, 
        required: true,
        trim: true
    },
    correo: { 
        type: String, 
        required: true,
        trim: true,
        lowercase: true
    },
    telefono: { 
        type: String, 
        required: true,
        trim: true
    },
    direccion: { 
        type: String, 
        required: true,
        trim: true
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, {
    timestamps: true  // Crea automáticamente createdAt y updatedAt
});

export default mongoose.model<IClient>('Client', ClientSchema);
