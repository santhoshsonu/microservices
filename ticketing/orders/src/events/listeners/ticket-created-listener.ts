import { Listener, Subjects, TicketCreatedEvent } from "@microservice-tickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { QUEQUE_GROUP_NAME } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = QUEQUE_GROUP_NAME;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price, createdAt, updatedAt } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
      createdAt,
      updatedAt
    });

    await ticket.save();
    msg.ack();

  }

}
