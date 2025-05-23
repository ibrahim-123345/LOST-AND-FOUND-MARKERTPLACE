const { Dbconnection } = require("../config/connectionURI");
const { LostItem, createLostItem } = require("../models/losItem");
const express = require("express");
const app = express();

// Fetch recent 4 lost items with user populated
const lostItem = async (req, res) => {
  try {
    await Dbconnection();
    const items = await LostItem.find()
      .limit(4)
      .sort({ createdAt: -1 })
      .populate("user"); 
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

const lostItems = async (req, res) => {
  try {
    await Dbconnection();
    const items = await LostItem.find().populate("user"); 
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

const lostItemController = async (req, res) => {
  try {
    await Dbconnection();
    const { name, description, dateLost, location, contactInfo, user } = req.body;
    const image = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;

    const newItem = await createLostItem(
      name,
      description,
      dateLost,
      location,
      contactInfo,
      image,
      user
    );

    res.status(201).json({ message: "Item added successfully", newItem });
  } catch (error) {
    res.status(400).json({ error: "Bad Request - Invalid Data" });
  }
};

const lostItemId = async (req, res) => {
  const { id } = req.params;
  try {
    await Dbconnection();
    const item = await LostItem.findById(id).populate("user"); // 
    if (!item) {
      return res.status(404).send("Item not found");
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

const deleteLostItem = async (req, res) => {
  const { id } = req.params;
  try {
    await Dbconnection();
    const deletedItem = await LostItem.findOneAndDelete({ _id: id });
    if (!deletedItem) {
      return res.status(404).send("Lost item not found");
    }
    res.status(200).send("Lost item deleted successfully");
  } catch (err) {
    return res.status(500).send("Server error");
  }
};

const LostItemUpddate = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const image = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : null;

  const updateData = {
    ...data,
    ...(image && { image }),
  };

  try {
    await Dbconnection();
    const update = await LostItem.findOneAndUpdate({ _id: id }, updateData, {
      new: true,
    });

    if (!update) {
      return res.status(404).send("Lost item was not found");
    }

    res.status(200).send("Lost item updated successfully");
  } catch (err) {
    return res.status(500).send("Server error");
  }
};

const itemLostByUser = async (req, res) => {
  const { id } = req.params;
  try {
    await Dbconnection();
    const item = await LostItem.find({ user: id }).populate("user"); 
    res.status(200).json(item);
  } catch (err) {
    return res.status(500).send("Server error");
  }
};

module.exports = {
  lostItemController,
  lostItemId,
  lostItem,
  lostItems,
  deleteLostItem,
  LostItemUpddate,
  itemLostByUser,
};
