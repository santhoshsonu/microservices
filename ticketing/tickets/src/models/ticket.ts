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
  version: number;
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
  toJSON: {
    transform: (doc, ret) => {
      const id = ret._id;
      delete ret._id;
      ret.id = id;
      return ret;
    }
  },
  optimisticConcurrency: true
});

ticketSchema.set('versionKey', 'version');

ticketSchema.pre('save', function (next) {
  const versionKey = this.get('versionKey');
  this.$where = {
    ...this.$where,
    [versionKey]: this[versionKey],
  };

  // Increment the version atomically
  this.increment();

  // Invoke next hook
  next();
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket, TicketDoc };
