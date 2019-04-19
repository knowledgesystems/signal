import * as React from "react";

import ColumnHeader from "./ColumnHeader";

export enum ColumnId {
    SOMATIC = "somatic",
    GERMLINE = "germline",
    PERCENT_BIALLELIC = "percentBialleic",
    MUTATION_FREQUENCIES = "mutationFrequencies"
}

export const HEADER_COMPONENT: {[id: string] : JSX.Element} = {
    [ColumnId.SOMATIC]: (
        <ColumnHeader
            headerContent={<span>Somatic Mutant Tumors <i className="fa fa-info-circle" /></span>}
            overlay={<span>Includes only likely driver mutations</span>}
        />
    ),
    [ColumnId.GERMLINE]: <ColumnHeader headerContent="Pathogenic Germline"/>,
    [ColumnId.PERCENT_BIALLELIC]: <ColumnHeader headerContent="% Biallelic"/>,
    [ColumnId.MUTATION_FREQUENCIES]: <ColumnHeader headerContent="Mutation Frequencies (%)"/>,
};
