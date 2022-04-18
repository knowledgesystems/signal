import { observer } from 'mobx-react';
import * as React from 'react';
import {Variant as VariantView} from 'react-variant-view';
import {GenomeNexusAPI} from "genome-nexus-ts-api-client";
import {OncoKbAPI} from "oncokb-ts-api-client";
import {MutationMapperDataFetcher} from "react-mutation-mapper";

interface IVariantProps {
    variant: string;
    genomeNexusClient?: GenomeNexusAPI;
    oncoKbClient?: OncoKbAPI;
    mutationMapperDataFetcher?: MutationMapperDataFetcher;
}

@observer
class Variant extends React.Component<IVariantProps>
{
    public render() {
        return (
            <VariantView
                variant={this.props.variant}
                genomeNexusClient={this.props.genomeNexusClient}
                oncoKbClient={this.props.oncoKbClient}
                mutationMapperDataFetcher={this.props.mutationMapperDataFetcher}
            />
        );
    }
}

export default Variant;
