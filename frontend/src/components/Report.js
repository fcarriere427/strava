// components/Report.js
import React, { Component } from 'react';
import { Container, Row, Col, Table } from 'reactstrap';
import { SelectYearReport } from './Report/SelectYearReport';
import { TargetSlider } from './Report/TargetSlider';
import { targetManager } from '../utils/targetManager';

const axios = require('axios').default;

class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentYear: new Date().getFullYear(),
            reportData: {
                monthly: [],
                total: {}
            },
            currentTarget: targetManager.get()  // Initialisation depuis localStorage
        };
    }

    componentDidMount() {
        this.getReportData(this.state.currentYear);
    }

    // Handler pour le sélecteur d'année
    updateYear(evt) {
        this.setState({ currentYear: evt.target.value }, () => {
            this.getReportData(this.state.currentYear);
        });
    }

    // Handler pour le slider
    updateTarget(evt) {
        const newTarget = parseInt(evt.target.value);
        targetManager.set(newTarget);  // Sauvegarde dans localStorage
        this.setState({ currentTarget: newTarget }, () => {
            this.getReportData(this.state.currentYear);
        });
    }

    getReportData(year) {
        const url = `/api/strava/report?year=${year}&target=${this.state.currentTarget}`;
        
        axios.get(url)
            .then(response => {
                this.setState({ reportData: response.data });
            })
          .catch(error => {
            console.log("Erreur API:", error);
            console.log("Status:", error.response?.status);
            console.log("Message:", error.message);
          });
    }

  render() {
    const { reportData } = this.state;
    
    return (
      <Container fluid>
        <Row className="py-2">
            <Col md={6}>
                <SelectYearReport currentYear={this.state.currentYear} updateHandler={(evt) => this.updateYear(evt)} />
            </Col>
            <Col md={6}>
                <TargetSlider currentTarget={this.state.currentTarget} updateHandler={(evt) => this.updateTarget(evt)}/>
            </Col>
        </Row>
        <Table striped bordered>
          <thead>
            <tr className="bg-warning table-warning">
              <th>Month</th>
              <th>Actual (km)</th>
              <th>Target (km)</th>
              <th>Delta (km)</th>
              <th>Actual (cumul.)</th>
              <th>Target (cumul.)</th>
              <th>Delta (cumul.)</th>
              <th>Avg (km/d)</th>
              <th>Avg (km/w)</th>
            </tr>
          </thead>
          <tbody>
            {reportData.monthly.map(month => (
              <tr key={month.month}>
                <td>{month.month}</td>
                <td>{month.actual.toFixed(1)}</td>
                <td>{month.target.toFixed(1)}</td>
                <td>{month.delta.toFixed(1)}</td>
                <td>{month.actualCumul.toFixed(1)}</td>
                <td>{month.targetCumul.toFixed(1)}</td>
                <td>{month.deltaCumul.toFixed(1)}</td>
                <td>{month.avgPerDay.toFixed(2)}</td>
                <td>{month.avgPerWeek.toFixed(1)}</td>
              </tr>
            ))}
            <tr className="bg-warning table-warning">
              <td>TOTAL</td>
              <td>{reportData.total.actual?.toFixed(1)}</td>
              <td>{reportData.total.target?.toFixed(1)}</td>
              <td>{reportData.total.delta?.toFixed(1)}</td>
              <td>{reportData.total.actualCumul?.toFixed(1)}</td>
              <td>{reportData.total.targetCumul?.toFixed(1)}</td>
              <td>{reportData.total.deltaCumul?.toFixed(1)}</td>
              <td>{reportData.total.avgPerDay?.toFixed(2)}</td>
              <td>{reportData.total.avgPerWeek?.toFixed(1)}</td>
            </tr>
          </tbody>
        </Table>
      </Container>
    );
  }
}

export default Report;