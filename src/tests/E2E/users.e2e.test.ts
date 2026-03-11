import request from "supertest";
import { app } from "../../app";
import { prisma } from "../../database/prisma";

describe("Users E2E", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create user", async () => {
    const response = await request(app).post("/users").send({
      name: "Gabriel",
      email: "gabriel@email.com",
      password: "1234567",
    });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe("gabriel@email.com");
  });

  it("should list users", async () => {
    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(response.body.users.length).toBeGreaterThan(0);
  });
});
