const Products = require('./Products')
const express = require('express')
const router = express.Router();
const validation = require('../validation/validation');
const { Op } = require('sequelize');
const { empty } = validation()

//buscar todos os produtos
router.get('/products', async (req, res) => {
    try {
        const product = await Products.findAll();
       
        if (product == null || product.length == 0 ) {
            res.sendStatus(404)
        } else {
            res.statusCode = 200;
            res.json(product)
        }
    } catch (err) {
        res.sendStatus(500);
    }
})

//Buscar produto por id
router.get('/product/:id', async (req, res) => {
    const id = req.params.id
    if (isNaN(id)) {
        res.sendStatus(400)
    } else {
        try {
            const productId = await Products.findOne({ where: { id: id } })
        
            if (productId == null) {
                res.sendStatus(404)
            } else {
                res.statusCode = 200;
                res.json(productId);
            }
        } catch (err) {
            res.sendStatus(500)
        }
    }
})

//Adicionar Produto
router.post('/product', async (req, res) => {
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
            res.sendStatus(400);
        } else {
            try {
                const product = await Products.create({
                    nome_produto: nome_produto,
                    fabricante: fabricante,
                    quantidade_estoque: quantidade_estoque,
                    valor: valor
                })
                res.sendStatus(201)
            } catch (err) {
                res.sendStatus(500)
            }
        }
    } else {
        res.sendStatus(400)
    }
})

//edição de Produto
router.put('/product/:id', async (req, res) => {
    const id = req.params.id

    if (isNaN(id)) {
        res.sendStatus(400);
    } else {

        const productId = await Products.findOne({ where: { id: id } })

        if (productId == null) {
            res.sendStatus(404);
        } else {
            const { nome_produto, fabricante, quantidade_estoque, valor } = req.body;

            const product = {
                nome_produto: nome_produto,
                fabricante: fabricante,
                quantidade_estoque: quantidade_estoque,
                valor: valor
            }

            const keysProduct = Object.keys(product)
            const productNotUndefined = keysProduct.every(data => product[data] != undefined);
            if (productNotUndefined) {
                const productEmpty = keysProduct.some(el => empty(product[el]))
                if (productEmpty) {
                    res.sendStatus(400)
                } else {
                    try {
                        const editProduct = await Products.update({
                            nome_produto: nome_produto,
                            fabricante: fabricante,
                            quantidade_estoque: quantidade_estoque,
                            valor: valor
                        }, { where: { id: id } });
                        res.sendStatus(200);
                    } catch (err) {
                        res.sendStatus(500)
                    }
                }
            } else {
                res.sendStatus(400)
            }
        }

    }

})

//apagar produto
router.delete('/product/:id', async (req, res) => {
    const id = req.params.id
    if (isNaN(id)) {
        res.sendStatus(400);
    } else {
        try {
            const productId = await Products.findOne({ where: { id: id } })
            if (productId == null) {
                res.sendStatus(404)
            } else {
                const productDelete = await Products.destroy({ where: { id: id } })
                res.sendStatus(200);
            }
        } catch (err) {
            res.sendStatus(500)
        }
    }
})

// total produtos
router.get('/products/theAmount', async (req, res) => {
    try {
        const theAmount = await Products.findAndCountAll();
        res.statusCode = 200;
        res.json(theAmount.count)
    } catch (err) {
        res.sendStatus(500)
    }
})

//menor estoque
router.get('/products/lowerStock', async (req, res) => {
    try {
        const lower = await Products.min('quantidade_estoque')
        const stock = await Products.findOne({ where: { quantidade_estoque: lower } })
        if (stock == null) {
            res.sendStatus(404)
        } else {
            res.statusCode = 200;
            res.send(stock)
        }

    } catch (err) {
        res.sendStatus(500)
    }
})

//maior estoque
router.get('/products/biggerStock', async (req, res) => {
    try {
        const bigger = await Products.max('quantidade_estoque');
        const stock = await Products.findOne({ where: { quantidade_estoque: bigger } })
        if (stock == null) {
            res.sendStatus(404)
        } else {
            res.statusCode = 200;
            res.send(stock)
        }
    } catch (err) {
        res.sendStatus(500)
    }
})

//sem estoque 
router.get('/products/withoutStock', async (req, res) => {
    try {
        const withoutStock = await Products.findAll({where: {quantidade_estoque: { [Op.lt]: 5 } }})
        if(withoutStock == null || withoutStock.length == 0){
            res.sendStatus(404)
        }else{
            res.statusCode = 200;
            res.json(withoutStock)
        }
    } catch (err) {
        res.sendStatus(500)
    }

})

module.exports = router