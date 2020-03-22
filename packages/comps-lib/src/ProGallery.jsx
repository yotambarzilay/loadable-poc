import React from 'react'
import loadable from '@loadable/component'

const items = ['external dynamic 1', 'external dynamic 2']
const DynamicProGalleryItem = loadable(() => import('./DynamicProGalleryItem'))

const ProGallery = () => (
    <div>
        <h3>comps-lib/ProGallery.jsx</h3>
        <ul>
            {items.map(item => <DynamicProGalleryItem key={item} item={item} />)}
        </ul>
    </div>
)

export default ProGallery