import React, { Component } from 'react'
import { Form, FormGroup, Label, Input, Col } from 'reactstrap'

///////////////////////////////////////////////////////////////////////////////////////////////
class SelectYear extends Component {

  constructor(props){
    super(props);
    this.state = {
       annees: []
     };
   }

  componentDidMount(){
    // Remplissage du tableau annees
    let start_year = 2015 // début des activités Strava
    let last_year = new Date().getFullYear()
    let annees = ['*** All ***'];
    for (let year = last_year; year >= start_year; year--){
        annees.push(year);
    };
    this.setState({annees: annees});
  }

  render(){
    return(
      <Form className="form">
        <FormGroup row>
          <Label for="select" xs={4} className="fw-light"> Select year: </Label>
          <Col xs={4}>
            <Input 
              type="select" 
              name="select" 
              id="select" 
              value={this.props.currentYear} 
              onChange={this.props.updateHandler}
            >
              {
                this.state.annees.map( (annee,index) =>
                  <option key={index} value={annee}>
                    {annee === '*** All ***' ? '* All Time *' : annee}
                  </option> )
              }
            </Input>
          </Col>
        </FormGroup>
      </Form>
    )
  }
}

export {
  SelectYear
}
