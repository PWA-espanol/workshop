if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker-workbox.js')
    .then(function(registration) {
        console.log('Registered:', registration);
    })
    .catch(function(error) {
        console.log('Registration failed: ', error);
    });
}