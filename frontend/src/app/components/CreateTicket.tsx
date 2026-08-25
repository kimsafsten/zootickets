"use client";

import { useState } from "react";

type Props = { onCreated: () => void };

export default function CreateTicket({ onCreated }: Props) {
    const [ticketCode, setTicketCode] = useState<string | null>(null);

    async function createTicket() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "day-ticket" }),
        });

        if (!response.ok) {
          throw new Error("Failed to create ticket");
        }

        const data = await response.json();
        setTicketCode(data.code);
        onCreated();
      }

      return (
        <div>
          <button onClick={createTicket}>Skapa biljett</button>
          {ticketCode && <p>{ticketCode}</p>}
        </div>
      );
    }