// Importa o módulo mongoose para interagir com o MongoDB
const mongoose = require('mongoose')

// Define o esquema para o modelo 'Home'
const HomeSchema = new mongoose.Schema({
    titulo: { type: String, required: true }, // 'titulo' é um campo obrigatório do tipo String
    descricao: String // 'descricao' é um campo opcional do tipo String
})

// Cria o modelo baseado no esquema 'HomeSchema' e o associa à coleção 'homedatabase' no MongoDB
const HomeModel = mongoose.model('homedatabase', HomeSchema)

// Define uma classe chamada 'homedatabase'
// Atualmente, a classe está vazia e não possui métodos ou propriedades adicionais
class homedatabase  {

}

// Exporta a classe 'homedatabase' para que possa ser usada em outros módulos
module.exports = homedatabase
