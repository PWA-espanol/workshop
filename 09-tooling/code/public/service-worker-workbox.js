importScripts('./js/lib/workbox-sw.prod.v2.1.0.js');

(function() {
    'use strict';

	const workboxSW = new self.WorkboxSW();
	workboxSW.precache([
  {
    "url": "css/bootstrap.css",
    "revision": "afee1b42daf24661c41bba459186987c"
  },
  {
    "url": "css/custom.css",
    "revision": "d190cd4805661fae627cbb2bea164e69"
  },
  {
    "url": "expense.html",
    "revision": "bbc2873ffaec4afc022c026c6e78b89e"
  },
  {
    "url": "img/check.png",
    "revision": "52adbe28c56b57d43d689a33277dac97"
  },
  {
    "url": "img/logo-144.png",
    "revision": "9e3afc77660012d1c7c8f56e7f2bd8c6"
  },
  {
    "url": "img/logo-194.png",
    "revision": "89c1a768d6f73e451e33b5835d948ba4"
  },
  {
    "url": "img/logo-512.png",
    "revision": "5f32a96b06669b8269d372287da9d215"
  },
  {
    "url": "img/xmark.png",
    "revision": "f7509646ecfbda0a56a0527e9dd560a3"
  },
  {
    "url": "index.html",
    "revision": "97b63bd0b2cce94621903903b4453695"
  },
  {
    "url": "js/common.js",
    "revision": "5c5c890e67521c0f114a96420619282c"
  },
  {
    "url": "js/expenses.js",
    "revision": "1ac88a6b7ddbb66a36a446fbec92f6d2"
  },
  {
    "url": "js/home.js",
    "revision": "58684b7783bcf2ca5afc30151c6881fd"
  },
  {
    "url": "js/lib/workbox-sw.prod.v2.1.0.js",
    "revision": "e5f207838d7fd9c81835d5705a73cfa2"
  },
  {
    "url": "js/sw-registration.js",
    "revision": "d9e6d079b8419c9a82bc6e01ece9d02f"
  },
  {
    "url": "js/utils.js",
    "revision": "93d131063090f4204ae0076a0af45c2b"
  },
  {
    "url": "service-worker.js",
    "revision": "5cbe45cb921bdae61d927c09796464b2"
  }
]);

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