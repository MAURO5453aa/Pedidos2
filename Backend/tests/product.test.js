const request = require("supertest");
const path = require("path");
const mongoose = require("mongoose");
const app = require(path.resolve(__dirname, "../src/index"));

let productId;

describe("Pruebas completas CRUD Productos", () => {

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("Debe crear un producto correctamente", async () => {
    const response = await request(app).post("/products").send({
      name: "Producto para Test",
      price: 1500,
      description: "Descripción producto de prueba",
      stock: 10,
      image: "url_imagen.jpg",
      category: "Tecnología"
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
    productId = response.body._id;
  });

  test("Debe obtener correctamente el producto creado", async () => {
    const response = await request(app).get(`/products/${productId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id", productId);
    expect(response.body).toHaveProperty("name", "Producto para Test");
  });

  test("Debe fallar al obtener producto con ID inválido", async () => {
    const response = await request(app).get("/products/id-invalido");

    expect(response.statusCode).toBe(500); // Este debe coincidir con tu implementación actual
  });

  test("Debe actualizar correctamente el producto creado", async () => {
    const response = await request(app).put(`/products/${productId}`).send({
      price: 3000,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("price", 3000);
  });

  test("Debe obtener correctamente la lista de productos", async () => {
    const response = await request(app).get("/products");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Debe fallar al crear producto sin nombre", async () => {
    const response = await request(app).post("/products").send({
      price: 1500,
      description: "Producto sin nombre",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  test("Debe eliminar correctamente el producto creado", async () => {
    const response = await request(app).delete(`/products/${productId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Producto eliminado");
  });

  test("Debe fallar al eliminar producto inexistente", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app).delete(`/products/${fakeId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Producto no encontrado");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
