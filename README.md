# TheTracker
User tracker for Box Critters.

TheTracker is a [Box Criters](https://boxcritters.com) bot and an Express.js server written in Node.JS. The bot connects to Box Critters through Socket.IO and creates a list of connected users, sleeps 1 minute, joins the other room and updates the list to start over.  
Meanwhile, the server listens to `http://localhost: 80` `GET` requests. If the request contains one of the following parameters:
+ **name**: the nickname of the user you want to track, or
+ **id**: the id of the user you want to track
, responds with an image in SVG format that indicates whether the user is logged in or not. Otherwise it returns an error SVG image, together with an HTTP 404 error code (Not Found).

## Dependencies
TheTracker depends on Node.JS and the following packages:
+ express,
+ socket.io-client,
+ playfab-sdk,
+ helmet,
+ compress, and
+ http

## How to use it?
Simply clone or download the repository, install the needed packages with `npm install` and execute it with `node index.js <email> <password>`.

## Online version
There is currently a version of TheTracker deployed on [Heroku](https://bcthetracker.herokuapp.com).

## License
TheTracker by [@Alvarito050506](https://github.com/Alvarito050506) is licensed under the GNU General Public License version 2.0 (**GPL v2.0 only**). For more information, please see the LICENSE file.
