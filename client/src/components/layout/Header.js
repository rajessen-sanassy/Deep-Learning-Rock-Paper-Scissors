import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
    return (
        <header>
        <div className="inner-header">
          <div className="logo">
            <NavLink to="/">
              RPLSS
            </NavLink>
          </div>
          <div className="navigation">
            <nav>
              <NavLink to="/about">
                About
              </NavLink>
              <NavLink to="/settings">
                Settings
              </NavLink>
            </nav>
          </div>
        </div>
      </header>
    );
};
 
export default Header;