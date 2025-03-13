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

  test("No debe permitir crear un cliente con un email duplicado", async () => {
    const response = await request(app).post("/customers").send({
      username: "Cliente Duplicado",
      email: "correoactualizado@test.com", // Usamos el email actualizado en la prueba anterior
      password: "clave123",
      role: "customer",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  test("No debe permitir crear un cliente sin username", async () => {
    const response = await request(app).post("/customers").send({
      email: `cliente_${Date.now()}@test.com`,
      password: "clave123",
      role: "customer",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  test("No debe permitir crear un cliente sin password", async () => {
    const response = await request(app).post("/customers").send({
      username: "Cliente Sin Password",
      email: `cliente_${Date.now()}@test.com`,
      role: "customer",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
  test("No debe permitir actualizar un cliente con un email inválido", async () => {
    const response = await request(app).put(`/customers/${customerId}`).send({
      email: "correo-invalido",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
  test("No debe permitir actualizar un cliente con un rol inválido", async () => {
    const response = await request(app).put(`/customers/${customerId}`).send({
      role: "invalido",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  test("Debe devolver error 404 al obtener un cliente inexistente", async () => {
    const response = await request(app).get("/customers/660f6d5f536f3c2f1c4d9999"); // ID inexistente
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Cliente no encontrado");
  });


  test("Debe devolver error 404 al eliminar un cliente inexistente", async () => {
    const response = await request(app).delete("/customers/660f6d5f536f3c2f1c4d9999");
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Cliente no encontrado");
  });
  test("No debe permitir crear un cliente con un email duplicado", async () => {
    const response = await request(app).post("/customers").send({
      name: "Cliente Test",
      email: "cliente@test.com", // Email que ya existe
      phone: "3123456789"
    });
  
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
  test("Debe devolver error 400 si falta el nombre del cliente", async () => {
    const response = await request(app).post("/customers").send({
      email: "nuevo@email.com",
      phone: "3123456789"
    });
  
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
  


});
