import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nome: { type: String, required: true },
    sobrenome: { type: String, required: true },
    dataNascimento: { type: Date, required: true },
    regiao: { type: String, required: true },
    telefone: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

export default User;
