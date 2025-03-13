const request = require("supertest");
const mongoose = require("mongoose");
const Customer = require("../src/models/Customer");
const app = require("../src/index");

let customerId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Crear un cliente de prueba
  const response = await request(app).post("/customers").send({
    username: "juanperez",
    email: "juanperez@email.com",
    password: "securepassword",
  });

  customerId = response.body._id;
});

afterAll(async () => {
  await Customer.deleteMany({});
  await mongoose.connection.close();
});

describe("Pruebas completas CRUD Customers", () => {
  
  test("Debe crear correctamente un nuevo cliente", async () => {
    const response = await request(app).post("/customers").send({
      username: "marialopez",
      email: "marialopez@email.com",
      password: "mypassword",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
  });

  test("Debe obtener correctamente el cliente creado", async () => {
    const response = await request(app).get(`/customers/${customerId}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id", customerId);
  });

  test("Debe actualizar correctamente el cliente creado", async () => {
    const response = await request(app).put(`/customers/${customerId}`).send({
      email: "correoactualizado@test.com",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe("correoactualizado@test.com");
  });

  test("Debe fallar al obtener un cliente con ID inválido", async () => {
    const response = await request(app).get("/customers/123");

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("ID de cliente inválido");
  });

  test("Debe eliminar correctamente el cliente creado", async () => {
    const response = await request(app).delete(`/customers/${customerId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Cliente eliminado correctamente");
  });


  test("No debe permitir crear un cliente con email inválido", async () => {
    const response = await request(app).post("/customers").send({
      username: "malemail",
      email: "invalid-email",
      password: "securepassword",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toContain("El email es inválido");
  });

});
