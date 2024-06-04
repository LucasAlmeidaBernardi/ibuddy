import mongoose from "mongoose";

const CachorroSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false },
    idade: { type: Number, required: true },
    peso: { type: Number, required: false },
    altura: { type: Number, required: false },
    raca: { type: String, required: false },
    dataNascimento: { type: Date, required: false },
    sexo: { type: String, enum: ['femea', 'macho'], required: true },
    origem: { type: String, required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }  
});

const Cachorro = mongoose.model('Cachorro', CachorroSchema);

export default Cachorro;
