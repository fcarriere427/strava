import React, { Component } from 'react';
import { Container } from 'reactstrap'

class Footer extends Component {

  render() {
    let today = new Date();
    let date_str = today.toLocaleDateString('fr-FR');

    return (
      <Container fluid className = "bg-light fw-light text-dark text-center ">
        <footer>
          <p><i>Current date : {date_str} </i></p>
        </footer>
      </Container>
    );
  }
}

export default Footer;
