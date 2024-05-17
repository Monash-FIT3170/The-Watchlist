// DummyLists.js

const dummyLists = [
  {
    userId: 'user1',
    userName: 'JohnDoe',
    listId: 'favorite-shows',
    title: 'Your Favourites',
    description: 'A personal list of favorite TV shows.',
    listType: 'Favourite',
    content: [
      { type: 'tv', id: '1', title: 'Seinfeld', image_url: './ExampleResources/seinfeld.jpg', rating: 4.5, overview: "A stand-up comedian and his three offbeat friends weather the pitfalls and payoffs of life in New York City in the '90s." },
      { type: 'tv', id: '2', title: 'Friends', image_url: './ExampleResources/friends.jpg', rating: 4.0,overview: "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan."},
      { type: 'tv', id: '3', title: 'Planet Earth', image_url: './ExampleResources/planet-earth.jpeg', rating: 4.8, overview: "A groundbreaking series narrated by David Attenborough, exploring the wild and beautiful parts of our planet like never before." },
      { type: 'tv', id: '4', title: 'Fresh Prince', image_url: './ExampleResources/fresh-prince.jpg', rating: 3.5, overview: "The misadventures of a wealthy family where Will Smith, the Philadelphia-born wise-cracking teen, is sent to live with his aunt and uncle." },
      { type: 'movie', id: '1', title: '007', image_url: './ExampleResources/007.jpg', rating: 3.9, overview: "A British spy with a license to kill, James Bond is a suave, sophisticated super-spy with a taste for fast cars."},
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 'user1',
    userName: 'JohnDoe',
    listId: 'must-watch',
    title: 'Your To Watch List',
    description: 'Essential series to watch.',
    listType: 'To Watch',
    content: [
      { type: 'tv', id: '4', title: 'Fresh Prince', image_url: './ExampleResources/fresh-prince.jpg', rating: 3.5, overview: "The misadventures of a wealthy family where Will Smith, the Philadelphia-born wise-cracking teen, is sent to live with his aunt and uncle." },
      { type: 'tv', id: '1', title: 'Seinfeld', image_url: './ExampleResources/seinfeld.jpg', rating: 4.5, overview: "A stand-up comedian and his three offbeat friends weather the pitfalls and payoffs of life in New York City in the '90s." },
      { type: 'movie', id: '1', title: '007', image_url: './ExampleResources/007.jpg', rating: 3.9, overview: "A British spy with a license to kill, James Bond is a suave, sophisticated super-spy with a taste for fast cars."},
      { type: 'movie', id: '1', title: '007', image_url: './ExampleResources/007.jpg', rating: 3.9, overview: "A British spy with a license to kill, James Bond is a suave, sophisticated super-spy with a taste for fast cars."},
      { type: 'movie', id: '1', title: '007', image_url: './ExampleResources/007.jpg', rating: 3.9, overview: "A British spy with a license to kill, James Bond is a suave, sophisticated super-spy with a taste for fast cars."},
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
      { type: 'tv', id: '3', title: 'Planet Earth', image_url: './ExampleResources/planet-earth.jpeg', rating: 4.8, overview: "A groundbreaking series narrated by David Attenborough, exploring the wild and beautiful parts of our planet like never before." },
      { type: 'tv', id: '4', title: 'Fresh Prince', image_url: './ExampleResources/fresh-prince.jpg', rating: 3.5, overview: "The misadventures of a wealthy family where Will Smith, the Philadelphia-born wise-cracking teen, is sent to live with his aunt and uncle." },
      { type: 'movie', id: '1', title: '007', image_url: './ExampleResources/007.jpg', rating: 3.9, overview: "A British spy with a license to kill, James Bond is a suave, sophisticated super-spy with a taste for fast cars."},
      { type: 'movie', id: '1', title: '007', image_url: './ExampleResources/007.jpg', rating: 3.9, overview: "A British spy with a license to kill, James Bond is a suave, sophisticated super-spy with a taste for fast cars."},
      { type: 'movie', id: '1', title: '007', image_url: './ExampleResources/007.jpg', rating: 3.9, overview: "A British spy with a license to kill, James Bond is a suave, sophisticated super-spy with a taste for fast cars."},
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 'user4',
    userName: 'AliceJohnson',
    listId: 'action-packed',
    title: 'Action Packed Adventures',
    description: 'High-octane shows and movies for thrill-seekers.',
    listType: 'Custom',
    content: [
      { type: 'tv', id: '3', title: 'Planet Earth', image_url: './ExampleResources/planet-earth.jpeg', rating: 4.8, overview: "A groundbreaking series narrated by David Attenborough, exploring the wild and beautiful parts of our planet like never before." },
      { type: 'tv', id: '4', title: 'Fresh Prince', image_url: './ExampleResources/fresh-prince.jpg', rating: 3.5, overview: "The misadventures of a wealthy family where Will Smith, the Philadelphia-born wise-cracking teen, is sent to live with his aunt and uncle." },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 'user5',
    userName: 'BobWhite',
    listId: 'comedy-nights',
    title: 'Comedy Nights',
    description: 'Laugh out loud with these hilarious sitcoms.',
    listType: 'Custom',
    content: [
      { type: 'tv', id: '4', title: 'Fresh Prince', image_url: './ExampleResources/fresh-prince.jpg', rating: 3.5, overview: "The misadventures of a wealthy family where Will Smith, the Philadelphia-born wise-cracking teen, is sent to live with his aunt and uncle." },
      { type: 'movie', id: '1', title: '007', image_url: './ExampleResources/007.jpg', rating: 3.9, overview: "A British spy with a license to kill, James Bond is a suave, sophisticated super-spy with a taste for fast cars."},
      { type: 'movie', id: '1', title: '007', image_url: './ExampleResources/007.jpg', rating: 3.9, overview: "A British spy with a license to kill, James Bond is a suave, sophisticated super-spy with a taste for fast cars."},
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 'user6',
    userName: 'ClaraBlue',
    listId: 'nature-lovers',
    title: 'Nature Lovers',
    description: 'Explore the beauty of our planet with these documentaries.',
    listType: 'Custom',
    content: [
      { type: 'tv', id: '4', title: 'Fresh Prince', image_url: './ExampleResources/fresh-prince.jpg', rating: 3.5, overview: "The misadventures of a wealthy family where Will Smith, the Philadelphia-born wise-cracking teen, is sent to live with his aunt and uncle." }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 'user7',
    userName: 'DerekSmith',
    listId: 'family-fun',
    title: 'Family Fun Nights',
    description: 'Family-friendly movies and shows everyone will enjoy.',
    listType: 'Custom',
    content: [
      { type: 'tv', id: '4', title: 'Fresh Prince', image_url: './ExampleResources/fresh-prince.jpg', rating: 3.5, overview: "The misadventures of a wealthy family where Will Smith, the Philadelphia-born wise-cracking teen, is sent to live with his aunt and uncle." },
      { type: 'tv', id: '4', title: 'Fresh Prince', image_url: './ExampleResources/fresh-prince.jpg', rating: 3.5, overview: "The misadventures of a wealthy family where Will Smith, the Philadelphia-born wise-cracking teen, is sent to live with his aunt and uncle." },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 'user8',
    userName: 'EvaGreen',
    listId: 'chill-weekends',
    title: 'Chill Weekends',
    description: 'Perfect picks for a relaxed weekend binge.',
    listType: 'Custom',
    content: [
      { type: 'tv', id: '3', title: 'Planet Earth', image_url: './ExampleResources/planet-earth.jpeg', rating: 4.8, overview: "A groundbreaking series narrated by David Attenborough, exploring the wild and beautiful parts of our planet like never before." },
      { type: 'tv', id: '4', title: 'Fresh Prince', image_url: './ExampleResources/fresh-prince.jpg', rating: 3.5, overview: "The misadventures of a wealthy family where Will Smith, the Philadelphia-born wise-cracking teen, is sent to live with his aunt and uncle." },
      { type: 'tv', id: '3', title: 'Planet Earth', image_url: './ExampleResources/planet-earth.jpeg', rating: 4.8, overview: "A groundbreaking series narrated by David Attenborough, exploring the wild and beautiful parts of our planet like never before." },
      { type: 'tv', id: '4', title: 'Fresh Prince', image_url: './ExampleResources/fresh-prince.jpg', rating: 3.5, overview: "The misadventures of a wealthy family where Will Smith, the Philadelphia-born wise-cracking teen, is sent to live with his aunt and uncle." },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),

  },
  {
    userId: 'user1',
    userName: 'JohnDoe',
    listId: 'comedy-nights',
    title: 'Comedy Nights',
    description: 'Laugh out loud with these hilarious sitcoms.',
    listType: 'Custom',
    content: [
      { type: 'tv', id: '3', title: 'Planet Earth', image_url: './ExampleResources/planet-earth.jpeg', rating: 4.8, overview: "A groundbreaking series narrated by David Attenborough, exploring the wild and beautiful parts of our planet like never before." },
      { type: 'tv', id: '4', title: 'Fresh Prince', image_url: './ExampleResources/fresh-prince.jpg', rating: 3.5, overview: "The misadventures of a wealthy family where Will Smith, the Philadelphia-born wise-cracking teen, is sent to live with his aunt and uncle." },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 'user1',
    userName: 'JohnDoe',
    listId: 'nature-lovers',
    title: 'Nature Lovers',
    description: 'Explore the beauty of our planet with these documentaries.',
    listType: 'Custom',
    content: [
      { type: 'tv', id: '3', title: 'Planet Earth', image_url: './ExampleResources/planet-earth.jpeg', rating: 4.8, overview: "A groundbreaking series narrated by David Attenborough, exploring the wild and beautiful parts of our planet like never before." },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 'user1',
    userName: 'JohnDoe',
    listId: 'family-fun',
    title: 'Family Fun Nights',
    description: 'Family-friendly movies and shows everyone will enjoy.',
    listType: 'Custom',
    content: [
      { type: 'tv', id: '3', title: 'Planet Earth', image_url: './ExampleResources/planet-earth.jpeg', rating: 4.8, overview: "A groundbreaking series narrated by David Attenborough, exploring the wild and beautiful parts of our planet like never before." },
      { type: 'tv', id: '4', title: 'Fresh Prince', image_url: './ExampleResources/fresh-prince.jpg', rating: 3.5, overview: "The misadventures of a wealthy family where Will Smith, the Philadelphia-born wise-cracking teen, is sent to live with his aunt and uncle." },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 'user1',
    userName: 'JohnDoe',
    listId: 'chill-weekends',
    title: 'Chill Weekends',
    description: 'Perfect picks for a relaxed weekend binge.',
    listType: 'Custom',
    content: [
      { type: 'tv', id: '3', title: 'Planet Earth', image_url: './ExampleResources/planet-earth.jpeg', rating: 4.8, overview: "A groundbreaking series narrated by David Attenborough, exploring the wild and beautiful parts of our planet like never before." },
      { type: 'tv', id: '4', title: 'Fresh Prince', image_url: './ExampleResources/fresh-prince.jpg', rating: 3.5, overview: "The misadventures of a wealthy family where Will Smith, the Philadelphia-born wise-cracking teen, is sent to live with his aunt and uncle." },
      { type: 'movie', id: '1', title: '007', image_url: './ExampleResources/007.jpg', rating: 3.9, overview: "A British spy with a license to kill, James Bond is a suave, sophisticated super-spy with a taste for fast cars."},
      { type: 'movie', id: '1', title: '007', image_url: './ExampleResources/007.jpg', rating: 3.9, overview: "A British spy with a license to kill, James Bond is a suave, sophisticated super-spy with a taste for fast cars."},
      { type: 'movie', id: '1', title: '007', image_url: './ExampleResources/007.jpg', rating: 3.9, overview: "A British spy with a license to kill, James Bond is a suave, sophisticated super-spy with a taste for fast cars."},
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

];

export default dummyLists;
