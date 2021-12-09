import mogoose from 'mongoose';
const { Schema, model } = mogoose;
import CustomerModel from '../customers/schema.js'
import ProductModel from '../products/schema.js'


const transactionSchema = new Schema({
    customer: {   
        type: mogoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },
    product: {
        type: mogoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    Date: {
        type: Date,
        default: Date.now,
    },
    Amount: {
        type: Number,
        default: 0,
    },
    Status: {
        type: String,
        default: 'Pending',
    },
    revenue: {
        type: Number,
        default: 0,
    },
    cost: {
        type: Number,
        default: 0,
    },
    profit: {
        type: Number,
        default: 0,
    },
});

transactionSchema.methods.calculateProfit = function() {
    this.profit = this.revenue - this.cost;
}
transactionSchema.methods.calculateRevenue = function() {
    this.revenue = this.Amount * this.product.price;
}   
transactionSchema.methods.calculateCost = function() {
    this.cost = this.Amount * this.product.cost;
}   
transactionSchema.methods.calculateAmount = function() {
    this.Amount = this.product.amount;
}
transactionSchema.methods.calculateAll = function() {
    this.calculateAmount();
    this.calculateCost();
    this.calculateRevenue();
    this.calculateProfit();
}
 transactionSchema.methods.updateStatus = function() {
    if (this.profit > 0) {
        this.Status = 'Success';
    } else if (this.profit < 0) {
        this.Status = 'Failed';
    } else {
        this.Status = 'Pending';
    }
}   
transactionSchema.methods.updateAll = function() {
    this.calculateAll();
    this.updateStatus();
}

transactionSchema.methods.toJSON = function() {
    const transaction = this.toObject();
    const id = transaction._id;
    delete transaction.__v;

    return {
        ...transaction,
        id,
}   
}

export default model('Transaction', transactionSchema);

