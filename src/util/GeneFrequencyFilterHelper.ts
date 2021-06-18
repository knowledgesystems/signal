import _ from "lodash";
import { action, computed, makeObservable, observable } from 'mobx';
import {CancerTypeFilter, DataFilterType} from "react-mutation-mapper";

import {PenetranceLevel} from "../model/Penetrance";
import GeneFrequencyStore from "../store/GeneFrequencyStore";
import {
    applyGeneFrequencySummaryPenetranceFilter,
    CANCER_TYPE_FILTER_ID,
    HUGO_SYMBOL_DROPDOWN_FILTER_ID,
    HUGO_SYMBOL_FILTER_TYPE,
    HUGO_SYMBOL_SEARCH_FILTER_ID,
    HugoSymbolFilter,
    PENETRANCE_FILTER_ID,
    PENETRANCE_FILTER_TYPE,
    PenetranceFilter
} from "./FilterUtils";

class GeneFrequencyFilterHelper
{
    @observable
    public selectedPenetranceLevels: PenetranceLevel[] | undefined;

    @observable
    public selectedCancerTypes: string[] | undefined;

    @observable
    public selectedHugoSymbols: string[] | undefined;

    @observable
    public hugoSymbolSearchText: string | undefined;


    constructor(
        private readonly geneFrequencyStore?: GeneFrequencyStore,
        private readonly defaultFilterHandler?: () => void,
        selectedPenetranceLevels?: PenetranceLevel[],
        selectedCancerTypes?: string[],
        selectedHugoSymbols?: string[],
        hugoSymbolSearchText?: string
    ) {
        makeObservable(this);

        this.selectedPenetranceLevels = selectedPenetranceLevels;
        this.selectedCancerTypes = selectedCancerTypes;
        this.selectedHugoSymbols = selectedHugoSymbols;
        this.hugoSymbolSearchText = hugoSymbolSearchText;

        this.updateFilters();
    }

    @computed
    public get isFiltered(): boolean
    {
        // here we force access to each observable field so that mobx behaves as desired
        const hasGeneFrequencySummaryDataFilters =
            this.geneFrequencyStore !== undefined &&
            this.geneFrequencyStore.geneFrequencySummaryDataFilters.length > 0;
        const hasTumorTypeFrequencySummaryDataFilters =
            this.geneFrequencyStore !== undefined &&
            this.geneFrequencyStore.tumorTypeFrequencySummaryDataFilters.length > 0;

        return (
            !this.geneFrequencyStore ||
            hasGeneFrequencySummaryDataFilters ||
            hasTumorTypeFrequencySummaryDataFilters
        );
    }

    @computed
    public get penetranceFilter(): PenetranceFilter | undefined
    {
        return this.selectedPenetranceLevels ? {
            id: PENETRANCE_FILTER_ID,
            type: PENETRANCE_FILTER_TYPE,
            values: this.selectedPenetranceLevels
        }: undefined;
    }

    @computed
    public get cancerTypeFilter(): CancerTypeFilter | undefined
    {
        return this.selectedCancerTypes ? {
            id: CANCER_TYPE_FILTER_ID,
            type: DataFilterType.CANCER_TYPE,
            values: this.selectedCancerTypes
        }: undefined;
    }

    @computed
    public get cancerTypes() {
        return _.uniq(this.geneFrequencyStore?.knownTumorTypeFrequencySummaryData.map(d => d.tumorType) || []);
    }

    @computed
    public get cancerTypesOptions() {
        return this.cancerTypes.map(t => ({value: t}));
    }

    @computed
    public get hugoSymbolOptions(): Array<{value: string}>
    {
        return this.geneFrequencyStore?.geneFrequencySummaryData
            .filter(d => !this.penetranceFilter || applyGeneFrequencySummaryPenetranceFilter(this.penetranceFilter, d))
            .map(d => ({value: d.hugoSymbol})) || [];
    }

    @computed
    public get hugoSymbolDropdownFilter(): HugoSymbolFilter | undefined
    {
        return this.selectedHugoSymbols ? {
            id: HUGO_SYMBOL_DROPDOWN_FILTER_ID,
            type: HUGO_SYMBOL_FILTER_TYPE,
            values: this.selectedHugoSymbols
        }: undefined;
    }

