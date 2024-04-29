import React from 'react';
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import { App } from '/imports/ui/App';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MovieList from '../imports/ui/MovieList';
import { HomePage } from '../imports/ui/HomePage';
import Nav from '../imports/ui/Nav';
import SearchBar from '../imports/ui/SearchBar';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Nav />,
    children: [
      {
        path: "homepage",
        // this does not work
        element: <HomePage />
      },
      {
        path: "movielist",
        // this does not work
        element: <MovieList />
      },
      {
        path: "searchbar",
        // this does not work
        element: <SearchBar />
      },
    ]
  }
])

Meteor.startup(() => {
  const container = document.getElementById('react-target');
  const root = createRoot(container);
  root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>);
});
