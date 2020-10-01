import {action, computed} from "mobx";
import {observer} from "mobx-react";
import * as React from 'react';
import {
    Col, Row
} from 'react-bootstrap';

import GeneFrequencyStore from "../store/GeneFrequencyStore";
import {HUGO_SYMBOL_FILTER_ID, HUGO_SYMBOL_FILTER_TYPE} from "../util/FilterUtils";
import GeneFrequencyTable from "./GeneFrequencyTable";
import LandscapePlot from "./LandscapePlot";

interface IGeneLevelSummaryProps {
    frequencyStore?: GeneFrequencyStore;
}

@observer
class GeneLevelSummary extends React.Component<IGeneLevelSummaryProps>
{
    @computed
    private get frequencyStore() {
        return this.props.frequencyStore || new GeneFrequencyStore();
    }

    private get loadingIndicator() {
        return <i className="fa fa-spinner fa-pulse fa-2x" />;
    }

    public render() {
        return (
            <div className="text-center mb-4">
                {this.isLoading() ? (
                    <Row>
                        <Col className="m-auto">
                            {this.loadingIndicator}
                        </Col>
                    </Row>
                ) : (
                    <>
                        <Row>
                            <Col className="m-auto">
                                <LandscapePlot frequencyStore={this.frequencyStore} />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="m-auto">
                                <GeneFrequencyTable
                                    store={this.frequencyStore}
                                    onSearch={this.handleHugoSymbolSearch}
                                />
                            </Col>
                        </Row>
                    </>
                )}
            </div>
        );
    }

    private isLoading(): boolean {
        return this.frequencyStore.frequencySummaryDataStatus === "pending" ||
            this.frequencyStore.tumorTypeFrequenciesDataStatus === "pending";
    }

    @action.bound
    private handleHugoSymbolSearch(searchText: string) {
        const dataFilter = searchText ? {
            id: HUGO_SYMBOL_FILTER_ID,
            type: HUGO_SYMBOL_FILTER_TYPE,
            values: [searchText]
        }: undefined;

        this.frequencyStore.updateDataFilters(HUGO_SYMBOL_FILTER_ID, dataFilter);
    }
}

export default GeneLevelSummary;
