if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    .then(function(registration) {
        console.log('Registered:', registration);
    })
    .catch(function(error) {
        console.log('Registration failed: ', error);
    });
}