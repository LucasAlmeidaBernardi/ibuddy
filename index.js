import express from "express"; 
import mongoose from "mongoose";
import session from "express-session";
import Auth from "./middleware/Auth.js";
import CachorroController from "./controllers/CachorroController.js";
import UsersController from "./controllers/UsersController.js";
import moment from "moment";
import Picture from "./models/Picture.js"; 
import pictureRoutes from "./routes/routes.js";
import multer from "multer";

const app = express(); 


app.use(session({
    secret: "ibuddy",
    cookie: { maxAge: 3600000 },
    saveUninitialized: false,
    resave: false
}));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.locals.moment = moment;

mongoose.connect("mongodb://localhost:27017/ibuddy", { useNewUrlParser: true, useUnifiedTopology: true });


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use("/uploads", express.static('uploads'));

app.use("/", CachorroController);
app.use("/", UsersController);

app.get("/login", (req, res) => res.render("login"));
app.get("/cadastro", (req, res) => res.render("cadastro"));
app.get("/createUser", (req, res) => res.render("createUser"));
app.get("/", (req, res) => res.render("index"));

app.get("/home", Auth, (req, res) => {
    console.log("User passed to view:", req.user); 
    res.render("home", { user: req.user });
});
app.get("/cachorro", Auth, (req, res) => res.render("cachorro", { user: req.user }));
app.get("/perfil", Auth, async (req, res) => {
    try {
        const user = req.session.user;

        const pictures = await Picture.find({ userId: user.id });

        res.render("perfil", { user, pictures });
    } catch (err) {
        console.log(err);
        res.status(500).send("Erro ao carregar o perfil do usuário");
    }
});
app.get("/cachorroForm", Auth, (req, res) => res.render("cachorroForm", { user: req.user }));
app.get("/cachorroPerfil", Auth, (req, res) => {res.render("cachorroPerfil", { user: req.user })});
app.get("/editar", Auth, (req, res) => res.render("editar", { user: req.user }));
app.get("/alterarSenha", Auth, (req, res) => res.render("alterarSenha", { user: req.session.user }));
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Erro ao encerrar sessão:", err);
            res.status(500).send("Erro ao encerrar sessão");
        } else {
            console.log("Sessão encerrada com sucesso.");
            res.redirect("/");
        }
    });
});
app.get("/uploads", Auth, (req, res) => res.render("uploads", { user: req.user }));
app.use("/uploads", express.static("uploads"));

app.use("/api/pictures", pictureRoutes);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
  
  app.post("/uploads", upload.single("imagem"), (req, res) => {
    res.redirect("/perfil");
  });
app.listen(8080, (erro) => {
    if (erro) {
        console.log("Ocorreu um erro!");
    } else {
        console.log("Servidor iniciado com sucesso!");
    }
});
