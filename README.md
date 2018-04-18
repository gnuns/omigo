<p align="center"><img width="480" alt="Omigo" src="http://i.imgur.com/0Rjl4RZ.png"></p>

<p align="center"><b>A mobile compatible anonymous random chat using socket.io and WebRTC</b></p>

## Screenshots
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fgnuns%2Fomigo.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fgnuns%2Fomigo?ref=badge_shield)

<img width="200" alt="A-Frame" src="http://i.imgur.com/2cmHx3p.png">
<img src="http://i.imgur.com/18tD8BW.png">

## Building
Omigo consists of two parts: the server, which establishes and control the connections between peers, and the client, the front-end user interface.

#### Building the client

```sh
$ npm install -g gulp
$ git clone https://github.com/gnuns/omigo
$ cd omigo/client
$ npm install
# nano client/src/js/app.js # update serverURI with your serverURI (default is http://localhost:3000)
$ gulp build # will build on the dist/ folder
```

#### Building the server

```sh
$ git clone https://github.com/gnuns/omigo
$ cd omigo/server
$ npm install
$ npm start # check the server/config.json file
```

## Features
- [x] Text chat
- [x] Video chat
- [x] Mobile compatibility
- [ ] Mode switch button (text/video)
- [ ] Multi-language
- [ ] 'Stranger is typing...'

## License

This program is free software and is distributed under an [MIT License](LICENSE).


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fgnuns%2Fomigo.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fgnuns%2Fomigo?ref=badge_large)