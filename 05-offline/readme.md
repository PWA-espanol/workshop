# 5. Soporte offline

Una de las caracteristicas principales que separa a un sitio web de una aplicación nativa, es la posibilidad de abrir la aplicación por mas que no tenga internet. En el caso de las Progressive Web Apps esto podemos hacerlo gracias a un conjunto de herramientas, entre las que se destaca el _service worker_ y la _Cache API_.

## Mostrar un mensaje cuando no hay conexión

Lo primero a realizar, es poder hacer que se muestre algo que le muestre al usuario que nuestra PWA funciona pero el problema por el que no tiene la experiencia completa es porque no tiene internet. Para esto, primero mostraremos un mensaje en caso de no contar con conexión.


1. Abrir el archivo `service-worker.js` y actualizar el event listener de fetch con la siguiente implementación.

    ```js
    self.addEventListener('fetch', function(event) {
        console.log(event.request);

        if (event.request.method != 'GET') return;

        event.respondWith(
            fetch(event.request).catch(() => {
                return new Response('Parece que estas offline! Revisá la conexión y volvé a intentar.');
            })
        );
    });
    ```

    > **Nota**: Lo que estamos haciendo en este código, es agregar la llamada al método `catch` de la promise que devuelve `fetch`. Con esto, ante un error en el pedido, podemos hacer alguna operación. En nuestro caso estamos creando una nueva respuesta, pasando el texto que queremos mostrar.

1. Abrir el sitio.

1. Ir a devTools, Applications, Service Worker.

    > Screenshot

1. pasar a modo offline.

    > Screenshot

1. refrescar el sitio.

    > Screenshot

1. Volver al modo online y refrescar el sitio para comprobar que ande todo como antes.

## Intro a Cache API y mostrar un html de offline

El siguiente paso para mejorar la experiencia de usuario es poder mostrarle un sitio con formato que básicamente diga el mismo mensaje, pero tenga el mismo estilo que nuestro sitio. Para esto vamos a utilizar la Cache API que nos permitirá guardar las respuestas a requests localmente. Esto implica que podemos pedir los archivos que requerimos en esos casos y guardarlos localmente para tenerlos listos ante una eventualidad.

TBC Explicar Cache api.

1. Abrir el archivo `service-worker.js` y agregar las siguientes constantes al inicio del archivo.

    ```js
    (function() {
        'use strict';

        const CACHE_NAME = 'static-cache';
        const urlsToCache = [
            'offline.html'
        ];

        //...
    ```


1. Ahora, abajo de las constantes recién agregadas agregar el siguiente código para iniciar la cache con el nombre definido en la constante `CACHE_NAME` y agregar las urls definidas en constante `urlsToCache`.

    ```js
    self.addEventListener('install', (event) => {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(function(cache) {
                    return cache.addAll(urlsToCache);
                })
        );
    });
    ```

    > **Nota**: En este código estamos agregando un event listener al evento install del service worker. Este evento se ejecuta la primer vez que corre el service worker, que es un escenario donde tiene internet. Luego, usamos el método `waitUntil` que bloquea hasta que termine de procesar la función pasada por parametro. Esta función abre el caché y luego agrega todas las urls que le pasamos en `urlsToCache`. En nuestro caso es solo el archivo `offline.html`.

1. Abrir el sitio.

1. Ir nuevamente a devTools, Applications, Service Worker, pasar a modo offline y refrescar el sitio

    > Screenshot

1. Volver al modo online y refrescar el sitio para comprobar que ande todo como antes.


Actualizar el html de offline para mostrar el remove de cache

## Sitio completo offline

Lo que nos falta para tener la mejor experiencia de usuario y que no parezca un sitio web, sino una aplicación, es poder acceder a todo el contenido de forma offline. Para esto vamos a tener que optar por una nueva estrategia de caching, apuntando a tener todo el contenido almacenado una vez que se accedió al menos una vez.

TBC: Explicar problemas

TBC Explicar diferentes extrategias. En este caso implementaremos una estrategia simple de cache first, haciendo que primero se busque en el cache y luego, en caso de no encontrarse se realice el request al servidor guardando el resultado en la cache.

1. Abrir el archivo `service-worker.js` y actualizar la constantes `urlsToCache` al inicio del archivo, con el siguiente contenido.

    ```js
    const urlsToCache = [
        '.',
        'index.html',
        'css/bootstrap.css',
        'css/custom.css',
        'js/common.js',
        'js/expenses.js',
        'js/home.js'
    ];
    ```

1. Ahora, agregamos la siguiente función después de los event listeners. Con esta función se realizará el fetch de los archivos y luego, si no hubo error, se pasará a guardar la respuesta en el cache antes de devolverla.

    ```js
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
    ```

1. Luego, actualizaremos el handler del evento _fetch_ con la siguiente implementación. Esta implementación que buscará primero en el cache y luego, en caso de no encontrar la respuesta, hará el pedido y actualizará el cache local.

    ```js
    self.addEventListener('fetch', function(event) {
        console.log(event.request.url);

        if (event.request.method != 'GET') return;
        if (event.request.url.indexOf('/api/') !== -1) return;

        event.respondWith(
            caches.match(event.request)
            .then((response) => {
                return response || fetchAndCache(event.request);
            })
        );
    });
    ```

    > **Nota**: En el segundo `if`, estamos viendo que no llamemos a la API (`event.request.url.indexOf('/api/') !== -1`), dado que al usar este tipo de estregia, nunca podremos tener los valores actuales dado que siempre se traeran los cacheados. Esto es importante para tener en cuenta a la hora de decidir que estrategia de caching vamos a utilizar.

1. Nuevamente, abrir el sitio.

1. Ir nuevamente a devTools, Applications, Service Worker, pasar a modo offline y refrescar el sitio

    > Screenshot

1. Volver al modo online y refrescar el sitio para comprobar que ande todo como antes.

## Conclusiones

En este módulo vimos como trabajar con el service worker, los eventos de `install` y `fetch` y la Cache API para tener soporte offline de nuestra web app, dando una mejor experiencia a nuestros usuarios.