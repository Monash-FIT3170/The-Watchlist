import { Meteor } from 'meteor/meteor';

// This import is required to register the Methods and Publishers.
import ContentHandler from '../imports/api/server/ContentHandler';
import List from '../imports/db/List';

import { MovieCollection, TVCollection, Movie, TV } from '../imports/db/Content';


const movieData = {
    "id": 1,
    "title": "Titanic",
    "overview": "Jack and Rose are young lovers who find one another on the maiden voyage of the unsinkable R.M.S. Titanic. But when the doomed luxury liner collides with an iceberg in the frigid North Atlantic, their passionate love affair becomes a thrilling race for survival.",
    "release_year": 1997,
    "runtime": 194,
    "rating": 4990093, // this will be changed I suspect
    "image_url": "https://artworks.thetvdb.com/banners/v4/movie/231/posters/642d748b22859.jpg"
}

const tvData = {
    "id": 1,
    "title": "Buffy the Vampire Slayer",
    "overview": "In every generation there is a Chosen One. She alone will stand against the vampires, the demons and the forces of darkness. She is the Slayer.\r\n\r\nBuffy Summers is The Chosen One, the one girl in all the world with the strength and skill to fight the vampires. With the help of her close friends, Willow, Xander, and her Watcher Giles she balances slaying, family, friendships, and relationships.",
    "image_url": "https://artworks.thetvdb.com/banners/posters/70327-1.jpg",
    "first_aired": new Date(),
    "last_aired": new Date(),
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
}

Meteor.startup(async () => {
    if (await MovieCollection.find().countAsync() === 0 ) {
        Movie.insert(movieData);
    }

    if (await TVCollection.find().countAsync() === 0) {
        TV.insert(tvData);
    }

    if (await List.find().countAsync() === 0) {
        data = [
            {
                content_id: movieData.id,
                title: movieData.title,
                image_url: movieData.image_url,
                type: "Movie",
            },
            {
                content_id: tvData.id,
                title: tvData.title,
                image_url: tvData.image_url,
                type: "TV Show",
                user_rating: 3.1
            },
            {
                content_id: tvData.id,
                title: tvData.title,
                image_url: tvData.image_url,
                type: "Episode",
                user_rating: 3.1,
                episode_details: {
                    season_number: tvData.seasons[0].season_number,
                    episode_number: tvData.seasons[0].episodes[0].id
                }
            }
        ];
        List.insert({
            userId: 1,
            userName: "Test User",
            title: "My First Test List",
            description: "Here is an example description, but it might be a lot longer!",
            listType: "Favourite",
            content: data
        });
    }

});
