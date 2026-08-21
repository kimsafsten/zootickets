import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { app } from "../src/app.ts";
import { Ticket } from "../src/models/Ticket.ts";

describe("DELETE /tickets/:code", () => {
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

  it("should delete an unused ticket", async () => {
    const createResponse = await request(app)
    .post("/tickets")
    .send({ type: "day-ticket" });

    const code = createResponse.body.code;

    const deleteResponse = await request(app).delete(`/tickets/${code}`);

    expect(deleteResponse.status).toBe(200);
    
    const foundTicket = await Ticket.findOne({ code });
    expect(foundTicket).toBeNull();
  });

  it("should not delete an activated ticket", async () => {
    const createResponse = await request(app)
      .post("/tickets")
      .send({ type: "day-ticket" });

    const code = createResponse.body.code;
    
    await request(app).patch(`/tickets/${code}/activate`);
    
    const deleteResponse = await request(app).delete(`/tickets/${code}`);
    
    expect(deleteResponse.status).toBe(400);
    
    const found = await Ticket.findOne({ code });
    expect(found).not.toBeNull();
  });

});