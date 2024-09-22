// Importa o modelo Contato que será usado para manipulação dos dados de contatos
const Contato = require('../models/ContatoModel.js')

// Controlador para renderizar a página de criação de contato
exports.index = (req, res) => {
    // Renderiza a página 'contato' com um objeto vazio para o formulário
    res.render('contato', {
        contato: {} // Envia um objeto vazio para o formulário de contato
    })
}

// Controlador para registrar um novo contato
exports.register = async (req, res) => {
    try {
        // Cria uma nova instância de Contato com os dados do corpo da requisição
        const contato = new Contato(req.body)
        await contato.register() // Chama o método 'register' para salvar o contato

        // Verifica se houve erros de validação
        if (contato.errors.length > 0) {
            // Se houver erros, usa o middleware 'flash' para armazenar as mensagens de erro
            req.flash('errors', contato.errors)
            // Salva a sessão e redireciona para a página de criação de contato
            req.session.save(() => res.redirect('/contato/index'))
            return // Encerra a execução da função
        }

        // Se o contato for salvo com sucesso, armazena uma mensagem de sucesso
        req.flash('success', 'Contact Registered: success')
        // Salva a sessão e redireciona para a página de edição do contato recém-criado
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`))
        return // Encerra a execução da função
    } catch (e) {
        // Em caso de erro, exibe o erro no console
        console.log(e)
        // Renderiza a página de erro 404
        return res.render('404')
    }
}

// Controlador para renderizar a página de edição de um contato
exports.editIndex = async (req, res) => {
    // Verifica se o ID do contato foi fornecido
    if (!req.params.id) return res.render('404') // Se não houver ID, renderiza a página 404

    // Busca o contato pelo ID
    const contato = await Contato.buscaPorId(req.params.id)

    // Se o contato não for encontrado, renderiza a página 404
    if (!contato) return res.render('404')

    // Se o contato for encontrado, renderiza a página 'contato' com os dados do contato
    res.render('contato', { contato })
}


exports.edit = async function(req, res){
    try{
    if (!req.params.id) return res.render('404') // Se não houver ID, renderiza a página 404
    const contato = new Contato(req.body)
    await contato.edit(req.params.id)
    // Verifica se houve erros de validação
    if (contato.errors.length > 0) {
        // Se houver erros, usa o middleware 'flash' para armazenar as mensagens de erro
        req.flash('errors', contato.errors)
        // Salva a sessão e redireciona para a página de criação de contato
        req.session.save(() => res.redirect('/contato/index'))
        return // Encerra a execução da função
    }

    // Se o contato for salvo com sucesso, armazena uma mensagem de sucesso
    req.flash('success', 'Contact edited: success')
    // Salva a sessão e redireciona para a página de edição do contato recém-criado
    req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`))
    return // Encerra a execução da função
    } catch(e){
        console.log(e)
        res.render('404')
    }

}

exports.delete = async function (req, res) {
     // Verifica se o ID do contato foi fornecido
     if (!req.params.id) return res.render('404') // Se não houver ID, renderiza a página 404

     // apaga o contato pelo id
     const contato = await Contato.delete(req.params.id)
 
     // Se o contato não for encontrado, renderiza a página 404
     if (!contato) return res.render('404')
 
    // Se o contato for salvo com sucesso, armazena uma mensagem de sucesso
    req.flash('success', 'Contact deleted: success')
    // Salva a sessão e redireciona para a página de edição do contato recém-criado
    req.session.save(() => res.redirect('back')) // '/contato/index'
    return // Encerra a execução da função
}
