export function getImageUrl(url) {
    if (!url) {
      return "./ExampleResources/popcorn.png"; // or return a default image URL
    }
    return url.includes("artworks.thetvdb.com") ? url : `https://artworks.thetvdb.com${url}`;
  }
  
  