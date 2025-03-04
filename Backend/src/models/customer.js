const mongoose = require('mongoose');

// Definimos el esquema de cliente sin el campo id personalizado
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
}, { timestamps: true }); // Agrega createdAt y updatedAt automáticamente

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
