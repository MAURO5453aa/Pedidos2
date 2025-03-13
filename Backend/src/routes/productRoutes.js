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
        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct); // ✅ Debe devolver el producto creado
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
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "ID inválido" });
        }
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Producto no encontrado" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
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

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto", error });
    }
});

module.exports = router;
