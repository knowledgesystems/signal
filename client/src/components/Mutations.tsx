import autobind from 'autobind-decorator';
import {action, observable} from "mobx";
import {observer} from "mobx-react";
import * as React from 'react';
import {
    Col, Container, Row
} from 'react-bootstrap';

import MutationStore from "../store/MutationStore";
import MutationTable from "./MutationTable";
import SearchBox from "./SearchBox";

@observer
class Mutations extends React.Component<{}>
{
    @observable
    private mainContent: JSX.Element | undefined;

    private store: MutationStore = new MutationStore();

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
                        {this.mainContent}
                    </Col>
                </Row>
            </Container>
        );
    }

    @autobind
    @action
    private onSearch(input: string)
    {
        // TODO get the actual data for the search input and visualize it!
        if (input.length > 0) {
            this.mainContent = <MutationTable data={this.store.mutations} />;
        }
        else {
            this.mainContent = undefined;
        }
    }
}

export default Mutations;
