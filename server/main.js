import { Meteor } from 'meteor/meteor';

// This import is required to register the Methods and Publishers.
import ContentHandler from '../imports/api/server/ContentHandler';
import ListHandler from '../imports/api/server/ListHandler';
import List, { ListCollection } from '../imports/db/List';

import { MovieCollection, TVCollection, Movie, TV } from '../imports/db/Content';

// Example data sourced from a database similar to TVDB

const movieData = [
    {
        "id": 1,
        "title": "Titanic",
        "overview": "Jack and Rose are young lovers who find one another on the maiden voyage of the unsinkable R.M.S. Titanic. But when the doomed luxury liner collides with an iceberg in the frigid North Atlantic, their passionate love affair becomes a thrilling race for survival.",
        "release_year": 1997,
        "runtime": 194,
        "rating": 7.8,
        "image_url": "https://artworks.thetvdb.com/banners/v4/movie/231/posters/642d748b22859.jpg"
    },
    {
        "id": 2,
        "title": "The Matrix",
        "overview": "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
        "release_year": 1999,
        "runtime": 136,
        "rating": 8.7,
        "image_url": "https://artworks.thetvdb.com/banners/movies/169/posters/5f274c00c85c1.jpg"
    },
    {
        "id": 3,
        "title": "Inception",
        "overview": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        "release_year": 2010,
        "runtime": 148,
        "rating": 8.8,
        "image_url": "https://artworks.thetvdb.com/banners/movies/113/posters/2195447.jpg"
    },
    {
        "id": 4,
        "title": "Interstellar",
        "overview": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        "release_year": 2014,
        "runtime": 169,
        "rating": 8.6,
        "image_url": "https://artworks.thetvdb.com/banners/movies/131079/posters/1846628.jpg"
    },
    {
        "id": 5,
        "title": "The Shawshank Redemption",
        "overview": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        "release_year": 1994,
        "runtime": 142,
        "rating": 9.3,
        "image_url": "https://artworks.thetvdb.com/banners/v4/movie/190/posters/6089f8cd44f59.jpg"
    }
];

const tvData = [
    {
        "id": 1,
        "title": "Buffy the Vampire Slayer",
        "overview": "In every generation there is a Chosen One. She alone will stand against the vampires, the demons and the forces of darkness. She is the Slayer.\r\n\r\nBuffy Summers is The Chosen One, the one girl in all the world with the strength and skill to fight the vampires. With the help of her close friends, Willow, Xander, and her Watcher Giles she balances slaying, family, friendships, and relationships.",
        "image_url": "https://artworks.thetvdb.com/banners/posters/70327-1.jpg",
        "first_aired": new Date('1997-03-10'),
        "last_aired": new Date('2003-05-20'),
        "seasons": [
            {
                "season_number": 1,
                "episodes": [
                    {
                        "id": 1,
                        "title": "Welcome to the Hellmouth (1)",
                        "overview": "When teen vampire slayer Buffy tries to start a new life at Sunnydale High, she discovers that the school sits atop a demonic dimensional portal.",
                        "runtime": 43,
                        "image_url": "https://artworks.thetvdb.com/banners/episodes/70327/2.jpg"
                    }
                ]
            }
        ]
    },
    {
        "id": 2,
        "title": "Breaking Bad",
        "overview": "A high school chemistry teacher turned methamphetamine producer in New Mexico partners with a former student to secure his family's financial future while avoiding detection from law enforcement.",
        "image_url": "https://artworks.thetvdb.com/banners/posters/81189-1.jpg",
        "first_aired": new Date('2008-01-20'),
        "last_aired": new Date('2013-09-29'),
        "seasons": [
            {
                "season_number": 1,
                "episodes": [
                    {
                        "id": 1,
                        "title": "Pilot",
                        "overview": "When an unassuming high school chemistry teacher discovers he has a rare form of lung cancer, he teams up with a former student to create and sell methamphetamine in order to secure his family's future.",
                        "runtime": 58,
                        "image_url": "https://artworks.thetvdb.com/banners/episodes/81189/335388.jpg"
                    }
                ]
            }
        ]
    },
    {
        "id": 3,
        "title": "Game of Thrones",
        "overview": "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
        "image_url": "https://artworks.thetvdb.com/banners/posters/121361-1.jpg",
        "first_aired": new Date('2011-04-17'),
        "last_aired": new Date('2019-05-19'),
        "seasons": [
            {
                "season_number": 1,
                "episodes": [
                    {
                        "id": 1,
                        "title": "Winter Is Coming",
                        "overview": "Eddard Stark is torn between his family and an old friend when asked to serve at the side of King Robert Baratheon; Viserys Targaryen forges a new allegiance to strengthen his quest for the Iron Throne.",
                        "runtime": 62,
                        "image_url": "https://artworks.thetvdb.com/banners/episodes/121361/2590861.jpg"
                    }
                ]
            }
        ]
    },
    {
        "id": 4,
        "title": "Stranger Things",
        "overview": "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.",
        "image_url": "https://artworks.thetvdb.com/banners/posters/305288-1.jpg",
        "first_aired": new Date('2016-07-15'),
        "last_aired": new Date('2022-07-01'),
        "seasons": [
            {
                "season_number": 1,
                "episodes": [
                    {
                        "id": 1,
                        "title": "Chapter One: The Vanishing of Will Byers",
                        "overview": "On his way home from a friend's house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.",
                        "runtime": 47,
                        "image_url": "https://artworks.thetvdb.com/banners/episodes/305288/1.jpg"
                    }
                ]
            }
        ]
    },
    {
        "id": 5,
        "title": "The Office",
        "overview": "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
        "image_url": "https://artworks.thetvdb.com/banners/posters/73244-1.jpg",
        "first_aired": new Date('2005-03-24'),
        "last_aired": new Date('2013-05-16'),
        "seasons": [
            {
                "season_number": 1,
                "episodes": [
                    {
                        "id": 1,
                        "title": "Pilot",
                        "overview": "A documentary crew films the office in this sitcom that portrays the everyday lives of the workers at Dunder Mifflin.",
                        "runtime": 23,
                        "image_url": "https://artworks.thetvdb.com/banners/episodes/73244/1.jpg"
                    }
                ]
            }
        ]
    }
];

