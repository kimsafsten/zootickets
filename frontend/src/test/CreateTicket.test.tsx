import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import CreateTicket from "../app/components/CreateTicket";

describe("CreateTicket", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

it("should show create ticket button", () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ code: "test-uuid", type: "day-ticket" }),
      }));
 
     render(<CreateTicket onCreated={vi.fn()} />);
     expect(screen.getByRole("button", { name: /köp biljett/i })).toBeInTheDocument();
   });
 
   it("should call API when creating ticket", async () => {
     process.env.NEXT_PUBLIC_API_URL = "http://localhost:3005";
 
     vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ code: "test-uuid", type: "day-ticket" }),
      }));
     
     render(<CreateTicket onCreated={vi.fn()} />);
     await userEvent.click(screen.getByRole("button", { name: /köp biljett/i }));
 
     expect(fetch).toHaveBeenCalledWith(
       "http://localhost:3005/tickets",
       expect.objectContaining({
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ type: "day-ticket" }),
       })
     );
   });
 
   it("should show ticket code after creating ticket", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ code: "test-uuid", type: "day-ticket" }),
      }));
 
     render(<CreateTicket onCreated={vi.fn()} />);
     await userEvent.click(screen.getByRole("button", { name: /köp biljett/i }));
 
     expect(await screen.findByText("test-uuid")).toBeInTheDocument();
   })

   it("should send selected ticket type to API", async () => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3005";
  
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ code: "test-uuid", type: "season-ticket" }),
    }));
  
    render(<CreateTicket onCreated={vi.fn()} />);
  
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /biljettyp/i }),
      "season-ticket"
    );
    await userEvent.click(screen.getByRole("button", { name: /köp biljett/i }));
  
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3005/tickets",
      expect.objectContaining({
        body: JSON.stringify({ type: "season-ticket" }),
      })
    );
  });
   
  });