import * as React from 'react';
import {
    Col, Container, Row
} from 'react-bootstrap';
import {
    Link
} from "react-router-dom";

import MskccLogo from "./MskccLogo";

import "./Footer.css";

class Footer extends React.Component<{}>
{
    public get externalLinkIcon() {
        return <i className="fa fa-external-link" />;
    }

    public get externalLinks() {
        return (
            <div>
                <a href="https://www.mskcc.org" target="_blank" rel="noreferrer">
                    MSK {this.externalLinkIcon}
                </a>
                <a
                    href="https://www.mskcc.org/research-areas/programs-centers/molecular-oncology"
                    target="_blank"
                    rel="noreferrer"
                >
                    CMO {this.externalLinkIcon}
                </a>
                <a href="https://www.genomenexus.org" target="_blank" rel="noreferrer">
                    Genome Nexus {this.externalLinkIcon}
                </a>
                <a href="https://www.cbioportal.org" target="_blank" rel="noreferrer">
                    cBioPortal {this.externalLinkIcon}
                </a>
            </div>
        );
    }

    public get internalLinks() {
        return (
            <div>
                <Link to="/about">
                    About
                </Link>
                <a href="mailto:info@signaldb.org" target="_top">
                    Contact Us
                </a>
            </div>
        );
    }

    public render() {
        return (
            <footer className="mskcc-footer bg-mskcc-footer d-none d-md-block">
                <Container>
                    <Row className="text-center">
                        <Col>
                            {this.externalLinks}
                        </Col>
                    </Row>
                    <Row className="text-center">
                        <Col md={true} className="m-auto">
                            {this.internalLinks}
                        </Col>
                        <Col md={true} className="m-auto">
                            <MskccLogo imageHeight={50} />
                        </Col>
                        <Col md={true} className="m-auto">
                            <div>&copy; 2023 Memorial Sloan Kettering Cancer Center</div>
                        </Col>
                    </Row>
                </Container>
            </footer>
        );
    }
}

export default Footer;