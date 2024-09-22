// Middleware global para configurar variáveis locais de resposta e mensagens de flash
exports.middlewareGlobal = (req, res, next) => {
    // Adiciona as mensagens de erro armazenadas na sessão (flash) à resposta local
    res.locals.errors = req.flash('errors')
    // Adiciona as mensagens de sucesso armazenadas na sessão (flash) à resposta local
    res.locals.success = req.flash('success')
    // Adiciona o usuário da sessão (se houver) à resposta local
    res.locals.user = req.session.user
    // Passa o controle para o próximo middleware ou rota
    next()
}

// Middleware para tratar erros relacionados ao CSRF (Cross-Site Request Forgery)
exports.checkcsrferror = (err, req, res, next) => {
    // Verifica se há um erro
    if (err) {
        // Se houver um erro, renderiza a página 404
        return res.render('404')
    }
    // Se não houver erro, passa o controle para o próximo middleware ou rota
    next()
}

// Middleware para fornecer o token CSRF para proteção contra ataques CSRF
exports.csrMiddleware = (req, res, next) => {
    // Adiciona o token CSRF à resposta local para ser usado nas visualizações
    res.locals.csrfToken = req.csrfToken()
    // Passa o controle para o próximo middleware ou rota
    next()
}

// Middleware para garantir que o usuário esteja autenticado
exports.loginRequired = (req, res, next) => {
    // Verifica se há um usuário na sessão
    if (!req.session.user) {
        // Se não houver usuário autenticado, adiciona uma mensagem de erro e redireciona para a página inicial
        req.flash('errors', 'Você precisa fazer login.')
        req.session.save(() => res.redirect('/'))
        return // Encerra a execução do middleware
    }
    // Se houver um usuário, passa o controle para o próximo middleware ou rota
    next()
}
