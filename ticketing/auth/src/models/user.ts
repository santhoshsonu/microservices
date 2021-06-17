import mongoose from 'mongoose';

// Interface for User creation
interface UserAttrs {
  email: string;
  password: string;
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

const User = mongoose.model('User', userSchema);

const buildUser = (attrs: UserAttrs) => {
  return new User(attrs);
}

export { User, buildUser };