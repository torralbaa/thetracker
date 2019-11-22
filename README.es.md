# TheTracker
Rastreador de usuarios para Box Critters.

TheTracker es un bot de [Box Criters](https://boxcritters.com) y un servidor Express.js escrito en Node.JS. El bot se conecta a Box Critters a través de Socket.IO y crea una lista de los usuarios conectados, duerme 1 minuto, se une a la otra sala y actualiza la lista para volver a empezar.   
Mientras tanto, el servidor escucha en `http://localhost:80` las peticiones `GET`. Si la petición contiene uno de los siguientes parámetros:
+ **name**: el nombre del usuario que se quiere rastrear, o
+ **id**: el id del usuario que se quiere rastrear
, responde con una imagen en formato SVG que indica si el usuario está conectado o no. En caso contrario devuelve una imagen SVG de error, junto con un código de error HTTP 404 (Not Found).

## Dependencias
TheTracker depende de Node.JS y de sus siguientes paquetes:
+ express,
+ socket.io-client,
+ playfab-sdk,
+ helmet,
+ compress, y
+ http

## ¿Cómo usarlo?
Simplemente clone o descarge el repositorio, instale los paquetes necesarios con `npm install` y ejecútelo con `node index.js <email> <contraseña>`.

## Versión en línea
Actualmente existe una versión de TheTracker desplegada en [Heroku](https://bcthetracker.herokuapp.com).

## Licencia
TheTracker por [@Alvarito050506](https://github.com/Alvarito050506) está liberado bajo la GNU General Public License (**GPL v2.0 only**). Para obtener más información, consulte el archivo LICENSE.
