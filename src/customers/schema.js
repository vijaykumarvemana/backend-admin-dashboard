import mongoose from 'mongoose'
const { Schema, model } = mongoose;

const CunstomerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    avatar: { type: String },
    note: { type: String, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }

});

CunstomerSchema.methods.toJSON = function () {
    const customerDocument = this
    const customerObject = customerDocument.toObject()
   const id = customerObject._id
    delete customerObject.__v

    return {
        ...customerObject,
        id
    }

}
  export default model('Customer', CunstomerSchema);
