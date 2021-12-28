import { Ticket } from "../ticket";

it('implements optimistic concurrency control', async () => {
    // create an instance of a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: 'abcd'
    });

    // save the ticket
    await ticket.save();

    // fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // make two separate changes to the tickets we fetched
    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    // save the first fetched ticket
    await firstInstance!.save();

    // save the second fetched ticket and expect error
    try {
        await secondInstance!.save();
    } catch (error) {
        return;
    }
    throw new Error('Should not reach this point');
});

it('increments version number on multiple saves', async () => {
    // create an instance of a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: 'abcd'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
    await ticket.save();
    expect(ticket.version).toEqual(3);
});
