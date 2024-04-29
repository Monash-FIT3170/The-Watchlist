import React from 'react';
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import { App } from '/imports/ui/App';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { HomePage } from '../imports/ui/HomePage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    children: [
      {

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
