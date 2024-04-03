const express = require('express');
const axios = require('axios');

const app = express();
const windowSize = 10;
let window = [];

app.get('/numbers/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const response = await axios.get(`http://localhost:3000/numbers?id=${id}`);
    const numbers = response.data;

    if (numbers.length > 0) {
      const num = numbers[0];
      window.push(num);

      if (window.length > windowSize) {
        window.shift();
      }

      let sum = 0;
      for (const num of window) {
        sum += num;
      }

      const avg = sum / window.length;

      res.json({
        windowPrevState: window.slice(0, -1),
        windowCurrState: window,
        numbers: numbers,
        avg: parseFloat(avg.toFixed(2))
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching numbers' });
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});