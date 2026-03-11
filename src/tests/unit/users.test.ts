import request from "supertest";
import { app } from "../../app";
import { prisma } from "../../database/prisma";
import { hashPassword } from "../../util/hash";

jest.mock("../../database/prisma", () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("../../util/hash", () => ({
  hashPassword: jest.fn(),
}));
describe("Users Routes", () => {
  describe("GET /users", () => {
    it("should list users successfully", async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([
        { id: 1, name: "Gabriel", email: "gabriel@email.com" },
      ]);

      const response = await request(app).get("/users");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Users listed successfully");
      expect(response.body.users.length).toBe(1);
    });
  });

  describe("POST /users", () => {
    it("should create a user successfully", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      (hashPassword as jest.Mock).mockResolvedValue("hashedpassword");

      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Gabriel",
        email: "gabriel@email.com",
      });

      const response = await request(app).post("/users").send({
        name: "Gabriel",
        email: "gabriel@email.com",
        password: "1234567",
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User created successfully");
      expect(response.body.user.email).toBe("gabriel@email.com");
    });

    it("should return error if user already exists", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: "gabriel@email.com",
      });

      const response = await request(app).post("/users").send({
        name: "Gabriel",
        email: "gabriel@email.com",
        password: "1234567",
      });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe("User already exists");
    });

    it("should return error if fields are missing", async () => {
      const response = await request(app).post("/users").send({});

      expect(response.status).toBe(400);
    });
  });
});
