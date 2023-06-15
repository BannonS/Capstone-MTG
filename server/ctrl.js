const axios = require('axios');

let cache = {};

async function handleSearch(req, res) {
  const params = req.query;

  if (cache[params.query]) {
    return res.json(cache[params.query]);
  }

  setTimeout(async function () {
    const query = encodeURIComponent(params.query);
    const url = `https://api.scryfall.com/cards/search?q=${query}`;

    try {
      const response = await axios.get(url);
      const data = response.data.data;

      cache[params.query] = data;
      res.json(data);
    } catch (error) {
      console.error('Scryfall API error:', error);
      res.status(500).send('Error fetching data from Scryfall API');
    }
  }, 100);
}

module.exports = { handleSearch };
