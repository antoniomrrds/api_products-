const Sequelize = require('sequelize')
const connection =  require('../database/database')

const Products = connection.define('produtos',{

    nome_produto:{
        type: Sequelize.STRING,
        allowNull:false
    },
    fabricante:{
        type:Sequelize.STRING,
        allowNull:false
    },
    quantidade_estoque:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    valor:{
        type:Sequelize.DOUBLE,
        allowNull:false
    }
}) 

Products.sync({force:false})
        .then(_=>console.log('Tabela de Produtos foi Criada'))
        .catch(err => console.log('Ops Ocorreu um erro !!! : '+ err))


module.exports = Products