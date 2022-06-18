import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { ExpirationCompleteEvent, OrderCancelledEvent, OrderStatus } from "@microservice-tickets/common";
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";
import { ExpirationCompleteListener } from "../expiration-complete-listener";

const setup = async () => {
    // create an instance of Ticket listener
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    // create and save a ticket
    const creationDate = new Date();
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 15,
        createdAt: creationDate,
        updatedAt: creationDate
    });
    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'asdasdads',
        expiresAt: new Date(),
        ticket
    });
    await order.save();

    // create a fake event data object
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    };
    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg, order, ticket };
};

it('updates the order status to cancelled', async () => {
    const { listener, data, msg, order } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits the order cancelled event', async () => {
    const { listener, data, msg, order } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const cancelledOrder: OrderCancelledEvent['data'] = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );
    expect(cancelledOrder.id).toEqual(order.id);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});
