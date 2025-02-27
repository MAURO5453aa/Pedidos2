const express = require('express');
const Customer = require('../models/Customer');//importamos el modelo de la base de datos
const router = express.Router();
//ruta para obtener todos los clientes

// crear un nuevo cliente

router.post("/", async (req, res) => {

    try{
        const { username, email, password , role }=req.body;//obtenemos los datos del cliente
        const newCustomer = new Customer({ username, email, password , role });//creamos un nuevo cliente
        await newCustomer.save();//guardamos el cliente en la base de datos
        res.send("Cliente creado correctamente");//mensaje de que el cliente se creo correctamente
        res.status(201).json(newCustomer);//
    }catch(error){
        res.status(500).json({message: error.message});
    }

});

// obtener todos los clientes

router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find();//obtenemos todos los clientes
        res.json(customers);//mostramos los clientes
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

