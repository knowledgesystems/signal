import _ from 'lodash';

import {IMutation} from "../../../server/src/model/Mutation";

export function fetchMutationsByGene(hugoSymbol: string): Promise<IMutation[]> {
    return new Promise<IMutation[]>((resolve, reject) => {
        fetch(`/api/mutation/count/byGene?hugoSymbol=${hugoSymbol}`)
            .then(response => resolve(response.json()))
            .catch(err => reject(err));
    });
}

export function extractTumorTypeFrequencyData(mutations: IMutation[])
{
    return mutations.map(m => _.toPairs(m.countByCancerType)
        .map(pair => ({
            cancerType: pair[0],
            tumorTypeCount: pair[1].tumorTypeCount,
            variantCount: pair[1].variantCount
        }))
    )
}
