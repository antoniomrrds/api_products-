const Products = require('./Products')
const express = require('express')
const router = express.Router();
const validation = require('../validation/validation')
const {empty } = validation()

router.get('/products',(req,res)=>{
    res.send('Seja bem vindo !!!')
})

router.post('/product',(req,res)=>{
    const {nome_produto, fabricante,quantidade_estoque,valor  } = req.body;

    const product = {
        nome_produto: nome_produto,
        fabricante: fabricante,
        quantidade_estoque: quantidade_estoque,
        valor:valor
    }
   const keysProduct =  Object.keys(product)
   const productData = keysProduct.every(data => product[data] != undefined);
   if(productData){
    const dataProduct = keysProduct.some(el => empty(product[el]))
    if(dataProduct){
        res.sendStatus(400)
    }else{
        Products.create({
            nome_produto: nome_produto,
            fabricante: fabricante,
            quantidade_estoque: quantidade_estoque,
            valor:valor

        })
        .then(_=> res.sendStatus(201))
        .catch(err=>{
            console.log(err)
            res.sendStatus(404)
        })

    }
   }else{
       res.sendStatus(400)
   }

})
module.exports = router