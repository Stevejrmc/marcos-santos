import mongoose from "mongoose";
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  profile: {
    age: { type: Number, min: 18 },
    weight: { type: Number, min: 90, max: 400 },
  },
  billing: {
    cc: Number,
    exp: String,
    name: String,
    cvv: Number,
    address: {
      street: String,
      city: String,
      state: String,
      zip: Number
    }
  },
  userId: String,
});

const Account = mongoose.model("Account", accountSchema);
export default Account;