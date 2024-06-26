// DummyTVs.js
const dummyTVs = [
  {
    id: 1,
    title: "Seinfeld",
    overview: "A stand-up comedian and his three offbeat friends weather the pitfalls and payoffs of life in New York City in the '90s.",
    image_url: "./ExampleResources/seinfeld.jpg",
    first_aired: new Date("1989-07-05"),
    last_aired: new Date("1998-05-14"),
    rating: 9.0,
    age_rating: "PG",
    seasons: [
      "Season 1",
      "Season 2",
      "Season 3"
      // Add more seasons as needed
    ]
  },
  {
    id: 2,
    title: "Friends",
    overview: "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.",
    image_url: "./ExampleResources/friends.jpg",
    first_aired: new Date("1994-09-22"),
    last_aired: new Date("2004-05-06"),
    rating: 8.5,
    age_rating: "PG",
    seasons: [
      "Season 1",
      "Season 2",
      "Season 3"
      // Add more seasons as needed
    ] // Example placeholder, no detailed seasons/episodes provided
  },
  {
    id: 3,
    title: "Planet Earth",
    overview: "A groundbreaking series narrated by David Attenborough, exploring the wild and beautiful parts of our planet like never before.",
    image_url: "./ExampleResources/planet-earth.jpeg",
    first_aired: new Date("2006-03-05"),
    last_aired: new Date("2006-12-10"),
    rating: 9.7,
    age_rating: "G",
    seasons: [] // Example placeholder, no detailed seasons/episodes provided
  },
  {
    id: 4,
    title: "The Fresh Prince of Bel-Air",
    overview: "The misadventures of a wealthy family where Will Smith, the Philadelphia-born wise-cracking teen, is sent to live with his aunt and uncle.",
    image_url: "./ExampleResources/fresh-prince.jpg",
    first_aired: new Date("1990-09-10"),
    last_aired: new Date("1996-05-20"),
    rating: 8.8,
    age_rating: "PG",
    seasons: [] // Example placeholder, no detailed seasons/episodes provided
  }
];

export default dummyTVs;
