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

transactionRouter.get('/:id', async (req, res, next) => {
    try {
        const transaction = await TransactionModel.findById(req.params.id).populate('customer product');
        if (!transaction) {
            throw createHttpError(404, 'Transaction not found');
        }
        res.send(transaction);
    } catch (err) {
        next(err);
    }
});

transactionRouter.put('/:id', async (req, res, next) => {
    try {
    
        const transaction = await TransactionModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!transaction) {
            throw createHttpError(404, 'Transaction not found');
        }
        res.send(transaction);
    } catch (err) {
        next(err);
    }
});

transactionRouter.delete('/:id', async (req, res, next) => {
    try {
        const transaction = await TransactionModel.findByIdAndDelete(req.params.id);
        if (!transaction) {
            throw createHttpError(404, 'Transaction not found');
        }
        res.send(transaction);
    } catch (err) {
        next(err);
    }
});




      
 export default transactionRouter;
