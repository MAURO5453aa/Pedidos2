const express = require("express");
const Order = require("../models/Order");
const mongoose = require("mongoose");

const router = express.Router();

// 📌 Crear un pedido con validaciones mejoradas
router.post("/", async (req, res) => {
    try {
        const { customer, products, totalPrice, status } = req.body;

        if (!customer || !products || !totalPrice) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Debe haber al menos un producto en el pedido" });
        }

        // Validar si `status` es uno de los valores permitidos
        const validStatuses = ["pending", "shipped", "delivered", "canceled"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: `Estado inválido. Valores permitidos: ${validStatuses.join(", ")}` });
        }

        const newOrder = new Order({ customer, products, totalPrice, status });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el pedido", error: error.message });
    }
});

// 📌 Obtener todos los pedidos
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find().populate("customer").populate("products.product");
        
        if (orders.length === 0) {
            return res.status(404).json({ message: "No hay pedidos disponibles" });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener pedidos" });
    }
});

// 📌 Obtener un pedido por ID con validación
router.get("/:id", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const order = await Order.findById(req.params.id).populate("customer").populate("products.product");
        if (!order) return res.status(404).json({ message: "Pedido no encontrado" });

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el pedido" });
    }
});

// 📌 Actualizar un pedido con validación de ID y estado
router.put("/:id", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el pedido" });
    }
});

// 📌 Eliminar un pedido con validación de ID
router.delete("/:id", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        res.status(200).json({ message: "Pedido eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el pedido" });
    }
});

module.exports = router;
