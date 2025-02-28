const express = require('express');
const Product = require('../models/Product'); // Importamos el modelo de la base de datos

const router = express.Router();

// 📌 Crear un nuevo producto (Create)
router.post("/", async (req, res) => {
    try {
        const { name, description, price, stock, image, category } = req.body; // Obtenemos los datos del producto
        const newProduct = new Product({ name, description, price, stock, image, category }); // Creamos un nuevo producto
        await newProduct.save(); // Guardamos el producto en la base de datos
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 Refrescar la lista de productos
router.get("/refresh", async (req, res) => {
    try {
        const products = await Product.find(); // Obtenemos todos los productos
        res.json({ message: "Lista de productos actualizada", products }); // Mostramos los productos
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 Obtener todos los productos (Read)
router.get("/", async (req, res) => {
    try {
        const products = await Product.find(); // Obtenemos todos los productos
        res.json(products); // Mostramos los productos
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// 📌 Obtener un producto por su ID (Read One)
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Producto no encontrado" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 Actualizar un producto por su ID (Update)
router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: "Producto no encontrado" });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 Eliminar un producto por su ID (Delete)
router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: "Producto no encontrado" });
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
