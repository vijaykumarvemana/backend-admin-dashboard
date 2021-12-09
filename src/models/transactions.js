//* Dependencies
import mongoose from "mongoose"
import CustomerModel from "../customers/schema.js"

//* Mongo DB schema
const TransactionSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  // TODO Add a ref to contacts so that transactions can be associated with a specific contact. Should follow similar syntax to the user property above
  trxName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
  },
  revenue: {
    type: Number,
  },
  dateOpened: {
    type: Date,
    default: Date.now,
    required: true,
  },
  dateClosed: {
    type: Date,
    default: null,
  },
  note: {
    type: String,
  },
  expectedCloseDate: {
    type: Date,
    required: true,
  },
});

//* Exports schema
export default mongoose.model("transaction", TransactionSchema);
