import {observer} from "mobx-react";
import Tooltip from "rc-tooltip";
import * as React from "react";

import 'rc-tooltip/assets/bootstrap_white.css';

interface IFrequencyCellProps {
    frequency: number;
    overlay?: () => JSX.Element;
}

@observer
class FrequencyCell extends React.Component<IFrequencyCellProps>
{
    public render() {
        let content = this.mainContent();

        if (this.props.overlay) {
            content = (
                <Tooltip
                    mouseEnterDelay={0.5}
                    arrowContent={<div className="rc-tooltip-arrow-inner"/>}
                    placement="right"
                    overlay={this.props.overlay}
                    destroyTooltipOnHide={true}
                >
                    {content}
                </Tooltip>
            );
        }

        return content;
    }

    private mainContent(): JSX.Element
    {
        return <span>{(this.props.frequency * 100).toFixed(2)} %</span>;
    }
}

export default FrequencyCell;
