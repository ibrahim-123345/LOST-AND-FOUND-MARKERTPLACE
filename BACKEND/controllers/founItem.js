const { Dbconnection } = require("../config/connectionURI");
const { FoundItem, createFoundItem } = require("../models/foundItem");

const foundItemLimit = async (req, res) => {
  try {
    await Dbconnection();
    const items = await FoundItem.find()
      .limit(4)
      .sort({ createdAt: -1 })
      .populate("user"); 
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const foundItems = async (req, res) => {
  try {
    await Dbconnection();
    const items = await FoundItem.find().populate("user"); 
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

const foundItemController = async (req, res) => {
  try {
    const { name, description, dateFound, location, contactInfo, user } = req.body;
    const image = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;

    const newItem = await createFoundItem(
      name,
      description,
      dateFound,
      location,
      contactInfo,
      image,
      user
    );

    res.status(201).json({ message: "Item added successfully", newItem });
  } catch (err) {
    return res.status(500).send("Server error");
  }
};

const deleteFound = async (req, res) => {
  const { id } = req.params;

  try {
    await Dbconnection();
    const deletedItem = await FoundItem.findOneAndDelete({ _id: id });

    if (!deletedItem) {
      return res.status(404).send("Found item not found");
    }

    res.status(200).send("Found item deleted successfully");
  } catch (err) {
    return res.status(500).send("Server error");
  }
};

const singleFound = async (req, res) => {
  const { id } = req.params;

  try {
    await Dbconnection();
    const item = await FoundItem.findOne({ _id: id }).populate("user"); 
    res.status(200).json(item);
  } catch (err) {
    return res.status(500).send("Server error");
  }
};

const foundItemUpdate = async (req, res) => {
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
    const update = await FoundItem.findOneAndUpdate({ _id: id }, updateData, {
      new: true,
    });

    if (!update) {
      return res.status(404).send("Found item was not found");
    }

    res.status(200).send("Found item updated successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
};

const itemFoundByUser = async (req, res) => {
  const { id } = req.params;

  try {
    await Dbconnection();
    const item = await FoundItem.find({ user: id }).populate("user"); 
    res.status(200).json(item);
  } catch (err) {
    return res.status(500).send("Server error");
  }
};

module.exports = {
  foundItemController,
  foundItems,
  singleFound,
  foundItemLimit,
  deleteFound,
  foundItemUpdate,
  itemFoundByUser,
};
