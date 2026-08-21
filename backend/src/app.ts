import express, { type Express, type Request, type Response } from "express";
import { randomUUID } from "node:crypto";
import { ValidTicketTypes, Ticket } from "./models/Ticket.ts";
import {
  getActivationDeadline,
  getExpiresAt,
  isPastActivationDeadline,
} from "./utils/ticketDates.ts";

export const app: Express = express();

app.use(express.json());

app.get("/tickets", async(req: Request, res: Response) => {
  const tickets = await Ticket.find();

  res.status(200).json(tickets);
});

app.get("/tickets/:code", async(req: Request, res: Response) => {
  const ticket = await Ticket.findOne({ code: req.params.code });

  if (!ticket) {
    res.status(404).json({ message: 'Ticket not found' });
    return;
  }

  res.status(200).json(ticket);
});

app.post('/tickets', async(req: Request, res: Response) => {
  const ticketCode = randomUUID();
  const { type } = req.body;

  if (!ValidTicketTypes.includes(type))
    {
      res.status(400).json({ message: 'Invalid ticket type' });
      return; 
    }

  const activationDeadline = getActivationDeadline();

  const ticket = new Ticket({ code: ticketCode, type, activationDeadline });
  await ticket.save();

  res.status(201).json({ 
    code: ticketCode, 
    type, 
    activationDeadline, 
    message: 'Ticket created successfully' 
  });
});

app.patch("/tickets/:code/activate", async(req: Request, res: Response) => {
  const ticket = await Ticket.findOne({ code: req.params.code });
  
  if (!ticket) {
    res.status(404).json({ message: 'Ticket not found' });
    return;
  }

  if (isPastActivationDeadline(ticket.activationDeadline)) {
    res.status(400).json({ message: "Activation deadline has passed" });
    return;
  }

  ticket.activatedAt = new Date();
  ticket.expiresAt = getExpiresAt(ticket.type, ticket.activatedAt);
  await ticket.save();

  res.status(200).json(ticket);
});


app.delete("/tickets/:code", async(req: Request, res: Response) => {
  const ticket = await Ticket.findOne({ code: req.params.code });

  if (!ticket) {
    res.status(404).json({ message: 'Ticket not found' });
    return;
  }

  if (ticket.activatedAt !== null) {
    res.status(400).json({ message: 'Cannot delete an activated ticket' });
    return;
  }

  await ticket.deleteOne({ code: req.params.code });
  res.status(200).json({ message: 'Ticket deleted' });
});
  