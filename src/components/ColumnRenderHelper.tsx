import * as React from "react";
import {Hgvsg} from "react-mutation-mapper";
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