import * as React from "react";

import Penetrance, {comparePenetrance} from "./Penetrance";

interface IGeneProps
{
    penetrance: string[];
    className?: string;
}

class PenetranceList extends React.Component<IGeneProps>
{
    public render()
    {
        return (
            <span className={this.props.className || "pull-left ml-3"}>
                {
                    // since sort mutates the array we need to slice() here
                    // otherwise mobx complains
                    this.props.penetrance
                        .slice()
                        .sort(comparePenetrance)
                        .map(p => <Penetrance key={p} value={p} />)
                }
            </span>
        );
    }
}

export default PenetranceList;
