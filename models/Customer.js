import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String },
  dateOfBirth: { type: Date },
  memberNumber: { type: Number },
  interests: { type: String },
});

const Customer = mongoose.models.customer || mongoose.model("customer", customerSchema);

export default Customer;


