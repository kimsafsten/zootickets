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
    const confirm = vi.fn().mockReturnValue(true);

    vi.stubGlobal("confirm", confirm);
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
    await userEvent.click(screen.getByRole("button", { name: /aktivera biljett/i }));

    expect(confirm).toHaveBeenCalledWith(expect.stringMatching(/endast gäller/));
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3005/tickets/abc-123/activate",
      expect.objectContaining({ method: "PATCH" })
    );
    expect(onActivated).toHaveBeenCalled();
  });

  it("should not activate when the warning is cancelled", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("confirm", vi.fn().mockReturnValue(false));
    vi.stubGlobal("fetch", fetchMock);

    render(<ActivateTicket onActivated={vi.fn()} />);

    await userEvent.type(screen.getByRole("textbox"), "abc-123");
    await userEvent.click(screen.getByRole("button", { name: /aktivera biljett/i }));

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("should show an error when the ticket code is empty", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<ActivateTicket onActivated={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: /aktivera biljett/i }));

    expect(screen.getByRole("alert")).toHaveTextContent("Ange en biljettkod.");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("should show an error returned by the backend", async () => {
    vi.stubGlobal("confirm", vi.fn().mockReturnValue(true));
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: "Ticket already used" }),
      })
    );

    render(<ActivateTicket onActivated={vi.fn()} />);

    await userEvent.type(screen.getByRole("textbox"), "abc-123");
    await userEvent.click(screen.getByRole("button", { name: /aktivera biljett/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Ticket already used"
    );
  });
});
