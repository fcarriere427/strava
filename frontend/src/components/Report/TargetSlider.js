import React from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';

const TargetSlider = ({ currentTarget, updateHandler }) => {
  return (
    <Form>
      <FormGroup>
        <Label>Objectif annuel: {currentTarget} km</Label>
        <Input
          type="range"
          min="500"
          max="2000"
          step="10"
          value={currentTarget}
          onChange={updateHandler}
        />
      </FormGroup>
    </Form>
  );
};

export { TargetSlider };