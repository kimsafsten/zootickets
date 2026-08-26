import { TICKET_TYPE_LABELS } from "../lib/ticketTypes";
import styles from "./TicketList.module.css";

type Ticket = {
    code: string;
    type: string;
    activatedAt: string | null;
  };

  type Props = {
    tickets: Ticket[];
    onDeleted: () => void;
  };

  export default function TicketList({ tickets, onDeleted }: Props) {
    async function deleteTicket(code: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${code}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete ticket");
        }
        onDeleted();
    }

    return (
        <ul className={styles.list}>
            {tickets.length === 0 && (
            <li className={styles.empty}>Inga biljetter ännu</li>
            )}
            {tickets.map((ticket) => (
            <li key={ticket.code} className={styles.item}>
                <div className={styles.info}>
                <span className={styles.code}>{ticket.code}</span>
                <span className={styles.type}>
                    {TICKET_TYPE_LABELS[ticket.type] ?? ticket.type}
                </span>
                <span
                    className={
                    ticket.activatedAt ? styles.statusUsed : styles.statusUnused
                    }
                >
                    {ticket.activatedAt ? "Använd" : "Ej använd"}
                </span>
                </div>
                {!ticket.activatedAt && (
                <button
                    className={styles.deleteButton}
                    onClick={() => deleteTicket(ticket.code)}
                >
                    Radera
                </button>
                )}
            </li>
            ))}
        </ul>
    );
}