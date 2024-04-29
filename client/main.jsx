import React from 'react';
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import { App } from '/imports/ui/App';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ContentList from '../imports/ui/ContentList';
import { HomePage } from '../imports/ui/HomePage';
import Nav from '../imports/ui/Nav';
import SearchBar from '../imports/ui/SearchBar';
import TestContentList from '../imports/ui/TestContentList';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Nav />,
    children: [
      {
        path: "homepage",
        
        element: <HomePage />
      },
      {
        path: "contentlist",
        
        element: <ContentList />
      },
      {
        path: "searchbar",
        
        element: <SearchBar />
      },
      {
        path: "TestContentList",
        
        element: <TestContentList />
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
