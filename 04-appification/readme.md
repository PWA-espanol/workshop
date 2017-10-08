# 4. Construir una app desde nuestro website

## Manifest

Lo primero a realizar para hacer que nuestro sitio web se comporte como una aplicación, es agregar un archivo con información llamado Web App Manifest. Este archivo está escrito en formato json con campos bien definidos.

1. Agregar un nuevo archivo llamado `manifest.json` dentro de la carpeta **public**.

1. En el archivo, agregar el siguiente contenido.

    ```json
    {
        "dir": "ltr",
        "lang": "en",
        "name": "Progressive Expenses",
        "short_name": "PE",
        "description": "A simple progressive expense app to track your expenses",
        "start_url": "http://localhost:3000/",
        "scope": "/",
        "display": "standalone",
        "orientation": "any",
        "theme_color": "#3A475B",
        "background_color": "#3A475B",
        "related_applications": [],
        "prefer_related_applications": false,
        "icons": [
            {
                "src": "http://localhost:3000/img/logo-144.png",
                "type": "image/png",
                "sizes": "144x144"
            },
            {
                "src": "http://localhost:3000/img/logo-194.png",
                "type": "image/png",
                "sizes": "194x194"
            },
            {
                "src": "http://localhost:3000/img/logo-512.png",
                "type": "image/png",
                "sizes": "512x512"
            }
        ]
    }
    ```

    > **Nota**: el manifest apunta a definir información del sitio para ser tratado como una aplicación, entre otras cosas, el nombre a mostrar, colores a utilizar, orientaciones, forma en la que se muestra, iconos, etc.
    > - **dir**: Especifica la dirección del texto para `name`, `short_name`, y `description`. Junto con `lang`, ayuda a representar correctamente los idiomas que se escriben de derecha a izquierda. Puede tener uno de los siguentes valores: **ltr** (izquierda a derecha), **rtl** (derecha a izquierda), **auto** (indica al navegador que use el algoritmo Unicode bidirectional para hacer una estimación apropiada sobre la dirección del texto.)
    > - **lang**: Especifica el idioma principal.
    > - **name**: Especifica el nombre de la aplicación para mostrarle al usuario.
    > - **short_name**: Proporciona un nombre corto para la aplicación. Está destinado para su uso cuando hay poco espacio para mostrar el nombre completo de la aplicación.
    > - **description**: Proporciona una descripción general sobre qué hace la aplicación.
    > - **start_url**: Especifica la URL que se carga cuando el usuario lanza la aplicación desde un dispositivo. 
    > - **scope**: Define el ámbito de navegación en el contexto de la aplicación web. Esto basicamente restringe qué paginas se pueden ver cuando se aplica el manifiesto. Si el usuario navega fuera del `scope` de la aplicación, continúa como en una web normal.
    > - **display**: Define el modo de visualización preferido para la aplicación web.
    >
    > | display    | Descripción                                                                                                                                                                                                                                                                                                           | fallback display |
    > |------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
    > | fullscreen | Se utiliza toda la pantalla disponible no se muestran elementos del user agent chrome.                                                                                                                                                                                                                                | standalone       |
    > | standalone | La aplicación se mostrará como una app independiente. Así la aplicación puede tener su porpia ventana, su propio icono en el lanzador de aplicaciones, etc. En este modo, the user agent excluirá los elementos de interfaz para controlar la navegación, pero puede incluir otros elementos como la barra de estado. | minimal-ui       |
    > | minimal-ui | La aplicación se mostrará como una app independiente, pero tendrá un minimo de elementos de interfaz para controlar la navegación. Estos elementos podrán variar según navegador.                                                                                                                                     | browser          |
    > | browser    | La aplicación se abrirá en una pestaña nueva del navegador o una ventana nueva, dependiendo del navegador y plataforma. Esto es por defecto.                                                                                                                                                                          | (ninguno)        | 
    > - **orientation**: Define la orientación por defecto. Puede ser: **any**, **natural**, **landscape**, **landscape-primary**, **landscape-secondary**, **portrait**, **portrait-primary**, **portrait-secondary**
    > - **theme_color**: Define el color por defecto para la aplicación. Esto en ocasiones afecta como se muestra por el sistema operativo (por ejemplo, en el lanzador de aplicaciones de Android, el color envuelve la aplicación).  
    > - **background_color**: Define el color de fondo deseado para la aplicación. Este valor repite lo definido en la hoja de estilos de la aplicación, pero puede ser utilizado por los navegadores para pintar el color de fondo de una app si el manifiesto está disponible antes de que la hoja de estilos se haya cargado. Esto suaviza la transición entre lanzar una aplicación y cargar el contenido de la misma.
    > - **related_applications**: Un array especificando las aplicaciones nativas disponibles.
    > - **prefer_related_applications**: Un valor booleano que especifica si sugerirle al usuario que existe una aplicación nativa disponible y recomendada sobre la experiencia web. sólo debería ser utilizado si la aplicación nativa ofrece una experiencia realmente superadora. Para la sugerencia utiliza lo especificado en `elated_applications`
    > - **icons**: Especifica un array de imágenes que pueden servir como iconos de aplicación en diferentes contextos. Por ejemplo, se pueden utilizar para representar la aplicación entre un listado de aplicaciones, o para mostrar la pantalla de Splash.

