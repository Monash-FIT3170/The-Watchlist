// DummyMovies.js

const dummyMovies = [
    {
      userId: 'user1',
      userName: 'JohnDoe',
      listId: 'favorite-shows',
      title: 'My Favorite Shows',
      description: 'A personal list of favorite TV shows.',
      listType: 'Favourite',
      content: [
        { 
          type: 'tv', 
          id: 'seinfeld', 
          title: 'Seinfeld', 
          image_url: './ExampleResources/seinfeld.jpg', 
          rating: 4.5,
          description: 'A sitcom that explores the absurdities of modern life and everyday situations.' 
        },
        {
          type: 'tv',
          id: 'friends',
          title: 'Friends',
          image_url: './ExampleResources/friends.jpg',
          rating: 4.0,
          description: 'A sitcom that follows the lives of six friends living in New York City.'
        },
        {
          type: 'tv',
          id: 'planet-earth',
          title: 'Planet Earth',
          image_url: './ExampleResources/planet-earth.jpeg',
          rating: 4.8,
          description: 'A documentary series that explores the natural world and its wonders.'
        },
        {
          type: 'tv',
          id: 'fresh-prince',
          title: 'Fresh Prince',
          image_url: './ExampleResources/fresh-prince.jpg',
          rating: 3.5,
          description: 'A sitcom that follows the life of a street-smart teenager from West Philadelphia.'
        },
        {
          type: 'tv',
          id: '007',
          title: '007',
          image_url: './ExampleResources/007.jpg',
          rating: 4.7,
          description: 'A series of spy films based on the fictional British Secret Service agent James Bond.'
        },
        {
          type: 'tv',
          id: 'breaking-bad',
          title: 'Breaking Bad',
          image_url: './ExampleResources/007.jpg',
          rating: 4.9,
          description: 'A high school chemistry teacher turned methamphetamine producer.'
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: 'user1',
      userName: 'JohnDoe',
      listId: 'must-watch',
      title: 'Must Watch Series',
      description: 'Essential series to watch.',
      listType: 'To Watch',
      content: [
        { 
          type: 'tv', 
          id: 'seinfeld', 
          title: 'Seinfeld', 
          image_url: './ExampleResources/seinfeld.jpg', 
          rating: 4.5,
          description: 'A sitcom that explores the absurdities of modern life and everyday situations.' 
        },
        {
          type: 'tv',
          id: 'friends',
          title: 'Friends',
          image_url: './ExampleResources/friends.jpg',
          rating: 4.0,
          description: 'A sitcom that follows the lives of six friends living in New York City.'
        },
        {
          type: 'tv',
          id: 'planet-earth',
          title: 'Planet Earth',
          image_url: './ExampleResources/planet-earth.jpeg',
          rating: 4.8,
          description: 'A documentary series that explores the natural world and its wonders.'
        },
        {
          type: 'tv',
          id: 'fresh-prince',
          title: 'Fresh Prince',
          image_url: './ExampleResources/fresh-prince.jpg',
          rating: 3.5,
          description: 'A sitcom that follows the life of a street-smart teenager from West Philadelphia.'
        },
        {
          type: 'tv',
          id: '007',
          title: '007',
          image_url: './ExampleResources/007.jpg',
          rating: 4.7,
          description: 'A series of spy films based on the fictional British Secret Service agent James Bond.'
        },
        {
          type: 'tv',
          id: 'breaking-bad',
          title: 'Breaking Bad',
          image_url: './ExampleResources/007.jpg',
          rating: 4.9,
          description: 'A high school chemistry teacher turned methamphetamine producer.'
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: 'user1',
      userName: 'JohnDoe',
      listId: 'classics',
      title: 'Top 5 Classics',
      description: 'Classic shows that define a generation.',
      listType: 'Custom',
      content: [
        { type: 'tv', id: '007', title: '007', image_url: './ExampleResources/007.jpg', rating: 5.0 },
        { type: 'tv', id: 'friends', title: 'Friends', image_url: './ExampleResources/friends.jpg', rating: 4.2 },
        { type: 'tv', id: 'planet-earth', title: 'Planet Earth', image_url: './ExampleResources/planet-earth.jpeg', rating: 4.4 },
        { type: 'tv', id: 'fresh-prince', title: 'Fresh Prince', image_url: './ExampleResources/fresh-prince.jpg', rating: 3.8 },
        { type: 'tv', id: 'seinfeld', title: 'Seinfeld', image_url: './ExampleResources/seinfeld.jpg', rating: 4.7 }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // ... more lists as required
  ];
  
  export default dummyMovies;