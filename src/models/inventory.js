//* Dependencies
import mongoose from "mongoose"

//* Mongo DB schema
const InventorySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
    required: true,
  },
  purchased: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
  },
  cost: {
    type: Number,
  },
  value: {
    type: Number,
  },
  status: {
    type: String,
    required: true,
  },
});

export default mongoose.model("inventory", InventorySchema);
