import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@microservice-tickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";


const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString(),
        status: OrderStatus.Created,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 10
        },
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg };
};

it('creates and saves a order', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const createdOrder = await Order.findById(data.id);

    expect(createdOrder).toBeDefined();
    expect(createdOrder!.id).toEqual(data.id);
    expect(createdOrder!.userId).toEqual(data.userId);
    expect(createdOrder!.status).toEqual(data.status);
    expect(createdOrder!.price).toEqual(data.ticket.price);
    expect(createdOrder!.version).toEqual(data.version);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});
