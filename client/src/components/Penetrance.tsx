import * as React from "react";
import CircledLetter from "./CircledLetter";

export interface IPenetranceProps
{
    value: string;
}

const STYLE_MAP = {
    Low: {displayValue: "L", color: "#808080"},
    Moderate: {displayValue: "M", color: "#0066AA"},
    High: {displayValue: "H", color: "#AA3636"}
};

class Penetrance extends React.Component<IPenetranceProps>
{
    public render()
    {
        const style = STYLE_MAP[this.props.value];

        if (style) {
            return (
                <CircledLetter
                    key={this.props.value}
                    letter={style.displayValue}
                    color={style.color}
                />
            );
        }
        else {
            return null;
        }
    }
}

export default Penetrance;
