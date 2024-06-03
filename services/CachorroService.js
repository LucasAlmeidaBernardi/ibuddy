import Cachorro from "../models/Cachorro.js";

const CachorroService = {
    Create: async (nome, sobrenome, idade, peso, altura, raca, dataNascimento, sexo, origem, userId) => {
        const cachorro = new Cachorro({
            nome,
            sobrenome,
            idade,
            peso,
            altura,
            raca,
            dataNascimento,
            sexo,
            origem,
            user: userId  // Associa o cachorro ao usuário
        });
        return await cachorro.save();
    },
    SelectAll: async (userId) => {
        return await Cachorro.find({ user: userId });  // Busca cachorros pelo usuário
    },
    SelectOne: async (id) => {
        return await Cachorro.findById(id);
    },
    Update: async (id, nome, sobrenome, idade, peso, altura, raca, dataNascimento, sexo, origem) => {
        return await Cachorro.findByIdAndUpdate(id, {
            nome,
            sobrenome,
            idade,
            peso,
            altura,
            raca,
            dataNascimento,
            sexo,
            origem
        }, { new: true });
    },
    Delete: async (id) => {
        return await Cachorro.findByIdAndDelete(id);
    }
};
export default CachorroService;
