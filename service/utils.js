/**
 * @param track Specific track from the release's tracklist
 * @param release Specific release for this track
 * @returns track suggestion object 
 */
const formulateTrackSuggestionFromTrackAndRelease = (track, release) => {
  const trackTitle = track.Title;
  return { 
    title: trackTitle,
    duration: track.Duration,
    release: {
      id: release.Id,
      title: release.Title,
      notes: release.Notes,
    }
  };
};

/**
 * @param {object} artist Specific artist from the release's Artists list
 * @param release Specific release for this artist
 * @returns artist suggestion object 
 */
const formulateArtistSuggestionFromArtistAndRelease = (artist, release) => {
  const artistName = artist.Name;
  const artistId = artist.Id;
  return { 
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
};

/**
 * @param release Singular release object from discography data
 * @returns release suggestion object
 */
const formulateReleaseSuggestionFromRelease = (release) => {
  return { 
    id: release.Id,
    title: release.Title,
    notes: release.Notes,
    artist: release.Artists.map(artist => ({ id: artist.Id, name: artist.Name })),
  };
}

module.exports = {
  formulateTrackSuggestionFromTrackAndRelease,
  formulateArtistSuggestionFromArtistAndRelease,
  formulateReleaseSuggestionFromRelease,
};
