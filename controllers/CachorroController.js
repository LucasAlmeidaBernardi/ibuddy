import express from "express";
import CachorroService from "../services/CachorroService.js";
import Auth from "../middleware/Auth.js";
import UserService from "../services/UserService.js";
const router = express.Router();

router.get("/cachorros", Auth, async (req, res) => {
    try {
        const cachorros = await CachorroService.SelectAll(req.session.user.id);  // Filtra pelo usuário
        const user = req.session.user; // Adiciona o objeto de usuário à variável user
        res.render("cachorros", { user, cachorros }); // Passa user e cachorros como objetos para o template
    } catch (err) {
        console.log(err);
        res.status(500).send("Erro ao buscar cachorros");
    }
});

router.get("/cachorros/new", Auth, (req, res) => {
    res.render("cachorroForm", { cachorro: null });
});

router.post("/cachorros/new", Auth, async (req, res) => {
    try {
        await CachorroService.Create(
            req.body.nome,
            req.body.sobrenome,
            req.body.idade,
            req.body.peso,
            req.body.altura,
            req.body.raca,
            req.body.dataNascimento,
            req.body.sexo,
            req.body.origem,
            req.session.user.id  // Passa o ID do usuário
        );
        res.redirect("/cachorros");
    } catch (err) {
        console.log(err);
        res.status(500).send("Erro ao cadastrar cachorro");
    }
});

router.get("/cachorros/delete/:id", Auth, async (req, res) => {
    const id = req.params.id;
    try {
        await CachorroService.Delete(id);
        res.redirect("/cachorros");
    } catch (err) {
        console.log(err);
        res.status(500).send("Erro ao excluir cachorro");
    }
});

router.get("/cachorros/edit/:id", Auth, async (req, res) => {
    const id = req.params.id;
    try {
        const cachorro = await CachorroService.SelectOne(id);
        res.render("cachorroForm", { cachorro });
    } catch (err) {
        console.log(err);
        res.status(500).send("Erro ao buscar cachorro");
    }
});

router.post("/cachorros/update/:id", Auth, async (req, res) => {
    try {
        await CachorroService.Update(
            req.params.id,
            req.body.nome,
            req.body.sobrenome,
            req.body.idade,
            req.body.peso,
            req.body.altura,
            req.body.raca,
            req.body.dataNascimento,
            req.body.sexo,
            req.body.origem
        );
        res.redirect("/cachorros");
    } catch (err) {
        console.log(err);
        res.status(500).send("Erro ao alterar cachorro");
    }
});

router.get("/cachorros/profile/:id", Auth, async (req, res) => {
    const cachorroId = req.params.id;
    try {
        const cachorro = await CachorroService.SelectOne(cachorroId);
        if (cachorro) {
            console.log("Cachorro encontrado:", cachorro);
            const userId = cachorro.user;
            console.log("User ID do cachorro:", userId);
            try {
                const user = await UserService.SelectById(userId); // Utilizando SelectById
                if (!user) {
                    console.log("Usuário não encontrado para o ID do usuário:", userId);
                    res.status(404).send("Usuário não encontrado.");
                    return;
                }
                console.log("Usuário encontrado:", user);
                res.render("cachorroPerfil", { cachorro, user });
            } catch (userErr) {
                console.log("Erro ao buscar usuário com ID:", userId, "Erro:", userErr);
                res.status(500).send("Erro ao buscar usuário");
            }
        } else {
            console.log("Cachorro não encontrado para o ID:", cachorroId);
            res.status(404).send("Cachorro não encontrado.");
        }
    } catch (err) {
        console.log("Erro ao buscar cachorro e/ou usuário:", err);
        res.status(500).send("Erro ao buscar cachorro");
    }
});

export default router;
