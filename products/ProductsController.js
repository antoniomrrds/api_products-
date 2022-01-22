const Products = require('./Products')
const express = require('express')
const router = express.Router();
const validation = require('../validation/validation');
const { Op } = require('sequelize');
const { empty } = validation()

//read
router.get('/products', (req, res) => {
    Products.findAll()
        .then(data => {
            if (data == undefined) {
                res.sendStatus(204)
            } else {
                res.statusCode = 200;
                res.json(data)
            }
        }).catch(err => {
            res.sendStatus(404);
        })

})

//read by iu

router.get('/product/:id', (req, res) => {
    const id = req.params.id
    if (isNaN(id)) {
        res.sendStatus(400)
    } else {
        Products.findOne({
            where: {
                id: id
            }
        }).then(data => {
            if (data == null) {
                res.sendStatus(204)
            } else {
                res.statusCode = 200;
                res.json(data);

            }
        }
        ).catch(err => {
            res.sendStatus(500)
        })
    }
})

//create
router.post('/product', (req, res) => {
    const { nome_produto, fabricante, quantidade_estoque, valor } = req.body;

    const product = {
        nome_produto: nome_produto,
        fabricante: fabricante,
        quantidade_estoque: quantidade_estoque,
        valor: valor
    }
    const keysProduct = Object.keys(product)
    const productData = keysProduct.every(data => product[data] != undefined);
    if (productData) {
        const dataProduct = keysProduct.some(el => empty(product[el]))
        if (dataProduct) {
            res.sendStatus(400)
        } else {
            Products.create({
                nome_produto: nome_produto,
                fabricante: fabricante,
                quantidade_estoque: quantidade_estoque,
                valor: valor

            })
                .then(_ => res.sendStatus(201))
                .catch(err => {
                    res.sendStatus(500)
                })

        }
    } else {
        res.sendStatus(400)
    }

})

//update
router.put('/product/:id', (req, res) => {
    const id = req.params.id

    if (isNaN(id)) {
        res.sendStatus(400);
    } else {

        Products.findOne({
            where: {
                id: id
            }
        })
            .then(data => {
                if (data == null) {
                    res.sendStatus(204);
                } else {
                    const { nome_produto, fabricante, quantidade_estoque, valor } = req.body;

                    const product = {
                        nome_produto: nome_produto,
                        fabricante: fabricante,
                        quantidade_estoque: quantidade_estoque,
                        valor: valor
                    }
                    const keysProduct = Object.keys(product)
                    const productData = keysProduct.every(data => product[data] != undefined);
                    if (productData) {
                        const dataProduct = keysProduct.some(el => empty(product[el]))
                        if (dataProduct) {
                            res.sendStatus(400)
                        } else {

                            Products.update({
                                nome_produto: nome_produto,
                                fabricante: fabricante,
                                quantidade_estoque: quantidade_estoque,
                                valor: valor

                            }, {
                                where: {
                                    id: id

                                }
                            })
                                .then(_ => {
                                    res.sendStatus(200);
                                })
                                .catch(_ => res.sendStatus(500))

                        }
                    } else {
                        res.sendStatus(400)
                    }
                }
            })

            .catch(_ => res.sendStatus(500))

    }
})

//delete
router.delete('/product/:id', (req, res) => {
    const id = req.params.id
    if (isNaN(id)) {
        res.sendStatus(400);
    } else {
        Products.destroy({
            where: {
                id: id
            }
        })
            .then(_ => res.sendStatus(200))
            .catch(_ => res.sendStatus(500))
    }
})


// total products

router.get('/products/theAmount',async (req, res) => {
    try{
        const theAmount = await Products.findAndCountAll();
            res.statusCode = 200;
            res.json(theAmount.count)
    }catch(err){
        res.sendStatus(500)
    } 
})

//
router.get('/products/lowerStock', async (req,res) =>{
    try{
        const lower = await Products.min('quantidade_estoque');
        console.log(lower)
        const stock = await Products.findOne({
            where:{
                quantidade_estoque:lower
            }
        })
        if(stock == null){
            res.sendStatus(204)
        }else{
            res.statusCode = 200;
            res.send(stock)
        }
      
    }catch(err){
         res.sendStatus(500)
    }
})



router.get('/products/lowerStock', async (req,res) =>{
    try{
        const lower = await Products.min('quantidade_estoque');
        const stock = await Products.findOne({
            where:{
                quantidade_estoque:lower
            }
        })
        if(stock == null){
            res.sendStatus(204)
        }else{
            res.statusCode = 200;
            res.send(stock)
        }
      
    }catch(err){
         res.sendStatus(500)
    }
})


router.get('/products/biggerStock', async (req,res) =>{
    try{
        const bigger = await Products.max('quantidade_estoque');
        const stock = await Products.findOne({
            where:{
                quantidade_estoque:bigger
            }
        })
        if(stock == null){
            res.sendStatus(204)
        }else{
            res.statusCode = 200;
            res.send(stock)
        }
      
    }catch(err){
         res.sendStatus(500)
        }
    })
    
    router.get('/products/withoutStock', async (req,res)=>{
        
        try{
            const withoutStock = await Products.findAll({
                where: {
                    quantidade_estoque: {[Op.lt]:5}
                }
            })
            res.statusCode = 200;
            res.json(withoutStock)

        }catch(err){
            res.sendStatus(500)
    }

})

module.exports = router