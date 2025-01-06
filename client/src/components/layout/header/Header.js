import React, { useState } from 'react';
import './Header.css';
import { NavLink } from 'react-router-dom';
import Search from '../../helper/search/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, List } from '@mui/material';
import { useAuthContext } from '../../../context/authContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthContext();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Box className="headerContainer">
      {/* Logo */}
      <NavLink to="/" className="logo">
        <h1 className="header-title">Padhe <span>Chalo</span></h1>
      </NavLink>

      {/* Hamburger Icon */}
      <Box className="hamburger" onClick={toggleMenu}>
        {isMenuOpen ? (
          <CloseIcon size={30} color="black" />
        ) : (
          <MenuIcon size={30} color="black" />
        )}
      </Box>

      {/* Search Bar */}
      <Box className="searchContainer">
        <Search />
      </Box>

      {/* Navigation Links */}
      <Box className={`nav-items ${isMenuOpen ? 'nav-active' : ''}`}>
        <List>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
            onClick={toggleMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
            onClick={toggleMenu}
          >
            About
          </NavLink>
          <NavLink
            to="/courses"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
            onClick={toggleMenu}
          >
            Courses
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
            onClick={toggleMenu}
          >
            Contact
          </NavLink>
        </List>

        {/* Buttons inside Hamburger */}
        {!isAuthenticated && (
          <Box className="button">
            <NavLink to="/register">
              <Button variant="contained">Register</Button>
            </NavLink>
            <NavLink to="/login">
              <Button variant="contained">Login</Button>
            </NavLink>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Header;
