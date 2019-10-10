import * as React from 'react';

import GeneLevelSummary from "../components/GeneLevelSummary";
import GeneFrequencyStore from "../store/GeneFrequencyStore";

interface IHomeProps {
    frequencyStore?: GeneFrequencyStore
}

class Home extends React.Component<IHomeProps>
{
    private get blurb() {
        return (
            <div style={{paddingLeft:8, maxWidth: 1500}}>
                The INSIGHT (<u>In</u>tegration of <u>S</u>omat<u>i</u>c with <u>G</u>ermline <u>H</u>eritability in <u>T</u>umorigenesis)
                resource integrates germline and somatic alterations identified by clinical sequencing of
                active cancer patients. Provided here are pathogenic germline variants and their tumor-specific
                zygosity changes by gene, lineage, and cancer type in 17,152 prospectively sequenced cancer patients.
            </div>
        );
    }

    public render()
    {
        return (
            <div>
                {this.blurb}
                <GeneLevelSummary frequencyStore={this.props.frequencyStore} />
            </div>
        );
    }
}

export default Home;
