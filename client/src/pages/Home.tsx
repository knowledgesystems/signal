import * as React from 'react';

import GeneLevelSummary from "../components/GeneLevelSummary";

class Home extends React.Component<{}>
{
    public render()
    {
        return (
            <div>
                <GeneLevelSummary />
            </div>
        );
    }
}

export default Home;
