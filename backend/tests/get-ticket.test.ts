import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { app } from '../src/app.ts';
import { Ticket } from "../src/models/Ticket.ts";

describe("GET /tickets/:code", () => {
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
    
    it("should return a ticket by code", async () => { 
        const createResponse = await request(app)
        .post("/tickets")
        .send({ type: "day-ticket" });

        const code = createResponse.body.code;

        const getResponse = await request(app).get(`/tickets/${code}`);

        expect(getResponse.status).toBe(200);
        expect(getResponse.body.code).toBe(code);
        expect(getResponse.body.type).toBe("day-ticket");
    });

    it("should return a 404 for unknown code", async () => {
        const getResponse = await request(app).get("/tickets/unknown-code");

        expect(getResponse.status).toBe(404);
    });
});