Meteor.startup(async () => {
    
    // We drop the collection to make sure a broken index is removed.
    // This will eventually need to be removed for obvious reasons!
    console.log("[DEV] DROPPING LIST COLLECTION IN main.js");
    console.log("[DEV] THIS SHOULD BE REMOVED IN FUTURE.")
    await ListCollection.dropCollectionAsync()


    console.log('Inserting movie data...');
    movieData.forEach(movie => {
        Movie.upsert({ id: movie.id }, { $set: movie });
    });

    console.log('Inserting TV show data...');
    tvData.forEach(tvShow => {
        TV.upsert({ id: tvShow.id }, { $set: tvShow });
    });

    const favouriteData = [
        {
            content_id: movieData[0].id,
            title: movieData[0].title,
            image_url: movieData[0].image_url,
            type: "Movie",
            user_rating: 4.8
        },
        {
            content_id: tvData[0].id,
            title: tvData[0].title,
            image_url: tvData[0].image_url,
            type: "TV Show",
            user_rating: 4.5
        },
        {
            content_id: tvData[0].id,
            title: tvData[0].title,
            image_url: tvData[0].image_url,
            type: "Episode",
            user_rating: 4.7,
            episode_details: {
                season_number: tvData[0].seasons[0].season_number,
                episode_number: tvData[0].seasons[0].episodes[0].id
            }
        }
    ];

    const toWatchData = [
        {
            content_id: movieData[1].id,
            title: movieData[1].title,
            image_url: movieData[1].image_url,
            type: "Movie",
            user_rating: 4.5
        },
        {
            content_id: tvData[1].id,
            title: tvData[1].title,
            image_url: tvData[1].image_url,
            type: "TV Show",
            user_rating: 4.7
        }
    ];

    const customData1 = [
        {
            content_id: movieData[2].id,
            title: movieData[2].title,
            image_url: movieData[2].image_url,
            type: "Movie",
            user_rating: 4.9
        },
        {
            content_id: tvData[2].id,
            title: tvData[2].title,
            image_url: tvData[2].image_url,
            type: "TV Show",
            user_rating: 4.6
        }
    ];

    const customData2 = [
        {
            content_id: movieData[3].id,
            title: movieData[3].title,
            image_url: movieData[3].image_url,
            type: "Movie",
            user_rating: 4.7
        },
        {
            content_id: tvData[3].id,
            title: tvData[3].title,
            image_url: tvData[3].image_url,
            type: "TV Show",
            user_rating: 4.8
        }
    ];

    const customData3 = [
        {
            content_id: movieData[4].id,
            title: movieData[4].title,
            image_url: movieData[4].image_url,
            type: "Movie",
            user_rating: 4.9
        },
        {
            content_id: tvData[4].id,
            title: tvData[4].title,
            image_url: tvData[4].image_url,
            type: "TV Show",
            user_rating: 4.9
        }
    ];

    console.log("Inserting list data...")
    List.upsert({
        userId: 1,
        title: "Your Favourites"
    }, {
        userId: 1,
        userName: "Test User",
        title: "Your Favourites",
        description: "Here is an example description, but it might be a lot longer!",
        listType: "Favourite",
        content: favouriteData
    });

    List.upsert({
        userId: 1,
        title: "Your Watchlist"
    }, {
        userId: 1,
        userName: "Test User",
        title: "Your Watchlist",
        description: "Movies and shows I want to watch.",
        listType: "To Watch",
        content: toWatchData
    });

    List.upsert({
        userId: 1,
        title: "Action Comedies"
    }, {
        userId: 1,
        userName: "Test User",
        title: "Action Comedies",
        description: "Another example description, still might be a lot longer!",
        listType: "Custom",
        content: toWatchData
    });

    List.upsert({
        userId: 1,
        title: "Sci-Fi Favorites"
    }, {
        userId: 1,
        userName: "Test User",
        title: "Sci-Fi Favorites",
        description: "Best Sci-Fi movies and TV shows.",
        listType: "Custom",
        content: customData1
    });

    List.upsert({
        userId: 1,
        title: "Dramatic Picks"
    }, {
        userId: 1,
        userName: "Test User",
        title: "Dramatic Picks",
        description: "Top dramatic movies and series.",
        listType: "Custom",
        content: customData2
    });

    List.upsert({
        userId: 1,
        title: "Highly Rated"
    }, {
        userId: 1,
        userName: "Test User",
        title: "Highly Rated",
        description: "Top rated movies and TV shows.",
        listType: "Custom",
        content: customData3
    });
});
