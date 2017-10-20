# 8. Background Sync

## Introducción

Background sync es una nueva API que pemite diferir acciones hasta que el usuario tenga una conexión estable. Es útil para asegurarse que sea lo que sea que el usuario envíe, realmente sea enviado.

Veamos un poco de qué se trata y luego lo aplicaremos en la aplicación que venimos construyendo.


### El problema

Muchas veces, un usuario interactua con nuestras aplicaciones de la siguiente manera:

1. Saca el teléfono de su bolsillo.
1. Realiza una acción menor.
1. Vuelve a guardar el teléfono.
1. Sigue con su vida.

Desafortunadamente, esta experiencia es usualmente afectada por la pobre conectividad. A todos nos pasa, quedar mirando una pantalla blanca o una animación de _"cargando"_ sabiendo que deberíamos rendirnos y seguir en otra cosa, pero le damos otros 10 segundos por si acado funciona.

Después de esos 10 segundos? Nada pasa. Deberíamos rendirnos ahora? Pero invertimos ya tiempo, abandonar sería un desperdicio, asi que seguimos esperando. En este punto queremos abandonar, pero sabemos que ese segundo en el que lo hagamos, será el segundo previo a que todo finalmente funcione.

Los Service workers solucionan la parte de carga, permitiendo mostrar contenido desde un cache. Pero ¿Quñe hacemos cuando **el sitio necesita enviar algo al servidor**?

Actualmente, si el usuario presiona _"enviar"_ un mensaje verá una animación hasta que el envío finalice. Si intenta navegar hacia otro lugar o cerrar la pestaña, usamos `onbeforeunload` para mostrarle un mesaje del estilo: _"¡No! Necesitas seguir viendo este spinner un tiempo más."_. Si el usuario no tiene conexión, le decimos: _"Lo lamentamos, no pudimos hacer eso que querías hacer. Intenta nuevamente más tarde"_.


### La solución

El siguiente video muestra _"Emojoy"_, un chat exclusivamente de emojis. Es una PWA, funciona offline, usa notificaciones y mensajes push y **background sync**.
  
