const {Sequelize} = require('sequelize')


const connection =  new Sequelize('api_products','scorpion','Reis23101996',{
    host:'10.0.0.138',
    dialect:'mysql',
    timezone:'-03:00'
})

module.exports = connection;