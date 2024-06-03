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
// Iniciando o Express
const app = express(); 

// Configurando o express-session
app.use(session({
    secret: "ibuddy",
    cookie: { maxAge: 3600000 },
    saveUninitialized: false,
    resave: false
}));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.locals.moment = moment;

// Iniciando conexão com o banco de dados do MongoDB
mongoose.connect("mongodb://localhost:27017/ibuddy", { useNewUrlParser: true, useUnifiedTopology: true });

// Define o EJS como renderizador de páginas
app.set('view engine', 'ejs');
// Define o uso da pasta "public" para uso de arquivos estáticos
app.use(express.static('public'));
app.use("/uploads", express.static('uploads'));

// Definindo o uso das rotas dos Controllers
app.use("/", CachorroController);
app.use("/", UsersController);

// Rotas livres de autenticação
app.get("/login", (req, res) => res.render("login"));
app.get("/cadastro", (req, res) => res.render("cadastro"));
app.get("/createUser", (req, res) => res.render("createUser"));
app.get("/", (req, res) => res.render("index"));

// Rotas protegidas
app.get("/home", Auth, (req, res) => {
    console.log("User passed to view:", req.user); // Log para debug
    res.render("home", { user: req.user });
});
app.get("/cachorro", Auth, (req, res) => res.render("cachorro", { user: req.user }));
app.get("/perfil", Auth, async (req, res) => {
    try {
        // Aqui você obtém o usuário logado, suponho que esteja armazenado em req.session.user
        const user = req.session.user;

        // Aqui você obtém as imagens correspondentes ao usuário, ajuste este trecho de acordo com a lógica do seu aplicativo
        const pictures = await Picture.find({ userId: user.id });

        // Renderiza o perfil do usuário passando tanto user quanto pictures para o modelo EJS
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
    // Limpa as informações de autenticação do usuário
    req.session.destroy((err) => {
        if (err) {
            console.log("Erro ao encerrar sessão:", err);
            res.status(500).send("Erro ao encerrar sessão");
        } else {
            console.log("Sessão encerrada com sucesso.");
            // Redireciona o usuário para a página inicial após o logout
            res.redirect("/");
        }
    });
});
//imagens
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
  
  // Rota para lidar com o envio de imagens
  app.post("/uploads", upload.single("imagem"), (req, res) => {
    // Aqui você pode processar a imagem conforme necessário
    res.redirect("/perfil");
  });
// Inicia o servidor na porta 8080
app.listen(8080, (erro) => {
    if (erro) {
        console.log("Ocorreu um erro!");
    } else {
        console.log("Servidor iniciado com sucesso!");
    }
});
