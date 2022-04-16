import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@microservice-tickets/common";
import { Message } from "node-nats-streaming";
import { QUEQUE_GROUP_NAME } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = QUEQUE_GROUP_NAME;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        await expirationQueue.add({ orderId: data.id }, { delay });
        msg.ack();
    }

}