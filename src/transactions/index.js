import express from 'express';
import createHttpError from 'http-errors';
import TransactionModel from "./schema.js"
import CustomerModel from "../customers/schema.js"


const transactionRouter = express.Router();


transactionRouter.get('/', async (req, res, next) => {
    try {
        const transactions = await TransactionModel.find().populate('customer product');
        res.send(transactions);
    } catch (err) {
        next(err);
    }
});

transactionRouter.post('/', async (req, res, next) => {
    try{
        const transaction = new TransactionModel(req.body);
        const {_id} = await transaction.save();
        res.send({_id});
    }   catch (err) {
        next(err);
    }
});



      
 export default transactionRouter;
