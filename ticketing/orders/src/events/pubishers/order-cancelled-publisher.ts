import { OrderCancelledEvent, Publisher, Subjects } from "@microservice-tickets/common";
import { natsWrapper } from "../../nats-wrapper";

class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

export const orderCancelledPublisher = new OrderCancelledPublisher(natsWrapper.client);
