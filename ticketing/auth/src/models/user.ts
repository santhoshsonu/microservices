import mongoose from 'mongoose';
import { Password } from '../services/password';

// Interface that describes the props
// that are required for User model creation
interface UserAttrs {
  email: string;
  password: string;
}

// Interface that describes the props
// that User model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// Interface that describes the props
// that User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    console.log(hashed);
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };