const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Conexión con la base de datos establecida");
    } catch (error) {
        console.log("Error al conectar con la base de datos", error);
        process.exit(1);
    }
};

module.exports = connectDB;