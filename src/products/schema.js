import mongoose from  'mongoose'

const { Schema, model} = mongoose


const productSchema  = new Schema({
   
    name: {type: String, required: true},
    image:{ type: String},
    stock: {type: Number, required: true},
    status: {type: String, required: true},
    price:{type: Number, required: true},
})

productSchema.methods.toJSON = function () {
  

  const productDocument = this
  const productObject = productDocument.toObject()
  const id = productObject._id
  delete productObject.__v
   

  return {
    ...productObject,
    id,
  }
  
}


export default model("Product", productSchema)




