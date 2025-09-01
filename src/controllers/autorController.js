import autorModel from "../models/autorModel.js";

export const cadastrarAutor = async (request, response) => {
  const { nome, biografia, data_nascimento, nacionalidade } = request.body;

  if (!nome) {
    response.status(400).json({
      erro: "Campo nome incorreto",
      mensagem: "nome não pode ser nulo",
    });
    return;
  }
  if (!biografia) {
    response.status(400).json({
      erro: "Campo biografia incorreto",
      mensagem: "biografia não pode ser nulo",
    });
    return;
  }
  if (!data_nascimento) {
    response.status(400).json({
      erro: "Campo data_nascimento incorreto",
      mensagem: "data_nascimento não pode ser nulo",
    });
    return;
  }
  if (!nacionalidade) {
    response.status(400).json({
      erro: "Campo nacionalidade incorreto",
      mensagem: "nacionalidade não pode ser nulo",
    });
    return;
  }

  // 1992-02-18
  // 25-12-2009 - 2025-30-80 Date()
  const validaData = new Date(data_nascimento);
  if (validaData == "Invalid Date") {
    response.status(400).json({
      erro: "Data inválida",
      mensagem: "Formato da data inválido",
    });
    return;
  }

  const autor = {
    nome,
    biografia,
    data_nascimento,
    nacionalidade,
  };

  try {
    const novoAutor = await autorModel.create(autor);
    response
      .status(201)
      .json({ mensagem: "Autor cadastrado com sucesso", novoAutor });
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ mensagem: "Erro interno do servidor ao cadastrar autor" });
  }
};

//:3333/autores?page=1&limit=3
// offset=3 -> 1|2|3|4|5|6|7|8|9|
///            0|1|2|3|4|5|6|7|8|
export const listarTodosAutores = async (request, response) => {
  const page = parseInt(request.query.page) || 1;
  const limit = parseInt(request.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const autores = await autorModel.findAndCountAll({
      offset,
      limit,
    });
    console.log("Total: ", autores.count);
    console.log("DAdos: ", autores.rows);

    const totalPaginas = Math.ceil(autores.count / limit);
    response.status(200).json({
      totalAutores: autores.count,
      totalPaginas,
      paginaAtual: page,
      autoresPorPagina: limit,
      autores: autores.rows,
    });
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ mensagem: "Erro interno no servidor ao listar autores" });
  }
};

//body? params? query?
export const listarAutor = async (request, response) => {
  const { id } = request.params;

  if (!id) {
    response.status(400).json({
      erro: "Parâmetro ID incorreto",
      mensagem: "O id não pode ser nulo",
    });
    return;
  }

  try {
    const autor = await autorModel.findByPk(id);

    if (!autor) {
      response.status(404).json({ mensagem: "Autor não existe!" });
      return;
    }

    response.status(200).json(autor);
  } catch (error) {
    console.log(error);
    response.status(500).json({ mensagem: "Erro interno ao buscar autor" });
  }
};

//1- Identificar autor para atualizar, 2- Receber os dados para atualizar
export const atualizarAutor = async (request, response) => {
  const id = request.params.id;
  const { nome, biografia, data_nascimento, nacionalidade } = request.body;

  if (!id) {
    response.status(400).json({
      erro: "Parâmetro ID incorreto",
      mensagem: "O id não pode ser nulo",
    });
    return;
  }

  try {
    const autorSelecionado = await autorModel.findOne({
      where: { id },
    });

    if(!autorSelecionado){
      response.status(404).json({mensagem:"Autor não encontrado"})
      return
    }

    if(nome !== undefined){
      autorSelecionado.nome = nome
    }
    if(biografia !== undefined){
      autorSelecionado.biografia = biografia
    }
    if(data_nascimento !== undefined){
      autorSelecionado.data_nascimento = data_nascimento
    }
    if(nacionalidade !== undefined){
      autorSelecionado.nacionalidade = nacionalidade
    }

    await autorSelecionado.save()
    response.status(200).json({mensagem:"Autor atualizado com sucesso!"})
  } catch (error) {
    console.log(error)
    response.stataus(500).json({mensagem:"Erro interno ao atualizar autor"})
  }
};

export const deletarAutor = async (request, response) => {
  const id = request.params.id;

  if (!id) {
    response.status(400).json({
      erro: "Parâmetro ID incorreto",
      mensagem: "O id não pode ser nulo",
    });
    return;
  }

  try {
    // V = 1, F = 0
    const deletarAutor = await autorModel.destroy({
      where: {id}
    })

    if(deletarAutor === 0){
      response.status(404).json({mensagem:"Autor não encontrado"})
      return
    }

    response.status(204).send()

  } catch (error) {
    console.log(error)
    response.status(500).json({mensagem:"Erro interno ao excluir"})
  }
}