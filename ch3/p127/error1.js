setInterval(() => {
	console.log(`시작`);
	try {
		throw new Error (`서버를 박살내주마!`);

	} catch (err) {
		console.error(err);
	}
}, 1000);