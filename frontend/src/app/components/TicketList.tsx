import { TICKET_TYPE_LABELS } from "../lib/ticketTypes";

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

    <ul>
        {tickets.map((ticket) => (
          <li key={ticket.code}>
          {ticket.code} — {TICKET_TYPE_LABELS[ticket.type] ?? ticket.type}{" "}
          {ticket.activatedAt ? "använd" : "ej använd"}
          {!ticket.activatedAt && (
            <button onClick={() => deleteTicket(ticket.code)}>Radera</button>
          )}
        </li>
        ))}
      </ul>
    );
}