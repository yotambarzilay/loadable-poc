import * as React from 'react'

const imgs = ['img1', 'img2']

const App = ({ comps }) => {
    const { Button, Gallery } = comps
    return (
        <div>
            <h1>Hello App</h1>
            <Button label="shoa" />
            <Gallery imgs={imgs} />
        </div>
    );
}

export default App