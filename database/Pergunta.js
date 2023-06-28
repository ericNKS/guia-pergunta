const Sequelize = require("sequelize");
const conn = require('./database');

const Pergunta = conn.define("pergunta", {
    titulo: {
        type: Sequelize.STRING,
        alloNull: false
    },
    descricao:{
        type: Sequelize.TEXT,
        alloNull: false,
    }
    
},{});

Pergunta.sync({force: false}).then(()=>{});

module.exports = Pergunta;