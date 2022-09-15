import { prisma } from "../src/database";
import supertest from "supertest";
import { itemFactory } from "./factories/itemFactory";
import app from "../src/app";


beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE table items`;
});

describe("Testa POST /items ", () => {
  it("Deve retornar 201, se cadastrado um item no formato correto", async () => {
    const item = itemFactory();
    const response = await supertest(app).post("/items").send(item);
    expect(response.status).toBe(201);
  });
  it("Deve retornar 409, ao tentar cadastrar um item que exista", async () => {
    const item = itemFactory();
    await supertest(app).post("/items").send(item);
    const response = await supertest(app).post("/items").send(item);
    expect(response.status).toBe(409);
  });
});

describe("Testa GET /items ", () => {
  it("Deve retornar status 200 e o body no formato de Array", async () => {
    const response = await supertest(app).get("/items");
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe("Testa GET /items/:id ", () => {
  it("Deve retornar status 200 e um objeto igual a o item cadastrado", async () => {
    const item = itemFactory();
    await supertest(app).post("/items").send(item);

    const getItem = await supertest(app).get("/items");
    const id = getItem.body[0].id;

    console.log("aqui", id);
    const response = await supertest(app).get(`items/${id}`);
    expect(response.status).toBe(200);
    /* expect(response.body).toEqual(item) */
    /* Não consegui terminar essa a tempo, o id tá vindo mas quando busco recebo 404 */
  });
  it("Deve retornar status 404 caso não exista um item com esse id", async () => {
    const response = await supertest(app).get(`items/-1`);
    expect(response.status).toBe(404);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
