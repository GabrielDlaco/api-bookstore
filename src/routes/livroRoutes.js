import { Router } from "express";
import { cadastrarLivro, listarTodosLivros } from "../controllers/livroController.js";

const router = Router();
//http://localhost:3333/api/livros
router.post("/", cadastrarLivro)
router.get("/", listarTodosLivros)

export default router;
