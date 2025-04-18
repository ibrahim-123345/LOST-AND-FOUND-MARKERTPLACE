const { Dbconnection } = require("../config/connectionURI");
const { FoundItem, createFoundItem } = require("../models/foundItem");

// Fetch all lost items
const foundItemLimit = async (req, res) => {
  try {
    await Dbconnection();
    const items = await FoundItem.find().limit(4).sort({ createdAt: -1 });
    res.status(200).json(items);
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const foundItems = async (req, res) => {
  try {
    await Dbconnection();
    const items = await FoundItem.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

const foundItemController = async (req, res) => {
  try {
    const { name, description, dateFound, location, contactInfo, user } =
      req.body;
      //console.log(req.body)
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
  console.log(id);

  try {
    await Dbconnection();
    const deletedItem = await FoundItem.findOneAndDelete({ _id: id });

    if (!deletedItem) {
      return res.status(404).send("Lost item not found");
    }

    res.status(200).send("Lost item deleted successfully");
  } catch (err) {
    return res.status(500).send("Server error");
  }
};

const singleFound = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    await Dbconnection();
    const item = await FoundItem.findOne({ _id: id });
    res.status(200).json(item);
  } catch (err) {
    return res.status(500).send("Server error");
  }
};

const foundItemUpdate = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    await Dbconnection();
    const update = await FoundItem.findOneAndUpdate({ _id: id }, updateData, {
      new: true,
    });

    if (!update) {
      return res.status(404).send(" item was not found");
    }

    res.status(200).send("found item updated successfully");
  } catch (err) {
    return res.status(500).send("Server error");
  }
};

const itemFoundByUser = async (req, res) => {
  const { id } = req.params;

  try {
    await Dbconnection();
    const item = await FoundItem.find({ user: id });
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
