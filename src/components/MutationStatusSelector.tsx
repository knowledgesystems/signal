import {CheckBoxType, DefaultTooltip, getOptionLabel, Option} from "cbioportal-frontend-commons";
import _ from "lodash";
import {observer} from "mobx-react";
import * as React from 'react';
import {
    DataFilter,
    DataStore,
    MUTATION_STATUS_BADGE_STYLE_OVERRIDE,
    MutationStatusBadgeSelector,
    MutationStatusBadgeSelectorProps
} from "react-mutation-mapper";

import {SignalMutationStatus} from "cbioportal-utils";

export const MUTATION_RATE_HELPER = {
    [SignalMutationStatus.SOMATIC]: {
        title: "Somatic",
        description: "Percent of samples with a somatic mutation"
    },
    [SignalMutationStatus.BENIGN_GERMLINE]: {
        title: "Germline - Benign/VUS",
        description: "Percent of samples with a germline - benign/VUS mutation"
    },
    [SignalMutationStatus.PATHOGENIC_GERMLINE]: {
        title: "Germline - Pathogenic",
        description: "Percent of samples with a germline - pathogenic mutation"
    },
    [SignalMutationStatus.BIALLELIC_PATHOGENIC_GERMLINE]: {
        title: "Show Loss of WT Only",
        description: "Percent of pathogenic germline carriers biallelic in the corresponding tumor sample"
    }
};

export function getChecklistOptionLabel(option: Option,
                                        selectedValues: {[optionValue: string]: any},
                                        checkBoxType: CheckBoxType = CheckBoxType.STRING): JSX.Element
{
    const defaultLabel = getOptionLabel(option, selectedValues, checkBoxType);

    return option.value === SignalMutationStatus.BIALLELIC_PATHOGENIC_GERMLINE ?
        <span>└─ {defaultLabel}</span>: defaultLabel;
}

export function getFilterOptionLabel(content: {title: string, description?: string}): JSX.Element | string
{
    if (content.description) {
        return (
            <span>
                {content.title}
                <DefaultTooltip
                    placement="right"
                    overlay={
                        <span>{content.description}</span>
                    }
                >
                    <i className="fa fa-info-circle" style={{marginLeft: "0.2rem"}} />
                </DefaultTooltip>
            </span>
        );
    }
    else {
        return content.title;
    }
}

export function getMutationStatusFilterOptions()
{
    return [
        {
            value: SignalMutationStatus.SOMATIC,
            label: getFilterOptionLabel(MUTATION_RATE_HELPER[SignalMutationStatus.SOMATIC]),
            badgeStyleOverride: MUTATION_STATUS_BADGE_STYLE_OVERRIDE,
            badgeStyleSelectedOverride: MUTATION_STATUS_BADGE_STYLE_OVERRIDE
        },
        {
            value: SignalMutationStatus.BENIGN_GERMLINE,
            label: getFilterOptionLabel(MUTATION_RATE_HELPER[SignalMutationStatus.BENIGN_GERMLINE]),
            badgeStyleOverride: MUTATION_STATUS_BADGE_STYLE_OVERRIDE,
            badgeStyleSelectedOverride: MUTATION_STATUS_BADGE_STYLE_OVERRIDE
        },
        {
            value: SignalMutationStatus.PATHOGENIC_GERMLINE,
            label: getFilterOptionLabel(MUTATION_RATE_HELPER[SignalMutationStatus.PATHOGENIC_GERMLINE]),
            badgeStyleOverride: MUTATION_STATUS_BADGE_STYLE_OVERRIDE,
            badgeStyleSelectedOverride: MUTATION_STATUS_BADGE_STYLE_OVERRIDE
        },
        {
            value: SignalMutationStatus.BIALLELIC_PATHOGENIC_GERMLINE,
            label: getFilterOptionLabel(MUTATION_RATE_HELPER[SignalMutationStatus.BIALLELIC_PATHOGENIC_GERMLINE]),
            badgeStyleOverride: MUTATION_STATUS_BADGE_STYLE_OVERRIDE,
            badgeStyleSelectedOverride: MUTATION_STATUS_BADGE_STYLE_OVERRIDE
        },
    ];
}

export function onMutationStatusFilterOptionSelect(selectedValues: string[],
                                                   checkedValues: string[],
                                                   uncheckedValues: string[],
                                                   allValuesSelected: boolean | undefined,
                                                   dataStore: DataStore,
                                                   dataFilterType: string,
                                                   dataFilterId: string)
{
    // all other filters except the current filter with the given data filter id
    const otherFilters = dataStore.dataFilters.filter((f: DataFilter) => f.id !== dataFilterId);

    let values = selectedValues;

    if (checkedValues.includes(SignalMutationStatus.BIALLELIC_PATHOGENIC_GERMLINE) ||
            (selectedValues.includes(SignalMutationStatus.PATHOGENIC_GERMLINE) &&
            selectedValues.includes(SignalMutationStatus.BIALLELIC_PATHOGENIC_GERMLINE)))
    {
        values = _.without(values, SignalMutationStatus.PATHOGENIC_GERMLINE);
    }
    else if (uncheckedValues.includes(SignalMutationStatus.PATHOGENIC_GERMLINE)) {
        values = _.without(values, SignalMutationStatus.BIALLELIC_PATHOGENIC_GERMLINE);
    }

    if (!selectedValues.includes(SignalMutationStatus.BIALLELIC_PATHOGENIC_GERMLINE) &&
        selectedValues.length === 3)
    {
        // no filtering required if all categories except biallelic is selected
        dataStore.setDataFilters(otherFilters);
    }
    else {
        const dataFilter = {
            id: dataFilterId,
            type: dataFilterType,
            values
        };

        // replace the existing data filter wrt the current selection (other filters + new data filter)
        dataStore.setDataFilters([...otherFilters, dataFilter]);
    }

    return values;
}

@observer
export class MutationStatusSelector extends React.Component<MutationStatusBadgeSelectorProps, {}>
{
    public render() {
        return (
            <MutationStatusBadgeSelector
                badgeSelectorOptions={getMutationStatusFilterOptions()}
                getOptionLabel={getChecklistOptionLabel}
                {...this.props}
            />
        );
    }
}

export default MutationStatusSelector;
