import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaRegUserCircle  } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { IconContext } from 'react-icons';
import './Navbar.css';

// Add new static Navbar items here
const navbarData = [
    {
        title: 'Home',
        path: '/',
        icon: <FaHome />,
        cName: 'navbar-text'
    },
    {
        title: 'Profile',
        path: '/profile',
        icon: <FaRegUserCircle />,
        cName: 'navbar-text'
    },
    {
        title: 'AI Picks',
        path: '/ai-picks',
        icon: <BsStars />,
        cName: 'navbar-text'
    }
]

// TODO: Need 'Meteor Subscribe' or useEffect to dynamically add/check for Watchlists


const Navbar = () => {
    return (  
        <IconContext.Provider value={{color: '#E2DCDE'}}>
            <nav className="navbar">
                <ul className="navbar-items">
                    {navbarData.map((item, index) => {
                        return (
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span className="navbar-span">{item.title}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </IconContext.Provider>
        
    );
}
 
export default Navbar;