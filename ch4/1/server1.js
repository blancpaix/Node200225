const http = require(`http`);

http.createServer((req, res) => {
	res.write(`<h1>Hello Node!</h1>`);
	res.end(`<p>Hello Server!</p>`);
}).listen(8000, () => {
	console.log(`8000 번 포트 서버...`);
});