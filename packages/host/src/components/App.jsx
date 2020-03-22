import * as React from 'react'

const imgs = ['Dynamic 1', 'Dynamic 2']

const App = ({ comps }) => {
    const { Button, Gallery, WRichText } = comps
    return (
        <div>
            <h1>App.tsx</h1>
            <Button label="shoa" />
            <Gallery imgs={imgs} />
            <WRichText />
        </div>
    );
}

export default App