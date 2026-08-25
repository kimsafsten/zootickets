"use client";
import { useState, useEffect } from "react";
import ActivateTicket from "./components/ActivateTicket";
import CreateTicket from "./components/CreateTicket";
import TicketList from "./components/TicketList";
import styles from "./page.module.css";

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
    <main className={styles.page}>
    <h1 className={styles.title}>Zootickets</h1>

    <section className={styles.section}>
      <h2>Köp biljett</h2>
      <CreateTicket onCreated={loadTickets} />
    </section>

    <section className={styles.section}>
      <h2>Aktivera biljett</h2>
      <ActivateTicket onActivated={loadTickets} />
    </section>

    <section className={styles.section}>
      <h2>Dina biljetter</h2>
      <TicketList tickets={tickets} onDeleted={loadTickets} />
    </section>
  </main>
  );
}
