import Tooltip from "rc-tooltip";
import * as React from "react";

import CircledLetter from "./CircledLetter";

export interface IPenetranceProps
{
    value: string;
}

const STYLE_MAP = {
    Uncertain: {displayValue: "U", color: "#C1C1C1"},
    Low: {displayValue: "L", color: "#FFD700"},
    Moderate: {displayValue: "M", color: "#FFAA22"},
    High: {displayValue: "H", color: "#FF0000"},
};

class Penetrance extends React.Component<IPenetranceProps>
{
    public render()
    {
        const style = STYLE_MAP[this.props.value];

        if (style) {
            return (
                <Tooltip
                    mouseEnterDelay={0.5}
                    arrowContent={<div className="rc-tooltip-arrow-inner"/>}
                    placement="top"
                    overlay={<span>{this.props.value} penetrance</span>}
                    destroyTooltipOnHide={true}
                >
                    <span>
                        <CircledLetter
                            letter={style.displayValue}
                            color={style.color}
                        />
                    </span>
                </Tooltip>
            );
        }
        else {
            return null;
        }
    }
}

export default Penetrance;
