const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);//nombre del modelo y el esquema

module.exports = Product;
