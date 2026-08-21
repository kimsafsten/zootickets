import type { TicketType } from "../models/Ticket.ts";

export function getActivationDeadline(now = new Date()): Date {
  const year = now.getFullYear();
  return new Date(year, 11, 31, 23, 59, 59, 999);
}

function midnight(year: number, month: number, day: number): Date {
  return new Date(year, month, day, 23, 59, 59, 999);
}

export function getExpiresAt(type: TicketType, activatedAt: Date): Date {
  const year = activatedAt.getFullYear();
  const month = activatedAt.getMonth();
  const day = activatedAt.getDate();

  switch (type) {
    case "day-ticket":
    case "family-ticket":
      return midnight(year, month, day);

    case "two-day-ticket":
      return midnight(year, month, day + 1);
      
    case "season-ticket":
      return midnight(year, 11, 31);
  }
}
export function isPastActivationDeadline(
  activationDeadline: Date,
  now = new Date()
): boolean {
  return now > activationDeadline;
}