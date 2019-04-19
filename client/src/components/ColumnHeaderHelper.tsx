import * as React from "react";

export enum ColumnId {
    SOMATIC = "somatic",
    GERMLINE = "germline",
    BIALLELIC = "bialleic",
    BIALLELIC_TO_GERMLINE_RATIO = "biallelicToGermlineRatio",
    MUTATION_FREQUENCIES = "mutationFrequencies"
}

export const HEADER_COMPONENT: {[id: string] : JSX.Element} = {
    [ColumnId.SOMATIC]: <span className="text-wrap">Driver Somatic</span>,
    [ColumnId.GERMLINE]: <span className="text-wrap">Pathogenic Germline</span>,
    [ColumnId.BIALLELIC]: <span className="text-wrap">Biallelic Pathogenic Germline</span>,
    [ColumnId.BIALLELIC_TO_GERMLINE_RATIO]: <span className="text-wrap">Biallelic To Germline Ratio</span>,
    [ColumnId.MUTATION_FREQUENCIES]: <span className="text-wrap">Mutation Frequencies</span>
};
