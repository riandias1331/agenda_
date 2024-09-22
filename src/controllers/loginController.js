const Login = require("../models/LoginModel")

// Renderiza a página de login ou a página de usuário conectado, dependendo da sessão
exports.index = (req, res) => {
    console.log(req.session.user)  // Verifica se o usuário está na sessão
    if(req.session.user) return res.render('login-connected')  // Se o usuário estiver logado, redireciona para a página de login conectado
    return res.render('login')  // Caso contrário, renderiza a página de login
}

// Função de registro de usuário
exports.register = async (req, res) => {
    console.log(req.body)
    try {
        // Cria uma nova instância de Login com os dados enviados no body
        const login = new Login(req.body)
        await login.register()  // Chama o método de registro

        // Verifica se houve erros no processo de registro
        if (login.errors.length > 0) {
            req.flash('errors', login.errors)  // Exibe as mensagens de erro
            req.session.save(() => res.redirect('/login/index'))  // Salva a sessão e redireciona para a página de login
            return
        }

        // Se o registro for bem-sucedido, exibe uma mensagem de sucesso
        req.flash('success', 'Seu usuário foi criado com sucesso')
        req.session.save(() => res.redirect('/login/index'))  // Salva a sessão e redireciona para a página de login

    } catch (e) {
        console.log(e)  // Exibe o erro no console
        return res.render('404')  // Em caso de erro, renderiza a página 404
    }
}

// Função de login de usuário
exports.login = async (req, res) => {
    try {
        console.log(req.body)  // Verifica se os dados de login estão sendo enviados corretamente
        const login = new Login(req.body)  // Cria uma instância de Login com os dados do body
        await login.login()  // Chama o método de login

        // Verifica se houve erros no processo de login
        if (login.errors.length > 0) {
            req.flash('errors', login.errors)  // Exibe as mensagens de erro
            req.session.save(() => res.redirect('/login/index'))  // Salva a sessão e redireciona para a página de login
            return
        }

        // Se o login for bem-sucedido, exibe uma mensagem de sucesso e armazena o usuário na sessão
        req.flash('success', 'Você entrou no Sistema.')
        req.session.user = login.user  // Salva o usuário na sessão
        req.session.save(() => res.redirect('/login/index'))  // Salva a sessão e redireciona para a página de login

    } catch (e) {
        console.log(e)  // Exibe o erro no console
        return res.render('404')  // Em caso de erro, renderiza a página 404
    }
}

// Função de logout do usuário
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')  // Destrói a sessão e redireciona para a página inicial
    })
}
