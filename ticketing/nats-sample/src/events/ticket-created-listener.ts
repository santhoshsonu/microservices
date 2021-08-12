import { Message } from "node-nats-streaming";
import { Listener } from "./listener";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log(
      `Event Data => Title: ${data.title}, Price: ${data.price}`
    );
    // Acknowledge the message
    msg.ack();
  }

}