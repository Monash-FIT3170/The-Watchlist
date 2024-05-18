import { Meteor } from 'meteor/meteor';

// This import is required to register the Methods and Publishers.
import ContentHandler from '../imports/api/server/ContentHandler';
import ListHandler from '../imports/api/server/ListHandler';
import List, { ListCollection } from '../imports/db/List';

import { MovieCollection, TVCollection, Movie, TV } from '../imports/db/Content';

if (TVCollection.find().count() === 0) {
    TVCollection.insert({
        id: 1,
        title: 'Game of Thrones',
        overview: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
        image_url: 'https://example.com/game_of_thrones.jpg',
        first_aired: new Date('2011-04-17'),
        genres: ['Drama', 'Fantasy'],
        seasons: [],
    });
}

// Example data sourced from a database similar to TVDB

const movieData = [
    {
        "_id": "6piyaMiuooSvb4N7B",
        "id": 231,
        "title": "Titanic",
        "release_year": 1997,
        "runtime": 194,
        "rating": 5002480,
        "overview": "Jack and Rose are young lovers who find one another on the maiden voyage of the unsinkable R.M.S. Titanic. But when the doomed luxury liner collides with an iceberg in the frigid North Atlantic, their passionate love affair becomes a thrilling race for survival.\r\n",
        "genres": [
            "Action",
            "Adventure",
            "Drama",
            "Romance"
        ],
        "image_url": "https://artworks.thetvdb.com/banners/v4/movie/231/posters/642d748b22859.jpg"
    },
    {
        "_id": "svwSqHhg93QzPgRsE",
        "id": 169,
        "title": "The Matrix",
        "release_year": 1999,
        "runtime": 136,
        "rating": 1173680,
        "overview": "An unassuming programmer comes to the attention of a rebel alliance who seek to overthrow their sentient AI overlords and upset the world's status quo.",
        "genres": [
            "Action",
            "Science Fiction"
        ],
        "image_url": "https://artworks.thetvdb.com/banners/movies/169/posters/5f274c00c85c1.jpg"
    },
    {
        "_id": "NwQ3BRRTTR3Tk8SZi",
        "id": 113,
        "title": "Inception",
        "release_year": 2010,
        "runtime": 148,
        "rating": 1680146,
        "overview": "In a world where technology exists to enter the human mind through dream invasion, a highly skilled thief is given a final chance at redemption, which involves executing his toughest and most risky job to date.",
        "genres": [
            "Science Fiction",
            "Thriller"
        ],
        "image_url": "https://artworks.thetvdb.com/banners/movies/113/posters/2195447.jpg"
    },
    {
        "_id": "qzK5ryKQS7XRqbkP9",
        "id": 497,
        "title": "Loop (the mind reigns)",
        "release_year": 2019,
        "runtime": 5,
        "rating": 2,
        "overview": "In this hyper-low budget short movie, a guy finds himself trapped in a delirious trip in black and white.",
        "genres": [
            "Horror",
            "Drama"
        ],
        "image_url": "https://artworks.thetvdb.com/banners/movies/497/posters/497.jpg"
    },
    {
        "_id": "JhqHM2c5dNQBoSdmF",
        "id": 498,
        "title": "Disobedience",
        "release_year": 2018,
        "runtime": 114,
        "rating": 33904,
        "overview": "A woman learns about the death of her Orthodox Jewish father, a rabbi. She returns home and has romantic feelings rekindled for her best childhood friend, who is now married to her cousin.",
        "genres": [
            "Drama"
        ],
        "image_url": "https://artworks.thetvdb.com/banners/v4/movie/498/posters/65898f0810283.jpg"
    },
    {
        "_id": "wrBetYGXfLnZxuTQW",
        "id": 499,
        "title": "Hairspray",
        "release_year": 2007,
        "runtime": 117,
        "rating": 119696,
        "overview": "In 1962, Tracy Turnblad, a heavy-set teen living in Baltimore, is given the opportunity of a lifetime to become a dancer on a popular tv show. However, once she is thrust into the limelight, she cannot help but speak out on the taboo subject of racial integration and she unwittingly ignites a nation.",
        "genres": [
            "Comedy",
            "Family"
        ],
        "image_url": "https://artworks.thetvdb.com/banners/movies/499/posters/499.jpg"
    },
];

const tvData = [
    {
        "id": 1004,
        "title": "Buffy the Vampire Slayer",
        "overview": "In every generation there is a Chosen One. She alone will stand against the vampires, the demons and the forces of darkness. She is the Slayer.\r\n\r\nBuffy Summers is The Chosen One, the one girl in all the world with the strength and skill to fight the vampires. With the help of her close friends, Willow, Xander, and her Watcher Giles she balances slaying, family, friendships, and relationships.",
        "image_url": "https://artworks.thetvdb.com/banners/posters/70327-1.jpg",
        "first_aired": new Date('1997-03-10'),
        "last_aired": new Date('2003-05-20'),
        "genres": [
            "Action",
            "Adventure",
            "Drama",
            "Romance"
        ],
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
        "id": 1005,
        "title": "Breaking Bad",
        "overview": "A high school chemistry teacher turned methamphetamine producer in New Mexico partners with a former student to secure his family's financial future while avoiding detection from law enforcement.",
        "image_url": "https://artworks.thetvdb.com/banners/posters/81189-1.jpg",
        "first_aired": new Date('2008-01-20'),
        "last_aired": new Date('2013-09-29'),
        "genres": [
            "Action",
            "Adventure",
            "Drama",
            "Romance"
        ],
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
        "id": 1006,
        "title": "Game of Thrones",
        "overview": "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
        "image_url": "https://artworks.thetvdb.com/banners/posters/121361-1.jpg",
        "first_aired": new Date('2011-04-17'),
        "last_aired": new Date('2019-05-19'),
        "genres": [
            "Action",
            "Adventure",
            "Drama",
            "Romance"
        ],
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
        "id": 1007,
        "title": "Stranger Things",
        "overview": "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.",
        "image_url": "https://artworks.thetvdb.com/banners/posters/305288-1.jpg",
        "first_aired": new Date('2016-07-15'),
        "last_aired": new Date('2022-07-01'),
        "genres": [
            "Action",
            "Adventure",
            "Drama",
            "Romance"
        ],
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
        "id": 1008,
        "title": "The Office",
        "overview": "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
        "image_url": "https://artworks.thetvdb.com/banners/posters/73244-1.jpg",
        "first_aired": new Date('2005-03-24'),
        "last_aired": new Date('2013-05-16'),
        "genres": [
            "Action",
            "Adventure",
            "Drama",
            "Romance"
        ],
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

    try {
        TVCollection._dropIndex('seasons.episodes.title');
    } catch (error) {
        console.log('Index seasons.episodes.title does not exist or already dropped');
    }

    // Log the indexes to verify
    TVCollection.rawCollection().indexes().then(indexList => console.log('TV Collection Indexes:', indexList));


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
            user_rating: 4.5
        },
        {
            content_id: tvData[0].id,
            title: tvData[0].title,
            image_url: tvData[0].image_url,
            type: "TV Show",
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
