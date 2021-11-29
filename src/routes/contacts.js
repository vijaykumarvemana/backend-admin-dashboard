//* Dependencies
import express from "express"

import { auth } from "../middleware/auth.js"
import { check, validationResult } from "express-validator"

//* Models
import Contact from '../models/contact.js'
import User from '../models/user.js'

//*     @route:     GET api/contacts
//*     @desc:      Get all user's contacts
//*     @access:    Private
const contactRouter = express.Router();

contactRouter.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//*     @route:     POST api/contacts
//*     @desc:      Add new contact
//*     @access:    Private
contactRouter.post(
  "/",
  [auth, [check("name", "Name is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //* Destructuring req.body
    const {
      name,
      email,
      phone,
      streetNumber,
      street,
      address2,
      city,
      state,
      zipcode,
      type,
      note
    } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        streetNumber,
        street,
        address2,
        city,
        state,
        zipcode,
        type,
        note,
        user: req.user.id,
      });

      const contact = await newContact.save();

      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//*     @route:     PUT api/contacts/:id
//*     @desc:      Update contact
//*     @access:    Private
contactRouter.put("/:id", auth, async (req, res) => {
  const {
    name,
    email,
    phone,
    streetNumber,
    street,
    address2,
    city,
    state,
    zipcode,
    type,
    note
  } = req.body;

  //* Checks DOM for user input and changes the corresponding value as needed
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (streetNumber) contactFields.streetNumber = streetNumber;
  if (street) contactFields.street = street;
  if (address2) contactFields.address2 = address2;
  if (city) contactFields.city = city;
  if (state) contactFields.state = state;
  if (zipcode) contactFields.zipcode = zipcode;
  if (type) contactFields.type = type;
  if (note) contactFields.note = note;

  try {
    //*Searches database for contact associated with requested id
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: "Contact not found " });

    //* Ensure user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//*     @route:     DELETE api/contacts/:id
//*     @desc:      Delete contact
//*     @access:    Private
contactRouter.delete("/:id", auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: "Contact not found " });

    //* Ensure user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Contact.findByIdAndRemove(req.params.id);

    res.json({ msg: "Contact removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default contactRouter;
