const express = require("express"); // Para crear el servidor
const Order = require("../models/Order"); 

const router = express.Router();
const mongoose = require("mongoose");


// Crear un nuevo pedido
router.post("/", async (req, res) => {
    try {
        const { customer, products, totalPrice } = req.body; // Obtenemos los datos del pedido
        const newOrder = new Order({ customer, products, totalPrice }); // Creamos un nuevo pedido
        await newOrder.save(); // Guardamos el pedido en la base de datos
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener todos los pedidos
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("customer") // Muestra detalles del cliente
            .populate("products.product"); // Muestra detalles de los productos
        res.json(orders); // Mostramos los pedidos
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Refrescar la lista de pedidos 
router.get("/refresh", async (req, res) => {
    try {
        const orders = await Order.find().populate("customer").populate("products.product");
        res.json({ message: "Lista de pedidos actualizada", orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener un pedido por su ID
router.get("/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("customer")
            .populate("products.product");
        if (!order) return res.status(404).json({ message: "Pedido no encontrado" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// 📌 Actualizar un pedido por su ID
router.put("/:id", async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) return res.status(404).json({ message: "Pedido no encontrado" });
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Eliminar un pedido por su ID 
router.delete("/:id", async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ message: "Pedido no encontrado" });
        res.json({ message: "Pedido eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;
