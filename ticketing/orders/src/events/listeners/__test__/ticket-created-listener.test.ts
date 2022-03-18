import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { TicketCreatedEvent } from "@microservice-tickets/common";
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';

const setup = async () => {
    // create an instance of Ticket listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // create a fake event data object
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
        createdAt: new Date(),
        updatedAt: new Date()
    };
    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
    const { listener, data, msg } = await setup();

    // call onMessage function with fake data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure the ticket is created!
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    // call onMessage function with fake data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure the ack function is called
    expect(msg.ack).toHaveBeenCalled();
});
