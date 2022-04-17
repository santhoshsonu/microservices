import mongoose from "mongoose";
import { OrderCancelledEvent, OrderStatus } from "@microservice-tickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";


const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
    });

    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString()
        },
        version: order.version + 1
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, order, data, msg };
};

it('updates the status of the order', async () => {
    const { listener, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(data.id);

    expect(updatedOrder).toBeDefined();
    expect(updatedOrder!.id).toEqual(data.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    expect(updatedOrder!.userId).toEqual(order.userId);
    expect(updatedOrder!.price).toEqual(order.price);
    expect(updatedOrder!.version).toEqual(data.version);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});
