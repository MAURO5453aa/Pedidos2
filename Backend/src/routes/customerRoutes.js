const express = require('express');
const {body, validationResult} = require('express-validator');
const Customer = require('../models/Customer');//importamos el modelo de la base de datos
const router = express.Router();
//ruta para obtener todos los clientes

// crear un nuevo cliente con validaciones 

router.post("/",
[
    body("usernames").notEmpty().withMessage("El campo Usernames es requerido"),
    body("email").isEmail().withMessage("El campo email debe ser un correo válido"),
    body("password").isLength({min: 6}).withMessage("El campo password debe tener al menos 6 caracteres"),
    body("role").isIn(["admin", "user"]).withMessage("El campo role debe ser admin o customer")
],  
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    try {
        const{Usernames, email, password, role} = req.body;//
        const newCustomer = new Customer({Usernames, email, password, role});//creamos un nuevo cliente
        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });   
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
// refresacar la lista de clientes 
router.get("/refresh", async (req, res) => {
    try{
        const customers = await Customer.find();//obtenemos todos los clientes
        res.json({message: "Lista de clientes actualizada", customers});//mostramos los clientes
        }catch(error){
            res.status(500).json({ message: error.message });
        }
    });
// obtener un cliente por su id

router.get("/:id", async (req, res) => {
    try{
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: "Cliente no encontrado" });
        res.json(customer);
    }catch(error){
        res.status(500).json({ message: error.message });

    }
});

// actualizar un cliente por su id

router.put(
    "/:id",
    [
        body("username").optional().notEmpty().withMessage("El nombre no puede estar vacío"),
        body("email").optional().isEmail().withMessage("Debe ser un email válido"),
        body("password").optional().isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
        body("role").optional().isIn(["admin", "user"]).withMessage("El rol debe ser 'admin' o 'user'")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedCustomer) return res.status(404).json({ message: "Cliente no encontrado" });
            res.json(updatedCustomer);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);
// eliminar un cliente por su id

router.delete("/:id", async (req, res) => {

    try{

        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (!deletedCustomer) return res.status(404).json({ message: "Cliente no encontrado" });

        res.json({ message: "Cliente eliminado correctamente" });
    }catch(error){
        res.status(500).json({ message: error.message });               

    }

});


    module.exports = router;
