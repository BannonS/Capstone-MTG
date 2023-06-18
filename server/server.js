// Section 1: Server
const express = require('express');
const cors = require('cors');
const { handleSearch } = require('./ctrl'); // Importing handleSearch from ctrl.js
require('dotenv').config()

const app = express(); 

app.use(express.json())
app.use(cors());

const { PORT } = process.env;
let deck = [];

app.get('/search', handleSearch);

// ADDING TO DECK 
app.post('/deck', (req, res) => {
  const { cardId, cardName } = req.body;

  if (typeof cardId === 'string' && typeof cardName === 'string' && cardId.trim() !== '') {
    deck.push({ id: cardId, name: cardName });
    return res.json({ message: 'Card added successfully to deck', cardId: cardId, cardName: cardName });
  } else if (Array.isArray(cardId) && Array.isArray(cardName) && cardId.length === cardName.length) {
    cardId.forEach((id, index) => {
      if (typeof id === 'string' && typeof cardName[index] === 'string' && id.trim() !== '') {
        deck.push({ id, name: cardName[index] });
      } else {
        return res.status(400).json({ error: 'Invalid cardId or cardName in arrays' });
      }
    });
    return res.json({ message: `${cardId.length} cards added successfully to deck`, cardIds: cardId, cardNames: cardName });
  } else {
    return res.status(400).json({ error: 'Invalid cardId or cardName' });
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`)) 

