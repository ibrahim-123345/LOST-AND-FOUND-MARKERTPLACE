const Match = require('../models/matchingModels');
const {Dbconnection}=require('../config/connectionURI');


const createMatch = async (req, res) => {
  const incoming = req.body;

  try {
    const matchList = Array.isArray(incoming) ? incoming : [incoming];

    await Dbconnection();

    const savedMatches = await Match.insertMany(matchList);
    console.log('Matches inserted:', savedMatches);

    res.status(201).json({
      message: 'Matches created successfully',
      data: savedMatches
    });
  } catch (err) {
    console.error('Error inserting matches:', err);
    res.status(500).json({ error: 'Failed to insert matches' });
  }
};

const getAllMatches = async (req, res) => {
  try {
    await Dbconnection();
    const matches = await Match.find().sort({ createdAt: -1 });
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ message: 'Error fetching matches', error });
  }
};

const getMatchById = async (req, res) => {
  try {
        await Dbconnection();

    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching match', error });
  }
};

const updateMatch = async (req, res) => {
  try {
        await Dbconnection();

    const updatedMatch = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMatch) return res.status(404).json({ message: 'Match not found' });
    res.status(200).json(updatedMatch);
  } catch (error) {
    res.status(500).json({ message: 'Error updating match', error });
  }
};

const deleteMatch = async (req, res) => {
  try {
        await Dbconnection();

    const deletedMatch = await Match.findByIdAndDelete(req.params.id);
    if (!deletedMatch) return res.status(404).json({ message: 'Match not found' });
    res.status(200).json({ message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting match', error });
  }
};


module.exports = {
    createMatch,
    getAllMatches,
    getMatchById,
    updateMatch,
    deleteMatch
    };