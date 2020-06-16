const express = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const fs = require(`fs`);

const Room = require(`../schema/room`);
const Chat = require(`../schema/chat`);

const router = express.Router();
/*
router.get(`/`, (req, res) => {
	res.render(`index`);
});		*/
router.get(`/`, async(req, res, next) => {
	try {
		const rooms = await Room.find({});
		res.render(`main`, {rooms, title : `GIF 채팅방`, error : req.flash(`roomError`) });
	} catch (err) {
		console.error(err);
		next(err);
	}
});

router.get(`/room`, (req, res) => {
	res.render(`room`, {title : `GIF 채팅방 생성`});
});

router.post(`/room`, async (req, res, next) => {
	try {
		const room = new Room ({
			title : req.body.title,
			max : req.body.max,
			owner : req.session.color,
			password : req.body.password,
		});
		const newRoom = await room.save();
		const io = req.app.get(`io`);
		io.of(`/room`).emit(`newRoom`, newRoom);
		res.redirect(`/room/${newRoom._id}?password=?${req.body.password}`);
	} catch (err) {
		console.error(err);
		next(err);
	}
});

router.get(`/room/:id`, async(req, res, next) => {
	try {
		const room = await Room.findOne({ _id : req.params.id });
		const io = req.app.get(`io`);
		
		console.log(`room 한번 확인해보쇼 : ${room}`);
		if (!room) {
			req.flash(`roomError`, `존재하지 않는 방입니다.`);
			return res.redirect(`/`);
		}
		if (room.password && room.password !== req.query.password) {
			req.flash(`roomError`, `비밀번호가 틀렸습니다.`);
			return res.redirect(`/`);
		}
		const {rooms} = io.of(`/chat`).adapter;
		if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
			req.flash(`roomError`, `허용 인원이 초과함.`);
			return res.redirect(`/`);
		}

		const chats = await Chat.find({ room : room._id }).sort('createdAt')

		return res.render(`chat`, {
			room,
			title : room.title,
			chats,
			user : req.session.color,
		});

	} catch (err) {
		console.error(err);
		return next(err);
	}
});

router.delete(`/room/:id`, async(req, res, next) => {
	try {
		await Room.remove({ _id: req.params.id });
		await Chat.remove({ room: req.params.id });
		res.send(`ok`);
		setTimeout(() => {
			req.app.get(`io`).of(`/room`).emit(`removeRoom`, req.params.id);
		}, 2000);
	} catch (err) {
		console.error(err);
		next(err);
	}
});

router.post(`/room/:id/chat`, async ( req, res, next) => {
	try {
		const chat = new Chat ({
			room : req.params.id,
			user : req.session.color,
			chat : req.body.chat,
		});
		await chat.save();
		req.app.get('io').of(`/chat`).to(req.params.id).emit(`chat`, chat);
		res.send('ok');
	} catch (err) {
		console.error(err);
		next(err);
	}
});

fs.readdir('uploads', (error) => {
	if (error) {
		console.error(`uploads 폴더가 존재하지 않습니다. 생성합니다.`);
		fs.mkdirSync(`uploads`);
	}
});

const upload = multer({
	storage : multer.diskStorage({
		destination(req, file, cb) {
			cb(null, `uploads/`);
		},
		filename(req, file, cb) {
			const ext = path.extname(file.originalname);
			cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
		},
	}),
	limits : { fileSize : 5*1024*1024},
});

router.post(`/room/:id/gif`, upload.single('gif'), async (req, res, next) => {
	try {
		const chat = new Chat({
			room : req.params.id,
			user : req.session.color,
			gif : req.file.filename,
		});
		await chat.save();
		req.app.get('io').of('/chat').to(req.params.id).emit(`chat`, chat);
		res.send(`ok`);
	} catch (err) {
		console.error(err);
		next(err);
	}
});

module.exports = router;