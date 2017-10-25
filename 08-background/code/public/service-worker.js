(function() {
    'use strict';

	const CACHE_NAME = 'static-cache';
    const urlsToCache = [
	    '.',
	    'index.html',
	    'css/bootstrap.css',
	    'css/custom.css',
	    'js/common.js',
	    'js/expenses.js',
	    'js/home.js'
	];


	self.addEventListener('install', (event) => {
	    event.waitUntil(
	        caches.open(CACHE_NAME)
	            .then(function(cache) {
	                return cache.addAll(urlsToCache);
	            })
	    );
	});

	self.addEventListener('activate', event => {
		var keepList = [CACHE_NAME];

		event.waitUntil(
		    caches.keys().then(cacheNameList => {
		        return Promise.all(cacheNameList.map(cacheName => { 
		            if (keepList.indexOf(cacheName) === -1) {
		                return caches.delete(cacheName);
		            }
		        }));
		    })
		);
	});

	self.addEventListener('fetch', event => {
	    console.log(event.request.url);

        if (event.request.method !== "GET") return;

	    if (event.request.url.indexOf('/api/') !== -1) {
	        event.respondWith(fetchAndCache(event.request));
	    } else {
	        event.respondWith(
	            caches.match(event.request).then(response => {
	                return response || fetchAndCache(event.request);
	            })
	        );
	    }
	});

	self.addEventListener('push', function(e) {

	    const options = {
	        body: 'Revisa el nuevo gasto del viaje',
	        icon: 'img/logo-512.png',
	        vibrate: [100, 50, 100],
	        data: {
	            primaryKey: 2
	        },
	        actions: [
	            {action: 'explore', title: 'Ir al sitio',
	                icon: 'img/check.png'},
	            {action: 'close', title: 'Cerrar la notificación',
	                icon: 'img/xmark.png'}
	        ]
	    };

	    e.waitUntil(
	        self.registration.showNotification('Push Notification', options)
	    );
	});

	function broadcast(message) {
        return clients.matchAll({includeUncontrolled: true, type: 'window'}).then(function(clients) {
            for (var client of clients) {
                client.postMessage(message);
            }
        });
    }

	self.addEventListener('sync', function(event) {
	    if (event.tag === 'delete-expenses') {
	        event.waitUntil(
	            fetch('/api/expense', {method: "delete"})
	            .then((response) => {
	                if (response.ok) {
	                    broadcast({"action": "updateHome"})
	                }
	            })
	        );
	    }
	});

	self.addEventListener('notificationclick', function(e) {
	    const notification = e.notification;
	    const action = e.action;

	    if (action === 'close') {
	        notification.close();
	    } else if (notification.data) {
	        const primaryKey = notification.data.primaryKey;
	        clients.openWindow('expense/' + primaryKey);
	        notification.close();
	    }
	});

	function fetchAndCache(url) {
	    return fetch(url)
	        .then((response) => {
	            // Check if we received a valid response
	            if (!response.ok) {
	                throw Error(response.statusText);
	            }
	            return caches.open(CACHE_NAME)
	                .then((cache) => {
	                    cache.put(url, response.clone());
	                    return response;
	                });
	        })
	        .catch((error) => {
	            console.log('Request failed:', error);
	            // You could return a custom offline 404 page here
	        });
	}
})();