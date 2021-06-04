import {observer} from "mobx-react";

import {DropdownSelector, DropdownSelectorProps} from "react-mutation-mapper";

export const HugoSymbolSelector = observer((props: DropdownSelectorProps) =>
{
    return (
        <DropdownSelector
            name="hugoSymbolFilter"
            placeholder="Gene"
            showControls={true}
            {...props}
        />
    );
});

export default HugoSymbolSelector;
