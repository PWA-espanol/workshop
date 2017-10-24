# 6. Web share API

La _Web Share API_ es una API propuesta para compartir texto, links y otros contenidos en algún destino arbitrario elegido por el usuario.

Antes de esta API, compartir en redes sociales (por ejemplo) obligaba a usar extrañas urls con parámetros poco documentados y a llenar nuestra web de botones con todas las posibilidades. Ahora, con esta nueva API, con un solo botón podremos lanzar la interfaz nativa del sistema operativo para compartir **en cualquiera de las aplicaciones** que el usuario tenga instalada.

A partir de chrome 61 para Android ya puede ser utilizada a través de `navigator.share()`. El único método de la API basado en promesas. En este módulo vamos a implementar esta funcionalidad en nuestra app.

## Ejemplo de la API en acción

[![Ejemplo de Web Share API](https://img.youtube.com/vi/lhUzYxCvWew/0.jpg)](https://www.youtube.com/watch?v=lhUzYxCvWew)


## Compartir en el proyecto

Vamos a darle a los usuarios la posibilidad de compartir en dos puntos distintos de nuestra app.


### Compartir la web completa

1. Abrir una terminal en la carpeta en donde tengas el código. Si todavía no copiaste el código o no hiciste el módulo anterior, copiar la carpeta **code** localizada dentro de ese módulo a algún lugar cómodo para poder trabajar (ejemplo: el escritorio o la carpeta de usuario).

1. Abrir el archivo `index.html` y ver el siguiente código en la navbar.

    ```html
    <span class="share" onclick="share('Te invito a probar Progressive Expenses')">Compartir</span>
    ```

1. Abrir el archivo `common.js` y buscar la función `share`. Notar que solo abre una nueva ventana para compartir por Twitter.

    ```js
    function share(title) {
        const url = window.location.href;    
        window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(title) + "&url=" + encodeURIComponent(url), '_blank');
    }
    ```

1. Actualizar la implementación de la función con la siguiente.

    ```js
    function share(title) {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: title,
                url: url,
            })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
        } else {
            window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(title) + "&url=" + encodeURIComponent(url), '_blank');
        }
    }
    ```
    
    > **Nota**: Como se puede observar, estamos comprobando la disponibilidad de la API. Si ésta se encuentra disponible la usamos y si no, abrimos la misma ventana que antes para compartir en Twitter.
    >
    > Con esto nos aseguramos que nuestra experiencia funcione en todas las plataformas y aprovechamos aquellas funcionalidades que nos brindan algunas plataformas más evolucionadas.


### Compartir un gasto puntual

1. Abrir el archivo `expense.html` y ver el siguiente código en la navbar.

    ```html
    <span class="share" onclick="share('Te invito a compartir este gasto conmigo en Progressive Expenses')">Compartir gasto</span>
    ```

    La función `share` que definimos en el paso anterior es suficiente para implementar la funcionalidad en esta página.
    Las URLs bien definidas nos brindan la posibilidad de compartir contenido muy fácilmente.


## Probarla

Es normal que en la computadora sigas viendo la ventana de Twitter.

Como dijimos antes, la API solo se encuentra disponible en Chrome para Android así que la única manera de probarla será entrando a nuestro sitio por un teléfono compatible.

## Para ver más

- [link a la especificación](https://wicg.github.io/web-share/)
- [link a introducción en Google Developers](https://developers.google.com/web/updates/2016/09/navigator-share)


## Próximo modulo

Avanzar al [módulo 7](../07-notifications) 