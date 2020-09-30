import _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import {
    Col, Row
} from 'react-bootstrap';

import PenetranceFilterPanel from "../components/PenetranceFilterPanel";
import GeneFrequencyStore, {isFrequencyDataPending} from "../store/GeneFrequencyStore";

import "./Home.css";

interface IHomeProps {
    frequencyStore?: GeneFrequencyStore
}

@observer
class Home extends React.Component<IHomeProps>
{
    private get numberOfPatients() {
        return (
            Math.max(...(this.props.frequencyStore?.geneFrequencySummaryData.map(d => d.sampleCount) || [0]))
        ).toLocaleString('en-US');
    }

    private get numberOfCancerTypes() {
        return (
            _.uniq(this.props.frequencyStore?.tumorTypeFrequencySummaryData.map(d => d.tumorType)).length
        ).toLocaleString('en-US');
    }

    private get blurb() {
        return (
            <div style={{fontSize: "85%"}}>
                The SIGNAL resource integrates germline and somatic alterations identified by clinical sequencing of
                active cancer patients. Provided here are pathogenic germline variants and their tumor-specific
                zygosity changes by gene, lineage, and cancer type in {this.numberOfPatients} prospectively sequenced cancer patients.
            </div>
        );
    }

    public render()
    {
        return !this.isLoading() ? (
            <div>
                <Row className="mb-3">
                    <Col
                        md={6}
                        className="mx-auto d-flex flex-column align-items-center"
                    >
                        <span className="home-page-logo">
                            <i className="fa fa-arrow-up" style={{color: "#FF9900"}} /> Signal<span className="home-page-logo-db">DB</span>
                        </span>
                        <span className="home-page-logo-title">
                            <strong><u>S</u></strong>omatic <strong><u>I</u></strong>ntegration of <u><strong>G</strong></u>ermli<u><strong>n</strong></u>e <u><strong>Al</strong></u>terations in Cancer
                        </span>
                        <span className="home-page-logo-title-info">{this.numberOfPatients} patients and {this.numberOfCancerTypes} cancer types</span>
                    </Col>
                </Row>
                <Row className="mb-5">
                    <PenetranceFilterPanel geneFrequencyStore={this.props.frequencyStore} />
                </Row>
                <Row className="mb-5">
                    <Col md={10} className="mx-auto d-flex align-items-center">
                        <input className="m-auto" type="text" placeholder="Dummy Search..."/>
                    </Col>
                </Row>
                <Row className="mb-5">
                    <Col md={10} className="mx-auto d-flex text-center">
                        {this.blurb}
                    </Col>
                </Row>
            </div>
        ): null;
    }

    private isLoading(): boolean {
        return isFrequencyDataPending(this.props.frequencyStore);
    }
}

export default Home;
