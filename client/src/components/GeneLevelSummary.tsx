import autobind from 'autobind-decorator';
import {action} from "mobx";
import {observer} from "mobx-react";
import * as React from 'react';
import {
    Col, Container, Row
} from 'react-bootstrap';

import GeneFrequencyStore from "../store/GeneFrequencyStore";
import GeneFrequencyTable from "./GeneFrequencyTable";
import SearchBox from "./SearchBox";

@observer
class GeneLevelSummary extends React.Component<{}>
{
    private store: GeneFrequencyStore = new GeneFrequencyStore();

    public render() {
        return (
            <Container className="text-center">
                <Row>
                    <Col lg="8" className="m-auto">
                        <SearchBox onChange={this.onSearch} />
                    </Col>
                </Row>
                <Row className="py-4">
                    <Col className="m-auto">
                        <GeneFrequencyTable
                            data={this.store.filteredGeneFrequencySummaryData}
                            status={this.store.geneFrequencyDataStatus}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }

    @autobind
    @action
    private onSearch(input: string) {
        this.store.filterFrequenciesByGene(input);
    }
}

export default GeneLevelSummary;
