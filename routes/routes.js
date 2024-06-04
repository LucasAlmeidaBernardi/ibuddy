import express from "express";
import upload from "../multer.js"; 
import * as PictureController from "../controllers/pictureController.js";

const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
    try {
        const { name } = req.body;

        const file = req.file;
        const picture = new Picture({
            name,
            src: file.path,
        });

        await picture.save();
        res.json(picture);
    } catch (err) {
        res.status(500).json({ message: "Erro ao salvar a imagem." });
    }
});

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
