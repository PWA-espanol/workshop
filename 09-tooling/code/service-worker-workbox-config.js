const workboxBuild = require('workbox-build');

workboxBuild.injectManifest({
    swSrc: './public/service-worker.js',
    swDest: './public/service-worker-workbox.js',
    globDirectory: './public/',
    globPatterns: ['**\/*.{html,js,css,png}']
})
.then(() => {
    console.log('Service worker generated.');
});