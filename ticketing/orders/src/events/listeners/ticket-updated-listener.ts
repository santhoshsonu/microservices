import { Listener, Subjects, TicketUpdatedEvent } from "@microservice-tickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { QUEQUE_GROUP_NAME } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = QUEQUE_GROUP_NAME;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    const { title, price, updatedAt } = data;
    ticket.set({ title, price, updatedAt });
    await ticket.save();
    msg.ack();
  }

}
