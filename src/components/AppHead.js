import React, { Component } from 'react';
import RecordRTCComponent from './RecordRTCComponent';
import { Container, Row, Col } from 'react-bootstrap'

class AppHead extends Component {

    constructor() {
        super();
        this.state = {}
    }

    render() {
        return (
            <Container fluid={true}>
                <Row>
                    <Col sm={8}>
                        <div> Space for question list...</div>
                    </Col>
                    <Col sm={4}><RecordRTCComponent /></Col>
                </Row>
            </Container>
        );
    }

}

export default AppHead;