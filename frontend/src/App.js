import React, { Component } from 'react';

import HomePage from './pages/Home';
import ControllerPage from './pages/Controller';

import {
  Container,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink } from 'reactstrap';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar color="light" light expand="md">
            <NavbarBrand tag={Link} to="/">👏 Applause 👏 Review</NavbarBrand>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink tag={Link} to="/controller">Controller</NavLink>
              </NavItem>
            </Nav>
          </Navbar>
          <Container>
            <Route exact path="/controller" component={ControllerPage} />
            <Route exact path="/" component={HomePage} />
          </Container>
        </div>
      </Router>
    );
  }
}

export default App;
