const mongoose = require("mongoose");// Importar la librería de mongoose

const connectDB = async () => { // Función para conectar a la base de datos
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error("Error al conectar con la base de datos", error);
        process.exit(1);
    }
};

module.exports = connectDB;
