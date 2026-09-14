import { describe, it, expect, vi, afterEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.ts";
import { Ticket } from "../src/models/Ticket.ts";

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
});