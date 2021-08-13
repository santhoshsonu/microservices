import { Publisher, Subjects, TicketCreatedEvent } from "@microservice-tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}