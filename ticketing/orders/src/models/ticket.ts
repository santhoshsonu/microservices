import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: Date,
  updatedAt: Date,

}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    }
  }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id, // Use ticket id as Mongoose Doc ID
    title: attrs.title,
    price: attrs.price,
    createdAt: attrs.createdAt,
    updatedAt: attrs.updatedAt
  });
}

// Run query to look at all orders. Find an Order where the ticket
// is the ticket we just found *and* the order status is *not* cancelled.
// If we find an order from this, that means the ticket *is* reserved.
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this.id,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.Awaiting,
        OrderStatus.Complete
      ]
    }
  });

  return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket, TicketDoc };