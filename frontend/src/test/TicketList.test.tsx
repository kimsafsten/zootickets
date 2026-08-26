import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import TicketList from "../app/components/TicketList";
import userEvent from "@testing-library/user-event";

describe("TicketList", () => {
    afterEach(() => {
      cleanup();
      vi.unstubAllGlobals();
    });

    it("should show tickets with status", () => {
    render(
      <TicketList onDeleted={vi.fn()}
        tickets={[
          { code: "abc-123", type: "day-ticket", activatedAt: null },
          { code: "def-456", type: "season-ticket", activatedAt: "2026-08-24T10:00:00.000Z" },
        ]}
      />
    );

    expect(screen.getByText("abc-123")).toBeInTheDocument();
    expect(screen.getByText("def-456")).toBeInTheDocument();
    expect(screen.getByText(/Dagsbiljett/i)).toBeInTheDocument();
    expect(screen.getByText("Ej använd")).toBeInTheDocument();
    expect(screen.getByText("Använd")).toBeInTheDocument();
  });
  
  it("should delete unused ticket", async () => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3005";
    const onDeleted = vi.fn();

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
    
    render(
      <TicketList
        tickets={[{ code: "abc-123", type: "day-ticket", activatedAt: null }]}
        onDeleted={onDeleted}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /radera/i }));
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3005/tickets/abc-123",
      expect.objectContaining({ method: "DELETE" })
    );
    expect(onDeleted).toHaveBeenCalled();
  });
});