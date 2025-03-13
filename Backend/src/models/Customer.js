const mongoose = require("mongoose");

// Definimos el esquema de cliente
const customerSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "El nombre de usuario es obligatorio"],
        },
        email: {
            type: String,
            required: [true, "El email es obligatorio"],
            trim: true,
            unique: true,
            match: [/.+\@.+\..+/, "El email es inválido"],
        },
        password: {
            type: String,
            required: [true, "La contraseña es obligatoria"],
        },
        role: {
            type: String,
            enum: ["admin", "customer"],
            default: "customer",
        },
    },
    { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
