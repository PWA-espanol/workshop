# 7. Trabajando con notificaciones

En esta sección vamos a recorrer los pasos necesarios para enviar, recibir, y mostrar notificaciones push. Debemos distinguir las notificaciones de las notificaciones push.

Las notificaciones son mensajes que son mostrados en el dispositivo del usuario, fuera del contexto del navegador o una aplicación.

Las notificaciones push son notificaciones creadas como respuesta a un mesaje enviado desde un servidor y que funcionan inclusive cuando el usuario no está usando activamente nuestra aplicación.

El sistema de notificaciones en chrome está construído encima de la API de Service Worker, que recive los mensajes push en segundo plano y los transmite a nuestra aplicación.


## Lo que vamos a hacer

- Crear y mostrar una notificación en una aplicación web con la necesidad (o no) de una acción por parte del usuario.
- Aprender a usar la API de Web Push para recibir una notificación.
- Aprender a diseñar las notificaciones push siguiendo las mejores prácticas.


## Lo que no vamos a hacer

- Implementar el envío de una notificación desde un servidor propio. (Lo vamos a simular para evitar todo el código de backend)


## Implementar una notificación



## Recibir una notificación push



## Extras

Si te interesa profundizar más, una opción es implementar el envío de las notificaciones desde nuestro servidor node.

Para esto, te recomendamos revisar el paquete [web-push](https://www.npmjs.com/package/web-push) de npm que implementa el protocolo de web push y es compatible también con otras tecnologías anteriores.

