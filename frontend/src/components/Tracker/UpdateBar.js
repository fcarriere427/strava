import React, { Component } from 'react'
import { Button, Row, Col } from 'reactstrap'
import axios from 'axios';
//OLD = const axios = require('axios').default;

//////////////////////////////////////////////////////////////////////////////////////////////
class UpdateBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
       message: "Not updated yet",
       date: "undefined"
     };
  }

  componentDidMount(){
    // Récupération de la date de la dernière activité (format lisible, en local time)
    let url = '/api/strava/last_activity_date';
    axios.get(url)
    .then(
      (response) => {
        // la date est censée arriver au format FR depuis le backend...
        this.setState({ date : response.data.last_activity_date });
      },
      (error) => {
        console.log("ERREUR de l'API  : " + error);
      }
    )
  }

  // Actions pour les boutons "update" & "reload"
  updateActivities() {
    console.log("on va lancer updateActivities");
    let url = '/api/strava/update';
    this.setState({ message : "fetching activities..." });
    axios.get(url)
    .then(
      (response) => {
        this.setState({ message : response.data });
        console.log(this.state.message + " activities fetched!");
        this.props.onChange();
      },
      (error) => {
        console.log("ERREUR de l'API  : " + error);
      }
    )
  }

  reloadActivities() {
    console.log("on va lancer reloadActivities, c'est long !!!")
    let url = '/api/strava/reload';
    this.setState({ message : "fetching activities..." });
    axios.get(url)
    .then(
      (response) => {
        this.setState({ message : response.data });
        console.log(this.state.message + " activities fetched!");
        this.props.onChange();
      },
      (error) => {
        console.log("ERREUR de l'API  : " + error);
      }
    )
  }


  render(){
    return(
      <Row className="bg-light text-black border py-2">
        <Col xs="4">
          <LastActivityDate date={this.state.date}/>
        </Col>
        <Col xs="8">
          <Row>
            <Col xs="6">
              <Button color="primary" onClick={(evt) => this.updateActivities()}>
                Update
              </Button>
            </Col>
            <Col xs="2">
              <Button color="danger"  onClick={(evt) => this.reloadActivities()}>
                Reload(!)
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <UpdateDisplay message={this.state.message} />
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}


//////////////////////////////////////////////////////////////////////////////////////////////
class LastActivityDate extends Component {
  render() {
    return (
      <p className="fw-light">Last activity:<br/> {this.props.date}</p>
    );
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////
class UpdateDisplay extends Component {
  render(){
    if(typeof(this.props.message) == "number"){
      return(
         <p className="fw-light">
           Updated with {this.props.message} activities
         </p>
      )
    } else {
      return(
        <p className="fw-light">
          {this.props.message}
        </p>
      )
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////
export { UpdateBar }
