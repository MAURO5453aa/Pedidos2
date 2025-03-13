const request = require("supertest");
const path = require("path");
const mongoose = require("mongoose");
const app = require(path.resolve(__dirname, "../src/index"));

let customerId;

describe("Pruebas completas CRUD Customers", () => {

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("Debe crear correctamente un nuevo cliente", async () => {
    const response = await request(app).post("/customers").send({
      username: "Cliente Test",
      email: `cliente_${Date.now()}@test.com`,
      password: "clave123",
      role: "customer"
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
    customerId = response.body._id;
  });

  test("Debe obtener correctamente el cliente creado", async () => {
    const response = await request(app).get(`/customers/${customerId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id", customerId);
    expect(response.body).toHaveProperty("username", "Cliente Test");
  });

  test("Debe actualizar correctamente el cliente creado", async () => {
    const response = await request(app).put(`/customers/${customerId}`).send({
      email: "correoactualizado@test.com"
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe("correoactualizado@test.com");
  });

  test("Debe obtener correctamente la lista de clientes", async () => {
    const response = await request(app).get("/customers");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Debe fallar al obtener cliente con ID inválido", async () => {
    const response = await request(app).get("/customers/id-invalido");

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("ID inválido");
  });

  test("Debe eliminar correctamente el cliente creado", async () => {
    const response = await request(app).delete(`/customers/${customerId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Cliente eliminado correctamente");
  });

  test("Debe fallar al eliminar un cliente inexistente", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app).delete(`/customers/${fakeId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Cliente no encontrado");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
