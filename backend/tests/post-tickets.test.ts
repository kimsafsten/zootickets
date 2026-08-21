import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { app } from '../src/app.ts';
import { Ticket } from "../src/models/Ticket.ts";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  
  describe("POST /tickets", () => {
    beforeAll(async () => {
      process.loadEnvFile();
      await mongoose.connect(process.env.MONGODB_URI_TEST!);
    });
  
    afterEach(async () => {
      await Ticket.deleteMany({});
    });
  
    afterAll(async () => {
      await mongoose.disconnect();
    });

    it("should create a new ticket", async () => {
      const response = await request(app).post("/tickets").send({ type: "day-ticket" });
      
      expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("code");
        expect(response.body.code).toMatch(uuidRegex);
    });

    it("should return a valid ticket type", async () => {
        const response = await request(app).post("/tickets").send({ type: "day-ticket" });

        expect(response.body.type).toBe("day-ticket");
    });

    it("should reject an invalid ticket type", async () => {
        const response = await request(app)
            .post("/tickets")
            .send({ type: "invalid-type" });

        expect(response.status).toBe(400);
        });

    it("should set activationDeadline to end of current year", async () => {
        const response = await request(app).post("/tickets").send({ type: "day-ticket" });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("activationDeadline");

        const deadline = new Date(response.body.activationDeadline);
        const currentYear = new Date().getFullYear();

        expect(deadline.getFullYear()).toBe(currentYear);
        expect(deadline.getMonth()).toBe(11);
        expect(deadline.getDate()).toBe(31);
    });

    it("should persist the ticket in the database", async () => {
      const response = await request(app)
        .post("/tickets")
        .send({ type: "day-ticket" });

      const saved = await Ticket.findOne({ code: response.body.code });
      expect(saved).not.toBeNull();

      const deadline = new Date(saved!.activationDeadline);
      const currentYear = new Date().getFullYear();

      expect(deadline.getFullYear()).toBe(currentYear);
      expect(deadline.getMonth()).toBe(11);
      expect(deadline.getDate()).toBe(31);
      expect(saved!.type).toBe("day-ticket");
    });

    it("should set activatedAt and expiresAt to null on creation", async () => {
      const response = await request(app)
        .post("/tickets")
        .send({ type: "day-ticket" });

      const saved = await Ticket.findOne({ code: response.body.code });
      
      expect(saved).not.toBeNull();
      expect(saved!.activatedAt).toBeNull();
      expect(saved!.expiresAt).toBeNull();
      expect(saved!.createdAt).toBeInstanceOf(Date);
    });

});