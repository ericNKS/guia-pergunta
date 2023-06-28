const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const conn = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require("./database/Resposta");

// database

conn
.authenticate()
.then(()=>{
    console.log("conexao feita com o db");
})
.catch((error)=>{
    console.log(error);
})


app.set("view engine", "ejs");

app.use(express.static('Public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res)=>{
    Pergunta.findAll({raw: true, order: [
        ['createdAt', 'DESC'] // ASC = Crescente || DESC = Decrescente
    ]}).then((perguntas)=>{
        res.render('index', {perguntas: perguntas})
    });
});

app.get('/perguntar', (req, res)=>{
    res.render("perguntar");
});
app.post('/salvarpergunta', (req, res)=>{
    let titulo = req.body.titulo;
    let descricao = req.body.descricao;

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect('/')
    });
});

app.get('/pergunta/:id', (req,res)=>{
    let id = req.params.id;

    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta=>{
        if(pergunta != undefined){ // Pergunta encontrada

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ['createdAt', 'DESC']
                ]
            }).then(respostas=>{
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });

        }else{ // Nao encontrada
            res.redirect("/");
        }
    });

app.post("/responder", (req, res)=>{
    let corpo = req.body.corpo;
    let perguntaId = req.body.perguntaId;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect(`/pergunta/${perguntaId}`)
    });

});

});

app.listen("8000");