import {action} from "mobx";
import {observer} from "mobx-react";
import {IGeneFrequencySummary} from "msk-insight-commons";
import {DataTable} from "react-mutation-mapper";

@observer
export default class GeneFrequencyTableComponent extends DataTable<IGeneFrequencySummary>
{
    @action.bound
    public collapseSubComponent() {
        this.resetExpander();
    }
}