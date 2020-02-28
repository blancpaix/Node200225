const mongoose = require(`mongoose`)

module.exports = () => {
	const connect = () => {
		if (process.env.Node_ENV !== `production`) {
			mongoose.set(`debug`, true);
		}
		mongoose.connect(`mongodb://bituser:1004@localhost:27017/admin`, {
			dbName : 'nodejs'
		}, (error) => {
			if (error) {
				console.log(`mongoDB 연결 에러 : `, error);
			} else {
				console.log (`mongoDB 연결 성공.`);
			}
		});
	};

	connect();

	mongoose.connection.on(`error`, (error) => {
		console.error('몽고 디비와의 연결이 끊겼스빈다. 연결 재시도 함다');
		connect();
	});
	
	require('./user');
	require('./comment');

}