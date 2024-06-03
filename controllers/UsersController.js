import express from "express";
import bcrypt from "bcrypt";
import UserService from "../services/UserService.js";
import Auth from "../middleware/Auth.js"; 
const router = express.Router();

// ROTA DE LOGIN
router.get("/login", (req, res) => {
    res.render("login", {
        loggedOut: true
    });
});

// ROTA DE LOGOUT
router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

// ROTA DE AUTENTICAÇÃO
router.post("/authenticate", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await UserService.SelectOne(email);
        if (user != null) {
            const correct = bcrypt.compareSync(password, user.password);
            if (correct) {
                req.session.user = {
                    id: user._id.toString(), // Convertendo para string para garantir compatibilidade
                    email: user.email,
                    nome: user.nome,
                    sobrenome: user.sobrenome,
                    dataNascimento: user.dataNascimento,
                    regiao: user.regiao,
                    telefone: user.telefone
                };
                res.redirect("/home");
            } else {
                res.send(`Senha inválida! <br><a href="/login">Tentar novamente.</a>`);
            }
        } else {
            res.send(`Usuário não existe. <br><a href="/login">Tentar novamente.</a>`);
        }
    } catch (error) {
        console.error("Erro ao autenticar usuário:", error);
        res.status(500).send("Erro ao autenticar usuário.");
    }
});

// ROTA DE CADASTRO
router.get("/cadastro", (req, res) => {
    res.render("cadastro", {
        loggedOut: true
    });
});

// ROTA DE CRIAÇÃO DE USUÁRIO NO BANCO
router.post("/createUser", (req, res) => {
    const { email, password, nome, sobrenome, dataNascimento, regiao, telefone } = req.body;

    console.log("Received data:", req.body);  // Verifica se os dados estão sendo recebidos

    if (!password) {
        return res.status(400).send("Senha é obrigatória.");
    }

    UserService.SelectOne(email)
        .then(user => {
            if (user == undefined) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                UserService.Create(email, hash, nome, sobrenome, dataNascimento, regiao, telefone)
                    .then(() => res.redirect("/login"))
                    .catch(error => {
                        console.error("Erro ao criar usuário:", error);
                        res.status(500).send("Erro ao criar usuário.");
                    });
            } else {
                res.send(`Usuário já cadastrado! <br><a href="/cadastro">Tentar novamente.</a>`);
            }
        })
        .catch(error => {
            console.error("Erro ao verificar usuário:", error);
            res.status(500).send("Erro ao verificar usuário.");
        });
});

// ROTA DE EDIÇÃO (EXIBIR FORMULÁRIO)
router.get("/editar/:id", (req, res) => {
    const userId = req.params.id;
    UserService.SelectById(userId)
        .then(user => {
            if (user) {
                res.render("editar", { user });
            } else {
                res.status(404).send("Usuário não encontrado.");
            }
        })
        .catch(error => {
            console.error("Erro ao buscar usuário:", error);
            res.status(500).send("Erro ao buscar usuário.");
        });
});

// ROTA DE EDIÇÃO (ATUALIZAR DADOS)
router.post("/editar/:id", (req, res) => {
    const userId = req.params.id;
    const { email, nome, sobrenome, dataNascimento, regiao, telefone } = req.body;

    UserService.Update(userId, { email, nome, sobrenome, dataNascimento, regiao, telefone })
        .then(() => res.redirect("/home"))
        .catch(error => {
            console.error("Erro ao atualizar usuário:", error);
            res.status(500).send("Erro ao atualizar usuário.");
        });
});

router.post("/alterarSenha", Auth, async (req, res) => {
    const userId = req.session.user.id;
    const { senhaAtual, novaSenha } = req.body;

    try {
        const user = await UserService.SelectById(userId);
        if (user) {
            const correct = bcrypt.compareSync(senhaAtual, user.password);
            if (correct) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(novaSenha, salt);
                await UserService.UpdatePassword(userId, hash);
                res.redirect("/home");
            } else {
                res.send(`Senha atual inválida! <br><a href="/alterarSenha">Tentar novamente.</a>`);
            }
        } else {
            res.status(404).send("Usuário não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao alterar senha:", error);
        res.status(500).send("Erro ao alterar senha.");
    }
});

router.get("/perfil", Auth, async (req, res) => {
    const userId = req.session.user.id;

    try {
        const user = await UserService.SelectById(userId);
        if (user) {
            res.render("perfil", { user });
        } else {
            res.status(404).send("Usuário não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao buscar perfil do usuário:", error);
        res.status(500).send("Erro ao buscar perfil do usuário.");
    }
});
router.get('/cachorros', Auth, (req, res) => {
    const user = req.user; // Pegando o usuário autenticado a partir do middleware
    res.render('cachorros', { user });
});
export default router;
