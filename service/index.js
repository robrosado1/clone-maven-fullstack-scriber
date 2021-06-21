const express = require('express');
const data = require('./data.json');
const { 
  formulateTrackSuggestionFromTrackAndRelease,
  formulateArtistSuggestionFromArtistAndRelease,
  formulateReleaseSuggestionFromRelease,
} = require('./utils');

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
        const newSuggestion = formulateTrackSuggestionFromTrackAndRelease(track, release);
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
        const newArtistSuggestion = formulateArtistSuggestionFromArtistAndRelease(artist, release);
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
      const newSuggestion = formulateReleaseSuggestionFromRelease(release);
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
  const allDiscography = data.releases;
  const prefixRegex = new RegExp(`^${prefix}`, 'i');
  const trackSuggestions = [];
  const releaseSuggestions = [];
  const matchingArtistsSeenMap = new Map();

  for (const release of allDiscography) {
    const totalSuggestions = trackSuggestions.length + releaseSuggestions.length + matchingArtistsSeenMap.size;
    if (totalSuggestions >= 5) {
      break;
    }
    // check for matching tracks
    for (const track of release.TrackList) {
      const trackTitle = track.Title;
      if (prefixRegex.test(trackTitle) && totalSuggestions < 5) {
        const newSuggestion = formulateTrackSuggestionFromTrackAndRelease(track, release);
        trackSuggestions.push(newSuggestion);
      }
    }

    // check for matching artists
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
      } else if (prefixRegex.test(artistName) && totalSuggestions < 5) {
        const newArtistSuggestion = formulateArtistSuggestionFromArtistAndRelease(artist, release);
        matchingArtistsSeenMap.set(artistId, newArtistSuggestion);
      }
    }

    // check if the release matches
    if (prefixRegex.test(release.Title) && totalSuggestions < 5) {
      const newSuggestion = formulateReleaseSuggestionFromRelease(release);
      releaseSuggestions.push(newSuggestion);
    }
  }

  res.json({
    artists: Array.from(matchingArtistsSeenMap, ([_artistId, suggestion]) => suggestion),
    tracks: trackSuggestions,
    releases: releaseSuggestions,
  });
});