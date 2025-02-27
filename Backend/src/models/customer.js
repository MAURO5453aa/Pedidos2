const mongoose = require('mongoose');

// desfinimos el esquema de cliente

const customerSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    }
},{timestamps: true});//agregamos la fecha de creación y modificación

// creamos el modelo de cliente

const Customer = mongoose.model("Customer", customerSchema);//nombre del modelo y el esquema

module.exports = Customer;