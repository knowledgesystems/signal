import { SignalQuery } from 'genome-nexus-ts-api-client/dist/generated/GenomeNexusAPIInternal';
import _ from 'lodash';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';

import {generateLink, searchMutationsByKeyword} from "../util/SearchUtils";
import {SearchOption, SearchOptionType} from "./SearchOption";

interface ISearchBoxProps {
    styles?: CSSRule;
    history?: any;
    placeholder?: string;
}

@observer
export default class SearchBox extends React.Component<ISearchBoxProps>
{
    public static defaultProps: Partial<ISearchBoxProps> = {
        placeholder: "Search Gene / Variant / Region"
    };

    @observable
    public keyword: string | undefined;
    @observable
    public selectedOption: SignalQuery | null = null;

    // https://github.com/JedWatson/react-select/issues/614#issuecomment-244006496
    private debouncedFetch = _.debounce((searchTerm, callback) => {
        this.getOptions(searchTerm)
            .then(result => {
                return callback(result);
            })
            .catch((error: any) => callback(error, null));
    }, 500);

    constructor(props: ISearchBoxProps) {
        super(props);
        makeObservable(this);
    }

    @action
    public getOptions = (keyword: string) => {
        this.keyword = keyword;

        return searchMutationsByKeyword(keyword);
    }

    public render()
    {
        const Option: React.FunctionComponent<any> = observer((props: any) => {
            return (
                <>
                    <components.Option {...props}>
                        <SearchOption
                            search={this.keyword}
                            type={props.data.queryType as SearchOptionType}
                            data={props.data}
                        >
                            <components.Option {...props} />
                        </SearchOption>
                    </components.Option>
                </>
            );
        });

        const NoOptionsMessage: React.FunctionComponent<any> = observer((props: any) => {
            if (this.keyword) {
                return (
                    <components.Option {...props}>
                        <span className="mr-2">
                            No result found for {this.keyword}.
                        </span>
                    </components.Option>
                );
            } else {
                return null;
            }
        });

        // this is a workaround for the problem with menuIsOpen option,
        // it doesn't update when this.menuIsOpen changes to true,
        // so we need to update the menu within a custom Menu component
        const Menu: React.FunctionComponent<any> = observer((props: any) => {
            if (!_.isEmpty(this.keyword)) {
                return (
                    <components.Menu {...props} />
                );
            } else {
                return null;
            }
        });

        return (
            <AsyncSelect
                placeholder={this.props.placeholder}
                components={{
                    Option,
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                    NoOptionsMessage,
                    Menu
                }}
                styles={{
                    input(styles) {
                        return {
                            ...styles,
                            lineHeight: '30px',
                        };
                    },
                    placeholder(styles) {
                        return {
                            ...styles,
                            width: '100%',
                            lineHeight: '30px',
                            textAlign: 'center',
                        };
                    },
                }}
                isFocused={true}
                defaultOptions={[] as SignalQuery[]}
                // for some reason this.keyword is not observed. we need to set menuIsOpen to always true, and
                // handle rendering inside the custom Menu component instead
                menuIsOpen={true}
                isClearable={true}
                value={this.selectedOption}
                onChange={this.handleChange as any}
                closeMenuOnSelect={false}
                loadOptions={this.debouncedFetch}
                inputValue={this.keyword}
                onInputChange={this.handleInputChange}
            />
        );
    }

    @action
    private handleInputChange = (keyword: string) => {
        this.keyword = keyword;
    }

    @action
    private handleChange = (query: SignalQuery) => {
        if (query) {
            this.keyword = '';
            this.selectedOption = null;
            // We need to update the history in the onchange event
            // so when user hits the enter key after search, it would work
            const link = generateLink(query);

            if (link) {
                this.props.history?.push(link);
            }
        }
    }
}
