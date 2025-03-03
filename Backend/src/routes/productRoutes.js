const express = require('express');
const { body, validationResult } = require("express-validator");
const Product = require('../models/Product'); // Importamos el modelo de la base de datos

const router = express.Router();

// 📌 Crear un nuevo producto (Create)
router.post(
    "/",
    [
        body("name").notEmpty().withMessage("El nombre del producto es obligatorio"),
        body("price").isFloat({ min: 0 }).withMessage("El precio debe ser un número positivo"),
        body("stock").isInt({ min: 0 }).withMessage("El stock debe ser un número entero positivo"),
        body("category").notEmpty().withMessage("La categoría es obligatoria")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, description, price, stock, image, category } = req.body;
            const newProduct = new Product({ name, description, price, stock, image, category });
            await newProduct.save();
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

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
