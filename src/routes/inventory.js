//* Dependencies
import express from "express";

import { auth } from "../middleware/auth.js";
import { check, validationResult } from "express-validator";

//* Models
import Inventory from "../models/inventory.js";
import User from "../models/user.js";

//*     @route:     GET api/inventory
//*     @desc:      Get all user's inventory
//*     @access:    Private

const inventoryRouter = express.Router();
inventoryRouter.get('/', auth, async (req, res) => {
  try {
    const items = await Inventory.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//*     @route:     POST api/inventory
//*     @desc:      Add new inventory
//*     @access:    Private
inventoryRouter.post(
  '/',
  [auth, [check('name', 'Name is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //* Destructuring req.body
    const { name, purchased, location, cost, value, status } = req.body;

    try {
      const newInventory = new Inventory({
        name,
        purchased,
        location,
        cost,
        value,
        status,
        user: req.user.id,
      });

      const inventory = await newInventory.save();

      res.json(inventory);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//*     @route:     PUT api/inventory/:id
//*     @desc:      Update inventory
//*     @access:    Private
inventoryRouter.put('/:id', auth, async (req, res) => {
  const { name, purchased, location, cost, value, status } = req.body;

  //* Checks DOM for user input and changes the corresponding value as needed
  const inventoryFields = {};
  if (name) inventoryFields.name = name;
  if (purchased) inventoryFields.purchased = purchased;
  if (location) inventoryFields.location = location;
  if (cost) inventoryFields.cost = cost;
  if (value) inventoryFields.value = value;
  if (status) inventoryFields.status = status;

  try {
    //*Searches database for inventory associated with requested id
    let inventory = await Inventory.findById(req.params.id);

    if (!inventory)
      return res.status(404).json({ msg: 'Inventory not found ' });

    //* Ensure user owns inventory
    if (inventory.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      { $set: inventoryFields },
      { new: true }
    );

    res.json(inventory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//*     @route:     DELETE api/inventory/:id
//*     @desc:      Delete inventory
//*     @access:    Private
inventoryRouter.delete('/:id', auth, async (req, res) => {
  try {
    let inventory = await Inventory.findById(req.params.id);

    if (!inventory)
      return res.status(404).json({ msg: 'Inventory not found ' });

    //* Ensure user owns inventory
    if (inventory.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Inventory.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Inventory removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default inventoryRouter;
