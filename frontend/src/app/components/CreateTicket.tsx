"use client";

import { useState } from "react";
import { TICKET_TYPE_LABELS } from "../lib/ticketTypes";
import styles from "../CreateTicket.module.css";

type Props = { onCreated: () => void };

export default function CreateTicket({ onCreated }: Props) {
  const [ticketCode, setTicketCode] = useState<string | null>(null);
  const [ticketType, setTicketType] = useState("day-ticket");

  async function createTicket() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: ticketType }),
    });

    if (!response.ok) {
      throw new Error("Failed to create ticket");
    }

    const data = await response.json();
    setTicketCode(data.code);
    onCreated();
  }

  return (
    <div className={styles.form}>
      <label htmlFor="ticket-type">Biljettyp</label>
      <select
        id="ticket-type"
        className={styles.select}
        aria-label="Biljettyp"
        value={ticketType}
        onChange={(e) => setTicketType(e.target.value)}
      >
        {Object.entries(TICKET_TYPE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <button className={styles.button} onClick={createTicket}>
        Köp biljett
      </button>

      {ticketCode && <p className={styles.code}>{ticketCode}</p>}
    </div>
  );
}