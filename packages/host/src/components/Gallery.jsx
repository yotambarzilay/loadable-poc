import React from 'react'
import loadable from '@loadable/component'

const Image = loadable(() => import('./Image').then(m => {
    return new Promise(resolve => setTimeout(() => resolve(m), 1000))
}), {
    fallback: <span>Loading...</span>
})

const style = {
    border: '1px solid black',
    padding: 10,
}

const Gallery = ({imgs}) => {
    return <ul style={style}>
        {imgs.map(img => (
            <li key={img}>
                <Image img={img} />
            </li>
        ))}
    </ul>
}

export default Gallery