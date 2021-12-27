import { Publisher, Subjects, TicketUpdatedEvent } from "@microservice-tickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}