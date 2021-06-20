const express = require('express');
const data = require('./data.json');

const app = express();
const port = 80;

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});

app.get('/service/suggest/tracks', (req, res) => {
  const prefix = req.query.prefix;
  const allDiscography = data.releases;
  const prefixRegex = new RegExp(`^${prefix}`, 'i');
  const suggestions = [];

  for (const release of allDiscography) {
    for (const track of release.TrackList) {
      const trackTitle = track.Title;
      if (prefixRegex.test(trackTitle)) {
        const newSuggestion = { 
          title: trackTitle,
          duration: track.Duration,
          release: {
            id: release.Id,
            title: release.Title,
            notes: release.Notes,
          }
        };
        suggestions.push(newSuggestion);
        if (suggestions.length === 5) {
          break;
        }
      }
    }
    if (suggestions.length === 5) {
      break;
    }
  }

  res.json({
    suggestions,
  });
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