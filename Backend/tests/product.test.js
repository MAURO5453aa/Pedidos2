const request = require("supertest");
const app = require("../src/index"); // Importamos la app

describe("Pruebas de la API de products", () => {
  test("Debe devolver un array de productos", async () => {
    const response = await request(app).get("/products");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
