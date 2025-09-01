import express from "express";
import cors from "cors";
import { conn } from "./config/sequelize.js";

//Tabelas
import "./models/associations.js";

//Rotas
import autorRoutes from "./routes/autorRoutes.js";
import livroRoutes from "./routes/livroRoutes.js";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
// conn.sync({force:true})

conn
  .sync()
  .then(() => {
    console.log("Banco de dados conectado 😎");
  })
  .catch((error) => console.log(error));

//Usando as rotas
app.use("/api/autores", autorRoutes);
app.use("/api/livros", livroRoutes);

app.get("/", (request, response) => {
  response.status(200).json({ mensagem: "Olá, Mundo" });
});

export default app;
