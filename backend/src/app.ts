import express, { type Express, type Request, type Response } from "express";
import { randomUUID } from "node:crypto";
import { ValidTicketTypes, Ticket } from "./models/Ticket.ts";

export const app: Express = express();

function getActivationDeadline() : Date {
  const year = new Date().getFullYear();
  return new Date(year, 11, 31, 23, 59, 59, 999);
}

app.use(express.json());

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


  