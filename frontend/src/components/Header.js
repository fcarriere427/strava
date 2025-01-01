import React, { Component } from 'react';
import { Nav, Navbar, NavItem, NavLink, NavbarBrand  } from 'reactstrap'
import { NavLink as RRNavLink } from 'react-router-dom';

import logo from '../assets/logo.png';
import stravaLogo from '../assets/strava.png';

class Header extends Component {

  render() {
    return (
      <div className="sticky-top">

        <Navbar color="warning" expand="xs" style={{ height: '6vh' }}>

          <NavbarBrand href="/">
            <img className="Image-fluid" 
              src={logo}
              alt="logo"
              width="30"
              height="30"
            >
            </img>
          </NavbarBrand>

          <NavbarBrand href="/">
            <img className="Image-fluid" 
              src={stravaLogo}
              alt="logo"
              width="60"
              height="20"
            >
            </img>
          </NavbarBrand>

          <Nav className="ml-auto" pills>
            <NavItem style={{ display: 'flex', alignItems: 'center' }}>
              <NavLink
                to="/tracker"
                tag={RRNavLink} activeclassname="active"
                >
                Tracker
              </NavLink>
            </NavItem>
            <NavItem style={{ display: 'flex', alignItems: 'center' }}>
              <NavLink
                to ="/list"
                tag={RRNavLink} activeclassname="active"
                >
                List
              </NavLink>
            </NavItem>
            <NavItem style={{ display: 'flex', alignItems: 'center' }}>
              <NavLink  
                to ="/report"
                tag={RRNavLink} activeclassname="active"
                >
                Report
              </NavLink>
            </NavItem>
            <NavItem style={{ display: 'flex', alignItems: 'center' }}>
              <NavLink
                to ="/map"
                tag={RRNavLink} activeclassname="active"
                >
                Map
              </NavLink>
            </NavItem>

          </Nav>

        </Navbar>
      </div>
    );
  }
}

export default Header;
