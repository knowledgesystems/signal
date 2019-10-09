import {observer} from "mobx-react";
import * as React from "react";
import SwitchBox from "react-switch";

interface IAxisScaleSwitchProps {
    onChange: (checked: boolean) => void;
    checked: boolean;
}

function getIcon(icon: JSX.Element, style?: React.CSSProperties)
{
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                fontSize: "85%",
                ...style
            }}
        >
            {icon}
        </div>
    );
}

@observer
export class AxisScaleSwitch extends React.Component<IAxisScaleSwitchProps, {}>
{
    public render()
    {
        return (
            <React.Fragment>
                {
                    getIcon(<span>#</span>, {
                        paddingRight: 5,
                        fontWeight: this.props.checked ? "normal": "bold"
                    })
                }
                <SwitchBox
                    checked={this.props.checked}
                    onChange={this.props.onChange}
                    checkedIcon={<span/>}
                    uncheckedIcon={<span/>}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    handleDiameter={20}
                    height={12}
                    width={48}
                />
                {
                    getIcon(<span>%</span>, {
                        paddingLeft: 5,
                        fontWeight: this.props.checked ? "bold": "normal"
                    })
                }
            </React.Fragment>
        );
    }
}