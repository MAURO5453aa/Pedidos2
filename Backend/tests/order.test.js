const request = require("supertest");
const path = require("path");
const app = require(path.resolve(__dirname, "../src/index"));


describe("Pruebas de la API de orders", () => {
  test("Debe devolver un array de clientes", async () => {
    const response = await request(app).get("/orders");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
