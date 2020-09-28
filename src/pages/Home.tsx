import * as React from 'react';
import {
    Col, Row
} from 'react-bootstrap';

import PenetranceFilterPanel from "../components/PenetranceFilterPanel";
import GeneFrequencyStore from "../store/GeneFrequencyStore";

import "./Home.css";

interface IHomeProps {
    frequencyStore?: GeneFrequencyStore
}

class Home extends React.Component<IHomeProps>
{
    public render()
    {
        return (
            <div>
                <Row className="mb-5">
                    <Col
                        md={6}
                        className={'mx-auto d-flex flex-column align-items-center '}
                    >
                        <span className="home-page-logo">
                            <i className="fa fa-arrow-up" style={{color: "#FF9900"}} /> Signal<span className="home-page-logo-db">DB</span>
                        </span>
                        <span className="home-page-logo-title">
                            <strong><u>S</u></strong>omatic <strong><u>I</u></strong>ntegration of <u><strong>G</strong></u>ermli<u><strong>n</strong></u>e <u><strong>Al</strong></u>terations in Cancer
                        </span>
                        <span className="home-page-logo-title-info">17,152 patients and 55 cancer types</span>
                    </Col>
                </Row>
                <Row className="mb-5">
                    <PenetranceFilterPanel geneFrequencyStore={this.props.frequencyStore} />
                </Row>
            </div>
        );
    }
}

export default Home;
