const express = require('express');

const app = express();
const port = 80;

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});

app.get('/service/suggest/tracks', (req, res) => {
  const prefix = req.query.prefix;
  res.send(`Prefix query param for suggesting tracks was ${prefix}`);
});

app.get('/service/suggest/artists', (req, res) => {
  const prefix = req.query.prefix;
  res.send(`Prefix query param for suggesting artists was ${prefix}`);
});

app.get('/service/suggest/releases', (req, res) => {
  const prefix = req.query.prefix;
  res.send(`Prefix query param for suggesting releases was ${prefix}`);
});

app.get('/service/suggest/all', (req, res) => {
  const prefix = req.query.prefix;
  res.send(`Prefix query param for suggesting all was ${prefix}`);
});