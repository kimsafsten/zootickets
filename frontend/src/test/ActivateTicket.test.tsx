import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import ActivateTicket from "../app/components/ActivateTicket";

describe("ActivateTicket", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("should call PATCH when activating ticket", async () => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3005";
    const onActivated = vi.fn();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          code: "abc-123",
          type: "day-ticket",
          activatedAt: "2026-08-24T10:00:00.000Z",
        }),
      })
    );

    render(<ActivateTicket onActivated={onActivated} />);

    await userEvent.type(screen.getByRole("textbox"), "abc-123");
    await userEvent.click(screen.getByRole("button", { name: /använd biljett/i }));

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3005/tickets/abc-123/activate",
      expect.objectContaining({ method: "PATCH" })
    );
    expect(onActivated).toHaveBeenCalled();
  });
});