import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from "@microservice-tickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCancelledPublisher } from "../pubishers/order-cancelled-publisher";
import { QUEQUE_GROUP_NAME } from "./queue-group-name";


export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName: string = QUEQUE_GROUP_NAME;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);
        if (!order) throw new Error("Order not found");

        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });

        msg.ack();
    }

}