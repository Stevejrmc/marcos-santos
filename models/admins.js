import mongoose from "mongoose";
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  adminId: { type: String, required: true }
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;