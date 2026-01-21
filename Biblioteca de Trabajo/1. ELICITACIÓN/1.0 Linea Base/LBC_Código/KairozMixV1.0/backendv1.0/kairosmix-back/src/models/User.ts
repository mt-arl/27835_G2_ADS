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
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);