import loadable from '@loadable/component'

const componentLoaders = {
    WRichText: loadable(() => import('./WRichText'))
}

export { componentLoaders }