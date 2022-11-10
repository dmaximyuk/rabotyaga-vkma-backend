import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: Number,
    checkin: String,
    experience: Number,
    balance: Number,
    ban: {
      date: Number,
      time: Number,
      status: Boolean,
    },
  },
  {
    collection: "users",
  }
);

export default mongoose.model("users", userSchema);
