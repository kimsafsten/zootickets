import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { app } from '../src/app.ts';
import { Ticket } from "../src/models/Ticket.ts";

describe("PATCH /tickets/:code/activate", () => {
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
    
      it("should activate a ticket", async () => {
        const createResponse = await request(app)
        .post("/tickets")
        .send({ type: "day-ticket" });

        const code = createResponse.body.code;

        const patchResponse = await request(app).patch(`/tickets/${code}/activate`);

        expect(patchResponse.status).toBe(200);
        expect(patchResponse.body.activatedAt).not.toBeNull();
        });

        it("should set expiresAt to midnight same day for day-ticket", async () => {
            const createResponse = await request(app)
            .post("/tickets")
            .send({ type: "day-ticket" });

            
            const patchResponse = await request(app).patch(
                `/tickets/${createResponse.body.code}/activate`
            );
            
        expect(patchResponse.status).toBe(200);
        
        const activatedAt = new Date(patchResponse.body.activatedAt);
        const expiresAt = new Date(patchResponse.body.expiresAt);

        expect(expiresAt.getDate()).toBe(activatedAt.getDate());
        expect(expiresAt.getHours()).toBe(23);
        expect(expiresAt.getMinutes()).toBe(59);
    });
});