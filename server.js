// padrao mvc = models, views e controllers
require('dotenv').config()
const express = require('express')
const port = process.env.PORT || 3333
const app = express()
const { default: mongoose } = require('mongoose')
mongoose.connect(process.env.CONNECTIONSTRING)
.then(() => {
    console.log('DataBase Connected')
    app.emit('dataBase')
})
.catch(e => console.log(e))

const session = require('express-session') // indentificar navegador cliente por cookies
const MongoStore = require('connect-mongo')//(session)  //sessoes salvas no banco dados
const flash = require('connect-flash') // mensagens autodestrutivas // so funciona com sessao
const routes = require('./routes') // rotas
const path = require('path') // caminhos
const helmet = require('helmet') // recomendaçao //ler documentaçao
const csrf = require('csurf') // csrf = tokens para formularios // obrigatorio //segurança
const { middlewareGlobal, checkcsrferror, csrMiddleware } = require('./src/middlewares/middleware')

app.use(helmet()) // usar helmet()

app.use(express.urlencoded({extended: true})) // postar form para dentro da aplicaçao
app.use(express.json()) // parse de json
app.use(express.static(path.resolve(__dirname, 'public'))) // arquivos estáticos (img, css, js)

const sessionOptions = session({ // config session
    secret: 'askodjiyfdygdlm',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
})


app.use(sessionOptions)
app.use(flash())

app.set('views', path.resolve(__dirname, 'src', 'views')) // caminhos do ejs //arquivos que renderizam na tela;  
app.set('view engine', 'ejs') // engine para renderizar o html   (tem ejs, ....)


app.use(csrf())
//nossos prprios middlewares
app.use(middlewareGlobal)
app.use(checkcsrferror)
app.use(csrMiddleware)
app.use(routes) // chamando rotas


app.on('dataBase', () => {
    app.listen(port, () => {
        console.log('Server Is Running')
    })
})
