import express from "express";
import Picture from "../models/Picture.js"; // Importe o modelo Picture

const router = express.Router();

export async function save(req, res) {
    try {
        const { name, src, user } = req.body;

        // Crie uma nova instância do modelo Picture com os dados recebidos
        const picture = new Picture({
            name,
            src,
            user
        });

        // Salve a nova imagem no banco de dados
        const savedPicture = await picture.save();

        res.status(201).json(savedPicture); // Retorna a imagem salva como resposta
    } catch (error) {
        console.error("Erro ao salvar a imagem:", error);
        res.status(500).json({ message: "Erro ao salvar a imagem" });
    }
}

router.delete("/:id", async (req, res) => {
    try {
        const picture = await Picture.findById(req.params.id);
        if (!picture) {
            return res.status(404).json({ message: "Imagem não encontrada" });
        }
        fs.unlinkSync(picture.src);
        await picture.remove();
        res.json({ message: "Imagem removida com sucesso" });
    } catch (err) {
        res.status(500).json({ message: "Erro ao remover a imagem" });
    }
});

export default router;