Poner screenshots de las distintas opciones de display

1. Ahora, abrir el archivo `index.html` dentro de la carpeta `public` y agregar la siguient linea en el header, debajo del meta tag `theme-color`.

    ```html
    <link rel="manifest" href="/manifest.json">
    ```

1. Repetir la operación anterior en el archivo `expense.html`.

1. Por último, agregar los assets que faltan que definimos en el manifest como iconos dentro de la carpeta `img`, para esto, copiarlos desde `TBC`.

1. Correr la app y navegar al index.

1. Abrir las dev tools, seleccionar Applications y ver la información que figura.


## Consumir datos desde el servidor

Un paso importante a la hora de trabajar en aplicaciones web es consumir datos desde una API, sin cargar todo el sitio entero cada vez que querramos hacer un cambio. Para esto, una opción concida es la utilización de AJAX (Asynchronous JavaScript And XML), pero en la actualidad, aparece una nueva API del navegador llamada fetch, que nos permite hacer estas operaciones con mayor facilidad, un mejor manejo asyncronico gracias al uso de promesas y la posibilidad de interceptar los requests desde el service worker como se verá mas adelante.

### Migrando a usar los datos con AJAX

1. Abrir el archivo `common.js` dentro de `public/js` y notar que la implementación actual se basa en consumir datos que están en el mismo archivo.

    ```js
    //codigo inicial js
    ```

1.  Notar aparte que estos datos se están guardando y leyendo desde localstorage para permitir pasar de una página a otra manteniendo la información.

    ```js
    //codigo inicial js que usa local storage
    ```

1. Agregar la siguiente función al inicio del archivo que implementa una llamada AJAX genérica que nos permitirá leer y escribir los datos en el servidor

    ```js
    function apiClient(url, options, success, error) {
        options = options || {};
        let request = new XMLHttpRequest();
        
        request.open(options.method || 'get', url);

        request.onload = () => {
            if (request.status == 200 && request.getResponseHeader('Content-Type') == 'application/json') {
                const responseObj = JSON.parse(request.response);
                success(responseObj);
            } else {
                throw new TypeError();
            }
        };

        request.onerror = error;

        request.send(options.body);
    }
    ```

    > **Nota**: la función **apiClient** tiene cuatro parametros:
        - **url**: a la cual vamos a hacer el request
        - **options**: este objeto donde tenemos el method que tendrá el request (ej. GET, POST, PUT, etc.) y el body en caso de tenerlo (para request como POST y PUT)
        - **success**: función de callback que se llama en caso de que termine bien la llamada, que recibe el objeto ya parseado.
        - **error**: función de callback que se llama en caso de error
    > La llamada al servidor se hace por medio del objeto `XMLHttpRequest`, configurando todos los event handlers como onload y onerror.

1. Ahora hay que actualizar el código existente para usar esta función. Para esto, actualizar las funciones `getExpenses` y `getExpense` para leer los datos desde el servidor gracias a la nueva función `apiClient`.

    ```js
    function getExpenses(cb) {
        apiClient(`${serverUrl}api/expense`, {}, cb)
    }

    function getExpense(expenseId, cb) {
        apiClient(`${serverUrl}api/expense/${expenseId}`, {}, cb);
    }
    ```

