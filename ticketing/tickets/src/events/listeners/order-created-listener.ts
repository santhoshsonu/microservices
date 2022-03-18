import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@microservice-tickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { QUEQUE_GROUP_NAME } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = QUEQUE_GROUP_NAME;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        ticket.set({ orderId: data.id });
        await ticket.save();

        // Saving ticket updates the version
        // Notify other services that ticket version is updated
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt,
            orderId: ticket.orderId,
            version: ticket.version
        });

        msg.ack();
    }

}