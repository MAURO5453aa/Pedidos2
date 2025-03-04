const express = require('express');
const { body, validationResult } = require('express-validator');
const Customer = require('../models/Customer'); // Importamos el modelo
const router = express.Router();

// Crear un nuevo cliente con validaciones 
router.post(
    "/",
    [
        body("username").notEmpty().withMessage("El campo username es requerido"),
        body("email").isEmail().withMessage("El campo email debe ser un correo válido"),
        body("password").isLength({ min: 6 }).withMessage("El campo password debe tener al menos 6 caracteres"),
        body("role").isIn(["admin", "user"]).withMessage("El campo role debe ser admin o customer")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        try {
            const { username, email, password, role } = req.body;  // Usar "username"
            const newCustomer = new Customer({ username, email, password, role });
            await newCustomer.save();
            res.status(201).json(newCustomer);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// Obtener todos los clientes
router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Refrescar la lista de clientes 
router.get("/refresh", async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json({ message: "Lista de clientes actualizada", customers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener un cliente por su id
router.get("/:id", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: "Cliente no encontrado" });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar un cliente por su id
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

// Eliminar un cliente por su id
router.delete("/:id", async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (!deletedCustomer) return res.status(404).json({ message: "Cliente no encontrado" });
        res.json({ message: "Cliente eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
