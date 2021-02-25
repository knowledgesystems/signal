import {action} from "mobx";
import {observer} from "mobx-react";
import {DataTable} from "react-mutation-mapper";

import {ISignalGeneFrequencySummary} from "cbioportal-utils";

@observer
export default class GeneFrequencyTableComponent extends DataTable<ISignalGeneFrequencySummary>
{
    @action.bound
    public collapseSubComponent() {
        this.resetExpander();
    }
}