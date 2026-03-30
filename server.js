const express = require('express');
const cors = require('cors');
const scraperApp = require('./scraperApp');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/search', async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }

  try {
    const data = await scraperApp(keyword);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});