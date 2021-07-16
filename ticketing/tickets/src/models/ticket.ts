import mongoose from 'mongoose';

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
};

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      const id = ret._id;
      delete ret._id;
      ret.id = id;
      return ret;
    }
  }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
