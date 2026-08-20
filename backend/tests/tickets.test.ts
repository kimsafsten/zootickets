import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from '../src/app.js';

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const validTicketTypes = [
  "day-ticket",
  "two-day-ticket",
  "season-ticket",
  "family-ticket",
];

describe("POST /tickets", () => {
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
});