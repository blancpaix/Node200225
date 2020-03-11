const express = require(`express`);
const http = require(`http`);
const socket  = require(`socket.io`);

let app = express();
let server = http.createServer(app);
let io = socket(server);

server.listen(3000, () => {
	console.log(`server on 30000 port`);
})

let memberInfoName = {}
let memberInfoId = {}
let groups = []

let chat = io.of(`/chat`).on('connection', (socket) => {
	/*
	console.log(`connection`)
	socket.on('enter', (result) => {
		socket.emit('enter', true)
	})
	*/
	socket.on('enter', (name) => {
		let id = socket.id
		if (memberInfoName.hasOwnProperty(name)) {		// 유저 존재 여부 검사
			socket.emit('enter', false)
		} else {
			memberInfoName[name] = id 		// 왜 이렇게 넣는거임?
			memberInfoId[id] = name 		// 여기도 마찬가지고??
			socket.emit('enter', true)
		}
	})
})
