import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedEvent } from "@microservice-tickets/common";
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';

const setup = async () => {
    // create an instance of Ticket listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // create and save a ticket
    const creationDate = new Date();
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 15,
        createdAt: creationDate,
        updatedAt: creationDate
    });

    await ticket.save();

    // create a fake event data object
    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: 'concert1',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
        createdAt: creationDate,
        updatedAt: new Date(creationDate.getTime() + 1000)
    };
    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg, ticket };
};

it('finds, updates and saves a ticket', async () => {
    const { listener, data, msg, ticket } = await setup();

    // call onMessage function with fake data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure the ticket is created!
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
    expect(updatedTicket!.updatedAt).toEqual(data.updatedAt);
});

it('acks the message', async () => {
    const { listener, data, msg, ticket } = await setup();

    // call onMessage function with fake data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure the ack function is called
    expect(msg.ack).toHaveBeenCalled();
});

it('should not call the ack if the event has a skipped version number', async () => {
    const { listener, data, msg, ticket } = await setup();

    data.version = 10;

    // call onMessage function with fake data object + message object
    try {
        await listener.onMessage(data, msg);
    } catch (error) { }

    // write assertions to make sure the ack function is called
    expect(msg.ack).not.toHaveBeenCalled();
});

