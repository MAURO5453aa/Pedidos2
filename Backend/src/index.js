require("dotenv").config(); // Esto se utiliza para manejar la variables de entorno.
const express = require("express");//para crear el servidor
const cors = require("cors");//para permitir que se puedan hacer peticiones desde cualquier orige
const connectDB = require("./config/db");//para conectar la base de datos
const app = express(); //creamos el servidor
const port = process.env.PORT || 3000;//puerto donde se va a ejecutar el servidor


connectDB();//conectamos la base de datos   


// Middleware
app.use(cors());
app.use(express.json());

// ruta de pruebas 

app.get("/", (req, res) => {
    res.send("El servidor esta funcionando correctamente");
    });

//inicio del servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);//mensaje que se muestra en la consola
    });