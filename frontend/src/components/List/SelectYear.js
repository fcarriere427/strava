import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Col } from 'reactstrap';

const SelectYear = ({ currentYear, updateHandler }) => {
  const [annees, setAnnees] = useState(['*** All ***']);

  useEffect(() => {
    const startYear = 2015;
    const lastYear = new Date().getFullYear();
    const years = ['*** All ***'];
    for (let year = lastYear; year >= startYear; year--) {
      years.push(year);
    }
    setAnnees(years);
  }, []);

  // const handleChange = (e) => {
  //   updateHandler(e.target.value === '*** All ***' ? 'all' : e.target.value);
  // };

  return (
    <Form className="form">
      <FormGroup row>
        <Label for="select" xs={4} className="fw-light">Select year:</Label>
        <Col xs={4}>
          <Input 
            type="select" 
            name="select" 
            id="select" 
            value={currentYear === 'all' ? '*** All ***' : currentYear}
            onChange={updateHandler}
          >
            {annees.map((annee, index) => (
              <option key={index} value={annee}>
                {annee === '*** All ***' ? '* All Time *' : annee}
              </option>
            ))}
          </Input>
        </Col>
      </FormGroup>
    </Form>
  );
};

export { SelectYear };