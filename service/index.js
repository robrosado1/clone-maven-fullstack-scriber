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
  const allDiscography = data.releases;
  const prefixRegex = new RegExp(`^${prefix}`, 'i');
  const matchingArtistsSeenMap = new Map();

  for (const release of allDiscography) {
    for (const artist of release.Artists) {
      const artistName = artist.Name;
      const artistId = artist.Id;
      // This artist is one we are already suggesting so just add this new release to the existing suggestion
      if (matchingArtistsSeenMap.has(artistId)) {
        const suggestedArtist = matchingArtistsSeenMap.get(artistId);
        suggestedArtist.releases.push({
          id: release.Id,
          title: release.Title,
          notes: release.notes,
        });
        matchingArtistsSeenMap.set(artistId, suggestedArtist);
      // this is not an artist we have suggested already but matches the prefix
      } else if (prefixRegex.test(artistName)) {
        // if we have found a new matching artist but it we already have 5 suggestions then skip
        if (matchingArtistsSeenMap.size === 5) {
          continue;
        }
        // otherwise we have room for one more suggested artist so add it to the map
        const newArtistSuggestion = { 
          id: artistId,
          name: artistName,
          releases: [
            {
              id: release.Id,
              title: release.Title,
              notes: release.Notes,
            }
          ],
        };
        matchingArtistsSeenMap.set(artistId, newArtistSuggestion);
      }
    }
  }
  const suggestions = Array.from(matchingArtistsSeenMap, ([_artistId, suggestion]) => suggestion);

  res.json({
    suggestions,
  });
});

app.get('/service/suggest/releases', (req, res) => {
  const prefix = req.query.prefix;
  const allDiscography = data.releases;
  const prefixRegex = new RegExp(`^${prefix}`, 'i');
  const suggestions = [];

  for (const release of allDiscography) {
    const releaseTitle = release.Title;
    if (prefixRegex.test(releaseTitle)) {
      const newSuggestion = { 
        id: release.Id,
        title: releaseTitle,
        notes: release.Notes,
        artist: release.Artists.map(artist => ({ id: artist.Id, name: artist.Name })),
      };
      suggestions.push(newSuggestion);
      if (suggestions.length === 5) {
        break;
      }
    }
  }

  res.json({
    suggestions,
  });
});

app.get('/service/suggest/all', (req, res) => {
  const prefix = req.query.prefix;
  res.send(`Prefix query param for suggesting all was ${prefix}`);
});