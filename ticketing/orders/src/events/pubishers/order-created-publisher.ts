import { OrderCreatedEvent, Publisher, Subjects } from "@microservice-tickets/common";
import { natsWrapper } from "../../nats-wrapper";

class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

export const orderCreatedPublisher = new OrderCreatedPublisher(natsWrapper.client);
