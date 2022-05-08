import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@microservice-tickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { QUEQUE_GROUP_NAME } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = QUEQUE_GROUP_NAME;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);
        if (!order) throw new Error("Order not found");

        order.set({ status: OrderStatus.Complete });
        await order.save();

        msg.ack();
    }

}