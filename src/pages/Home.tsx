import classnames from 'classnames';
import * as React from 'react';
import {
    Col, Row
} from 'react-bootstrap';

import {PenetranceLevel} from "../components/Penetrance";
import {IPenetranceButtonProps, PenetranceButton} from "../components/PenetranceButton";
import GeneFrequencyStore from "../store/GeneFrequencyStore";

import "./Home.css";

interface IHomeProps {
    frequencyStore?: GeneFrequencyStore
}

const PenetranceButtonCol = (props: IPenetranceButtonProps) => {
    return (
        <Col xs={12} sm={6} lg={2} className="px-2">
            <PenetranceButton
                {...props}
                className={classnames("mb-2", props.penetrance.toLowerCase())}
                href={`/explore/${props.penetrance.toLowerCase()}`}
            />
        </Col>
    );
}

class Home extends React.Component<IHomeProps>
{
    public get penetranceButtons(): IPenetranceButtonProps[] {
        return [
            {
                penetrance: PenetranceLevel.High,
                geneCount: 666,
                variantCount: -1,
                patientCount: -1
            },
            {
                penetrance: PenetranceLevel.Moderate,
                geneCount: 66,
                variantCount: -1,
                patientCount: -1
            },
            {
                penetrance: PenetranceLevel.Low,
                geneCount: 6,
                variantCount: -1,
                patientCount: -1
            },
            {
                penetrance: PenetranceLevel.Uncertain,
                geneCount: 42,
                variantCount: -1,
                patientCount: -1
            },
        ];
    }

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
                    <Col xs={0} lg={1} className="m-auto" />
                    {this.penetranceButtons.map(props => <PenetranceButtonCol key={props.penetrance} {...props} />)}
                    <Col xs={0} lg={1} className="m-auto" />
                </Row>
            </div>
        );
    }
}

export default Home;
