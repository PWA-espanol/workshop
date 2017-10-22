(function() {
    'use strict';

    self.addEventListener('install', function(event) {
        console.log('On install');
        console.log(event);
    });

    self.addEventListener('activate', function(event) {
        console.log('On activate');
        console.log(event);
    });

    self.addEventListener('fetch', function(event) {
        console.log('On fetch');
        console.log(event.request);

        if (event.request.method != 'GET') return;

        event.respondWith(fetch(event.request));
    });
})();