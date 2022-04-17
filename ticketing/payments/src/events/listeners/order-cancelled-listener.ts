import {
    Listener, OrderCancelledEvent,
    OrderCreatedEvent, OrderStatus, Subjects
} from "@microservice-tickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { QUEQUE_GROUP_NAME } from "./queue-group-name";


export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName: string = QUEQUE_GROUP_NAME;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {

        const order = await Order.findByEvent({ id: data.id, version: data.version });

        if (!order) throw new Error('Order not found');

        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        msg.ack();
    }

}