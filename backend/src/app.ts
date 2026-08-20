import express, { type Express, type Request, type Response } from "express";
import { randomUUID } from "node:crypto";

export const app: Express = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.post('/tickets', (req: Request, res: Response) => {
  const ticketCode = randomUUID();
  const { type } = req.body;

  res.status(201).json({ code: ticketCode, type, message: 'Ticket created successfully' });
});


  