import { GenomeNexusAPIInternal } from 'genome-nexus-ts-api-client';
import { SignalQuery } from 'genome-nexus-ts-api-client/dist/generated/GenomeNexusAPIInternal';

import {SearchOptionType} from "../components/SearchOption";
import {getGenomeNexusInternalClient} from "./ApiClientUtils";

export function generateLink(query: SignalQuery) {
    switch (query.queryType) {
        case SearchOptionType.GENE:
            return `gene/${query.hugoSymbol}`;
        case SearchOptionType.VARIANT:
        case SearchOptionType.REGION:
        case SearchOptionType.ALTERATION:
            return `variant/${query.variant}`;
        default:
            return undefined;
    }
}

export function searchMutationsByKeyword(
    keyword: string,
    limit: number = -1,
    client: GenomeNexusAPIInternal = getGenomeNexusInternalClient()
): Promise<SignalQuery[]>
{
    return new Promise<SignalQuery[]>((resolve, reject) =>
        client.searchSignalByKeywordGETUsingGET({keyword, limit})
            .then(response => resolve(response))
            .catch(err => reject(err))
    );
}
