import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './HomePage.jsx';
import { Outlet } from 'react-router-dom';
// import Navbar from './Navbar.jsx';
// import { Profile } from './Profile.jsx';
// import { AIPicks } from './AIPicks.jsx';
//import './App.css';



export const App = () => {
  return (
    <div>
      <p> Hello World. </p>
      <Outlet />
    </div>
  )
}

