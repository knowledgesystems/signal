import * as React from 'react';


class About extends React.Component<{}>
{
    public render()
    {
        return (
            <React.Fragment>
                <p>
                    The SIGNAL resource was developed in a collaboration between the Berger and Taylor labs
                    along with key institutional partners at Memorial Sloan Kettering with the goal of establishing
                    a resource of integrated germline and somatic alterations identified by clinical sequencing of
                    active cancer patients. Provided here are pathogenic germline variants and their tumor-specific
                    zygosity changes by gene, lineage, and cancer type in 17,152 prospectively sequenced cancer patients.
                    All analyses are described in:
                </p>

                <ul>
                    <li>
                        <a 
                            href="https://www.nature.com/articles/s41588-021-00949-1" 
                            target="_blank" 
                            rel="noreferrer"
                        >
                        Srinivasan, P., Bandlamudi, C., Jonsson, P. et al. The context-specific role of germline pathogenicity in tumorigenesis. Nat Genet 53, 1577–1585 (2021).
                        </a>
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
                    and the Niehaus Center for Inherited Cancer Genomics.
                </p>
            </React.Fragment>
        );
    }
}

export default About;