1. Aparte de las funciones de lectura, tenemos que actualizar la función que usamos para grabar los datos para que ahora lo haga en el servidor. Para eso actualizamos la función `saveExpense` con el siguiente código.

    ```js
    function saveExpense(expense) {
        apiClient(`${serverUrl}api/expense/${expense.id || ''}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(expense)
        });
    }
    ```

1. Ejecutar nuevamente la aplicación y ver que funcione todo como antes. Si abrimos las dev tools podremos ver que estamos accediendo al server en el panel Network, así como también en los logs del server en la consola.

### Conociendo las promesas

<!-- https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Promise -->

El objeto `Promise` (Promesa) es usado para computaciones asíncronas. Una promesa representa un valor que puede estar disponible ahora, en el futuro, o nunca.

La sintaxis es la siguiente.

```js
new Promise( function(resolver, rechazar) { ... } );
```

El parametro que es una función con los argumentos resolver y rechazar. Está función es ejecutada inmediatamente por la implementación de la Promesa, pasándole las funciones resolver y rechazar (el ejecutor es llamado incluso antes de que el constructor de la Promesa devuelva el objeto creado). Las funciones resolver y rechazar, al ser llamadas, resuelven o rechazan la promesa, respectivamente. Normalmente el ejecutor inicia un trabajo asíncrono, y luego, una vez que es completado, llama a la función resolver para resolver la promesa o la rechaza si ha ocurrido un error.
Si un error es lanzado en la función ejecutor, la promesa es rechazada y el valor de retorno del ejecutor es rechazado.


1. Abrir el archivo `common.js`. Actualizar la implementación de la función `apiClient` para que funcione con Promises en vez de con callbacks, remplazandola por la siguiente implementación.

    ```js
    function apiClient(url, options) {
        options = options || {};
        return new Promise( (resolve, reject) => {
            let request = new XMLHttpRequest();
            
            request.open(options.method || 'get', url);

            request.onload = () => {
                if (request.status == 200 && request.getResponseHeader('Content-Type') == 'application/json') {
                    const responseObj = JSON.parse(request.response);
                    resolve(responseObj);
                } else {
                    reject(new TypeError());
                }
            };

            request.onerror = reject;

            request.send(options.body);
        });
    }
    ```

1. Ahora hay que actualizar el código existente nuevamente para usar esta función. Para esto, actualizar las funciones `getExpenses` y `getExpense` para leer los datos desde el servidor gracias a la nueva función `apiClient`.

    ```js
    function getExpenses(cb) {
        apiClient(`${serverUrl}api/expense`)
            .then(cb);
    }

    function getExpense(expenseId, cb) {
        apiClient(`${serverUrl}api/expense/${expenseId}`)
            .then(cb);
    }
    ```

1. Ejecutar nuevamente la aplicación y ver que funcione todo como antes. Si abrimos las dev tools podremos ver que estamos accediendo al server en el panel Network, así como también en los logs del server en la consola.

### Migrando a Fetch

TBC explicación de fetch

1. Abrir el archivo `common.js`. Actualizar la implementación de la función `apiClient` para que use `fetch`, remplazandola por la siguiente implementación.

    ```js
    function apiClient(url, options) {
        options = options || {};
        return fetch(url, options);
    }
    ```

1. Dado que fetch es mas flexible que nuestra implementación anterior de la función `apiClient`, tenemos que aclarar que tipo de respuesta queremos a la hora de consumirlo. En nuestro caso queremos usar json, para lo cual antes haciamos uso de `JSON.parse`. Para esto, actualizar las funciones `getExpenses` y `getExpense` con el siguiente código.

    ```js
    function getExpenses(cb) {
        apiClient(`${serverUrl}api/expense`)
            .then(response => response.json())
            .then(cb);
    }

    function getExpense(expenseId, cb) {
        apiClient(`${serverUrl}api/expense/${expenseId}`)
            .then(response => response.json())
            .then(cb);
    }
    ```

    > **Nota**: El objeto que devuelve fetch tiene algunos métodos que nos ayudan a consumir mas simplemente los datos que pedimos, entre ellos `json()`, `text()` y `blob()`.

1. Si bien el código anda en browsers modernos, hay que tener en cuenta que no en todos está soportado fetch, por lo que tenemos que usar un fallback (polyfill) para los casos en los que no tenga soporte. Para eso remplazamos la función `apiClient` nuevamente con el siguiente código que implementa un polyfill muy básico.

    ```js
    function apiClient(url, options) {
        options = options || {};
        if (!('fetch' in window)) {
            // Real fetch polyfill: https://github.com/github/fetch
            return new Promise( (resolve, reject) => {
                let request = new XMLHttpRequest();
                
                request.open(options.method || 'get', url);

                request.onload = () => {
                    resolve(response());
                };

                request.onerror = reject;

                request.send(options.body);

                function response() {
                    return {
                        ok: (request.status/200|0) == 1,		// 200-299
                        status: request.status,
                        statusText: request.statusText,
                        url: request.responseURL,
                        clone: response,
                        text: () => Promise.resolve(request.responseText),
                        json: () => Promise.resolve(request.responseText).then(JSON.parse),
                        blob: () => Promise.resolve(new Blob([request.response]))
                    };
                };
            });
        }

        return fetch(url, options);
    }
    ```

    > **Nota**: Para un polyfill mas completo ver [github/fetch](https://github.com/github/fetch).

1. Ejecutar nuevamente la aplicación y ver que funcione todo como antes. Si abrimos las dev tools podremos ver que estamos accediendo al server en el panel Network, así como también en los logs del server en la consola.

## Intro a SW
Qué es

Cómo funciona

Requisitos
HTTPS

1. Lo primero a realizar es crear un archivo en el root de nuestro sitio que tendrá la lógica del Service Worker. Para esto agregamos un nuevo archivo con el nombre `service-worker.js` en la carpeta **public**.

1. Dentro de este archivo agregamos el siguiente código.

    ```js
    (function() {
        'use strict';

    })();
    ```

1. Ahora, necesitamos crear un nuevo archivo para agregar la lógica para registrar el service worker en nuestro sitio. Para eso, agregamos un archivo nuevo dentro de la carpeta **public/js** llamado `sw-registration.js`.

1. Dentro de `sw-registration.js` agregamos el siguiente código para registrar el service worker si es que el navegador lo soporta.

    ```js
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
            console.log('Registered:', registration);
        })
        .catch(function(error) {
            console.log('Registration failed: ', error);
        });
    }
    ```

    > **Nota**: Si la propiedad `serviceWorker` existe dentro de la variable `navigator`, es porque el navegador lo soporta. 


1. A la hora de entender el service worker, una de las cosas principales es su ciclo de vida.

    ![Ciclo de vida del service worker](./images/sw-lifecycle.png "Ciclo de vida del service worker")

    _Ciclo de vida del service worker_


1. Para visualizar este ciclo de vida vamos a agregar el siguiente código para que el service worker escuche a eventos de tipo `install` y escriba en el log el evento.

    ```js
    self.addEventListener('install', function(event) {
        console.log('On install');
        console.log(event);
    });
    ```

    > **Nota**: El evento install es muy útil para TBC

1. Ahora, agregar el siguiente código para que el service worker escuche a eventos de tipo `activate` y escriba en el log el evento.

    ```js
    self.addEventListener('activate', function(event) {
        console.log('On activate');
        console.log(event);
    });
    ```

    > **Nota**: El evento install es muy útil para TBC

1. Correr el sitio y ver los logs (TBC)


1. Ahora, agregar el siguiente código para que el service worker escuche a eventos de tipo `fetch` y realize la operación agregando un log de cada pedido.

    ```js
    self.addEventListener('fetch', function(event) {
        console.log(event.request);
        return fetch(event.request);
    });
    ```

    > **Nota**: Este ejemplo es trivial, dado que no hace falta realizarlo a mano, pero nos permite ver que podemos estar en el medio de cada pedido a un servidor.


1. Correr el sitio y ver los logs (TBC)


## Instalando nuestro sitio como app

Probar en devtools. Click en add to homescreen
Mostrar opciones de trackeo

1. Abrir el `manifest.json`, localizar la propiedad `start_url` y actualizar el valor por el siguiente.

    ```json
    "start_url": "http://localhost:3000/?utm_source=pwa&utm_medium=pwasite&utm_campaign=start",
    ```

    > **Nota**: Podemos cambiar la start_url para que cuando se inice la aplicación instalada use una url especial, dando una mejor experiencia a los usuarios, así como agregar parametros para tener un mejor tracking y entender si nuestro usuarios usan la app o entran al sitio directamente.

Cuántos entran desde el ícono con start_url
beforeinstallprompt para saber si aceptó o no