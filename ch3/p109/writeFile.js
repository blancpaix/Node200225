const fs = require('fs');

fs.writeFile('./writeme.txt', '글이 입력될거여~', (err) => {
	if (err) {
		throw err;
	}

	fs.readFile('./writeme.txt', (err,data) => {
		if(err) {
			throw err;
		}

		console.log(data.toString());

	});

});