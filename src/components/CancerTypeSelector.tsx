import {observer} from "mobx-react";
import * as React from 'react';

import {DropdownSelector, DropdownSelectorProps} from "react-mutation-mapper";

export const CancerTypeSelector = observer((props: DropdownSelectorProps) =>
{
    return (
        <DropdownSelector
            name="cancerTypeFilter"
            placeholder="Cancer Type"
            showControls={true}
            {...props}
        />
    );
});

export default CancerTypeSelector;
