import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs'; // Necesario para proteger la clave

export interface IClient extends Document {
    cedula: string;
    nombre: string;
    correo: string;
    telefono: string;
    direccion: string;
    password?: string; // Campo para el registro
    isActive: boolean;
}

const ClientSchema: Schema = new Schema({
    cedula: { type: String, required: true, unique: true, trim: true },
    nombre: { type: String, required: true, trim: true },
    correo: { type: String, required: true, unique: true, trim: true, lowercase: true },
    telefono: { type: String, required: true, trim: true },
    direccion: { type: String, required: true, trim: true },
    password: { type: String, required: true }, // Requerido para el registro
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true 
});

// Middleware para encriptar la contraseña automáticamente antes de guardar
// Middleware corregido para evitar el error "next is not a function"
ClientSchema.pre('save', async function() {
    // Si el password no ha sido modificado, salimos de la función
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    
    // NOTA: Al ser una función async, NO se usa next()
});

export default mongoose.model<IClient>('Client', ClientSchema);