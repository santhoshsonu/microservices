import { PaymentCreatedEvent, Publisher, Subjects } from "@microservice-tickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}