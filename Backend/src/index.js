require("dotenv").config(); // Manejo de variables de entorno
console.log("MONGO_URI:", process.env.MONGO_URI); // 🔍 Verifica si .env se carga correctamente
const express = require("express"); // Para crear el servidor
const cors = require("cors"); // Permitir peticiones desde cualquier origen
const connectDB = require("./config/db"); // Conectar la base de datos
const customerRoutes = require("./routes/customerRoutes"); // Importar rutas de clientes
const productRoutes = require("./routes/productRoutes"); // Importamos las rutas de productos

const app = express(); // crar la ruta de express para el servidor
const port = process.env.PORT || 3000; // Puerto donde se ejecuta el servidor

connectDB(); // Conectar a la base de datos

// Middleware
app.use(cors());
app.use(express.json());
// Usar las rutas (⬇ Mover esto después de inicializar app)
app.use("/customers", customerRoutes);
app.use("/products", productRoutes);


// Ruta de prueba
app.get("/", (req, res) => {
    res.send("El servidor está funcionando correctamente");
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
