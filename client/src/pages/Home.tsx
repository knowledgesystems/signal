import * as React from 'react';

import GeneLevelSummary from "../components/GeneLevelSummary";
import GeneFrequencyStore from "../store/GeneFrequencyStore";

interface IHomeProps {
    frequencyStore?: GeneFrequencyStore
}

class Home extends React.Component<IHomeProps>
{
    public render()
    {
        return (
            <div>
                <div style={{paddingLeft:8, maxWidth: 1500}}>The
                INSIGHT (<b>in</b>tegration of <b>s</b>omat<b>i</b>c with <b>g</b>ermline <b>h</b>eritability
                in <b>t</b>umorigenesis) resource integrates germline and
                somatic alterations identified by clinical sequencing of
                active cancer patients. Provided here are pathogenic germline
                variants and their tumor-specific zygosity changes by gene,
                lineage, and cancer type in 17,152 prospectively sequenced
                cancer patients.</div>
                <GeneLevelSummary frequencyStore={this.props.frequencyStore} />
            </div>
        );
    }
}

export default Home;
