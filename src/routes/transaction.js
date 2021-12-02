//* Dependencies
import express from "express";
import { auth } from "../middleware/auth.js";
import { check, validationResult } from "express-validator";

//* Models
import Transaction from "../models/transactions.js";
import User from "../models/user.js"
import Contact from "../models/contact.js";
//* @route: GET api/transactions
//* @desc: Get all user's transactions
//* @access: Private

const  transRouter = express.Router();
transRouter.get("/", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({
      date: -1,
    });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//* @route: POST api/transactions
//* @desc: Add new transaction
//* @access: Private
transRouter.post(
  "/",
  [
    auth,
    [
      check("trxName", "Transaction name is required").not().isEmpty(),
      check("type", "Please select a transaction type").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //* Destructuring req.body
    const {
   
      trxName,
      type,
      cost,
      revenue,
      dateOpened,
      dateClosed,
      expectedCloseDate,
      note,
    } = req.body;

    try {
      const newTransaction = new Transaction({
        trxName,
        type,
        cost,
        revenue,
        dateOpened,
        dateClosed,
        expectedCloseDate,
        note,
       
      });

      const transaction = await newTransaction.save();

      res.json(transaction);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//* @route: PUT api/transactions:id
//* @desc: Update transaction
//* @access: Private
transRouter.put("/:id", auth, async (req, res) => {
  const {
    trxName,
    type,
    cost,
    revenue,
    dateOpened,
    dateClosed,
    expectedCloseDate,
    note,
  } = req.body;

  //* Build transaction object
  const transactionFields = {};
  if (trxName) transactionFields.trxName = trxName;
  if (type) transactionFields.type = type;
  if (cost) transactionFields.cost = cost;
  if (revenue) transactionFields.revenue = revenue;
  if (dateOpened) transactionFields.dateOpened = dateOpened;
  if (dateClosed) transactionFields.dateClosed = dateClosed;
  if (note) transactionFields.note = note;
  if (expectedCloseDate)
    transactionFields.expectedCloseDate = expectedCloseDate;

  try {
    //*Searches database for transaction associated with requested id
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction)
      return res.status(404).json({ msg: "Transaction not found" });

    //* Ensure user owns transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized!" });
    }

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: transactionFields },
      { new: true }
    );

    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//* @route: DELETE api/transactions/:id
//* @desc: Delete transaction
//* @access: Private
transRouter.delete("/:id", auth, async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction)
      return res.status(404).json({ msg: "Transaction not found" });

    //* Ensure user owns transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Transaction.findByIdAndRemove(req.params.id);

    res.json({ msg: "Transaction removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default transRouter;
