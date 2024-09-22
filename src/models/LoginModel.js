const mongoose = require('mongoose') // Importa o Mongoose para modelar dados no MongoDB
const validator = require('validator') // Importa o Validator para validação de e-mails
const bcryptjs = require('bcryptjs') // Importa o Bcryptjs para hash de senhas

// Define o schema (estrutura) do login no MongoDB
const loginSchema = new mongoose.Schema({
    email: { type: String, required: true }, // Campo de e-mail, obrigatório
    password: { type: String, required: true }, // Campo de senha, obrigatório
    createadAt: {
        type: Date,
        default: Date.now // Armazena a data de criação automaticamente
    }
})

// Cria o modelo de dados com base no schema definido acima
// O primeiro parâmetro é o nome da coleção no banco de dados
const loginModel = mongoose.model('logindatabase', loginSchema)

// Classe responsável por manipular o login e registro de usuários
class LoginDatabase {
    constructor(body) {
        this.body = body // Dados recebidos (e-mail e senha)
        this.errors = [] // Array para armazenar mensagens de erro
        this.user = null // Propriedade que armazenará o usuário, se encontrado
    }

    // Método para realizar o login de um usuário
    async login() {
        this.valida() // Valida os dados de entrada (e-mail e senha)
        if (this.errors.length > 0) return // Se houver erros, encerra o método

        try {
            // Busca um usuário no banco de dados com o e-mail fornecido
            this.user = await loginModel.findOne({ email: this.body.email })
            if (!this.user) { // Se o usuário não existir, adiciona um erro
                this.errors.push('Usuário não existe.')
                return
            }

            // Compara a senha fornecida com a senha hash armazenada no banco
            const validPassword = await bcryptjs.compare(this.body.password, this.user.password)
            if (!validPassword) { // Se a senha estiver incorreta, adiciona um erro
                this.errors.push('Senha inválida')
                this.user = null // Reseta o usuário para null, já que a senha é inválida
                return
            }
        } catch (error) {
            // Caso ocorra algum erro no banco de dados, registra o erro
            this.errors.push('Erro no servidor, tente novamente mais tarde.')
            console.error(error) // Exibe o erro no console para debugging
        }
    }

    // Método para registrar um novo usuário
    async register() {
        this.valida() // Valida os dados de entrada
        if (this.errors.length > 0) return // Se houver erros, encerra o método

        await this.userExists() // Verifica se o usuário já existe no banco de dados
        if (this.errors.length > 0) return // Se o usuário já existir, encerra o método

        // Gera um salt (valor aleatório) para a criação do hash da senha
        const salt = bcryptjs.genSaltSync()
        // Cria o hash da senha com o salt
        this.body.password = bcryptjs.hashSync(this.body.password, salt)

        try {
            // Cria um novo documento no banco de dados com os dados do usuário
            this.user = await loginModel.create(this.body)
        } catch (error) {
            // Caso ocorra algum erro ao salvar no banco, registra o erro
            this.errors.push('Erro ao salvar no banco de dados.')
            console.error(error)
        }
    }

    // Verifica se o usuário (e-mail) já existe no banco de dados
    async userExists() {
        try {
            // Procura um usuário com o e-mail fornecido
            this.user = await loginModel.findOne({ email: this.body.email })
            if (this.user) this.errors.push('Usuário existente') // Se existir, adiciona um erro
        } catch (error) {
            // Caso ocorra algum erro no banco de dados, registra o erro
            this.errors.push('Erro no servidor.')
            console.error(error)
        }
    }

    // Método para validar os dados de entrada (e-mail e senha)
    valida() {
        this.cleanUp() // Limpa e normaliza os dados recebidos

        // Verifica se o e-mail é válido
        if (!validator.isEmail(this.body.email)) this.errors.push(' Email Inválido ')

        // Verifica se a senha tem entre 8 e 50 caracteres
        if (this.body.password.length < 8 || this.body.password.length > 50) {
            this.errors.push('A Senha precisa ter entre 8 e 50 caracteres ')
        }
    }

    // Método para limpar e normalizar os dados de entrada
    cleanUp() {
        // Garante que os campos email e password sejam strings
        this.body = {
            email: typeof this.body.email === 'string' ? this.body.email : '',
            password: typeof this.body.password === 'string' ? this.body.password : ''
        }
    }
}

module.exports = LoginDatabase // Exporta a classe para ser usada em outros arquivos
