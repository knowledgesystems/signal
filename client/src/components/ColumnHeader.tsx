import Tooltip from "rc-tooltip";
import * as React from "react";

export interface IColumnHeaderProps
{
    headerContent: string | JSX.Element;
    overlay?: JSX.Element;
    className?: string;
}

class ColumnHeader extends React.Component<IColumnHeaderProps>
{
    public static defaultProps = {
        className: "text-wrap"
    };

    public render() {
        let content= (
            <span
                className={this.props.className || ColumnHeader.defaultProps.className}
            >
                {this.props.headerContent}
            </span>
        );

        if (this.props.overlay)
        {
            content = (
                <Tooltip
                    mouseEnterDelay={0.5}
                    arrowContent={<div className="rc-tooltip-arrow-inner"/>}
                    placement="top"
                    overlay={this.props.overlay}
                    destroyTooltipOnHide={true}
                >
                    {content}
                </Tooltip>
            );
        }

        return content;
    }
}

export default ColumnHeader;
