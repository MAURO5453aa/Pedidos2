const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

// Crear un nuevo cliente
router.post("/", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username) return res.status(400).json({ message: "El nombre de usuario es obligatorio" });
        if (!email || !email.includes("@")) return res.status(400).json({ message: "El email es inválido" });
        if (!password) return res.status(400).json({ message: "La contraseña es obligatoria" });

        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) return res.status(400).json({ message: "El email ya está registrado" });

        const newCustomer = new Customer({ username, email, password });
        await newCustomer.save();

        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el cliente" });
    }
});

// Obtener todos los clientes
router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los clientes" });
    }
});

// Obtener un cliente por ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ message: "ID de cliente inválido" });

        const customer = await Customer.findById(id);
        if (!customer) return res.status(404).json({ message: "Cliente no encontrado" });

        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el cliente" });
    }
});

// Actualizar un cliente
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ message: "ID de cliente inválido" });
        if (role && !["admin", "customer"].includes(role)) return res.status(400).json({ message: "Rol inválido. Debe ser 'admin' o 'customer'" });

        const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCustomer) return res.status(404).json({ message: "Cliente no encontrado" });

        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el cliente" });
    }
});

// Eliminar un cliente
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ message: "ID de cliente inválido" });

        const deletedCustomer = await Customer.findByIdAndDelete(id);
        if (!deletedCustomer) return res.status(404).json({ message: "Cliente no encontrado" });

        res.status(200).json({ message: "Cliente eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el cliente" });
    }
});

module.exports = router;
