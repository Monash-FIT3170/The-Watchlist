// DummyLists.js

const dummyLists = [
  {
    userId: 'user1',
    userName: 'JohnDoe',
    listId: 'favorite-shows',
    title: 'My Favorite Shows',
    description: 'A personal list of favorite TV shows.',
    listType: 'Favourite',
    content: [
      { type: 'tv', id: 'seinfeld', title: 'Seinfeld', image_url: './ExampleResources/seinfeld.jpg', rating: 4.5 },
      { type: 'tv', id: 'friends', title: 'Friends', image_url: './ExampleResources/friends.jpg', rating: 4.0 },
      { type: 'tv', id: 'planet-earth', title: 'Planet Earth', image_url: './ExampleResources/planet-earth.jpeg', rating: 4.8 },
      { type: 'tv', id: 'fresh-prince', title: 'Fresh Prince', image_url: './ExampleResources/fresh-prince.jpg', rating: 3.5 },
      { type: 'movie', id: '007', title: '007', image_url: './ExampleResources/007.jpg', rating: 3.9 }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 'user2',
    userName: 'JaneSmith',
    listId: 'must-watch',
    title: 'Must Watch Series',
    description: 'Essential series to watch.',
    listType: 'To Watch',
    content: [
      { type: 'tv', id: 'fresh-prince', title: 'Fresh Prince', image_url: './ExampleResources/fresh-prince.jpg', rating: 4.2 },
      { type: 'tv', id: 'seinfeld', title: 'Seinfeld', image_url: './ExampleResources/seinfeld.jpg', rating: 4.6 },
      { type: 'tv', id: 'friends', title: 'Friends', image_url: './ExampleResources/friends.jpg', rating: 4.3 },
      { type: 'movie', id: '007', title: '007', image_url: './ExampleResources/007.jpg', rating: 4.5 },
      { type: 'tv', id: 'planet-earth', title: 'Planet Earth', image_url: './ExampleResources/planet-earth.jpeg', rating: 4.9 }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 'user3',
    userName: 'EmilyRose',
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

export default dummyLists;
