import {SignalMutationStatus} from "cbioportal-utils";
import {Hgvsg, MutationStatus} from "react-mutation-mapper";
import {Link} from "react-router-dom";

import {FrequencyCell} from "cbioportal-frontend-commons";
import PenetranceList from "./PenetranceList";

export function renderPercentage(cellProps: any)
{
    return (
        <FrequencyCell frequency={cellProps.value} />
    );
}

export function renderCancerType(cellProps: any)
{
    const tumorTypes: string[] = cellProps.value;

    return <span>{tumorTypes.join(", ")}</span>;
}

export function renderPenetrance(cellProps: any)
{
    return (
        <PenetranceList
            penetrance={cellProps.value}
        />
    );
}

export function renderHgvsg(cellProps: any)
{
    const constructLink = (hgvsg: string) => <Link to={`/variant/${hgvsg}`}>{hgvsg}</Link>;

    return (
        <Hgvsg
            mutation={cellProps.original}
            constructLink={constructLink}
            disableTooltip={true}
        />
    );
}

export function renderMutationStatus(cellProps: any)
{
    return (
        <MutationStatus
            value={cellProps.value}
            enableTooltip={false}
            displayValueMap={{
                [SignalMutationStatus.SOMATIC.toLowerCase()]:
                SignalMutationStatus.SOMATIC,
                [SignalMutationStatus.PATHOGENIC_GERMLINE.toLowerCase()]:
                SignalMutationStatus.PATHOGENIC_GERMLINE,
                [SignalMutationStatus.BENIGN_GERMLINE.toLowerCase()]:
                SignalMutationStatus.BENIGN_GERMLINE,
            }}
            styleMap={{
                [SignalMutationStatus.PATHOGENIC_GERMLINE.toLowerCase()]: {
                    background: "#FFA963"
                }
            }}
        />
    );
}