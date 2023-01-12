import * as React from 'react';
import {Container} from "react-bootstrap";
import {
    BrowserRouter, Route, Switch
} from "react-router-dom";

import Footer from "../components/Footer";
import Header from "../components/Header";
import GeneFrequencyStore from "../store/GeneFrequencyStore";
import {getGenomeNexusClient, getMutationMapperDataFetcher, getOncoKbClient} from "../util/ApiClientUtils";
import {getPenetranceLevels} from "../util/PenetranceUtils";
import {getQueryParamAsArray, SearchParam} from "../util/RouterUtils";
import About from "./About";
import Download from "./Download";
import Explore from "./Explore";
import Gene from "./Gene";
import Home from "./Home";
import Terms from "./Terms";
import Variant from "./Variant";

class Main extends React.Component<{}>
{
    private frequencyStore: GeneFrequencyStore = new GeneFrequencyStore();

    public render()
    {
        const GenePage = (props: any) => (
            <Gene
                hugoSymbol={props.match.params.hugoSymbol.toUpperCase()}
                cancerTypes={getQueryParamAsArray(props.location, SearchParam.CANCER_TYPE)}
                mutationStatuses={getQueryParamAsArray(props.location, SearchParam.MUTATION_STATUS)}
            />
        );

        const HomePage = (routerProps: any) => (
            <Home
                frequencyStore={this.frequencyStore}
                history={routerProps.history}
            />
        );

        const VariantPage = (props: any) => (
            <Variant
                variant={props.match.params.variant}
                genomeNexusClient={getGenomeNexusClient()}
                oncoKbClient={getOncoKbClient()}
                mutationMapperDataFetcher={getMutationMapperDataFetcher()}
            />
        );        

        const ExplorePage = (props: any) => (
            <Explore
                frequencyStore={this.frequencyStore}
                cancerTypes={getQueryParamAsArray(props.location, SearchParam.CANCER_TYPE)}
                hugoSymbols={getQueryParamAsArray(props.location, SearchParam.HUGO_SYMBOL)}
                penetranceLevels={getPenetranceLevels(getQueryParamAsArray(props.location, SearchParam.PENETRANCE))}
            />
        );

        return (
            <BrowserRouter>
                <div className="Main">
                    <Header />
                    <Container
                        fluid={true}
                        style={{
                            paddingTop: 20,
                            paddingBottom: 140,
                            color: "#2c3e50"
                        }}
                    >
                        <Switch>
                            <Route exact={true} path="/" component={HomePage}/>
                            <Route exact={true} path="/explore" component={ExplorePage}/>
                            <Route exact={true} path="/gene/:hugoSymbol" component={GenePage} />
                            <Route exact={true} path="/variant/:variant" component={VariantPage} />
                            <Route exact={true} path="/about" component={About}/>
                            <Route exact={true} path="/terms" component={Terms}/>
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