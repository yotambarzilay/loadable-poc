import * as React from 'react'

const App = ({ comps }) => {
    const { Button } = comps
    return (
        <div>
            <h1>Hello App</h1>
            <Button label="shoa" />
        </div>
    );
}

export default App