# 8. Background Sync ♻️

## Introducción

Background sync es una nueva API que permite diferir acciones hasta que el usuario tenga una conexión estable. Es útil para asegurarse de que, sin importar lo que el usuario envíe, realmente sea enviado.

Veamos un poco de qué se trata para luego aplicarla en la PWA que venimos construyendo.


### El problema

Muchas veces, un usuario interactúa con nuestras aplicaciones de la siguiente manera:

1. Saca el teléfono de su bolsillo.
1. Realiza una acción menor.
1. Vuelve a guardar el teléfono.
1. Sigue con su vida.

Desafortunadamente, esta experiencia es usualmente afectada por la pobre conectividad. A todos nos pasa, quedarnos mirando una pantalla blanca o una animación de _"cargando"_ sabiendo que deberíamos rendirnos y seguir en otra cosa, pero le damos otros 10 segundos por si acaso funciona.

Después de esos 10 segundos? Muchas veces nada pasa. ¿Deberíamos rendirnos ahora? Pero ya invertimos tiempo, abandonar sería un desperdicio, así que seguimos esperando. En este punto queremos abandonar, pero sabemos que ese segundo en el que lo hagamos, será el segundo previo a que todo finalmente funcione.

Los Service workers solucionan la parte de carga, permitiendo mostrar contenido desde un cache. Pero ¿Qué hacemos cuando **el sitio necesita enviar algo al servidor**?

Actualmente, si el usuario presiona _"enviar"_ un mensaje verá una animación hasta que el envío finalice. Si intenta navegar hacia otro lugar o cerrar la pestaña, podemos usar el evento `onbeforeunload` para mostrarle un mensaje del estilo: _"¡No! Necesitas seguir viendo este spinner un tiempo más."_. Si el usuario no tiene conexión, le decimos: _"Lo lamentamos, no pudimos hacer eso que querías hacer. Intenta nuevamente más tarde"_.


### La solución

El siguiente video muestra _"Emojoy"_, un chat exclusivamente de emojis. Es una PWA, funciona offline, usa notificaciones y mensajes push y **background sync**.
  
En el video se puede ver que un usuario intenta enviar un mensaje sin conexión y que, luego, el mensaje es enviado en segundo plano cuando recupera la conectividad.

