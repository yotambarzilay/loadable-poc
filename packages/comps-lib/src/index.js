import loadable from '@loadable/component'

const componentLoaders = {
    WRichText: loadable(() => import('./WRichText')),
    ProGallery: loadable(() => import('./ProGallery'))
}

export { componentLoaders }