import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. La Interfaz (Tipos para TS)
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'vendedor';
    matchPassword(password: string): Promise<boolean>;
}

// 2. El Schema (Configuración para Mongo)
const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ['admin', 'vendedor'], default: 'vendedor' }
}, { timestamps: true });

// Hooks y Métodos
// Hook pre-save corregido para Async/Await
UserSchema.pre<IUser>('save', async function () { 
    // 1. Si el password no se modificó, simplemente retornamos (la promesa se resuelve)
    if (!this.isModified('password')) return; 

    // 2. Generar el hash
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // 3. No hace falta llamar a next(), al terminar la función la promesa se cumple sola.
});

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);