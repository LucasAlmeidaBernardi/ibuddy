import User from "../models/User.js"; 

class UserService {
    static async SelectOne(email) {
        return User.findOne({ email });
    }

    static async SelectById(id) {
        try {
            const user = await User.findById(id);
            console.log("User found:", user); 
            return user;
        } catch (error) {
            console.error("Erro ao buscar usuário por ID:", error);
            throw error;
        }
    }

    static async Create(email, password, nome, sobrenome, dataNascimento, regiao, telefone) {
        try {
            const newUser = new User({
                email: email,
                password: password,
                nome: nome,
                sobrenome: sobrenome,
                dataNascimento: dataNascimento,
                regiao: regiao,
                telefone: telefone
            });
            await newUser.save();
            return newUser;
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            throw error;
        }
    }

    static async Update(id, updateData) {
        return User.findByIdAndUpdate(id, updateData, { new: true });
    }

    static async UpdatePassword(id, newPassword) {
        return User.findByIdAndUpdate(id, { password: newPassword }, { new: true });
    }
}

export default UserService;
