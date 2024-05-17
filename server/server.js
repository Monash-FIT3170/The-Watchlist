// server.js
const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3001;

app.get('/movies', async (req, res) => {
  const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const collection = client.db('TheWatchList').collection('Movie');
    const movies = await collection.find().toArray();
    res.json(movies);
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});