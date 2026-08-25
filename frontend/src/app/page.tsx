"use client";
import { useState, useEffect } from "react";
import ActivateTicket from "./components/ActivateTicket";
import CreateTicket from "./components/CreateTicket";
import TicketList from "./components/TicketList";

type Ticket = {
  code: string;
  type: string;
  activatedAt: string | null;
};


export default function Home() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
  
  async function loadTickets() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets`);
    if (!response.ok) {
      throw new Error("Failed to load tickets");
    }
    const data = await response.json();
    setTickets(data);
  }

  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <div>
      <CreateTicket onCreated={loadTickets} />

      <ActivateTicket onActivated={loadTickets} />
      
      <TicketList tickets={tickets} onDeleted={loadTickets} />
    </div>
  );
}
