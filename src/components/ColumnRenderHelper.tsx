import * as React from "react";
import {Hgvsg} from "react-mutation-mapper";
import {Link} from "react-router-dom";

import FrequencyCell from "./FrequencyCell";
import PenetranceList from "./PenetranceList";

export function renderPercentage(cellProps: any)
{
    return (
        <FrequencyCell frequency={cellProps.value} />
    );
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
    const constructLink = (hgvsg: string, content: JSX.Element) => <Link to={`/variant/${hgvsg}`}>{content}</Link>;

    return (
        <Hgvsg
            mutation={cellProps.original}
            constructLink={constructLink}
            disableTooltip={true}
        />
    );
}