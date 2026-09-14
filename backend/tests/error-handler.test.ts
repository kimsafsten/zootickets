import { describe, it, expect, vi, afterEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.ts";
import { Ticket } from "../src/models/Ticket.ts";
import mongoose, { mongo } from "mongoose";

describe("error handler", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 500 json for unexpected errors", async () => {
    vi.spyOn(Ticket, "find").mockRejectedValue(new Error("Database crashed"));

    const response = await request(app).get("/tickets");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      },
    });
  });

  it("should return 400 json for mongoose validation errors", async () => {
    const validationError = new mongoose.Error.ValidationError();

    vi.spyOn(Ticket, "find").mockRejectedValue(validationError);

    const response = await request(app).get("/tickets");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request data",
      },
    });
  });

});