[![Ejemplo usando background sync](https://img.youtube.com/vi/l4e_LFozK2k/0.jpg)](https://www.youtube.com/watch?v=l4e_LFozK2k)

En el video se puede ver que un usuario intenta enviar un mensaje sin conexión y que, luego, el mensaje es enviado en segundo plano cuando recupera la conectividad.

Desde Marzo de 2016, Background sync está disponible en Chrome desde la versión 49.


### ¿Cómo pedimos una sincronización en segundo plano?

Hay que solicitar que un evento sea disparado cuando el usuario tenga conectividad. Esto puede ocurrir inmediatamente (si el usuario tiene conectividad en ese momento). Al mismo tiempo, debemos escuchar por ese evento y hacer lo que necesitamos cuando se dispare. 

Como las notificaciones push, es el service worker quien recibirá el evento, lo cual permite que la sincronización funcione inclusive cuando la página no esté abierta.

El código con el que se solicita el evento de sincronización es muy sencillo:
```js
navigator.serviceWorker.ready.then(function(swRegistration) {
  return swRegistration.sync.register('mySincro');
});
```

Y cómo escucharlo en el Service Worker también:
```js
self.addEventListener('sync', function(event) {
  if (event.tag == 'mySincro') {
    event.waitUntil(sincronizar());
  }
});
```

Y eso es todo, la función `sincronizar` debe devolber una promesa. Si la promesa resuelve exitosamente, la sincronización estará terminada. Si falla, otra sincronización se agendará para más adelante. Los reintentos de sincronización también esperarán por una buena conectividad y utilizarán un tiempo de espera incremental exponencial.

El nombre de la sincronización (`miSincro` en el ejemplo anterior) debe ser único por sincronización. Si se registra una sincronización usando el mismo nombre que una pendiente, ambas se fusionarán. Esto significa que, por ejemplo, se pueden registrar sincronizaciones para limpiar la bandeja de salida cada vez que un usuario envía un mensaje, pero si el usuario envía varios mensajes estando offline, solo se recibirá 1 intento de sincronización cuando vuelva a estar conectado.


### ¿Para qué se puede usar background sync?

Idealmente, para cualquier envío de datos que nos interese que se realice satisfactoriamente más allá de la vida de la página. Mensajes de chat, emails, actualizaciones de documentos, cambios de configuraciones, subida de imágenes... Cualquier cosa que querramos que llegue al servidor incluso si el usuario se va de nuestro sitio o cierra la pestaña.

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

Si el navegador no fuera compatible, simplemente enviamos los datos como lo haríamos normalmente.

   > **Nota**: Incluso si nuestros usuarios tienen buena conectividad, siempre es una buena idea usar background sync porque nos proteje de usuarios que salgan rápido de nuestra web o cierren la pestaña mientras se envían los datos.


### El futuro

Se está trabajando en una variante llamanada _"periodic background sync"_. Esto nos permitiría pedir un evento de `periodicsync` con restricciones de tiempo, estado de batería y red con el objetivo de hacer sincronizaciones periódicas.

Con esta herramienta un sitio de noticias podría por ejemplo, pedir sincronizarse cada una hora para que cuando el usuario ingrese, el contenido esté actualizado y listo para ser leído.


## Usar background sync en nuestra aplicación

Vamos a agregar la posibilidad de eliminar todos los gastos. Para eso vamos a sumar un botón que dispare la eliminación en backgroud. En caso de presionarlo estando offline, los gastos se borrarán cuando recuperemos la conexión.

### Agregar el botón

En el archivo index.html agregar:

```html
    <div class="row justify-content-center pb-4">
        <div class="col col-sm-10">
            <button id="delete" class="btn btn-outline-danger btn-block">Eliminar todos los gastos</button>
        </div>
    </div>
```

### Agregar comportamiento al botón

En el archivo home.js agregar:

```js
const deleteBtn = document.querySelector('#delete');
deleteBtn.addEventListener('mousedown', () => {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(function(reg) {
            return reg.sync.register('delete-expenses');
        }).catch(function() {
            // No se pudo registrar el pedido de sincro,
            // puede ser una restricción del sistema operativo
            deleteExpenses();
        });
    } else {
        // serviceworker/sync no soportado
        deleteExpenses();
    }
});
```

Lo que hacemos es bindear el evento al botón y en caso de ser compatible lanzamos el pedido de sincro con el tag `delete-expenses`.

Si el navegador no fuera compatible o hubiera un problema al registrar la sincronización llamamos directamente a la función `deleteExpenses` que implementaremos en el próximo paso.

Con esto estamos cumpliendo lo que arriba definimos como _"Progressive enhancement"_ para esta funcionalidad.


### Eliminando los gastos

En el archivo `common.js` agregar:

```js
function deleteExpenses() {
    apiClient(`${serverUrl}api/expense`, {method: 'DELETE'})
        .then((response) => {
            if (response.ok) {
                updateHomeView();
            } else {
                alert("Error deleting expenses");
            }
        })
}
```

Con esto nos aseguramos de que se haga la llamada correspondiente a nuestro servidor para eliminar todos los gastos.
Y luego actualizamos la interfaz llamando a `updateHomeView`.

> **Nota:** Seguramente quieras o tengas que probar varias veces. 
> Para recuperar los gastos originales después de eliminarlos hay que detener el servidor node y volver a ejecutarlo.


### Reaccionar al evento de sincronización

En el paso anterior pedimos que se registre la sincro, ahora debemos reaccionar a cuando el navegador nos diga que es momento de ejecutarla.

Entonces, en nuestro `service-worker.js` agregar:

```js
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

> **Nota:** Estamos duplicando la lógica para hacer la eliminación de los gastos.
> No es lo más óptimo pero resulta más sencillo a modos ilustrativos.


### Actualizar la página eliminando desde el service worker:

Cuando la eliminación se realiza a través de una sincronización en segundo plano, nuestra interfaz no se entera.
No podemos actualizarla desde el service worker. Para eso es la función broadcast que estamos usando en el paso anterior.

Esa función está haciendo uso de [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Client/postMessage) que nos permite enviarle un mensaje a nuestro cliente para que actualice los datos.

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

Una vez completados todos los pasos anteriores debemos probar de dos maneras distintas. Con conexión y sin conexión

#### Con conexión

En este paso nos aseguramos de que funcione correctamente el último paso agregado.

1. Clickear el botón de eliminar gastos.
1. Los gastos deberían desaparecer en el momento.

#### Sin conexión
1. Desconectar Wi-Fi.
1. Clickear el botón de eliminar gastos.
1. Conectar Wi-Fi.
1. Los gastos deberían desaparecer sin ninguna acción extra.

> **Nota:** Por si acado, asegurar que la computadora esté conectada a la corriente eléctrica.
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

- Sincronizar todos los envíos al servidor. Cada nuevo gasto, item o cambio en los nombres.
- Pedir una sincro para descargar un pdf con todos los gastos.
- Utilizar [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Client/postMessage) en alguna otra funcionalidad para comunicar mensajes del SW a nuestro cliente.


## Créditos

- Introducción traducida de: https://developers.google.com/web/updates/2015/12/background-sync
- Especificación: https://github.com/WICG/BackgroundSync/blob/master/explainer.md
