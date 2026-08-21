import { describe, it, expect } from "vitest";
import { getExpiresAt, getActivationDeadline } from "../src/utils/ticketDates.ts";

describe("getExpiresAt", () => {
  it("day-ticket expires at midnight same day", () => {
    const activatedAt = new Date("2026-06-15T10:00:00");
    const expiresAt = getExpiresAt("day-ticket", activatedAt);

    expect(expiresAt.getFullYear()).toBe(2026);
    expect(expiresAt.getMonth()).toBe(5);  // juni
    expect(expiresAt.getDate()).toBe(15);
    expect(expiresAt.getHours()).toBe(23);
  });

  it("two-day-ticket expires at midnight next day", () => {
    const activatedAt = new Date("2026-06-15T10:00:00");
    const expiresAt = getExpiresAt("two-day-ticket", activatedAt);

    expect(expiresAt.getDate()).toBe(16);
  });

  it("season-ticket expires at end of year", () => {
    const activatedAt = new Date("2026-03-15T10:00:00");
    const expiresAt = getExpiresAt("season-ticket", activatedAt);

    expect(expiresAt.getMonth()).toBe(11);
    expect(expiresAt.getDate()).toBe(31);
  });
});