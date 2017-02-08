<p align="center"><img width="480" alt="A-Frame" src="http://i.imgur.com/0Rjl4RZ.png"></p>

<p align="center"><b>A mobile compatible anonymous random chat using Elixir/Phoenix and WebRTC</b></p>

## Screenshots
[...]
## Building
Omigo consists of two parts: the server, which establishes and control the connections between peers, and the client, the front-end user interface.

#### Building the client

```sh
$ npm install -g gulp
$ git clone https://github.com/gnuns/omigo
$ cd omigo/client
$ npm install
$ gulp build # will build on the dist/ folder
```

#### Building the server
[...]

## TODO
- [ ] Text chat               
- [ ] Video chat
- [X] Mobile compatibility
- [ ] Mode switch button (text/video)
- [ ] Multi-language
- [ ] 'Stranger is typing...'

## License

This program is free software and is distributed under an [MIT License](LICENSE).
