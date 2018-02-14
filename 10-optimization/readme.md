# 10. Optimizaciones 🔩

Son muchas las técnicas existentes para mejorar la performance de los sitios web en general.

En el módulo anterior, Lighthouse nos sugirió algunos puntos flojos. Aquí vemos distintas opciones para mejorarlos y agregamos algunas otras optimizaciones posibles.   

## Minificar estáticos
Una opción sencilla sería utilizar [gulp-minifier](https://www.npmjs.com/package/gulp-minifier) para minificar html, css y js.

## Inlinear CSS crítico
Solo una parte del css es necesario para mostrar el contenido principal de nuestra web. Ese css podría ser colocado inline y el resto del css cargarse diferidamente para evitar el bloqueo del renderizado.
Una herramienta para automatizar esto es [critical](https://github.com/addyosmani/critical).

## Optimizar imágenes
Siguiendo en la línea de herramientas de gulp, [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin) puede ayudarnos a automatizar la optimización de todas las imágenes de nuestro sitio. Reduciendo así su tamaño.

## Implementar webp
[Webp](https://developers.google.com/speed/webp/) es un formato de imágenes desarrollado por Google que permite reducir el tamaño de los archivos sin pérdidas de calidad notorias.

Es compatible con Chrome y Opera con lo cual para poder utilizarlo deberemos tener en cuenta que otros navegadores no podrán mostrar la imagen. Lo ideal es utilizar el elemento `picture` con más de un `source` como vimos en el [módulo 3](./03-conceptos#progressive-enhancement) de conceptos.

Finalmente, para automatizar la conversión de nuestras imágenes a webp podemos hacer uso de [gulp-webp](https://www.npmjs.com/package/gulp-webp).

## Optimizaciones sugeridas por Lighthouse

Por último, vamos a repasar las optimizaciones sugeridas por Lighthouse y ver cómo solucionar cada una de ellas.

### Accesibilidad
Lighthouse nos decía que algunos botones no tenían buen contraste entre color de fondo y de fuente.

Es relativamente sencillo de solucionar, simplemente basta con cambiar esos colores. Como los botones son de Bootstrap deberíamos hacerlo directo sobre la librería para no tener estos problemas al agregar nuevos botones en otras partes del sitio.

### GZIP respuestas y estáticos
Lighthouse nos sugería comprimir las respuestas de archivos estáticos y html.

Esas respuestas son enviadas por nuestro servidor de node y afortunadamente para nosotros, express nos brinda la posibilidad de hacerlo.

Debemos instalar el módulo [compression](https://www.npmjs.com/package/compression).

Y agregar el middleware en nuestro index.js:
```js
var compression = require('compression');
var express = require('express');
var app = express();
app.use(compression());
```

### HTTPS
No usamos https en local pero sí deberíamos hacerlo al subir nuestro sitio. De lo contrario muchas de nuestras funcionalidades no funcionarán.

Express es compatible con https. [Aquí](http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/) un ejemplo de cómo configurarlo.

### HTTP/2
HTTP/2 es la última versión del protocolo HTTP. Está desarrollado a partir de SPDY, un protocolo experimental construido por Google.

HTTP/2 tiene muchas ventajas. Usa una única conexión TCP para servir múltiples archivos. También comprime los headers de HTTP y los envía en formato binario (mucho mejor que el texto plano de HTTP/1).

Otra diferencia de HTTP/2 es que permite hacer Server Push. Le da al servidor la posibilidad de enviar archivos al cliente antes de que éste los necesite.

Te sugerimos seguir [este tutorial](http://ivanjov.com/running-express-koa-and-hapi-on-http-2/) para implementar HTTP/2 en nuestra app.


## ¿Mejoramos?
Te recomendamos volver a correr Lighthouse con todas las mejoras que hayas podido sumar y ver el nuevo puntaje.

## Próximo modulo
Avanzar al [módulo 11 - Como seguir 🤔](../11-links)
