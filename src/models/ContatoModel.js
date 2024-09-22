const mongoose = require('mongoose')
const validator = require('validator')
// const bcryptjs = require('bcryptjs') // Módulo comentado, você pode descomentar se for usar criptografia, como senhas.

const ContatoSchema = new mongoose.Schema({
    nome: { type: String, required: true }, // 'nome' é obrigatório
    sobrenome: { type: String, required: false, default: '' }, // 'sobrenome' é opcional com valor padrão vazio
    email: { type: String, required: false, default: '' }, // 'email' é opcional com valor padrão vazio
    telefone: { type: String, required: true }, // 'telefone' é obrigatório
    createAt: { type: Date, default: Date.now } // Data de criação do documento
})

// Cria o modelo baseado no esquema 'ContatoSchema', o nome da coleção será 'contatos' no banco de dados.
const ContatoModel = mongoose.model('Contato', ContatoSchema)

function Contato(body) {
    this.body = body // Dados fornecidos no corpo da requisição
    this.errors = [] // Array para armazenar mensagens de erro de validação
    this.contato = null // Inicialmente, o contato será nulo
}


// Método para registrar um novo contato
Contato.prototype.register = async function() {
    this.valida() // Chama o método de validação

    // Se houver erros de validação, o processo de registro é interrompido
    if (this.errors.length > 0) return
    
    // Cria um novo contato no banco de dados com os dados validados
    this.contato = await ContatoModel.create(this.body)
}

// Método de validação dos dados de entrada
Contato.prototype.valida = function()  {
    this.cleanUp() // Limpa os dados antes de validar

    // Validação do email: se for fornecido, deve ser válido
    if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Email Inválido')
        if (!this.body.nome) this.errors.push('O nome é obrigatório') // Verifica se o nome foi fornecido
    // Verifica se ou o email ou o telefone foram fornecidos
    if (!this.body.email && !this.body.telefone) { // se nao for enviado o email e  o telefone
        this.errors.push('É necessário fornecer um email ou um número de telefone')
    }
}

// Método para limpar os dados recebidos, garantindo que sejam strings
Contato.prototype.cleanUp = function() {
    // Itera por todas as propriedades do 'body'
    for (const key in this.body) {
        // Se o valor da propriedade não for string, converte para string vazia
        if (typeof this.body[key] !== 'string') {
            this.body[key] = ''
        }
    }
    
    // Redefine o 'body' apenas com os campos necessários
    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone,
    }
}

Contato.prototype.edit = async function(id){
    if(typeof id !== "string") return
    this.valida()
    if(this.errors.lenght > 0) return
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true })
}

// Método estático para buscar um contato por ID
Contato.buscaPorId = async function(id) {
    if (typeof id !== 'string') return // Se o ID não for uma string, retorna sem fazer nada
    const contato = await ContatoModel.findById(id) // Busca o contato no banco pelo ID
    return contato // Retorna o resultado da busca
}

Contato.buscaContatos = async function(){
    const contato = await ContatoModel.find() // Busca o contato no banco pelo ID
        .sort({ createAt: -1 })
    return contato // Retorna o resultado da busca
}

Contato.delete = async function(id){
    if(typeof id !== "string") return // Se o id nâo for uma string: retorne
    const contato = await ContatoModel.findOneAndDelete({_id: id}) // Busca o contato no banco pelo ID
    return contato // Retorna o resultado da busca
}

// Exporta a classe Contato para ser usada em outros módulos
module.exports = Contato
