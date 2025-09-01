import autorModel from "./autorModel.js";
import livroModel from "./livroModel.js";

//Relacionamento M:N
autorModel.belongsToMany(livroModel,{
    through:'autores_livros', //Qual nome da tabela associativa
    foreignKey: 'autor_id',
    otherKey: 'livro_id'
});
livroModel.belongsToMany(autorModel,{
    through:'autores_livros',
    foreignKey: 'livro_id',
    otherKey: 'autor_id'
});

export { autorModel, livroModel };
