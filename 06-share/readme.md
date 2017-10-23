# 6. Web share API
La Web Share API es una API propuesta para compartir texto, links y otros contenidos en algún destino arbitrario elegido por el usuario.

Antes de esta API, compartir en redes sociales (por ejemplo) obligaba a usar extrañas urls con parámetros poco documentados y a llenar nuestra web de botones con todas las posibilidades. Ahora, con esta nueva API, con un solo botón podremos lanzar la interaz nativa de Android para compartir **en cualquiera de las aplicaciones** que el usuario tenga instalada.

A partir de chrome 61 para Android ya puede ser utilizada a través de `navigator.share()`. El único método de la API basado en promesas.

## Ejemplo de la API en acción
[![Ejemplo de Web Share API](https://img.youtube.com/vi/lhUzYxCvWew/0.jpg)](https://www.youtube.com/watch?v=lhUzYxCvWew)

## Compartir en el proyecto
Vamos a darle a los usuarios la posibilidad de compartir en dos puntos distintos de nuestra app.

### Compartir la web completa
1. Abrir el archivo `index.html` y agregar el siguiente código en el navbar:
    ```html
    <span class="share" onclick="share('Te invito a probar Progressive Expenses')">Compartir</span>
    ```

1. Abrir el archivo `common.js` y agregar la siguiente función:
    ```js
    function share(event, title) {
        event.preventDefault();
        if (navigator.share) {
            navigator.share({
                title: title,
                url: window.location.href,
            })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
        }
    }
    ```
    
> **Nota**: Como se puede observar, estamos agregando elemento que, al ser clickeado comprueba la disponibilidad de la API. Si ésta se encuentra disponible la usa y sino abre una nueva ventana para compartir en Facebook.
>
> Con esto nos aseguramos que nuestra experiencia funcione en todas las plataformas y aprovechamos aquellas funcionalidades que nos brindan algunas plataformas más evolucionadas. 


### Compartir un gasto puntual
1. Abrir el archivo `expense.html` y agregar el siguiente código en el navbar:
    ```html
    <span class="share" onclick="share('Te invito a compartir este gasto conmigo en Progressive Expenses')">Compartir gasto</span>
    ```

    La función `share` que definimos en el paso anterior es suficiente para implementar la funcionalidad en esta página.
    Las URLs bien definidas nos brindan la posibilidad de compartir contenido muy fácilmente.

## Para ver más
- [link a la especificación](https://wicg.github.io/web-share/)
- [link a introducción en Google Developers](https://developers.google.com/web/updates/2016/09/navigator-share)

## Próximo modulo
Avanzar al [módulo 7](../07-notifications) 