[![Ejemplo usando background sync](https://img.youtube.com/vi/l4e_LFozK2k/0.jpg)](https://www.youtube.com/watch?v=l4e_LFozK2k)

Desde Marzo de 2016, Background sync está disponible en Chrome desde la versión 49.


### ¿Cómo pedimos una sincronización en segundo plano?

Hay que solicitar que un evento sea disparado cuando el usuario tenga conectividad. Esto puede ocurrir inmediatamente (si el usuario tiene conectividad en ese momento). Al mismo tiempo, debemos escuchar por ese evento y hacer lo que necesitamos cuando se dispare. 

Como con las notificaciones push, es el service worker quien recibirá el evento, lo cual permite que la sincronización funcione inclusive cuando la página no esté abierta.

El código con el que se solicita el evento de sincronización es muy sencillo:
```js
navigator.serviceWorker.ready.then(function(swRegistration) {
  return swRegistration.sync.register('miSincro');
});
```

Y cómo escucharlo en el Service Worker también:
```js
self.addEventListener('sync', function(event) {
  if (event.tag == 'miSincro') {
    event.waitUntil(sincronizar());
  }
});
```

Y eso es todo, la función `sincronizar` debe retornar una promesa. Si la promesa resuelve exitosamente, la sincronización estará terminada. Si falla, otra sincronización se agendará para más adelante. Los reintentos de sincronización también esperarán por una buena conectividad y utilizarán un tiempo de espera incremental exponencial.

El nombre de la sincronización (`miSincro` en el ejemplo anterior) debe ser único por sincronización. Si se registra una sincronización usando el mismo nombre que una pendiente, ambas se fusionarán. Esto significa que, por ejemplo, se pueden registrar sincronizaciones para limpiar la bandeja de salida cada vez que un usuario envía un mensaje, pero si el usuario envía varios mensajes estando offline, solo se recibirá 1 intento de sincronización cuando vuelva a estar conectado.


### ¿Para qué se puede usar background sync?

Idealmente, deberíamos usar _background sync_ para cualquier envío de datos que nos interese que se realice satisfactoriamente más allá de la vida de la página. Mensajes de chat, emails, actualizaciones de documentos, cambios de configuraciones, subida de imágenes... Cualquier cosa que queramos que llegue al servidor incluso si el usuario se va de nuestro sitio o cierra la pestaña.

La página puede almacenar todos los envíos pendientes en una base de datos [indexedDB](https://developer.mozilla.org/es/docs/IndexedDB-840092-dup/Usando_IndexedDB) para que el service worker pueda obtenerlos desde allí y enviarlos.


### Progressive enhancement

Puede llevar un tiempo hasta que todos los navegadores soporten background sync. Por eso debemos implementarlo "progresivamente":

```js
if ('serviceWorker' in navigator && 'SyncManager' in window) {
  navigator.serviceWorker.ready.then(function(reg) {
    return reg.sync.register('miSincro');
  }).catch(function() {
    // No se pudo registrar el pedido de sincro,
    // puede ser una restricción del sistema operativo
    sincronizar();
  });
} else {
  // serviceworker/sync no soportado
  sincronizar();
}
```

Si el navegador no fuera compatible, simplemente enviamos los datos como lo haríamos normalmente. Comprobamos la compatibilidad en el `if ('serviceWorker' in navigator && 'SyncManager' in window)`

### El futuro

Se está trabajando en una variante llamada _"periodic background sync"_. Esto nos permitiría pedir un evento de `periodicsync` con restricciones de tiempo, estado de batería y red con el objetivo de hacer sincronizaciones periódicas.

Con esta herramienta un sitio de noticias podría, por ejemplo, pedir sincronizarse cada una hora para que, cuando el usuario ingrese, el contenido esté actualizado y listo para ser leído.


## Usar background sync en nuestra aplicación

Vamos a agregar la posibilidad de eliminar todos los gastos estando sin conexión. Para eso vamos a modificar el botón existente haciendo que dispare la eliminación en backgroud. En caso de presionarlo estando offline, los gastos se borrarán cuando recuperemos la conexión.

1. Abrir una terminal en la carpeta en donde tengas el código. Si todavía no copiaste el código o no hiciste el módulo anterior, copiar la carpeta **code** localizada dentro de ese módulo a algún lugar cómodo para poder trabajar (ejemplo: el escritorio o la carpeta de usuario).

1. Lo primero que tenemos que hacer es modificar el comportamiento al botón. En el archivo `home.js` cambiar el listener del click en el botón de eliminar para que dispare el pedido de sincronización.

    ```js
    const deleteBtn = document.querySelector('#delete');
    deleteBtn.addEventListener('mousedown', () => {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready.then(function(reg) {
                return reg.sync.register('delete-expenses');
            }).catch(function() {
                // No se pudo registrar el pedido de sincro,
                // puede ser una restricción del sistema operativo
                deleteExpenses(() => {
                    updateHomeView(); 
                });
            });
        } else {
            // serviceworker/sync no soportado
            deleteExpenses(() => {
                updateHomeView(); 
            });
        }
    });
    ```

    Lo que hacemos es bindear el evento al botón y en caso de ser compatible lanzamos el pedido de sincro con el tag `delete-expenses`.
    
    Si el navegador no fuera compatible o hubiera un problema al registrar la sincronización llamamos directamente a la función `deleteExpenses`.
    
    Con esto estamos cumpliendo lo que arriba definimos como _"Progressive enhancement"_ para esta funcionalidad.


1. En el paso anterior pedimos que se registre la sincro, ahora debemos reaccionar cuando el navegador nos diga que es momento de ejecutarla. Entonces, tenemos que agregar el listener correspondiente en nuestro `service-worker.js`.

    ```js
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
    ```
    
    Cuando la eliminación se realiza a través de una sincronización en segundo plano, nuestra interfaz no se entera. No podemos actualizarla desde el service worker. Para eso es la función broadcast que estamos usando.
    
    En el próximo paso actualizaremos la interfaz cuando recibamos el mensaje correspondiente. 
    
    > **Nota:** Estamos duplicando la lógica para hacer la eliminación de los gastos.
    > No es lo más óptimo pero resulta más sencillo a modos ilustrativos.


1. La función `broadcast` del paso anterior está haciendo uso de [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Client/postMessage) que nos permite enviarle un mensaje a nuestro cliente para que actualice los datos.
    
    Para reaccionar a dicho evento, agregar en `home.js` el siguiente código:
    
    ```js
    if (navigator.serviceWorker) {
        window.addEventListener('message', event => { // non-standard Chrome behaviour
            if (event.origin && event.origin !== location.origin) return;
            onServiceWorkerMessage(event.data);
        });
        navigator.serviceWorker.addEventListener("message", event => onServiceWorkerMessage(event.data));
    }
    
    function onServiceWorkerMessage(message) {
        if (message.action === 'updateHome') {
            updateHomeView();
        }
    }
    ```
    
    Cuando nuestra home reciba el mensaje ejecutará la función `updateView` y eliminará los datos sin la necesidad de refrescar.


### ¡A probar!

Una vez completados todos los pasos anteriores debemos probar de dos maneras distintas. Con conexión y sin conexión.

Antes que nada, abrir las _Developer Tools_ del browser, seleccionar la solapa **Application** y ver la información que figura en la misma dentro de la categoría **Service Worker**. Asegurarse que figure como _Activated and is running_ (refrescar el sitio en caso contrario).

> **Nota:** Seguramente quieras o tengas que probar varias veces. 
> Para recuperar los gastos originales después de eliminarlos hay que detener el servidor node y volver a ejecutarlo.

#### Con conexión

En este paso nos aseguramos de que funcione correctamente el último paso agregado.

1. Clickear el botón de eliminar gastos.
1. Los gastos deberían desaparecer en el momento.

#### Sin conexión
1. Desconectar Wi-Fi.
1. Clickear el botón de eliminar gastos.
1. Conectar Wi-Fi.
1. Los gastos deberían desaparecer sin ninguna acción extra.

> **Nota:** Por si acaso, asegurar que la computadora esté conectada a la corriente eléctrica.
>
> En algunos casos, chrome puede entender que el funcionamiento a batería no es el adecuado para lanzar la sincronización.


Otras pruebas interesantes para realizar son:
#### Sin conexión cerrando la pestaña
1. Desconectar Wi-Fi.
1. Clickear el botón de eliminar gastos.
1. Cerrar la pestaña.
1. Conectar Wi-Fi.
1. Se debería ver el `DELETE` en la consola donde tengamos corriendo node.
1. Abrir la pestaña.
1. Los gastos deberían haber desaparecido.


## Extras

Algunas ideas para profundizar más sobre background sync:

- Sincronizar todos los envíos al servidor. Cada nuevo gasto, ítem o cambio en los nombres.
- Pedir una sincro para descargar un pdf con todos los gastos.
- Utilizar [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Client/postMessage) en alguna otra funcionalidad para comunicar mensajes del SW a nuestro cliente.


## Créditos

- Introducción traducida de: https://developers.google.com/web/updates/2015/12/background-sync
- Especificación: https://github.com/WICG/BackgroundSync/blob/master/explainer.md

## Próximo modulo
Avanzar al [módulo 9 - Herramientas para desarrollo 🛠️](../09-tooling)
