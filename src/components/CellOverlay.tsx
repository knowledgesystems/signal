import {makeObservable, observable} from "mobx";
import {observer} from "mobx-react";
import * as React from "react";

interface ICellOverlayProps {
    overlay: () => Promise<JSX.Element>;
}

@observer
class CellOverlay extends React.Component<ICellOverlayProps>
{
    @observable
    private content:JSX.Element;

    constructor(props: any) {
        super(props);
        makeObservable(this);
    }
    
    public render()
    {
        if (this.content) {
            return this.content;
        }
        else {
            this.props.overlay()
                .then(content => this.content = content)
                .catch(err => this.content = <span>Error fetching data</span>);

            return <span>Loading...</span>;
        }
    }
}

export default CellOverlay;
