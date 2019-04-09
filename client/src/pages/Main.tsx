import * as React from 'react';
import {
    Container
} from 'react-bootstrap';
import {
    BrowserRouter, Route, Switch
} from "react-router-dom";

import Footer from "../components/Footer";
import Header from "../components/Header";

import About from "./About";
import Download from "./Download";
import Home from "./Home";

class Main extends React.Component<{}>
{
    public render()
    {
        return (
            <BrowserRouter>
                <div className="Main">
                    <Header />
                    <Container style={{paddingTop: 20, fontSize: "1.25rem", color: "#2c3e50"}}>
                        <Switch>
                            <Route exact={true} path="/" component={Home}/>
                            <Route exact={true} path="/about" component={About}/>
                            <Route exact={true} path="/download" component={Download}/>
                        </Switch>
                    </Container>
                    <Footer />
                </div>
            </BrowserRouter>
        );
    }
}

export default Main;