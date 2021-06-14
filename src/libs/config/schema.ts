import mongoose from 'mongoose';

const SaveUser = new mongoose.Schema({
  id: Number,
  checkin: String,
  exp: Number,
  balance: Number,
  bonus: Number,
  transfer: Number,
  business: {
    payback: Number,
    business: Number,
  },
  job: {
    jobparttime: Number,
    job: Number,
    payback: Number,
  },
}, {
  collection: 'Users',
  minimize: false,
});

export default mongoose.model('Users', SaveUser);
