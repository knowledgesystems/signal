import * as React from 'react';


class About extends React.Component<{}>
{
    public render()
    {
        return (
            <React.Fragment>
                <p>
                    This resource is maintained and regularly expanded by the Kravis Center for Molecular Oncology at
                    Memorial Sloan Kettering Cancer Center. It provides information about germline pathogenic variants
                    in cancer genes arising in cancer patients for whom clinical sequencing was performed to guide
                    their clinical care. The penetrance, tumor-specific zygosity, and affected lineage is provided
                    based on computational inferences and clinical annotation. The initial data release includes
                    17,152 tumor samples and all analyses are described in:
                </p>

                <ul>
                    <li>
                        Srinivasan P, Bandlamudi C, et al. “The role of germline pathogenicity in tumogenesis” In preparation
                    </li>
                </ul>

                <p>
                    Incremental updates based on increasingly larger cohort analysis will be provided
                    at regular intervals.
                </p>

                <h5 className="text-center text-uppercase font-weight-bold mt-4">Contributors</h5>

                <p>
                    Members of the Berger and Taylor labs along with members of Computational Sciences in
                    the Kravis Center for Molecular Oncology, Clinical Bioinformatics in Diagnostic Molecular Pathology,
                    and the Neihaus Center for Inherited Cancer Genomics.
                </p>
            </React.Fragment>
        );
    }
}

export default About;