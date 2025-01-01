import React, { Component } from 'react'
import { Container, Row } from 'reactstrap'


///////////////////////////////////////////////////////////////////////////////////////////////
class TargetBlock extends Component {
  render(){
    return(
      <Container fluid className='text-black text-center'>
        <Row className="py-2">
          <div>
            <input type="range" min="500" max ="2000" step="10" value={this.props.value} onChange={this.props.updateHandler}/>
            <p> Target: {this.props.value} </p>
          </div>
        </Row>
        <Row className="py-2">
          <div>
            <input type="button" value="reset" onClick={this.props.resetHandler}/>
          </div>
        </Row>
      </Container>
    )
  }
}

export {
  TargetBlock
}
