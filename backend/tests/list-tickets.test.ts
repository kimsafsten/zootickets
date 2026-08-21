import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { app } from '../src/app.ts';
import { Ticket } from "../src/models/Ticket.ts";

describe("GET /tickets", () => {
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

      it("should list all tickets", async () => {
        await request(app).post("/tickets").send({ type: "day-ticket" });
        await request(app).post("/tickets").send({ type: "two-day-ticket" });

        const listResponse = await request(app).get("/tickets");

        expect(listResponse.status).toBe(200);
        expect(listResponse.body.length).toBeGreaterThanOrEqual(2);
      });

    });