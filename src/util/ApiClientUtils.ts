import {GenomeNexusAPI, GenomeNexusAPIInternal} from "genome-nexus-ts-api-client";

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
