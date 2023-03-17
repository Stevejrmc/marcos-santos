import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  country: { type: String, required: true },
  userId: { type: Number, required: true },
  role: { type: String, default: "user" }
});

const User = mongoose.model("User", userSchema);
export default User;