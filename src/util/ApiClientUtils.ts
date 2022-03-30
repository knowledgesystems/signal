import {GenomeNexusAPI, GenomeNexusAPIInternal} from "genome-nexus-ts-api-client";
import {maskApiRequests} from "cbioportal-utils";
import {OncoKbAPI} from "oncokb-ts-api-client";
import {DefaultMutationMapperDataFetcher} from "react-mutation-mapper";

// TODO customize domain?
const DOMAIN = "https://www.genomenexus.org"

const genomeNexusClient = new GenomeNexusAPI(DOMAIN);
const genomeNexusInternalClient = new GenomeNexusAPIInternal(DOMAIN);

export function getGenomeNexusClient() {
    return genomeNexusClient;
}

export function getGenomeNexusInternalClient() {
    return genomeNexusInternalClient;
}

export const ONCOKB_DOMAIN = "https://www.cbioportal.org/proxy/A8F74CD7851BDEE8DCD2E86AB4E2A711";
const oncoKbClient = initOncoKbClient();

export function getOncoKbClient() {
    return oncoKbClient;
}

function initOncoKbClient() {
    maskApiRequests(
        OncoKbAPI,
        ONCOKB_DOMAIN,
        {
            'X-Proxy-User-Agreement':
                'I/We do NOT use this obfuscated proxy to programmatically obtain private OncoKB data. I/We know that I/we should get a valid data access token by registering at https://www.oncokb.org/account/register.',
        }
    );

    return new OncoKbAPI(ONCOKB_DOMAIN);
}

const mutationMapperDataFetcher = initMutationMapperDataFetcher();

export function getMutationMapperDataFetcher() {
    return mutationMapperDataFetcher;
}

function initMutationMapperDataFetcher() {
    return new DefaultMutationMapperDataFetcher(
        {},
        genomeNexusClient,
        genomeNexusInternalClient,
        oncoKbClient
    );
}
