import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@microservice-tickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { QUEQUE_GROUP_NAME } from "./queue-group-name";


export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = QUEQUE_GROUP_NAME;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId
        });

        await order.save();

        msg.ack();
    }

}