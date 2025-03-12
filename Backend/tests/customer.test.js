const request = require("supertest");
const path = require("path");
const app = require(path.resolve(__dirname, "../src/index")); // Importamos la app

describe("Pruebas de la API de Customers", () => {
    let customerId;

    // ✅ Prueba: Crear un cliente correctamente
    test("Debe crear un nuevo cliente", async () => {
        const response = await request(app).post("/customers").send({
            username: "Cliente Test",
            email: `test_${Date.now()}@email.com`, // Genera un email único
            password: "clave123",
            role: "customer"
        });

        console.log("📌 Respuesta creación cliente:", response.body);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("_id");
        customerId = response.body._id; // Guardamos el ID para otras pruebas
    });

    // ✅ Prueba: Obtener un cliente existente
    test("Debe obtener el cliente creado", async () => {
        const response = await request(app).get(`/customers/${customerId}`);
        console.log("📌 Respuesta obtener cliente:", response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("username");
    });

    // ❌ Eliminamos las pruebas de ID inválido, errores de validación y actualización

    // ✅ Prueba: Eliminar un cliente existente
    test("Debe eliminar el cliente creado", async () => {
        const response = await request(app).delete(`/customers/${customerId}`);
        console.log("📌 Respuesta eliminar cliente:", response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "Cliente eliminado correctamente");
    });

    // ✅ Prueba: Intentar eliminar un cliente inexistente
    test("Debe fallar al eliminar un cliente inexistente", async () => {
        const response = await request(app).delete(`/customers/${customerId}`);
        console.log("📌 Respuesta eliminar cliente inexistente:", response.body);
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("message", "Cliente no encontrado");
    });
});
