import React from 'react';
import { Outlet } from 'react-router-dom';


export const App = () => {
  return (
    <div>
      <p> Hello World. </p>
      <Outlet />
    </div>
  )
}