    @computed
    public get hugoSymbolSearchFilter(): HugoSymbolFilter | undefined
    {
        return this.hugoSymbolSearchText ? {
            id: HUGO_SYMBOL_SEARCH_FILTER_ID,
            type: HUGO_SYMBOL_FILTER_TYPE,
            values: [this.hugoSymbolSearchText]
        }: undefined;
    }

    @action
    public handlePenetranceSelect = (penetrance?: PenetranceLevel) => {
        let selectedPenetranceLevels = this.selectedPenetranceLevels || [];

        if (penetrance) {
            selectedPenetranceLevels = selectedPenetranceLevels.includes(penetrance) ?
                _.without(selectedPenetranceLevels, penetrance): [...selectedPenetranceLevels, penetrance];
        }

        this.selectedPenetranceLevels = selectedPenetranceLevels.length > 0 ?
            selectedPenetranceLevels: undefined;

        if (this.geneFrequencyStore) {
            this.geneFrequencyStore.updateGeneFrequencySummaryDataFilters(PENETRANCE_FILTER_ID, this.penetranceFilter);
        }

        if (this.defaultFilterHandler) {
            this.defaultFilterHandler();
        }
    }

    @action
    public handleCancerTypeSelect = (selectedCancerTypeIds: string[], allValuesSelected?: boolean) =>
    {
        this.selectedCancerTypes = allValuesSelected ? undefined: selectedCancerTypeIds;

        if (this.geneFrequencyStore) {
            this.geneFrequencyStore.updateTumorTypeFrequencySummaryDataFilters(CANCER_TYPE_FILTER_ID, this.cancerTypeFilter);
        }

        if (this.defaultFilterHandler) {
            this.defaultFilterHandler();
        }
    }

    @action
    public handleHugoSymbolSelect = (selectedHugoSymbols: string[], allValuesSelected?: boolean) =>
    {
        this.selectedHugoSymbols = allValuesSelected ? undefined: selectedHugoSymbols;

        if (this.geneFrequencyStore) {
            this.geneFrequencyStore.updateGeneFrequencySummaryDataFilters(HUGO_SYMBOL_DROPDOWN_FILTER_ID, this.hugoSymbolDropdownFilter);
        }

        if (this.defaultFilterHandler) {
            this.defaultFilterHandler();
        }
    }

    @action
    public handleHugoSymbolSearch = (searchText: string) => {
        this.hugoSymbolSearchText = searchText ? searchText: undefined;

        if (this.geneFrequencyStore) {
            this.geneFrequencyStore.updateGeneFrequencySummaryDataFilters(HUGO_SYMBOL_SEARCH_FILTER_ID, this.hugoSymbolSearchFilter);
        }

        if (this.defaultFilterHandler) {
            this.defaultFilterHandler();
        }
    }

    @action
    public handleFilterReset = () =>
    {
        this.selectedPenetranceLevels = undefined;
        this.selectedCancerTypes = undefined;
        this.selectedHugoSymbols = undefined;
        this.hugoSymbolSearchText = undefined;

        this.updateFilters();

        if (this.defaultFilterHandler) {
            this.defaultFilterHandler();
        }
    }

    @action
    private updateFilters = () =>
    {
        if (this.geneFrequencyStore) {
            this.geneFrequencyStore.updateGeneFrequencySummaryDataFilters(PENETRANCE_FILTER_ID, this.penetranceFilter);
            this.geneFrequencyStore.updateTumorTypeFrequencySummaryDataFilters(CANCER_TYPE_FILTER_ID, this.cancerTypeFilter);
            this.geneFrequencyStore.updateGeneFrequencySummaryDataFilters(HUGO_SYMBOL_DROPDOWN_FILTER_ID, this.hugoSymbolDropdownFilter);
            this.geneFrequencyStore.updateGeneFrequencySummaryDataFilters(HUGO_SYMBOL_SEARCH_FILTER_ID, this.hugoSymbolSearchFilter);
        }
    }
}

export default GeneFrequencyFilterHelper;
