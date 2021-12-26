import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    id: Number,
    checkin: String,
    ban: Number,
    exp: Number,
    balance: Number,
    bonus: Number,
  },
  {
    collection: "users",
  }
);

export default mongoose.model("users", UserSchema);
