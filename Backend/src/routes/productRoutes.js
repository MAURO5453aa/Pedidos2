const express = require("express");
const Product = require("../models/Product");
const mongoose = require("mongoose");

const router = express.Router();

// Crear un nuevo producto
router.post("/", async (req, res) => {
    try {
        const { name, price, description, stock, image, category } = req.body;

        if (!name || !price || !description || !stock || !image || !category) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const newProduct = new Product({ name, price, description, stock, image, category });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el producto" });
    }
});

// Obtener todos los productos
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos" });
    }
});

// Obtener producto por ID con validación
router.get("/:id", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Producto no encontrado" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el producto" });
    }
});

// Eliminar un producto
router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: "Producto no encontrado" });

        res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto" });
    }
});

module.exports = router;
