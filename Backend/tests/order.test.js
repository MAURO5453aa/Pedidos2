const request = require("supertest"); // ✅ Importar request
const path = require("path");
const mongoose = require("mongoose");
const Order = require("../src/models/Order"); // ✅ Asegurar que esta ruta es correcta
const app = require(path.resolve(__dirname, "../src/index"));

let orderId, customerId, productId;

beforeAll(async () => {
  // ✅ Crear un cliente de prueba
  const customerRes = await request(app).post("/customers").send({
    username: "Cliente Test",
    email: `cliente_${Date.now()}@test.com`,
    password: "clave123",
    role: "customer",
  });
  customerId = customerRes.body._id;

  // ✅ Crear un producto de prueba
  const productRes = await request(app).post("/products").send({
    name: "Producto Test Pedido",
    price: 1000,
    description: "Producto Test",
    stock: 10,
    image: "imagen.jpg",
    category: "Test"
  });
  productId = productRes.body._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Pruebas CRUD completas Orders", () => {

  test("Debe crear un nuevo pedido correctamente", async () => {
    const response = await request(app).post("/orders").send({
      customer: customerId,
      products: [{ product: productId, quantity: 2 }],
      totalPrice: 2000,
      status: "pending"
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
    orderId = response.body._id;
  });

  test("Debe obtener el pedido creado correctamente", async () => {
    const response = await request(app).get(`/orders/${orderId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id", orderId);
    expect(response.body.products.length).toBeGreaterThan(0);
  });

  test("Debe fallar al obtener pedido con ID inválido", async () => {
    const response = await request(app).get("/orders/id-invalido");

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("ID inválido");
  });

  test("Debe actualizar correctamente el pedido creado", async () => {
    const response = await request(app).put(`/orders/${orderId}`).send({
      totalPrice: 5000,
      status: "shipped"
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.totalPrice).toBe(5000);
    expect(response.body.status).toBe("shipped");
  });

  test("Debe fallar al actualizar un pedido con ID inválido", async () => {
    const response = await request(app).put("/orders/id-invalido").send({
      totalPrice: 3000
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("ID inválido");
  });

  test("Debe fallar al actualizar un pedido inexistente", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app).put(`/orders/${fakeId}`).send({
      totalPrice: 5000
    });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Pedido no encontrado");
  });

  test("Debe eliminar correctamente el pedido creado", async () => {
    const response = await request(app).delete(`/orders/${orderId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Pedido eliminado correctamente");
  });

  test("Debe fallar al eliminar un pedido con ID inválido", async () => {
    const response = await request(app).delete("/orders/id-invalido");

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("ID inválido");
  });

  test("Debe fallar al eliminar un pedido inexistente", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app).delete(`/orders/${fakeId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Pedido no encontrado");
  });

  test("Debe fallar al crear un pedido sin productos", async () => {
    const response = await request(app).post("/orders").send({
      customer: customerId,
      products: [],
      totalPrice: 1500
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Debe haber al menos un producto en el pedido");
  });

  test("Debe fallar al crear un pedido con estado inválido", async () => {
    const response = await request(app).post("/orders").send({
      customer: customerId,
      products: [{ product: productId, quantity: 1 }],
      totalPrice: 3000,
      status: "invalidStatus"
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Estado inválido. Valores permitidos: pending, shipped, delivered, canceled");
  });

  test("Debe fallar al obtener pedidos si no hay ninguno", async () => {
    await Order.deleteMany({});

    const response = await request(app).get("/orders");

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("No hay pedidos disponibles");
  });

});
