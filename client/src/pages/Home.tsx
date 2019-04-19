import * as React from 'react';

import Mutations from "../components/Mutations";

class Home extends React.Component<{}>
{
    get info() {
        return (
            <React.Fragment>
                <Mutations />
                <p>
                    The INSIGHT resource was developed in a collaboration between the Berger and Taylor labs
                    along with key institutional partners at Memorial Sloan Kettering with the goal of establishing
                    a resource of integrated germline and somatic alterations identified by clinical sequencing of
                    active cancer patients. Provided here are pathogenic germline variants and their tumor-specific
                    zygosity changes by gene, lineage, and cancer type in 17,152 prospectively sequenced cancer patients
                    [<a>Srinivasan P, Bandlamudi C, et al. In preparation</a>]
                </p>
            </React.Fragment>
        );
    }

    public render()
    {
        return (
            <div>
                {this.info}
            </div>
        );
    }
}

export default Home;
