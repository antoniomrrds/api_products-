const {Sequelize} = require('sequelize')


const connection =  new Sequelize('nome do banco de dados','usuario','senha',{
    host:'',
    dialect:'mysql',
    timezone:'-03:00'
})

module.exports = connection;
