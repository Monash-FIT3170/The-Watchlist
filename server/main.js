import { Meteor } from 'meteor/meteor';

// This import is required to register the Methods and Publishers.
import ContentHandler from '../imports/api/server/ContentHandler';
import ListHandler from '../imports/api/server/ListHandler';
import List, { ListCollection } from '../imports/db/List';
import '../imports/api/server/RatingHandler';

import { MovieCollection, TVCollection, Movie, TV } from '../imports/db/Content';

// Example data sourced from a database similar to TVDB

const movieData = [
    {
        "id": 48,
        "title": "Black Panther",
        "release_year": 2018,
        "runtime": 134,
        "rating": 3309932,
        "overview": "After the death of his father, the king of Wakanda, T’Challa returns home to the isolated, technologically advanced African nation to succeed to the throne and take his rightful place as king. But when a powerful old enemy reappears, T’Challa’s mettle as king—and Black Panther—is tested when he is drawn into a formidable conflict that puts the fate of Wakanda and the entire world at risk. Faced with treachery and danger, the young king must rally his allies and release the full power of Black Panther to defeat his foes and secure the safety of his people and their way of life.",
        "genres": [
            "Action",
            "Adventure",
            "Science Fiction"
        ],
        "background_url": "https://artworks.thetvdb.com/banners/movies/48/posters/2195366.jpg",
        "image_url": "https://artworks.thetvdb.com/banners/movies/48/posters/2195366.jpg"
    },
    {
        "id": 2,
        "title": "Bohemian Rhapsody",
        "release_year": 2018,
        "runtime": 135,
        "rating": 1203685,
        "overview": "The story of the band Queen, from their union with electrifying singer Freddie Mercury to their meteoric rise to fame that culminated in an epic Live Aid performance, and finally to Freddie’s brave fight against AIDS.",
        "genres": [
            "Drama",
            "Musical"
        ],
        "background_url": "https://artworks.thetvdb.com/banners/movies/2/backgrounds/22394912.jpg",
        "image_url": "https://artworks.thetvdb.com/banners/movies/2/posters/2.jpg"
    },
    {
        "_id": "8YgHQBKfxAbE6cYSR",
        "id": 36,
        "title": "Creed II",
        "release_year": 2018,
        "runtime": 130,
        "rating": 164491,
        "overview": "Three years after his loss to \"Pretty\" Ricky Conlan, Adonis Creed scores a string of victories, culminating in a victory over Danny \"Stuntman\" Wheeler to win the WBC World Heavyweight Championship. Now a worldwide star, Adonis proposes to his girlfriend, Bianca Taylor, who agrees to marry him. When Bianca suggests starting a new life together in Los Angeles, Adonis is reluctant to leave his life in Philadelphia behind.",
        "genres": [
            "Drama"
        ],
        "background_url": "https://artworks.thetvdb.com/banners/movies/36/backgrounds/36.jpg",
        "image_url": "https://artworks.thetvdb.com/banners/v4/movie/36/posters/64be9c87ca4b2.jpg"
    },
    {
        "id": 4,
        "title": "Serenity",
        "release_year": 2019,
        "runtime": 106,
        "rating": 26884,
        "overview": "Baker Dill is a fishing boat captain living a quiet and sheltered life on an island off the coast of Florida. He spends his days leading tours off a tranquil, tropical enclave called Plymouth Island and is obsessed with catching \"Justice\", an evasive giant tuna fish.",
        "genres": [
            "Drama",
            "Thriller"
        ],
        "background_url": "https://artworks.thetvdb.com/banners/movies/4/backgrounds/4.jpg",
        "image_url": "https://artworks.thetvdb.com/banners/movies/4/posters/4.jpg"
    },
    {
        "_id": "8pEotvNk7TmKre2xx",
        "id": 63,
        "title": "Harry Potter and the Chamber of Secrets",
        "release_year": 2002,
        "runtime": 161,
        "rating": 5175372,
        "overview": "Harry Potter's unfortunate summer away from his friends continues when he returns to school and an ancient prophecy seems to be coming true as a mysterious presence stalks the corridors at Hogwarts, leaving its victims paralyzed.",
        "genres": [
            "Adventure",
            "Family",
            "Fantasy",
            "Mystery"
        ],
        "background_url": "https://artworks.thetvdb.com/banners/movies/63/posters/5ebb0c57951c9.jpg",
        "image_url": "https://artworks.thetvdb.com/banners/movies/63/posters/5ebb0c57951c9.jpg"
    },
    {
        "id": 6,
        "title": "A Star is Born",
        "release_year": 2018,
        "runtime": 135,
        "rating": 1219796,
        "overview": "Struggling artist Ally has just about given up on her dream to make it big as a singer. But when seasoned musician Jackson Maine notices her natural talent, he coaxes her into the spotlight and sets her up for a career she never imaged, and a tumultuous love she'll never forget.",
        "genres": [
            "Drama",
            "Musical",
            "Romance"
        ],
        "background_url": "https://artworks.thetvdb.com/banners/v4/movie/6/backgrounds/64ac700f76525.jpg",
        "image_url": "https://artworks.thetvdb.com/banners/movies/6/posters/5f29728f15f57.jpg"
    },
    {
        "_id": "BTwugPYN9gfS6e2oe",
        "id": 32,
        "title": "Green Book",
        "release_year": 2018,
        "runtime": 130,
        "rating": 440774,
        "overview": "A working-class Italian-American bouncer becomes the driver of an African-American classical pianist on a tour of venues through the 1960s American South.",
        "genres": [
          "Drama"
        ],
        "background_url": "https://artworks.thetvdb.com/banners/movies/32/backgrounds/32.jpg",
        "image_url": "https://artworks.thetvdb.com/banners/v4/movie/32/posters/66420ac521680.jpg"
      }
];

