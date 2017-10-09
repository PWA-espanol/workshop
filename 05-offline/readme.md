# 5. Soporte offline

Una de las caracteristicas principales que separa a un sitio web de una aplicación nativa, es la posibilidad de abrir la aplicación por mas que no tenga internet. En el caso de las Progressive Web Apps esto podemos hacerlo gracias a un conjunto de herramientas, entre las que se destaca el _service worker_ y la _Cache API_.

## Mostrar un mensaje cuando no hay conexión

Lo primero a realizar, es poder hacer que se muestre algo que le muestre al usuario que nuestra PWA funciona pero el problema por el que no tiene la experiencia completa es porque no tiene internet. Para esto, primero mostraremos un mensaje en caso de no contar con conexión.


1. Abrir el archivo `service-worker.js` y actualizar el event listener de fetch con la siguiente implementación.

    ```js
    self.addEventListener('fetch', function(event) {
        console.log(event.request);
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
Guardar el index completo en el fetch con alguna estrategia de actualización (network first)
En caso de no tener nada que mostrar caer en el offline.
