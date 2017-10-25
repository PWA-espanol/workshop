importScripts('./js/lib/workbox-sw.prod.v2.1.0.js');

(function() {
    'use strict';

	const workboxSW = new self.WorkboxSW();
	workboxSW.precache([]);

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

})();