const tvData = [

    {
        "_id": "rt37JuEXi9drTvLs9",
        "id": 70814,
        "title": "American Idol",
        "overview": "The smash reality series showcases wannabe pop stars competing for a record deal by crooning for a panel of judges. The judges review a performer's talent (or lack thereof), and at-home viewers then vote for their favorite potential star. The show helped launch the careers of such artists as Kelly Clarkson, Carrie Underwood, Jennifer Hudson and Adam Lambert.",
        "image_url": "/banners/posters/70814-10.jpg",
        "first_aired": 1023753600000,
        "last_aired": 1716076800000,
        "genres": [
          "Reality",
          "Game Show",
          "Musical"
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
                        "image_url": "/banners/episodes/70327/2.jpg"
                    }
                ]
            }
        ],
        "background_url": "https://artworks.thetvdb.com/banners/fanart/original/70814-33.jpg"
      },
    {
        "id": 1004,
        "title": "Buffy the Vampire Slayer",
        "overview": "In every generation there is a Chosen One. She alone will stand against the vampires, the demons and the forces of darkness. She is the Slayer.\r\n\r\nBuffy Summers is The Chosen One, the one girl in all the world with the strength and skill to fight the vampires. With the help of her close friends, Willow, Xander, and her Watcher Giles she balances slaying, family, friendships, and relationships.",
        "background_url": "https://artworks.thetvdb.com/banners/fanart/original/70327-3.jpg",
        "image_url": "/banners/posters/70327-1.jpg",
        "first_aired": -81907200000,
        "last_aired": -73440000000,
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
                        "image_url": "/banners/episodes/70327/2.jpg"
                    }
                ]
            }
        ],
        "background_url": "https://artworks.thetvdb.com/banners/fanart/original/70327-3.jpg"
    },
    {
        "id": 70393,
        "title": "Coronet Blue",
        "overview": "Michael Alden is an amnesiac, who must discover his real identity before the operatives of a mysterious group locate him and kill him. The key to his past might be \"Coronet Blue\", a meaningless phrase he for some reason remembers.",
        "image_url": "/banners/posters/70393-2.jpg",
        "first_aired": -81907200000,
        "last_aired": -73440000000,
        "genres": [
            "Drama",
            "Thriller",
            "Mystery"
        ],
        "seasons": [
            {
                "season_number": 1,
                "episodes": [
                    {
                        "id": 6260,
                        "title": "A Time to Be Born",
                        "overview": "A young man is beaten and thrown from a liner into New York Harbor by a bunch of crooks he was in with. Though left for dead, he survives with memory loss. A rich girl takes a love interest in him, but his ex-comrades still try to kill him.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 6261,
                        "title": "The Assassins",
                        "overview": "\"\"The mask with which you have favored us.\"\"",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 6262,
                        "title": "The Rebels",
                        "overview": "Another perspective on the round-dance of obliquity.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 6263,
                        "title": "A Dozen Demons",
                        "overview": "\"\"It is as simple as a musical phrase.\"\"",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 6264,
                        "title": "Faces",
                        "overview": "How they evanesce and plunge into memory.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 6265,
                        "title": "Man Running",
                        "overview": "Game... after gameâ€”in the games... Alden gets between a revolutionary and the reaction.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 6266,
                        "title": "A Charade for Murder",
                        "overview": "Signs and wonders.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 6267,
                        "title": "Saturday",
                        "overview": "\"\"from midnight to midnight no weeping\"\"",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 6268,
                        "title": "Presence of Evil",
                        "overview": "\"\"We must cultivate our garden.\"\"",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 6269,
                        "title": "Six Months to Mars",
                        "overview": "Castles in outer space.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 6270,
                        "title": "The Flip Side of Timmy Devon",
                        "overview": "How like ourselves are we when we're not looking?",
                        "runtime": 45,
                        "image_url": null
                    }
                ]
            }
        ],
        "background_url": "https://artworks.thetvdb.com/banners/fanart/original/70393-1.jpg"
    },
    {
        "id": 70399,
        "title": "Star Wars: Droids",
        "overview": "Long before their famous adventures with the Rebel Alliance, R2-D2 and C-3PO were assigned to many different masters by the Intergalactic Droid Agency. In this animated series, the droids encounter many unforgettable people: greedy villains set on conquering planets, terrible space pirates, and brave heroes. Flying to different planets with their new master Jann Tosh and cargo pilot Jessica Meade, R2-D2 and C-3PO become heroes that will do anything to help their friends triumph over villainy.",
        "image_url": "/banners/v4/series/70399/posters/60f73a8952bd6.jpg",
        "first_aired": 494899200000,
        "last_aired": 502156800000,
        "genres": [
            "Science Fiction",
            "Family",
            "Comedy",
            "Children",
            "Animation",
            "Adventure",
            "Action"
        ],
        "seasons": [
            {
                "season_number": 1,
                "episodes": [
                    {
                        "id": 6362,
                        "title": "The White Witch",
                        "overview": "After being jettisoned over the deserts of Ingo by an unscrupulous former master, C-3PO and R2-D2 are taken in by speeder bike racers Jord Dusat and Thall Joben. Kea Moll sees them accidentally cross a restricted zone, and helps protect them from several deadly droids. One of gangster Tig Fromm's droids kidnaps Jord, and the droids assist Thall and Kea in rescuing Jord from Fromm's secret base, destroying much of his droid army in the process.",
                        "runtime": 25,
                        "image_url": "/banners/episodes/70399/6362.jpg"
                    },
                    {
                        "id": 6363,
                        "title": "Escape into Terror",
                        "overview": "After C-3PO lets the hyperdrive of Kea's starship float away into space, he, R2-D2, Jord, and Thall stay with Kea and her mother, Demma, on Annoo while trying to secure a new hyperdrive. The droids discover that Kea is a member of the Rebel Alliance. While Jord stays with Demma, Thall, Kea and the droids sneak onto the Fromm gang's ship in order to infiltrate the secret base on Ingo. There, they capture the Trigon One, a weaponized satellite created by the Fromm gang to take over the galactic quadrant.",
                        "runtime": 25,
                        "image_url": "/banners/episodes/70399/6363.jpg"
                    },
                    {
                        "id": 6364,
                        "title": "The Trigon Unleashed",
                        "overview": "After the Fromm gang raids the speeder shop on Ingo and captures Thall, Kea and the droids, Tig reveals that he has kidnapped Jord and Demma, refusing to release them unless Thall reveals the location of the Trigon One. Thall does so, but the group is imprisoned with Jord—until the droids outsmart the guard. When Tig pilots the space weapon back to the base of his father, Sise, he discovers that its controls have been sabotaged and programmed to crash into the base. Jord goes to commandeer an escape ship while Thall and Kea rescue Demma, and the droids do what they can to help.",
                        "runtime": 25,
                        "image_url": "/banners/episodes/70399/6364.jpg"
                    },
                    {
                        "id": 6365,
                        "title": "A Race to the Finish",
                        "overview": "The team goes to Boonta to take part in a speeder race, but is pursued by the Fromm gang and forced to crash land. Sise hires Boba Fett to help exact his revenge, despite Jabba the Hutt having placed a bounty on the crimelord. Tig plants a thermal detonator on the White Witch, and Fett chases Thall into the race. In the melee, the explosive is used to destroy Fett's speeder. The despondent bounty hunter rounds up the Fromms to take to Jabba. Thall, Jord and Kea are offered careers with a speeder corporation, but refuse when they realize that R2-D2 and C-3PO would have to be reprogrammed. The droids leave their masters so they can take the job.",
                        "runtime": 25,
                        "image_url": "/banners/episodes/70399/6365.jpg"
                    },
                    {
                        "id": 6366,
                        "title": "The Lost Prince",
                        "overview": "C-3PO, R2-D2, and their new master, Jann Tosh, befriend a mysterious alien disguised as a droid. Captured by crimelord Kleb Zellock, they are forced to mine Nergon-14, a valuable unstable mineral used in proton torpedoes, which Zellock plans to sell to the Empire. In the mines they meet Sollag, who identifies their friend as Mon Julpa, Prince of the Tammuz-an. Together they defeat the crimelord and escape the mines before they are destroyed in a Nergon-14 explosion.",
                        "runtime": 25,
                        "image_url": "/banners/episodes/70399/6366.jpg"
                    },
                    {
                        "id": 6367,
                        "title": "The New King",
                        "overview": "The droids, Jann, Mon Julpa, and Sollag, along with freighter pilot Jessica Meade, travel to Tammuz-an to thwart Ko Zatec-Cha, an evil vizier with ambitions to seize the throne of the planet Tammuz-an. To achieve his sinister plans, Zatec-Cha hires bounty hunter IG-88 to capture Mon Julpa and his royal scepter, but the heroes manage to recover it, and Mon Julpa is made king of Tammuz-an.ne.",
                        "runtime": 25,
                        "image_url": "/banners/episodes/70399/6367.jpg"
                    },
                    {
                        "id": 6368,
                        "title": "The Pirates of Tarnoonga",
                        "overview": "While delivering fuel to Tammuz-an, Jann, Jessica, and the droids are captured by the pirate Kybo Ren-Cha. Aboard his stolen Star Destroyer, Kybo Ren takes them to the water planet Tarnoonga. After the heroes escape a giant sea monster, Jann and the droids distract the pirates by going after a decoy while Jessica recaptures the real fuel. After Jann and the droids escape, Mon Julpa sends forces to capture Ren.",
                        "runtime": 25,
                        "image_url": "/banners/episodes/70399/6368.jpg"
                    },
                    {
                        "id": 6369,
                        "title": "The Revenge of Kybo Ren",
                        "overview": "Kybo Ren is freed and he kidnaps Gerin, the daughter of Lord Toda, Mon Julpa's political rival. The droids, Jann, and Jessica go to the planet Bogden to rescue Gerin before Mon Julpa is handed over as ransom. Ren's men arrive with Julpa, but Lord Toda and a squad of Tammuz-an soldiers have smuggled aboard Ren's own ship. Ren is sent back to prison and an alliance is forged between Julpa and Toda. Jessica decides to return to her freighter business and says goodbye to her friends.",
                        "runtime": 25,
                        "image_url": "/banners/episodes/70399/6369.jpg"
                    },
                    {
                        "id": 6370,
                        "title": "Coby and the Starhunters",
                        "overview": "C-3PO and R2-D2 are assigned to chapperone Lord Toda's young son, Coby, only to be captured by smugglers. They are eventually rescued by Jann, only for the droids to learn that he has been accepted into the Imperial Space Academy, leaving them once again masterless and on their own.",
                        "runtime": 25,
                        "image_url": "/banners/episodes/70399/6370.jpg"
                    },
                    {
                        "id": 6371,
                        "title": "Tail of the Roon Comets",
                        "overview": "Mungo Baobab, with R2-D2 and C-3PO in tow, begins searching for the powerful Roonstones, but runs into an Imperial entanglement.",
                        "runtime": 25,
                        "image_url": "/banners/episodes/70399/6371.jpg"
                    },
                    {
                        "id": 6372,
                        "title": "The Roon Games",
                        "overview": "Having escaped, Mungo, C-3PO and R2-D2 once again make their way for the planet Roon, but it turns out that they have not seen the last of General Koong, a de facto governor desperate to win the support of the Empire.",
                        "runtime": 25,
                        "image_url": "/banners/episodes/70399/6372.jpg"
                    },
                    {
                        "id": 6373,
                        "title": "Across the Roon Sea",
                        "overview": "Mungo has just about given up hope on finding Roonstones, and accompanied by the droids, is about to return to his home planet, Manda.",
                        "runtime": 25,
                        "image_url": "/banners/episodes/70399/6373.jpg"
                    },
                    {
                        "id": 6374,
                        "title": "The Frozen Citadel",
                        "overview": "Mungo and the droids continue their search for the Roonstones, but Koong makes trouble for them.",
                        "runtime": 25,
                        "image_url": "/banners/episodes/70399/6374.jpg"
                    }
                ]
            }
        ],
        "background_url": "https://artworks.thetvdb.com/banners/fanart/original/70399-2.jpg"
    },
    {
        "id": 70443,
        "title": "Maverick",
        "overview": "Maverick is a comedy-western television series created by Roy Huggins that ran from September 22, 1957 to July 8, 1962 on ABC and featured James Garner, Jack Kelly, Roger Moore, and Robert Colbert as the poker-playing traveling Mavericks (Bret, Bart, Beau, & Brent). Moore and Colbert were later additions, though there were never more than two current Mavericks in the series at any given time, and sometimes only one. The series' primary sponsor for the first few seasons was Kaiser Aluminum, and their \"quilted\" aluminum foil was widely advertised in commercials shown on Maverick.",
        "image_url": "/banners/posters/70443-4.jpg",
        "first_aired": -387417600000,
        "last_aired": -242870400000,
        "genres": [
            "Comedy",
            "Adventure",
            "Action",
            "Western"
        ],
        "seasons": [
            {
                "season_number": 1,
                "episodes": [
                    {
                        "id": 7429,
                        "title": "War of the Silver Kings",
                        "overview": "Bret Maverick takes down a money-hungry gambler in the town of Echo Springs. He befriends an old drunk, who turns out to be a successful judge. Maverick strikes a deal with the gambler, Phineas King, to merge the \"Silver Lady\" mine with \"The New Hope\" mine.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7429.jpg"
                    },
                    {
                        "id": 7430,
                        "title": "Point Blank",
                        "overview": "Bret meets a delightful and cunning girl (Karen Steele). Within minutes, she makes plans for his future a permanent plot on Boot Hill.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7430.jpg"
                    },
                    {
                        "id": 7431,
                        "title": "According to Hoyle",
                        "overview": "Samantha Crawford is a con artist employed by George Cross. Cross once lost $50,000 to Bret Maverick and is determined to get it back. Two riverboat owners staked Maverick $5,000 which he promptly loses to Samantha. Samantha claims Cross is her father and needs the money to get out of jail. Maverick forms a partnership with Samantha and purchases gambling equipment in a scheme to put Joe Riggs, a crooked game room owner, out of business. Samantha and Cross doublecross Maverick by selling the equipment to Riggs.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7431.jpg"
                    },
                    {
                        "id": 7432,
                        "title": "Ghost Rider",
                        "overview": "A woman who'd been traveling with Bret suddenly disappears.  Looking into things he discovers that she'd been reported dead more than a week ago.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7432.jpg"
                    },
                    {
                        "id": 7433,
                        "title": "The Long Hunt",
                        "overview": "Bret tries to prove the innocence of a man serving a life sentence. But there's someone who wants the prisoner to stay where he is.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7433.jpg"
                    },
                    {
                        "id": 7434,
                        "title": "Stage West",
                        "overview": "Fleeing a band of angry Native Americans, Bret takes shelter in a way station where a family of nasty outlaws are planning their bloodiest deal.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7434.jpg"
                    },
                    {
                        "id": 7435,
                        "title": "Relic of Fort Tejon",
                        "overview": "Bret wins a camel in a card game and ends up using her to bring a crooked gambling den owner to justice.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7435.jpg"
                    },
                    {
                        "id": 7436,
                        "title": "Hostage",
                        "overview": "Bret Maverick meets up with brother Bart in New Orleans where they plan to obtain passage on a riverboat where big money poker games are held but end up getting involved in the kidnapping of the riverboat owner's daughter instead.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7436.jpg"
                    },
                    {
                        "id": 7437,
                        "title": "Stampede",
                        "overview": "Bret and Dandy Jim Buckley bet heavily on a boxing match but when their fighter withdraws it's up to Bret himself to step into the squared circle.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7437.jpg"
                    },
                    {
                        "id": 7438,
                        "title": "The Jeweled Gun",
                        "overview": "Bart agrees to pose as the husband of a woman who's traveling through the badlands.  Big mistake because he soon finds himself the target of a killer.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7438.jpg"
                    },
                    {
                        "id": 7439,
                        "title": "The Wrecker",
                        "overview": "Bart takes to the sea after buying a derelict cargo ship. The wreck is extremely valuable and he wants to know why.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7439.jpg"
                    },
                    {
                        "id": 7440,
                        "title": "The Quick and the Dead",
                        "overview": "The only person who can clear Bret of a robbery charge has been marked for death by the notorious gunfighter/gambler Doc Holliday.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7440.jpg"
                    },
                    {
                        "id": 7441,
                        "title": "The Naked Gallows",
                        "overview": "Bart pokes his nose into an unsolved murder case and ends up facing the business end of a killer's .45.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7441.jpg"
                    },
                    {
                        "id": 7442,
                        "title": "Comstock Conspiracy",
                        "overview": "Arriving in the mining boom town of Virginia City, Bret gets involved with a mining engineer in his struggle for improved working conditions.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7442.jpg"
                    },
                    {
                        "id": 7443,
                        "title": "The Third Rider",
                        "overview": "Bart gets involved with two devious couples in this episode which sees him trying to clear himself of a bank robbery and a murder.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7443.jpg"
                    },
                    {
                        "id": 7444,
                        "title": "Rage for Vengeance",
                        "overview": "Bret is happy to escort a lovely widow to the bank with a large sum of cash - until he learns the money is counterfeit.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7444.jpg"
                    },
                    {
                        "id": 7445,
                        "title": "Rope of Cards",
                        "overview": "It's shades of 12 Angry Men when Bret becomes the lone holdout for a not guilty verdict in a murder trial. He has to use a long shot card trick to convince the other jurors that the defendant might be innocent.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7445.jpg"
                    },
                    {
                        "id": 7446,
                        "title": "Diamond in the Rough",
                        "overview": "After being beaten up, robbed, and shanghaied, Bart sets out to expose the man responsible, a respected member of San Francisco society, as a diamond swindler.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7446.jpg"
                    },
                    {
                        "id": 7447,
                        "title": "Day of Reckoning",
                        "overview": "Fearless Bret feels it's about time someone did something about the town bully so he asks the townspeople to do something.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7447.jpg"
                    },
                    {
                        "id": 7448,
                        "title": "The Savage Hills",
                        "overview": "Against his better judgment, Bart teams up with Samantha Crawford to recover stolen Treasury plates.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7448.jpg"
                    },
                    {
                        "id": 7449,
                        "title": "Trail West to Fury",
                        "overview": "During a hellacious rainstorm the brothers Maverick relate to pal Dandy Jim Buckley about the time in Texas shortly after the Civil War when they searched far and wide for a tall man who could clear them of a murder charge.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7449.jpg"
                    },
                    {
                        "id": 7450,
                        "title": "The Burning Sky",
                        "overview": "In the desert, an Indian ambush leaves Bart and other stagecoach passengers to battle their attackers, each other, and the sun.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7450.jpg"
                    },
                    {
                        "id": 7451,
                        "title": "The Seventh Hand",
                        "overview": "Samantha Crawford arranges for Bret to sit in on a high stakes poker game but he's the fall guy when the game gets robbed.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7451.jpg"
                    },
                    {
                        "id": 7452,
                        "title": "Plunder of Paradise",
                        "overview": "There's gold in them thar hills, and Bart Maverick and Big Mike McComb are out to get it.  But so are four nasty Mexican banditos.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7452.jpg"
                    },
                    {
                        "id": 7453,
                        "title": "Black Fire",
                        "overview": "The heirs of millionaire General Eakins are being killed off one by one so why is Bret Maverick so worried? He's posing as one of the heirs and might be the next intended victim.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7453.jpg"
                    },
                    {
                        "id": 7454,
                        "title": "Burial Ground of the Gods",
                        "overview": "Bart Maverick is in search of a thief who stole his money but gets sidetracked into accompanying a young woman searching for her missing husband into forbidden Sioux territory.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7454.jpg"
                    },
                    {
                        "id": 7455,
                        "title": "Seed of Deception",
                        "overview": "After they arrive in an Arizona town, Bret and Bart are mistaken for Wyatt Earp and Doc Holliday and end up preventing a bank robbery.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7455.jpg"
                    }
                ]
            },
            {
                "season_number": 2,
                "episodes": [
                    {
                        "id": 7456,
                        "title": "The Day They Hanged Bret Maverick",
                        "overview": "Bret attends a hanging under very uncomfortable conditions: he's the intended victim.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7456.jpg"
                    },
                    {
                        "id": 7457,
                        "title": "The Lonesome Reunion",
                        "overview": "Bret falls for the tempting trickery of a pretty woman (Joanna Barnes) and finds himself helplessly involved in a swindle.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7457.jpg"
                    },
                    {
                        "id": 7458,
                        "title": "Alias Bart Maverick",
                        "overview": "Bart meets a gentleman after his own heart who skips town with his money, and leaves him to face a murder rap and a man-hungry female (Arlene Howell).",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7458.jpg"
                    },
                    {
                        "id": 7459,
                        "title": "The Belcastle Brand",
                        "overview": "In a desert, Bret and a hunting party are ambushed and left to fight a blazing sun.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7459.jpg"
                    },
                    {
                        "id": 7460,
                        "title": "High Card Hangs",
                        "overview": "Bart Maverick and two of his friends are charged with murder. The town's citizens demand a confession from one of the three men, or else all three men will be prosecuted. Bart falsely confesses to the murder, but help from his friend Dandy Jim Buckley exonerates him from the crime.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7460.jpg"
                    },
                    {
                        "id": 7461,
                        "title": "Escape to Tampico",
                        "overview": "In Mexico, Bret tries to trick an American renegade into returning to the U.S. where he's wanted for murder.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7461.jpg"
                    },
                    {
                        "id": 7462,
                        "title": "The Judas Mask",
                        "overview": "Bart tails a pretty cancan dancer who stole his money only to find himself being followed by two very sinister characters.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7462.jpg"
                    },
                    {
                        "id": 7463,
                        "title": "The Jail at Junction Flats",
                        "overview": "Good-hearted Bret lends a pal $200 for an \"honest\" transaction which lands the pal in jail.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7463.jpg"
                    },
                    {
                        "id": 7464,
                        "title": "The Thirty-Ninth Star",
                        "overview": "A case of mistaken suitcases unfolds into political warfare, leaving Bart the unhappy target of ruthless killers.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7464.jpg"
                    },
                    {
                        "id": 7465,
                        "title": "Shady Deal at Sunny Acres",
                        "overview": "Bret, helpless against a crafty banker (John Dehner) who robbed him, bides his time while Bart and friends set up an elaborate con game.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7465.jpg"
                    },
                    {
                        "id": 7466,
                        "title": "Island in the Swamp",
                        "overview": "Bret tries to help a pair of star-crossed lovers whose feuding families have taken him prisoner.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7466.jpg"
                    },
                    {
                        "id": 7467,
                        "title": "Prey of the Cat",
                        "overview": "Bart is a helpless victim of his charms. Two scheming women are after him: one wants to murder for his love; the other just wants to murder him.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7467.jpg"
                    },
                    {
                        "id": 7469,
                        "title": "The Spanish Dancer",
                        "overview": "After scuffling with a pal over a dancer, Bart must do some fancy footwork to escape his plight: he's accused of murdering his friend.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7469.jpg"
                    },
                    {
                        "id": 7468,
                        "title": "Holiday at Hollow Rock",
                        "overview": "After he's cheated in a crooked card game, Bret tries to even the score by beating his opponent and the odds in a horse race.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7468.jpg"
                    },
                    {
                        "id": 7470,
                        "title": "Game of Chance",
                        "overview": "Bret and Bart are pursuing the same woman. What's the attraction? The $10,000 she copped from them.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7470.jpg"
                    },
                    {
                        "id": 7471,
                        "title": "Gun-Shy",
                        "overview": "Bret, seeking buried Confederate treasure in Elwood, Kansas, keeps running afoul of U.S. Marshal Mort Dooley. The marshal keeps running Bret out of town. Bret, in turn, keeps outwitting the lawman.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7471.jpg"
                    },
                    {
                        "id": 7472,
                        "title": "Two Beggars on Horseback",
                        "overview": "Bret and Bart's devotion to one another is tested when they're offered a deal that can mean $10,000 for one of them, but just one.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7472.jpg"
                    },
                    {
                        "id": 7473,
                        "title": "The Rivals",
                        "overview": "A rich playboy pays Bret Maverick to switch identities with him, so the playboy can court a wealthy young woman, who'd otherwise reject him.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7473.jpg"
                    },
                    {
                        "id": 7474,
                        "title": "Duel at Sundown",
                        "overview": "Bret Maverick finds himself caught in a deadly love triangle with a lovely woman (Abby Dalton) and a young gunman (Clint Eastwood).",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7474.jpg"
                    },
                    {
                        "id": 7475,
                        "title": "Yellow River",
                        "overview": "After losing his money in a bank robbery, Bart invests in a get-rich-quick deal with a beautiful, but not-so-dumb blonde.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7475.jpg"
                    },
                    {
                        "id": 7476,
                        "title": "The Saga of Waco Williams",
                        "overview": "Bret and his buddy Waco Williams (Wayde Preston) ride straight into trouble in Bent City, where they are suspected of being cattle rustlers.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7476.jpg"
                    },
                    {
                        "id": 7477,
                        "title": "Brasada Spur",
                        "overview": "In a high-stakes poker game, Bart wins stock in a railroad and finds himself on the track to a colossal headache.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7477.jpg"
                    },
                    {
                        "id": 7478,
                        "title": "Passage to Fort Doom",
                        "overview": "A pair of con artists, Bart and an old girl friend survive a hazardous stagecoach ride and reach Fort Doom where their troubles begin.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7478.jpg"
                    },
                    {
                        "id": 7479,
                        "title": "Two Tickets to Ten Strike",
                        "overview": "Bret Maverick suspicions are aroused when he is forced to leave Ten Strike, New Mexico. Determined to stand his ground, Maverick stays in Ten Strike long enough to uncover a bizarre plot of murder and blackmail. Two gunmen, Vic Nolan (Adam West) and Eddie Burke (William Gordon), try to scare Maverick out of town.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7479.jpg"
                    },
                    {
                        "id": 7480,
                        "title": "Betrayal",
                        "overview": "Keeping cool during a stage holdup, Bart catches a twinkle of recognition between his lovely traveling companion (Pat Crowley) and one of the outlaws.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7480.jpg"
                    },
                    {
                        "id": 7481,
                        "title": "The Strange Journey of Jenny Hill",
                        "overview": "Bret accompanies a beautiful singer (Peggy King) on a search for her missing husband and finds himself falling helplessly in love.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7481.jpg"
                    }
                ]
            },
            {
                "season_number": 3,
                "episodes": [
                    {
                        "id": 7482,
                        "title": "Pappy",
                        "overview": "Beau Maverick (played by James Garner), father of Bret and Bart announces that he is getting married. The Maverick boys discover that the marriage is a business arrangement, not a love commitment. The young girl, Josephine St. Cloud is being forced by her father to marry the older Beau Maverick. The brothers set out to sabotage the wedding plans, not knowing that Beau Maverick already had a plan.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7482.jpg"
                    },
                    {
                        "id": 7483,
                        "title": "Royal Four Flush",
                        "overview": "Bart double-crosses a double-crosser and winds up hogtied and kidnapped, with only his wits as a weapon with which to save his neck.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7483.jpg"
                    },
                    {
                        "id": 7484,
                        "title": "The Sheriff of Duck 'N' Shoot",
                        "overview": "Sheriff Bret astounds himself as well as the townspeople by taming the trail herders who have been devastating the town, beats a gang of bank robbers at their own game, but has to summon the aid of brother Bart when his eye for a woman's beauty lands him in his own lockup.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7484.jpg"
                    },
                    {
                        "id": 7485,
                        "title": "You Can't Beat the Percentage",
                        "overview": "Bart is involved in a bizarre murder plot in which he is high on the list of planned victims.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7485.jpg"
                    },
                    {
                        "id": 7486,
                        "title": "The Cats of Paradise",
                        "overview": "Bret Maverick falls for a soft-spoken girl, Modesty Blaine (Mona Freeman). They enter into a partnership to sell cats to a mining camp overrun by rats. But rumor has it that most men lose either their lives or their money when dealing with this young beauty. However, Bret stands to lose both his life and his money, so he plots to save both.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7486.jpg"
                    },
                    {
                        "id": 7487,
                        "title": "A Tale of Three Cities",
                        "overview": "Bart has trouble retrieving his poker winnings from thieves. But help is on the way from the local Ladies Aid Society.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7487.jpg"
                    },
                    {
                        "id": 7488,
                        "title": "Full House",
                        "overview": "Bret Maverick runs into a notorious bunch of bank robbers; Cole Younger, Billy The Kid, Sam Bass, Jesse James, Frank James, Jim Dalton, Black Bart, Ben Thompson and Belle Starr. The outlaws believe that Bret is the infamous Foxy Smith, a well known bad guy. When the outlaws discover Bret's true identity, they force him to do the robbery in Denver. Bret ends up in a mint of trouble.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7488.jpg"
                    },
                    {
                        "id": 7489,
                        "title": "The Lass with the Poisonous Air",
                        "overview": "After a rebuff by mysterious Linda Burke (Joanna Moore), Bart is left holding the bag for murder.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7489.jpg"
                    },
                    {
                        "id": 7490,
                        "title": "The Ghost Soldiers",
                        "overview": "Bret finds himself one of three men secretly defending a deserted government fort against war hungry Indians. He succeeds in scaring them off by clever trickery. But a suspicious Indian chief causes him to reconsider.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7490.jpg"
                    },
                    {
                        "id": 7491,
                        "title": "Easy Mark",
                        "overview": "Bart Maverick, for whom cowardice is a virtue, \"turns yellow\" when he learns that his friendship with a tycoon could cost him his life.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7491.jpg"
                    },
                    {
                        "id": 7492,
                        "title": "A Fellow's Brother",
                        "overview": "When George Henry Arnett hears that Bret Maverick is in town to collect his money, Arnett (Adam West) starts a \"top gun\" rumor about Bret. After he creates a smoke screen, Arnett creeps out of town. Maverick is idolized by the town youngsters, sought after available women and hunted by the town bounty hunter. Bret Maverick is the talk of the town.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7492.jpg"
                    },
                    {
                        "id": 7493,
                        "title": "Trooper Maverick",
                        "overview": "Bart swings into trouble when he tries to help the cavalry uncover a traitor and winds up facing a hangman's rope.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7493.jpg"
                    },
                    {
                        "id": 7494,
                        "title": "Maverick Springs",
                        "overview": "Bret is hired by a weathly texan to save her brother Mark from a conniving woman named Melanie. Posing as a Texas Colonel, Bret realizes that he's up against a master crook. With Mark's help and brother Bart's arrival as a weathly Easterner, they set up a scheme to catch the girl and almost outsmart themselves with their own cleverness.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7494.jpg"
                    },
                    {
                        "id": 7495,
                        "title": "The Goose-Drownder",
                        "overview": "Taking shelter in a ghost town, Bart impatiently awaits a storm's end. But when four gunmen arrive, he fears he'll never get out alive.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7495.jpg"
                    },
                    {
                        "id": 7496,
                        "title": "A Cure for Johnny Rain",
                        "overview": "After saving Bret's life, Johnny Rain (William Reynolds) is arrested for robbing a stage coach. While Bret goes to his rescue he becomes ensnarled in a plot that involves a case of split personality - a dance hall wench and a mild-mannered tinhorn gambler who likes to leave 'em laughing... with hysteria.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7496.jpg"
                    },
                    {
                        "id": 7497,
                        "title": "The Marquesa",
                        "overview": "Bart Maverick wins big, when he wins the \"Lucky Lady\" saloon in a card game. When Bart goes to Santa Leora to stake his claim, a beautiful Marquesa refuses to relinquish the property to him. Maverick encounters hurling knives, flurry of bullets and pounding fists when he tries to hold onto his newly acquired saloon.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7497.jpg"
                    },
                    {
                        "id": 7498,
                        "title": "Cruise of the Cynthia B.",
                        "overview": "Bret is one of the seven owners of a Riverboat who start down the Mississippi for Memphis to sell the broken-down craft, but soon, in a deadly game of 10 Little Indians, one owner after another is found mysteriously dead. It becomes apparent that if the boat does reach Memphis, it's almost certain it will have but one owner.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7498.jpg"
                    },
                    {
                        "id": 7499,
                        "title": "Maverick & Juliet",
                        "overview": "Bret's freedom hinges on the outcome of a card game. He's ecstatic... until he meets his opponent: Bart - who will make a bundle if he wins.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7499.jpg"
                    },
                    {
                        "id": 7500,
                        "title": "The White Widow",
                        "overview": "A beautiful widow (Julie Adams) asks Bart to protect her from an unknown killer. He accepts unaware that he is the intended victim.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7500.jpg"
                    },
                    {
                        "id": 7501,
                        "title": "Guatemala City",
                        "overview": "Maverick tries to straighten out his romance with Ellen Johnson and at the same time solve a million dollar jewel theft. When Bret finds out that his ardor has cooled, he also finds that he has become the prime target for a ruthless murderer and a man who refuses to stay dead.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7501.jpg"
                    },
                    {
                        "id": 7502,
                        "title": "The People's Friend",
                        "overview": "Bart Maverick is running for office, he is a sure candidate for U.S. Senate. Bart's political ambition has some town's people out for his blood. His opponents will go to any length to stifle his political aspirations; they threathen his life. Fearful of his opponents, Bart finds a way out of the election, without letting the voters down.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7502.jpg"
                    },
                    {
                        "id": 7503,
                        "title": "A Flock of Trouble",
                        "overview": "Bret wins a sheep ranch located in the midst of cattle ranchers whose sole aim is to wipe out the sheep and their new owner.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7503.jpg"
                    },
                    {
                        "id": 7504,
                        "title": "Iron Hand",
                        "overview": "Hired to protect a cattle drive, Bart dutifully chases Indians - while a masterful swindle takes place right under his nose.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7504.jpg"
                    },
                    {
                        "id": 7505,
                        "title": "The Resurrection of Joe November",
                        "overview": "A $10,000 temptation puts Bret unwittingly in the middle of a fantastic smuggling scheme.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7505.jpg"
                    },
                    {
                        "id": 7506,
                        "title": "The Misfortune Teller",
                        "overview": "Bret is fighting a murder charge. But when he meets his lawyer - a numerologist, astrologer and bungler - he knows his number is up.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7506.jpg"
                    },
                    {
                        "id": 7507,
                        "title": "Greenbacks, Unlimited",
                        "overview": "Bank robber Big Ed Murphy is at his wit's end: someone keeps beating him to the loot and that someone is Bret.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7507.jpg"
                    }
                ]
            },
            {
                "season_number": 4,
                "episodes": [
                    {
                        "id": 7508,
                        "title": "The Bundle from Britain",
                        "overview": "Returning to America after an extended stay in England, Cousin Beau Maverick (Roger Moore) is hired to take the place of a young English nobleman. However, he soon finds himself the victim of a kidnap and ransom plot due to his assumed identity.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7508.jpg"
                    },
                    {
                        "id": 7509,
                        "title": "Hadley's Hunters",
                        "overview": "Bart meets a comical sheriff (Edgar Buchanan) who is dead serious about killing him.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7509.jpg"
                    },
                    {
                        "id": 7510,
                        "title": "The Town That Wasn't There",
                        "overview": "Beau Maverick wins ownership of the Silver Hill, a worthless ore mine. A crooked railroad agent named Shanks tries to cheat the townspeople out of their land by offering them a price that is well below market value. Beau convinces the town to relocate Silver Hill to a sheep ranch twenty miles away. The plan backfires when a new vein of silver is discovered in the supposedly worthless Silver Hill mine, thus enabling Shanks to claim the land without cost. The only hope is for the town to relocate back to Silver Hill before the railroad takes over the land.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7510.jpg"
                    },
                    {
                        "id": 7511,
                        "title": "Arizona Black Maria",
                        "overview": "In hostile Sioux territory, Bart is caught between a woman prisoner's devastating charms and a pending Indian attack.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7511.jpg"
                    },
                    {
                        "id": 7512,
                        "title": "Last Wire from Stop Gap",
                        "overview": "On their way to Denver, Beau and Bart Maverick pick up $6,500 in a poker game at Stop Gap. They decide to wire the money to Denver through the Hulett Telegraph Company. They discover the company is a fake and that the telegraph line leads to a cave two miles away where the crooks stash the customers' money and send phony messages in return. The cousins devise a scheme to recover the money and put the company out of business.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7512.jpg"
                    },
                    {
                        "id": 7513,
                        "title": "Mano Nera",
                        "overview": "Looking for a peaceful and profitable poker game in New Orleans, Bart is plunged into a mysterious murder involving the Black Hand society.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7513.jpg"
                    },
                    {
                        "id": 7514,
                        "title": "A Bullet for the Teacher",
                        "overview": "In St. Joseph, Missouri, Beau Maverick wins half-ownership of the Golden Wheel Casino. The business venture is short-lived when his partner, Rand Storm, is shot to death by Flo Baker. Storm was a notorious ladies' man and Flo, a female entertainer, was resisting his advances. Just before he dies, Rand tells his younger brother, Luke, that the shooting was an accident. But Luke has Beau framed for murder so that he can take over the business.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7514.jpg"
                    },
                    {
                        "id": 7515,
                        "title": "The Witch of Hound Dog",
                        "overview": "Toil and trouble overcome Bret when he tangles with two burly thieves and their enchanting sister (Anita Sands) who claims she's a witch.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7515.jpg"
                    },
                    {
                        "id": 7516,
                        "title": "Thunder from the North",
                        "overview": "Two Army shopkeepers, Marsh and Lawson, have been cheating the local Indian tribes by supplying them with faulty or inferior goods. When one of the tribeswomen named Pale Moon threatens to report them to the Army Commission, the shopkeepers decide to start a war with the Indians. They know the Army will not investigate the woman's claim if they are at war. Marsh and Lawson murder Pale Moon's brother and pin the crime on the stranger who won $2,500 from them the night before - Beau Maverick.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7516.jpg"
                    },
                    {
                        "id": 7517,
                        "title": "The Maverick Line",
                        "overview": "Inheriting a stagecoach line from Uncle Micah is only the beginning of financial problems for the Maverick brothers.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7517.jpg"
                    },
                    {
                        "id": 7518,
                        "title": "Bolt from the Blue",
                        "overview": "Beau Maverick befriends a prospector named Ebenezer Bolt. Maverick is unaware that Bolt is the partner of notorious horse thief Benson January. An angry posse mistakes Beau for January and is determined to hang him. A young lawyer manages to halt the proceedings until Maverick can have a trial. Beau's conviction seems imminent when the lawyer locates a notorious \"hanging judge\" and a woman whose sister was engaged to January identifies Maverick as the horse thief.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7518.jpg"
                    },
                    {
                        "id": 7519,
                        "title": "Kiz",
                        "overview": "Beau Maverick crashes a party in Virginia City thrown by eccentric socialite Kiz Bouchet. Kiz has a penchant for smoking cigars, playing poker, and fighting fires. Recognizing Beau as a fellow free spirit, she hires him to protect her. She believes her life is in danger. Beau discovers that Kiz's cousin Melissa, along with family doctor Pittman and attorney Hanford, are plotting to have Kiz judged incompent so they can split her $2 million inheritance. Beau comes up with a scheme to turn the tables on Melissa.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7519.jpg"
                    },
                    {
                        "id": 7520,
                        "title": "Dodge City or Bust",
                        "overview": "Chivalrous Bart saves the life of a beautiful woman. His reward? A place on the wanted list for robbery and murder.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7520.jpg"
                    },
                    {
                        "id": 7521,
                        "title": "The Bold Fenian Men",
                        "overview": "The Fenians, an Irish Revolutionary Brotherhood, are trained soldiers sworn to free Ireland from British rule. The Fenians have gathered in Dakota City to plan a march into Canada where they want to take hold of a small part of British property hostage in exchange for Ireland's freedom. After England pressures the United States to intervene, Beau Maverick is blackmailed into infiltrating the Fenians ranks by a shrewd Army colonel.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7521.jpg"
                    },
                    {
                        "id": 7522,
                        "title": "Destination: Devil's Flat",
                        "overview": "Bart substitutes a rock-filled suitcase for a fortune in gold to foil hijacking plans of phony sheriff Dan Trevor (Peter Breck).",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7522.jpg"
                    },
                    {
                        "id": 7523,
                        "title": "A State of Siege",
                        "overview": "Proving once again that he's basically nonviolent, Bart witnesses a battle of bullets that leaves him stunned - and almost dead.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7523.jpg"
                    },
                    {
                        "id": 7524,
                        "title": "Family Pride",
                        "overview": "In New Mexico, Beau Maverick is taken for over $4,500 ($4,000 of which belong to his friend Jerry O'Brien) by con artists Warren and Crippen and Warren's granddaughter Rosanne. Beau tries to recover the money and even takes the threesome to court, but they outsmart him every time. Beau is so demoralized by the constant defeats, he believes he has disgraced the Maverick name - until Rosanne tells him that her grandmother was a Maverick.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7524.jpg"
                    },
                    {
                        "id": 7525,
                        "title": "The Cactus Switch",
                        "overview": "Thinking all's well with the world after he cleans up in a card game, Bart offers to help a troubled young woman.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7525.jpg"
                    },
                    {
                        "id": 7526,
                        "title": "Dutchman's Gold",
                        "overview": "Beau Maverick wins half-ownership in the Blue Bell Saloon in Arizona. In an attempt to raise funds for the floundering business, Beau and his partner Charlotte become partners with a mysterious gold prospector known only as the Dutchman. Along the trail to Superstition Mountain where the gold is located, Beau, Charlotte, and the Dutchman encounter danger in various forms.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7526.jpg"
                    },
                    {
                        "id": 7527,
                        "title": "The Ice Man",
                        "overview": "After discovering a long-lost body encased in ice, Bart finds himself in hot water.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7527.jpg"
                    },
                    {
                        "id": 7528,
                        "title": "Diamond Flush",
                        "overview": "Con artist Ferguson knocks Beau Maverick unconscious during an unsuccessful attempt to hoist a priceless diamond necklace from a French countess. Ferguson claims that the countess' diamond is fake and that he was in the process of replacing it with the real thing when Beau startled him. Ferguson offers Maverick $5,000 to switch diamonds. Beau is being set up for robbery by Ferguson and his equally devious wife.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7528.jpg"
                    },
                    {
                        "id": 7529,
                        "title": "Last Stop: Oblivion",
                        "overview": "Good-guy Bart warns the wrong people that their hosts are murderers and ends up as the next possible victim.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7529.jpg"
                    },
                    {
                        "id": 7530,
                        "title": "Flood's Folly",
                        "overview": "Outside Denver, Colorado, Beau and his friend, Judge Scott, find shelter during a blizzard at the home of Martha Flood and her niece Sally. Martha and the judge are plotting to institutionalize Sally in order to take over her inheritance. However, Martha's lover, a professional killer named Chet Whitehead plans to kill Sally, the judge, and Maverick.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7530.jpg"
                    },
                    {
                        "id": 7531,
                        "title": "Maverick at Law",
                        "overview": "Bart has a lot of explaining to do: the bank has been robbed and his saddlebags are bulging with stolen loot.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7531.jpg"
                    },
                    {
                        "id": 7532,
                        "title": "Red Dog",
                        "overview": "Beau Maverick stumbles onto the cave site meeting place of five outlaws. They were summoned by a bandit named Jess in order to plan a big job. Mavrick passes himself as the notorious Texas outlaw Red Dog. The outlaws become suspicious of Beau when he declines to join them in a $500,000 bank robbery scheme.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7532.jpg"
                    },
                    {
                        "id": 7533,
                        "title": "The Deadly Image",
                        "overview": "Bart's in jail: he's the unfortunate and helpless victim of mistaken identity.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7533.jpg"
                    },
                    {
                        "id": 7534,
                        "title": "Triple Indemnity",
                        "overview": "Cowardly George Parker (Alan Hewitt) offers Doc Holliday a tempting reward. All Doc has to do is kill his best friend - Bart.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7534.jpg"
                    },
                    {
                        "id": 7535,
                        "title": "The Forbidden City",
                        "overview": "Brent (Robert Colbert) joins the series in true Maverick style: he gets involved with two beautiful women - and is thrown in jail for gambling.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7535.jpg"
                    },
                    {
                        "id": 7536,
                        "title": "Substitute Gun",
                        "overview": "Bart matches wits - and bullets - with a professional gunman... and learns that a beautiful woman can be more deadly than hired killers.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7536.jpg"
                    },
                    {
                        "id": 7537,
                        "title": "Benefit of Doubt",
                        "overview": "In typical Maverick tradition, cousin Brent gets involved with two beautiful sisters one of whom is planning to do him in.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7537.jpg"
                    },
                    {
                        "id": 7538,
                        "title": "The Devil's Necklace (1)",
                        "overview": "Bart just made the deal of a lifetime: he blindly purchased a wagonload of merchandise - including a bound and gagged Indian girl.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7538.jpg"
                    },
                    {
                        "id": 7539,
                        "title": "The Devil's Necklace (2)",
                        "overview": "The Apaches catch Bart red-handed with a wagonload of liquor and a kidnapped Indian girl - and that means war.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7539.jpg"
                    }
                ]
            },
            {
                "season_number": 5,
                "episodes": [
                    {
                        "id": 7540,
                        "title": "Dade City Dodge",
                        "overview": "Bart tries to track down Pearly Gates, a smooth con man who cheated him out of $5000.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7540.jpg"
                    },
                    {
                        "id": 7541,
                        "title": "The Art Lovers",
                        "overview": "When investors put the squeeze on railroad owner Paul Sutton, Bart tries to help by dealing with them directly in a friendly card game.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7541.jpg"
                    },
                    {
                        "id": 7542,
                        "title": "The Golden Fleecing",
                        "overview": "Bart forsakes the poker table for the stock market -\r\n and finds himself trying to bluff wealthy Loftus Jaggers and his glamorous daughter (Paula Raymond).",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7542.jpg"
                    },
                    {
                        "id": 7543,
                        "title": "Three Queens Full",
                        "overview": "Bart must either face two years in jail or chaperone three brides to their intendeds the sons of wealthy Joe Wheelwright (Jim Backus).",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7543.jpg"
                    },
                    {
                        "id": 7544,
                        "title": "A Technical Error",
                        "overview": "Bart feels like a million when he wins a bank in a poker game. But unlucky Maverick soon learns the truth: the bank's broke and so is he.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7544.jpg"
                    },
                    {
                        "id": 7545,
                        "title": "Poker Face",
                        "overview": "Bart's latest poker adventure has him playing for a full house: the lives of his fellow stagecoach passengers.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7545.jpg"
                    },
                    {
                        "id": 7546,
                        "title": "Mr. Muldoon's Partner",
                        "overview": "After being granted a wish by a \"leprechaun\", Bart faces a pot of trouble: he must be either jailed, murdered or married.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7546.jpg"
                    },
                    {
                        "id": 7547,
                        "title": "Epitaph for a Gambler",
                        "overview": "Bart, waiting to collect on a $10,000 IOU, makes an uncomfortable observation: murder may be the pay-off in a gambler's life.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7547.jpg"
                    },
                    {
                        "id": 7548,
                        "title": "The Maverick Report",
                        "overview": "Crusading newspaper publisher Bart? The publisher Bart won the rag from is assassinated and a corrupt U.S. Senator files a $100,000 libel suit against the Chronicle. Luckily, Bart's pal Doc Holiday is in town for a dentists' convention and owes Bart $2000. When Doc brags \"I have enough collateral to raise the dead!\", Bart feels no compunction in selling ½ the headache to Doc. The senator and his sinister political boss are Ivy Leaguers, so the suave Philadelphia dentist/hired gun will come in handy.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7548.jpg"
                    },
                    {
                        "id": 7549,
                        "title": "Marshal Maverick",
                        "overview": "Bart is closer to tears than laughter when he is forced to battle the funniest - and fastest - gun in the West.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7549.jpg"
                    },
                    {
                        "id": 7550,
                        "title": "The Troubled Heir",
                        "overview": "Life is anything but heaven when Bart meets Pearly Gates and his girl, who steal Maverick's poker winnings so they can be married.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7550.jpg"
                    },
                    {
                        "id": 7551,
                        "title": "The Money Machine",
                        "overview": "A money-making machine costs Bart a bundle. His cousin (Kathy Bennett) has just bought one with the $10,000 he lent her.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7551.jpg"
                    },
                    {
                        "id": 7552,
                        "title": "One of Our Trains is Missing",
                        "overview": "While trying to get a young girl's romance back on the right track, Bart gets involved in a train robbery to end all train robberies.",
                        "runtime": 45,
                        "image_url": "/banners/episodes/70443/7552.jpg"
                    }
                ]
            }
        ],
        "background_url": "https://artworks.thetvdb.com/banners/fanart/original/70443-2.jpg"
    },
    {
        "id": 71098,
        "title": "Viper",
        "overview": "In the near future, an organized crime group known as the \"Outfit\" has become a major force in America. Engineer Julian Wilkes develops a high-tech crime-fighting vehicle called the Viper, which is intended to be a \"flagship\" in a new crackdown on crime. The Viper needs a driver, so when Outfit driver Michael Payton is injured and captured, his memory is erased, and he is given a new identity as Joe Astor, MetroPol employee. The Outfit discredits the Viper project, but when it is canceled, Joe and Julian steal the Viper and strike out on their own private war against crime.",
        "image_url": "/banners/posters/71098-2.jpg",
        "first_aired": 757468800000,
        "last_aired": 927331200000,
        "genres": [
            "Science Fiction",
            "Drama",
            "Crime",
            "Adventure",
            "Action"
        ],
        "seasons": [
            {
                "season_number": 1,
                "episodes": [
                    {
                        "id": 7902522,
                        "title": "Pilot (Part 1)",
                        "overview": "The ultimate weapon against crime, the Viper Defender is the city's only hope to stop a crime syndicate, the 'Outfit', from destroying the city. However, the Viper is just too fast and too powerful for all the police officers recruited to drive it.\r\nCity Commissoner Strand (Jon Polito) is desperate to get the Viper on the road. He plans on using the Viper's crime-fighting abilities to bolster support for his campaign to become mayor.\r\nAfter stealing a satellite, Michael Payton (James McCaffrey) flips his black Dodge Stealth in a spectacular crash. Strand hears about the accident and has Payton pronounced dead at the scene. Payton is the best getaway driver the Outfit had.\r\nCommissoner Strand orders that Payton's memory be erased and his appearance altered. When Payton awakes, he is told that he is a police officer named Joesph Payne Astor.\r\nOnce Joe gets behind the wheel of the Viper, it is obvious he has the skill to handle driving the car.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 7902523,
                        "title": "Pilot (Part 2)",
                        "overview": null,
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34275,
                        "title": "Once a Thief ...",
                        "overview": "Joe faces a terrifying choice when the doctor who performed memory-altering surgery on him offers to restore his criminal identity.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34276,
                        "title": "Ghosts",
                        "overview": "Joe's former partner in crime (Jason Carter) is sprung from prison by the Outfit in order to locate the Viper.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34277,
                        "title": "Safe as Houses",
                        "overview": "Nate Benedict, a Mob Boss who is about to be tried for various crimes, fakes his own death. He starts over in a small town to lay low and continue his criminal operations. The residents of Mesa Rose, the small town Benedict takes over, are powerless against Benedict's strong reach. The Viper turns out to be 'the great equalizer'.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34278,
                        "title": "Firehawk",
                        "overview": "As part of a plan to destroy the Viper, the Outfit kidnaps Julian and forces him to upgrade its own urban assault vehicle.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34279,
                        "title": "Mind Games",
                        "overview": "After Frankie is injured in a suspicious car crash, the Viper team uncovers a plot to hijack a transport loaded with highly contagious diseases.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34280,
                        "title": "The Face",
                        "overview": "\"The Face\", a famous hit man, has just been released from prison.  His plans to go straight are jeopardized when his former employer kidnaps his wife to force him to do one last hit!  Through the Consortium, he asks Joe Astor for help.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34281,
                        "title": "Wheels of Fire",
                        "overview": "Joe falls for the inventor of a highly efficient car battery, but painful memories of his murdered fiancee surface when her life is threatened. Meanwhile, the discovery of a long-lost concept car shocks everyone.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34282,
                        "title": "Past Tense",
                        "overview": "The Viper team must crack a ring that abducts youths and molds them into specialized criminals. Meanwhile, Joe encounters a special someone from his past.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34283,
                        "title": "Scoop",
                        "overview": "Joe teams with a police detective--a suspected vigilante--to find the culprit behind the murder of Outfit thugs.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34284,
                        "title": "Thief of Hearts",
                        "overview": "An artificial heart that will save the life of a young girl is stolen.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34285,
                        "title": "Crown of Thorns",
                        "overview": "A foreign dignitary visiting the U.S. becomes the new target of the assassin who previously killed her father.",
                        "runtime": 45,
                        "image_url": null
                    }
                ]
            },
            {
                "season_number": 2,
                "episodes": [
                    {
                        "id": 34286,
                        "title": "Winner Take All",
                        "overview": "The Viper returns to the streets of Metro City. The new prototype is given to Ex-CIA operative Thomas Cole (Jeff Kaake) and his team: Technician Frankie Waters (Joe Nipote) and systems programmer Dr. Allie Farrow (Dawn Stern). After the death of her partner, police officer Cameron Westlake (Heather Medway) joins the Viper team. The team then concentrates on taking Dekker, a rogue trucker who has been terrorizing the city.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34287,
                        "title": "MIG-89",
                        "overview": "Cameron uncovers an illegal arms-smuggling ring---but not before Allie and a visiting scientist are kidnapped and forced to develop a highly advanced fighter jet.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34288,
                        "title": "Condor",
                        "overview": "The massacre of four undercover cops, all of them set to share information regarding the mob, leads the team to seek help from a helicopter squad that's Viper's aerial equivalent.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34289,
                        "title": "Talk is Cheap",
                        "overview": "A talk-show host is targeted by a killer who has a unique way of getting rid of the bodies of his victims.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34290,
                        "title": "Diamond in the Rough",
                        "overview": "A disgruntled former security officer decides to become a jewel thief.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34291,
                        "title": "Standoff",
                        "overview": "Thieves after a new weapon have the Viper team trapped in an abandoned refinery.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34292,
                        "title": "White Fire",
                        "overview": "A string of diamond thefts points to a notorious criminal, but she cooperates with the Viper team to catch whom she claims is the real culprit.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34293,
                        "title": "Die Laughing",
                        "overview": "It's no joke when the Viper team's assigned to protect a comedienne and her son, who's witnessed the murder of an undercover FBI agent.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34294,
                        "title": "On a Roll",
                        "overview": "The Viper team and their superior are accused of treason after following a Government command to steal a lethal weapon.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34295,
                        "title": "Street Pirates",
                        "overview": "A band of weapons thieves plans to take the Defender next.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34296,
                        "title": "Breakdown on Thunder Road",
                        "overview": "A scientist fears his runaway son may be behind the theft of an extremely combustible rocket fuel, which the boy is using to power racing cars.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34297,
                        "title": "Manhunt",
                        "overview": "A scientist's invention saves his life but turns him into a killer cyborg.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34298,
                        "title": "Turf Wars",
                        "overview": "The Viper team is assigned to stop a gang war between two rival factions, and a 13-year-old gets caught in the middle of the fighting.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34299,
                        "title": "Forget-me-Not",
                        "overview": "A scientist is brainwashed into stealing nerve gas to be used in an attack on the U.S. Secretary of Defense.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34300,
                        "title": "Wheelman",
                        "overview": "An escaped con looking for revenge happens to be Cole's former mentor.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34301,
                        "title": "Shutdown",
                        "overview": "The city is terrorized by a criminal who is driving around in a clever imitation of the Viper.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34302,
                        "title": "Echo of Murder",
                        "overview": "Cole's investigates the death of his friend, an investigative reporter, but his only clue is a holgram of a movie star who committed suicide long ago.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34303,
                        "title": "Thieves Like Us",
                        "overview": "The Viper team is accused of treason after their new boss tells them to steal a weapon that creates spontaneous human combustion.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34304,
                        "title": "Cold Storage",
                        "overview": "A charismatic mass-murderer in cryogenic suspension manages to escape to rejoin his followers.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34305,
                        "title": "Whistle Blower",
                        "overview": "An autistic man is the only witness to the murder of his brother.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34306,
                        "title": "Black Box",
                        "overview": "A murdered software designer leaves artificial intelligence to his girlfriend.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34307,
                        "title": "The List",
                        "overview": "Westlake witnesses Cole's death, only to learn that he's alive and well---and working as an informant for a powerful crime family.",
                        "runtime": 45,
                        "image_url": null
                    }
                ]
            },
            {
                "season_number": 3,
                "episodes": [
                    {
                        "id": 34308,
                        "title": "Triple Cross",
                        "overview": "Cole's former fiancÃ©e, who says she's dying and needs a bone-marrow transplant, convinces Cole to temporarily release a prisoner whose marrow matches hers.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34309,
                        "title": "Cat and Mouse",
                        "overview": "Westlake kills the lover of a professional assassin during a prison break, and soon finds herself targeted for revenge.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34310,
                        "title": "The Best Couple",
                        "overview": "A simple background check on Westlake's friend's new husband turns up information suggesting that the groom may not be what he seems.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34311,
                        "title": "Hidden Agenda",
                        "overview": "An arson killing rings a bell for Cole, who investigated similar cases years ago and suspects they're related. His only lead is a mysterious woman who was on the scene.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34312,
                        "title": "Out from Oblivion",
                        "overview": "When Cole discovers an old CIA buddy living on the streets, he's again led into a world of espionage and intrigue.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34313,
                        "title": "Storm Watch",
                        "overview": "A fully equipped motorcycle and rider threaten the future of the team.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34314,
                        "title": "Cold Warriors",
                        "overview": "Westlake's mother is captivated by a secret agent.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34315,
                        "title": "First Mob Wives' Club",
                        "overview": "Cole goes under cover at a health club frequented by the beautiful wives of gangsters in order to solve the murder of one woman's husband.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34316,
                        "title": "Getting MADD",
                        "overview": "Cole's niece must live with the consequences of a fatal drunken driving accident; Frankie, Catlett and Cole uncover a drug ring at a local club.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34317,
                        "title": "Wilderness Run",
                        "overview": "Cameron Westlake, a police officer, volunteers to spend a week helping her friend Elise Grayhawk, who run Camp Sasamat,  a retreat for over worked executives.\r\nHanley  (Michael Mahonen) and his friend, Mike,  plot to kidnap his former boss, Iris Bentine, and hold her for  five million dollars ransom. Hanley had been a janitor at her corporation, but was fired and is very bitter about it. He plots revenge...\r\nIris, and her assistant, Julie Stone,  have come for a week long retreat in the wilderness. Here they are supposed to  spend time in the woods, enjoying nature and learn team work skills as a \"\"get back to nature, and  find your true self...\"\" experience; but, Iris is work driven and can not relax . She is annoyed that Julie talked her into taking time off from work.\r\nHanley stops a pair of forest rangers, kills them and steals their uniforms. Then he and his Mike, pretending to be Rangers Crawford and Barnes, proceed to the woods to find and kidnap his former boss, Iris Bentine!\r\nCole a",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34318,
                        "title": "Breakout",
                        "overview": "Cole and Westlake desperately search for an escaped convict who is carrying a deadly virus.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34319,
                        "title": "The Getaway",
                        "overview": "A crime lord's murder threatens to reveal government corruption.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34320,
                        "title": "What Makes Sammy Chun",
                        "overview": "An ex-con turned tabloid news reporter gets mixed up in Cole's investigation of an arms dealer.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34321,
                        "title": "Paper Trail",
                        "overview": "Cole's girlfriend becomes a prime suspect in a million-dollar robbery.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34322,
                        "title": "Regarding Catlett",
                        "overview": "After an attempt on Catlett's life, Cole and Frankie must find the insider responsible.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34323,
                        "title": "Trust No One",
                        "overview": "Catlett and Westlake pose as husband-and-wife burglars in order to catch an arms dealer.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34324,
                        "title": "Double Team",
                        "overview": "Catlett and Westlake pose as husband-and-wife burglars in order to catch an arms dealer.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34325,
                        "title": "Hot Potato",
                        "overview": "A computer disk becomes the key to catching a corrupt federal marshal.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34326,
                        "title": "Homecoming",
                        "overview": "Cole returns to his hometown to help his father solve a mystery when the local police chief dies.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34327,
                        "title": "Old Acquaintance",
                        "overview": "Westlake must protect her photojournalist ex-husband from sudden attempts on his life.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34328,
                        "title": "Internal Affair",
                        "overview": "After an undercover assignment goes awry, Westlake is abducted by mercenaries bent on detonating a bomb -- with her help.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34329,
                        "title": "About Face",
                        "overview": "Notorious criminal Giles Seton masterminds a plot to create a Cole look-alike to steal the Defender.",
                        "runtime": 45,
                        "image_url": null
                    }
                ]
            },
            {
                "season_number": 4,
                "episodes": [
                    {
                        "id": 34330,
                        "title": "The Return",
                        "overview": "Joe Astor returns to drive the new Viper when Thomas Cole is reassigned after blowing up the old Viper.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34331,
                        "title": "Once a Con",
                        "overview": "A small-time con artist helps Astor and Westlake catch a money launderer in an elaborate sting operation.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34332,
                        "title": "Wisegal",
                        "overview": "Astor infiltrates a security-tight mafia conference; a labor negotiator tries to seduce Westlake.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34333,
                        "title": "Holy Matrimony",
                        "overview": "Astor falls in love with the wife of a Colombian drug lord while investigating the Blanca Noche cartel.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34334,
                        "title": "Wanted: Fred or Alive",
                        "overview": "Astor and Westlake encounter a ruthless bounty hunter while trying to exonerate a man accused of murder.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34335,
                        "title": "The Full Frankie",
                        "overview": "Frankie bares all to uncover a blackmail-murder plot at a local strip club for women.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34336,
                        "title": "Honest Abe",
                        "overview": "A former Israeli spy's new life is threatened when arms dealers kidnap his wife.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34337,
                        "title": "Aftermath",
                        "overview": "An apparent terrorist bombing camouflages an elaborate plot for an heir to claim her father's million-dollar pension.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34338,
                        "title": "Family Matters",
                        "overview": "Astor and Westlake try to locate a stolen cache of diamonds before some dangerous criminals take possession of them.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34339,
                        "title": "The Really Real Re-Enactment",
                        "overview": "While staking out robbery suspects, Westlake finds out Astor isn't the man she thought he was.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34340,
                        "title": "Best Seller",
                        "overview": "After Catlett reads his brother's latest novel, fact becomes stranger than fiction as the plot line becomes real.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34341,
                        "title": "Seminar from Hell",
                        "overview": "One of Westlake's old enemies resurfaces to exact revenge after escaping from prison.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34342,
                        "title": "People Like Us",
                        "overview": "Astor and Westlake go under cover as a married couple to expose a ring of diamond thieves.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34343,
                        "title": "My Fair Hoodlums",
                        "overview": "Astor and Westlake try to stop a man who's plotting to kill his ex-wife for her jewel necklace.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34344,
                        "title": "Safe House",
                        "overview": "After desperate bank robbers take Astor hostage, Frankie and Catlett try to track him down.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34345,
                        "title": "Tiny Bubbles",
                        "overview": "Astor and Westlake must unravel a conspiracy after the secret formula is stolen from a soda company and its owner is murdered.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34346,
                        "title": "Of Course, It's a Miracle",
                        "overview": "Frankie befriends a self-proclaimed psychic who becomes involved in a plot to assassinate a senator.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34347,
                        "title": "Holy Terror",
                        "overview": "Astor and Westlake must protect a spiritual ruler from a fated encounter with an assassin.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34348,
                        "title": "Hell Hath No Fury",
                        "overview": "A series of deaths links to an old case, but someone does not want Astor and Westlake to reopen it.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34349,
                        "title": "Attack of the Teki-Ya",
                        "overview": "A Japanese detective, in town to extradite an assassin, goes head-to-head with an international crime boss.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34350,
                        "title": "Split Decision (1)",
                        "overview": "An electric shock causes Astor's brain implant to malfunction, turning him back into a criminal.",
                        "runtime": 45,
                        "image_url": null
                    },
                    {
                        "id": 34351,
                        "title": "Split Decision (2)",
                        "overview": "Astor agrees to have the brain implant removed; a distraught Westlake must focus on saving a kidnapping victim.",
                        "runtime": 45,
                        "image_url": null
                    }
                ]
            }
        ],
        "background_url": "https://artworks.thetvdb.com/banners/fanart/original/71098-1.jpg"
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
            content_id: movieData[2].id,
            title: movieData[2].title,
            image_url: movieData[2].image_url,
            type: "Movie",
            user_rating: 4.8,
            background_url: movieData[2].background_url
        },
        {
            content_id: movieData[1].id,
            title: movieData[1].title,
            image_url: movieData[1].image_url,
            type: "Movie",
            user_rating: 4.5,
            background_url: movieData[1].background_url
        },
        {
            content_id: tvData[1].id,
            title: tvData[1].title,
            image_url: tvData[1].image_url,
            type: "TV Show",
            user_rating: 4.5,
            background_url: tvData[1].background_url
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
            },
            background_url: tvData[0].background_url
        }
    ];

    const toWatchData = [
        {
            content_id: movieData[3].id,
            title: movieData[3].title,
            image_url: movieData[3].image_url,
            type: "Movie",
            user_rating: 4.5,
            background_url: movieData[3].background_url
        },
        {
            content_id: tvData[3].id,
            title: tvData[3].title,
            image_url: tvData[3].image_url,
            type: "TV Show",
            user_rating: 4.7,
            background_url: tvData[3].background_url
        }
    ];

    const customData0 = [
        {
            content_id: movieData[1].id,
            title: movieData[1].title,
            image_url: movieData[1].image_url,
            type: "Movie",
            user_rating: 4.5,
            background_url: movieData[1].background_url
        },
        {
            content_id: tvData[3].id,
            title: tvData[3].title,
            image_url: tvData[3].image_url,
            type: "TV Show",
            user_rating: 4.7,
            background_url: tvData[3].background_url
        }
    ];

    const customData1 = [
        {
            content_id: movieData[5].id,
            title: movieData[5].title,
            image_url: movieData[5].image_url,
            type: "Movie",
            user_rating: 4.9,
            background_url: movieData[5].background_url
        },
        {
            content_id: tvData[2].id,
            title: tvData[2].title,
            image_url: tvData[2].image_url,
            type: "TV Show",
            user_rating: 4.6,
            background_url: tvData[2].background_url
        }
    ];

    const customData2 = [
        {
            content_id: movieData[6].id,
            title: movieData[6].title,
            image_url: movieData[6].image_url,
            type: "Movie",
            user_rating: 4.7,
            background_url: movieData[6].background_url
        },
        {
            content_id: tvData[3].id,
            title: tvData[3].title,
            image_url: tvData[3].image_url,
            type: "TV Show",
            user_rating: 4.8,
            background_url: tvData[3].background_url
        }
    ];

    const customData3 = [
        {
            content_id: movieData[4].id,
            title: movieData[4].title,
            image_url: movieData[4].image_url,
            type: "Movie",
            user_rating: 4.9,
            background_url: movieData[4].background_url
        },
        {
            content_id: tvData[4].id,
            title: tvData[4].title,
            image_url: tvData[4].image_url,
            type: "TV Show",
            user_rating: 4.9,
            background_url: tvData[4].background_url
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
        content: customData0
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
