const express = require('express')
const connection = require('./database/database')
const app = express()
const cors = require('cors')
const  ProductsController = require('./products/ProductsController')


connection 
    .authenticate()
    .then(_ => console.log('Conexao bem sucedida'))
    .catch(err => console.log('Ops houve um erro !!! ' + err))

app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json());

app.use('/',ProductsController);

const PORT = 2000

app.listen(PORT ,_=> console.log(`O Servidor esta sendo executado na porta: ${PORT} !!!`) )