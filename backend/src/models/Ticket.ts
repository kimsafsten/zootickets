import mongoose, { Schema } from "mongoose";

export const ValidTicketTypes = [
    "day-ticket",
    "two-day-ticket",
    "season-ticket",
    "family-ticket"
] as const;

export type TicketType = (typeof ValidTicketTypes)[number];

interface ITicket {
    code: string;
    type: TicketType;
    createdAt: Date;
    activationDeadline: Date;
    activatedAt: Date | null;
    expiresAt: Date | null;
}

const ticketSchema = new Schema<ITicket>({
    code: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ValidTicketTypes },
    createdAt: { type: Date, default: Date.now },
    activationDeadline: { type: Date, required: true },
    activatedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
});

export const Ticket = mongoose.model<ITicket>("Ticket", ticketSchema);