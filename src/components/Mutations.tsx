import autobind from 'autobind-decorator';
import {action, observable} from "mobx";
import {observer} from "mobx-react";
import * as React from 'react';
import {
    Col, Container, Row
} from 'react-bootstrap';

import SearchBox from "./SearchBox";

@observer
class Mutations extends React.Component<{}>
{
    @observable
    private mainContent: JSX.Element | undefined;

    public render() {
        return (
            <Container className="text-center">
                <Row>
                    <Col lg="8" className="m-auto">
                        <SearchBox onChange={this.onSearch} />
                    </Col>
                </Row>
                <Row className="py-4">
                    <Col className="m-auto" style={{color: "#AA0606"}}>
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
            this.mainContent = <span>Data deposition pending</span>;
        }
        else {
            this.mainContent = undefined;
        }
    }
}

export default Mutations;
